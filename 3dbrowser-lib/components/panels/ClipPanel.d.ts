import React from "react";
interface ClipPanelProps {
    t: any;
    onClose?: () => void;
    sceneMgr?: any;
    clipEnabled: boolean;
    setClipEnabled: any;
    clipValues: any;
    setClipValues: any;
    clipActive: any;
    setClipActive: any;
    clipHelperVisible: boolean;
    setClipHelperVisible: (visible: boolean) => void;
    clipHelperOpacity: number;
    setClipHelperOpacity: (opacity: number) => void;
    theme?: any;
}
export declare const ClipPanel: React.FC<ClipPanelProps>;
export {};
