import React from 'react';
import { FarmProfile } from './types';

interface FarmHeaderProps {
    farmProfile: FarmProfile;
}

const FarmHeader: React.FC<FarmHeaderProps> = ({ farmProfile }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">{farmProfile.farm_name}</h1>
            <p className="text-muted-foreground">
                Total Size: {farmProfile.size} {farmProfile.size_unit}
            </p>
        </div>
    );
};

export default FarmHeader;