import React from 'react';
export interface BadgeProps {
    count?: number | React.ReactNode;
    overflowCount?: number;
    dot?: boolean;
    showZero?: boolean;
    status?: 'success' | 'error' | 'default' | 'processing' | 'warning';
    text?: React.ReactNode;
    offset?: [number, number];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const Badge: React.FC<BadgeProps>;
