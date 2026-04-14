export interface NbimHeader {
    magic: number;
    version: number;
    manifestOffset: number;
    manifestLength: number;
}
export interface NbimManifest {
    globalBounds?: {
        min: {
            x: number;
            y: number;
            z: number;
        };
        max: {
            x: number;
            y: number;
            z: number;
        };
    };
    chunks?: any[];
    structureTree?: any;
    bimIdTable?: string[];
    bimProperties?: Record<string, any>;
    stats?: {
        meshes: number;
        faces: number;
        memory: number;
    };
}
export declare function readNbimHeader(file: File): Promise<NbimHeader>;
export declare function readNbimManifest(file: File, header: NbimHeader): Promise<NbimManifest>;
