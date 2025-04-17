import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FarmerLayout from '@/layouts/FarmerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Loader2,
  Calendar,
  MapPin,
  ShoppingCart,
  ArrowLeft,
  MessageCircle,
  Edit,
  ExternalLink,
  Share2,
  User,
  AlertTriangle,
  ChevronsUp,
  Trash2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icons fix for Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix deprecated MouseEvent warnings in Leaflet
// This adds modern properties to MouseEvent to prevent warnings
if (typeof window !== 'undefined' && window.MouseEvent) {
    // Only patch if the properties don't already exist
    if (!('pressure' in MouseEvent.prototype)) {
        Object.defineProperty(MouseEvent.prototype, 'pressure', {
            get: function() {
                return this.mozPressure || 0;
            }
        });
    }

    if (!('pointerType' in MouseEvent.prototype)) {
        Object.defineProperty(MouseEvent.prototype, 'pointerType', {
            get: function() {
                return this.mozInputSource || '';
            }
        });
    }
}

// Fix default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface CropImages {
  id: number;
  crop_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
}

interface Farmer {
  id: number;
  name: string;
  profile_image?: string;
  farm_name: string;
}

interface Crop {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  harvest_date: string;
  status: 'available' | 'reserved' | 'sold';
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
  updated_at: string;
  image_path: string;
  images?: CropImages[];
  farmer: Farmer;
}

interface PageProps {
  crop: Crop;
  auth: {
    user: {
      id: number;
    };
  };
}

