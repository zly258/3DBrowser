import React from "react";
export interface TooltipProps {
    children: React.ReactNode;
    title: React.ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    className?: string;
    style?: React.CSSProperties;
}
export declare const Tooltip: React.FC<TooltipProps>;
