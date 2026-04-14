import React from "react";
import type { ViewpointRecord, ViewpointSaveOptions } from "../../viewer/types";
interface ViewpointPanelProps {
    t: any;
    onClose?: () => void;
    viewpoints: ViewpointRecord[];
    onSave: (name: string, options: ViewpointSaveOptions, replaceId?: string) => void;
    onUpdateName: (id: string, name: string) => void;
    onLoad: (viewpoint: ViewpointRecord) => void;
    onDelete: (id: string) => void;
    onOverwrite: (id: string) => void;
    theme: any;
}
export declare const ViewpointPanel: React.FC<ViewpointPanelProps>;
export {};
