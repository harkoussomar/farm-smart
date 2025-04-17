import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface Option {
    value: string;
    label: string;
}

interface SelectInputProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SelectInput({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    className,
    disabled
}: SelectInputProps) {
    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}