
import React, { useState, useRef, useEffect } from "react";
import { 
    IconFile, IconFolder, IconLink, IconExport, IconClear, IconFit, IconList, IconInfo, IconMeasure, IconSettings,
    IconPick, IconClip, IconMenu, IconClose, IconChevronRight, IconChevronDown, IconMinimize, IconMaximize, IconLang
} from "../theme/Icons";

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

// --- Components ---

const StartMenuItem = ({ icon: Icon, label, onClick, theme }: any) => {
    const [hover, setHover] = useState(false);
    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        cursor: 'pointer',
        fontSize: '13px',
        color: theme.text,
        backgroundColor: hover ? theme.itemHover : 'transparent',
        transition: 'background-color 0.2s',
    };

    return (
        <div 
            style={itemStyle} 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => { 
                setHover(false);
                onClick();
            }}
        >
            <Icon size={18} />
            {label}
        </div>
    );
};

import { TFunc } from "../theme/Locales";

interface MenuBarProps {
    t: TFunc;
    themeType: 'dark' | 'light';
    setThemeType: (type: 'dark' | 'light') => void;
    menuMode: 'ribbon' | 'classic';
    activeTool: string;
    setActiveTool: (tool: string) => void;
    handleOpenFiles: (e: any) => void;
    handleOpenFolder: (e: any) => void;
    handleOpenUrl: () => void;
    handleClear: () => void;
    handleView: (view: string) => void;
    pickEnabled: boolean;
    setPickEnabled: (v: boolean) => void;
    showOutline: boolean;
    setShowOutline: (v: boolean) => void;
    showProps: boolean;
    setShowProps: (v: boolean) => void;
    showStats: boolean;
    setShowStats: (v: boolean) => void;
    hiddenMenus?: string[];
    handleAbout: () => void;
    sceneMgr: any;
    styles: any;
    theme: any;
    fileInputRef?: React.RefObject<HTMLInputElement>;
    folderInputRef?: React.RefObject<HTMLInputElement>;
}

