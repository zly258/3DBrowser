# 3D Browser API Documentation

[English](#english-documentation) | [中文文档](#中文文档)

---

<a name="english-documentation"></a>

## English Documentation

A high-performance 3D model browser based on Three.js, designed for BIM, architectural, and large-scale model visualization.

### 1. NPM Publication

To publish this project as an NPM package, follow these steps:

1.  **Build the project**:
    ```bash
    npm run build
    ```
    This will generate the `dist` folder containing the library files.

2.  **Login to NPM**:
    ```bash
    npm login
    ```

3.  **Publish**:
    ```bash
    npm publish
    ```

### 2. Local Development Usage

If you want to use this library in another local project without publishing to NPM:

#### Method A: Using `npm link` (Recommended)
1. In the `3dbrowser` project directory:
   ```bash
   npm run build
   npm link
   ```
2. In your other project directory:
   ```bash
   npm link 3dbrowser
   ```

#### Method B: Using Local Path
In your other project's `package.json`, add:
```bash
npm install ../path/to/3dbrowser
```
*(Replace `../path/to/3dbrowser` with the actual relative path to this project)*

### 3. Installation

```bash
npm install 3dbrowser
```

### 3. Basic Usage

#### SceneManager
The `SceneManager` is the core class for managing the 3D scene, cameras, and loaders.

**JavaScript / TypeScript Example:**
```typescript
import { SceneManager } from '3dbrowser';

// Initialize with a canvas element
const canvas = document.querySelector('#my-canvas');
const sceneMgr = new SceneManager(canvas);

// Load models from files
const files = [/* File objects from <input type="file"> */];
sceneMgr.loadModelFiles(files, (progress, message) => {
  console.log(`Loading: ${progress}% - ${message}`);
});

// Load a 3D Tileset from URL
sceneMgr.addTileset('https://example.com/tileset.json');

// Auto-fit the camera to the scene
sceneMgr.fitView();
```

### 4. Detailed API Reference

#### `SceneManager`

| Method | Description |
| :--- | :--- |
| `constructor(canvas: HTMLCanvasElement)` | Initializes the manager. |
| `loadModelFiles(files: File[], onProgress?: ProgressCallback): Promise<void>` | Loads multiple 3D files. |
| `addTileset(url: string, onProgress?: ProgressCallback): void` | Adds a 3D Tileset. |
| `setView(view: ViewName): void` | Sets camera view (top, bottom, se, etc.). |
| `fitView(): void` | Focuses camera on all objects. |
| `clear(): Promise<void>` | Clears the entire scene. |
| `updateSettings(settings: Partial<SceneSettings>): void` | Updates scene configuration. |
| `setObjectVisibility(uuid: string, visible: boolean): void` | Toggles object visibility. |
| `highlightObject(uuid: string \| null): void` | Highlights an object by UUID. |

#### `SceneSettings`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ambientInt` | `number` | `1.0` | Ambient light intensity. |
| `dirInt` | `number` | `1.5` | Directional light intensity. |
| `viewCubeSize` | `number` | `100` | Size of the navigation cube. |
| `bgColor` | `string` | `#ffffff` | Scene background color. |
| `enableInstancing`| `boolean`| `true` | Enable GPU instancing for LMB. |
| `appMode` | `'local' \| 'remote'` | `'local'` | UI mode (file vs URL). |

### 5. React Components

#### `ThreeViewer`
The primary reusable component that encapsulates the entire 3D viewer.

**Props:**

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lang` | `'zh' \| 'en'` | `'zh'` | Initial language. |
| `themeMode` | `'dark' \| 'light'` | `'light'` | Theme mode. |
| `accentColor` | `string` | `#0078D4` | Accent color. |
| `menuMode` | `'ribbon' \| 'classic'` | `'ribbon'` | Menu bar style. |
| `showStats` | `boolean` | `true` | Show performance stats. |
| `showOutline` | `boolean` | `true` | Show scene tree panel. |
| `showProps` | `boolean` | `true` | Show properties panel. |
| `showLogo` | `boolean` | `true` | Show top logo. |
| `showTitle` | `boolean` | `true` | Show top title. |
| `showMiddleTitle`| `boolean` | `true` | Show middle title. |
| `showMenuBar` | `boolean` | `true` | Show menu bar. |
| `showViewCube` | `boolean` | `true` | Show navigation cube. |
| `logoUrl` | `string` | - | Custom logo URL. |
| `title` | `string` | - | Custom title text. |
| `middleTitle` | `string` | - | Custom middle title text. |
| `hiddenMenus` | `string[]` | `[]` | List of menu IDs to hide. |
| `initialSettings` | `Partial<SceneSettings>` | - | Initial scene settings. |
| `onSceneReady` | `(mgr: SceneManager) => void` | - | Callback when scene is ready. |

**Usage:**
```tsx
import { ThreeViewer } from '3dbrowser';

const App = () => {
  return (
    <ThreeViewer 
      themeMode="dark"
      showStats={true}
      title="My 3D Viewer"
      hiddenMenus={['export', 'about']}
      onSceneReady={(mgr) => {
        console.log('Viewer is ready!', mgr);
      }}
    />
  );
};
```

### 6. CAD Support (STP/IGS)
The library supports loading STP and IGS files using `occt-import-js`. 
- **Coordinate System**: The viewer uses a **Z-up** coordinate system (matching engineering standards).
- **Auto-Correction**: Models are automatically rotated to match the Z-up orientation based on their source format.

### 7. Development

To contribute to this project:

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Run dev server: `npm run dev`.
4.  Run in Electron: `npm run electron:dev`.

### 7. License

This project is licensed under the MIT License.

---

<a name="中文文档"></a>

## 中文文档

基于 Three.js 的高性能 3D 模型浏览器，专为 BIM、建筑和大规模模型可视化而设计。

### 1. 发布到 NPM

要将此项目发布为 NPM 包，请遵循以下步骤：

1.  **构建项目**:
    ```bash
    npm run build
    ```
    这将生成包含库文件的 `dist` 文件夹。

2.  **登录 NPM**:
    ```bash
    npm login
    ```

3.  **发布**:
    ```bash
    npm publish
    ```

### 2. 本地开发引用

如果您想在不发布到 NPM 的情况下在本地其他项目中使用此库：

#### 方法 A: 使用 `npm link` (推荐)
1. 在 `3dbrowser` 项目目录下执行：
   ```bash
   npm run build
   npm link
   ```
2. 在您的另一个项目目录下执行：
   ```bash
   npm link 3dbrowser
   ```

#### 方法 B: 使用本地路径安装
在您的另一个项目目录下，直接通过路径安装：
```bash
npm install ../path/to/3dbrowser
```
*(将 `../path/to/3dbrowser` 替换为本项目的实际相对路径)*

### 3. 安装

```bash
npm install 3dbrowser
```

### 3. 基本用法

#### 场景管理器 (SceneManager)
`SceneManager` 是管理 3D 场景、相机和加载器的核心类。

**JavaScript / TypeScript 示例:**
```typescript
import { SceneManager } from '3dbrowser';

// 使用 canvas 元素初始化
const canvas = document.querySelector('#my-canvas');
const sceneMgr = new SceneManager(canvas);

// 从文件加载模型
const files = [/* 从 <input type="file"> 获取的文件对象 */];
sceneMgr.loadModelFiles(files, (progress, message) => {
  console.log(`加载中: ${progress}% - ${message}`);
});

// 从 URL 加载 3D Tiles
sceneMgr.addTileset('https://example.com/tileset.json');

// 相机自动适配场景
sceneMgr.fitView();
```

### 4. 详细 API 参考

#### `SceneManager`

| 方法 | 描述 |
| :--- | :--- |
| `constructor(canvas: HTMLCanvasElement)` | 初始化管理器。 |
| `loadModelFiles(files: File[], onProgress?: ProgressCallback): Promise<void>` | 加载多个 3D 文件。 |
| `addTileset(url: string, onProgress?: ProgressCallback): void` | 添加 3D Tiles。 |
| `setView(view: ViewName): void` | 设置相机视角 (top, bottom, se 等)。 |
| `fitView(): void` | 相机聚焦所有物体。 |
| `clear(): Promise<void>` | 清空整个场景。 |
| `updateSettings(settings: Partial<SceneSettings>): void` | 更新场景配置。 |
| `setObjectVisibility(uuid: string, visible: boolean): void` | 切换对象可见性。 |
| `highlightObject(uuid: string \| null): void` | 通过 UUID 高亮对象。 |

#### `SceneSettings` (场景设置)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `ambientInt` | `number` | `1.0` | 环境光强度。 |
| `dirInt` | `number` | `1.5` | 直射光强度。 |
| `viewCubeSize` | `number` | `100` | 导航方块大小。 |
| `bgColor` | `string` | `#ffffff` | 场景背景颜色。 |
| `enableInstancing`| `boolean`| `true` | 开启 LMB 实例化渲染。 |
| `appMode` | `'local' \| 'remote'` | `'local'` | UI 模式（本地 vs 远程）。 |

### 5. React 组件

#### `ThreeViewer`
核心可复用组件，封装了完整的 3D 浏览器功能。

**属性 (Props):**

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `lang` | `'zh' \| 'en'` | `'zh'` | 初始语言。 |
| `themeMode` | `'dark' \| 'light'` | `'light'` | 主题模式。 |
| `accentColor` | `string` | `#0078D4` | 强调色。 |
| `menuMode` | `'ribbon' \| 'classic'` | `'ribbon'` | 菜单栏样式。 |
| `showStats` | `boolean` | `true` | 是否显示性能统计。 |
| `showOutline` | `boolean` | `true` | 是否显示场景树面板。 |
| `showProps` | `boolean` | `true` | 是否显示属性面板。 |
| `showLogo` | `boolean` | `true` | 是否显示顶部 Logo。 |
| `showTitle` | `boolean` | `true` | 是否显示顶部标题。 |
| `showMiddleTitle`| `boolean` | `true` | 是否显示中间标题。 |
| `showMenuBar` | `boolean` | `true` | 是否显示菜单栏。 |
| `showViewCube` | `boolean` | `true` | 是否显示导航方块。 |
| `logoUrl` | `string` | - | 自定义 Logo URL。 |
| `title` | `string` | - | 自定义标题文本。 |
| `middleTitle` | `string` | - | 自定义中间标题文本。 |
| `hiddenMenus` | `string[]` | `[]` | 需要隐藏的菜单 ID 列表。 |
| `initialSettings` | `Partial<SceneSettings>` | - | 初始场景设置。 |
| `onSceneReady` | `(mgr: SceneManager) => void` | - | 场景初始化完成后的回调。 |

**用法:**
```tsx
import { ThreeViewer } from '3dbrowser';

const App = () => {
  return (
    <ThreeViewer 
      themeMode="dark"
      showStats={true}
      title="我的 3D 浏览器"
      hiddenMenus={['export', 'about']}
      onSceneReady={(mgr) => {
        console.log('浏览器已就绪!', mgr);
      }}
    />
  );
};
```

### 6. CAD 支持 (STP/IGS)
本库支持通过 `occt-import-js` 加载 STP 和 IGS 文件。
- **坐标系**: 浏览器采用 **Z轴向上 (Z-up)** 坐标系（符合工程与建筑标准）。
- **自动校正**: 模型加载时会根据其原始格式自动旋转，以匹配浏览器的 Z-up 方向。

### 7. 开发

参与本项目开发：

1.  克隆仓库。
2.  安装依赖: `npm install`。
3.  启动开发服务器: `npm run dev`。
4.  在 Electron 中运行: `npm run electron:dev`。

### 7. 授权

本项目采用 MIT 授权。
