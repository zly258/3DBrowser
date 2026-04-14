import type * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { type ChunkWorkerTask } from "./chunkWorkerPool";
interface SceneManagerDisposeContext {
    cancelDeferredStructureBuild: () => void;
    clearLocateFocus: () => void;
    releaseGhostLine: (line: THREE.LineSegments) => void;
    clearChunkCache: () => void;
    controls: OrbitControls;
    selectionBox: THREE.Box3Helper;
    highlightMesh: THREE.Mesh;
    tempMarker: THREE.Points;
    dotTexture: THREE.Texture;
    sharedMaterial: THREE.Material;
    ghostEdgesGeometry: THREE.BufferGeometry;
    ghostMaterial: THREE.Material;
    renderer: THREE.WebGLRenderer;
    ghostGroup: THREE.Group;
    workers: Worker[];
    workerQueue: ChunkWorkerTask[];
    logicTimer: ReturnType<typeof setInterval> | null;
    animationFrameId: number | null;
    onAnimationFrameDisposed: () => void;
    onWorkersDisposed: () => void;
    onQueuesReset: () => void;
    onStateCachesReset: () => void;
}
export declare function disposeSceneManagerResources(context: SceneManagerDisposeContext): void;
export {};
