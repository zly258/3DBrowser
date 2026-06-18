import * as THREE from "three";
export declare function reconstructBatchedMeshFromWorkerData(options: {
    data: any;
    material: THREE.Material;
    resolveUuidByBimId: (originalUuid: string, bimId: string) => string;
}): THREE.BatchedMesh;
