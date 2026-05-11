import * as THREE from "three";
import type { StructureTreeNode } from "./types";
import type { NbimPropertyDocument, NbimPropertyNameIndexItem } from "../scene-core/nbimIO";
export declare function sanitizeDisplayLabel(...candidates: Array<string | null | undefined | number>): string;
export declare function countStructureRenderableNodes(node: StructureTreeNode | undefined): number;
export declare function buildExportStructureTree(structureRoot: StructureTreeNode): any;
export declare function encodeNbimManifest(manifest: {
    globalBounds: unknown;
    chunks: unknown[];
    structureTree: any;
    bimIdTable: string[];
    bimPropertyDocs?: Record<string, NbimPropertyDocument>;
    propertyNameIndex?: NbimPropertyNameIndexItem[];
}, structureRoot: StructureTreeNode): Uint8Array<ArrayBufferLike>;
export declare function deriveDefaultNbimStem(contentGroup: THREE.Group): string;
export declare function groupNbimPropertiesByOwner(manifestBimProperties: Record<string, any>, rootId: string): {
    defaultOwner: string;
    grouped: Map<string, Record<string, any>>;
};
export declare function createNbimContainerGroup(options: {
    fileName: string;
    modelRootName?: string;
    rootId: string;
}): any;
type IfcApiRef = {
    ifcApi: any;
    modelID: number;
};
type IfcManagerRef = {
    ifcManager: any;
    modelID: number;
};
export declare function collectIfcModelReferences(contentGroup: THREE.Group): {
    ifcApiByModel: Map<string, IfcApiRef>;
    ifcManagerByModel: Map<string, IfcManagerRef>;
};
export declare function buildPropertyNameIndex(docs: Record<string, NbimPropertyDocument>): NbimPropertyNameIndexItem[];
export declare function collectNbimBimProperties(options: {
    structureRoot: StructureTreeNode;
    ifcApiByModel: Map<string, IfcApiRef>;
    ifcManagerByModel: Map<string, IfcManagerRef>;
}): Promise<{
    bimProperties: Record<string, any>;
    bimPropertyDocs: Record<string, NbimPropertyDocument>;
    propertyNameIndex: NbimPropertyNameIndexItem[];
}>;
export declare function collectIfcObjectBasicPropertyIndex(object: THREE.Object3D): {
    bimPropertyDocs: Record<string, NbimPropertyDocument>;
    propertyNameIndex: NbimPropertyNameIndexItem[];
};
export declare function collectIfcObjectPropertyIndex(options: {
    object: THREE.Object3D;
    ifcApiByModel: Map<string, IfcApiRef>;
    ifcManagerByModel: Map<string, IfcManagerRef>;
    onProgress?: (processed: number, total: number) => void;
}): Promise<{
    bimProperties: Record<string, any>;
    bimPropertyDocs: Record<string, NbimPropertyDocument>;
    propertyNameIndex: NbimPropertyNameIndexItem[];
}>;
export declare function convertLegacyBimPropertiesToDocs(bimProperties: Record<string, any>): {
    bimPropertyDocs: Record<string, NbimPropertyDocument>;
    propertyNameIndex: NbimPropertyNameIndexItem[];
};
export declare function prepareNbimExportChunks(options: {
    chunks: any[];
    nbimFiles: Map<string, File>;
    nbimMeta: Map<string, {
        version: number;
        bimIdTable?: string[];
    }>;
    bimIdToIndex: Map<string, number>;
    hasValidChunkBinaryRange: (chunk: any) => boolean;
    generateChunkBinaryV8: (items: any[], bimIdToIndex: Map<string, number>) => ArrayBuffer;
}): Promise<{
    chunkBlobs: Uint8Array<ArrayBufferLike>[];
    exportChunks: {
        id: any;
        bounds: {
            min: {
                x: any;
                y: any;
                z: any;
            };
            max: {
                x: any;
                y: any;
                z: any;
            };
        };
        originalUuid: string;
        byteOffset: number;
        byteLength: number;
    }[];
    currentOffset: number;
}>;
export {};
