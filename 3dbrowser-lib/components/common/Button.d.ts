import React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'default';
    size?: 'sm' | 'md' | 'lg';
    active?: boolean;
    theme?: any;
}
export declare const Button: React.FC<ButtonProps>;
