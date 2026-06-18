/**
 * 主题管理器
 * 内置多套主题色，支持自定义色
 */
export type ThemeType = "indigo" | "sky" | "emerald" | "violet" | "rose" | "amber" | "custom";
export interface ThemePreset {
    key: ThemeType;
    labelZh: string;
    labelEn: string;
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primaryContainer: string;
    surfaceHover: string;
    surfaceActive: string;
    surfaceSelected: string;
    surfaceSoft: string;
    surfaceSoftStrong: string;
    swatch: string;
}
export declare const THEME_PRESETS: ThemePreset[];
/**
 * 将主题应用到 :root CSS 变量
 */
export declare function applyTheme(type: ThemeType, customColor?: string): void;
