import type { PropertyGroupInput } from "../../viewer/propertyIndex";
import type { StructureTreeNode } from "./types";
interface ResolveBimIdByUuidArgs {
    uuid: string;
    nodeMap: Map<string, StructureTreeNode[]>;
    bimIdToNodeIds: Map<string, string[]>;
}
export declare function resolveBimIdByUuid({ uuid, nodeMap, bimIdToNodeIds }: ResolveBimIdByUuidArgs): string | null;
export declare function resolveNodeUuidByBimId(bimId: string, bimIdToNodeIds: Map<string, string[]>): string | null;
export declare function resolveSelectionUuid(rawUuid: string, nodeMap: Map<string, StructureTreeNode[]>, bimIdToNodeIds: Map<string, string[]>): string;
export declare function resolveNbimNode(id: string, nodeMap: Map<string, StructureTreeNode[]>): StructureTreeNode | null;
interface ResolveNbimPropertyEntryArgs {
    id: string;
    nodeMap: Map<string, StructureTreeNode[]>;
    nbimPropsByOriginalUuid: Map<string, Record<string, any>>;
}
export declare function resolveNbimFlatProperties(args: ResolveNbimPropertyEntryArgs): any | null;
export declare function resolveNbimIfcPropertyGroups(args: ResolveNbimPropertyEntryArgs, mode?: "raw" | "normalized"): Record<string, PropertyGroupInput> | null;
export {};
