import React, { Component, useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as THREE from "three";
import { SceneManager, MeasureType, SceneSettings } from "../utils/SceneManager";
import { loadModelFiles, parseTilesetFromFolder } from "../loader/LoaderUtils";
import { convertLMBTo3DTiles, exportGLB, exportLMB } from "../utils/converter";
import { createStyles, createGlobalStyle, themes, ThemeColors } from "../theme/Styles";
import { getTranslation, Lang } from "../theme/Locales";

// 组件
import { MenuBar } from "./MenuBar";
import { SceneTree, buildTree } from "./SceneTree";
import { MeasurePanel, ClipPanel, ExportPanel, FloatingPanel } from "./ToolPanels";
import { SettingsPanel } from "./SettingsPanel";
import { LoadingOverlay } from "./LoadingOverlay";
import { PropertiesPanel } from "./PropertiesPanel";
import { ConfirmModal } from "./ConfirmModal";
import { ViewCube } from "./ViewCube";
import { IconClose } from "../theme/Icons";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    t: any;
    styles: any;
    theme: any;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

// --- 错误边界组件 ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState;
    public props: ErrorBoundaryProps;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const { t, styles, theme } = this.props;
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', width: '100vw', backgroundColor: theme.bg, color: theme.text,
                    fontFamily: "'Microsoft YaHei', sans-serif", gap: '20px', padding: '40px', textAlign: 'center'
                }}>
                    <div style={{ fontSize: '64px' }}>⚠️</div>
                    <h1 style={{ fontSize: '24px', margin: 0 }}>应用发生错误</h1>
                    <p style={{ color: theme.textMuted, maxWidth: '600px', lineHeight: '1.6' }}>
                        抱歉，程序运行过程中遇到了未预期的错误。您可以尝试重新加载页面，或联系开发人员。
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 24px', backgroundColor: theme.accent, color: '#fff',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        重新加载页面
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- 全局样式注入 ---
const GlobalStyle = ({ theme, fontFamily }: { theme: ThemeColors, fontFamily: string }) => (
    <style dangerouslySetInnerHTML={{ __html: createGlobalStyle(theme, fontFamily) }} />
);

