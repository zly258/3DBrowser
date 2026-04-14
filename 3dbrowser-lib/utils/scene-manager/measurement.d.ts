import * as THREE from "three";
import type { MeasurementRecord, MeasureType } from "./types";
type MeasurementState = {
    measureType: MeasureType;
    currentMeasurePoints: THREE.Vector3[];
    currentMeasureModelUuid: string | null;
    previewLine: THREE.Line | null;
    previewPolygon: THREE.LineLoop | null;
};
interface SceneManagerMeasurementContext {
    canvas: HTMLCanvasElement;
    camera: THREE.Camera;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    measureGroup: THREE.Group;
    tempMarker: THREE.Points;
    dotTexture: THREE.Texture;
    measureRecords: Map<string, MeasurementRecord>;
    state: MeasurementState;
    getRayIntersects: (clientX: number, clientY: number) => THREE.Intersection | null;
    onMeasureUpdate?: (records: MeasurementRecord[]) => void;
}
interface MeasurementResult {
    state: MeasurementState;
    needsRender: boolean;
    completed?: {
        id: string;
        type: string;
        val: string;
    } | null;
}
export declare function applyClearMeasurementPreview(context: SceneManagerMeasurementContext, resetPoints?: boolean): MeasurementResult;
export declare function applyUpdateMeasurePreview(context: SceneManagerMeasurementContext, hoverPoint?: THREE.Vector3): MeasurementResult;
export declare function applyUpdateMeasureHover(context: SceneManagerMeasurementContext, clientX: number, clientY: number): MeasurementResult;
export declare function applyFinalizeMeasurement(context: SceneManagerMeasurementContext): MeasurementResult;
export declare function applyAddMeasurePoint(context: SceneManagerMeasurementContext, point: THREE.Vector3, modelUuid?: string): MeasurementResult;
export declare function applyHighlightMeasurement(context: SceneManagerMeasurementContext, id: string | null): MeasurementResult;
export declare function applyPickMeasurement(context: SceneManagerMeasurementContext, clientX: number, clientY: number): string | null;
export {};
