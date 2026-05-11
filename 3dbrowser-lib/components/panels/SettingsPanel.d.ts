import React from "react";
import { TFunc, Lang } from "../../theme/locales";
import { SceneSettings } from "../../utils/scene-manager/SceneManager";
export declare const SettingsPanel: React.FC<SettingsModalProps>;
interface SettingsModalProps {
    t: TFunc;
    onClose: () => void;
    settings: SceneSettings;
    onUpdate: (s: Partial<SceneSettings>) => void;
    currentLang: Lang;
    setLang: (l: Lang) => void;
    showStats: boolean;
    setShowStats: (v: boolean) => void;
    theme?: any;
}
export {};
