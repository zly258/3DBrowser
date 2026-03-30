import React from "react";
interface ScreenshotPanelProps {
    t: any;
    onClose?: () => void;
    onCapture: (mode: 'scene' | 'transparent') => void;
    theme: any;
}
export declare const ScreenshotPanel: React.FC<ScreenshotPanelProps>;
export {};