export default function Show({ crop, auth }: PageProps) {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageTopRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isOwner = auth.user.id === crop.farmer.id;
  const formattedHarvestDate = format(parseISO(crop.harvest_date), 'MMMM d, yyyy');
  const formattedCreatedDate = format(parseISO(crop.created_at), 'MMMM d, yyyy');

  // Check if coordinates are valid
  const hasValidCoordinates = useMemo(() => {
    return !(
      !crop.latitude ||
      !crop.longitude ||
      isNaN(crop.latitude) ||
      isNaN(crop.longitude) ||
      (crop.latitude === 0 && crop.longitude === 0)
    );
  }, [crop.latitude, crop.longitude]);

  // Map initialization function
  const initMap = useCallback(() => {
    if (!hasValidCoordinates || !mapContainerRef.current) return;

    try {
      // First, check if Leaflet has already initialized this container to prevent the error
      if (mapContainerRef.current.classList.contains('leaflet-container')) {
        console.log('Map already initialized, skipping');
        return null;
      }

      // Clear any previous content to be safe
      mapContainerRef.current.innerHTML = '';

      // Create new map instance
      const map = L.map(mapContainerRef.current, {
        attributionControl: true,
        zoomControl: true,
      }).setView([crop.latitude, crop.longitude], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([crop.latitude, crop.longitude])
        .addTo(map)
        .bindPopup(`<b>${crop.name}</b><br>${crop.address}`)
        .openPopup();

      // Force map to properly render
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      return null;
    }
  }, [crop.latitude, crop.longitude, crop.name, crop.address, hasValidCoordinates]);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // Initialize map when location tab is active
  useEffect(() => {
    let map: L.Map | null = null;
    let initializedAtLeastOnce = false;

    if (activeTab === 'location' && !initializedAtLeastOnce) {
      // Use a staggered approach with only one attempt to avoid multiple initializations
      const timer = setTimeout(() => {
        const newMap = initMap();
        initializedAtLeastOnce = !!newMap;
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeTab, initMap]);

  // Handle window resize - use debounce to prevent too many map recreations
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      if (activeTab === 'location') {
        // Check if map container has been initialized
        if (mapContainerRef.current?.classList.contains('leaflet-container')) {
          // Just invalidate size rather than recreating the map
          const existingMap = L.DomUtil.get(mapContainerRef.current) as any;
          if (existingMap && existingMap._leaflet_id) {
            try {
              // Get the actual map instance
              const map = (L as any).map._instances[existingMap._leaflet_id];
              if (map) {
                map.invalidateSize();
                return;
              }
            } catch (e) {
              console.error('Error accessing existing map:', e);
            }
          }
        }

        // If we get here, we couldn't access an existing map, so try to initialize
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initMap();
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [activeTab, initMap]);

  // Scroll to top function
  const scrollToTop = () => {
    pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 hover:bg-green-700 text-white'; // Bolder green
      case 'reserved':
        return 'bg-amber-600 hover:bg-amber-700 text-white'; // Bolder amber
      case 'sold':
        return 'bg-red-600 hover:bg-red-700 text-white'; // Bolder red
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white'; // Bolder gray
    }
  };

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleDeleteCrop = () => {
    setIsDeleting(true);

    router.delete(route('farmer.crops.destroy', { id: crop.id }), {
      onSuccess: () => {
        // Will be redirected automatically
      },
      onError: (errors) => {
        console.error('Error deleting crop:', errors);
        setIsDeleting(false);
        setShowDeleteDialog(false);
      },
      onFinish: () => {
        setIsDeleting(false);
      }
    });
  };

  return (
    <FarmerLayout>
      <Head title={crop.name} />

      <div className="container mx-auto min-h-199 px-4 py-8 max-w-4xl" ref={pageTopRef}>
        <div className="mb-6">
          <Link
            href={route('farmer.crops.index')}
            className="inline-flex items-center text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            aria-label="Back to Crop Marketplace"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Crop Marketplace
          </Link>
          {/*lool */}
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{crop.name}</h1>

            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <Badge className={`${getStatusColor(crop.status)} py-1 px-3`} aria-label={`Status: ${crop.status}`}>
                {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
              </Badge>

              {isOwner && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/10 focus:ring-2 focus:ring-primary/50"
                    aria-label="Edit listing"
                    onClick={() => router.get(route('farmer.crops.edit', crop.id))}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Listing
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-red-300 text-red-600 dark:border-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 focus:ring-2 focus:ring-red-500"
                    aria-label="Delete listing"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-9 border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/10 focus:ring-2 focus:ring-primary/50 relative"
                onClick={handleShareClick}
                aria-label="Share this crop listing"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
                {copiedToClipboard && (
                  <span className="absolute -bottom-8 left-0 right-0 text-xs bg-background border border-border text-foreground p-1 rounded shadow-md">
                    Copied!
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1  gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Crop Details */}
            <Tabs defaultValue="description" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-tl-lg rounded-bl-lg"
                  aria-label="Description tab"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-tr-lg rounded-br-lg"
                  aria-label="Location tab"
                >
                  Location
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card className="border border-border shadow-sm p-0">
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-foreground whitespace-pre-line leading-relaxed">{crop.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4 mt-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">Quantity Available</h3>
                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {crop.quantity} {crop.unit}
                          </p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">Price per {crop.unit}</h3>
                          <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                            ${crop.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">Harvest Date</h3>
                          <p className="mt-1 flex items-center text-foreground">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
                            <span>{formattedHarvestDate}</span>
                          </p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">Listed On</h3>
                          <p className="mt-1 text-foreground">
                            {formattedCreatedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-4">
                <Card className="border border-border shadow-sm p-0">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-foreground">{crop.address}</p>
                    </div>

                    {/* Leaflet Map - Updated */}
                    <div className="w-full h-[300px] bg-muted rounded-lg overflow-hidden border border-border relative">
                      {!hasValidCoordinates ? (
                        <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-500">
                          <MapPin className="h-8 w-8 mb-2 opacity-50" />
                          <p>No location coordinates available</p>
                        </div>
                      ) : (
                        <div
                          ref={mapContainerRef}
                          id="map-container"
                          className="w-full h-full z-10"
                          aria-label="Map showing crop location"
                        ></div>
                      )}
                    </div>

                    <div className="mt-4 bg-muted p-4 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-foreground">Coordinates</p>
                          <p className="text-gray-600 text-sm">
                            {!hasValidCoordinates ? (
                              <span>Not available</span>
                            ) : (
                              `Latitude: ${crop.latitude.toFixed(6)}, Longitude: ${crop.longitude.toFixed(6)}`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {!isOwner && <div className="space-y-6">
            {/* Farmer Profile Card */}
            <Card className="border border-border shadow-sm rounded-lg overflow-hidden p-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                    {crop.farmer.profile_image ? (
                      <img
                        src={crop.farmer.profile_image}
                        alt={`${crop.farmer.name}'s profile picture`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-2 text-gray-500" aria-hidden="true" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground">{crop.farmer.name}</h3>
                    <p className="text-sm text-gray-600">{crop.farmer.farm_name}</p>
                  </div>
                </div>


                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  onClick={() => setShowContactDialog(true)}
                  aria-label={`Contact ${crop.farmer.name}`}
                >
                  <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Contact Farmer
                </Button>

              </CardContent>
            </Card>

            {/* Purchase Card */}
            {crop.status === 'available' && (
              <Card className="border border-border shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground">${crop.price.toFixed(2)} <span className="text-sm text-gray-600 font-normal">per {crop.unit}</span></h3>
                    <p className="text-gray-600 text-sm mt-1">Total available: {crop.quantity} {crop.unit}</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                      aria-label={`Add ${crop.name} to cart`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                      Add to Cart
                    </Button>

                    <Link href={route('farmer.checkout', { crop_id: crop.id })}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                        aria-label={`Buy ${crop.name} now`}
                      >
                        Buy Now
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm border border-amber-200 dark:border-amber-800">
                    <div className="flex">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-amber-800 dark:text-amber-300 font-medium">Local Pickup Only</p>
                        <p className="text-amber-700 dark:text-amber-400 mt-1">You'll need to arrange pickup with the farmer at the specified location.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status cards for other statuses */}
            {crop.status === 'reserved' && (
              <Card className="border border-border shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6 text-center">
                  <Badge className="bg-amber-600 mb-2 text-white py-1 px-3">Reserved</Badge>
                  <p className="text-foreground">This crop has been reserved by another farmer.</p>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowContactDialog(true)}
                    aria-label={`Contact ${crop.farmer.name} about availability`}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                    Contact for Availability
                  </Button>
                </CardContent>
              </Card>
            )}

            {crop.status === 'sold' && (
              <Card className="border border-border shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6 text-center">
                  <Badge className="bg-red-600 mb-2 text-white py-1 px-3">Sold Out</Badge>
                  <p className="text-foreground">This crop has been sold and is no longer available.</p>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowContactDialog(true)}
                    aria-label={`Ask ${crop.farmer.name} about future availability`}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                    Ask About Future Availability
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>}
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Contact {crop.farmer.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Send a message to {crop.farmer.name} about their {crop.name} listing.
            </p>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder={`Hi ${crop.farmer.name}, I'm interested in your ${crop.name} listing. Is it still available?`}
              aria-label="Message to farmer"
            />

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowContactDialog(false)}
                className="border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                aria-label="Cancel sending message"
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Send message to ${crop.farmer.name}`}
              >
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Remove Crop Listing</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-gray-800">
              Are you sure you want to remove <span className="font-semibold">{crop.name}</span> from your listings?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The listing will be permanently removed.
            </p>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                disabled={isDeleting}
                aria-label="Cancel deletion"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCrop}
                className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={isDeleting}
                aria-label="Confirm deletion"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove Listing'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-opacity"
          aria-label="Scroll back to top"
        >
          <ChevronsUp className="h-5 w-5" />
        </button>
      )}
    </FarmerLayout>
  );
}
