import React from "react";
export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}
export declare const InputNumber: React.FC<InputNumberProps>;
