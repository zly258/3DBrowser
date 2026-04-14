import { type MutableRefObject } from "react";
import { SceneManager } from "../utils/scene-manager/SceneManager";
import type { ClashResultItem } from "./useClashCheck";
type ClashSummaryRecord = {
    total: number;
    newCount: number;
    confirmedCount: number;
    resolvedCount: number;
    worstStatus: "new" | "confirmed" | "resolved";
};
export declare function useClashSummary(sceneMgrRef: MutableRefObject<SceneManager | null>, clashResults: ClashResultItem[]): Record<string, ClashSummaryRecord>;
export {};
