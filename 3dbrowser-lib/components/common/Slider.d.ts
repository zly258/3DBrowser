import React from "react";
export interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    theme?: any;
    disabled?: boolean;
    style?: React.CSSProperties;
    showValue?: boolean;
    className?: string;
}
export declare const Slider: React.FC<SliderProps>;
