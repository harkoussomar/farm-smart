export interface SensorData {
    temperature_air: number;
    temperature_soil: number;
    humidity_air: number;
    soil_moisture: number;
    rainfall: number;
    light_intensity: number;
    light_duration: number;
    wind_speed: number;
    wind_direction: number;
    co2_level: number;
    soil_ph: number;
    water_ph: number;
    recorded_at: string;
}

export interface FarmProfile {
    id: number;
    farm_name: string;
    size: number;
    size_unit: string;
}

export interface FarmSection {
    id: number;
    name: string;
    size: number;
    coordinates: number[];
    color: string;
    section_number: number;
    sensorData?: SensorData;
}

export interface HistoricalDataPoint extends SensorData {
    id?: number;
    section_id?: number;
}