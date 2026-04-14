import React from 'react';
export interface TagProps {
    children: React.ReactNode;
    color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    closable?: boolean;
    onClose?: () => void;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Tag: React.FC<TagProps>;
