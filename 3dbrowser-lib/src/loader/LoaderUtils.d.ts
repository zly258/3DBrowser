import * as THREE from "three";
import { TFunc, ProgressCallback } from "../theme/Locales";
import { SceneSettings } from "../utils/SceneManager";
import type { LoadProfile } from "../utils/scene/types";
export interface LoadedItem {
    name: string;
    uuid: string;
    type: "MODEL" | "TILES";
    object?: THREE.Object3D;
}
export interface LoaderRuntimeHints {
    loadProfile?: LoadProfile;
    deferIfcProperties?: boolean;
    fastGeometrySanitize?: boolean;
    isStale?: () => boolean;
}
export declare const loadModelFiles: (files: (File | string)[], onProgress: ProgressCallback, t: TFunc, settings: SceneSettings, libPath?: string, runtimeHints?: LoaderRuntimeHints) => Promise<THREE.Object3D[]>;
