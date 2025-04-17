import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { FarmProfile } from './types';

interface ProfileHeaderProps {
    farmName: string;
    isEditing: boolean;
    opacity: MotionValue<number>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ farmName, isEditing, opacity }) => {
    return (
        <motion.div
            className="mb-8"
            style={{ opacity }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {isEditing ? (
                    <>
                        <span className="text-primary">{farmName}</span> Profile
                    </>
                ) : (
                    'Create Farm Profile'
                )}
            </motion.h1>
            <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {isEditing
                    ? 'Update your farm information and showcase your agricultural enterprise'
                    : 'Set up your farm information and start managing your agricultural enterprise'}
            </motion.p>
        </motion.div>
    );
};

export default ProfileHeader;