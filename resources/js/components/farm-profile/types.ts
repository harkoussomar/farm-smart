export interface FarmProfile {
    id: number;
    farm_name: string;
    address: string;
    latitude: string;
    longitude: string;
    size: string;
    size_unit: string;
}

export interface FarmPhoto {
    id: number;
    file_path: string;
    file_name: string;
    is_primary: boolean;
}

export interface FormData {
    farm_name: string;
    address: string;
    latitude: string;
    longitude: string;
    size: string;
    size_unit: string;
    photos: File[];
}