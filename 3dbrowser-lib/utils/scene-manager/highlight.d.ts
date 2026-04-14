import * as THREE from "three";
type OptimizedMappingEntry = {
    mesh: THREE.BatchedMesh;
    instanceId: number;
    originalColor: number;
    geometry?: THREE.BufferGeometry;
};
type LocateDimmedInstance = {
    mesh: THREE.BatchedMesh;
    instanceId: number;
    originalColor: number;
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
    optimizedMapping: Map<string, OptimizedMappingEntry[]>;
    settings: {
        highlightColor?: string;
        highlightShowBox?: boolean;
    };
    state: SceneManagerHighlightState;
    locateMaterialCache: Map<string, {
        transparent: boolean;
        opacity: number;
        depthWrite: boolean;
    }>;
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
