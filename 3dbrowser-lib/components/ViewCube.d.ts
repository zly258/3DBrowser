import React from "react";
import { SceneManager } from "../utils/scene-manager/SceneManager";
import { Lang } from "../theme/locales";
import { ThemeColors } from "../theme/styles";
interface ViewCubeProps {
    sceneMgr: SceneManager | null;
    lang?: Lang;
    theme?: ThemeColors;
}
export declare const ViewCube: React.FC<ViewCubeProps>;
export {};
