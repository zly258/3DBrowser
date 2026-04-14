import type { Dispatch, SetStateAction } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { SceneManagerStats } from "../utils/scene-manager/types";
interface UseSceneStatsOptions {
    mgrInstance: SceneManager | null;
    showStats: boolean;
    setStats: Dispatch<SetStateAction<SceneManagerStats>>;
}
export declare function useSceneStats({ mgrInstance, showStats, setStats }: UseSceneStatsOptions): void;
export {};
