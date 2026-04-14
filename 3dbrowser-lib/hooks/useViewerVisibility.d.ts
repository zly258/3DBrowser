import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { PropertyGroups } from "../viewer/propertyIndex";
interface ViewerContextMenuState {
    x: number;
    y: number;
    visible: boolean;
}
interface UseViewerVisibilityOptions {
    sceneMgrRef: MutableRefObject<SceneManager | null>;
    selectedUuids: string[];
    setSelectedUuids: Dispatch<SetStateAction<string[]>>;
    setSelectedProps: Dispatch<SetStateAction<PropertyGroups | null>>;
    updateTree: () => void;
    resetLocateState: () => void;
}
export declare function useViewerVisibility({ sceneMgrRef, selectedUuids, setSelectedUuids, setSelectedProps, updateTree, resetLocateState }: UseViewerVisibilityOptions): {
    contextMenu: ViewerContextMenuState;
    hiddenUuids: Set<string>;
    isolatedUuids: Set<string>;
    setHiddenUuids: Dispatch<SetStateAction<Set<string>>>;
    setIsolatedUuids: Dispatch<SetStateAction<Set<string>>>;
    handleContextMenu: (event: MouseEvent) => void;
    closeContextMenu: () => void;
    handleHideSelected: () => void;
    handleShowAll: () => void;
    handleToggleVisibility: (uuid: string, visible: boolean) => void;
    handleHideObject: (uuid: string) => void;
    handleIsolateObject: (uuid: string) => void;
    handleIsolateSelection: () => void;
    handleUndoVisibility: () => void;
};
export {};
