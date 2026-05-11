import React from "react";
export interface PanelSectionProps {
    title?: React.ReactNode;
    children?: React.ReactNode;
    theme?: any;
    style?: React.CSSProperties;
    className?: string;
}
export declare const PanelSection: React.FC<PanelSectionProps>;
