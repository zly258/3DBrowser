import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import * as THREE from "three";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { MeasureType } from "../utils/scene-manager/types";
import type { PropertyGroups } from "../viewer/propertyIndex";
interface UseViewerCanvasInteractionsOptions {
    sceneMgrRef: MutableRefObject<SceneManager | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    activeTool: string;
    setActiveTool: Dispatch<SetStateAction<string>>;
    measureType: MeasureType;
    setMeasureType: Dispatch<SetStateAction<MeasureType>>;
    pickEnabled: boolean;
    selectedUuids: string[];
    setSelectedUuids: Dispatch<SetStateAction<string[]>>;
    setSelectedProps: Dispatch<SetStateAction<PropertyGroups | null>>;
    setMousePos: Dispatch<SetStateAction<THREE.Vector3 | null>>;
    setHighlightedMeasureId: Dispatch<SetStateAction<string | null>>;
    handleSelect: (obj: any, intersect?: THREE.Intersection | null, isMultiSelect?: boolean) => void | Promise<void>;
    handleContextMenu: (event: MouseEvent) => void;
    handleUndoVisibility: () => void;
    clearSelectionState: () => void;
}
export declare function useViewerCanvasInteractions({ sceneMgrRef, canvasRef, activeTool, setActiveTool, measureType, setMeasureType, pickEnabled, selectedUuids, setSelectedUuids, setSelectedProps, setMousePos, setHighlightedMeasureId, handleSelect, handleContextMenu, handleUndoVisibility, clearSelectionState }: UseViewerCanvasInteractionsOptions): void;
export {};