// --- 关于弹窗 ---
const AboutModal = ({ show, onClose, styles, theme, t }: { show: boolean, onClose: () => void, styles: any, theme: any, t: any }) => {
    if (!show) return null;
    return (
        <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, width: '450px', padding: '0' }}>
                <div style={{ ...styles.floatingHeader, borderBottom: `1px solid ${theme.border}` }}>
                    <span>{t('about')}</span>
                    <div 
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '50%' }} 
                        onClick={onClose}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.itemHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <IconClose size={18} />
                    </div>
                </div>
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                        width: '64px', height: '64px', 
                        background: theme.accent, 
                        borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '800', fontSize: '28px',
                        boxShadow: `0 4px 12px ${theme.accent}40`
                    }}>3D</div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: theme.text }}>3D Browser</h2>
                        <div style={{ fontSize: '12px', color: theme.textMuted }}>Version 1.0.0</div>
                    </div>
                    <div style={{ 
                        width: '100%', 
                        height: '1px', 
                        background: `linear-gradient(to right, transparent, ${theme.border}, transparent)` 
                    }} />
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: theme.text, textAlign: 'center' }}>
                        一个基于 Three.js 的高性能 3D 模型浏览器。<br/>
                        支持多种三维格式加载。
                    </div>
                    <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '10px' }}>
                        © 2026 zhangly1403@163.com. All rights reserved.
                    </div>
                    <button 
                        onClick={onClose}
                        style={{ ...styles.btn, backgroundColor: theme.accent, color: 'white', border: 'none', padding: '8px 30px', marginTop: '10px' }}
                    >
                        {t('btn_confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 主应用 ---
export const ThreeViewer = () => {
    // 主题状态 - 从localStorage恢复
    const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_themeMode');
            return (saved === 'dark' || saved === 'light') ? saved : 'light';
        } catch {
            return 'light';
        }
    });

    // 主题颜色状态
    const [accentColor, setAccentColor] = useState(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_accentColor');
            return saved || "#0078D4";
        } catch {
            return "#0078D4";
        }
    });

    const theme = useMemo(() => {
        const baseTheme = themes[themeMode];
        return { ...baseTheme, accent: accentColor };
    }, [themeMode, accentColor]);

    // 字体设置状态 - 从localStorage恢复
    const [fontFamily, setFontFamily] = useState(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_fontFamily');
            return saved || "'Microsoft YaHei', sans-serif";
        } catch {
            return "'Microsoft YaHei', sans-serif";
        }
    });

    const styles = useMemo(() => createStyles(theme, fontFamily), [theme, fontFamily]);

    // 菜单模式状态 - 强制为 classic
    const [menuMode, setMenuMode] = useState<'ribbon' | 'classic'>('classic');

    // 语言状态 - 从localStorage恢复
    const [lang, setLang] = useState<Lang>(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_lang');
            return (saved === 'zh' || saved === 'en') ? saved : 'zh';
        } catch {
            return 'zh';
        }
    });

    // 状态
    const [treeRoot, setTreeRoot] = useState<any[]>([]);
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
    const [selectedProps, setSelectedProps] = useState<any>(null);
    const [status, setStatus] = useState(getTranslation(lang, 'ready'));
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({ meshes: 0, faces: 0, memory: 0, drawCalls: 0 });
    const [chunkProgress, setChunkProgress] = useState({ loaded: 0, total: 0 });
    
    // 工具状态
    const [activeTool, setActiveTool] = useState<'none' | 'measure' | 'clip' | 'settings' | 'export'>('none');
    const [showAbout, setShowAbout] = useState(false);
    
    // Measure State
    const [measureType, setMeasureType] = useState<MeasureType>('none');
    // 存储历史记录: { id, type, val }
    const [measureHistory, setMeasureHistory] = useState<any[]>([]);

    const [clipEnabled, setClipEnabled] = useState(false);
    const [clipValues, setClipValues] = useState({ x: [0, 100], y: [0, 100], z: [0, 100] });
    const [clipActive, setClipActive] = useState({ x: false, y: false, z: false });

    // Toolbar State - 从localStorage恢复状态
    const [pickEnabled, setPickEnabled] = useState(() => {
        try {
            return localStorage.getItem('3dbrowser_pickEnabled') === 'true';
        } catch {
            return false;
        }
    });
    const [showStats, setShowStats] = useState(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_showStats');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });
    const [showOutline, setShowOutline] = useState(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_showOutline');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });
    const [showProps, setShowProps] = useState(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_showProps');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });

    // Settings State (mirrors SceneManager) - 从localStorage恢复
    const [sceneSettings, setSceneSettings] = useState<SceneSettings>(() => {
        try {
            const saved = localStorage.getItem('3dbrowser_sceneSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ambientInt: typeof parsed.ambientInt === 'number' ? parsed.ambientInt : 2.0,
                    dirInt: typeof parsed.dirInt === 'number' ? parsed.dirInt : 1.0,
                    bgColor: typeof parsed.bgColor === 'string' ? parsed.bgColor : theme.canvasBg,
                    enableInstancing: typeof parsed.enableInstancing === 'boolean' ? parsed.enableInstancing : true,
                    viewCubeSize: typeof parsed.viewCubeSize === 'number' ? parsed.viewCubeSize : 100,
                    appMode: 'local',
                };
            }
        } catch (e) { console.error("Failed to load sceneSettings", e); }
        return {
            ambientInt: 2.0,
            dirInt: 1.0,
            bgColor: theme.canvasBg,
            enableInstancing: true,
            viewCubeSize: 100,
            appMode: 'local',
        };
    });

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => void;
    }>({ isOpen: false, title: "", message: "", action: () => {} });

    // Layout State (Resizable Panels)
    const [leftWidth, setLeftWidth] = useState(260);
    const [rightWidth, setRightWidth] = useState(300);
    const resizingLeft = useRef(false);
    const resizingRight = useRef(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const sceneMgr = useRef<SceneManager | null>(null);
    const [mgrInstance, setMgrInstance] = useState<SceneManager | null>(null);
    const visibilityDebounce = useRef<any>(null);

    // Error State
    const [errorState, setErrorState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        detail?: string;
    }>({ isOpen: false, title: "", message: "" });

    // Toast Message State
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
    
    // 状态清理工具
    const cleanStatus = (msg: string) => {
        if (!msg) return "";
        return msg.replace(/:\s*\d+%/g, '').replace(/\(\d+%\)/g, '').replace(/\d+%/g, '').trim();
    };
    
    // 全局错误捕获
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.error("Global Error:", event.error);
            setErrorState({
                isOpen: true,
                title: t("failed"),
                message: event.message || "An unexpected error occurred"
            });
        };
        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error("Unhandled Rejection:", event.reason);
            setErrorState({
                isOpen: true,
                title: t("failed"),
                message: event.reason?.message || String(event.reason) || "A promise was rejected without reason"
            });
        };
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, [lang]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const t = useCallback((key: string) => getTranslation(lang, key), [lang]);

    // 持久化主题和语言设置
    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_themeMode', themeMode);
        } catch (e) { console.error("Failed to save themeMode", e); }
    }, [themeMode]);

    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_lang', lang);
        } catch (e) { console.error("Failed to save lang", e); }
    }, [lang]);

    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_fontFamily', fontFamily);
        } catch (e) { console.error("Failed to save fontFamily", e); }
    }, [fontFamily]);

    // 持久化场景设置
    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_sceneSettings', JSON.stringify(sceneSettings));
        } catch (e) { console.error("Failed to save sceneSettings", e); }
    }, [sceneSettings]);

    // Update status when lang changes if status is "Ready" (or equivalent)
    useEffect(() => {
        const prevLang = lang === 'zh' ? 'en' : 'zh';
        if (status === getTranslation(prevLang, 'ready')) {
            setStatus(getTranslation(lang, 'ready'));
        }
    }, [lang]);

    // --- 键盘快捷键 ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;

            // Ctrl+O: 打开文件
            if (isCtrl && !isShift && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                fileInputRef.current?.click();
                handleView('se');
            }
            // Ctrl+Shift+O: 打开文件夹
            else if (isCtrl && isShift && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                folderInputRef.current?.click();
                handleView('se');
            }
            // Ctrl+E: 导出
            else if (isCtrl && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                setActiveTool('export');
                handleView('se');
            }
            // Ctrl+Del: 清空
            else if (isCtrl && e.key === 'Delete') {
                e.preventDefault();
                handleClear();
            }
            // F: 适配视口
            else if (!isCtrl && e.key.toLowerCase() === 'f') {
                // 如果没有在输入框中，则触发
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    sceneMgr.current?.fitView();
                }
            }
            // Ctrl+L: 切换大纲
            else if (isCtrl && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setShowOutline(prev => !prev);
            }
            // Ctrl+I: 切换属性
            else if (isCtrl && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                setShowProps(prev => !prev);
            }
            // Ctrl+Shift+M: 测量工具
            else if (isCtrl && isShift && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                setActiveTool('measure');
                handleView('se');
            }
            // Ctrl+Shift+C: 剖切工具
            else if (isCtrl && isShift && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                setActiveTool('clip');
                handleView('se');
            }
            // Ctrl+M: 切换监控
            else if (isCtrl && !isShift && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                setShowStats(prev => !prev);
            }
            // Ctrl+P: 切换拾取
            else if (isCtrl && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setPickEnabled(prev => !prev);
            }
            // Ctrl+,: 设置
            else if (isCtrl && e.key === ',') {
                e.preventDefault();
                setActiveTool('settings');
                handleView('se');
            }
            // F1: 关于
            else if (e.key === 'F1') {
                e.preventDefault();
                setShowAbout(true);
            }
            // Esc: 关闭所有工具
            else if (e.key === 'Escape') {
                setActiveTool('none');
                setMeasureType('none');
                sceneMgr.current?.setMeasureType('none');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lang, sceneSettings, showOutline, showProps, showStats, pickEnabled]);

    // --- 面板尺寸调整逻辑 ---
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (resizingLeft.current) {
                setLeftWidth(Math.max(150, Math.min(500, e.clientX)));
            }
            if (resizingRight.current) {
                const newW = window.innerWidth - e.clientX;
                setRightWidth(Math.max(200, Math.min(600, newW)));
            }
        };
        const handleUp = () => {
            resizingLeft.current = false;
            resizingRight.current = false;
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, []);

    // --- 拖拽处理 ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files) as File[];
            // 检查格式支持
            const supportedExtensions = ['.lmb', '.lmbz', '.glb', '.gltf', '.ifc', '.nbim', '.fbx', '.obj', '.stl', '.ply', '.3ds', '.dae'];
            const unsupportedFiles = files.filter((f: File) => {
                const ext = '.' + f.name.split('.').pop()?.toLowerCase();
                return !supportedExtensions.includes(ext);
            });

            if (unsupportedFiles.length > 0) {
                setToast({ 
                    message: `${t("failed")}: 不支持的格式 - ${unsupportedFiles.map((f: File) => f.name).join(', ')}`, 
                    type: 'error' 
                });
            }

            const supportedFiles = files.filter((f: File) => {
                const ext = '.' + f.name.split('.').pop()?.toLowerCase();
                return supportedExtensions.includes(ext);
            });

            if (supportedFiles.length > 0) {
                // 调用加载逻辑
                await processFiles(supportedFiles);
            }
        }
    };

    // --- 格式化辅助函数 ---
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatMemory = (mb: number) => {
        if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB';
        return mb.toFixed(1) + ' MB';
    };

    // --- 视口稳健自适应 ---
    // 1. 使用 ResizeObserver 处理容器尺寸变化
    useEffect(() => {
        if (!viewportRef.current || !sceneMgr.current) return;
        
        const observer = new ResizeObserver(() => {
             sceneMgr.current?.resize();
        });
        
        observer.observe(viewportRef.current);

        return () => {
            observer.disconnect();
        };
    }, [lang]);

    // 2. 当布局状态变化时强制触发一次 resize（修复“场景未占满剩余空间”的问题）
    useEffect(() => {
        if (sceneMgr.current) {
            // Use requestAnimationFrame to ensure the DOM reflow has completed
            requestAnimationFrame(() => {
                sceneMgr.current?.resize();
            });
        }
    }, [showOutline, showProps, leftWidth, rightWidth]);

    // 当主题变化时更新场景背景色
    useEffect(() => {
        // If user hasn't manually overridden bg, follow theme
        if (sceneSettings.bgColor === themes[themeMode === 'light' ? 'dark' : 'light'].canvasBg) {
             const newBg = theme.canvasBg;
             handleSettingsUpdate({ bgColor: newBg });
        }
    }, [themeMode]);

    // 界面状态保存
    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_pickEnabled', String(pickEnabled));
        } catch (e) {
            console.warn('无法保存pickEnabled状态', e);
        }
    }, [pickEnabled]);

    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_showStats', String(showStats));
        } catch (e) {
            console.warn('无法保存showStats状态', e);
        }
    }, [showStats]);

    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_showOutline', String(showOutline));
        } catch (e) {
            console.warn('无法保存showOutline状态', e);
        }
    }, [showOutline]);

    useEffect(() => {
        try {
            localStorage.setItem('3dbrowser_showProps', String(showProps));
        } catch (e) {
            console.warn('无法保存showProps状态', e);
        }
    }, [showProps]);

    // --- Scene Logic ---
    useEffect(() => {
        if (!canvasRef.current) return;
        
        const mgr = new SceneManager(canvasRef.current);
        sceneMgr.current = mgr;
        setMgrInstance(mgr);

        // 应用初始设置
        mgr.updateSettings({
            ...sceneSettings,
            bgColor: theme.canvasBg
        });

        // 处理加载进度
        mgr.onChunkProgress = (loaded, total) => setChunkProgress({ loaded, total });

        // 统计更新
        const statsTimer = setInterval(() => {
            const s = mgr.getStats();
            setStats(s);
        }, 1000);

        // 初始化树
        updateTree();

        return () => {
            clearInterval(statsTimer);
            mgr.dispose();
        };
    }, []);

    const updateTree = () => {
        if (!sceneMgr.current) return;
        const tree = buildTree(sceneMgr.current.contentGroup);
        setTreeRoot(tree);
    };

    const handleSelect = (obj: THREE.Object3D | null) => {
        setSelectedUuid(obj ? obj.uuid : null);
        if (obj) {
            const props: any = {
                name: obj.name || "Unnamed",
                type: obj.type,
                uuid: obj.uuid
            };
            if (obj.userData) {
                Object.assign(props, obj.userData);
            }
            setSelectedProps(props);
            if (showProps) {
                 // Ensure visibility in viewport if selected
            }
        } else {
            setSelectedProps(null);
        }
    };

    const handleToggleVisibility = (uuid: string, visible: boolean) => {
        if (!sceneMgr.current) return;
        const obj = sceneMgr.current.scene.getObjectByProperty('uuid', uuid);
        if (obj) {
            obj.visible = visible;
            // Debounce tree update for performance
            if (visibilityDebounce.current) clearTimeout(visibilityDebounce.current);
            visibilityDebounce.current = setTimeout(() => updateTree(), 100);
        }
    };

    const handleDeleteObject = (uuid: string) => {
        if (!sceneMgr.current) return;
        const obj = sceneMgr.current.scene.getObjectByProperty('uuid', uuid);
        if (obj) {
            sceneMgr.current.removeObject(obj);
            if (selectedUuid === uuid) {
                setSelectedUuid(null);
                setSelectedProps(null);
            }
            updateTree();
        }
    };

    const handleSettingsUpdate = (newSettings: Partial<SceneSettings>) => {
        const updated = { ...sceneSettings, ...newSettings };
        setSceneSettings(updated);
        sceneMgr.current?.updateSettings(updated);
    };

    const handleOpenFiles = async (e: any) => {
        const files = Array.from(e.target.files) as File[];
        if (files.length > 0) {
            await processFiles(files);
        }
        e.target.value = null; // Reset for same file selection
    };

    const handleOpenFolder = async (e: any) => {
        const files = Array.from(e.target.files) as File[];
        if (files.length > 0) {
            const tilesetJson = files.find(f => f.name.toLowerCase() === 'tileset.json');
            if (tilesetJson) {
                // 3D Tiles folder
                await process3DTilesFolder(files);
            } else {
                // Regular folder
                await processFiles(files);
            }
        }
        e.target.value = null;
    };

    const handleOpenUrl = () => {
        const url = prompt("Enter URL (3D Tiles / GLB / LMB):");
        if (url) {
            setLoading(true);
            setStatus(t("loading"));
            sceneMgr.current?.loadUrl(url)
                .then(() => {
                    updateTree();
                    setStatus(t("ready"));
                    setTimeout(() => sceneMgr.current?.fitView(), 500);
                })
                .catch(err => {
                    console.error(err);
                    setStatus(t("failed") + ": " + err.message);
                })
                .finally(() => setLoading(false));
        }
    };

    const processFiles = async (files: File[]) => {
        setLoading(true);
        setProgress(0);
        setStatus(t("loading") + "...");
        try {
            const results = await loadModelFiles(files, (p, msg) => {
                setProgress(p);
                setStatus(msg || t("loading"));
            }, t, sceneSettings);
            
            for (const group of results) {
                sceneMgr.current?.addObject(group);
            }
            updateTree();
            setStatus(t("ready"));
            // Fit view after load
            setTimeout(() => sceneMgr.current?.fitView(), 500);
        } catch (err) {
            console.error(err);
            setStatus(t("failed") + ": " + (err as Error).message);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const process3DTilesFolder = async (files: File[]) => {
        setLoading(true);
        setStatus(t("loading_tileset"));
        try {
            const tileset = await parseTilesetFromFolder(files as unknown as FileList, (p, msg) => {
                setProgress(p);
                setStatus(msg || t("loading"));
            }, t);
            if (tileset && sceneMgr.current) {
                sceneMgr.current.loadUrl(tileset);
                updateTree(); // Tileset root added to tree
                setStatus(t("tileset_loaded"));
                setTimeout(() => sceneMgr.current?.fitView(), 500);
            }
        } catch (err) { console.error(err); setStatus(t("failed") + ": " + (err as Error).message); } 
        finally { setLoading(false); setProgress(0); }
    };

    // New unified Export Handler
    const handleExport = async (format: string) => {
        if (!sceneMgr.current) return;
        
        const content = sceneMgr.current.contentGroup;
        
        // NBIM 导出直接由 SceneManager 处理
        if (format === 'nbim') {
            if (content.children.length === 0) { 
                setToast({ message: t("no_models"), type: 'info' });
                return; 
            }
            setLoading(true);
            setStatus(t("processing") + "...");
            setActiveTool('none');
            setTimeout(async () => {
                try {
                    await sceneMgr.current?.exportNbim();
                    setToast({ message: t("success"), type: 'success' });
                } catch (e) {
                    console.error(e);
                    setToast({ message: t("failed") + ": " + (e as Error).message, type: 'error' });
                } finally {
                    setLoading(false);
                }
            }, 100);
            return;
        }

        // 收集所有原始模型进行导出（非优化组）
        const modelsToExport = content.children.filter(c => !c.userData.isOptimizedGroup && c.name !== "TilesRenderer");
        if (modelsToExport.length === 0) { 
            setToast({ message: t("no_models"), type: 'info' });
            return; 
        }

        // 创建一个临时组用于导出，包含所有要导出的模型
        const exportGroup = new THREE.Group();
        modelsToExport.forEach(m => exportGroup.add(m.clone()));
        
        setLoading(true);
        setProgress(0);
        setStatus(t("processing") + "...");
        setActiveTool('none'); // Close panel

        setTimeout(async () => {
            try {
                let blob: Blob | null = null;
                let filename = `export.${format}`;

                if (format === '3dtiles') {
                    // 强制选择输出目录并直接写入
                    // @ts-ignore
                    if (!window.showDirectoryPicker) {
                        setToast({ message: t("select_output"), type: 'info' });
                        throw new Error("Browser does not support directory picker");
                    }
                    // @ts-ignore
                    const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
                    const filesMap = await convertLMBTo3DTiles(exportGroup, (msg) => {
                        if (msg.includes('%')) {
                            const p = parseInt(msg.match(/(\d+)%/)?.[1] || "0");
                            setProgress(p);
                        }
                        setStatus(cleanStatus(msg));
                    });
                setStatus(t("writing"));
                    let writeCount = 0;
                    for (const [name, b] of filesMap) {
                        // @ts-ignore
                        const fileHandle = await dirHandle.getFileHandle(name, { create: true });
                        // @ts-ignore
                        const writable = await fileHandle.createWritable();
                        await writable.write(b);
                        await writable.close();
                        writeCount++;
                        if (writeCount % 5 === 0) setProgress(Math.floor((writeCount / filesMap.size) * 100));
                    }
                    setToast({ message: t("success"), type: 'success' });
                    return;
                } else if (format === 'glb') {
                    blob = await exportGLB(exportGroup);
                } else if (format === 'lmb') {
                    blob = await exportLMB(exportGroup, (msg) => setStatus(cleanStatus(msg)));
                }

                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                    setToast({ message: t("success"), type: 'success' });
                }
            } catch(e) {
                console.error(e); 
                setToast({ message: t("failed") + ": " + (e as Error).message, type: 'error' });
            } finally {
                setLoading(false);
                setProgress(0);
            }
        }, 100);
    };

    const handleView = (v: any) => { sceneMgr.current?.setView(v); };
    
    const handleClear = async () => {
        if (!sceneMgr.current) return;
        
        setConfirmState({
            isOpen: true,
            title: t("op_clear"),
            message: t("confirm_clear"),
            action: async () => {
                setLoading(true);
                setProgress(0);
                setStatus(t("op_clear") + "...");
                
                try {
                    await sceneMgr.current?.clear();
                    setSelectedUuid(null);
                    setSelectedProps(null);
                    setMeasureHistory([]);
                    updateTree();
                    setStatus(t("ready"));
                } catch (error) {
                    console.error("清空场景失败:", error);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <ErrorBoundary t={t} styles={styles} theme={theme}>
            <div 
                style={styles.container}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
             <GlobalStyle theme={theme} fontFamily={fontFamily} />

             {/* Top MenuBar */}
             <MenuBar 
                t={t}
                themeType={themeMode}
                setThemeType={setThemeMode}
                menuMode={menuMode}
                handleOpenFiles={handleOpenFiles}
                handleOpenFolder={handleOpenFolder}
                handleOpenUrl={handleOpenUrl}
                handleView={handleView}
                handleClear={handleClear}
                pickEnabled={pickEnabled}
                setPickEnabled={setPickEnabled}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                showOutline={showOutline}
                setShowOutline={setShowOutline}
                showProps={showProps}
                setShowProps={setShowProps}
                showStats={showStats}
                setShowStats={setShowStats}
                handleAbout={() => setShowAbout(true)}
                sceneMgr={sceneMgr.current}
                styles={styles}
                theme={theme}
                fileInputRef={fileInputRef}
                folderInputRef={folderInputRef}
            />

             {/* Main Content Area: Flex Row */}
             <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
                
                {/* Left Sidebar: Outline */}
                {showOutline && (
                    <div style={{ 
                        width: `${leftWidth}px`, 
                        backgroundColor: theme.panelBg, 
                        borderRight: `1px solid ${theme.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 10,
                        position: 'relative'
                    }}>
                        <div style={styles.floatingHeader}>
                            <span>{t("interface_outline")}</span>
                            <div 
                                onClick={() => setShowOutline(false)} 
                                style={{ cursor: 'pointer', opacity: 0.6, display:'flex', padding: 2, borderRadius: '50%' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.itemHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <IconClose width={16} height={16} />
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <SceneTree 
                                t={t}
                                sceneMgr={sceneMgr.current} 
                                treeRoot={treeRoot} 
                                setTreeRoot={setTreeRoot} 
                                selectedUuid={selectedUuid}
                                onSelect={(uuid, obj) => handleSelect(obj)}
                                onToggleVisibility={handleToggleVisibility}
                                onDelete={handleDeleteObject}
                                styles={styles}
                                theme={theme}
                            />
                        </div>
                        {/* Resize handle */}
                        <div 
                            onMouseDown={() => resizingLeft.current = true}
                            style={{ 
                                position: 'absolute', right: -2, top: 0, bottom: 0, width: 4, 
                                cursor: 'col-resize', zIndex: 20 
                            }} 
                        />
                    </div>
                )}

                {/* Center Viewport */}
                <div ref={viewportRef} style={{ 
                    flex: 1, 
                    position: 'relative', 
                    backgroundColor: theme.canvasBg,
                    overflow: 'hidden'
                }}>
                    <canvas ref={canvasRef} style={{width: '100%', height: '100%', outline: 'none'}} />
                    
                    <ViewCube sceneMgr={mgrInstance} theme={theme} />

                    {/* Toast Notification */}
                    {toast && (
                        <div style={{
                            position: 'fixed',
                            top: '140px', // 位于菜单栏下方
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: toast.type === 'error' ? theme.danger : (toast.type === 'success' ? theme.accent : theme.panelBg),
                            color: toast.type === 'info' ? theme.text : '#fff',
                            padding: '12px 20px 12px 24px',
                            borderRadius: '4px', // 稍微增加一点圆角，更现代
                            boxShadow: `0 8px 24px rgba(0,0,0,0.25)`,
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px',
                            borderLeft: `4px solid rgba(255,255,255,0.4)`, 
                            animation: 'fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <span>{toast.message}</span>
                            <div 
                                onClick={() => setToast(null)}
                                style={{ 
                                    cursor: 'pointer', 
                                    padding: '4px', 
                                    display: 'flex', 
                                    borderRadius: '50%',
                                    marginLeft: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <IconClose size={14} />
                            </div>
                        </div>
                    )}

                    <LoadingOverlay t={t} loading={loading} status={status} progress={progress} styles={styles} theme={theme} />

                    {/* Overlay Panels for Tools */}
                    {activeTool === 'measure' && (
                        <MeasurePanel 
                            t={t} sceneMgr={sceneMgr.current} 
                            measureType={measureType} setMeasureType={setMeasureType}
                            measureHistory={measureHistory}
                            onDelete={(id: string) => { sceneMgr.current?.removeMeasurement(id); setMeasureHistory(prev => prev.filter(i => i.id !== id)); }}
                            onClear={() => { sceneMgr.current?.clearAllMeasurements(); setMeasureHistory([]); }}
                            onClose={() => setActiveTool('none')}
                            styles={styles} theme={theme}
                        />
                    )}

                    {activeTool === 'clip' && (
                        <ClipPanel 
                            t={t} sceneMgr={sceneMgr.current} onClose={() => setActiveTool('none')}
                            clipEnabled={clipEnabled} setClipEnabled={setClipEnabled}
                            clipValues={clipValues} setClipValues={setClipValues}
                            clipActive={clipActive} setClipActive={setClipActive}
                            styles={styles} theme={theme}
                        />
                    )}

                    {activeTool === 'export' && (
                        <ExportPanel t={t} onClose={() => setActiveTool('none')} onExport={handleExport} styles={styles} theme={theme} />
                    )}

                    {activeTool === 'settings' && (
                        <SettingsPanel 
                            t={t} onClose={() => setActiveTool('none')} settings={sceneSettings} onUpdate={handleSettingsUpdate}
                            currentLang={lang} setLang={setLang} themeMode={themeMode} setThemeMode={setThemeMode}
                            menuMode={menuMode} setMenuMode={setMenuMode}
                            accentColor={accentColor} setAccentColor={setAccentColor}
                            showStats={showStats} setShowStats={setShowStats}
                            fontFamily={fontFamily} setFontFamily={setFontFamily}
                            styles={styles} theme={theme}
                        />
                    )}

                    <AboutModal 
                        show={showAbout} 
                        onClose={() => setShowAbout(false)} 
                        styles={styles} 
                        theme={theme} 
                        t={t} 
                    />
                </div>

                {/* Right Sidebar: Properties */}
                {showProps && (
                    <div style={{ 
                        width: `${rightWidth}px`, 
                        backgroundColor: theme.panelBg, 
                        borderLeft: `1px solid ${theme.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 10,
                        position: 'relative'
                    }}>
                        <div style={styles.floatingHeader}>
                            <span>{t("interface_props")}</span>
                            <div 
                                onClick={() => setShowProps(false)} 
                                style={{ cursor: 'pointer', opacity: 0.6, display:'flex', padding: 2, borderRadius: '50%' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.itemHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <IconClose width={16} height={16} />
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <PropertiesPanel t={t} selectedProps={selectedProps} styles={styles} theme={theme} />
                        </div>
                        {/* Resize handle */}
                        <div 
                            onMouseDown={() => resizingRight.current = true}
                            style={{ 
                                position: 'absolute', left: -2, top: 0, bottom: 0, width: 4, 
                                cursor: 'col-resize', zIndex: 20 
                            }} 
                        />
                    </div>
                )}
             </div>

             {/* Bottom Status Bar */}
             <div style={{
                height: '24px',
                backgroundColor: theme.accent,
                color: 'white', 
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '11px',
                zIndex: 1000,
                justifyContent: 'space-between'
             }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span>{status}</span>
                    {loading && <span>{progress}%</span>}
                    {chunkProgress.total > 0 && (
                        <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            paddingLeft: '8px', 
                            borderLeft: '1px solid rgba(255,255,255,0.3)' 
                        }}>
                            {t("loading_chunks")}: {chunkProgress.loaded} / {chunkProgress.total}
                            {chunkProgress.loaded < chunkProgress.total && (
                                <div style={{ 
                                    width: '40px', 
                                    height: '4px', 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        width: `${(chunkProgress.loaded / chunkProgress.total) * 100}%`, 
                                        height: '100%', 
                                        backgroundColor: '#fff' 
                                    }} />
                                </div>
                            )}
                        </span>
                    )}
                    {selectedUuid && (
                        <span style={{ opacity: 0.8, paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
                            {t("prop_id")}: {selectedUuid.substring(0, 8)}...
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {showStats && (
                        <>
                            <span>{formatNumber(stats.meshes)} {t("monitor_meshes")}</span>
                            <span>{formatNumber(stats.faces)} {t("monitor_faces")}</span>
                            <span>{formatMemory(stats.memory)}</span>
                            <span>{stats.drawCalls} {t("monitor_calls")}</span>
                        </>
                    )}
                    <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <div style={{ opacity: 0.9 }}>{lang === 'zh' ? '简体中文' : 'English'}</div>
                    <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <div style={{ fontWeight: '600', opacity: 0.9 }}>{t('app_title')}</div>
                </div>
             </div>

             <ConfirmModal 
                isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message}
                onConfirm={() => { confirmState.action(); setConfirmState({...confirmState, isOpen: false}); }}
                onCancel={() => setConfirmState({...confirmState, isOpen: false})}
                t={t} styles={styles} theme={theme}
             />

             {/* Error Modal */}
             {errorState.isOpen && (
                <div style={styles.modalOverlay}>
                    <div style={{ ...styles.modalContent, width: '450px' }}>
                        <div style={{ ...styles.floatingHeader, backgroundColor: theme.danger, color: 'white' }}>
                            <span>{errorState.title}</span>
                            <div 
                                onClick={() => setErrorState(prev => ({ ...prev, isOpen: false }))} 
                                style={{ cursor: 'pointer', display: 'flex', padding: 2, borderRadius: '50%' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <IconClose width={18} height={18} />
                            </div>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ fontWeight: '600', fontSize: '15px', color: theme.text }}>{errorState.message}</div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button 
                                    style={{ ...styles.btn, backgroundColor: theme.accent, color: 'white', borderColor: theme.accent, padding: '8px 24px' }}
                                    onClick={() => setErrorState(prev => ({ ...prev, isOpen: false }))}
                                >
                                    {t("confirm") || "确定"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </ErrorBoundary>
    );
};
