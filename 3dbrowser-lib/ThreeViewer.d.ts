import "./styles/index.css";
import { SceneManager, SceneSettings, PerformancePreset, SceneChunkOptions } from "./utils/scene-manager/SceneManager";
import { Lang } from "./theme/locales";
export interface ThreeViewerProps {
    allowDragOpen?: boolean;
    hiddenMenus?: string[];
    libPath?: string;
    defaultLang?: Lang;
    showStats?: boolean;
    showOutline?: boolean;
    showProperties?: boolean;
    initialSettings?: Partial<SceneSettings>;
    initialFiles?: (string | File) | (string | File)[];
    onSelect?: (uuid: string, object: any) => void;
    onLoad?: (manager: SceneManager) => void;
    hideDeleteModel?: boolean;
    performancePreset?: PerformancePreset;
    chunkOptions?: SceneChunkOptions;
}
export declare const ThreeViewer: ({ allowDragOpen, hiddenMenus, libPath, defaultLang, showStats: propShowStats, showOutline: propShowOutline, showProperties: propShowProperties, initialSettings, initialFiles, onSelect: propOnSelect, onLoad, hideDeleteModel, performancePreset, chunkOptions }: ThreeViewerProps) => import("react/jsx-runtime").JSX.Element;
export default ThreeViewer;
