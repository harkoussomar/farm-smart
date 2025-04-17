import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import FarmerLayout from '../../layouts/FarmerLayout';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Import the new components
import FarmHeader from '../../components/farm-visualization/FarmHeader';
import FarmMap from '../../components/farm-visualization/FarmMap';
import SensorDataPanel from '../../components/farm-visualization/SensorDataPanel';

// Import types
import { FarmProfile, FarmSection, HistoricalDataPoint } from '../../components/farm-visualization/types';

interface Props {
    farmProfile: FarmProfile;
    sections: FarmSection[];
    totalSections: number;
    sectionsPerRow: number;
    error?: string;
}

const FarmVisualization: React.FC<Props> = ({ farmProfile, sections, totalSections, sectionsPerRow, error }) => {
    const [selectedSection, setSelectedSection] = useState<FarmSection | null>(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedSection) {
            fetchHistoricalData(selectedSection.id);
        }
    }, [selectedSection, timeRange]);

    const fetchHistoricalData = async (sectionId: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/farm-sections/${sectionId}/historical-data?time_range=${timeRange}`);
            const data = await response.json();
            setHistoricalData(data.historicalData);
        } catch (error) {
            console.error('Error fetching historical data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateSampleData = async (sectionId: number) => {
        try {
            const response = await fetch(`/api/farm-sections/${sectionId}/generate-sample-data`, {
                method: 'POST',
            });
            const data = await response.json();
            // Refresh the section data
            if (selectedSection?.id === sectionId) {
                const updatedSection = { ...selectedSection, sensorData: data.sensorData };
                setSelectedSection(updatedSection);
            }
        } catch (error) {
            console.error('Error generating sample data:', error);
        }
    };

    if (error) {
        return (
            <FarmerLayout>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </FarmerLayout>
        );
    }

    return (
        <FarmerLayout>
            <Head title="Farm Visualization" />
            <div className="container mx-auto px-4 py-8">
                <FarmHeader farmProfile={farmProfile} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Farm Map */}
                    <div className="lg:col-span-2">
                        <FarmMap
                            farmProfile={farmProfile}
                            sections={sections}
                            totalSections={totalSections}
                            sectionsPerRow={sectionsPerRow}
                            selectedSection={selectedSection}
                            onSelectSection={setSelectedSection}
                        />
                    </div>

                    {/* Sensor Data */}
                    <div>
                        <SensorDataPanel
                            selectedSection={selectedSection}
                            onGenerateSampleData={generateSampleData}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            historicalData={historicalData}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
};

export default FarmVisualization;