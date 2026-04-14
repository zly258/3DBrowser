import * as THREE from "three";
type ClipAxisRanges = {
    x: number[];
    y: number[];
    z: number[];
};
type ClipAxisActive = {
    x: boolean;
    y: boolean;
    z: boolean;
};
type ClippingState = {
    clippingPlanes: THREE.Plane[];
    clipPlaneHelpers: THREE.Mesh[];
    clipHelperVisible: boolean;
    clipHelperOpacity: number;
};
interface SceneManagerClippingContext {
    renderer: THREE.WebGLRenderer;
    clipHelpersGroup: THREE.Group;
    state: ClippingState;
}
interface ClippingResult {
    state: ClippingState;
    needsRender: boolean;
}
export declare function applySetupClipping(context: SceneManagerClippingContext): ClippingResult;
export declare function applySetClipHelperOptions(context: SceneManagerClippingContext, options: {
    visible?: boolean;
    opacity?: number;
}): ClippingResult;
export declare function applyUpdateClippingPlanes(context: SceneManagerClippingContext, bounds: THREE.Box3, values: ClipAxisRanges, active: ClipAxisActive): ClippingResult;
export declare function isBoxClippedByPlanes(planes: THREE.Plane[], box: THREE.Box3): boolean;
export {};
