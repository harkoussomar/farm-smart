import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import FarmerLayout from '@/layouts/FarmerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SelectInput } from '@/components/SelectInput';
import { Link } from '@inertiajs/react';

interface Crop {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    price: number;
    harvest_date: string;
    status: 'available' | 'reserved' | 'sold';
    latitude: number | null;
    longitude: number | null;
    address: string;
}

interface PageProps {
    crop: Crop;
}

export default function Edit({ crop }: PageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: crop.name || '',
        description: crop.description || '',
        quantity: crop.quantity || 0,
        unit: crop.unit || '',
        price: crop.price || 0,
        harvest_date: crop.harvest_date ? new Date(crop.harvest_date) : new Date(),
        status: crop.status || 'available',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(route('farmer.crops.update', crop.id));
    }

    return (
        <FarmerLayout>
            <Head title="Edit Crop Listing" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href={route('farmer.crops.show', crop.id)}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to crop details
                    </Link>

                    <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        Edit Crop Listing
                    </h1>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Crop Details</CardTitle>
                                <CardDescription>
                                    Update information about your crop
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Crop Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="E.g., Organic Tomatoes"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && (
                                            <p className="text-sm font-medium text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Enter details about your crop..."
                                            className="min-h-[100px]"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                        />
                                        {errors.description && (
                                            <p className="text-sm font-medium text-destructive">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                placeholder="E.g., 10"
                                                value={data.quantity}
                                                onChange={e => setData('quantity', parseFloat(e.target.value))}
                                            />
                                            {errors.quantity && (
                                                <p className="text-sm font-medium text-destructive">{errors.quantity}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="unit">Unit</Label>
                                            <SelectInput
                                                value={data.unit}
                                                onChange={value => setData('unit', value)}
                                                options={[
                                                    { value: 'kg', label: 'Kilograms (kg)' },
                                                    { value: 'g', label: 'Grams (g)' },
                                                    { value: 'lb', label: 'Pounds (lb)' },
                                                    { value: 'tons', label: 'Tons' },
                                                    { value: 'pieces', label: 'Pieces' },
                                                    { value: 'bunches', label: 'Bunches' },
                                                    { value: 'boxes', label: 'Boxes' },
                                                    { value: 'bags', label: 'Bags' },
                                                ]}
                                                placeholder="Select unit"
                                            />
                                            {errors.unit && (
                                                <p className="text-sm font-medium text-destructive">{errors.unit}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price per unit (INR)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                placeholder="E.g., 299.99"
                                                value={data.price}
                                                onChange={e => setData('price', parseFloat(e.target.value))}
                                            />
                                            {errors.price && (
                                                <p className="text-sm font-medium text-destructive">{errors.price}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="harvest_date">Harvest Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="harvest_date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !data.harvest_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {data.harvest_date ? (
                                                            format(data.harvest_date, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={data.harvest_date}
                                                        onSelect={(date) => setData('harvest_date', date || new Date())}
                                                        disabled={(date) => date < new Date("1900-01-01")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.harvest_date && (
                                                <p className="text-sm font-medium text-destructive">{errors.harvest_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <SelectInput
                                            value={data.status}
                                            onChange={value => setData('status', value)}
                                            options={[
                                                { value: 'available', label: 'Available' },
                                                { value: 'reserved', label: 'Reserved' },
                                                { value: 'sold', label: 'Sold' },
                                            ]}
                                            placeholder="Select status"
                                        />
                                        {errors.status && (
                                            <p className="text-sm font-medium text-destructive">{errors.status}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Set to Available to list in marketplace
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link href={route('farmer.crops.show', crop.id)}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Crop'}
                        </Button>
                    </div>
                </form>
            </div>
        </FarmerLayout>
    );
}