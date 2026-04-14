import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { ViewpointRecord, ViewpointSaveOptions, ViewpointStateSnapshot, ViewerConfirmState, ViewerToast } from "../viewer/types";
interface UseViewpointsOptions {
    currentFileSetId: string;
    sceneMgrRef: RefObject<SceneManager | null>;
    setToast: Dispatch<SetStateAction<ViewerToast | null>>;
    setConfirmState: Dispatch<SetStateAction<ViewerConfirmState>>;
    t: (key: string) => string;
    captureStateSnapshot: (options: ViewpointSaveOptions) => ViewpointStateSnapshot;
    restoreStateSnapshot: (snapshot?: ViewpointStateSnapshot) => Promise<void> | void;
}
export declare function useViewpoints({ currentFileSetId, sceneMgrRef, setToast, setConfirmState, t, captureStateSnapshot, restoreStateSnapshot }: UseViewpointsOptions): {
    viewpoints: ViewpointRecord[];
    handleSaveViewpoint: (customName?: string, saveOptions?: ViewpointSaveOptions, replaceId?: string) => void;
    handleUpdateViewpointName: (id: string, newName: string) => void;
    handleLoadViewpoint: (viewpoint: ViewpointRecord) => Promise<void>;
    handleOverwriteViewpoint: (id: string) => void;
    handleDeleteViewpoint: (id: string) => void;
};
export {};
