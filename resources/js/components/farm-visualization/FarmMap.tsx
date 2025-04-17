import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { FarmProfile, FarmSection } from './types';

interface FarmMapProps {
    farmProfile: FarmProfile;
    sections: FarmSection[];
    totalSections: number;
    sectionsPerRow: number;
    selectedSection: FarmSection | null;
    onSelectSection: (section: FarmSection) => void;
}

const FarmMap: React.FC<FarmMapProps> = ({
    farmProfile,
    sections,
    totalSections,
    sectionsPerRow,
    selectedSection,
    onSelectSection
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Farm Map</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 overflow-x-auto" style={{
                    gridTemplateColumns: `repeat(${sectionsPerRow}, 1fr)`,
                }}>
                    {Array.from({ length: totalSections }).map((_, index) => {
                        const section = sections.find(s => s.section_number === index + 1);
                        return (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${section ? 'bg-primary/20' : 'bg-gray-100'
                                                } ${selectedSection?.id === section?.id ? 'ring-2 ring-primary' : ''
                                                }`}
                                            style={{
                                                backgroundColor: section?.color,
                                            }}
                                            onClick={() => section && onSelectSection(section)}
                                        >
                                            {section && (
                                                <div className="p-2">
                                                    <p className="text-sm font-medium">{section.name}</p>
                                                    <p className="text-xs text-gray-600">
                                                        {section.size} {farmProfile.size_unit}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {section ? (
                                            <div>
                                                <p>{section.name}</p>
                                                <p>{section.size} {farmProfile.size_unit}</p>
                                            </div>
                                        ) : (
                                            <p>Section {index + 1}</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default FarmMap;