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
export declare const buildTree: (object: any, depth?: number) => TreeNode;
interface SceneTreeProps {
    t: (key: string) => string;
    treeRoot: TreeNode[];
    setTreeRoot: React.Dispatch<React.SetStateAction<TreeNode[]>>;
    selectedUuid: string | null;
    locatedUuid?: string | null;
    onSelect: (uuid: string, obj: any) => void;
    onToggleVisibility: (uuid: string, visible: boolean) => void;
    onDelete?: (obj: any) => void;
    onIsolate?: (uuid: string) => void;
    onHide?: (uuid: string) => void;
    onShowAll?: () => void;
    onLocate?: (obj: any) => boolean | void;
    onClearLocate?: () => void;
    onLocateResultsChange?: (uuids: string[]) => void;
    locateResultUuids?: string[];
    clashSummaryByUuid?: Record<string, {
        total: number;
        newCount: number;
        confirmedCount: number;
        resolvedCount: number;
        worstStatus: "new" | "confirmed" | "resolved";
    }>;
}
export declare const SceneTree: React.FC<SceneTreeProps>;
export {};
