import React from "react";
import { ComponentSize, ComponentVariant } from "./types";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ComponentVariant;
    size?: ComponentSize;
    active?: boolean;
    theme?: any;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
