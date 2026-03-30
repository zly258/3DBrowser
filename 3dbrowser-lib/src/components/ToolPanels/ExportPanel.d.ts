import React from "react";
interface ExportPanelProps {
    t: any;
    onClose?: () => void;
    onExport: (format: string, fileName: string) => void;
    getDefaultFileName: (format: string) => string;
    theme: any;
}
export declare const ExportPanel: React.FC<ExportPanelProps>;
export {};