const ClassicMenuItem = ({ label, children, styles, theme }: { label: string, children: (close: () => void) => React.ReactNode, styles: any, theme: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hover, setHover] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeMenu = () => {
        setIsOpen(false);
        setHover(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div 
            ref={menuRef}
            style={{ position: 'relative', height: '100%' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div 
                style={styles.classicMenuItem(isOpen, hover)}
                onClick={() => setIsOpen(!isOpen)}
            >
                {label}
            </div>
            {isOpen && (
                <div style={styles.classicMenuDropdown}>
                    {children(closeMenu)}
                </div>
            )}
        </div>
    );
};

const ClassicSubItem = ({ label, shortcut, onClick, styles, theme }: { label: string, shortcut?: string, onClick: () => void, styles: any, theme?: any }) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
            style={styles.classicMenuSubItem(hover)}
            onClick={() => { 
                setHover(false);
                onClick(); 
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span style={{ flex: 1 }}>{label}</span>
            {shortcut && (
                <span style={{ 
                    fontSize: '11px', 
                    opacity: 0.5, 
                    marginLeft: '20px',
                    fontFamily: 'monospace'
                }}>
                    {shortcut}
                </span>
            )}
        </div>
    );
};

export const MenuBar = (props: MenuBarProps) => {
    const {
        t,
        theme,
        styles,
        hiddenMenus = []
    } = props;

    const isHidden = (id: string) => hiddenMenus.includes(id);
    const localFileInputRef = useRef<HTMLInputElement>(null);
    const localFolderInputRef = useRef<HTMLInputElement>(null);
    
    const fileInputRef = props.fileInputRef || localFileInputRef;
    const folderInputRef = props.folderInputRef || localFolderInputRef;

    return (
        <div style={styles.ribbonContainer}>
            {/* Classic Menu */}
            <input ref={fileInputRef} type="file" multiple hidden accept=".lmb,.lmbz,.glb,.gltf,.ifc,.nbim,.fbx,.obj,.stl,.ply,.3mf,.stp,.step,.igs,.iges" onChange={props.handleOpenFiles} />
            <input ref={folderInputRef} type="file" hidden {...({webkitdirectory: "", directory: ""} as any)} onChange={props.handleOpenFolder} />
            
            <div style={styles.classicMenuBar}>
                {!isHidden('file') && (
                    <ClassicMenuItem label={t('menu_file')} styles={styles} theme={theme}>
                        {(close) => (
                            <>
                                {!isHidden('open_file') && <ClassicSubItem label={t('menu_open_file')} shortcut={isMac ? "⌘O" : "Ctrl+O"} onClick={() => { fileInputRef.current?.click(); close(); props.handleView('se'); }} styles={styles} />}
                                {!isHidden('open_folder') && <ClassicSubItem label={t('menu_open_folder')} shortcut={isMac ? "⇧⌘O" : "Ctrl+Shift+O"} onClick={() => { folderInputRef.current?.click(); close(); props.handleView('se'); }} styles={styles} />}
                                {!isHidden('export') && (
                                    <>
                                        <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                                        <ClassicSubItem label={t('menu_export')} shortcut={isMac ? "⌘E" : "Ctrl+E"} onClick={() => { props.setActiveTool('export'); close(); props.handleView('se'); }} styles={styles} />
                                    </>
                                )}
                                {!isHidden('clear') && (
                                    <>
                                        <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                                        <ClassicSubItem label={t('op_clear')} shortcut={isMac ? "⌘⌫" : "Ctrl+Del"} onClick={() => { props.handleClear(); close(); props.handleView('se'); }} styles={styles} />
                                    </>
                                )}
                            </>
                        )}
                    </ClassicMenuItem>
                )}

                {!isHidden('view') && (
                    <ClassicMenuItem label={t('view')} styles={styles} theme={theme}>
                        {(close) => (
                            <>
                                {!isHidden('fit_view') && <ClassicSubItem label={t('menu_fit_view')} shortcut="F" onClick={() => { props.sceneMgr?.fitView(); close(); }} styles={styles} />}
                                {!isHidden('views') && (
                                    <>
                                        <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                                        <ClassicSubItem label={t('view_front')} onClick={() => { props.handleView('front'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_back')} onClick={() => { props.handleView('back'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_top')} onClick={() => { props.handleView('top'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_bottom')} onClick={() => { props.handleView('bottom'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_left')} onClick={() => { props.handleView('left'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_right')} onClick={() => { props.handleView('right'); close(); }} styles={styles} />
                                        <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                                        <ClassicSubItem label={t('view_se')} onClick={() => { props.handleView('se'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_sw')} onClick={() => { props.handleView('sw'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_ne')} onClick={() => { props.handleView('ne'); close(); }} styles={styles} />
                                        <ClassicSubItem label={t('view_nw')} onClick={() => { props.handleView('nw'); close(); }} styles={styles} />
                                    </>
                                )}
                            </>
                        )}
                    </ClassicMenuItem>
                )}

                {!isHidden('interface') && (
                    <ClassicMenuItem label={t('interface_display')} styles={styles} theme={theme}>
                        {(close) => (
                            <>
                                {!isHidden('outline') && <ClassicSubItem label={`${props.showOutline ? '✓ ' : ''}${t('interface_outline')}`} shortcut={isMac ? "⌘L" : "Ctrl+L"} onClick={() => { props.setShowOutline(!props.showOutline); close(); }} styles={styles} />}
                                {!isHidden('props') && <ClassicSubItem label={`${props.showProps ? '✓ ' : ''}${t('interface_props')}`} shortcut={isMac ? "⌘I" : "Ctrl+I"} onClick={() => { props.setShowProps(!props.showProps); close(); }} styles={styles} />}
                                {!isHidden('stats') && <ClassicSubItem label={`${props.showStats ? '✓ ' : ''}${t('st_monitor')}`} shortcut={isMac ? "⌘M" : "Ctrl+M"} onClick={() => { props.setShowStats(!props.showStats); close(); }} styles={styles} />}
                                {!isHidden('pick') && (
                                    <>
                                        <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                                        <ClassicSubItem label={`${props.pickEnabled ? '✓ ' : ''}${t('op_pick')}`} shortcut={isMac ? "⌘P" : "Ctrl+P"} onClick={() => { props.setPickEnabled(!props.pickEnabled); close(); }} styles={styles} />
                                    </>
                                )}
                            </>
                        )}
                    </ClassicMenuItem>
                )}

                {!isHidden('tool') && (
                    <ClassicMenuItem label={t('tool')} styles={styles} theme={theme}>
                        {(close) => (
                            <>
                                {!isHidden('measure') && <ClassicSubItem label={t('tool_measure')} shortcut={isMac ? "⇧⌘M" : "Ctrl+Shift+M"} onClick={() => { props.setActiveTool('measure'); close(); props.handleView('se'); }} styles={styles} />}
                                {!isHidden('clip') && <ClassicSubItem label={t('tool_clip')} shortcut={isMac ? "⇧⌘C" : "Ctrl+Shift+C"} onClick={() => { props.setActiveTool('clip'); close(); props.handleView('se'); }} styles={styles} />}
                            </>
                        )}
                    </ClassicMenuItem>
                )}

                {!isHidden('settings_panel') && (
                    <ClassicMenuItem label={t('settings')} styles={styles} theme={theme}>
                        {(close) => (
                            <>
                                {!isHidden('settings') && <ClassicSubItem label={t('settings')} shortcut={isMac ? "⌘," : "Ctrl+,"} onClick={() => { props.setActiveTool('settings'); close(); props.handleView('se'); }} styles={styles} />}
                                {!isHidden('about') && (
                                    <>
                                        <div style={{ height: '1px', backgroundColor: theme.border, margin: '4px 0' }} />
                                        <ClassicSubItem label={t('about')} shortcut="F1" onClick={() => { props.handleAbout(); close(); props.handleView('se'); }} styles={styles} />
                                    </>
                                )}
                            </>
                        )}
                    </ClassicMenuItem>
                )}
            </div>
        </div>
    );
};
