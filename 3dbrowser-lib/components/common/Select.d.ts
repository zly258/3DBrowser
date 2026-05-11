import React from "react";
import { ValueOption } from "./types";
export type SelectOption<T extends string = string> = ValueOption<T>;
export interface SelectProps<T extends string = string> {
    value: T;
    options: Array<SelectOption<T>>;
    onChange: (value: T) => void;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    placeholder?: React.ReactNode;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyText?: string;
}
export declare function Select<T extends string = string>({ value, options, onChange, className, style, disabled, placeholder, searchable, searchPlaceholder, emptyText }: SelectProps<T>): import("react/jsx-runtime").JSX.Element;
