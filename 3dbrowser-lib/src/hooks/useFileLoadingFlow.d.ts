import type { RefObject } from "react";
import type { SceneManager, SceneSettings } from "../utils/SceneManager";
import type { TFunc } from "../theme/Locales";
interface FileLoadingFlowOptions {
    managerRef: RefObject<SceneManager | null>;
    sceneSettings: SceneSettings;
    libPath: string;
    t: TFunc;
    setCurrentFileSetId: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setStatus: (status: string) => void;
    setProgress: (progress: number) => void;
    setToast: (toast: {
        message: string;
        type: "success" | "error" | "info";
    } | null) => void;
    updateTree: () => void;
}
export declare function useFileLoadingFlow({ managerRef, sceneSettings, libPath, t, setCurrentFileSetId, setLoading, setStatus, setProgress, setToast, updateTree }: FileLoadingFlowOptions): {
    processFiles: (items: (File | string)[]) => Promise<void>;
    loadItemsIntoScene: (items: (File | string)[]) => Promise<void>;
};
export {};
