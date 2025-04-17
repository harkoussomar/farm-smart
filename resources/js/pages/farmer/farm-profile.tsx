import { Head, useForm } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Icons fix for Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import FarmerLayout from '../../layouts/FarmerLayout';

// Import Components
import BasicInfoSection from '../../components/farm-profile/BasicInfoSection';
import PhotosSection from '../../components/farm-profile/PhotosSection';
import ProfileHeader from '../../components/farm-profile/ProfileHeader';
import SectionTabs from '../../components/farm-profile/SectionTabs';

// Import Types
import { FarmPhoto, FarmProfile } from '../../components/farm-profile/types';

// Fix deprecated MouseEvent warnings in Leaflet
// This adds modern properties to MouseEvent to prevent warnings
if (typeof window !== 'undefined' && window.MouseEvent) {
    // Only patch if the properties don't already exist
    if (!('pressure' in MouseEvent.prototype)) {
        Object.defineProperty(MouseEvent.prototype, 'pressure', {
            get: function () {
                // Use PointerEvent.pressure if available or return a default value
                return this.pointerType !== undefined ? 0 : 0;
            },
        });
    }

    if (!('pointerType' in MouseEvent.prototype)) {
        Object.defineProperty(MouseEvent.prototype, 'pointerType', {
            get: function () {
                // Return empty string as default pointerType value
                return '';
            },
        });
    }
}

// Fix default icon issue for Leaflet
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface FarmProfileProps {
    farmProfile?: FarmProfile;
    farmPhotos?: FarmPhoto[];
}

