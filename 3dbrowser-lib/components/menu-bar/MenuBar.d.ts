import React from "react";
import { ThemeColors } from "../../theme/styles";
interface MenuBarProps {
    t: (key: string) => string;
    theme: ThemeColors;
    themeType?: 'light';
    setThemeType?: (type: 'light') => void;
    handleOpenFiles?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBatchConvert?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenUrl?: () => void;
    handleView?: (view: string) => void;
    handleClear?: () => void;
    pickEnabled?: boolean;
    setPickEnabled?: (enabled: boolean) => void;
    activeTool?: 'none' | 'measure' | 'clip' | 'settings' | 'export' | 'viewpoint' | 'sun';
    setActiveTool?: (tool: 'none' | 'measure' | 'clip' | 'settings' | 'export' | 'viewpoint' | 'sun') => void;
    showOutline?: boolean;
    setShowOutline?: (show: boolean) => void;
    showProps?: boolean;
    setShowProps?: (show: boolean) => void;
    showStats?: boolean;
    setShowStats?: (show: boolean) => void;
    sceneMgr?: any;
    hiddenMenus?: string[];
    onOpenAbout?: () => void;
}
export declare const MenuBar: React.FC<MenuBarProps>;
export {};
