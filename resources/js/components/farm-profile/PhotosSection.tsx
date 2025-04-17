import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import InputError from '../../components/input-error';
import AnimatedCard from './AnimatedCard';
import SectionHeading from './SectionHeading';
import PhotoGallery from './PhotoGallery';
import { CameraIcon } from './IconComponents';
import { FarmPhoto } from './types';

interface PhotosSectionProps {
    farmPhotos?: FarmPhoto[];
    photoPreview: string[];
    onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Record<string, string>;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({
    farmPhotos,
    photoPreview,
    onPhotoChange,
    errors
}) => {
    return (
        <AnimatedCard className="p-6" delay={0.2}>
            <SectionHeading
                icon={<CameraIcon />}
                title="Farm Photos (Optional)"
                subtitle="Showcase your farm with beautiful images"
                delay={0.3}
            />

            <div className="space-y-6">
                {(farmPhotos && farmPhotos.length > 0) || photoPreview.length > 0 ? (
                    <PhotoGallery photos={farmPhotos} photoPreview={photoPreview} />
                ) : (
                    <motion.div
                        className="text-center py-8 text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        No photos yet. Add some to showcase your farm!
                    </motion.div>
                )}

                <motion.div
                    className="mt-8 space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Label htmlFor="photos" className="flex items-center gap-2">
                        <CameraIcon className="h-5 w-5" /> Upload Photos
                    </Label>
                    <div className="group border-muted-foreground/20 hover:border-primary/50 relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                        <Input
                            id="photos"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onPhotoChange}
                            className="absolute inset-0 cursor-pointer opacity-0"
                        />
                        <div className="text-center">
                            <p className="text-muted-foreground group-hover:text-primary font-medium transition-colors">
                                Drag photos here or click to browse
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">Accepted formats: JPG, PNG, GIF</p>
                        </div>
                    </div>
                    {errors.photos && <InputError message={errors.photos} />}
                </motion.div>
            </div>
        </AnimatedCard>
    );
};

export default PhotosSection;