import { SceneSettings, SceneManager } from "../utils/scene-manager/SceneManager";
import { TFunc } from "../theme/locales";
import type { LoaderRuntimeHints } from "../loader/loaderUtils";
export declare function cleanLoadingStatus(message: string): string;
export declare function createFileSetId(items: (File | string)[]): string;
interface LoadSceneItemsArgs {
    items: (File | string)[];
    manager: SceneManager;
    sceneSettings: SceneSettings;
    libPath: string;
    t: TFunc;
    onProgress: (progress: number, message?: string) => void;
    runtimeHints?: LoaderRuntimeHints;
    isStale?: () => boolean;
}
export declare function loadSceneItems({ items, manager, sceneSettings, libPath, t, onProgress, runtimeHints, isStale }: LoadSceneItemsArgs): Promise<void>;
export {};
