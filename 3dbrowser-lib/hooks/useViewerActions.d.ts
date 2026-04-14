import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { PropertyGroups } from "../viewer/propertyIndex";
import type { ViewerConfirmState, ViewerToast } from "../viewer/types";
import type { ViewerTool } from "./useViewerTools";
interface UseViewerActionsOptions {
    sceneMgrRef: RefObject<SceneManager | null>;
    t: (key: string) => string;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setProgress: Dispatch<SetStateAction<number>>;
    setStatus: Dispatch<SetStateAction<string>>;
    setToast: Dispatch<SetStateAction<ViewerToast | null>>;
    setActiveTool: Dispatch<SetStateAction<ViewerTool>>;
    setConfirmState: Dispatch<SetStateAction<ViewerConfirmState>>;
    setSelectedUuids: Dispatch<SetStateAction<string[]>>;
    setSelectedProps: Dispatch<SetStateAction<PropertyGroups | null>>;
    setChunkProgress: Dispatch<SetStateAction<{
        loaded: number;
        total: number;
    }>>;
    resetLocateState: () => void;
    clearSearchResult: () => void;
    resetClashState: () => void;
    resetMeasurementState: () => void;
    resetExplodeState: () => void;
    updateTree: () => void;
    ifcPropertyCacheRef: MutableRefObject<Map<string, Record<string, unknown>>>;
    completedFileSetsRef: MutableRefObject<Set<string>>;
}
export declare function useViewerActions({ sceneMgrRef, t, setLoading, setProgress, setStatus, setToast, setActiveTool, setConfirmState, setSelectedUuids, setSelectedProps, setChunkProgress, resetLocateState, clearSearchResult, resetClashState, resetMeasurementState, resetExplodeState, updateTree, ifcPropertyCacheRef, completedFileSetsRef }: UseViewerActionsOptions): {
    getDefaultExportFileName: (format: string) => string;
    handleExport: (format: string, requestedName: string) => Promise<void>;
    handleClear: () => Promise<void>;
    handleScreenshot: (mode?: "scene" | "transparent") => void;
};
export {};
