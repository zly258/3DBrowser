import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { ViewerErrorState, ViewerToast } from "../viewer/types";
interface UseViewportLifecycleOptions {
    allowDragOpen: boolean;
    mgrInstance: SceneManager | null;
    viewportRef: RefObject<HTMLDivElement | null>;
    t: (key: string) => string;
    processFiles: (items: (string | File)[]) => Promise<void>;
    setToast: Dispatch<SetStateAction<ViewerToast | null>>;
    setErrorState: Dispatch<SetStateAction<ViewerErrorState>>;
}
export declare function useViewportLifecycle({ allowDragOpen, mgrInstance, viewportRef, t, processFiles, setToast, setErrorState }: UseViewportLifecycleOptions): void;
export {};
