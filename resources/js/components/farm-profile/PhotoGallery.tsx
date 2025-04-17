import React from 'react';
import { motion } from 'framer-motion';
import { FarmPhoto } from './types';

interface PhotoGalleryProps {
    photos?: FarmPhoto[];
    photoPreview: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, photoPreview }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    return (
        <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" variants={container} initial="hidden" animate="show">
            {photos &&
                photos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden rounded-md"
                        variants={item}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                        <img
                            src={photo.file_path}
                            alt={photo.file_name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {photo.is_primary && (
                            <div className="bg-primary text-primary-foreground absolute top-2 right-2 rounded-full px-2 py-1 text-xs">Primary</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>
                ))}
            {photoPreview.map((preview, index) => (
                <motion.div
                    key={`preview-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-md"
                    variants={item}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                    <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default PhotoGallery;