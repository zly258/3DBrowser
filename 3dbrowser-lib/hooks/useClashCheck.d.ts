import { type MutableRefObject } from "react";
import { SceneManager } from "../utils/scene-manager/SceneManager";
export type ClashResultItem = {
    id: string;
    pairKey: string;
    groupKey: string;
    ruleId: string;
    aUuid: string;
    bUuid: string;
    aName: string;
    bName: string;
    overlapVolume: number;
    distance: number;
    severity: "high" | "medium" | "low";
    type: "hard" | "clearance";
    status: "new" | "confirmed" | "resolved";
};
export type ClashFilter = "ALL" | "NEW" | "CONFIRMED" | "RESOLVED";
export type ClashTypeFilter = "ALL" | "HARD" | "CLEARANCE";
interface ClashModelOption {
    id: string;
    name: string;
}
interface UseClashCheckParams {
    sceneMgrRef: MutableRefObject<SceneManager | null>;
    treeRoot: any[];
    clashModelOptions: ClashModelOption[];
    selectedUuids: string[];
    setSelectedUuids: (next: string[]) => void;
    focusObjectsInView: (options: {
        uuids: string[];
        focusUuid?: string | null;
        highlightColors?: Record<string, string>;
        updateSelection?: boolean;
    }) => boolean;
    t: (key: string) => string;
}
export declare function useClashCheck({ sceneMgrRef, treeRoot, clashModelOptions, selectedUuids, setSelectedUuids, focusObjectsInView, t }: UseClashCheckParams): {
    clashResults: ClashResultItem[];
    setClashResults: import("react").Dispatch<import("react").SetStateAction<ClashResultItem[]>>;
    clashRunning: boolean;
    clashProgress: number;
    clashStatus: string;
    clashScannedCount: number;
    clashSetA: string[];
    clashSetB: string[];
    clashTolerance: number;
    clashMinOverlapVolume: number;
    clashClearanceDistance: number;
    clashUseNarrowPhase: boolean;
    clashUseTrianglePhase: boolean;
    clashPruning: boolean;
    clashIncludeSameModel: boolean;
    clashPairsScanned: number;
    clashResultFilter: ClashFilter;
    clashTypeFilter: ClashTypeFilter;
    setClashSetA: import("react").Dispatch<import("react").SetStateAction<string[]>>;
    setClashSetB: import("react").Dispatch<import("react").SetStateAction<string[]>>;
    setClashTolerance: import("react").Dispatch<import("react").SetStateAction<number>>;
    setClashMinOverlapVolume: import("react").Dispatch<import("react").SetStateAction<number>>;
    setClashClearanceDistance: import("react").Dispatch<import("react").SetStateAction<number>>;
    setClashUseNarrowPhase: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setClashUseTrianglePhase: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setClashIncludeSameModel: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setClashResultFilter: import("react").Dispatch<import("react").SetStateAction<ClashFilter>>;
    setClashTypeFilter: import("react").Dispatch<import("react").SetStateAction<ClashTypeFilter>>;
    handleRunClashCheck: () => Promise<void>;
    handleCancelClashCheck: () => void;
    handleClearClashResults: () => void;
    handleFocusClashResult: (item: ClashResultItem) => void;
    handleUpdateClashResultStatus: (id: string, nextStatus: ClashResultItem["status"]) => void;
    handleMarkFilteredClashStatus: (nextStatus: ClashResultItem["status"]) => void;
    handleExportClashCsv: () => void;
    resetClashState: () => void;
    applyClashModelOptionBounds: () => void;
};
export {};
