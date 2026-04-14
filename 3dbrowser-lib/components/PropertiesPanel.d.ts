import React from "react";
import { type PropertyGroups } from "../viewer/propertyIndex";
interface PropertiesPanelProps {
    t: (key: string) => string;
    selectedProps: PropertyGroups | null;
    theme: any;
}
export declare const PropertiesPanel: React.FC<PropertiesPanelProps>;
export {};
