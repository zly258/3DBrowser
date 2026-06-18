import * as THREE from "three";
import type { StructureTreeNode } from "./types";
export type OptimizedMappingEntry = {
    mesh: THREE.BatchedMesh;
    instanceId: number;
    originalColor: number;
    geometry?: THREE.BufferGeometry;
};
export type RenderTarget = {
    key: string;
    uuid: string;
    name: string;
    object: THREE.Object3D;
    geometry: THREE.BufferGeometry;
    matrixWorld: THREE.Matrix4;
    box: THREE.Box3;
    type: "mesh" | "instance";
    ownerUuid?: string;
    batchedMesh?: THREE.BatchedMesh;
    instanceId?: number;
    originalColor?: number;
};
export interface RenderTargetContext {
    contentGroup: THREE.Group;
    nodeMap: Map<string, StructureTreeNode[]>;
    optimizedMapping: Map<string, OptimizedMappingEntry[]>;
}
export declare function expandRenderableIds(context: RenderTargetContext, ids: string[]): Set<string>;
export declare function collectRenderableTargetsForIds(context: RenderTargetContext, ids: string[]): RenderTarget[];
export declare function collectAllRenderableTargets(context: RenderTargetContext): RenderTarget[];
export declare function collectRenderableBoundsForIds(context: RenderTargetContext, ids: string[]): THREE.Box3;
