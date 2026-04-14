export type GhostMode = "visible-first" | "all";
export type PerformancePreset = "balanced" | "smooth" | "quality";
export type LoadProfile = "max-speed" | "balanced";
export interface SceneChunkOptions {
    chunkReadCacheSize?: number;
    chunkPrefetchWindow?: number;
    ghostMode?: GhostMode;
    targetMinFps?: number;
    loadProfile?: LoadProfile;
    deferIfcProperties?: boolean;
    preferWorkerOctree?: boolean;
    fastGeometrySanitize?: boolean;
}
export interface SceneManagerOptions {
    performancePreset?: PerformancePreset;
    chunkOptions?: SceneChunkOptions;
}
export interface ResolvedSceneChunkOptions {
    chunkReadCacheSize: number;
    chunkPrefetchWindow: number;
    ghostMode: GhostMode;
    targetMinFps: number;
    loadProfile: LoadProfile;
    deferIfcProperties: boolean;
    preferWorkerOctree: boolean;
    fastGeometrySanitize: boolean;
}
export declare const DEFAULT_SCENE_CHUNK_OPTIONS: ResolvedSceneChunkOptions;
export declare function resolveSceneChunkOptions(options?: SceneChunkOptions): ResolvedSceneChunkOptions;
