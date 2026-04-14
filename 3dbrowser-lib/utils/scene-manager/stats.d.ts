import type * as THREE from "three";
import type { SceneManagerStats } from "./types";
interface SceneManagerStatsContext {
    renderer: THREE.WebGLRenderer;
    contentGroup: THREE.Group;
    originalStats: {
        meshes: number;
        faces: number;
        memory: number;
    };
    chunkLoadedCount: number;
    chunksLength: number;
    processingChunkCount: number;
    activePixelRatio: number;
}
export declare function collectSceneManagerStats(context: SceneManagerStatsContext): SceneManagerStats;
export {};
