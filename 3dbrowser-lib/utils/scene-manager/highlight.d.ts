import * as THREE from "three";
import { type OptimizedMappingEntry } from "./renderTargets";
import type { StructureTreeNode } from "./types";
type LocateDimmedInstance = {
    mesh: THREE.BatchedMesh;
    instanceId: number;
    originalColor: number;
    originalVisible: boolean;
};
type SceneManagerHighlightState = {
    highlightedUuids: Set<string>;
    locateResultSet: Set<string>;
    locateFocusUuid: string | null;
    lastSelectedUuid: string | null;
};
interface SceneManagerHighlightContext {
    contentGroup: THREE.Group;
    selectionBox: THREE.Box3Helper;
    highlightMesh: THREE.Mesh;
    nodeMap: Map<string, StructureTreeNode[]>;
    optimizedMapping: Map<string, OptimizedMappingEntry[]>;
    totalMeshCount: number;
    settings: {
        highlightColor?: string;
        highlightShowBox?: boolean;
    };
    state: SceneManagerHighlightState;
    locateMaterialCache: Map<string, THREE.Material | THREE.Material[]>;
    locateObjectMaterialCache: Map<string, THREE.Material | THREE.Material[]>;
    locateDimmedInstances: Map<string, LocateDimmedInstance>;
    clearClashPairHighlight: () => void;
}
export interface SceneHighlightResult {
    needsRender: boolean;
}
export interface LocateHighlightOptions {
    highlightColors?: Record<string, string>;
}
export declare function applyHighlightObjects(context: SceneManagerHighlightContext, uuids: string[]): SceneHighlightResult;
export declare function applyClearLocateFocus(context: SceneManagerHighlightContext): SceneHighlightResult;
export declare function applySetLocateResultSet(context: SceneManagerHighlightContext & {
    nodeMap: Map<string, any[]>;
}, uuids: string[], focusUuid?: string | null, options?: LocateHighlightOptions): SceneHighlightResult;
export {};
