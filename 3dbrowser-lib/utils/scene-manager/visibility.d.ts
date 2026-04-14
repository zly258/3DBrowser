import * as THREE from "three";
import type { StructureTreeNode } from "./types";
type OptimizedMappingEntry = {
    mesh: THREE.BatchedMesh;
    instanceId: number;
    originalColor: number;
    geometry?: THREE.BufferGeometry;
};
interface SceneManagerVisibilityContext {
    scene: THREE.Scene;
    contentGroup: THREE.Group;
    structureRoot: StructureTreeNode;
    nodeMap: Map<string, StructureTreeNode[]>;
    optimizedMapping: Map<string, OptimizedMappingEntry[]>;
    highlightedUuids: Set<string>;
}
export interface SceneVisibilityResult {
    needsBoundsUpdate: boolean;
    needsExplodeRefresh: boolean;
    needsRender: boolean;
    nextHighlightedUuids?: string[];
}
export interface SceneVisibilityChange {
    uuid: string;
    visible: boolean;
    showParents?: boolean;
}
export interface SceneVisibilityBatchOptions {
    recomputeBounds?: boolean;
    refreshExplode?: boolean;
    invalidateInteractables?: boolean;
}
export declare function applySetAllVisibility(context: SceneManagerVisibilityContext, visible: boolean): SceneVisibilityResult;
export declare function applySetObjectVisibility(context: SceneManagerVisibilityContext, uuid: string, visible: boolean, showParents?: boolean): SceneVisibilityResult;
export declare function applyVisibilityBatch(context: SceneManagerVisibilityContext, changes: SceneVisibilityChange[], options?: SceneVisibilityBatchOptions): SceneVisibilityResult;
export declare function applyIsolateObjects(context: SceneManagerVisibilityContext, uuids: string[], setObjectVisibility: (uuid: string, visible: boolean, showParents?: boolean) => void): SceneVisibilityResult;
export {};
