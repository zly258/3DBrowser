export interface NbimHeader {
    magic: number;
    version: number;
    manifestOffset: number;
    manifestLength: number;
}
export interface NbimPropertyRow {
    group: string;
    key: string;
    path: string;
    value: string;
    source?: string;
    rawKey?: string;
}
export interface NbimPropertyDocument {
    owner: string;
    bimId: string;
    uuid: string;
    name: string;
    rows: NbimPropertyRow[];
}
export interface NbimPropertyNameIndexItem {
    group: string;
    key: string;
    path: string;
    rawKey?: string;
    count: number;
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
    bimPropertyDocs?: Record<string, NbimPropertyDocument>;
    propertyNameIndex?: NbimPropertyNameIndexItem[];
    stats?: {
        meshes: number;
        faces: number;
        memory: number;
    };
}
export declare function readNbimHeader(file: File): Promise<NbimHeader>;
export declare function readNbimManifest(file: File, header: NbimHeader): Promise<NbimManifest>;
