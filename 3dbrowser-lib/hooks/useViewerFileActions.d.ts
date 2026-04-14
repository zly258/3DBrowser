import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { PropertyGroups } from "../viewer/propertyIndex";
import type { ViewerToast } from "../viewer/types";
import type { ViewerTool } from "./useViewerTools";
interface UseViewerFileActionsOptions {
    sceneMgrRef: RefObject<SceneManager | null>;
    t: (key: string) => string;
    processFiles: (items: (File | string)[]) => Promise<void>;
    loadItemsIntoScene: (items: (File | string)[]) => Promise<void>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<string>>;
    setProgress: Dispatch<SetStateAction<number>>;
    setToast: Dispatch<SetStateAction<ViewerToast | null>>;
    setActiveTool: Dispatch<SetStateAction<ViewerTool>>;
    setSelectedUuids: Dispatch<SetStateAction<string[]>>;
    setSelectedProps: Dispatch<SetStateAction<PropertyGroups | null>>;
    resetMeasurementState: () => void;
    updateTree: () => void;
    isDev: boolean;
}
export declare function useViewerFileActions({ sceneMgrRef, t, processFiles, loadItemsIntoScene, setLoading, setStatus, setProgress, setToast, setActiveTool, setSelectedUuids, setSelectedProps, resetMeasurementState, updateTree, isDev }: UseViewerFileActionsOptions): {
    handleOpenFiles: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleBatchConvert: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleOpenUrl: () => Promise<void>;
    handleDragOver: (event: DragEvent) => void;
    handleDrop: (event: DragEvent) => Promise<void>;
};
export {};
