import React from "react";
type PropertyGroups = Record<string, Record<string, string>>;
interface PropertiesPanelProps {
    t: (key: string) => string;
    selectedProps: PropertyGroups | null;
    theme: any;
}
export declare const PropertiesPanel: React.FC<PropertiesPanelProps>;
export {};
