import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import FarmerLayout from '@/layouts/FarmerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvest_date: null as Date | null,
    status: 'available',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('farmer.crops.store'));
  };

  return (
    <FarmerLayout>
      <Head title="Add New Crop" />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">List a New Crop</h1>
          <p className="text-gray-500 mt-1">
            Share details about your crop to connect with potential buyers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Crop Details</CardTitle>
              <CardDescription>
                Basic information about your crop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Crop Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="e.g. Organic Tomatoes"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={data.status}
                    onValueChange={value => setData('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your crop - variety, quality, growing conditions, etc."
                  className="min-h-[120px]"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 100"
                    value={data.quantity}
                    onChange={e => setData('quantity', e.target.value)}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={data.unit}
                    onValueChange={value => setData('unit', value)}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="lb">Pound (lb)</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="crate">Crate</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.unit && (
                    <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Price per {data.unit}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 25.00"
                    value={data.price}
                    onChange={e => setData('price', e.target.value)}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div>
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
                      type="button"
                    >
                      {data.harvest_date ? (
                        format(data.harvest_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-3 z-[9999]"
                    align="center"
                    side="bottom"
                    sideOffset={8}
                  >
                    <Calendar
                      mode="single"
                      selected={data.harvest_date || undefined}
                      onSelect={(date) => {
                        console.log("Date selected:", date);
                        if (date) {
                          setData('harvest_date', date);
                          // Force popover to close after selection
                          setTimeout(() => {
                            document.body.click();
                          }, 100);
                        }
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="rounded-md border shadow-sm p-3"
                      classNames={{
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day: "rounded-md text-gray-900 dark:text-gray-100 h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700",
                        day_disabled: "text-gray-400 dark:text-gray-500 opacity-50",
                        head_cell: "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                        caption: "flex justify-center pt-1 relative items-center text-gray-900 dark:text-white",
                        caption_label: "text-sm font-medium text-gray-900 dark:text-white",
                        nav_button: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                        table: "border-collapse space-y-1 text-gray-900 dark:text-white"
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.harvest_date && (
                  <p className="text-sm text-red-500 mt-1">{errors.harvest_date}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Crop'}
            </Button>
          </div>
        </form>
      </div>
    </FarmerLayout>
  );
}