const FarmProfilePage = ({ farmProfile, farmPhotos }: FarmProfileProps) => {
    const { data, setData, post, put, processing, errors } = useForm({
        farm_name: farmProfile?.farm_name || '',
        address: farmProfile?.address || '',
        latitude: farmProfile?.latitude || '',
        longitude: farmProfile?.longitude || '',
        size: farmProfile?.size || '',
        size_unit: farmProfile?.size_unit || 'hectares',
        photos: [] as File[],
    });

    const [photoPreview, setPhotoPreview] = useState<string[]>([]);
    const [activeSection, setActiveSection] = useState('basic');
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [isMapUpdating, setIsMapUpdating] = useState(false);

    // Check if coordinates are valid
    const hasValidCoordinates = useMemo(() => {
        if (!data.latitude || !data.longitude) return false;

        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);

        return !(isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0));
    }, [data.latitude, data.longitude]);

    // Clean up any existing map
    const cleanupMap = useCallback(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    }, []);

    // Map initialization function
    const initMap = useCallback(() => {
        if (!hasValidCoordinates || !mapContainerRef.current) return null;

        try {
            // If we already have a map instance, just update it
            if (mapInstanceRef.current) {
                setIsMapUpdating(true);
                const farmLocation: L.LatLngTuple = [parseFloat(data.latitude), parseFloat(data.longitude)];

                // Update view with animation
                mapInstanceRef.current.setView(farmLocation, 13, {
                    animate: true,
                    duration: 0.5,
                });

                // Update existing marker or create a new one
                let markerExists = false;
                mapInstanceRef.current.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        layer.setLatLng(farmLocation);
                        markerExists = true;
                    }
                });

                if (!markerExists) {
                    const markerInstance = L.marker(farmLocation, { draggable: true }).addTo(mapInstanceRef.current);

                    // Add drag event listener
                    markerInstance.on('dragend', function () {
                        const position = markerInstance.getLatLng();
                        setData('latitude', position.lat.toString());
                        setData('longitude', position.lng.toString());
                        // Update address automatically
                        updateAddressFromCoordinates(position.lat, position.lng);
                    });
                }

                // Make sure the map is properly sized
                mapInstanceRef.current.invalidateSize();
                setTimeout(() => setIsMapUpdating(false), 300);

                return mapInstanceRef.current;
            }

            // Set loading state
            setIsMapUpdating(true);

            // Clean up any existing map first
            cleanupMap();

            // Clear any previous content to be safe
            if (mapContainerRef.current) {
                mapContainerRef.current.innerHTML = '';
            }

            const farmLocation: L.LatLngTuple = [parseFloat(data.latitude), parseFloat(data.longitude)];

            // Create map instance with fade-in transition
            const mapInstance = L.map(mapContainerRef.current, {
                attributionControl: true,
                zoomControl: true,
                preferCanvas: true, // Use Canvas renderer for better performance
                fadeAnimation: true, // Enable fade animations
                zoomAnimation: true, // Enable zoom animations
            }).setView(farmLocation, 13);

            // Add tile layer (using OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapInstance);

            // Add marker if coordinates exist
            const markerInstance = L.marker(farmLocation, { draggable: true }).addTo(mapInstance);

            // Update coordinates when marker is dragged
            markerInstance.on('dragend', function () {
                const position = markerInstance.getLatLng();
                setData('latitude', position.lat.toString());
                setData('longitude', position.lng.toString());
                // Update address automatically
                updateAddressFromCoordinates(position.lat, position.lng);
            });

            // Add click event to map to place/move marker
            mapInstance.on('click', function (e) {
                const clickedLocation = e.latlng;
                setData('latitude', clickedLocation.lat.toString());
                setData('longitude', clickedLocation.lng.toString());
                // Update marker position
                markerInstance.setLatLng(clickedLocation);
                // Update address automatically
                updateAddressFromCoordinates(clickedLocation.lat, clickedLocation.lng);
            });

            // Force map to properly render and hide loading state when ready
            mapInstance.on('load', () => {
                setTimeout(() => setIsMapUpdating(false), 300);
            });

            setTimeout(() => {
                mapInstance.invalidateSize();
                // Ensure loading state is removed even if load event doesn't fire
                setIsMapUpdating(false);
            }, 500);

            // Store the map instance for later cleanup
            mapInstanceRef.current = mapInstance;

            return mapInstance;
        } catch (error) {
            console.error('Error initializing map:', error);
            setIsMapUpdating(false);
            return null;
        }
    }, [data.latitude, data.longitude, hasValidCoordinates, setData, cleanupMap]);

    // Effect to handle map initialization and cleanup
    useEffect(() => {
        if (activeSection === 'basic' && hasValidCoordinates) {
            // Initialize map with a slight delay to ensure container is ready
            const timer = setTimeout(() => {
                initMap();
            }, 300);

            return () => {
                clearTimeout(timer);
                cleanupMap();
            };
        }

        return () => {
            cleanupMap();
        };
    }, [activeSection, hasValidCoordinates, initMap, cleanupMap]);

    // Handle window resize to refresh the map
    useEffect(() => {
        const handleResize = () => {
            if (hasValidCoordinates && mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [hasValidCoordinates]);

    // Update coordinates from reverse geocoding
    const updateAddressFromCoordinates = async (lat: number, lng: number) => {
        try {
            // Show loading indicator or disable UI elements here if needed
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
                setData('address', data.display_name);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    // Get current location from browser
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsMapUpdating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setData('latitude', latitude.toString());
                    setData('longitude', longitude.toString());

                    // Update address automatically
                    updateAddressFromCoordinates(latitude, longitude);

                    // Update existing map if it exists instead of reinitializing
                    if (mapInstanceRef.current) {
                        const newLocation: L.LatLngTuple = [latitude, longitude];
                        // Find and update the marker position
                        mapInstanceRef.current.eachLayer((layer) => {
                            if (layer instanceof L.Marker) {
                                layer.setLatLng(newLocation);
                            }
                        });
                        // Update map view without reloading tiles
                        mapInstanceRef.current.setView(newLocation, mapInstanceRef.current.getZoom(), {
                            animate: true,
                            duration: 0.5,
                        });
                        setTimeout(() => setIsMapUpdating(false), 300);
                    } else {
                        // Initialize map if it doesn't exist
                        setTimeout(() => {
                            initMap();
                            setIsMapUpdating(false);
                        }, 100);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsMapUpdating(false);
                },
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    // Lookup address from coordinates
    const lookupAddressFromCoordinates = () => {
        if (hasValidCoordinates) {
            updateAddressFromCoordinates(parseFloat(data.latitude), parseFloat(data.longitude));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Log the form data for debugging
        console.log('Form data being submitted:', data);

        if (farmProfile) {
            put(`/farmer/farm-profile/${farmProfile.id}`, {
                onSuccess: () => {
                    console.log('Farm profile updated successfully');
                    window.location.href = '/farmer/farm-profile';
                },
                onError: (errors) => {
                    console.error('Error updating farm profile:', errors);
                },
            });
        } else {
            post('/farmer/farm-profile', {
                onSuccess: () => {
                    console.log('Farm profile created successfully');
                    window.location.href = '/farmer/farm-profile';
                },
                onError: (errors) => {
                    console.error('Error creating farm profile:', errors);
                },
            });
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPhotos = [...data.photos];
            const newPreviews = [...photoPreview];

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                newPhotos.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }

            setData('photos', newPhotos);
            setPhotoPreview(newPreviews);
        }
    };

    // Handle section change
    const handleSectionChange = (section: string) => {
        setActiveSection(section);

        // If changing to basic section, ensure map is initialized after a short delay
        if (section === 'basic' && hasValidCoordinates) {
            setTimeout(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                } else {
                    initMap();
                }
            }, 300);
        }
    };

    return (
        <FarmerLayout>
            <Head title="Farm Profile" />

            <div className="container mx-auto min-h-199 px-4 py-8">
                <ProfileHeader farmName={data.farm_name} isEditing={!!farmProfile} opacity={opacity} />

                <SectionTabs activeSection={activeSection} onSectionChange={handleSectionChange} />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    {activeSection === 'basic' && (
                        <BasicInfoSection
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            hasValidCoordinates={hasValidCoordinates}
                            getCurrentLocation={getCurrentLocation}
                            mapContainerRef={mapContainerRef}
                            initMap={initMap}
                            isMapUpdating={isMapUpdating}
                        />
                    )}

                    {/* Photos Section */}
                    {activeSection === 'photos' && (
                        <PhotosSection farmPhotos={farmPhotos} photoPreview={photoPreview} onPhotoChange={handlePhotoChange} errors={errors} />
                    )}

                    <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button type="submit" disabled={processing} className="group relative overflow-hidden">
                            <span className="relative z-10">{farmProfile ? 'Update Farm Profile' : 'Create Farm Profile'}</span>
                            <motion.div
                                className="bg-primary-foreground/10 absolute inset-0"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '0%' }}
                                transition={{ duration: 0.4 }}
                            />
                        </Button>
                    </motion.div>
                </form>
            </div>
        </FarmerLayout>
    );
};

export default FarmProfilePage;
