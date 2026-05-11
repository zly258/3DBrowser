import type { Dispatch, SetStateAction } from "react";
import type { SceneManager, MeasureType, SceneSettings, MeasurementRecord } from "../utils/scene-manager/SceneManager";
export type ViewerTool = "none" | "measure" | "clip" | "settings" | "export" | "screenshot" | "viewpoint" | "search" | "boxSelect" | "explode" | "clash" | "sun";
export type ExplodeMode = "radial" | "horizontal" | "vertical";
export interface MeasureHistoryItem {
    id: string;
    type: string;
    val: string;
}
export interface ClipRangeValues {
    x: number[];
    y: number[];
    z: number[];
}
export interface ClipAxisActiveState {
    x: boolean;
    y: boolean;
    z: boolean;
}
interface UseViewerToolsOptions {
    initialSettings?: Partial<SceneSettings>;
    mgrInstance: SceneManager | null;
}
export declare function useViewerTools({ initialSettings, mgrInstance }: UseViewerToolsOptions): {
    activeTool: ViewerTool;
    setActiveTool: Dispatch<SetStateAction<ViewerTool>>;
    explodeEnabled: boolean;
    setExplodeEnabled: Dispatch<SetStateAction<boolean>>;
    explodeStrength: number;
    setExplodeStrength: Dispatch<SetStateAction<number>>;
    explodeMode: ExplodeMode;
    setExplodeMode: Dispatch<SetStateAction<ExplodeMode>>;
    resetExplodeState: () => void;
    measureType: MeasureType;
    setMeasureType: Dispatch<SetStateAction<MeasureType>>;
    measureHistory: MeasureHistoryItem[];
    setMeasureHistory: Dispatch<SetStateAction<MeasureHistoryItem[]>>;
    highlightedMeasureId: string;
    setHighlightedMeasureId: Dispatch<SetStateAction<string>>;
    resetMeasurementState: () => void;
    handleMeasureUpdate: (records: MeasurementRecord[]) => void;
    clipEnabled: boolean;
    setClipEnabled: Dispatch<SetStateAction<boolean>>;
    clipValues: ClipRangeValues;
    setClipValues: Dispatch<SetStateAction<ClipRangeValues>>;
    clipActive: ClipAxisActiveState;
    setClipActive: Dispatch<SetStateAction<ClipAxisActiveState>>;
    clipHelperVisible: boolean;
    setClipHelperVisible: Dispatch<SetStateAction<boolean>>;
    clipHelperOpacity: number;
    setClipHelperOpacity: Dispatch<SetStateAction<number>>;
};
export {};
