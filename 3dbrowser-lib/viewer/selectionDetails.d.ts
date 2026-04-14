import * as THREE from "three";
import { type PropertyGroupInput, type PropertyGroups } from "./propertyIndex";
import type { SceneManager, StructureTreeNode } from "../utils/scene-manager/SceneManager";
export interface ClashSummaryRecord {
    total: number;
    newCount: number;
    confirmedCount: number;
    resolvedCount: number;
    worstStatus: "new" | "confirmed" | "resolved";
}
export declare function resolveSelectionTarget(sceneManager: SceneManager, selectionObject: any, focusUuid: string): THREE.Object3D | StructureTreeNode | any;
export declare function resolveTargetElevation(target: any): any;
export declare function fetchIfcGroups(target: any, cache: Map<string, Record<string, PropertyGroupInput>>): Promise<Record<string, PropertyGroupInput> | null>;
interface BuildSelectionPropertyGroupsArgs {
    sceneManager: SceneManager;
    focusUuid: string;
    target: any;
    t: (key: string) => string;
    ifcGroups: Record<string, PropertyGroupInput> | null;
    clashSummary?: ClashSummaryRecord;
    isDev?: boolean;
}
export declare function buildSelectionPropertyGroups({ sceneManager, focusUuid, target, t, ifcGroups, clashSummary, isDev }: BuildSelectionPropertyGroupsArgs): PropertyGroups;
export {};
