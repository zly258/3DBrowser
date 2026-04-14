import * as THREE from "three";
type OptimizedGeometryMapping = {
    mesh: THREE.BatchedMesh;
    instanceId: number;
    originalColor: number;
    geometry?: THREE.BufferGeometry;
};
export declare function computeGeometryVolume(geometry: THREE.BufferGeometry, mesh: THREE.Mesh, instanceId?: number): number;
export declare function computeGeometryArea(geometry: THREE.BufferGeometry, mesh: THREE.Mesh, instanceId?: number): number;
export declare function getObjectGeometryDataFromScene(options: {
    uuid: string;
    optimizedMapping: Map<string, OptimizedGeometryMapping[]>;
    contentGroup: THREE.Group;
}): {
    area: number;
    volume: number;
};
export {};
