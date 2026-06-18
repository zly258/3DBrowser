import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { type NbimPropertyDocument, type NbimPropertyNameIndexItem } from "../scene-core/nbimIO";
import { type RenderTarget } from "./renderTargets";
import { type SceneVisibilityBatchOptions, type SceneVisibilityChange } from "./visibility";
import { type PerformancePreset, type SceneChunkOptions, type SceneManagerOptions } from "../scene-core/types";
import { type MeasurementRecord, type MeasureType, type SceneManagerStats, type SceneSettings, type StructureTreeNode } from "./types";
import type { PropertyGroupInput } from "../../viewer/propertyIndex";
type ExplodeMode = 'radial' | 'horizontal' | 'vertical';
export declare class SceneManager {
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    controls: OrbitControls;
    clock: THREE.Clock;
    contentGroup: THREE.Group;
    helpersGroup: THREE.Group;
    measureGroup: THREE.Group;
    ghostGroup: THREE.Group;
    clipHelpersGroup: THREE.Group;
    ambientLight: THREE.AmbientLight;
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
    backLight: THREE.DirectionalLight;
    structureRoot: StructureTreeNode;
    private nodeMap;
    private bimIdToNodeIds;
    selectionBox: THREE.Box3Helper;
    highlightMesh: THREE.Mesh;
    private lastSelectedUuid;
    private highlightedUuids;
    private locateFocusUuid;
    private locateResultSet;
    private locateMaterialCache;
    private locateObjectMaterialCache;
    private locateDimmedInstances;
    private locateIsolationRestoreChanges;
    private locateIsolationActive;
    private clashPairObjectMaterialCache;
    private clashPairInstanceColorCache;
    private clashPairUuids;
    private highlightPulseColor;
    private explodeEnabled;
    private explodeStrength;
    private explodeCenter;
    private explodeMode;
    private explodeObjectStates;
    private explodeInstanceStates;
    private readonly explodeScratchUniform;
    private readonly explodeScratchMix;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    measureType: MeasureType;
    currentMeasurePoints: THREE.Vector3[];
    currentMeasureModelUuid: string | null;
    previewLine: THREE.Line | null;
    previewPolygon: THREE.LineLoop | null;
    tempMarker: THREE.Points;
    measureRecords: Map<string, MeasurementRecord>;
    private boxSelectState;
    clippingPlanes: THREE.Plane[];
    clipPlaneHelpers: THREE.Mesh[];
    clipHelperVisible: boolean;
    clipHelperOpacity: number;
    sceneCenter: THREE.Vector3;
    globalOffset: THREE.Vector3;
    componentMap: Map<number | string, any>;
    optimizedMapping: Map<string, {
        mesh: THREE.BatchedMesh;
        instanceId: number;
        originalColor: number;
        geometry?: THREE.BufferGeometry;
    }[]>;
    settings: SceneSettings;
    dotTexture: THREE.Texture;
    sceneBounds: THREE.Box3;
    private cachedSceneSphere;
    private sceneSphereValid;
    precomputedBounds: THREE.Box3;
    private chunks;
    private chunkIdSet;
    private chunkById;
    private chunkIndexById;
    private processingChunks;
    private cancelledChunkIds;
    private frustum;
    private projScreenMatrix;
    private logicTimer;
    private nbimFiles;
    private nbimMeta;
    private nbimPropsByOriginalUuid;
    private nbimPropertyDocsByOriginalUuid;
    private nbimSearchDocsByUuid;
    private nbimPropertyNameIndex;
    private nbimPropertyNameIndexVersion;
    private sharedMaterial;
    private interactableList;
    private interactableListValid;
    private _needsBoundsUpdate;
    onStructureUpdate?: () => void;
    onMeasureUpdate?: (records: MeasurementRecord[]) => void;
    onChunkProgress?: (loaded: number, total: number) => void;
    private lastReportedProgress;
    private lastChunkProgressReportAt;
    private chunkLoadedCount;
    private chunkPadding;
    private maxConcurrentChunkLoads;
    private maxChunkLoadsPerFrame;
    private maxLoadedChunks;
    private maxCachedChunks;
    private chunkLoadingEnabled;
    private maxRenderDistance;
    private _lastCullingTime;
    private chunkMeshCache;
    private chunkCacheOrder;
    private readonly chunkReadCache;
    private chunkReadCacheOrder;
    private prefetchQueue;
    private prefetchQueueSet;
    private prefetchInFlight;
    private prefetchRoundRobinCursor;
    private prefetchPaused;
    private originalStats;
    private originalStatsByModel;
    private workers;
    private workerQueue;
    private activeWorkerCount;
    private maxWorkers;
    private readonly options;
    private readonly resolvedChunkOptions;
    private isCameraMoving;
    private activePixelRatio;
    private chunkLoadResumeAt;
    private cullingDirty;
    private deferredStructureThreshold;
    private octreeWorkerThreshold;
    private initialChunkLoadTarget;
    private warmupChunkBoost;
    private chunkWarmupActive;
    private chunkResidencyMs;
    private readonly chunkRuntimeProfiles;
    private movingPeripheralCursor;
    private movingPeripheralLastRefreshAt;
    private postMoveRecoveryUntil;
    private deferredStructureTimer;
    private deferredStructureToken;
    private loadGeneration;
    private fastPreviewMeshLimit;
    private fastPreviewModels;
    private readonly chunkCullingTempSize;
    private readonly chunkCullingTempDirection;
    private readonly chunkCullingTempForward;
    private readonly chunkCullingTempCenterNdc;
    private boundsScanBatchSize;
    private chunkRegistrationBatchSize;
    private chunkGhostBatchSize;
    private animationFrameId;
    private cameraFlightFrameId;
    private cameraFlightToken;
    private animateFramePending;
    private disposed;
    private interactionShadowDowngraded;
    private interactionShadowRestoreAt;
    private interactionShadowRestoreDelayMs;
    private cullingScanCursor;
    private cullingTimeBudgetMovingMs;
    private cullingTimeBudgetRecoveryMs;
    private cullingTimeBudgetIdleMs;
    private forceMaxChunkLoadSpeed;
    private ghostEdgesGeometry;
    private ghostMaterial;
    private ghostMeshPool;
    private registerChunk;
    private rebuildChunkIdSet;
    private getChunkById;
    private getChunkIndex;
    constructor(canvas: HTMLCanvasElement, options?: SceneManagerOptions);
    /** 按需调度一帧：合并多次调用，在相机静止且无后台任务时不常驻 requestAnimationFrame */
    requestRender(): void;
    private markSceneDirty;
    invalidateRender(options?: {
        needsRender?: boolean;
        needsBoundsUpdate?: boolean;
        needsCulling?: boolean;
        invalidateInteractables?: boolean;
    }): void;
    updateSettings(newSettings: Partial<SceneSettings>): void;
    createCircleTexture(): THREE.CanvasTexture<HTMLCanvasElement>;
    animate: () => void;
    private updateAdaptiveQuality;
    private updateInteractionPerformance;
    private initHardwareProfile;
    private collectObjectOverview;
    private estimateNbimStats;
    private registerOriginalStats;
    private unregisterOriginalStats;
    private disposeChunkMesh;
    private touchChunkCache;
    private cacheChunkMesh;
    private takeCachedChunkMesh;
    private clearChunkCache;
    private hasValidChunkBinaryRange;
    private readChunkBuffer;
    private enqueueChunkPrefetch;
    private schedulePrefetchFromVisibleChunks;
    private processPrefetchQueue;
    private unregisterOptimizedMeshMapping;
    private registerOptimizedMeshMapping;
    private acquireGhostLine;
    private releaseGhostLine;
    private createGhostLine;
    private ensureChunkGhost;
    private attachStructureRoot;
    private replaceStructureNode;
    private buildAndRegisterModelStructure;
    private yieldToMainThread;
    private createPreviewGhost;
    private computeItemBoundsProgressively;
    private createChunkGhostsProgressively;
    private registerLeafChunksProgressively;
    private buildLeafPlans;
    updateCameraClipping(): void;
    resize(width?: number, height?: number): void;
    private reportChunkProgress;
    private getChunkRuntimeProfile;
    private isInPostMoveRecovery;
    private applyHighlightSettings;
    private getChunkRenderPhase;
    private getChunkFrameBudget;
    private isMovingPeripheralChunk;
    private shouldRefreshPeripheralChunk;
    private checkCullingAndLoad;
    private runWorkerTask;
    private processWorkerQueue;
    private unloadChunk;
    private loadChunk;
    setChunkLoadingEnabled(enabled: boolean): void;
    private applyNbimScaleTuning;
    setChunkOptions(options?: SceneChunkOptions): void;
    getChunkOptions(): {
        chunkReadCacheSize: number;
        chunkPrefetchWindow: number;
        ghostMode: import("../scene-core/types").GhostMode;
        targetMinFps: number;
        loadProfile: import("../scene-core/types").LoadProfile;
        deferIfcProperties: boolean;
        preferWorkerOctree: boolean;
        fastGeometrySanitize: boolean;
    };
    setContentVisible(visible: boolean): void;
    private buildSceneGraph;
    /**
     * 构建基于 IFC 图层和空间结构的复合树
     */
    private buildIFCStructure;
    private prepareObjectRuntimeData;
    private applyGlobalOffsetForModel;
    private configureModelWarmup;
    private prepareStructureStage;
    private prepareModelBoundsStage;
    private prepareModelRuntimeStage;
    private prepareFastVisibleStage;
    private attachModelToContentGroup;
    private prepareModelChunkStage;
    private finalizeModelStage;
    private cancelDeferredStructureBuild;
    beginLoadGeneration(): number;
    isLoadGenerationCurrent(generation: number): boolean;
    private deactivateFastPreviewForModel;
    private scheduleDeferredStructureReplacement;
    addModel(object: THREE.Object3D, onProgress?: (p: number, msg: string) => void): Promise<void>;
    removeObject(uuid: string): boolean;
    removeModel(uuid: string): Promise<boolean>;
    private generateChunkBinaryV8;
    private registerPropertyDocuments;
    private rebuildSearchPropertyIndexForObject;
    private scheduleSearchPropertyIndexRebuild;
    private buildExportPropertyDocsFromCache;
    exportNbim(fileName?: string): Promise<void>;
    loadNbim(file: File, onProgress?: (p: number, msg: string) => void): Promise<void>;
    clear(): Promise<void>;
    getStructureNodes(id: string): StructureTreeNode[] | undefined;
    getBimIdByUuid(uuid: string): string | null;
    resolveNodeUuidByBimId(bimId: string): string | null;
    resolveSelectionUuid(rawUuid: string): string;
    private resolveNbimNode;
    getNbimProperties(id: string): any | null;
    getNbimIfcPropertyGroups(id: string, mode?: "raw" | "normalized"): Record<string, PropertyGroupInput> | null;
    getNbimPropertyNameIndex(): NbimPropertyNameIndexItem[];
    getNbimPropertyNameIndexVersion(): number;
    getNbimPropertySearchDocument(uuid: string): NbimPropertyDocument | null;
    getAllNbimPropertySearchDocuments(): NbimPropertyDocument[];
    hasRenderableTarget(uuid: string): boolean;
    private getVisibilityContext;
    private getHighlightContext;
    private cancelCameraFlight;
    private isWorldVisible;
    private getPickingContext;
    private syncHighlightState;
    private syncPickingState;
    private getMeasurementContext;
    private syncMeasurementState;
    private syncBoxSelectState;
    private getClippingContext;
    private syncClippingState;
    setAllVisibility(visible: boolean): void;
    hideObjects(uuids: string[]): void;
    applyVisibilityBatch(changes: SceneVisibilityChange[], options?: SceneVisibilityBatchOptions): void;
    setObjectsVisibility(uuids: string[], visible: boolean, options?: {
        showParents?: boolean;
        deferRefresh?: boolean;
        refreshExplode?: boolean;
    }): void;
    isolateObjects(uuids: string[]): void;
    isolateObjectsForLocate(uuids: string[]): void;
    restoreLocateIsolation(options?: {
        clearFocus?: boolean;
        invalidate?: boolean;
    }): boolean;
    setObjectVisibility(uuid: string, visible: boolean, showParents?: boolean): void;
    highlightObject(uuid: string | null): void;
    private toLocalDirection;
    private getExplodeWorldDirection;
    /** 由 UUID 导出的稳定单位向量，近似均匀分布于球面（与径向方向混合后爆炸更散、更匀） */
    private explodeStableUnitDirection;
    private captureExplodeSnapshot;
    private applyExplodeState;
    private restoreExplodeSnapshot;
    private refreshExplodeState;
    setExplodeEnabled(enabled: boolean): void;
    setExplodeStrength(value: number): void;
    setExplodeMode(mode: ExplodeMode): void;
    resetExplode(): void;
    clearClashPairHighlight(): void;
    setClashPairHighlight(aUuid: string, bUuid: string, colorAHex?: string, colorBHex?: string): void;
    clearLocateFocus(): void;
    restoreView(keepOrientation?: boolean): void;
    private expandLocateTargets;
    setLocateResultSet(uuids: string[], focusUuid?: string | null): void;
    setLocateFocusContext(uuids: string[], focusUuid?: string | null, highlightColors?: Record<string, string>): void;
    setLocateFocus(uuid: string | null): void;
    highlightObjects(uuids: string[]): void;
    /**
     * 通用多构件聚焦高亮入口：
     * - 高亮 uuids 中的所有物体
     * - 可选 fitView 将镜头飞到这批物体
     * - 可选 highlightColors 支持按 UUID 指定不同颜色（碰撞场景 A/B 色对）
     * - 传空数组等同于 clearLocateFocus()
     */
    focusHighlightObjects(uuids: string[], options?: {
        fitView?: boolean;
        focusUuid?: string | null;
        highlightColors?: Record<string, string>;
    }): void;
    collectRenderableTargets(uuids?: string[]): RenderTarget[];
    pick(clientX: number, clientY: number): {
        object: THREE.Object3D;
        intersect: THREE.Intersection;
    } | null;
    getRayIntersects(clientX: number, clientY: number): THREE.Intersection | null;
    computeTotalBounds(onlyVisible?: boolean, forceRecompute?: boolean): THREE.Box3;
    updateSceneBounds(): void;
    fitView(keepOrientation?: boolean): void;
    private unionObjectBounds;
    private unionTilesNodeBounds;
    private unionOptimizedBounds;
    private unionNodeBounds;
    fitViewToObject(uuid: string): void;
    getBoundsForObject(uuid: string): THREE.Box3;
    collectBoundsForUuids(uuids: string[]): THREE.Box3;
    fitViewToObjects(uuids: string[]): void;
    fitBox(box: THREE.Box3, updateCameraPosition?: boolean, paddingOverride?: number, needsCullingOnCameraMove?: boolean): void;
    setView(view: string): void;
    getCameraState(): {
        position: THREE.Vector3Tuple;
        target: THREE.Vector3Tuple;
        zoom: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    setCameraState(state: any): void;
    locateMeasurement(id: string): void;
    startMeasurement(type: MeasureType): void;
    addMeasurePoint(point: THREE.Vector3, modelUuid?: string): {
        id: string;
        type: string;
        val: string;
    } | null;
    private updateMeasurePreview;
    updateMeasureHover(clientX: number, clientY: number): void;
    finalizeMeasurement(): {
        id: string;
        type: string;
        val: string;
    };
    highlightMeasurement(id: string | null): void;
    pickMeasurement(clientX: number, clientY: number): string | null;
    /**
     * 获取对象的面积和体积
     */
    getObjectGeometryData(uuid: string): {
        area: number;
        volume: number;
    };
    /**
     * 开始框选
     */
    startBoxSelect(clientX: number, clientY: number): void;
    /**
     * 更新框选范围
     */
    updateBoxSelect(clientX: number, clientY: number): void;
    /**
     * 完成框选，返回选中的对象 UUID 列表
     */
    endBoxSelect(): string[];
    /**
     * 取消框选
     */
    cancelBoxSelect(): void;
    /**
     * 通过屏幕矩形选择对象
     */
    private selectByScreenRect;
    removeMeasurement(id: string): void;
    clearAllMeasurements(): void;
    clearMeasurementPreview(): void;
    setupClipping(): void;
    setClipHelperOptions(options: {
        visible?: boolean;
        opacity?: number;
    }): void;
    setClippingEnabled(enabled: boolean): void;
    updateClippingPlanes(bounds: THREE.Box3, values: {
        x: number[];
        y: number[];
        z: number[];
    }, active: {
        x: boolean;
        y: boolean;
        z: boolean;
    }): void;
    /**
     * 检查包围盒是否完全被当前剖切面裁剪掉
     * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
     */
    private isBoxClipped;
    getStats(): SceneManagerStats;
    dispose(): void;
}
export type { PerformancePreset, SceneChunkOptions, SceneManagerOptions };
export type { MeasurementRecord, MeasureType, SceneManagerStats, SceneSettings, StructureTreeNode };
