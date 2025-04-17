import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AnimatedCard from './AnimatedCard';
import { MapPinIcon } from './IconComponents';
import SectionHeading from './SectionHeading';
import { FormData } from './types';

interface BasicInfoSectionProps {
    data: FormData;
    setData: (key: string, value: string) => void;
    errors: Record<string, string>;
    processing: boolean;
    hasValidCoordinates: boolean;
    getCurrentLocation: () => void;
    mapContainerRef: React.RefObject<HTMLDivElement>;
    initMap: () => L.Map | null;
    isMapUpdating?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    data,
    setData,
    errors,
    processing,
    hasValidCoordinates,
    getCurrentLocation,
    mapContainerRef,
    initMap,
    isMapUpdating = false,
}) => {
    // Initialize map when component loads
    useEffect(() => {
        // We'll let the parent component handle map initialization
        // through the useEffect in farm-profile.tsx
    }, []);

    return (
        <AnimatedCard className="px-6 overflow-hidden" delay={0.2}>
            <SectionHeading icon={<MapPinIcon />} title="Basic Information" subtitle="Tell us about your farm" delay={0.3} />

            <motion.div className="grid gap-6 sm:grid-cols-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="space-y-2">
                    <Label htmlFor="farm_name">Farm Name</Label>
                    <Input
                        id="farm_name"
                        value={data.farm_name}
                        onChange={(e) => setData('farm_name', e.target.value)}
                        required
                        className="transition-all duration-300 focus:ring-4"
                    />
                    {errors.farm_name && <InputError message={errors.farm_name} />}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        required
                        className="transition-all duration-300 focus:ring-4"
                    />
                    {errors.address && <InputError message={errors.address} />}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                        id="latitude"
                        value={data.latitude}
                        onChange={(e) => setData('latitude', e.target.value)}
                        required
                        className="transition-all duration-300 focus:ring-4"
                    />
                    {errors.latitude && <InputError message={errors.latitude} />}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                        id="longitude"
                        value={data.longitude}
                        onChange={(e) => setData('longitude', e.target.value)}
                        required
                        className="transition-all duration-300 focus:ring-4"
                    />
                    {errors.longitude && <InputError message={errors.longitude} />}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="size">Farm Size</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="size"
                            value={data.size}
                            onChange={(e) => setData('size', e.target.value)}
                            required
                            className="transition-all duration-300 focus:ring-4"
                            type="number"
                            min="0"
                            step="0.01"
                        />
                        <Select value={data.size_unit} onValueChange={(value) => setData('size_unit', value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hectares">Hectares</SelectItem>
                                <SelectItem value="acres">Acres</SelectItem>
                                <SelectItem value="sq_meters">Sq. Meters</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {errors.size && <InputError message={errors.size} />}
                </div>
            </motion.div>

            <SectionHeading icon={<MapPinIcon />} title="Farm Location" subtitle="Locate your farm on the map" delay={0.5} />

            <div className="relative h-[300px] w-full overflow-hidden rounded-lg border bg-gray-50">
                {!hasValidCoordinates ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <MapPinIcon />
                        <p className="mt-2">No location coordinates available</p>
                        <Button onClick={getCurrentLocation} variant="outline" className="mt-2" disabled={processing}>
                            Get Current Location
                        </Button>
                    </div>
                ) : (
                    <>
                        <div
                            ref={mapContainerRef}
                            id="map-container"
                            className="z-10 w-full h-full rounded-lg"
                            aria-label="Map showing farm location"
                        ></div>

                        {/* Map loading overlay */}
                        {isMapUpdating && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 border-4 rounded-full border-primary animate-spin border-t-transparent"></div>
                                    <p className="mt-2 text-sm text-muted-foreground">Updating map...</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AnimatedCard>
    );
};

export default BasicInfoSection;
