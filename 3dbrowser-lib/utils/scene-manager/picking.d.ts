import * as THREE from "three";
import type { StructureTreeNode } from "./types";
type PickChunk = {
    loaded?: boolean;
    mesh?: THREE.Object3D | null;
};
interface SceneManagerPickingContext {
    canvas: HTMLCanvasElement;
    camera: THREE.Camera;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    contentGroup: THREE.Group;
    chunks: PickChunk[];
    nodeMap: Map<string, StructureTreeNode[]>;
    interactableList: THREE.Object3D[];
    interactableListValid: boolean;
}
interface SceneManagerPickingState {
    interactableList: THREE.Object3D[];
    interactableListValid: boolean;
}
interface ScreenRectSelectionContext {
    camera: THREE.Camera;
    interactableList: THREE.Object3D[];
}
export declare function ensureInteractableList(context: SceneManagerPickingContext): SceneManagerPickingState;
export declare function applyGetRayIntersects(context: SceneManagerPickingContext, clientX: number, clientY: number): {
    intersect: THREE.Intersection | null;
    state: SceneManagerPickingState;
};
export declare function selectInteractablesByScreenRect(context: ScreenRectSelectionContext, x1: number, y1: number, x2: number, y2: number): string[];
export {};
