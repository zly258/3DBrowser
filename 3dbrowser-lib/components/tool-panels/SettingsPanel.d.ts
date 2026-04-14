import React from "react";
import { TFunc, Lang } from "../../theme/locales";
import { SceneSettings } from "../../utils/scene-manager/SceneManager";
/**
 * SettingsPanel - 设置面板主组件
 * 提供主题、语言和视口相关配置
 */
export declare const SettingsPanel: React.FC<SettingsModalProps>;
/**
 * SettingsModalProps - 设置面板属性接口
 */
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
