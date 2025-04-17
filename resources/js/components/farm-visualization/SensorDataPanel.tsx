import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FarmSection, HistoricalDataPoint } from './types';

interface SensorDataPanelProps {
    selectedSection: FarmSection | null;
    onGenerateSampleData: (sectionId: number) => void;
    timeRange: string;
    onTimeRangeChange: (value: string) => void;
    historicalData: HistoricalDataPoint[];
    isLoading: boolean;
}

const SensorDataPanel: React.FC<SensorDataPanelProps> = ({
    selectedSection,
    onGenerateSampleData,
    timeRange,
    onTimeRangeChange,
    historicalData,
    isLoading
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sensor Data</CardTitle>
            </CardHeader>
            <CardContent>
                {selectedSection ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">{selectedSection.name}</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onGenerateSampleData(selectedSection.id)}
                            >
                                Generate Sample Data
                            </Button>
                        </div>

                        <Tabs defaultValue="current">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="current">Current</TabsTrigger>
                                <TabsTrigger value="historical">Historical</TabsTrigger>
                            </TabsList>
                            <TabsContent value="current">
                                {selectedSection.sensorData ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Air Temperature</p>
                                                <p className="text-lg font-medium">
                                                    {selectedSection.sensorData.temperature_air}°C
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Soil Temperature</p>
                                                <p className="text-lg font-medium">
                                                    {selectedSection.sensorData.temperature_soil}°C
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Air Humidity</p>
                                                <p className="text-lg font-medium">
                                                    {selectedSection.sensorData.humidity_air}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Soil Moisture</p>
                                                <p className="text-lg font-medium">
                                                    {selectedSection.sensorData.soil_moisture}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <p className="text-xs text-gray-500">
                                                Last updated: {new Date(selectedSection.sensorData.recorded_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No sensor data available</p>
                                )}
                            </TabsContent>
                            <TabsContent value="historical">
                                <div className="space-y-4">
                                    <Select value={timeRange} onValueChange={onTimeRangeChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                                            <SelectItem value="7d">Last 7 Days</SelectItem>
                                            <SelectItem value="30d">Last 30 Days</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {isLoading ? (
                                        <p>Loading historical data...</p>
                                    ) : historicalData.length > 0 ? (
                                        <div className="space-y-2">
                                            {historicalData.map((data, index) => (
                                                <div key={index} className="p-2 border rounded">
                                                    <p className="text-sm">
                                                        {new Date(data.recorded_at).toLocaleString()}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Badge variant="outline">
                                                            Temp: {data.temperature_air}°C
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            Hum: {data.humidity_air}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No historical data available</p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <p className="text-gray-500">Select a section to view sensor data</p>
                )}
            </CardContent>
        </Card>
    );
};

export default SensorDataPanel;