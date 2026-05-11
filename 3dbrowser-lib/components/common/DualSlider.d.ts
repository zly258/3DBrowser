import React from "react";
export interface DualSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    theme?: any;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
}
export declare const DualSlider: React.FC<DualSliderProps>;
