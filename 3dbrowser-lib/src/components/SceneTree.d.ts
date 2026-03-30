import React from "react";
interface TreeNode {
    uuid: string;
    name: string;
    type: "GROUP" | "MESH" | "TILES";
    depth: number;
    children: TreeNode[];
    expanded: boolean;
    visible: boolean;
    object: any;
    isFileNode?: boolean;
    isLastChild?: boolean;
    parentIsLast?: boolean[];
    hasChildren?: boolean;
    childrenLoaded?: boolean;
}
interface IfcFilterState {
    storey: string;
    elevation: string;
    system: string;
    category: string;
    material: string;
}
export declare const buildTree: (object: any, depth?: number) => TreeNode;
interface SceneTreeProps {
    t: (key: string) => string;
    treeRoot: TreeNode[];
    setTreeRoot: React.Dispatch<React.SetStateAction<TreeNode[]>>;
    selectedUuid: string | null;
    locatedUuid?: string | null;
    selectedStorey?: string;
    onSelect: (uuid: string, obj: any) => void;
    onToggleVisibility: (uuid: string, visible: boolean) => void;
    onDelete?: (obj: any) => void;
    onFocus?: (obj: any) => void;
    onIsolate?: (uuid: string) => void;
    onHide?: (uuid: string) => void;
    onShowAll?: () => void;
    onApplyIfcFiltersToViewport?: (filters: IfcFilterState) => void;
    onApplyStoreyWorkset?: (storeys: string[]) => void;
    onLocate?: (obj: any) => void;
    onClearLocate?: () => void;
    onLocateResultsChange?: (uuids: string[]) => void;
    locateResultUuids?: string[];
}
export declare const SceneTree: React.FC<SceneTreeProps>;
export {};
