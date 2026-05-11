import React from "react";
import { BaseComponentProps } from "./types";
export interface CheckboxProps extends BaseComponentProps {
    label?: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    labelStyle?: React.CSSProperties;
    name?: string;
    value?: string;
}
export declare const Checkbox: React.FC<CheckboxProps>;
