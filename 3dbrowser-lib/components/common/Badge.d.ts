import React from "react";
import { ComponentStatus } from "./types";
export interface BadgeProps {
    count?: number | React.ReactNode;
    overflowCount?: number;
    dot?: boolean;
    showZero?: boolean;
    status?: ComponentStatus;
    text?: React.ReactNode;
    offset?: [number, number];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const Badge: React.FC<BadgeProps>;
