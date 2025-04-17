import React from 'react';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;