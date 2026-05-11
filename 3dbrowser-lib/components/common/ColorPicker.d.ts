import React from "react";
import { BaseComponentProps } from "./types";
export interface ColorPickerProps extends BaseComponentProps {
    value: string;
    onChange: (value: string) => void;
    showValue?: boolean;
}
export declare const ColorPicker: React.FC<ColorPickerProps>;
