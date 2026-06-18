import { jsx as t, jsxs as c, Fragment as ge } from "react/jsx-runtime";
import jt, { useRef as ue, useState as V, useEffect as ce, useMemo as Ie, useCallback as j, useLayoutEffect as Ea, Component as Ia } from "react";
import { a as Da, s as $n, b as en, e as Aa, c as za, S as Ba } from "./utils-BKVlSVq3.js";
import * as E from "three";
import { OBB as $a } from "three/examples/jsm/math/OBB.js";
const yn = {
  light: {
    bg: "#f8fafc",
    panelBg: "#ffffff",
    headerBg: "#f1f5f9",
    border: "#e2e8f0",
    text: "#0f172a",
    textLight: "#0f172a",
    textMuted: "#64748b",
    accent: "#4f46e5",
    highlight: "rgba(79, 70, 229, 0.08)",
    itemHover: "rgba(79, 70, 229, 0.05)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    canvasBg: "#ffffff",
    shadow: "rgba(15, 23, 42, 0.08)"
  }
}, ss = "'Plus Jakarta Sans', 'Inter', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif", ls = yn.light;
function He(e) {
  return typeof window > "u" ? "" : getComputedStyle(document.documentElement).getPropertyValue(e).trim();
}
function cs() {
  const e = yn.light, n = {
    bg: He("--bg-primary"),
    panelBg: He("--bg-panel"),
    headerBg: He("--bg-header"),
    border: He("--border-color"),
    text: He("--text-primary"),
    textLight: "#000000",
    textMuted: He("--text-muted"),
    accent: He("--accent"),
    highlight: He("--bg-selected"),
    itemHover: He("--bg-hover"),
    success: He("--success"),
    warning: He("--warning"),
    danger: He("--error"),
    canvasBg: He("--bg-canvas"),
    shadow: He("--shadow-md")
  };
  return {
    bg: n.bg || e.bg,
    panelBg: n.panelBg || e.panelBg,
    headerBg: n.headerBg || e.headerBg,
    border: n.border || e.border,
    text: n.text || e.text,
    textLight: n.textLight || e.textLight,
    textMuted: n.textMuted || e.textMuted,
    accent: n.accent || e.accent,
    highlight: n.highlight || e.highlight,
    itemHover: n.itemHover || e.itemHover,
    success: n.success || e.success,
    warning: n.warning || e.warning,
    danger: n.danger || e.danger,
    canvasBg: n.canvasBg || e.canvasBg,
    shadow: n.shadow || e.shadow
  };
}
const Va = {
  en: {
    home: "Home",
    menu_open_file: "Open File",
    menu_open_folder: "Open Folder",
    menu_open_url: "Open URL",
    menu_batch_convert: "Batch Convert",
    menu_file: "File",
    menu_export: "Export",
    interface_display: "Display",
    view: "View",
    menu_fit_view: "Fit View",
    view_top: "Top",
    view_bottom: "Bottom",
    view_front: "Front",
    view_back: "Back",
    view_left: "Left",
    view_right: "Right",
    view_se: "SE",
    view_sw: "SW",
    view_ne: "NE",
    view_nw: "NW",
    cube_top: "Top",
    cube_bottom: "Bottom",
    cube_front: "Front",
    cube_back: "Back",
    cube_left: "Left",
    cube_right: "Right",
    op_pick: "Select Model",
    op_clear: "Clear",
    tool_measure: "Measure",
    tool: "Tools",
    tool_clip: "Section",
    settings: "Settings",
    setting_general: "Preferences",
    interface_outline: "Structures",
    interface_props: "Properties",
    status_ready: "Ready",
    loading_resources: "Loading resources...",
    analyzing: "Analyzing...",
    reading: "Reading",
    success: "Operation Successful",
    failed: "Failed",
    model_load_failed_rollback: "Model loading failed. Rolled back incomplete model.",
    processing: "Processing",
    no_selection: "No selection",
    no_models: "No model loaded",
    no_measurements: "No measurements",
    search_nodes: "Search nodes...",
    search_props: "Search properties...",
    copy_all_props: "Copy All",
    copy_group_props: "Copy Group",
    expand_group: "Expand Group",
    collapse_group: "Collapse Group",
    copy_item_props: "Copy Item",
    copy_prop_key: "Copy Property Name",
    copy_prop_value: "Copy Property Value",
    error_detail: "Error Details",
    prop_groups: "Groups",
    prop_items: "Items",
    about_version: "Version",
    ifc_view_normalized: "Normalized",
    ifc_view_raw: "Raw IFC",
    ifc_filter_storey: "All Storeys",
    ifc_filter_elevation: "All Elevations",
    ifc_filter_system: "All Systems",
    ifc_filter_category: "All Categories",
    ifc_filter_material: "All Materials",
    ifc_filter_clear: "Clear Filters",
    ifc_filter_apply_viewport: "Apply To Viewport",
    ifc_filter_applied: "IFC filter isolated",
    no_matching_ifc_filter: "No components match the current IFC filter",
    ifc_workset_current: "Current Storey",
    ifc_workset_adjacent: "Adjacent Storeys",
    ifc_workset_applied: "Storey workset isolated",
    expand_all: "Expand All",
    collapse_all: "Collapse All",
    isolate_selection: "Isolate Selection",
    clear_selection: "Clear Selection",
    ctx_show_all: "Restore Visibility",
    hide_selected: "Hide Selected",
    show_all: "Restore Visibility",
    ctx_hide_selection: "Hide Selection",
    monitor_meshes: "Mesh",
    monitor_faces: "Faces",
    monitor_mem: "Mem",
    monitor_calls: "Calls",
    selected_count: "Selected",
    tips_rotate: "LMB: Rotate",
    tips_pan: "MMB: Pan",
    tips_zoom: "Scroll: Zoom",
    confirm_delete: "Confirm delete",
    confirm_clear: "Are you sure you want to clear the scene?",
    app_title: "3D Browser - Professional Viewer",
    interface_display_short: "Display",
    view_perspective: "Perspective",
    view_ortho: "Orthographic",
    writing: "Writing files...",
    delete_item: "Delete Item",
    btn_confirm: "Confirm",
    btn_cancel: "Cancel",
    panel_close: "Close",
    // 属性
    pg_basic: "Basic Information",
    pg_geo: "Geometry",
    pg_clash: "Clash Status",
    prop_name: "Name",
    prop_id: "ID",
    prop_type: "Type",
    prop_status: "Status",
    prop_pos: "Position",
    prop_dim: "Dimensions",
    prop_inst: "Instances",
    prop_vert: "Vertices",
    prop_tri: "Triangles",
    prop_area: "Area",
    prop_volume: "Volume",
    // 测量
    measure_title: "Measurement Tool",
    measure_type: "Type",
    measure_none: "None",
    measure_dist: "Distance",
    measure_angle: "Angle",
    measure_coord: "Coordinate",
    measure_instruct_dist: "Click 2 points to measure distance.",
    measure_instruct_angle: "Click 3 points (Start-Vertex-End).",
    measure_instruct_coord: "Click any point to get coordinates.",
    measure_clear: "Clear All",
    measure_start: "Start",
    measure_stop: "Stop",
    measure_panel_hint: "Choose a mode, then click points in the viewport to measure.",
    tb_boxSelect: "Box Select",
    tb_boxSelect_hint: "Drag to select objects",
    tb_wireframe: "Wireframe",
    op_screenshot: "Screenshot",
    // 渲染样式
    display_mode: "DisplayMode",
    dm_solid: "Solid",
    dm_transparent: "Transparent",
    dm_wireframe: "Wireframe",
    dm_solidwire: "Solid with Outline",
    dm_hidden: "Hidden Line",
    // 剖切
    clip_title: "Sectioning Tool",
    clip_enable: "Enable Clipping",
    clip_x: "X Axis",
    clip_y: "Y Axis",
    clip_z: "Z Axis",
    clip_helper_visible: "Show Helpers",
    clip_helper_opacity: "Helper Opacity",
    clip_reset: "Reset Range",
    // 导出
    export_title: "Export Scene",
    export_format: "Format",
    export_glb: "GLB (Standard)",
    export_lmb: "LMB (Custom Compressed)",
    export_nbim: "NBIM (High Performance)",
    export_filename: "File Name",
    export_filename_placeholder: "Enter file name",
    export_filename_hint: "Leave empty to auto-generate from model names",
    export_batch_name: "batch_export",
    export_btn: "Export",
    // 设置
    st_lighting: "Lighting",
    st_ambient: "Ambient Int.",
    st_dir: "Direct Int.",
    st_back: "Back Light Int.",
    st_render_mode: "Render Mode",
    st_render_standard: "Standard",
    st_render_mayo: "Mayo",
    st_render_blender: "Blender",
    st_sun_simulation: "Sun Simulation",
    st_sun_enabled: "Enable Sun",
    st_sun_latitude: "Latitude",
    st_sun_longitude: "Longitude",
    st_sun_time: "Time",
    st_sun_info: "Set location and time for realistic sunlight",
    st_sun_shadow: "Show Shadows",
    st_bg: "Background",
    st_lang: "Language",
    st_theme: "Theme",
    st_menu_mode: "Menu Mode",
    menu_mode_menu: "Menu",
    menu_mode_toolbar: "Toolbar",
    tb_file: "File",
    tb_folder: "Folder",
    tb_export: "Export",
    tb_clear: "Clear",
    tb_fit: "Fit",
    tb_view: "View",
    tb_model: "Model",
    tb_props: "Props",
    tb_pick: "Pick",
    tb_measure: "Measure",
    tb_clip: "Clip",
    tb_screenshot: "Shot",
    tb_settings: "Setting",
    tb_about: "About",
    tb_search: "Search",
    tb_clash: "Clash",
    tb_sun: "Sun",
    tb_explode: "Explode",
    search_conditions: "Search Conditions",
    search_field_name: "Property Name",
    search_field_value: "Property Value",
    search_add_condition: "Add Condition",
    search_run: "Search",
    search_clear: "Clear Results",
    search_no_results: "No Results",
    search_page_size: "Per Page",
    search_page_prev: "Prev",
    search_page_next: "Next",
    searching: "Searching...",
    search_invalid_condition: "Please fill at least one complete condition",
    search_fields_total: "Searchable fields",
    search_field_filter: "Filter property names",
    search_no_fields: "No searchable fields",
    search_index_building: "Building property index...",
    search_cancel: "Cancel Search",
    search_cancelled: "Search Cancelled",
    remove_condition: "Remove Condition",
    search_connector_and: "AND",
    search_connector_or: "OR",
    search_op_equals: "Equals",
    search_op_contains: "Contains",
    search_op_not_contains: "Not Contains",
    search_op_starts_with: "Starts With",
    search_op_ends_with: "Ends With",
    clash_placeholder: "Clash detection will be implemented in phase 2. This phase keeps the toolbar entry and panel scaffold.",
    clash_run: "Run Check",
    clash_clear: "Clear Results",
    clash_ready: "Ready",
    clash_collecting: "Collecting Candidates...",
    clash_running: "Running clash detection...",
    clash_results: "Clash Results",
    clash_no_results: "No clash results",
    clash_scope_visible: "Scope: Visible objects",
    clash_candidates: "Candidates",
    clash_overlap_volume: "Overlap Volume",
    clash_distance: "Clearance Distance",
    clash_insufficient_candidates: "Not enough candidates (at least 2 required)",
    clash_set_a: "Model Set A",
    clash_set_b: "Model Set B",
    clash_no_models: "No models",
    clash_tolerance: "Tolerance",
    clash_min_overlap: "Min Overlap Volume",
    clash_clearance_distance: "Min Clearance Distance",
    clash_clearance_value: "Clearance Distance",
    clash_detection_type: "Detection Type",
    clash_type_all: "All Types",
    clash_type_hard: "Hard Clash",
    clash_type_clearance: "Clearance Clash",
    clash_narrow_phase: "Enable Narrow Phase (OBB)",
    clash_triangle_phase: "Enable Triangle Validation",
    clash_include_same_model: "Include Intra-model Checks",
    clash_pairs_scanned: "Pairs Scanned",
    clash_export_csv: "Export CSV",
    clash_group_all: "All",
    clash_group_new: "New",
    clash_group_confirmed: "Confirmed",
    clash_group_resolved: "Resolved",
    clash_mark_confirmed: "Mark Group Confirmed",
    clash_mark_resolved: "Mark Group Resolved",
    clash_mark_new: "Mark Group New",
    clash_isolate_new: "Isolate New",
    clash_isolate_confirmed: "Isolate Confirmed",
    clash_severity_high: "High",
    clash_severity_medium: "Medium",
    clash_severity_low: "Low",
    tree_clash_only: "Clash Nodes Only",
    st_monitor: "Performance Panel",
    st_locate_isolate: "Isolate on Locate",
    st_locate_isolate_hint: "Search, clash and tree locate will show only the located objects.",
    st_locate_mode: "Locate Mode",
    st_locate_mode_normal: "Normal",
    st_locate_mode_isolate: "Isolate",
    st_locate_mode_normal_hint: "Move the camera and highlight objects only. No material opacity changes; fastest for large models.",
    st_locate_mode_isolate_hint: "Temporarily hide other objects when locating. No material opacity changes, but restoring visibility may still be slower on huge models.",
    st_adaptive_quality: "Adaptive Quality",
    st_performance_profile: "Performance Profile",
    st_perf_smooth: "Smooth",
    st_perf_balanced: "Balanced",
    st_perf_quality: "Quality",
    st_exposure: "Exposure",
    st_tonemapping: "Tone Mapping",
    st_shadow_quality: "Shadow Quality",
    st_shadow_off: "Off",
    st_shadow_low: "Low",
    st_shadow_medium: "Medium",
    st_shadow_high: "High",
    st_instancing: "Instancing Render",
    st_viewport: "Viewport",
    st_viewcube_size: "ViewCube Size",
    st_frustum_culling: "Frustum Culling",
    st_highlight: "Highlight",
    st_highlight_color: "Highlight Color",
    st_highlight_box: "Highlight / Locate Box",
    st_highlight_box_hint: "When enabled, both highlight and locate show a bounding box. When disabled, only color highlight and camera focus are used.",
    unsupported_format: "Unsupported format",
    theme_dark: "Dark",
    theme_light: "Light",
    ready: "ready",
    all_chunks_loaded: "All model chunks loaded",
    loading_chunks: "Chunks",
    loading_cad_engine: "Loading CAD engine...",
    parsing_cad_data: "Parsing CAD data...",
    creating_geometry: "Creating geometry...",
    error_cad_parse_failed: "Failed to parse CAD file",
    model_loaded: "Model loaded",
    confirm_clear_title: "Clear Scene",
    confirm_clear_msg: "Are you sure you want to clear all models in the scene?",
    menu_about: "About",
    about_title: "About 3D Browser",
    about_author: "Author",
    about_tagline: "Professional 3D Model Viewer",
    about_copyright: "Copyright © 2026. All rights reserved.",
    project_url: "Project URL",
    about_license: "License",
    about_license_nc: "Non-commercial Use Only",
    license_details: "License Details",
    third_party_libs: "Third-party Libraries",
    license_summary: `This software is licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).

Key terms:
• Free for non-commercial use only
• Commercial use is strictly prohibited
• Attribution required
• ShareAlike for adaptations (non-commercial)
• No warranties or liability

For commercial licensing, contact: zhangly1403@163.com`,
    third_party_desc: "This software uses the following open-source libraries:",
    view_package_json: "View full dependency list in package.json",
    full_license: "Full license:",
    error_title: "Application Error",
    error_msg: "Sorry, the application encountered an unexpected error. You can try reloading the page or contact the developer.",
    error_reload: "Reload Page",
    viewpoint_title: "Viewpoint Management",
    viewpoint_save: "Save Current Viewpoint",
    viewpoint_empty: "No saved viewpoints",
    viewpoint_loading: "Restoring viewpoint",
    viewpoint_default_name: "Viewpoint",
    viewpoint_load: "Restore",
    viewpoint_load_hint: "Double click to restore",
    viewpoint_overwrite: "Overwrite",
    viewpoint_no_preview: "No preview",
    viewpoint_save_visibility: "Save visibility",
    viewpoint_save_selection: "Save selection",
    viewpoint_save_clip: "Save clipping",
    viewpoint_save_explode: "Save explode",
    viewpoint_flag_visibility: "Visibility",
    viewpoint_flag_selection: "Selection",
    viewpoint_flag_clip: "Clip",
    viewpoint_flag_explode: "Explode",
    chunk_loading: "Chunks",
    select_all: "Select All",
    invert_selection: "Invert Selection",
    set_opacity: "Opacity",
    copied: "Copied",
    click_to_copy: "Click to copy",
    search_results: "Results",
    search_selected_results: "Checked",
    search_batch_highlight: "Batch Highlight",
    search_add_to_selection: "Add To Selection",
    search_export_results: "Export Results",
    locate_in_view: "Locate in View",
    settings_more: "More Settings",
    locate_first_match: "Locate First Match",
    ifc_locator_all: "All",
    ifc_locator_name: "Name",
    ifc_locator_globalid: "GlobalId",
    ifc_locator_classification: "Classification",
    ifc_locator_type: "Type",
    ifc_locator_placeholder: "Locate by IFC identifier...",
    ifc_locator_results: "IFC Matches",
    ifc_locator_prev: "Previous",
    ifc_locator_next: "Next",
    ifc_locator_action: "Locate Element",
    explode_title: "Explode View",
    explode_enable: "Enable",
    explode_strength: "Strength",
    explode_mode: "Mode",
    explode_mode_radial: "Radial",
    explode_mode_horizontal: "Horizontal",
    explode_mode_vertical: "Vertical",
    explode_reset: "Reset",
    op_screenshot_transparent: "Transparent Screenshot",
    screenshot_mode: "Capture Mode",
    screenshot_scene_desc: "Export PNG with the current scene background",
    screenshot_transparent_desc: "Export transparent PNG for documents and overlays",
    summary_parent: "Parent",
    summary_children: "Children",
    summary_visible: "Visible",
    summary_yes: "Yes",
    summary_no: "No",
    summary_models: "Models",
    summary_types: "Type Mix",
    summary_bounds: "Selection Bounds",
    summary_total_area: "Total Area",
    summary_total_volume: "Total Volume",
    mode_measure: "Measuring",
    mode_clip: "Clipping",
    mode_search: "Search Highlight",
    mode_hidden: "Hidden Objects",
    mode_isolated: "Isolated Objects",
    mode_box_select: "Box Selection",
    mode_clash: "Clash Active",
    mode_clear: "Clear",
    mode_restore_visibility: "Restore",
    stats_original_meshes: "Original Meshes",
    stats_triangles: "Triangles",
    stats_chunks: "Chunks",
    stats_pixel_ratio: "Pixel Ratio",
    confirm: "Confirm",
    view_home: "Home View"
  },
  zh: {
    home: "首页",
    view_home: "主视图",
    menu_open_file: "打开文件",
    menu_open_folder: "打开目录",
    menu_open_url: "打开 URL",
    menu_batch_convert: "批量转换",
    menu_file: "文件",
    menu_export: "导出场景",
    interface_display: "界面",
    view: "视图",
    menu_fit_view: "充满视图",
    view_top: "顶视",
    view_bottom: "底视",
    view_front: "前视",
    view_back: "后视",
    view_left: "左视",
    view_right: "右视",
    view_se: "东南",
    view_sw: "西南",
    view_ne: "东北",
    view_nw: "西北",
    cube_top: "顶",
    cube_bottom: "底",
    cube_front: "前",
    cube_back: "后",
    cube_left: "左",
    cube_right: "右",
    op_pick: "选择模式",
    op_clear: "清空场景",
    tool: "工具",
    tool_measure: "测量工具",
    tool_clip: "剖切工具",
    settings: "设置",
    setting_general: "全局设置",
    interface_outline: "模型结构",
    interface_props: "对象属性",
    status_ready: "就绪",
    loading_resources: "正在加载资源...",
    analyzing: "正在分析...",
    reading: "读取",
    success: "操作成功",
    failed: "失败",
    model_load_failed_rollback: "模型加载失败，已回滚未完成模型。",
    processing: "处理中",
    no_selection: "未选择对象",
    no_models: "未加载模型",
    no_measurements: "无测量结果",
    search_nodes: "搜索节点...",
    search_props: "搜索属性...",
    copy_all_props: "复制全部",
    copy_group_props: "复制组",
    expand_group: "展开分组",
    collapse_group: "折叠分组",
    copy_item_props: "复制单项",
    copy_prop_key: "复制属性名",
    copy_prop_value: "复制属性值",
    error_detail: "错误详情",
    prop_groups: "分组",
    prop_items: "条目",
    about_version: "版本",
    ifc_view_normalized: "规范化",
    ifc_view_raw: "原始 IFC",
    ifc_filter_storey: "全部楼层",
    ifc_filter_elevation: "全部标高",
    ifc_filter_system: "全部系统",
    ifc_filter_category: "全部类别",
    ifc_filter_material: "全部材质",
    ifc_filter_clear: "清除筛选",
    ifc_filter_apply_viewport: "应用到视口",
    ifc_filter_applied: "已按 IFC 筛选隔离显示",
    no_matching_ifc_filter: "没有匹配当前 IFC 筛选的构件",
    ifc_workset_current: "当前楼层",
    ifc_workset_adjacent: "上下楼层",
    ifc_workset_applied: "已按楼层工作集隔离显示",
    expand_all: "全部展开",
    collapse_all: "全部折叠",
    isolate_selection: "隔离选择",
    clear_selection: "清空选择",
    ctx_show_all: "恢复显示",
    hide_selected: "隐藏选中",
    show_all: "恢复显示",
    ctx_hide_selection: "隐藏选择",
    monitor_meshes: "网格",
    monitor_faces: "面",
    monitor_mem: "显存",
    monitor_calls: "绘制",
    selected_count: "已选择",
    tips_rotate: "左键：旋转",
    tips_pan: "中键：平移",
    tips_zoom: "滚轮：缩放",
    confirm_delete: "确定要删除吗？",
    confirm_clear: "确定要清空场景吗？",
    app_title: "3D Browser - 专业浏览器",
    interface_display_short: "显示",
    view_perspective: "透视",
    view_ortho: "正交",
    delete_item: "删除模型",
    btn_confirm: "确定",
    btn_cancel: "取消",
    panel_close: "关闭",
    // 属性
    pg_basic: "基本信息",
    pg_geo: "几何信息",
    pg_clash: "碰撞状态",
    prop_name: "名称",
    prop_id: "ID",
    prop_type: "类型",
    prop_status: "状态",
    prop_pos: "位置",
    prop_dim: "尺寸",
    prop_inst: "实例数",
    prop_vert: "顶点数",
    prop_tri: "面数",
    prop_area: "面积",
    prop_volume: "体积",
    // 测量
    measure_title: "测量面板",
    measure_type: "测量类型",
    measure_none: "无",
    measure_dist: "长度",
    measure_angle: "角度",
    measure_coord: "坐标",
    measure_instruct_dist: "请在场景中点击两个点以测量距离。",
    measure_instruct_angle: "请点击三个点测量角度 (起点-顶点-终点)。",
    measure_instruct_coord: "点击任意位置获取世界坐标。",
    measure_clear: "清空测量",
    measure_start: "开始测量",
    measure_stop: "停止测量",
    measure_panel_hint: "选择测量方式后，在视口中点击点位开始测量。",
    tb_boxSelect: "框选",
    tb_boxSelect_hint: "拖拽选择对象",
    tb_wireframe: "线框",
    op_screenshot: "场景截图",
    // 渲染样式
    display_mode: "样式",
    dm_solid: "着色",
    dm_transparent: "透明",
    dm_wireframe: "线框",
    dm_solidwire: "着色带轮廓线",
    dm_hidden: "消隐",
    // 剖切
    clip_title: "剖切面板",
    clip_enable: "开启剖切",
    clip_x: "X 轴",
    clip_y: "Y 轴",
    clip_z: "Z 轴",
    clip_helper_visible: "显示辅助面",
    clip_helper_opacity: "辅助面透明度",
    clip_reset: "重置范围",
    // 导出
    export_title: "导出场景",
    export_format: "导出格式",
    export_glb: "GLB (标准通用)",
    export_lmb: "LMB (自定义压缩)",
    export_nbim: "NBIM (高性能分块模型)",
    export_filename: "文件名",
    export_filename_placeholder: "请输入文件名",
    export_filename_hint: "为空时自动按模型名生成",
    export_batch_name: "批量导出",
    export_btn: "开始导出",
    // 设置
    st_lighting: "场景光照",
    st_ambient: "环境光强度",
    st_dir: "直射光强度",
    st_back: "背光强度",
    st_render_mode: "渲染模式",
    st_render_standard: "标准",
    st_render_mayo: "Mayo",
    st_render_blender: "Blender",
    st_sun_simulation: "光照模拟",
    st_sun_enabled: "启用太阳光",
    st_sun_latitude: "纬度",
    st_sun_longitude: "经度",
    st_sun_time: "时间",
    st_sun_info: "设置位置和时间以模拟真实光照效果",
    st_sun_shadow: "显示阴影",
    st_bg: "背景颜色",
    st_lang: "界面语言",
    st_theme: "界面主题",
    st_menu_mode: "菜单模式",
    menu_mode_menu: "菜单",
    menu_mode_toolbar: "工具栏",
    tb_file: "文件",
    tb_folder: "目录",
    tb_export: "导出",
    tb_clear: "清空",
    tb_fit: "充满",
    tb_view: "视图",
    tb_model: "模型",
    tb_props: "属性",
    tb_pick: "选择",
    tb_measure: "测量",
    tb_clip: "剖切",
    tb_screenshot: "截图",
    tb_settings: "设置",
    tb_about: "关于",
    tb_search: "搜索",
    tb_clash: "碰撞",
    tb_sun: "光照",
    tb_explode: "爆炸",
    search_conditions: "搜索条件",
    search_field_name: "属性名",
    search_field_value: "属性值",
    search_add_condition: "添加条件",
    search_run: "搜索",
    search_clear: "清除结果",
    search_no_results: "暂无结果",
    search_page_size: "每页",
    search_page_prev: "上一页",
    search_page_next: "下一页",
    searching: "搜索中...",
    search_invalid_condition: "请至少输入一组完整的搜索条件",
    search_fields_total: "可搜索属性",
    search_field_filter: "搜索属性名",
    search_no_fields: "暂无可搜索属性",
    search_index_building: "正在构建属性索引...",
    search_cancel: "取消搜索",
    search_cancelled: "搜索已取消",
    remove_condition: "移除条件",
    search_connector_and: "且",
    search_connector_or: "或",
    search_op_equals: "等于",
    search_op_contains: "包含",
    search_op_not_contains: "不包含",
    search_op_starts_with: "开头",
    search_op_ends_with: "结尾",
    clash_placeholder: "碰撞检查将在下一期实现。本期已预留工具入口与结果面板结构。",
    clash_run: "开始检查",
    clash_clear: "清空结果",
    clash_ready: "准备就绪",
    clash_collecting: "正在收集候选构件...",
    clash_running: "正在执行碰撞检查...",
    clash_results: "碰撞结果",
    clash_no_results: "暂无碰撞结果",
    clash_scope_visible: "范围：当前可见构件",
    clash_candidates: "候选",
    clash_overlap_volume: "重叠体积",
    clash_distance: "净空距离",
    clash_insufficient_candidates: "可检测构件不足（至少需要2个）",
    clash_set_a: "模型集 A",
    clash_set_b: "模型集 B",
    clash_no_models: "暂无模型",
    clash_tolerance: "容差",
    clash_min_overlap: "最小重叠体积",
    clash_clearance_distance: "最小净空距离",
    clash_clearance_value: "净空距离",
    clash_detection_type: "检测类型",
    clash_type_all: "全部类型",
    clash_type_hard: "硬碰撞",
    clash_type_clearance: "净空碰撞",
    clash_narrow_phase: "启用精筛（OBB）",
    clash_triangle_phase: "启用三角面复核",
    clash_include_same_model: "包含同模型内检测",
    clash_pairs_scanned: "已扫描对数",
    clash_export_csv: "导出 CSV",
    clash_group_all: "全部",
    clash_group_new: "新建",
    clash_group_confirmed: "已确认",
    clash_group_resolved: "已解决",
    clash_mark_confirmed: "当前组标记已确认",
    clash_mark_resolved: "当前组标记已解决",
    clash_mark_new: "当前组标记新建",
    clash_isolate_new: "仅看新建",
    clash_isolate_confirmed: "仅看已确认",
    clash_severity_high: "高",
    clash_severity_medium: "中",
    clash_severity_low: "低",
    tree_clash_only: "仅显示冲突节点",
    st_monitor: "性能面板",
    st_locate_isolate: "定位隔离",
    st_locate_isolate_hint: "搜索、碰撞、模型树定位时只显示定位对象。",
    st_locate_mode: "定位方式",
    st_locate_mode_normal: "普通定位",
    st_locate_mode_isolate: "隔离定位",
    st_locate_mode_normal_hint: "只移动视图并高亮对象，不改材质透明度，速度最快。",
    st_locate_mode_isolate_hint: "定位时临时隐藏其他对象，不改材质透明度；超大模型恢复可见性仍可能较慢。",
    st_adaptive_quality: "自适应画质",
    st_performance_profile: "性能策略",
    st_perf_smooth: "流畅优先",
    st_perf_balanced: "平衡",
    st_perf_quality: "画质优先",
    st_exposure: "曝光",
    st_tonemapping: "色调映射",
    st_shadow_quality: "阴影质量",
    st_shadow_off: "关闭",
    st_shadow_low: "低",
    st_shadow_medium: "中",
    st_shadow_high: "高",
    st_instancing: "实例化渲染",
    st_viewport: "视口设置",
    st_viewcube_size: "导航方块大小",
    st_frustum_culling: "视锥体剔除",
    st_highlight: "高亮设置",
    st_highlight_color: "高亮颜色",
    st_highlight_box: "高亮/定位包围盒",
    st_highlight_box_hint: "开启后，高亮和定位都会显示包围盒；关闭后只保留颜色高亮和视图定位。",
    unsupported_format: "不支持的文件格式",
    theme_dark: "深色模式",
    theme_light: "浅色模式",
    ready: "就绪",
    all_chunks_loaded: "所有模型分片已加载",
    loading_chunks: "分片",
    loading_cad_engine: "正在加载 CAD 引擎...",
    parsing_cad_data: "正在解析 CAD 数据...",
    creating_geometry: "正在生成几何体...",
    error_cad_parse_failed: "CAD 文件解析失败",
    model_loaded: "模型加载完成",
    confirm_clear_title: "清空场景",
    confirm_clear_msg: "确定要清空场景中的所有模型吗？",
    menu_about: "关于",
    about_title: "关于 3D Browser",
    about_author: "作者",
    about_tagline: "专业三维模型查看器",
    about_copyright: "Copyright © 2026. All rights reserved.",
    project_url: "项目地址",
    about_license: "授权协议",
    about_license_nc: "仅限非商业用途",
    license_details: "授权协议详情",
    third_party_libs: "第三方库",
    license_summary: `本软件采用知识共享署名-非商业性使用 4.0 国际许可协议 (CC BY-NC 4.0)。

主要条款：
• 仅限非商业用途免费使用
• 禁止用于任何商业目的
• 必须保留署名
• 相同方式共享（非商业性改编）
• 不提供任何担保或责任

如需商业授权，请联系：zhangly1403@163.com`,
    third_party_desc: "本软件使用了以下开源库：",
    view_package_json: "查看完整依赖列表请参考 package.json",
    full_license: "完整协议:",
    error_title: "应用发生错误",
    error_msg: "抱歉，程序运行过程中遇到了未预期的错误。您可以尝试重新加载页面，或联系开发人员。",
    error_reload: "重新加载页面",
    viewpoint_title: "视点管理",
    viewpoint_save: "保存当前视点",
    viewpoint_empty: "暂无保存的视点",
    viewpoint_loading: "恢复视点",
    viewpoint_default_name: "视点",
    viewpoint_load: "恢复",
    viewpoint_load_hint: "双击恢复视点",
    viewpoint_overwrite: "覆盖",
    viewpoint_no_preview: "无预览",
    viewpoint_save_visibility: "保存可见性",
    viewpoint_save_selection: "保存选择",
    viewpoint_save_clip: "保存剖切",
    viewpoint_save_explode: "保存爆炸图",
    viewpoint_flag_visibility: "可见性",
    viewpoint_flag_selection: "选择",
    viewpoint_flag_clip: "剖切",
    viewpoint_flag_explode: "爆炸图",
    chunk_loading: "分片加载",
    select_all: "全选",
    invert_selection: "反选",
    set_opacity: "透明度",
    copied: "已复制",
    click_to_copy: "点击复制",
    search_results: "结果数",
    search_selected_results: "已勾选",
    search_batch_highlight: "批量高亮",
    search_add_to_selection: "加入当前选择",
    search_export_results: "导出结果",
    locate_in_view: "定位到视图",
    settings_more: "更多设置",
    locate_first_match: "定位首个匹配",
    ifc_locator_all: "综合",
    ifc_locator_name: "名称",
    ifc_locator_globalid: "GlobalId",
    ifc_locator_classification: "分类编码",
    ifc_locator_type: "类型",
    ifc_locator_placeholder: "按 IFC 标识定位...",
    ifc_locator_results: "IFC 结果",
    ifc_locator_prev: "上一个",
    ifc_locator_next: "下一个",
    ifc_locator_action: "定位构件",
    explode_title: "爆炸图",
    explode_enable: "启用",
    explode_strength: "强度",
    explode_mode: "方向",
    explode_mode_radial: "四周",
    explode_mode_horizontal: "横向",
    explode_mode_vertical: "纵向",
    explode_reset: "重置",
    op_screenshot_transparent: "透明背景截图",
    screenshot_mode: "截图方式",
    screenshot_scene_desc: "导出带当前场景背景的 PNG 截图",
    screenshot_transparent_desc: "导出透明背景 PNG，便于报告排版",
    summary_parent: "父级",
    summary_children: "子节点",
    summary_visible: "可见",
    summary_yes: "是",
    summary_no: "否",
    summary_models: "模型数",
    summary_types: "类型分布",
    summary_bounds: "总体包围盒",
    summary_total_area: "总面积",
    summary_total_volume: "总体积",
    mode_measure: "测量中",
    mode_clip: "剖切中",
    mode_search: "搜索结果高亮",
    mode_hidden: "已隐藏对象",
    mode_isolated: "已隔离对象",
    mode_box_select: "框选中",
    mode_clash: "碰撞结果已激活",
    mode_clear: "清除",
    mode_restore_visibility: "恢复显示",
    stats_original_meshes: "原始网格",
    stats_triangles: "三角面",
    stats_chunks: "分片",
    stats_pixel_ratio: "像素比",
    confirm: "确定",
    writing: "正在写入文件..."
  }
}, Lt = (e, n) => Va[e][n] || n, mn = [
  {
    key: "indigo",
    labelZh: "靛蓝",
    labelEn: "Indigo",
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    primaryActive: "#3730a3",
    primaryContainer: "#ede9fe",
    surfaceHover: "rgba(79, 70, 229, 0.05)",
    surfaceActive: "rgba(79, 70, 229, 0.10)",
    surfaceSelected: "rgba(79, 70, 229, 0.08)",
    surfaceSoft: "#f5f3ff",
    surfaceSoftStrong: "#ede9fe",
    swatch: "#4f46e5"
  },
  {
    key: "sky",
    labelZh: "天蓝",
    labelEn: "Sky",
    primary: "#0284c7",
    primaryHover: "#0369a1",
    primaryActive: "#075985",
    primaryContainer: "#e0f2fe",
    surfaceHover: "rgba(2, 132, 199, 0.05)",
    surfaceActive: "rgba(2, 132, 199, 0.10)",
    surfaceSelected: "rgba(2, 132, 199, 0.08)",
    surfaceSoft: "#f0f9ff",
    surfaceSoftStrong: "#e0f2fe",
    swatch: "#0284c7"
  },
  {
    key: "emerald",
    labelZh: "翠绿",
    labelEn: "Emerald",
    primary: "#059669",
    primaryHover: "#047857",
    primaryActive: "#065f46",
    primaryContainer: "#d1fae5",
    surfaceHover: "rgba(5, 150, 105, 0.05)",
    surfaceActive: "rgba(5, 150, 105, 0.10)",
    surfaceSelected: "rgba(5, 150, 105, 0.08)",
    surfaceSoft: "#ecfdf5",
    surfaceSoftStrong: "#d1fae5",
    swatch: "#059669"
  },
  {
    key: "violet",
    labelZh: "紫罗兰",
    labelEn: "Violet",
    primary: "#7c3aed",
    primaryHover: "#6d28d9",
    primaryActive: "#5b21b6",
    primaryContainer: "#ede9fe",
    surfaceHover: "rgba(124, 58, 237, 0.05)",
    surfaceActive: "rgba(124, 58, 237, 0.10)",
    surfaceSelected: "rgba(124, 58, 237, 0.08)",
    surfaceSoft: "#f5f3ff",
    surfaceSoftStrong: "#ede9fe",
    swatch: "#7c3aed"
  },
  {
    key: "rose",
    labelZh: "玫红",
    labelEn: "Rose",
    primary: "#e11d48",
    primaryHover: "#be123c",
    primaryActive: "#9f1239",
    primaryContainer: "#ffe4e6",
    surfaceHover: "rgba(225, 29, 72, 0.05)",
    surfaceActive: "rgba(225, 29, 72, 0.10)",
    surfaceSelected: "rgba(225, 29, 72, 0.08)",
    surfaceSoft: "#fff1f2",
    surfaceSoftStrong: "#ffe4e6",
    swatch: "#e11d48"
  },
  {
    key: "amber",
    labelZh: "琥珀",
    labelEn: "Amber",
    primary: "#d97706",
    primaryHover: "#b45309",
    primaryActive: "#92400e",
    primaryContainer: "#fef3c7",
    surfaceHover: "rgba(217, 119, 6, 0.05)",
    surfaceActive: "rgba(217, 119, 6, 0.10)",
    surfaceSelected: "rgba(217, 119, 6, 0.08)",
    surfaceSoft: "#fffbeb",
    surfaceSoftStrong: "#fef3c7",
    swatch: "#d97706"
  }
];
function Ht(e) {
  const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
  return n ? {
    r: parseInt(n[1], 16),
    g: parseInt(n[2], 16),
    b: parseInt(n[3], 16)
  } : null;
}
function Vn(e, n) {
  const r = Ht(e);
  if (!r) return e;
  const i = Math.max(0, Math.round(r.r * (1 - n))), a = Math.max(0, Math.round(r.g * (1 - n))), o = Math.max(0, Math.round(r.b * (1 - n)));
  return `#${i.toString(16).padStart(2, "0")}${a.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}`;
}
function tn(e, n) {
  const r = Ht(e);
  if (!r) return e;
  const i = Math.min(255, Math.round(r.r + (255 - r.r) * n)), a = Math.min(255, Math.round(r.g + (255 - r.g) * n)), o = Math.min(255, Math.round(r.b + (255 - r.b) * n));
  return `#${i.toString(16).padStart(2, "0")}${a.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}`;
}
function Pa(e) {
  const n = Ht(e), r = n?.r ?? 79, i = n?.g ?? 70, a = n?.b ?? 229;
  return {
    key: "custom",
    labelZh: "自定义",
    labelEn: "Custom",
    primary: e,
    primaryHover: Vn(e, 0.12),
    primaryActive: Vn(e, 0.22),
    primaryContainer: tn(e, 0.88),
    surfaceHover: `rgba(${r}, ${i}, ${a}, 0.05)`,
    surfaceActive: `rgba(${r}, ${i}, ${a}, 0.10)`,
    surfaceSelected: `rgba(${r}, ${i}, ${a}, 0.08)`,
    surfaceSoft: tn(e, 0.94),
    surfaceSoftStrong: tn(e, 0.88),
    swatch: e
  };
}
function Fa(e, n) {
  let r;
  e === "custom" && n ? r = Pa(n) : r = mn.find((o) => o.key === e), r || (r = mn[0]);
  const i = document.documentElement;
  i.style.setProperty("--primary", r.primary), i.style.setProperty("--primary-hover", r.primaryHover), i.style.setProperty("--primary-active", r.primaryActive), i.style.setProperty("--primary-container", r.primaryContainer), i.style.setProperty("--surface-hover", r.surfaceHover), i.style.setProperty("--surface-active", r.surfaceActive), i.style.setProperty("--surface-selected", r.surfaceSelected), i.style.setProperty("--surface-soft", r.surfaceSoft), i.style.setProperty("--surface-soft-strong", r.surfaceSoftStrong);
  const a = Ht(r.primary);
  a && i.style.setProperty(
    "--primary-focus",
    `rgba(${a.r}, ${a.g}, ${a.b}, 0.18)`
  );
}
function Oa(e, n) {
  return (e || []).includes(n);
}
const Pn = 24, Ta = 1.5, ve = (e, n = {}) => {
  const { size: r, color: i, ...a } = n;
  return /* @__PURE__ */ t(
    "svg",
    {
      width: r || Pn,
      height: r || Pn,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: i || "currentColor",
      strokeWidth: Ta,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...a,
      children: e
    }
  );
}, bn = (e) => ve(/* @__PURE__ */ t("polyline", { points: "9 18 15 12 9 6" }), e), Ra = (e) => ve(/* @__PURE__ */ t("polyline", { points: "15 18 9 12 15 6" }), e), vn = (e) => ve(/* @__PURE__ */ t("polyline", { points: "6 9 12 15 18 9" }), e), Ua = (e) => ve(/* @__PURE__ */ t("polyline", { points: "18 15 12 9 6 15" }), e), ja = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "7" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "2.5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "2", x2: "12", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "19", x2: "12", y2: "22" }),
    /* @__PURE__ */ t("line", { x1: "2", y1: "12", x2: "5", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "12", x2: "22", y2: "12" })
  ] }),
  e
), Ha = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), ut = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ] }),
  e
), Ga = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ t("polyline", { points: "14 2 14 8 20 8" })
  ] }),
  e
), Wa = (e) => ve(
  /* @__PURE__ */ t(ge, { children: /* @__PURE__ */ t("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" }) }),
  e
), Ka = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("rect", { x: "2", y: "2", width: "20", height: "16", rx: "1" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "14", x2: "6", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "14", x2: "12", y2: "16" }),
    /* @__PURE__ */ t("line", { x1: "18", y1: "14", x2: "18", y2: "17" })
  ] }),
  e
), Xa = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "6", cy: "6", r: "3" }),
    /* @__PURE__ */ t("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ t("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
    /* @__PURE__ */ t("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
    /* @__PURE__ */ t("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
  ] }),
  e
), Ya = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ t("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ] }),
  e
), qa = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] }),
  e
), Qa = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), Za = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" }),
    /* @__PURE__ */ t("path", { d: "M13 13l6 6" })
  ] }),
  e
), Kn = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    /* @__PURE__ */ t("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ] }),
  e
), Ja = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] }),
  e
), ei = (e) => ve(
  /* @__PURE__ */ t(ge, { children: /* @__PURE__ */ t("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) }),
  e
), ti = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  e
), ni = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  e
), ri = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ t("line", { x1: "16.65", y1: "16.65", x2: "21", y2: "21" })
  ] }),
  e
), ai = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] }),
  e
), ii = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ t("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ t("polyline", { points: "21 15 16 10 5 21" })
  ] }),
  e
), oi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
    /* @__PURE__ */ t("polyline", { points: "2 12 12 17 22 12" }),
    /* @__PURE__ */ t("polyline", { points: "2 17 12 22 22 17" })
  ] }),
  e
), si = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "2.25" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "2", x2: "12", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "18", x2: "12", y2: "22" }),
    /* @__PURE__ */ t("line", { x1: "2", y1: "12", x2: "6", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "18", y1: "12", x2: "22", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "4.9", y1: "4.9", x2: "7.8", y2: "7.8" }),
    /* @__PURE__ */ t("line", { x1: "16.2", y1: "16.2", x2: "19.1", y2: "19.1" }),
    /* @__PURE__ */ t("line", { x1: "4.9", y1: "19.1", x2: "7.8", y2: "16.2" }),
    /* @__PURE__ */ t("line", { x1: "16.2", y1: "7.8", x2: "19.1", y2: "4.9" })
  ] }),
  e
), li = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4z", fill: "none" }),
    /* @__PURE__ */ t("line", { x1: "7", y1: "5", x2: "17", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "5", y1: "7", x2: "5", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "17", y1: "19", x2: "7", y2: "19" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "17", x2: "19", y2: "7" })
  ] }),
  e
), ci = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), ui = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,16 12,13 21,16 12,21", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), di = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), hi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), pi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,3 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), mi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,3 12,13 21,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), fi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), _i = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), gi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), yi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), bi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.35" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), vi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "none" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Fn = (e) => ve(
  /* @__PURE__ */ t(ge, { children: /* @__PURE__ */ t("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }),
  e
), On = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ t("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  e
), Ve = ({
  icon: e,
  label: n,
  active: r,
  theme: i,
  style: a,
  className: o = "",
  disabled: h,
  ...u
}) => /* @__PURE__ */ c(
  "button",
  {
    style: { opacity: h ? 0.4 : 1, cursor: h ? "not-allowed" : "pointer", ...a },
    className: `ui-toolbar-btn ${r ? "active" : ""} ${o}`,
    disabled: h,
    ...u,
    children: [
      /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-icon", children: e }),
      n && /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-label", children: n })
    ]
  }
), wi = (e) => {
  const {
    t: n,
    theme: r,
    hiddenMenus: i = []
  } = e, a = ue(null), o = ue(null), h = ue(null), [u, p] = V(null), l = (s) => Oa(i, s);
  ce(() => {
    if (!u) return;
    const s = (N) => {
      h.current && !h.current.contains(N.target) && p(null);
    }, f = (N) => {
      N.key === "Escape" && p(null);
    };
    return document.addEventListener("mousedown", s), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", s), document.removeEventListener("keydown", f);
    };
  }, [u]);
  const d = (s) => {
    p((f) => f === s ? null : s);
  }, _ = () => p(null), b = (s, f) => u !== s ? null : /* @__PURE__ */ t("div", { className: "ui-toolbar-menu", role: "menu", children: f }), m = (s, f, N) => /* @__PURE__ */ c(
    "div",
    {
      className: "ui-toolbar-menu-item",
      role: "menuitem",
      tabIndex: 0,
      onClick: N,
      onKeyDown: (y) => {
        (y.key === "Enter" || y.key === " ") && (y.preventDefault(), N());
      },
      children: [
        /* @__PURE__ */ t("span", { className: "ui-toolbar-menu-icon", children: s }),
        /* @__PURE__ */ t("span", { children: f })
      ]
    }
  ), w = () => /* @__PURE__ */ t("div", { className: "ui-toolbar-menu-divider" }), g = (s) => {
    e.setActiveTool?.(e.activeTool === s ? "none" : s);
  };
  return /* @__PURE__ */ c("div", { ref: h, className: "ui-toolbar", children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "file",
        ref: a,
        className: "ui-visually-hidden",
        multiple: !0,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.nbim,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: e.handleOpenFiles
      }
    ),
    /* @__PURE__ */ t(
      "input",
      {
        type: "file",
        ref: o,
        className: "ui-visually-hidden",
        multiple: !0,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: e.handleBatchConvert
      }
    ),
    !l("file") && /* @__PURE__ */ t("div", { className: "ui-toolbar-group", children: /* @__PURE__ */ c("div", { className: "ui-toolbar-menu-anchor", children: [
      /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ga, {}),
          label: n("tb_file") || "文件",
          active: u === "file",
          onClick: () => d("file"),
          theme: r
        }
      ),
      b("file", /* @__PURE__ */ c(ge, { children: [
        !l("open_file") && m(/* @__PURE__ */ t(Fn, {}), n("menu_open_file") || "打开文件", () => {
          a.current?.click(), _();
        }),
        !l("open_url") && m(/* @__PURE__ */ t(Fn, {}), n("menu_open_url") || "打开地址", () => {
          e.handleOpenUrl?.(), _();
        }),
        !l("batch_convert") && /* @__PURE__ */ c(ge, { children: [
          w(),
          m(/* @__PURE__ */ t(On, {}), n("menu_batch_convert") || "批量转换", () => {
            o.current?.click(), _();
          })
        ] }),
        !l("export") && /* @__PURE__ */ c(ge, { children: [
          w(),
          m(/* @__PURE__ */ t(On, {}), n("menu_export") || "导出", () => {
            e.setActiveTool?.("export"), _();
          })
        ] }),
        !l("clear") && /* @__PURE__ */ c(ge, { children: [
          w(),
          m(/* @__PURE__ */ t(Ha, {}), n("op_clear") || "清空", () => {
            e.handleClear?.(), _();
          })
        ] })
      ] }))
    ] }) }),
    !l("view") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("fit_view") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Wa, {}),
          label: n("tb_fit") || "充满",
          onClick: () => e.sceneMgr?.restoreView(),
          theme: r
        }
      ),
      !l("views") && /* @__PURE__ */ c("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Ve,
          {
            icon: /* @__PURE__ */ t(ni, {}),
            label: n("tb_view") || "视图",
            active: u === "views",
            onClick: () => d("views"),
            theme: r
          }
        ),
        b("views", /* @__PURE__ */ c(ge, { children: [
          m(/* @__PURE__ */ t(di, {}), n("view_front") || "前视图", () => {
            e.handleView?.("front"), _();
          }),
          m(/* @__PURE__ */ t(hi, {}), n("view_back") || "后视图", () => {
            e.handleView?.("back"), _();
          }),
          m(/* @__PURE__ */ t(ci, {}), n("view_top") || "顶视图", () => {
            e.handleView?.("top"), _();
          }),
          m(/* @__PURE__ */ t(ui, {}), n("view_bottom") || "底视图", () => {
            e.handleView?.("bottom"), _();
          }),
          m(/* @__PURE__ */ t(pi, {}), n("view_left") || "左视图", () => {
            e.handleView?.("left"), _();
          }),
          m(/* @__PURE__ */ t(mi, {}), n("view_right") || "右视图", () => {
            e.handleView?.("right"), _();
          }),
          w(),
          m(/* @__PURE__ */ t(_i, {}), n("view_se") || "东南", () => {
            e.handleView?.("se"), _();
          }),
          m(/* @__PURE__ */ t(fi, {}), n("view_sw") || "西南", () => {
            e.handleView?.("sw"), _();
          }),
          m(/* @__PURE__ */ t(gi, {}), n("view_ne") || "东北", () => {
            e.handleView?.("ne"), _();
          }),
          m(/* @__PURE__ */ t(yi, {}), n("view_nw") || "西北", () => {
            e.handleView?.("nw"), _();
          })
        ] }))
      ] })
    ] }),
    !l("interface") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("wireframe") && /* @__PURE__ */ c("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Ve,
          {
            icon: /* @__PURE__ */ t(oi, {}),
            label: n("display_mode") || "样式",
            active: u === "displayMode",
            onClick: () => d("displayMode"),
            theme: r
          }
        ),
        b("displayMode", /* @__PURE__ */ c(ge, { children: [
          m(/* @__PURE__ */ t(bi, {}), n("dm_solid") || "着色", () => {
            e.handleDisplayModeChange?.("solid"), _();
          }),
          m(/* @__PURE__ */ t(vi, {}), n("dm_transparent") || "透明", () => {
            e.handleDisplayModeChange?.("transparent"), _();
          })
        ] }))
      ] }),
      !l("outline") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Kn, {}),
          label: n("tb_model") || "模型",
          active: e.showOutline,
          onClick: () => e.setShowOutline?.(!e.showOutline),
          theme: r
        }
      ),
      !l("props") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ja, {}),
          label: n("tb_props") || "属性",
          active: e.showProps,
          onClick: () => e.setShowProps?.(!e.showProps),
          theme: r
        }
      ),
      !l("pick") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Za, {}),
          label: n("tb_pick") || "选择",
          active: e.pickEnabled,
          onClick: () => e.setPickEnabled?.(!e.pickEnabled),
          theme: r
        }
      )
    ] }),
    !l("tool") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("measure") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ka, {}),
          label: n("tb_measure") || "测量",
          active: e.activeTool === "measure",
          onClick: () => g("measure"),
          theme: r
        }
      ),
      !l("boxSelect") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(li, {}),
          label: n("tb_boxSelect") || "框选",
          active: e.activeTool === "boxSelect",
          onClick: () => g("boxSelect"),
          theme: r
        }
      ),
      !l("clip") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Xa, {}),
          label: n("tb_clip") || "剖切",
          active: e.activeTool === "clip",
          onClick: () => g("clip"),
          theme: r
        }
      ),
      !l("viewpoint") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ti, {}),
          label: n("tb_view") || "视点",
          active: e.activeTool === "viewpoint",
          onClick: () => g("viewpoint"),
          theme: r
        }
      ),
      !l("screenshot") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ii, {}),
          label: n("tb_screenshot") || "截图",
          active: e.activeTool === "screenshot",
          onClick: () => e.openScreenshotPanel?.(),
          theme: r
        }
      ),
      !l("search") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ri, {}),
          label: n("tb_search") || "搜索",
          active: e.activeTool === "search",
          onClick: () => g("search"),
          theme: r
        }
      ),
      !l("clash") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ja, {}),
          label: n("tb_clash") || "碰撞",
          active: e.activeTool === "clash",
          onClick: () => g("clash"),
          theme: r
        }
      ),
      !l("explode") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(si, {}),
          label: n("tb_explode") || "爆炸",
          active: e.activeTool === "explode",
          onClick: () => g("explode"),
          theme: r
        }
      )
    ] }),
    !l("about") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("settings") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ya, {}),
          label: n("tb_settings") || "设置",
          active: e.activeTool === "settings",
          onClick: () => g("settings"),
          theme: r
        }
      ),
      /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(qa, {}),
          label: n("tb_about") || "关于",
          onClick: () => e.onOpenAbout?.(),
          theme: r
        }
      )
    ] })
  ] });
};
function Qe(...e) {
  return e.filter(Boolean).join(" ");
}
function it(e, n, r) {
  return Math.max(n, Math.min(r, e));
}
function fn(e, n, r) {
  return r === n ? 0 : it((e - n) / (r - n) * 100, 0, 100);
}
function xi(e, n) {
  if (!Number.isFinite(n) || n <= 0) return e;
  const r = Math.round(e / n) * n, i = Ci(n);
  return Number(r.toFixed(i));
}
function Xn(e, n, r, i = 1) {
  return it(xi(e, i), n, r);
}
function _n(e, n, r, i, a = 1) {
  const o = it((e - n.left) / n.width, 0, 1);
  return Xn(r + o * (i - r), r, i, a);
}
function Ci(e) {
  const n = String(e);
  return n.includes(".") && n.split(".")[1]?.length || 0;
}
const Ee = jt.forwardRef(({
  children: e,
  variant: n = "default",
  size: r = "md",
  active: i = !1,
  theme: a,
  className: o,
  type: h = "button",
  ...u
}, p) => /* @__PURE__ */ t(
  "button",
  {
    ref: p,
    type: h,
    className: Qe("ui-btn", n === "primary" ? "ui-btn-primary" : n === "danger" ? "ui-btn-danger" : n === "ghost" ? "ui-btn-ghost" : "ui-btn-default", r === "sm" ? "ui-btn-sm" : r === "lg" ? "ui-btn-lg" : "ui-btn-md", i && "active", o),
    ...u,
    children: e
  }
));
Ee.displayName = "Button";
function dt({
  value: e,
  options: n,
  onChange: r,
  className: i,
  style: a,
  disabled: o = !1,
  placeholder: h,
  searchable: u = !1,
  searchPlaceholder: p,
  emptyText: l = "暂无数据"
}) {
  const [d, _] = V(!1), [b, m] = V(""), w = ue(null), g = Ie(
    () => n.find((N) => N.value === e),
    [n, e]
  ), s = Ie(() => {
    if (!u || !b.trim()) return n;
    const N = b.trim().toLocaleLowerCase();
    return n.filter(
      (y) => String(y.label ?? y.value).toLocaleLowerCase().includes(N) || String(y.value ?? "").toLocaleLowerCase().includes(N)
    );
  }, [n, u, b]);
  ce(() => {
    if (!d) return;
    const N = (R) => {
      w.current && !w.current.contains(R.target) && _(!1);
    }, y = (R) => {
      R.key === "Escape" && _(!1);
    };
    return document.addEventListener("mousedown", N), document.addEventListener("keydown", y), () => {
      document.removeEventListener("mousedown", N), document.removeEventListener("keydown", y);
    };
  }, [d]);
  const f = (N) => {
    N.disabled || (r(N.value), _(!1), m(""));
  };
  return /* @__PURE__ */ c("div", { ref: w, className: Qe("ui-select-custom", d && "open", o && "disabled"), style: a, children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: Qe("ui-select-selector", "ui-input", i),
        onClick: () => !o && _((N) => !N),
        disabled: o,
        "aria-haspopup": "listbox",
        "aria-expanded": d,
        children: [
          /* @__PURE__ */ t("span", { className: "ui-select-selection-item", children: g?.label ?? h ?? "" }),
          /* @__PURE__ */ t("span", { className: "ui-select-arrow", "aria-hidden": "true", children: /* @__PURE__ */ t("svg", { viewBox: "64 64 896 896", width: "12", height: "12", fill: "currentColor", children: /* @__PURE__ */ t("path", { d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" }) }) })
        ]
      }
    ),
    d && !o && /* @__PURE__ */ c("div", { className: "ui-select-dropdown", role: "listbox", children: [
      u && /* @__PURE__ */ t("div", { className: "ui-select-search-wrap", children: /* @__PURE__ */ t(
        "input",
        {
          className: "ui-input ui-input-compact ui-select-search-input",
          value: b,
          onChange: (N) => m(N.target.value),
          placeholder: p || "搜索...",
          onClick: (N) => N.stopPropagation(),
          autoFocus: !0
        }
      ) }),
      s.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-select-empty", children: l }) : s.map((N) => /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          className: Qe("ui-select-item", N.value === e && "selected", N.disabled && "disabled"),
          onClick: () => f(N),
          disabled: N.disabled,
          role: "option",
          "aria-selected": N.value === e,
          children: N.label
        },
        N.value
      ))
    ] })
  ] });
}
const Je = ({
  label: e,
  checked: n,
  onChange: r,
  disabled: i = !1,
  className: a,
  style: o,
  labelStyle: h,
  name: u,
  value: p
}) => {
  const l = () => {
    i || r(!n);
  };
  return /* @__PURE__ */ c("label", { className: Qe("ui-checkbox", i && "ui-checkbox-disabled", a), style: o, children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "checkbox",
        name: u,
        value: p,
        checked: n,
        disabled: i,
        onChange: l,
        className: "ui-checkbox-native",
        "aria-hidden": "true",
        tabIndex: -1,
        style: { position: "absolute", opacity: 0, pointerEvents: "none" }
      }
    ),
    /* @__PURE__ */ t("span", { className: Qe("ui-checkbox-box", n && "ui-checkbox-box-checked"), "aria-hidden": "true", children: n && /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: "ui-checkbox-icon", children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" }) }) }),
    e && /* @__PURE__ */ t("span", { className: "ui-checkbox-label", style: h, children: e })
  ] });
}, vt = ({
  min: e,
  max: n,
  step: r = 1,
  value: i,
  onChange: a,
  theme: o,
  disabled: h = !1,
  style: u,
  className: p
}) => {
  const l = ue(null), d = Xn(i, e, n, r), _ = fn(d, e, n), b = j((w) => {
    if (!l.current) return;
    const g = l.current.getBoundingClientRect();
    a(_n(w, g, e, n, r));
  }, [e, n, r, a]), m = j((w) => {
    if (h) return;
    w.preventDefault(), b(w.clientX);
    const g = (f) => b(f.clientX), s = () => {
      document.removeEventListener("mousemove", g), document.removeEventListener("mouseup", s);
    };
    document.addEventListener("mousemove", g), document.addEventListener("mouseup", s);
  }, [h, b]);
  return /* @__PURE__ */ c(
    "div",
    {
      ref: l,
      className: Qe("ui-slider", "ui-slider-control", h ? "ui-slider-control-disabled" : "ui-slider-control-interactive", p),
      style: u,
      onMouseDown: m,
      role: "slider",
      "aria-valuemin": e,
      "aria-valuemax": n,
      "aria-valuenow": d,
      "aria-disabled": h,
      tabIndex: h ? -1 : 0,
      children: [
        /* @__PURE__ */ t("div", { className: "ui-slider-track" }),
        /* @__PURE__ */ t("div", { className: "ui-slider-progress", style: { width: `${_}%` } }),
        /* @__PURE__ */ t("div", { className: "ui-slider-thumb", style: { left: `${_}%`, cursor: h ? "not-allowed" : "default" } })
      ]
    }
  );
}, Ni = ({
  min: e,
  max: n,
  value: r,
  onChange: i,
  theme: a,
  disabled: o = !1,
  style: h,
  className: u
}) => {
  const p = ue(null), l = Ie(() => {
    const g = it(Math.min(r[0], r[1]), e, n), s = it(Math.max(r[0], r[1]), e, n);
    return [g, s];
  }, [r, e, n]), d = fn(l[0], e, n), _ = fn(l[1], e, n), b = j((g, s) => {
    if (!p.current) return;
    const f = p.current.getBoundingClientRect(), N = _n(s, f, e, n, 1);
    i(g === "start" ? [it(N, e, l[1] - 1), l[1]] : [l[0], it(N, l[0] + 1, n)]);
  }, [e, n, l, i]), m = j((g, s) => {
    if (o) return;
    s.preventDefault(), s.stopPropagation(), b(g, s.clientX);
    const f = (y) => b(g, y.clientX), N = () => {
      document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", N);
    };
    document.addEventListener("mousemove", f), document.addEventListener("mouseup", N);
  }, [o, b]), w = j((g) => {
    if (o || !p.current) return;
    g.preventDefault(), g.stopPropagation();
    const s = p.current.getBoundingClientRect(), f = _n(g.clientX, s, e, n, 1), N = Math.abs(f - l[0]), y = Math.abs(f - l[1]);
    b(N <= y ? "start" : "end", g.clientX);
  }, [o, e, n, l, b]);
  return /* @__PURE__ */ c(
    "div",
    {
      ref: p,
      className: Qe("ui-slider", "ui-dual-slider", o ? "ui-slider-control-disabled" : "ui-slider-control-interactive", u),
      style: h,
      onClick: w,
      role: "group",
      "aria-disabled": o,
      children: [
        /* @__PURE__ */ t("div", { className: "ui-slider-track" }),
        /* @__PURE__ */ t("div", { className: "ui-slider-progress", style: { left: `${d}%`, width: `${_ - d}%` } }),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb ui-dual-slider-thumb ui-dual-slider-thumb-start",
            style: { left: `${d}%`, cursor: o ? "not-allowed" : "default" },
            onMouseDown: (g) => m("start", g)
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb ui-dual-slider-thumb ui-dual-slider-thumb-end",
            style: { left: `${_}%`, cursor: o ? "not-allowed" : "default" },
            onMouseDown: (g) => m("end", g)
          }
        )
      ]
    }
  );
}, nn = ({
  value: e,
  onChange: n,
  min: r = Number.NEGATIVE_INFINITY,
  max: i = Number.POSITIVE_INFINITY,
  step: a = 1,
  unit: o,
  className: h,
  style: u,
  disabled: p,
  ...l
}) => {
  const [d, _] = V(() => String(e));
  ce(() => {
    _(String(e));
  }, [e]);
  const b = (w) => {
    if (w.trim() === "") {
      _(String(e));
      return;
    }
    const g = Number(w);
    if (!Number.isFinite(g)) {
      _(String(e));
      return;
    }
    const s = it(g, r, i);
    _(String(s)), s !== e && n(s);
  }, m = (w) => {
    const g = w.target.value;
    if (_(g), g.trim() === "") return;
    const s = Number(g);
    if (!Number.isFinite(s)) return;
    const f = it(s, r, i);
    f !== e && n(f);
  };
  return /* @__PURE__ */ c("div", { className: Qe("ui-input-number", "ui-input-number-root", p && "disabled", h), style: u, children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "number",
        value: d,
        onChange: m,
        onBlur: () => b(d),
        min: Number.isFinite(r) ? r : void 0,
        max: Number.isFinite(i) ? i : void 0,
        step: a,
        disabled: p,
        className: Qe("ui-input", "ui-input-number-input", o && "ui-input-number-input-with-unit"),
        ...l
      }
    ),
    o && /* @__PURE__ */ t("span", { className: "ui-input-number-unit", children: o })
  ] });
}, ht = jt.forwardRef(({
  checked: e,
  onChange: n,
  disabled: r = !1,
  className: i,
  type: a = "button",
  ...o
}, h) => /* @__PURE__ */ t(
  "button",
  {
    ref: h,
    type: a,
    className: Qe("ui-switch", e && "active", r && "disabled", i),
    onClick: () => !r && n(!e),
    role: "switch",
    "aria-checked": e,
    disabled: r,
    ...o,
    children: /* @__PURE__ */ t("span", { className: "ui-switch-thumb" })
  }
));
ht.displayName = "Switch";
const Yn = ({
  prevTitle: e,
  nextTitle: n,
  currentPage: r,
  totalPages: i,
  onPrev: a,
  onNext: o,
  rightContent: h
}) => /* @__PURE__ */ c("div", { className: "ui-page-nav-wrap", children: [
  /* @__PURE__ */ c("div", { className: "ui-page-nav-group", children: [
    /* @__PURE__ */ t(
      Ee,
      {
        variant: "ghost",
        className: "ui-page-nav-btn",
        onClick: a,
        disabled: r <= 1,
        title: e,
        "aria-label": e,
        children: /* @__PURE__ */ t(Ra, { size: 20, strokeWidth: 2.2 })
      }
    ),
    /* @__PURE__ */ c("span", { className: "ui-page-nav-indicator", children: [
      r,
      "/",
      i
    ] }),
    /* @__PURE__ */ t(
      Ee,
      {
        variant: "ghost",
        className: "ui-page-nav-btn",
        onClick: o,
        disabled: r >= i,
        title: n,
        "aria-label": n,
        children: /* @__PURE__ */ t(bn, { size: 20, strokeWidth: 2.2 })
      }
    )
  ] }),
  h && /* @__PURE__ */ t("div", { className: "ui-page-nav-right", children: h })
] }), Si = ({
  value: e,
  onChange: n,
  showValue: r = !0,
  className: i = "",
  style: a
}) => /* @__PURE__ */ c("div", { className: Qe("ui-color-picker", i), style: a, children: [
  /* @__PURE__ */ t(
    "input",
    {
      type: "color",
      value: e,
      onChange: (o) => n(o.target.value),
      className: "ui-color-picker-input"
    }
  ),
  r && /* @__PURE__ */ t("span", { className: "ui-color-picker-value", children: e })
] }), Tt = ({
  options: e,
  value: n,
  onChange: r,
  className: i = ""
}) => /* @__PURE__ */ t("div", { className: `ui-segmented ${i}`, children: e.map((a) => /* @__PURE__ */ c(
  "button",
  {
    className: `ui-segmented-item ${n === a.value ? "active" : ""}`,
    onClick: () => r(a.value),
    children: [
      a.icon && /* @__PURE__ */ t("span", { children: a.icon }),
      /* @__PURE__ */ t("span", { children: a.label })
    ]
  },
  a.value
)) }), yt = 8, wn = ({
  x: e,
  y: n,
  items: r,
  onClose: i,
  theme: a
}) => {
  const o = ue(null), [h, u] = V({ left: e, top: n });
  Ea(() => {
    const d = o.current;
    if (!d) return;
    const _ = d.getBoundingClientRect(), b = Math.min(
      Math.max(yt, e),
      Math.max(yt, window.innerWidth - _.width - yt)
    ), m = Math.min(
      Math.max(yt, n),
      Math.max(yt, window.innerHeight - _.height - yt)
    );
    u({ left: b, top: m });
  }, [e, n, r]), jt.useEffect(() => {
    const d = (b) => {
      o.current && !o.current.contains(b.target) && i();
    }, _ = (b) => {
      b.key === "Escape" && i();
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", _), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", _);
    };
  }, [i]);
  const p = (d) => {
    d.disabled || !d.onClick || (d.onClick(), i());
  }, l = (d, _) => {
    d.key !== "Enter" && d.key !== " " || (d.preventDefault(), p(_));
  };
  return /* @__PURE__ */ t(
    "div",
    {
      ref: o,
      className: "ui-context-menu",
      style: { left: h.left, top: h.top },
      role: "menu",
      children: r.map((d, _) => {
        if (d.divider)
          return /* @__PURE__ */ t(
            "div",
            {
              className: "ui-context-menu-divider"
            },
            `divider_${_}`
          );
        if (d.slider) {
          const b = d.value ?? 0;
          return /* @__PURE__ */ c(
            "div",
            {
              className: "ui-context-menu-item ui-context-menu-slider",
              children: [
                /* @__PURE__ */ c("div", { className: "ui-context-menu-slider-row", children: [
                  /* @__PURE__ */ t("span", { children: d.label }),
                  /* @__PURE__ */ c("span", { children: [
                    Math.round(b * 100),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    type: "range",
                    min: "0",
                    max: "1",
                    step: "0.01",
                    value: b,
                    onChange: (m) => d.onChange?.(parseFloat(m.target.value)),
                    className: "ui-context-menu-slider-input"
                  }
                )
              ]
            },
            `slider_${_}`
          );
        }
        return /* @__PURE__ */ t(
          "div",
          {
            role: "menuitem",
            tabIndex: d.disabled ? -1 : 0,
            "aria-disabled": d.disabled,
            onClick: () => p(d),
            onKeyDown: (b) => l(b, d),
            className: `ui-context-menu-item${d.disabled ? " disabled" : ""}`,
            children: d.label
          },
          `item_${_}`
        );
      })
    }
  );
}, ki = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]), Mi = (...e) => {
  for (const n of e) {
    if (n == null) continue;
    const r = String(n).trim();
    if (!ki.has(r.toLowerCase()))
      return r;
  }
  return "";
}, qn = (e, n = [], r = []) => {
  if (!e) return n;
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    a.isLastChild = i === e.length - 1, a.parentIsLast = [...r], n.push(a), a.expanded && a.children && a.children.length > 0 && qn(a.children, n, [...r, a.isLastChild]);
  }
  return n;
}, Li = (e) => {
  const n = /* @__PURE__ */ new Map(), r = (i) => {
    i.forEach((a) => {
      n.set(a.uuid, a.expanded), a.children.length > 0 && r(a.children);
    });
  };
  return r(e), n;
}, Qn = (e, n) => e.map((r) => ({
  ...r,
  expanded: n.get(r.uuid) ?? r.expanded,
  children: Qn(r.children, n)
})), bt = (e) => {
  const n = e?.object?.children ?? e?.children;
  return Array.isArray(n) ? n : [];
}, Rt = (e, n, r = !1) => {
  const i = Array.isArray(e?.children) ? e.children : [], a = e?.type === "Mesh" ? `Mesh_${e?.id ?? "?"}` : `Group_${e?.id ?? "?"}`;
  return {
    uuid: e?.id ?? e?.uuid ?? String(Math.random()),
    name: Mi(e?.name, e?.userData?.name) || a,
    type: e?.type === "Mesh" ? "MESH" : "GROUP",
    depth: n,
    children: [],
    expanded: !1,
    visible: e?.visible !== !1,
    object: e,
    isFileNode: r,
    hasChildren: i.length > 0,
    childrenLoaded: !1
  };
}, rn = (e) => e.childrenLoaded || !e.hasChildren ? e : {
  ...e,
  childrenLoaded: !0,
  children: bt(e).map((n) => Rt(n, e.depth + 1))
}, Zn = (e, n) => e ? e.id === n || e.uuid === n ? !0 : (Array.isArray(e.children) ? e.children : []).some((i) => Zn(i, n)) : !1, an = (e) => {
  const n = e?.object ?? e, r = n?.userData?.ifcMetadata || {};
  return [
    n?.name,
    n?.type,
    n?.bimId,
    n?.userData?.bimId,
    n?.userData?.expressID,
    n?.userData?.ifcType,
    n?.userData?.globalId,
    r.storey,
    r.category,
    r.typeName,
    r.globalId,
    ...r.systems || [],
    ...r.materials || [],
    ...r.classifications || []
  ].filter(Boolean).join(" ").toLowerCase();
}, Ei = jt.memo(({
  node: e,
  isActive: n,
  isMatched: r,
  isLocated: i,
  searchQuery: a,
  clashBadge: o,
  onSelect: h,
  onToggleNode: u,
  onToggleVisibility: p,
  onContextMenu: l
}) => /* @__PURE__ */ c(
  "div",
  {
    className: `ui-tree-node ${n ? "selected" : ""} ${r ? "matched" : ""} ${i ? "located" : ""}`,
    style: { paddingLeft: 8 + e.depth * 16 },
    onClick: () => h(e),
    onDoubleClick: (d) => {
      e.hasChildren && (d.stopPropagation(), u(e.uuid));
    },
    onContextMenu: (d) => l(d, e),
    children: [
      /* @__PURE__ */ t(
        "div",
        {
          className: "ui-tree-expander",
          onClick: (d) => {
            d.stopPropagation(), u(e.uuid);
          },
          children: e.hasChildren ? e.expanded ? /* @__PURE__ */ t(vn, { size: 12 }) : /* @__PURE__ */ t(bn, { size: 12 }) : null
        }
      ),
      /* @__PURE__ */ t(
        Je,
        {
          checked: e.visible,
          onChange: (d) => p(e.uuid, d),
          style: { marginRight: 4, padding: 0, flexShrink: 0 }
        }
      ),
      /* @__PURE__ */ c("div", { className: "ui-tree-label", children: [
        a && e.name.toLowerCase().includes(a.toLowerCase()) ? /* @__PURE__ */ t("span", { children: e.name.split(new RegExp(`(${a})`, "gi")).map(
          (d, _) => d.toLowerCase() === a.toLowerCase() ? /* @__PURE__ */ t("span", { className: "ui-search-hit", children: d }, _) : d
        ) }) : e.name,
        o && /* @__PURE__ */ t(
          "span",
          {
            style: {
              marginLeft: 6,
              padding: "0 6px",
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${o.color}`,
              color: o.color,
              fontSize: "var(--font-size-label)",
              lineHeight: "16px",
              display: "inline-flex",
              alignItems: "center",
              verticalAlign: "middle"
            },
            children: o.label
          }
        )
      ] })
    ]
  }
), (e, n) => e.isActive === n.isActive && e.isMatched === n.isMatched && e.isLocated === n.isLocated && e.node === n.node && e.node.visible === n.node.visible && e.node.expanded === n.node.expanded && e.searchQuery === n.searchQuery && e.clashBadge?.label === n.clashBadge?.label), Ii = ({
  t: e,
  treeRoot: n,
  setTreeRoot: r,
  selectedUuid: i,
  locatedUuid: a,
  onSelect: o,
  onToggleVisibility: h,
  onDelete: u,
  onIsolate: p,
  onHide: l,
  onShowAll: d,
  onLocate: _,
  onClearLocate: b,
  onLocateResultsChange: m,
  locateResultUuids: w = [],
  clashSummaryByUuid: g = {}
}) => {
  const [s, f] = V(""), [N, y] = V(null), [R, ee] = V(0), [C, I] = V(400), B = ue(null), S = ue(null), L = ue(null), M = ue(""), [k, U] = V(null);
  ce(() => {
    if (!B.current) return;
    const A = new ResizeObserver((v) => {
      v.forEach((ne) => I(ne.contentRect.height));
    });
    return A.observe(B.current), () => A.disconnect();
  }, []), ce(() => {
    const A = M.current;
    if (!A && s && (L.current = Li(n)), A && !s && L.current) {
      const v = L.current;
      r((ne) => Qn(ne, v)), L.current = null;
    }
    M.current = s;
  }, [s, r, n]), ce(() => {
    k && S.current === "tree" && r((A) => {
      const v = (W) => {
        let Y = !1;
        return [W.map((re) => {
          let te = re;
          if (re.uuid === k)
            return Y = !0, re;
          !re.childrenLoaded && re.hasChildren && bt(re).some((oe) => Zn(oe, k)) && (te = rn(re));
          const [Ce, ke] = v(te.children);
          return ke && (Y = !0), {
            ...te,
            expanded: ke ? !0 : te.expanded,
            children: Ce
          };
        }), Y];
      }, [ne, se] = v(A);
      return se ? ne : A;
    });
  }, [k, r]);
  const O = (A, v) => {
    const ne = v.toLowerCase();
    return A.reduce((se, W) => {
      const Y = !v || an(W).includes(ne), pe = v ? bt(W).map((Ce) => Rt(Ce, W.depth + 1)) : W.children, re = O(pe, v);
      return (!v || Y || re.length > 0) && se.push({
        ...W,
        childrenLoaded: v ? !0 : W.childrenLoaded,
        hasChildren: W.hasChildren ?? bt(W).length > 0,
        expanded: v ? !0 : W.expanded,
        children: re
      }), se;
    }, []);
  }, de = Ie(() => O(n, s), [n, s]), K = Ie(() => qn(de), [de]), T = Ie(() => {
    if (!s) return null;
    const A = s.toLowerCase(), v = [...n];
    for (; v.length > 0; ) {
      const ne = v.shift();
      if (an(ne).includes(A)) return ne;
      bt(ne).map((se) => Rt(se, (ne.depth ?? 0) + 1)).forEach((se) => v.push(se));
    }
    return null;
  }, [s, n]), X = Ie(() => {
    if (!s.trim()) return [];
    const A = s.trim().toLowerCase(), v = [], ne = [...n];
    for (; ne.length > 0; ) {
      const se = ne.shift();
      an(se).includes(A) && v.push(se), bt(se).map((W) => Rt(W, (se.depth ?? 0) + 1)).forEach((W) => ne.push(W));
    }
    return v;
  }, [s, n]), Z = 24, ie = K.length * Z, fe = Math.max(0, Math.floor(R / Z)), z = Math.ceil(C / Z), F = Math.min(K.length, fe + z + 1), P = K.slice(fe, F);
  ce(() => {
    S.current === "tree" && (S.current = null);
  }, [i]), ce(() => {
    const A = s.trim() ? X.map((v) => v.uuid) : [];
    m?.(A);
  }, [X, s, m]);
  const $ = (A) => {
    const v = (ne) => ne.map((se) => se.uuid === A ? { ...rn(se), expanded: !se.expanded } : se.children.length > 0 ? { ...se, children: v(se.children) } : se);
    r((ne) => v(ne));
  }, H = () => {
    const A = (v) => v.map((ne) => {
      const se = rn(ne);
      return {
        ...se,
        expanded: se.hasChildren,
        children: A(se.children)
      };
    });
    r((v) => A(v));
  }, q = () => {
    const A = (v) => v.map((ne) => ({
      ...ne,
      expanded: !1,
      children: A(ne.children)
    }));
    r((v) => A(v));
  }, he = () => {
    T && _?.(T.object);
  }, Q = (A) => {
    const v = g[A];
    return v ? v.worstStatus === "new" ? {
      label: `${e("clash_group_new")} ${v.newCount}`,
      color: "var(--error)"
    } : v.worstStatus === "confirmed" ? {
      label: `${e("clash_group_confirmed")} ${v.confirmedCount}`,
      color: "var(--warning, #f59e0b)"
    } : {
      label: `${e("clash_group_resolved")} ${v.resolvedCount}`,
      color: "var(--success)"
    } : null;
  };
  return /* @__PURE__ */ c("div", { className: "ui-tree-panel", children: [
    /* @__PURE__ */ c("div", { className: "ui-search-bar", children: [
      /* @__PURE__ */ c("div", { className: "ui-search-input-wrap", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "text",
            placeholder: e("search_nodes"),
            value: s,
            onChange: (A) => f(A.target.value),
            onKeyDown: (A) => {
              A.key === "Enter" && (A.preventDefault(), he());
            },
            className: "ui-input ui-input-compact"
          }
        ),
        s && /* @__PURE__ */ t("button", { className: "ui-search-clear", onClick: () => f(""), children: /* @__PURE__ */ t(ut, { width: 14, height: 14 }) })
      ] }),
      s && /* @__PURE__ */ c("div", { className: "ui-tree-search-meta", children: [
        /* @__PURE__ */ c("span", { children: [
          e("search_results"),
          ": ",
          X.length
        ] }),
        /* @__PURE__ */ t(
          Ee,
          {
            variant: "ghost",
            className: "ui-properties-action",
            onClick: he,
            disabled: !T,
            children: e("locate_first_match")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        ref: B,
        className: "ui-tree-container flex-1 overflow-auto",
        onScroll: (A) => ee(A.currentTarget.scrollTop),
        children: /* @__PURE__ */ t("div", { style: { height: ie, position: "relative", minWidth: "max-content" }, children: /* @__PURE__ */ t("div", { style: { position: "absolute", top: fe * Z, left: 0, right: 0, minWidth: "max-content" }, children: P.map((A) => /* @__PURE__ */ t(
          Ei,
          {
            node: A,
            isActive: A.uuid === k,
            isMatched: w.includes(A.uuid),
            isLocated: A.uuid === a,
            searchQuery: s,
            clashBadge: Q(A.uuid),
            onSelect: (v) => {
              S.current = "tree", U(v.uuid), o(v.uuid, v.object);
            },
            onToggleNode: $,
            onToggleVisibility: h,
            onContextMenu: (v, ne) => {
              v.preventDefault(), y({ x: v.clientX, y: v.clientY, node: ne });
            }
          },
          A.uuid
        )) }) })
      }
    ),
    N && /* @__PURE__ */ t(
      wn,
      {
        x: N.x,
        y: N.y,
        onClose: () => y(null),
        items: [
          {
            label: e("locate_in_view"),
            onClick: () => _?.(N.node.object)
          },
          {
            divider: !0
          },
          {
            label: e("expand_all"),
            onClick: H
          },
          {
            label: e("collapse_all"),
            onClick: q
          },
          ...N.node.isFileNode ? [
            { divider: !0 },
            {
              label: e("delete_item"),
              onClick: () => u?.(N.node.object)
            }
          ] : []
        ]
      }
    )
  ] });
}, et = ({
  title: e,
  onClose: n,
  children: r,
  width: i = 300,
  height: a,
  x: o = 100,
  y: h = 100,
  resizable: u = !1,
  movable: p = !0,
  storageId: l,
  modal: d = !1,
  autoHeight: _ = a === void 0,
  closeLabel: b = "Close"
}) => {
  const m = ue(null), g = l ? {
    tool_measure: { w: 320, h: 400 },
    tool_search: { w: 620, h: 500 },
    tool_export: { w: 400, h: 430 },
    tool_screenshot: { w: 380, h: 300 },
    tool_clip: { w: 410, h: 420 },
    tool_settings: { w: 380, h: 520 },
    tool_viewpoint: { w: 380, h: 460 },
    tool_explode: { w: 340, h: 360 },
    tool_clash: { w: 520, h: 560 }
  }[l] : void 0, s = g?.w ?? 220, f = g?.h ?? 120, N = () => ({
    w: Math.max(220, window.innerWidth - 32),
    h: Math.max(160, window.innerHeight - 64)
  }), y = (F, P) => {
    const $ = N(), H = Math.min(s, $.w), q = Math.min(f, $.h);
    return {
      w: Math.max(H, Math.min(F, $.w)),
      h: Math.max(q, Math.min(P, $.h))
    };
  }, R = () => {
    if (d)
      return {
        x: Math.max(0, (window.innerWidth - i) / 2),
        y: Math.max(0, (window.innerHeight - (a ?? f)) / 2)
      };
    if (l)
      try {
        const F = localStorage.getItem(`panel_${l}`);
        if (F) {
          const P = JSON.parse(F);
          if (P.pos && typeof P.pos.x == "number" && typeof P.pos.y == "number")
            return {
              x: Math.min(Math.max(0, P.pos.x), window.innerWidth - 50),
              y: Math.min(Math.max(0, P.pos.y), window.innerHeight - 50)
            };
        }
      } catch {
      }
    return o === 100 && h === 100 && !l ? {
      x: Math.max(0, (window.innerWidth - i) / 2),
      y: Math.max(0, (window.innerHeight - (a ?? f)) / 2)
    } : { x: o, y: h };
  }, ee = () => {
    if (l && u)
      try {
        const F = localStorage.getItem(`panel_${l}`);
        if (F) {
          const P = JSON.parse(F);
          if (P.size && typeof P.size.w == "number" && typeof P.size.h == "number")
            return y(P.size.w, P.size.h);
        }
      } catch {
      }
    return y(i, a ?? f);
  }, C = ue(R()), I = ue(ee()), B = ue(!1), S = ue(!1), L = ue(null), M = ue({ x: 0, y: 0 }), k = ue({ x: 0, y: 0 }), U = ue({ w: 0, h: 0 }), O = j(() => {
    const F = m.current;
    if (!F) return;
    const P = C.current, $ = I.current;
    F.style.transform = `translate(${P.x}px, ${P.y}px)`, F.style.width = `${$.w}px`, _ || (F.style.height = `${$.h}px`);
  }, [_]), de = j((F) => {
    if (!B.current && !S.current) return;
    F.preventDefault();
    const P = F.clientX - M.current.x, $ = F.clientY - M.current.y, H = m.current;
    if (B.current) {
      let q = window.innerWidth, he = window.innerHeight;
      H?.parentElement && (q = H.parentElement.clientWidth, he = H.parentElement.clientHeight);
      const Q = _ && H?.offsetHeight || I.current.h, A = q - I.current.w, v = he - Q;
      C.current = {
        x: Math.max(0, Math.min(k.current.x + P, A)),
        y: Math.max(0, Math.min(k.current.y + $, v))
      }, O();
    } else if (S.current && L.current) {
      const q = L.current;
      let he = U.current.w, Q = U.current.h, A = k.current.x, v = k.current.y;
      if (q.includes("e") && (he = Math.max(s, U.current.w + P)), q.includes("w")) {
        const ne = U.current.w - s, se = Math.min(P, ne);
        he = U.current.w - se, A = k.current.x + se;
      }
      if (q.includes("s") && (Q = Math.max(f, U.current.h + $)), q.includes("n")) {
        const ne = U.current.h - f, se = Math.min($, ne);
        Q = U.current.h - se, v = k.current.y + se;
      }
      I.current = { w: he, h: Q }, (q.includes("w") || q.includes("n")) && (C.current = { x: A, y: v }), O();
    }
  }, [s, f, _, O]), K = j(() => {
    if ((B.current || S.current) && l)
      try {
        localStorage.setItem(`panel_${l}`, JSON.stringify({
          pos: C.current,
          size: I.current
        }));
      } catch {
      }
    B.current = !1, S.current = !1, L.current = null, document.body.style.cursor = "";
  }, [l]);
  ce(() => (document.addEventListener("mousemove", de), document.addEventListener("mouseup", K), () => {
    document.removeEventListener("mousemove", de), document.removeEventListener("mouseup", K);
  }), [de, K]), ce(() => {
    if (!d) return;
    const F = () => {
      const P = _ ? Math.min(window.innerHeight - 64, m.current?.offsetHeight || I.current.h) : I.current.h;
      C.current = {
        x: Math.max(0, (window.innerWidth - I.current.w) / 2),
        y: Math.max(0, (window.innerHeight - P) / 2)
      }, O();
    };
    return window.addEventListener("resize", F), F(), () => window.removeEventListener("resize", F);
  }, [_, d, O]);
  const T = (F) => {
    d || F.button !== 0 || !p || (F.preventDefault(), F.stopPropagation(), B.current = !0, M.current = { x: F.clientX, y: F.clientY }, k.current = { ...C.current }, document.body.style.cursor = "grabbing");
  }, X = (F) => (P) => {
    if (d || P.button !== 0 || !u) return;
    P.preventDefault(), P.stopPropagation(), S.current = !0, L.current = F, M.current = { x: P.clientX, y: P.clientY }, U.current = { ...I.current }, k.current = { ...C.current };
    const $ = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    };
    document.body.style.cursor = $[F];
  }, Z = (F) => {
    F.stopPropagation(), n?.();
  }, ie = C.current, fe = I.current, z = typeof window < "u" ? Math.max(f, Math.min(fe.h, window.innerHeight - 64)) : fe.h;
  return /* @__PURE__ */ c(ge, { children: [
    d && /* @__PURE__ */ t(
      "div",
      {
        className: "ui-modal-scrim"
      }
    ),
    /* @__PURE__ */ c(
      "div",
      {
        ref: m,
        className: `ui-panel${d ? " ui-panel-modal" : ""}${l ? ` ui-panel-${l}` : ""}`,
        style: {
          position: d ? "fixed" : "absolute",
          left: 0,
          top: 0,
          transform: `translate(${ie.x}px, ${ie.y}px)`,
          width: fe.w,
          height: _ ? "auto" : z,
          maxHeight: "calc(100vh - 64px)",
          zIndex: d ? 2e3 : 200,
          willChange: B.current || S.current ? "transform, width, height" : "auto"
        },
        children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `ui-panel-header ${!p || d ? "ui-panel-header-static" : ""}`,
              onMouseDown: T,
              children: [
                /* @__PURE__ */ t("span", { className: "ui-panel-title", children: e }),
                n && /* @__PURE__ */ t(
                  "button",
                  {
                    className: "ui-panel-close",
                    onClick: Z,
                    title: b,
                    children: /* @__PURE__ */ t(ut, { width: 14, height: 14 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t("div", { className: "ui-panel-content", children: r }),
          u && !d && /* @__PURE__ */ c(ge, { children: [
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-e", onMouseDown: X("e") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-s", onMouseDown: X("s") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-w", onMouseDown: X("w") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-se", onMouseDown: X("se") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-sw", onMouseDown: X("sw") })
          ] })
        ]
      }
    )
  ] });
}, qe = ({ label: e, children: n, labelWidth: r = "80px", stretch: i = !1 }) => /* @__PURE__ */ c("div", { className: "ui-form-row ui-form-row-tight", children: [
  /* @__PURE__ */ t(
    "span",
    {
      className: "ui-form-label ui-form-label-dynamic",
      style: { "--label-width": r },
      children: e
    }
  ),
  /* @__PURE__ */ t(
    "div",
    {
      className: `ui-form-value ${i ? "ui-form-value-stretch" : ""} ${i ? "" : "ui-form-value-end"}`,
      children: n
    }
  )
] }), Di = ({
  t: e,
  onClose: n,
  settings: r,
  onUpdate: i,
  currentLang: a,
  setLang: o,
  showStats: h,
  setShowStats: u,
  theme: p
}) => {
  const [l, d] = V("general"), _ = [
    { value: "general", label: e("setting_general") || "通用" },
    { value: "lighting", label: e("st_lighting") || "光照" },
    { value: "viewport", label: e("st_viewport") || "视口" },
    { value: "highlight", label: e("st_highlight") || "高亮" }
  ], b = r.themeType || "indigo", m = r.themeCustomColor || "#4f46e5", w = a === "zh";
  return /* @__PURE__ */ t(
    et,
    {
      title: e("settings"),
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 420,
      height: 440,
      modal: !0,
      movable: !1,
      theme: p,
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-settings-panel-body", children: [
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-sticky-tabs", children: /* @__PURE__ */ t(
          Tt,
          {
            options: _,
            value: l,
            onChange: (g) => d(g)
          }
        ) }),
        l === "general" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(qe, { label: e("st_theme") || "主题色", labelWidth: "70px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-theme-picker", children: [
            mn.map((g) => /* @__PURE__ */ t(
              "button",
              {
                title: w ? g.labelZh : g.labelEn,
                className: `ui-theme-swatch${b === g.key ? " active" : ""}`,
                style: { background: g.swatch },
                onClick: () => i({ themeType: g.key, themeCustomColor: void 0 })
              },
              g.key
            )),
            /* @__PURE__ */ t(
              "div",
              {
                className: `ui-theme-swatch ui-theme-swatch-custom${b === "custom" ? " active" : ""}`,
                title: w ? "自定义颜色" : "Custom color",
                children: /* @__PURE__ */ t(
                  "input",
                  {
                    type: "color",
                    value: b === "custom" ? m : "#4f46e5",
                    onChange: (g) => i({ themeType: "custom", themeCustomColor: g.target.value }),
                    title: w ? "自定义颜色" : "Custom color"
                  }
                )
              }
            )
          ] }) }),
          /* @__PURE__ */ t(qe, { label: e("st_lang"), labelWidth: "70px", stretch: !0, children: /* @__PURE__ */ t(
            dt,
            {
              value: a,
              options: [
                { value: "zh", label: "简体中文" },
                { value: "en", label: "English" }
              ],
              onChange: (g) => o(g)
            }
          ) }),
          /* @__PURE__ */ t(qe, { label: e("st_monitor"), labelWidth: "82px", children: /* @__PURE__ */ t(
            ht,
            {
              checked: h,
              onChange: (g) => u(g)
            }
          ) }),
          /* @__PURE__ */ t(qe, { label: e("st_locate_mode") || "定位方式", labelWidth: "82px", stretch: !0, children: /* @__PURE__ */ t(
            Tt,
            {
              options: [
                { value: "normal", label: e("st_locate_mode_normal") || "普通定位" },
                { value: "isolate", label: e("st_locate_mode_isolate") || "隔离定位" }
              ],
              value: r.locateIsolateMode === !0 ? "isolate" : "normal",
              onChange: (g) => i({ locateIsolateMode: g === "isolate" })
            }
          ) }),
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted ui-settings-hint", children: r.locateIsolateMode === !0 ? e("st_locate_mode_isolate_hint") || "定位时临时隐藏其他对象，大模型恢复时可能较慢。" : e("st_locate_mode_normal_hint") || "只移动视图并高亮对象，速度最快。" })
        ] }),
        l === "lighting" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(qe, { label: e("st_ambient") || "环境光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: r.ambientInt || 0,
                onChange: (g) => i({ ambientInt: g })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.ambientInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(qe, { label: e("st_dir") || "主光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: r.dirInt || 0,
                onChange: (g) => i({ dirInt: g })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.dirInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(qe, { label: e("st_back") || "背光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 0,
                max: 2,
                step: 0.05,
                value: r.backLightInt ?? 0.5,
                onChange: (g) => i({ backLightInt: g })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.backLightInt ?? 0.5).toFixed(2) })
          ] }) })
        ] }),
        l === "viewport" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(qe, { label: e("st_viewcube_size"), labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 120,
                max: 180,
                step: 5,
                value: r.viewCubeSize || 120,
                onChange: (g) => i({ viewCubeSize: g })
              }
            ) }),
            /* @__PURE__ */ c("div", { className: "ui-result-item-secondary-value ui-result-item-secondary-value-wide", children: [
              r.viewCubeSize || 120,
              "px"
            ] })
          ] }) }),
          /* @__PURE__ */ t(qe, { label: e("st_adaptive_quality") || "Adaptive", labelWidth: "90px", children: /* @__PURE__ */ t(
            ht,
            {
              checked: r.adaptiveQuality !== !1,
              onChange: (g) => i({ adaptiveQuality: g })
            }
          ) }),
          /* @__PURE__ */ t(qe, { label: e("st_performance_profile") || "性能策略", labelWidth: "90px", children: /* @__PURE__ */ t("div", { className: "ui-inline-actions ui-inline-actions-end", children: /* @__PURE__ */ t(
            Tt,
            {
              options: [
                { value: "smooth", label: e("st_perf_smooth") || "流畅优先" },
                { value: "balanced", label: e("st_perf_balanced") || "平衡" },
                { value: "quality", label: e("st_perf_quality") || "画质优先" }
              ],
              value: r.performanceMode || "balanced",
              onChange: (g) => i({ performanceMode: g })
            }
          ) }) })
        ] }),
        l === "highlight" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(qe, { label: e("st_highlight_color") || "高亮颜色", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ t(
            Si,
            {
              value: r.highlightColor || "#ff9f1c",
              onChange: (g) => i({ highlightColor: g })
            }
          ) }),
          /* @__PURE__ */ t(qe, { label: e("st_highlight_box") || "高亮/定位包围盒", labelWidth: "110px", children: /* @__PURE__ */ t(
            ht,
            {
              checked: r.highlightShowBox === !0,
              onChange: (g) => i({ highlightShowBox: g })
            }
          ) }),
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted ui-settings-hint", children: e("st_highlight_box_hint") || "开启后，高亮和定位都会显示包围盒；关闭后只保留颜色高亮和视图定位。" })
        ] })
      ] })
    }
  );
}, Jn = {
  Trash: () => /* @__PURE__ */ t("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Close: () => /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 2L12 12M12 2L2 12", strokeLinecap: "round" }) })
}, Ai = ({ onClick: e, disabled: n }) => /* @__PURE__ */ t(
  Ee,
  {
    onClick: e,
    disabled: n,
    variant: "ghost",
    size: "sm",
    className: "ui-btn-icon",
    title: "Clear All",
    children: /* @__PURE__ */ t(Jn.Trash, {})
  }
), zi = ({ children: e, empty: n, emptyText: r }) => /* @__PURE__ */ t("div", { className: "ui-data-panel ui-measure-results", children: n ? /* @__PURE__ */ t("div", { className: "ui-measure-empty", children: r }) : e }), Bi = ({ item: e, isHighlighted: n, onHighlight: r, onDelete: i }) => /* @__PURE__ */ c(
  "div",
  {
    onClick: r,
    className: `ui-list-item ui-measure-item ${n ? "selected" : ""}`,
    children: [
      /* @__PURE__ */ t("span", { className: "ui-measure-item-value", children: e.val }),
      /* @__PURE__ */ t(
        "button",
        {
          onClick: (a) => {
            a.stopPropagation(), i();
          },
          className: "ui-btn ui-btn-icon-sm ui-btn-ghost ui-measure-item-delete",
          children: /* @__PURE__ */ t(Jn.Close, {})
        }
      )
    ]
  }
), $i = ({ label: e }) => /* @__PURE__ */ t("div", { className: "ui-group-title", children: e }), Vi = ({
  t: e,
  sceneMgr: n,
  measureType: r,
  setMeasureType: i,
  measureHistory: a,
  onDelete: o,
  onClear: h,
  onClose: u,
  highlightedId: p,
  onHighlight: l
}) => {
  const d = Ie(() => {
    const w = {
      dist: [],
      angle: [],
      coord: []
    };
    return a.forEach((g) => {
      w[g.type] && w[g.type].push(g);
    }), w;
  }, [a]), _ = (w) => {
    i(w), n?.startMeasurement(w);
  }, b = () => {
    switch (r) {
      case "dist":
        return e("measure_instruct_dist");
      case "angle":
        return e("measure_instruct_angle");
      case "coord":
        return e("measure_instruct_coord");
      default:
        return "";
    }
  }, m = (w) => {
    switch (w) {
      case "dist":
        return e("measure_dist") || "Distance";
      case "angle":
        return e("measure_angle") || "Angle";
      case "coord":
        return e("measure_coord") || "Coordinate";
      default:
        return w;
    }
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: e("measure_title"),
      closeLabel: e("panel_close") || "关闭",
      onClose: u,
      width: 300,
      height: 400,
      resizable: !0,
      storageId: "tool_measure",
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between ui-measure-header", children: [
          /* @__PURE__ */ c("div", { className: "ui-segmented ui-measure-types", children: [
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "none" ? "active" : ""}`,
                onClick: () => _("none"),
                children: /* @__PURE__ */ t("span", { children: e("measure_none") || "None" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "dist" ? "active" : ""}`,
                onClick: () => _("dist"),
                children: /* @__PURE__ */ t("span", { children: e("measure_dist") || "Distance" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "angle" ? "active" : ""}`,
                onClick: () => _("angle"),
                children: /* @__PURE__ */ t("span", { children: e("measure_angle") || "Angle" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "coord" ? "active" : ""}`,
                onClick: () => _("coord"),
                children: /* @__PURE__ */ t("span", { children: e("measure_coord") || "Coord" })
              }
            )
          ] }),
          /* @__PURE__ */ t(Ai, { onClick: h, disabled: a.length === 0 })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ t("span", { children: b() }),
          r !== "none" && /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-muted", children: "[ESC] Exit" })
        ] }),
        /* @__PURE__ */ t(zi, { empty: a.length === 0, emptyText: e("no_measurements") || "No measurements", children: a.length > 0 && /* @__PURE__ */ t("div", { className: "ui-measure-results-scroll", children: Object.entries(d).map(([w, g]) => g.length === 0 ? null : /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ t($i, { label: m(w) }),
          g.map((s) => /* @__PURE__ */ t(
            Bi,
            {
              item: s,
              isHighlighted: p === s.id,
              onHighlight: () => l?.(s.id),
              onDelete: () => o(s.id)
            },
            s.id
          ))
        ] }, w)) }) })
      ] })
    }
  );
}, on = ({ axis: e, label: n, active: r, value: i, onToggle: a, onChange: o, disabled: h = !1 }) => /* @__PURE__ */ c(
  "div",
  {
    className: `ui-clip-axis-row${h ? " ui-is-disabled" : ""}`,
    children: [
      /* @__PURE__ */ t(
        Je,
        {
          checked: r,
          onChange: (u) => a(u),
          className: "ui-clip-axis-checkbox"
        }
      ),
      /* @__PURE__ */ t(
        "span",
        {
          className: `ui-clip-axis-label${r ? " is-active" : ""}`,
          children: e.toUpperCase()
        }
      ),
      /* @__PURE__ */ t("div", { className: "ui-clip-axis-slider", children: /* @__PURE__ */ t(
        Ni,
        {
          min: 0,
          max: 100,
          value: i,
          onChange: o,
          disabled: h || !r
        }
      ) }),
      /* @__PURE__ */ c(
        "span",
        {
          className: "ui-clip-axis-value",
          children: [
            String(Math.round(i[0])).padStart(2, "0"),
            "-",
            String(Math.round(i[1])).padStart(2, "0"),
            "%"
          ]
        }
      )
    ]
  }
), Pi = ({
  t: e,
  onClose: n,
  clipEnabled: r,
  setClipEnabled: i,
  clipValues: a,
  setClipValues: o,
  clipActive: h,
  setClipActive: u,
  clipHelperVisible: p,
  setClipHelperVisible: l,
  clipHelperOpacity: d,
  setClipHelperOpacity: _
}) => {
  const b = () => {
    o({ x: [0, 100], y: [0, 100], z: [0, 100] });
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: e("clip_title"),
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 410,
      height: 420,
      resizable: !1,
      storageId: "tool_clip",
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-clip-panel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-panel-section ui-clip-panel-section", children: [
          /* @__PURE__ */ c("div", { className: "ui-form-row ui-clip-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_enable") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(ht, { checked: r, onChange: (m) => i(m) }) })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-form-row ui-clip-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_helper_visible") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(
              ht,
              {
                checked: p,
                onChange: (m) => l(m),
                disabled: !r
              }
            ) })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-form-row ui-clip-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_helper_opacity") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value ui-form-value-stretch", children: /* @__PURE__ */ c("div", { className: "ui-slider-field ui-clip-opacity-field", children: [
              /* @__PURE__ */ t(
                vt,
                {
                  min: 0.05,
                  max: 0.35,
                  step: 0.01,
                  value: d,
                  onChange: (m) => _(m),
                  disabled: !r || !p
                }
              ),
              /* @__PURE__ */ c("span", { className: "ui-slider-value", children: [
                Math.round(d * 100),
                "%"
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ c(
          "div",
          {
            className: `ui-panel-section ui-clip-range-section${r ? "" : " ui-is-disabled"}`,
            children: [
              /* @__PURE__ */ t(
                on,
                {
                  axis: "x",
                  label: e("clip_x"),
                  active: h.x,
                  value: a.x,
                  onToggle: (m) => u({ ...h, x: m }),
                  onChange: (m) => o({ ...a, x: m }),
                  disabled: !r
                }
              ),
              /* @__PURE__ */ t(
                on,
                {
                  axis: "y",
                  label: e("clip_y"),
                  active: h.y,
                  value: a.y,
                  onToggle: (m) => u({ ...h, y: m }),
                  onChange: (m) => o({ ...a, y: m }),
                  disabled: !r
                }
              ),
              /* @__PURE__ */ t(
                on,
                {
                  axis: "z",
                  label: e("clip_z"),
                  active: h.z,
                  value: a.z,
                  onToggle: (m) => u({ ...h, z: m }),
                  onChange: (m) => o({ ...a, z: m }),
                  disabled: !r
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ t("div", { className: "ui-panel-footer ui-clip-panel-footer", children: /* @__PURE__ */ t(Ee, { variant: "default", onClick: b, disabled: !r, children: e("clip_reset") || "重置范围" }) })
      ] })
    }
  );
}, Fi = ({ t: e, onClose: n, onExport: r, getDefaultFileName: i, theme: a }) => {
  const [o, h] = V("glb"), [u, p] = V(() => i("glb"));
  return ce(() => {
    p(i(o));
  }, [o, i]), /* @__PURE__ */ t(et, { title: e("export_title"), closeLabel: e("panel_close") || "关闭", onClose: n, width: 400, height: 430, resizable: !1, theme: a, storageId: "tool_export", children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-export-panel-body", children: [
    /* @__PURE__ */ c("div", { className: "ui-toolpanel-caption", children: [
      e("export_format"),
      ":"
    ] }),
    [
      { id: "glb", label: "GLB", desc: e("export_glb") },
      { id: "lmb", label: "LMB", desc: e("export_lmb") },
      { id: "nbim", label: "NBIM", desc: e("export_nbim") }
    ].map((l) => /* @__PURE__ */ c("label", { className: `ui-choice-card ${o === l.id ? "active" : ""}`, children: [
      /* @__PURE__ */ t(
        "input",
        {
          type: "radio",
          name: "exportFmt",
          checked: o === l.id,
          onChange: () => h(l.id),
          className: "ui-choice-card-radio"
        }
      ),
      /* @__PURE__ */ c("div", { className: "ui-choice-card-content", children: [
        /* @__PURE__ */ t("div", { className: "ui-choice-card-title", children: l.label }),
        /* @__PURE__ */ t("div", { className: "ui-choice-card-desc", children: l.desc })
      ] })
    ] }, l.id)),
    /* @__PURE__ */ c("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
      e("export_filename") || "文件名",
      ":"
    ] }),
    /* @__PURE__ */ t(
      "input",
      {
        type: "text",
        value: u,
        onChange: (l) => p(l.target.value),
        placeholder: e("export_filename_placeholder") || "请输入文件名",
        className: "ui-input ui-input-compact"
      }
    ),
    /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("export_filename_hint") || "留空时自动按模型名生成" }),
    /* @__PURE__ */ t(
      Ee,
      {
        theme: a,
        onClick: () => r(o, u),
        className: "ui-toolpanel-submit",
        children: e("export_btn")
      }
    )
  ] }) });
}, Oi = ({ t: e, onClose: n, onCapture: r, theme: i }) => {
  const [a, o] = V("scene"), h = [
    {
      id: "scene",
      label: e("op_screenshot") || "场景截图",
      desc: e("screenshot_scene_desc") || "保留当前背景色和界面里的场景效果"
    },
    {
      id: "transparent",
      label: e("op_screenshot_transparent") || "透明背景截图",
      desc: e("screenshot_transparent_desc") || "导出透明背景 PNG，便于汇报和排版"
    }
  ];
  return /* @__PURE__ */ t(
    et,
    {
      title: e("op_screenshot") || "场景截图",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 380,
      height: 300,
      resizable: !1,
      theme: i,
      storageId: "tool_screenshot",
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-screenshot-panel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-caption", children: [
          e("screenshot_mode") || "截图方式",
          ":"
        ] }),
        h.map((u) => /* @__PURE__ */ c("label", { className: `ui-choice-card ${a === u.id ? "active" : ""}`, children: [
          /* @__PURE__ */ t(
            "input",
            {
              type: "radio",
              name: "screenshotMode",
              checked: a === u.id,
              onChange: () => o(u.id),
              className: "ui-choice-card-radio"
            }
          ),
          /* @__PURE__ */ c("div", { className: "ui-choice-card-content", children: [
            /* @__PURE__ */ t("div", { className: "ui-choice-card-title", children: u.label }),
            /* @__PURE__ */ t("div", { className: "ui-choice-card-desc", children: u.desc })
          ] })
        ] }, u.id)),
        /* @__PURE__ */ t(
          Ee,
          {
            theme: i,
            onClick: () => r(a),
            className: "ui-toolpanel-submit",
            children: e("btn_confirm") || "确定"
          }
        )
      ] })
    }
  );
}, Ti = {
  visibility: !0,
  selection: !0,
  clip: !0,
  explode: !0
}, Ri = ({
  t: e,
  onClose: n,
  viewpoints: r,
  onSave: i,
  onUpdateName: a,
  onLoad: o,
  onDelete: h,
  theme: u
}) => {
  const [p, l] = V(""), [d, _] = V({}), [b, m] = V(Ti);
  ce(() => {
    l(`${e("viewpoint_title") || "视点"} ${r.length + 1}`);
  }, [r.length, e]), ce(() => {
    _(
      r.reduce((s, f) => (s[f.id] = f.name, s), {})
    );
  }, [r]);
  const w = () => {
    const s = p.trim();
    s && (i(s, b), l(`${e("viewpoint_title") || "视点"} ${r.length + 1}`));
  }, g = (s) => {
    const f = (d[s] || "").trim();
    if (!f) {
      _((N) => ({
        ...N,
        [s]: r.find((y) => y.id === s)?.name || ""
      }));
      return;
    }
    a(s, f);
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: e("viewpoint_title") || "视点管理",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 360,
      height: 520,
      resizable: !0,
      theme: u,
      storageId: "tool_viewpoint",
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-toolpanel-body-dense", children: [
        /* @__PURE__ */ c("div", { className: "ui-inline-actions", children: [
          /* @__PURE__ */ t(
            "input",
            {
              autoFocus: !0,
              value: p,
              onChange: (s) => l(s.target.value),
              onKeyDown: (s) => {
                s.key === "Enter" && w();
              },
              className: "ui-input",
              placeholder: e("viewpoint_title") || "视点名称"
            }
          ),
          /* @__PURE__ */ t(Ee, { variant: "primary", onClick: w, children: e("btn_confirm") || "保存" })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-viewpoint-options", children: [
          /* @__PURE__ */ t(
            Je,
            {
              label: e("viewpoint_save_visibility") || "保存可见性",
              checked: b.visibility,
              onChange: (s) => m((f) => ({ ...f, visibility: s }))
            }
          ),
          /* @__PURE__ */ t(
            Je,
            {
              label: e("viewpoint_save_selection") || "保存选择",
              checked: b.selection,
              onChange: (s) => m((f) => ({ ...f, selection: s }))
            }
          ),
          /* @__PURE__ */ t(
            Je,
            {
              label: e("viewpoint_save_clip") || "保存剖切",
              checked: b.clip,
              onChange: (s) => m((f) => ({ ...f, clip: s }))
            }
          ),
          /* @__PURE__ */ t(
            Je,
            {
              label: e("viewpoint_save_explode") || "保存爆炸图",
              checked: b.explode,
              onChange: (s) => m((f) => ({ ...f, explode: s }))
            }
          )
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-viewpoint-list-wrap", children: r.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-empty-state", children: e("viewpoint_empty") || "暂无保存的视点" }) : /* @__PURE__ */ t("div", { className: "ui-viewpoint-grid", children: r.map((s) => /* @__PURE__ */ c("div", { className: "ui-viewpoint-card-v2", children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: "ui-viewpoint-image",
              onDoubleClick: () => o(s),
              title: e("viewpoint_load") || "双击恢复视点",
              children: [
                s.image ? /* @__PURE__ */ t(
                  "img",
                  {
                    src: s.image,
                    alt: s.name
                  }
                ) : /* @__PURE__ */ t("div", { className: "ui-viewpoint-no-preview", children: e("viewpoint_no_preview") || "无预览" }),
                /* @__PURE__ */ t(
                  "button",
                  {
                    className: "ui-viewpoint-delete",
                    onClick: (f) => {
                      f.stopPropagation(), h(s.id);
                    },
                    title: e("delete_item") || "删除",
                    children: /* @__PURE__ */ t(Qa, { size: 12 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              className: "ui-viewpoint-name",
              value: d[s.id] || "",
              onChange: (f) => _((N) => ({
                ...N,
                [s.id]: f.target.value
              })),
              onBlur: () => g(s.id),
              onKeyDown: (f) => {
                f.key === "Enter" && f.currentTarget.blur();
              }
            }
          ),
          /* @__PURE__ */ c("div", { className: "ui-viewpoint-flags", children: [
            s.saveOptions?.visibility !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_visibility") || "可见性" }),
            s.saveOptions?.selection !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_selection") || "选择" }),
            s.saveOptions?.clip !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_clip") || "剖切" }),
            s.saveOptions?.explode !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_explode") || "爆炸图" })
          ] })
        ] }, s.id)) }) })
      ] })
    }
  );
}, sn = ({ label: e, children: n, stretch: r = !1 }) => /* @__PURE__ */ c(
  "div",
  {
    className: "ui-form-row ui-form-row-tight",
    children: [
      /* @__PURE__ */ t("span", { className: "ui-form-label", children: e }),
      /* @__PURE__ */ t(
        "div",
        {
          className: `ui-form-value${r ? " ui-form-value-stretch ui-form-value-start" : ""}`,
          children: n
        }
      )
    ]
  }
), Ui = ({
  t: e,
  onClose: n,
  enabled: r,
  strength: i,
  mode: a,
  onEnabledChange: o,
  onStrengthChange: h,
  onModeChange: u,
  onReset: p,
  theme: l
}) => /* @__PURE__ */ t(
  et,
  {
    title: e("explode_title") || "爆炸图",
    closeLabel: e("panel_close") || "关闭",
    onClose: n,
    width: 360,
    storageId: "tool_explode",
    modal: !1,
    autoHeight: !0,
    theme: l,
    children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-toolpanel-body-compact", children: [
      /* @__PURE__ */ t(sn, { label: e("explode_enable") || "启用", children: /* @__PURE__ */ t(ht, { checked: r, onChange: o }) }),
      /* @__PURE__ */ t(sn, { label: e("explode_strength") || "强度", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
        /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
          vt,
          {
            min: 0,
            max: 100,
            step: 1,
            value: i,
            onChange: h
          }
        ) }),
        /* @__PURE__ */ c("div", { className: "ui-slider-value ui-slider-value-strong", children: [
          i,
          "%"
        ] })
      ] }) }),
      /* @__PURE__ */ t(sn, { label: e("explode_mode") || "方向", stretch: !0, children: /* @__PURE__ */ t(
        Tt,
        {
          options: [
            { value: "radial", label: e("explode_mode_radial") || "四周" },
            { value: "horizontal", label: e("explode_mode_horizontal") || "横向" },
            { value: "vertical", label: e("explode_mode_vertical") || "纵向" }
          ],
          value: a,
          onChange: (d) => u(d)
        }
      ) }),
      /* @__PURE__ */ t("div", { className: "ui-panel-footer ui-panel-footer-spaced", children: /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: p, children: e("explode_reset") || "重置" }) })
    ] })
  }
), ji = [
  { value: "equals", labelKey: "search_op_equals", fallback: "等于" },
  { value: "contains", labelKey: "search_op_contains", fallback: "包含" },
  {
    value: "notContains",
    labelKey: "search_op_not_contains",
    fallback: "不包含"
  },
  { value: "startsWith", labelKey: "search_op_starts_with", fallback: "开头" },
  { value: "endsWith", labelKey: "search_op_ends_with", fallback: "结尾" }
], Hi = [
  { value: "AND", labelKey: "search_connector_and", fallback: "且" },
  { value: "OR", labelKey: "search_connector_or", fallback: "或" }
], Gi = ({
  t: e,
  onClose: n,
  conditions: r,
  results: i,
  searching: a,
  searchProgress: o,
  searchStatus: h,
  propertyFieldOptions: u,
  onConditionsChange: p,
  onSearch: l,
  onCancelSearch: d,
  onApplyResultHighlight: _,
  onClearResult: b,
  theme: m
}) => {
  const [w, g] = V(1), [s, f] = V(10);
  ce(() => {
    g(1);
  }, [i.length, s]);
  const N = Math.max(1, Math.ceil(i.length / s)), y = Math.min(w, N), R = (y - 1) * s, ee = Ie(
    () => i.slice(R, R + s),
    [i, R, s]
  ), C = (S, L) => {
    p(
      r.map((M) => M.id === S ? { ...M, ...L } : M)
    );
  }, I = () => {
    const S = `cond_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    p([
      ...r,
      {
        id: S,
        propertyName: "",
        operator: "contains",
        value: "",
        connector: "AND"
      }
    ]);
  }, B = (S) => {
    const L = r.filter((M) => M.id !== S);
    p(
      L.length > 0 ? L : [
        {
          id: "cond_init",
          propertyName: "",
          operator: "contains",
          value: ""
        }
      ]
    );
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: e("tb_search") || "属性搜索",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 760,
      height: 580,
      resizable: !0,
      storageId: "tool_search",
      autoHeight: !1,
      theme: m,
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-search-panel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between", children: [
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption", children: e("search_conditions") || "搜索条件" }),
          /* @__PURE__ */ c("div", { className: "ui-toolpanel-row", children: [
            /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: I, children: e("search_add_condition") || "添加条件" }),
            /* @__PURE__ */ t(
              Ee,
              {
                className: "ui-properties-action",
                onClick: l,
                disabled: a,
                children: a ? e("searching") || "搜索中..." : e("search_run") || "搜索"
              }
            )
          ] })
        ] }),
        r.map((S, L) => /* @__PURE__ */ c("div", { className: "ui-search-condition-row", children: [
          /* @__PURE__ */ t("div", { className: "ui-search-condition-connector-cell", children: L > 0 && /* @__PURE__ */ t(
            dt,
            {
              value: S.connector || "AND",
              options: Hi.map((M) => ({
                value: M.value,
                label: e(M.labelKey) || M.fallback
              })),
              onChange: (M) => C(S.id, {
                connector: M
              }),
              className: "ui-input-compact ui-search-connector"
            }
          ) }),
          /* @__PURE__ */ t(
            dt,
            {
              value: S.propertyName,
              options: u.map((M) => ({
                value: M.value,
                label: M.label
              })),
              onChange: (M) => C(S.id, { propertyName: M }),
              placeholder: e("search_field_name") || "属性名",
              searchable: !0,
              searchPlaceholder: e("search_field_filter") || "搜索属性名",
              emptyText: e("search_no_fields") || "暂无可用属性",
              className: "ui-input-compact ui-search-field-input"
            }
          ),
          /* @__PURE__ */ t(
            dt,
            {
              value: S.operator,
              options: ji.map((M) => ({
                value: M.value,
                label: e(M.labelKey) || M.fallback
              })),
              onChange: (M) => C(S.id, {
                operator: M
              }),
              className: "ui-input-compact ui-search-operator"
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              className: "ui-input ui-input-compact ui-search-value-input",
              placeholder: e("search_field_value") || "属性值",
              value: S.value,
              onChange: (M) => C(S.id, { value: M.target.value })
            }
          ),
          /* @__PURE__ */ t("div", { className: "ui-search-condition-action-cell", children: L > 0 && /* @__PURE__ */ t(
            "button",
            {
              className: "ui-search-clear ui-search-clear-static ui-search-remove-btn",
              onClick: () => B(S.id),
              title: e("remove_condition") || "移除条件",
              children: /* @__PURE__ */ t(ut, { width: 14, height: 14 })
            }
          ) })
        ] }, S.id)),
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption ui-search-results-summary", children: /* @__PURE__ */ c("span", { children: [
          e("search_results") || "搜索结果",
          ": ",
          i.length
        ] }) }),
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-results-box ui-search-results-box", children: [
          /* @__PURE__ */ c("div", { className: "ui-search-hint-strip", children: [
            e("search_fields_total") || "可搜索属性",
            ": ",
            u.length
          ] }),
          i.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: e("search_no_results") || "暂无结果" }) : ee.map((S) => /* @__PURE__ */ t(
            "div",
            {
              className: "ui-search-result-item ui-search-result-item-simple",
              title: `${S.uuid}
${S.matchedBy.join(`
`)}`,
              children: /* @__PURE__ */ c(
                "button",
                {
                  className: "ui-search-result-main",
                  onClick: () => _(S.uuid),
                  children: [
                    /* @__PURE__ */ t("span", { children: S.name || S.uuid }),
                    /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: [S.type, S.modelId, ...S.matchedBy].filter(Boolean).join(" · ") })
                  ]
                }
              )
            },
            S.uuid
          ))
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-search-pagination", children: /* @__PURE__ */ t(
          Yn,
          {
            prevTitle: e("search_page_prev") || "上一页",
            nextTitle: e("search_page_next") || "下一页",
            currentPage: y,
            totalPages: N,
            onPrev: () => g((S) => Math.max(1, S - 1)),
            onNext: () => g((S) => Math.min(N, S + 1)),
            rightContent: /* @__PURE__ */ c("div", { className: "ui-search-page-actions", children: [
              /* @__PURE__ */ t(
                dt,
                {
                  value: String(s),
                  onChange: (S) => f(Number(S) || 10),
                  options: [
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" }
                  ],
                  className: "ui-input-compact ui-search-page-size"
                }
              ),
              /* @__PURE__ */ t(
                Ee,
                {
                  className: "ui-properties-action",
                  onClick: b,
                  disabled: i.length === 0,
                  children: e("search_clear") || "清除结果"
                }
              )
            ] })
          }
        ) }),
        a && /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay", children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-overlay-card", children: [
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay-title", children: h || e("searching") || "搜索中..." }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full", children: /* @__PURE__ */ t(
            "div",
            {
              className: "ui-progress-fill",
              style: {
                width: `${Math.max(0, Math.min(100, o))}%`
              }
            }
          ) }),
          /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
            /* @__PURE__ */ c("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: [
              Math.round(o),
              "%"
            ] }),
            /* @__PURE__ */ t(
              Ee,
              {
                className: "ui-properties-action",
                onClick: d,
                children: e("search_cancel") || "取消搜索"
              }
            )
          ] })
        ] }) })
      ] })
    }
  );
}, Wi = (e) => (n, r) => {
  const i = e(n);
  return i && i !== n ? i : r;
}, Tn = ({ title: e, summary: n, expanded: r, onToggle: i }) => /* @__PURE__ */ c("button", { type: "button", className: "ui-clash-section-toggle", onClick: i, children: [
  /* @__PURE__ */ c("span", { className: "ui-clash-section-title-wrap", children: [
    /* @__PURE__ */ t("span", { className: `ui-clash-section-arrow${r ? " expanded" : ""}`, children: "›" }),
    /* @__PURE__ */ t("span", { className: "ui-clash-section-title", children: e })
  ] }),
  n && /* @__PURE__ */ t("span", { className: "ui-clash-section-summary", children: n })
] }), ln = ({ label: e, children: n }) => /* @__PURE__ */ c("label", { className: "ui-clash-field", children: [
  /* @__PURE__ */ t("span", { className: "ui-clash-field-label", children: e }),
  /* @__PURE__ */ t("span", { className: "ui-clash-field-control", children: n })
] }), cn = (e) => Number.isFinite(e) ? Math.abs(e) >= 1e6 ? `${(e / 1e6).toFixed(1)}M` : Math.abs(e) >= 1e3 ? `${(e / 1e3).toFixed(1)}K` : String(e) : "0", Ki = (e, n) => n === "high" ? e("clash_severity_high", "高") : n === "medium" ? e("clash_severity_medium", "中") : e("clash_severity_low", "低"), Xi = (e, n) => n === "hard" ? e("clash_type_hard", "硬碰撞") : e("clash_type_clearance", "净空碰撞"), Yi = ({
  t: e,
  onClose: n,
  running: r,
  progress: i,
  status: a,
  scannedCount: o,
  pairsScanned: h,
  results: u,
  modelOptions: p,
  setA: l,
  setB: d,
  tolerance: _,
  minOverlapVolume: b,
  clearanceDistance: m,
  useNarrowPhase: w,
  useTrianglePhase: g,
  includeSameModel: s,
  onSetAChange: f,
  onSetBChange: N,
  onToleranceChange: y,
  onMinOverlapVolumeChange: R,
  onClearanceDistanceChange: ee,
  onUseNarrowPhaseChange: C,
  onUseTrianglePhaseChange: I,
  onIncludeSameModelChange: B,
  onRun: S,
  onCancel: L,
  onClear: M,
  onExportCsv: k,
  onRestoreVisibility: U,
  typeFilter: O,
  onTypeFilterChange: de,
  onSetASelectAll: K,
  onSetAClear: T,
  onSetBSelectAll: X,
  onSetBClear: Z,
  onFocusResult: ie,
  theme: fe
}) => {
  const z = Wi(e), [F, P] = V(1), [$, H] = V(10), [q, he] = V(!1), [Q, A] = V(!1);
  ce(() => {
    P(1);
  }, [u.length, $, O]);
  const v = Ie(() => O === "HARD" ? u.filter((D) => D.type === "hard") : O === "CLEARANCE" ? u.filter((D) => D.type === "clearance") : u, [u, O]), ne = Math.max(1, Math.ceil(v.length / $)), se = Math.min(F, ne), W = (se - 1) * $, Y = Ie(
    () => v.slice(W, W + $),
    [v, W, $]
  ), pe = Ie(() => new Set(l), [l]), re = Ie(() => new Set(d), [d]), te = Math.max(0, Math.min(100, Number.isFinite(i) ? i : 0)), Ce = a || (r ? z("clash_running", "正在执行碰撞检查...") : z("clash_ready", "准备就绪")), ke = `${z("clash_set_a", "模型集 A")} ${l.length} · ${z("clash_set_b", "模型集 B")} ${d.length}`, Ge = `${v.length} ${z("clash_results", "碰撞结果")}`, G = `${z("clash_tolerance", "容差")} ${_} · ${z("clash_clearance_distance", "净空")} ${m}`, oe = (D, _e, be) => {
    const le = new Set(D);
    le.has(_e) ? le.delete(_e) : le.add(_e), be(Array.from(le));
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: z("tb_clash", "碰撞"),
      closeLabel: z("panel_close", "关闭"),
      onClose: n,
      width: 560,
      height: 560,
      resizable: !0,
      storageId: "tool_clash",
      autoHeight: !1,
      theme: fe,
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-clash-panel ui-clash-panel-compact", children: [
        /* @__PURE__ */ c("div", { className: "ui-clash-scroll", children: [
          /* @__PURE__ */ c("div", { className: "ui-clash-section ui-clash-overview-section", children: [
            /* @__PURE__ */ c("div", { className: "ui-clash-status-line", children: [
              /* @__PURE__ */ c("div", { className: "ui-clash-status-title", children: [
                /* @__PURE__ */ t("span", { className: `ui-clash-status-dot${r ? " is-running" : ""}` }),
                /* @__PURE__ */ t("span", { children: Ce })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-clash-mini-stats", children: [
                /* @__PURE__ */ c("span", { children: [
                  z("clash_candidates", "候选"),
                  " ",
                  /* @__PURE__ */ t("b", { children: cn(o) })
                ] }),
                /* @__PURE__ */ c("span", { children: [
                  z("clash_pairs_scanned", "已扫描"),
                  " ",
                  /* @__PURE__ */ t("b", { children: cn(h) })
                ] }),
                /* @__PURE__ */ c("span", { children: [
                  z("clash_results", "结果"),
                  " ",
                  /* @__PURE__ */ t("b", { children: cn(u.length) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "ui-clash-actions-row", children: [
              r ? /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: L, children: z("search_cancel", "取消") }) : /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: S, variant: "primary", children: z("clash_run", "开始检查") }),
              /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: M, children: z("clash_clear", "清空结果") }),
              /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: k, disabled: u.length === 0, children: z("clash_export_csv", "导出 CSV") })
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-clash-section", children: [
            /* @__PURE__ */ t(
              Tn,
              {
                title: z("clash_scope_visible", "检测范围"),
                summary: ke,
                expanded: q,
                onToggle: () => he((D) => !D)
              }
            ),
            q && /* @__PURE__ */ c("div", { className: "ui-clash-section-content ui-clash-scope-grid", children: [
              /* @__PURE__ */ c("div", { className: "ui-selection-box", children: [
                /* @__PURE__ */ c("div", { className: "ui-selection-box-header", children: [
                  /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: z("clash_set_a", "模型集 A") }),
                  /* @__PURE__ */ c("div", { className: "ui-selection-box-actions", children: [
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: K, children: z("select_all", "全选") }),
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: T, children: z("search_clear", "清空") })
                  ] })
                ] }),
                /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: p.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: z("clash_no_models", "暂无模型") }) : p.map((D) => /* @__PURE__ */ t(
                  Je,
                  {
                    checked: pe.has(D.id),
                    onChange: () => oe(l, D.id, f),
                    label: D.name,
                    labelStyle: { fontSize: 12 }
                  },
                  `a_${D.id}`
                )) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-selection-box", children: [
                /* @__PURE__ */ c("div", { className: "ui-selection-box-header", children: [
                  /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: z("clash_set_b", "模型集 B") }),
                  /* @__PURE__ */ c("div", { className: "ui-selection-box-actions", children: [
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: X, children: z("select_all", "全选") }),
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: Z, children: z("search_clear", "清空") })
                  ] })
                ] }),
                /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: p.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: z("clash_no_models", "暂无模型") }) : p.map((D) => /* @__PURE__ */ t(
                  Je,
                  {
                    checked: re.has(D.id),
                    onChange: () => oe(d, D.id, N),
                    label: D.name,
                    labelStyle: { fontSize: 12 }
                  },
                  `b_${D.id}`
                )) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-clash-section", children: [
            /* @__PURE__ */ t(
              Tn,
              {
                title: z("settings_more", "检测参数"),
                summary: G,
                expanded: Q,
                onToggle: () => A((D) => !D)
              }
            ),
            Q && /* @__PURE__ */ c("div", { className: "ui-clash-section-content ui-clash-settings-compact", children: [
              /* @__PURE__ */ c("div", { className: "ui-clash-fields-grid", children: [
                /* @__PURE__ */ t(ln, { label: z("clash_tolerance", "容差"), children: /* @__PURE__ */ t(
                  nn,
                  {
                    className: "ui-input-compact ui-clash-input-full",
                    value: Number.isFinite(_) ? _ : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (D) => y(Math.max(0, D || 0))
                  }
                ) }),
                /* @__PURE__ */ t(ln, { label: z("clash_min_overlap", "最小重叠体积"), children: /* @__PURE__ */ t(
                  nn,
                  {
                    className: "ui-input-compact ui-clash-input-full",
                    value: Number.isFinite(b) ? b : 0,
                    min: 0,
                    step: 1e-6,
                    onChange: (D) => R(Math.max(0, D || 0))
                  }
                ) }),
                /* @__PURE__ */ t(ln, { label: z("clash_clearance_distance", "最小净空距离"), children: /* @__PURE__ */ t(
                  nn,
                  {
                    className: "ui-input-compact ui-clash-input-full",
                    value: Number.isFinite(m) ? m : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (D) => ee(Math.max(0, D || 0))
                  }
                ) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-clash-option-stack ui-clash-option-grid", children: [
                /* @__PURE__ */ t(
                  Je,
                  {
                    checked: w,
                    onChange: C,
                    label: z("clash_narrow_phase", "精筛（OBB）"),
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Je,
                  {
                    checked: g,
                    onChange: I,
                    label: z("clash_triangle_phase", "三角面复核"),
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Je,
                  {
                    checked: s,
                    onChange: B,
                    label: z("clash_include_same_model", "同模型内检测"),
                    labelStyle: { fontSize: 12 }
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-clash-section ui-clash-results-section", children: [
            /* @__PURE__ */ c("div", { className: "ui-clash-section-toggle ui-clash-section-toggle-static", children: [
              /* @__PURE__ */ t("span", { className: "ui-clash-section-title-wrap", children: /* @__PURE__ */ t("span", { className: "ui-clash-section-title", children: z("clash_results", "碰撞结果") }) }),
              /* @__PURE__ */ t("span", { className: "ui-clash-section-summary", children: Ge })
            ] }),
            /* @__PURE__ */ c("div", { className: "ui-clash-section-content ui-clash-results-content", children: [
              /* @__PURE__ */ c("div", { className: "ui-clash-results-toolbar ui-clash-results-toolbar-simple", children: [
                /* @__PURE__ */ t(
                  dt,
                  {
                    value: O,
                    onChange: (D) => de(D),
                    options: [
                      { value: "ALL", label: z("clash_type_all", "全部类型") },
                      { value: "HARD", label: z("clash_type_hard", "硬碰撞") },
                      { value: "CLEARANCE", label: z("clash_type_clearance", "净空碰撞") }
                    ],
                    className: "ui-input-compact ui-clash-filter-select",
                    style: { width: 136 }
                  }
                ),
                /* @__PURE__ */ t(
                  dt,
                  {
                    value: String($),
                    onChange: (D) => H(Number(D) || 10),
                    options: [
                      { value: "10", label: "10 / 页" },
                      { value: "20", label: "20 / 页" },
                      { value: "50", label: "50 / 页" }
                    ],
                    className: "ui-input-compact ui-clash-page-size",
                    style: { width: 96 }
                  }
                ),
                /* @__PURE__ */ t(Ee, { size: "sm", className: "ui-properties-action", onClick: U, children: z("show_all", "恢复显示") })
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-box ui-clash-results-box", children: v.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: z("clash_no_results", "暂无碰撞结果") }) : Y.map((D) => /* @__PURE__ */ c(
                "button",
                {
                  className: "ui-search-result-item ui-clash-result-item",
                  onClick: () => ie(D),
                  title: `${D.aUuid} <> ${D.bUuid}`,
                  children: [
                    /* @__PURE__ */ c("div", { className: "ui-clash-result-top", children: [
                      /* @__PURE__ */ c("span", { className: "ui-clash-result-title", children: [
                        D.aName || D.aUuid,
                        " ",
                        " <> ",
                        " ",
                        D.bName || D.bUuid
                      ] }),
                      /* @__PURE__ */ t("span", { className: `ui-clash-badge ui-clash-badge-${D.severity}`, children: Ki(z, D.severity) })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between ui-clash-result-meta", children: [
                      /* @__PURE__ */ c("span", { className: "ui-result-item-secondary", children: [
                        Xi(z, D.type),
                        " · ",
                        D.type === "hard" ? z("clash_overlap_volume", "重叠体积") : z("clash_distance", "净空距离")
                      ] }),
                      /* @__PURE__ */ t("span", { className: "ui-result-item-secondary-value", children: D.type === "hard" ? D.overlapVolume.toFixed(6) : D.distance.toFixed(6) })
                    ] })
                  ]
                },
                D.id
              )) }),
              v.length > 0 && /* @__PURE__ */ t("div", { className: "ui-clash-pagination", children: /* @__PURE__ */ t(
                Yn,
                {
                  prevTitle: z("search_page_prev", "上一页"),
                  nextTitle: z("search_page_next", "下一页"),
                  currentPage: se,
                  totalPages: ne,
                  onPrev: () => P((D) => Math.max(1, D - 1)),
                  onNext: () => P((D) => Math.min(ne, D + 1))
                }
              ) })
            ] })
          ] })
        ] }),
        r && /* @__PURE__ */ t("div", { className: "ui-clash-running-overlay", children: /* @__PURE__ */ c("div", { className: "ui-clash-running-card", children: [
          /* @__PURE__ */ t("div", { className: "ui-clash-running-title", children: Ce }),
          /* @__PURE__ */ c("div", { className: "ui-clash-running-meta", children: [
            z("clash_candidates", "候选"),
            " ",
            o,
            " · ",
            z("clash_pairs_scanned", "已扫描对数"),
            " ",
            h
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full ui-clash-running-progress", children: /* @__PURE__ */ t("div", { className: "ui-progress-fill", style: { width: `${te}%` } }) }),
          /* @__PURE__ */ c("div", { className: "ui-clash-running-footer", children: [
            /* @__PURE__ */ c("span", { children: [
              Math.round(te),
              "%"
            ] }),
            /* @__PURE__ */ t(Ee, { size: "sm", onClick: L, children: z("search_cancel", "取消") })
          ] })
        ] }) })
      ] })
    }
  );
}, qi = ({
  t: e,
  loading: n,
  status: r,
  progress: i,
  theme: a
}) => {
  if (!n) return null;
  const o = Math.max(0, Math.min(100, Number.isFinite(i) ? i : 0)), h = `${Math.round(o)}%`;
  return /* @__PURE__ */ t("div", { className: "ui-loading-overlay", children: /* @__PURE__ */ c("div", { className: "ui-loading-box", children: [
    /* @__PURE__ */ c("div", { className: "ui-loading-header", children: [
      /* @__PURE__ */ t("div", { className: "ui-loading-title", children: r }),
      /* @__PURE__ */ t("div", { className: "ui-loading-percent", children: h })
    ] }),
    /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-loading-progress", children: /* @__PURE__ */ t(
      "div",
      {
        className: "ui-progress-fill",
        style: { width: h }
      }
    ) }),
    /* @__PURE__ */ c("div", { className: "ui-loading-meta", children: [
      /* @__PURE__ */ c("svg", { className: "ui-loading-spinner", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ t(
          "circle",
          {
            className: "ui-loading-spinner-track",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4",
            fill: "none"
          }
        ),
        /* @__PURE__ */ t(
          "path",
          {
            className: "ui-loading-spinner-head",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { children: o >= 100 ? e("processing") : e("loading_resources") })
    ] })
  ] }) });
};
function Pe(e) {
  return String(e ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
function er(e) {
  if (e == null) return "";
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean") return String(e);
  if (Array.isArray(e)) return e.map((n) => er(n)).filter(Boolean).join(", ");
  if (typeof e == "object")
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  return String(e);
}
function Qi(e) {
  return Array.isArray(e) ? e : Object.entries(e).map(([n, r]) => ({ key: n, value: r }));
}
function wt(e, n, r) {
  return Qi(n).map((i, a) => {
    const o = String(i.key ?? "").trim(), h = er(i.value);
    if (!o || !h) return null;
    const u = `${e}.${o}`;
    return {
      id: i.id || `${e}::${o}::${a}`,
      group: e,
      key: o,
      value: h,
      path: u,
      rawKey: i.rawKey,
      source: i.source || r,
      normalizedGroup: Pe(e),
      normalizedKey: Pe(o),
      normalizedPath: Pe(u),
      normalizedValue: Pe(h)
    };
  }).filter(Boolean);
}
function Zi(e, n) {
  return e ? Object.entries(e).map(([r, i]) => ({
    name: r,
    items: wt(r, i, n)
  })).filter((r) => r.items.length > 0) : [];
}
function Ji(e, n) {
  const r = Pe(n);
  return r ? e.map((i) => ({
    ...i,
    items: i.items.filter(
      (a) => a.normalizedGroup.includes(r) || a.normalizedKey.includes(r) || a.normalizedPath.includes(r) || a.normalizedValue.includes(r)
    )
  })).filter((i) => i.items.length > 0) : e.filter((i) => i.items.length > 0);
}
function un(e) {
  return e.map((n) => [`[${n.name}]`, ...n.items.map((r) => `${r.key}: ${r.value}`)].join(`
`)).join(`

`);
}
const eo = 1200, to = 120;
async function no(e) {
  if (!e) return !1;
  try {
    if (navigator.clipboard?.writeText)
      return await navigator.clipboard.writeText(e), !0;
  } catch {
  }
  try {
    const n = document.createElement("textarea");
    n.value = e, n.setAttribute("readonly", "true"), n.style.position = "fixed", n.style.left = "-9999px", n.style.top = "0", n.style.opacity = "0", document.body.appendChild(n), n.focus(), n.select();
    const r = document.execCommand("copy");
    return document.body.removeChild(n), r;
  } catch {
    return !1;
  }
}
function ro(e, n) {
  const [r, i] = V(e);
  return ce(() => {
    const a = window.setTimeout(() => {
      i(e);
    }, n);
    return () => {
      window.clearTimeout(a);
    };
  }, [e, n]), r;
}
const ao = ({
  t: e,
  selectedProps: n,
  theme: r
}) => {
  const [i, a] = V(/* @__PURE__ */ new Set()), [o, h] = V(""), [u, p] = V(!1), [l, d] = V(null), _ = ue(null), b = ro(
    o.trim(),
    to
  );
  ce(() => () => {
    _.current !== null && window.clearTimeout(_.current);
  }, []), ce(() => {
    a(/* @__PURE__ */ new Set()), h(""), d(null);
  }, [n]);
  const m = Ie(() => n ? Ji(n, b) : null, [n, b]);
  ce(() => {
    if (!m || !b) return;
    const k = new Set(
      m.map((U) => U.name)
    );
    a((U) => {
      const O = new Set(U);
      return k.forEach((de) => O.delete(de)), O;
    });
  }, [m, b]);
  const w = Ie(() => m ? m.reduce((k, U) => k + U.items.length, 0) : 0, [m]), g = m?.length ?? 0, s = () => {
    p(!0), _.current !== null && window.clearTimeout(_.current), _.current = window.setTimeout(() => {
      p(!1), _.current = null;
    }, eo);
  }, f = async (k) => {
    await no(k) && s();
  }, N = (k) => [
    `[${k.name}]`,
    ...k.items.map((U) => `${U.key}: ${U.value}`)
  ].join(`
`), y = (k) => `${k.key}: ${k.value}`, R = (k) => {
    a((U) => {
      const O = new Set(U);
      return O.has(k) ? O.delete(k) : O.add(k), O;
    });
  }, ee = () => {
    a(/* @__PURE__ */ new Set());
  }, C = () => {
    m && a(new Set(m.map((k) => k.name)));
  }, I = () => {
    h("");
  }, B = () => {
    d(null);
  }, S = (k) => {
    k.preventDefault();
    const U = [
      {
        label: e("expand_all") || "全部展开",
        onClick: ee,
        disabled: !m || m.length === 0
      },
      {
        label: e("collapse_all") || "全部折叠",
        onClick: C,
        disabled: !m || m.length === 0
      },
      {
        divider: !0
      },
      {
        label: e("copy_all_props") || "复制全部",
        onClick: () => {
          n && f(un(n));
        },
        disabled: !n
      }
    ];
    d({
      x: k.clientX,
      y: k.clientY,
      items: U
    });
  }, L = (k, U) => {
    k.preventDefault(), k.stopPropagation();
    const de = [
      {
        label: i.has(U.name) ? e("expand_group") || "展开分组" : e("collapse_group") || "折叠分组",
        onClick: () => R(U.name)
      },
      {
        label: e("expand_all") || "全部展开",
        onClick: ee
      },
      {
        label: e("collapse_all") || "全部折叠",
        onClick: C
      },
      {
        divider: !0
      },
      {
        label: e("copy_group_props") || "复制分组",
        onClick: () => f(N(U))
      },
      {
        label: e("copy_all_props") || "复制全部",
        onClick: () => {
          n && f(un(n));
        },
        disabled: !n
      }
    ];
    d({
      x: k.clientX,
      y: k.clientY,
      items: de
    });
  }, M = (k, U, O) => {
    k.preventDefault(), k.stopPropagation();
    const de = [
      {
        label: e("copy_item_props") || "复制单个",
        onClick: () => f(y(O))
      },
      {
        label: e("copy_prop_key") || "复制属性名",
        onClick: () => f(O.key)
      },
      {
        label: e("copy_prop_value") || "复制属性值",
        onClick: () => f(O.value)
      },
      {
        divider: !0
      },
      {
        label: e("copy_group_props") || "复制分组",
        onClick: () => f(N(U))
      },
      {
        label: e("copy_all_props") || "复制全部",
        onClick: () => {
          n && f(un(n));
        },
        disabled: !n
      }
    ];
    d({
      x: k.clientX,
      y: k.clientY,
      items: de
    });
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: "ui-properties-panel",
      onContextMenu: S,
      children: [
        n && /* @__PURE__ */ c("div", { className: "ui-properties-toolbar", children: [
          /* @__PURE__ */ c("div", { className: "ui-search-input-wrap", children: [
            /* @__PURE__ */ t(
              "input",
              {
                type: "text",
                placeholder: e("search_props") || "搜索属性",
                value: o,
                onChange: (k) => h(k.target.value),
                className: "ui-input ui-input-compact"
              }
            ),
            o && /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "ui-search-clear",
                onClick: I,
                title: e("search_clear") || "清空",
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-properties-subbar", children: /* @__PURE__ */ c("div", { className: "ui-properties-meta", children: [
            b ? e("search_results") || "搜索结果" : e("prop_groups") || "属性组",
            ": ",
            g,
            /* @__PURE__ */ t("span", { children: " · " }),
            e("prop_items") || "属性项",
            ": ",
            w
          ] }) })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-properties-scroll", children: m ? m.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-properties-empty", children: e("search_no_results") || "暂无结果" }) : m.map((k) => {
          const U = i.has(k.name);
          return /* @__PURE__ */ c(
            "div",
            {
              className: "ui-prop-group-block",
              style: {
                margin: U ? "4px 0" : "0"
              },
              children: [
                /* @__PURE__ */ c(
                  "div",
                  {
                    className: `ui-prop-group${U ? " collapsed" : ""}`,
                    onClick: () => R(k.name),
                    onContextMenu: (O) => L(O, k),
                    children: [
                      /* @__PURE__ */ t("span", { className: "truncate", children: k.name }),
                      /* @__PURE__ */ c("div", { className: "ui-prop-group-actions", children: [
                        /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: k.items.length }),
                        /* @__PURE__ */ t("span", { className: "ui-prop-group-chevron", children: U ? /* @__PURE__ */ t(bn, { width: 14, height: 14 }) : /* @__PURE__ */ t(vn, { width: 14, height: 14 }) })
                      ] })
                    ]
                  }
                ),
                !U && k.items.map((O) => /* @__PURE__ */ c(
                  "div",
                  {
                    className: "ui-prop-row",
                    onContextMenu: (de) => M(de, k, O),
                    children: [
                      /* @__PURE__ */ t(
                        "div",
                        {
                          className: "ui-prop-key",
                          title: `${O.path} (${e("click_to_copy") || "点击复制"})`,
                          onDoubleClick: () => f(O.key),
                          children: O.key
                        }
                      ),
                      /* @__PURE__ */ t(
                        "div",
                        {
                          className: "ui-prop-value",
                          title: `${O.value}
${O.path}`,
                          onDoubleClick: () => f(O.value),
                          children: O.value
                        }
                      )
                    ]
                  },
                  O.id
                ))
              ]
            },
            k.name
          );
        }) : /* @__PURE__ */ t("div", { className: "ui-properties-empty", children: e("no_selection") || "未选择对象" }) }),
        l && /* @__PURE__ */ t(
          wn,
          {
            x: l.x,
            y: l.y,
            items: l.items,
            onClose: B
          }
        ),
        u && /* @__PURE__ */ t("div", { className: "ui-copy-toast", children: e("copied") || "已复制" })
      ]
    }
  );
}, io = ({
  isOpen: e,
  title: n,
  message: r,
  onConfirm: i,
  onCancel: a,
  t: o,
  theme: h
}) => e ? /* @__PURE__ */ t(
  et,
  {
    title: n,
    onClose: a,
    closeLabel: o("panel_close") || "关闭",
    width: 360,
    height: 188,
    modal: !0,
    movable: !1,
    theme: h,
    children: /* @__PURE__ */ c("div", { className: "ui-modal-body ui-modal-body-confirm", children: [
      /* @__PURE__ */ t("div", { className: "ui-modal-message", children: r }),
      /* @__PURE__ */ c("div", { className: "ui-modal-actions", children: [
        /* @__PURE__ */ t(
          Ee,
          {
            variant: "default",
            className: "ui-modal-action-btn",
            onClick: a,
            children: o("btn_cancel")
          }
        ),
        /* @__PURE__ */ t(
          Ee,
          {
            variant: "danger",
            className: "ui-modal-action-btn",
            onClick: i,
            children: o("btn_confirm")
          }
        )
      ] })
    ] })
  }
) : null, oo = ({ isOpen: e, onClose: n, t: r, theme: i }) => {
  if (!e) return null;
  const [a, o] = V(!1);
  return e ? /* @__PURE__ */ t(
    et,
    {
      title: r("about_title"),
      onClose: n,
      closeLabel: r("panel_close") || "关闭",
      width: 400,
      height: a ? 500 : 350,
      modal: !0,
      movable: !1,
      theme: i,
      children: /* @__PURE__ */ c("div", { className: "ui-modal-body ui-modal-body-scroll ui-about-modal", children: [
        /* @__PURE__ */ c("div", { className: "ui-about-hero", children: [
          /* @__PURE__ */ t("div", { className: "ui-about-app-name", children: "3D Browser" }),
          /* @__PURE__ */ t("div", { className: "ui-about-tagline", children: r("about_tagline") })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-about-meta-card", children: [
          /* @__PURE__ */ c("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("about_version") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value", children: "1.6.0" })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("about_author") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value", children: "zhangly1403@163.com" })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("project_url") }),
            /* @__PURE__ */ t(
              "a",
              {
                href: "https://github.com/zly258/3dbrowser",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "ui-link",
                children: "github.com/zly258/3dbrowser"
              }
            )
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("about_license") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value ui-about-license-badge", children: r("about_license_nc") })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-about-license-card", children: [
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "ui-about-license-toggle",
              onClick: () => o((h) => !h),
              children: [
                /* @__PURE__ */ t("span", { className: "ui-about-license-title", children: r("license_details") }),
                a ? /* @__PURE__ */ t(Ua, { width: 14, height: 14 }) : /* @__PURE__ */ t(vn, { width: 14, height: 14 })
              ]
            }
          ),
          a && /* @__PURE__ */ c("div", { className: "ui-about-license-content", children: [
            /* @__PURE__ */ t("div", { className: "ui-about-license-summary", children: r("license_summary") }),
            /* @__PURE__ */ c("div", { className: "ui-about-license-link", children: [
              r("full_license"),
              " ",
              /* @__PURE__ */ t(
                "a",
                {
                  href: "https://creativecommons.org/licenses/by-nc/4.0/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "ui-link",
                  children: "CC BY-NC 4.0"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-about-footer", children: r("about_copyright") })
      ] })
    }
  ) : null;
}, so = ({ sceneMgr: e, lang: n = "zh", theme: r }) => {
  const i = ue(null), a = ue(null), o = ue(null), h = ue(null), u = ue(null), p = ue(null), l = ue([]), d = ue(new E.Raycaster()), _ = ue(new E.Vector2()), b = ue(null), m = e?.settings?.viewCubeSize || 132, w = (C) => Lt(n, C);
  ce(() => {
    if (!a.current || !i.current) return;
    const C = m, I = m, B = a.current, S = B.getContext("webgl2", {
      antialias: !0,
      alpha: !0,
      preserveDrawingBuffer: !1
    });
    S && (S.pixelStorei(S.UNPACK_FLIP_Y_WEBGL, !1), S.pixelStorei(S.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1));
    const L = new E.WebGLRenderer({
      canvas: B,
      context: S || void 0,
      antialias: !0,
      alpha: !0,
      precision: "mediump"
    });
    L.setSize(C, I, !1), L.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), L.setClearColor(0, 0), L.outputColorSpace = E.SRGBColorSpace, o.current = L;
    const M = new E.Scene();
    h.current = M;
    const k = new E.PerspectiveCamera(38, 1, 0.1, 100);
    k.position.set(0, 0, 3.8), k.lookAt(0, 0, 0), u.current = k;
    const U = new E.AmbientLight(16777215, 1.9);
    M.add(U);
    const O = new E.DirectionalLight(16777215, 0.35);
    O.position.set(3, 4, 5), M.add(O);
    const de = new E.Group();
    M.add(de), p.current = de, l.current = [];
    const T = ((W, Y) => getComputedStyle(document.documentElement).getPropertyValue(W).trim() || Y)("--accent", "#0C62A2"), X = new E.Color("#F3F6FA"), Z = new E.Color("#E6ECF3"), ie = new E.Color("#C9D3DF"), fe = new E.Color("#D5DEE9"), z = new E.Color("#8F9DAE");
    new E.Color(T);
    const F = (W, Y, pe, re, te, Ce) => {
      const ke = Math.min(Ce, re / 2, te / 2);
      W.beginPath(), W.moveTo(Y + ke, pe), W.lineTo(Y + re - ke, pe), W.quadraticCurveTo(Y + re, pe, Y + re, pe + ke), W.lineTo(Y + re, pe + te - ke), W.quadraticCurveTo(Y + re, pe + te, Y + re - ke, pe + te), W.lineTo(Y + ke, pe + te), W.quadraticCurveTo(Y, pe + te, Y, pe + te - ke), W.lineTo(Y, pe + ke), W.quadraticCurveTo(Y, pe, Y + ke, pe), W.closePath();
    }, P = (W, Y = 0) => {
      const pe = document.createElement("canvas"), re = 256;
      pe.width = re, pe.height = re;
      const te = pe.getContext("2d");
      te && (te.clearRect(0, 0, re, re), te.fillStyle = "#F3F6FA", te.fillRect(0, 0, re, re), te.fillStyle = "#EAF0F6", F(te, 24, 24, 208, 208, 12), te.fill(), te.strokeStyle = "rgba(143,157,174,0.75)", te.lineWidth = 3, F(te, 28, 28, 200, 200, 10), te.stroke(), te.save(), te.translate(re / 2, re / 2), Y !== 0 && te.rotate(Y * Math.PI / 180), te.fillStyle = "#1F2933", te.font = n === "zh" ? '700 82px "Microsoft YaHei", "PingFang SC", sans-serif' : '700 48px "Segoe UI", Arial, sans-serif', te.textAlign = "center", te.textBaseline = "middle", te.fillText(W, 0, 2), te.restore());
      const Ce = new E.CanvasTexture(pe);
      return Ce.colorSpace = E.SRGBColorSpace, Ce.anisotropy = 4, Ce.needsUpdate = !0, Ce;
    }, $ = (W) => {
      const Y = new E.EdgesGeometry(W.geometry, 24), pe = new E.LineBasicMaterial({
        color: z,
        transparent: !0,
        opacity: 0.72
      }), re = new E.LineSegments(Y, pe);
      re.userData.isViewCubeFrame = !0, W.add(re);
    }, H = (W, Y, pe, re, te, Ce = 0) => {
      const ke = new E.BoxGeometry(W.x, W.y, W.z), Ge = new E.MeshLambertMaterial({
        color: te ? new E.Color("#FFFFFF") : re,
        map: te ? P(te, Ce) : void 0,
        transparent: !0,
        opacity: te ? 0.98 : 0.96
      }), G = new E.Mesh(ke, Ge);
      return G.position.copy(Y), G.name = pe, G.userData.originalOpacity = Ge.opacity, G.userData.originalColor = Ge.color.clone(), G.userData.isFace = !!te, G.userData.clickable = !0, $(G), de.add(G), l.current.push(G), G;
    }, q = 0.84, he = 0.12, Q = 0.14, A = 0.055, v = 0.5;
    H(new E.Vector3(q, A, q), new E.Vector3(0, -v, 0), "front", X, w("cube_front")), H(new E.Vector3(q, A, q), new E.Vector3(0, v, 0), "back", X, w("cube_back"), 180), H(new E.Vector3(q, q, A), new E.Vector3(0, 0, v), "top", X, w("cube_top"), 360), H(new E.Vector3(q, q, A), new E.Vector3(0, 0, -v), "bottom", Z, w("cube_bottom")), H(new E.Vector3(A, q, q), new E.Vector3(-v, 0, 0), "left", Z, w("cube_left"), 90), H(new E.Vector3(A, q, q), new E.Vector3(v, 0, 0), "right", Z, w("cube_right"), 270), H(new E.Vector3(q, he, he), new E.Vector3(0, -v, v), "top-front", ie), H(new E.Vector3(q, he, he), new E.Vector3(0, v, v), "top-back", ie), H(new E.Vector3(he, q, he), new E.Vector3(-v, 0, v), "top-left", ie), H(new E.Vector3(he, q, he), new E.Vector3(v, 0, v), "top-right", ie), H(new E.Vector3(q, he, he), new E.Vector3(0, -v, -v), "bottom-front", ie), H(new E.Vector3(q, he, he), new E.Vector3(0, v, -v), "bottom-back", ie), H(new E.Vector3(he, q, he), new E.Vector3(-v, 0, -v), "bottom-left", ie), H(new E.Vector3(he, q, he), new E.Vector3(v, 0, -v), "bottom-right", ie), H(new E.Vector3(he, he, q), new E.Vector3(-v, -v, 0), "front-left", ie), H(new E.Vector3(he, he, q), new E.Vector3(v, -v, 0), "front-right", ie), H(new E.Vector3(he, he, q), new E.Vector3(-v, v, 0), "back-left", ie), H(new E.Vector3(he, he, q), new E.Vector3(v, v, 0), "back-right", ie), H(new E.Vector3(Q, Q, Q), new E.Vector3(-v, -v, v), "top-front-left", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(v, -v, v), "top-front-right", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(-v, v, v), "top-back-left", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(v, v, v), "top-back-right", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(-v, -v, -v), "bottom-front-left", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(v, -v, -v), "bottom-front-right", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(-v, v, -v), "bottom-back-left", fe), H(new E.Vector3(Q, Q, Q), new E.Vector3(v, v, -v), "bottom-back-right", fe), de.rotation.set(0, 0, 0);
    let ne = 0;
    const se = () => {
      ne = requestAnimationFrame(se), e && p.current && p.current.quaternion.copy(e.camera.quaternion).invert(), L.render(M, k);
    };
    return se(), () => {
      cancelAnimationFrame(ne), l.current = [], L.dispose(), M.traverse((W) => {
        if (W instanceof E.Mesh) {
          W.geometry.dispose();
          const Y = W.material;
          Array.isArray(Y) ? Y.forEach((pe) => {
            "map" in pe && pe.map && pe.map.dispose(), pe.dispose();
          }) : (Y.map && Y.map.dispose(), Y.dispose());
        }
        if (W instanceof E.LineSegments) {
          W.geometry.dispose();
          const Y = W.material;
          Array.isArray(Y) ? Y.forEach((pe) => pe.dispose()) : Y.dispose();
        }
      });
    };
  }, [e, m, n]);
  const g = (C) => {
    if (!C) return;
    const I = C.material;
    I.opacity = C.userData.originalOpacity, I.color.copy(C.userData.originalColor), C.scale.set(1, 1, 1);
  }, s = (C) => {
    const I = C.material;
    C.userData.isFace ? (I.color.set(16777215), I.opacity = 1) : (I.color.set(12179711), I.opacity = 1), C.scale.set(1.02, 1.02, 1.02);
  }, f = (C) => {
    if (!a.current || !u.current) return null;
    const I = a.current.getBoundingClientRect();
    _.current.x = (C.clientX - I.left) / I.width * 2 - 1, _.current.y = -((C.clientY - I.top) / I.height) * 2 + 1, d.current.setFromCamera(_.current, u.current);
    const B = d.current.intersectObjects(l.current, !1);
    return B.length === 0 ? null : B[0].object;
  }, N = (C) => {
    if (!i.current) return;
    const I = f(C);
    I ? (b.current !== I && (g(b.current), b.current = I, s(I)), i.current.style.cursor = "pointer") : (g(b.current), b.current = null, i.current.style.cursor = "default");
  }, y = () => {
    g(b.current), b.current = null, i.current && (i.current.style.cursor = "default");
  }, R = (C) => {
    if (!e) return;
    const I = f(C);
    I && ee(I.name);
  }, ee = (C) => {
    if (!e) return;
    const I = {
      top: "top",
      bottom: "bottom",
      front: "front",
      back: "back",
      left: "left",
      right: "right",
      "top-front-right": "se",
      "top-front-left": "sw",
      "top-back-right": "ne",
      "top-back-left": "nw",
      "front-right": "right",
      "front-left": "left",
      "back-right": "right",
      "back-left": "left",
      "top-front": "front",
      "top-back": "back",
      "top-left": "left",
      "top-right": "right",
      "bottom-front": "front",
      "bottom-back": "back",
      "bottom-left": "left",
      "bottom-right": "right"
    };
    e.setView(I[C] || C);
  };
  return /* @__PURE__ */ t(
    "div",
    {
      ref: i,
      className: "ui-viewcube ui-viewcube-clean",
      style: {
        width: `${m}px`,
        height: `${m}px`
      },
      onClick: R,
      onMouseMove: N,
      onMouseLeave: y,
      children: /* @__PURE__ */ t("canvas", { ref: a, className: "ui-viewcube-canvas" })
    }
  );
};
class lo extends Ia {
  constructor() {
    super(...arguments), this.state = {
      hasError: !1,
      error: null
    }, this.handleReload = () => {
      window.location.reload();
    }, this.handleReset = () => {
      this.setState({
        hasError: !1,
        error: null
      });
    };
  }
  static getDerivedStateFromError(n) {
    return {
      hasError: !0,
      error: n
    };
  }
  componentDidCatch(n, r) {
    console.error("ErrorBoundary captured error:", n, r);
  }
  render() {
    const { children: n, t: r, theme: i } = this.props;
    return this.state.hasError ? /* @__PURE__ */ c("div", { className: "ui-error-boundary", children: [
      /* @__PURE__ */ t("div", { className: "ui-error-icon", children: "⚠" }),
      /* @__PURE__ */ t("h1", { className: "ui-error-title", children: r("error_title") || "程序发生错误" }),
      /* @__PURE__ */ t("p", { className: "ui-error-message", children: r("error_msg") || "界面渲染过程中发生异常，可以尝试恢复界面或重新加载。" }),
      this.state.error?.message && /* @__PURE__ */ c("div", { className: "ui-toolpanel-overlay-card", children: [
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay-title", children: r("error_detail") || "错误详情" }),
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption", children: this.state.error.message })
      ] }),
      /* @__PURE__ */ c("div", { className: "ui-error-actions", children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "ui-btn ui-btn-default ui-modal-action-btn",
            onClick: this.handleReset,
            children: r("btn_cancel") || "尝试恢复"
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "ui-btn ui-btn-primary ui-modal-action-btn",
            onClick: this.handleReload,
            children: r("error_reload") || "重新加载"
          }
        )
      ] })
    ] }) : n;
  }
}
function st(e, n, r = {}) {
  const {
    storage: i = typeof window < "u" ? window.localStorage : void 0,
    serializer: a = JSON.stringify,
    parser: o = JSON.parse
  } = r, h = () => typeof n == "function" ? n() : n, [u, p] = V(() => {
    const l = h();
    if (!i) return l;
    try {
      const d = i.getItem(e);
      return d === null ? l : o(d);
    } catch (d) {
      return console.warn(`[usePersistentState] Failed to read "${e}"`, d), l;
    }
  });
  return ce(() => {
    if (i)
      try {
        i.setItem(e, a(u));
      } catch (l) {
        console.warn(`[usePersistentState] Failed to write "${e}"`, l);
      }
  }, [e, a, u, i]), [u, p];
}
function co({
  fileSetIdRef: e,
  completedFileSetsRef: n,
  onProgress: r,
  onCompleted: i
}) {
  const a = ue(null), o = ue(null), h = j(() => {
    a.current = null;
    const p = o.current;
    if (!p) return;
    o.current = null;
    const { loaded: l, total: d } = p;
    r((b) => b.loaded === l && b.total === d ? b : { loaded: l, total: d });
    const _ = e.current;
    l === d && d > 0 && _ && (n.current.has(_) || (n.current.add(_), i()));
  }, [n, e, i, r]), u = j((p, l) => {
    o.current = { loaded: p, total: l }, a.current === null && (a.current = requestAnimationFrame(h));
  }, [h]);
  return ce(() => () => {
    a.current !== null && (cancelAnimationFrame(a.current), a.current = null), o.current = null;
  }, []), { onManagerChunkProgress: u };
}
function gn(e) {
  return e.replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "").toLowerCase();
}
function Rn(e) {
  const n = gn(e), r = n.split("/"), i = r[r.length - 1];
  return Array.from(/* @__PURE__ */ new Set([
    n,
    i,
    `./${n}`,
    `./${i}`
  ]));
}
function uo(e) {
  const n = e.filter((a) => a instanceof File);
  if (n.length === 0) return null;
  const r = /* @__PURE__ */ new Map(), i = (a, o) => {
    !a || r.has(a) || r.set(a, URL.createObjectURL(o));
  };
  return n.forEach((a) => {
    i(gn(a.name), a);
    const o = a.webkitRelativePath;
    if (o) {
      const h = o.split("/").slice(1).join("/");
      i(gn(h), a);
    }
  }), {
    resolve: (a) => {
      if (!a || /^(blob:|data:|https?:)/i.test(a)) return a;
      for (const o of Rn(a)) {
        const h = r.get(o);
        if (h) return h;
      }
      return a;
    },
    has: (a) => Rn(a).some((o) => r.has(o)),
    dispose: () => {
      r.forEach((a) => URL.revokeObjectURL(a)), r.clear();
    }
  };
}
const ho = {
  fetch: "reading",
  parse: "analyzing",
  normalize: "processing",
  optimize: "processing",
  addToScene: "processing"
}, po = {
  fetch: [0, 20],
  parse: [20, 58],
  normalize: [58, 72],
  optimize: [72, 92],
  addToScene: [92, 100]
}, dn = /* @__PURE__ */ new Map();
let hn = null;
async function mo() {
  return hn || (hn = Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/DRACOLoader.js"),
    import("three/examples/jsm/loaders/KTX2Loader.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js")
  ]).then(([e, n, r, i]) => ({
    GLTFLoader: e.GLTFLoader,
    DRACOLoader: n.DRACOLoader,
    KTX2Loader: r.KTX2Loader,
    MeshoptDecoder: i.MeshoptDecoder
  }))), hn;
}
function tr(e) {
  if (!dn.has(e)) {
    const n = e.replace(/\/$/, ""), r = typeof window < "u" ? new URL(n ? `${n}/` : "./", window.location.href).toString().replace(/\/$/, "") : n;
    dn.set(e, r);
  }
  return dn.get(e);
}
function fo(e, n, r) {
  const i = uo(e), a = new E.LoadingManager();
  return i && a.setURLModifier((h) => i.resolve(h)), { manager: a, cleanup: () => {
    i?.dispose();
  }, resourceResolver: i };
}
async function _o(e, n) {
  const { GLTFLoader: r, DRACOLoader: i, KTX2Loader: a, MeshoptDecoder: o } = await mo(), h = tr(n), u = typeof window < "u" && !!window.createImageBitmap;
  let p = null;
  const l = new i(e);
  l.setDecoderPath(`${h}/draco/gltf/`);
  const d = new a(e);
  if (d.setTranscoderPath(`${h}/basis/`), typeof document < "u")
    try {
      p = new E.WebGLRenderer({ canvas: document.createElement("canvas") }), d.detectSupport(p);
    } catch (b) {
      console.warn("[LoaderUtils] KTX2 detectSupport failed", b);
    }
  const _ = new r(e);
  return _.setDRACOLoader(l), _.setMeshoptDecoder(o), u && _.setKTX2Loader(d), {
    loader: _,
    cleanup: () => {
      l.dispose(), d.dispose(), p?.dispose();
    }
  };
}
function go(e, n, r, i, a) {
  return (o, h, u) => {
    const [p, l] = po[o], d = Math.min(100, Math.max(0, Number.isFinite(h) ? h : 0)), _ = p + d / 100 * (l - p), b = i + _ / 100 * a, m = u || `${n(ho[o])} ${r}`;
    e(Math.round(b), m);
  };
}
async function yo(e, n, r, i, a, o, h, u, p) {
  const l = fo(i), { manager: d, cleanup: _, resourceResolver: b } = l;
  try {
    if (r === "lmb") {
      const { LMBLoader: m } = await import("./lmbLoader-Czkg4cBd.js"), w = new m();
      return a("parse", 0), await w.loadAsync(
        n,
        (g) => a("parse", g * 100),
        { fastMode: (p.loadProfile ?? "balanced") === "max-speed" }
      );
    }
    if (r === "glb" || r === "gltf") {
      const { loader: m, cleanup: w } = await _o(d, u);
      a("parse", 0);
      try {
        return (await new Promise((s, f) => {
          m.load(
            n,
            s,
            (N) => {
              N.total && N.total > 0 ? a("parse", N.loaded / N.total * 100) : a("parse", 50);
            },
            f
          );
        })).scene;
      } finally {
        w();
      }
    }
    if (r === "fbx") {
      const { FBXLoader: m } = await import("three/examples/jsm/loaders/FBXLoader.js"), w = new m(d);
      return a("parse", 0), await new Promise((g, s) => {
        w.load(
          n,
          g,
          (f) => {
            f.total && f.total > 0 ? a("parse", f.loaded / f.total * 100) : a("parse", 50);
          },
          s
        );
      });
    }
    if (r === "ifc") {
      const { loadIFC: m } = await import("./ifcLoader-B3eLgw4i.js");
      a("parse", 0);
      const w = {
        ...h,
        deferIfcProperties: p.deferIfcProperties ?? !0
      };
      return await m(
        typeof e == "string" ? n : e,
        (g, s) => a("parse", g, s),
        o,
        u,
        w
      );
    }
    if (r === "obj") {
      const [{ OBJLoader: m }, { MTLLoader: w }] = await Promise.all([
        import("three/examples/jsm/loaders/OBJLoader.js"),
        import("three/examples/jsm/loaders/MTLLoader.js")
      ]), g = new m(d), s = n.replace(/\.[^.]+$/i, ".mtl");
      if (b?.has(s))
        try {
          const f = await new Promise((N, y) => {
            new w(d).load(s, N, void 0, y);
          });
          f.preload(), g.setMaterials(f);
        } catch (f) {
          console.warn("[LoaderUtils] Failed to load companion MTL", f);
        }
      return a("parse", 0), await g.loadAsync(n, (f) => {
        f.total && f.total > 0 ? a("parse", f.loaded / f.total * 100) : a("parse", 50);
      });
    }
    if (r === "stl") {
      const { STLLoader: m } = await import("three/examples/jsm/loaders/STLLoader.js"), w = new m(d);
      a("parse", 0);
      const g = await w.loadAsync(n, (s) => {
        s.total && s.total > 0 && a("parse", s.loaded / s.total * 100);
      });
      return new E.Mesh(g, new E.MeshStandardMaterial({ color: 8947848 }));
    }
    if (r === "ply") {
      const { PLYLoader: m } = await import("three/examples/jsm/loaders/PLYLoader.js"), w = new m(d);
      a("parse", 0);
      const g = await w.loadAsync(n, (s) => {
        s.total && s.total > 0 && a("parse", s.loaded / s.total * 100);
      });
      return new E.Mesh(g, new E.MeshStandardMaterial({
        color: 8947848,
        vertexColors: g.hasAttribute("color")
      }));
    }
    if (r === "3mf") {
      const { ThreeMFLoader: m } = await import("three/examples/jsm/loaders/3MFLoader.js"), w = new m(d);
      return a("parse", 0), await w.loadAsync(n, (g) => {
        g.total && g.total > 0 && a("parse", g.loaded / g.total * 100);
      });
    }
    if (r === "stp" || r === "step" || r === "igs" || r === "iges") {
      a("fetch", 0);
      const m = typeof e == "string" ? await fetch(n).then((N) => N.arrayBuffer()) : await e.arrayBuffer(), g = `${tr(u)}/occt-import-js/occt-import-js.wasm`, { OCCTLoader: s } = await import("./occtLoader-DKvqVEFi.js"), f = new s(g);
      return a("parse", 0), await f.load(m, o, (N, y) => a("parse", N, y));
    }
    return null;
  } finally {
    _();
  }
}
function Un(e, n, r = "full") {
  let a = 0;
  e.traverse((o) => {
    if (o.isMesh) {
      if (r === "fast" && a >= 3200) return;
      const h = o;
      h.frustumCulled = n.frustumCulling ?? !0, a += 1, h.geometry.boundingBox || h.geometry.computeBoundingBox(), h.geometry.boundingSphere || h.geometry.computeBoundingSphere(), (Array.isArray(h.material) ? h.material : [h.material]).forEach((p) => {
        p && ("wireframe" in p && (p.wireframe = !1), Da(p));
      });
    }
  });
}
const bo = async (e, n, r, i, a = "./libs", o = {}) => {
  const h = [], u = e.length;
  for (let p = 0; p < u && !o.isStale?.(); p++) {
    const l = e[p], d = typeof l == "string";
    let _ = "", b = "", m = "";
    d ? (m = l, _ = m.split("?")[0].split("#")[0].split("/").pop() || "model", b = _.split(".").pop()?.toLowerCase() || "") : (_ = l.name, b = _.split(".").pop()?.toLowerCase() || "", m = URL.createObjectURL(l));
    const w = p / u * 100, g = 100 / u, s = go(n, r, _, w, g);
    try {
      s("fetch", 5);
      const f = await yo(l, m, b, e, s, r, i, a, o);
      if (!f) continue;
      f.name = _, s("normalize", 30, `${r("processing")} ${_}`);
      const N = o.fastGeometrySanitize ?? !0;
      Un(f, i, N ? "fast" : "full"), N && setTimeout(() => {
        o.isStale?.() || Un(f, i, "full");
      }, 0), s("optimize", 100, `${r("analyzing")} ${_}`), s("addToScene", 100, `${r("success")} ${_}`), h.push(f);
    } catch (f) {
      console.error(`加载 ${_} 失败`, f);
    } finally {
      d || URL.revokeObjectURL(m);
    }
  }
  return n(100, r("analyzing")), h;
};
function nr(e) {
  return e ? e.replace(/:\s*\d+%/g, "").replace(/\(\d+%\)/g, "").replace(/\d+%/g, "").trim() : "";
}
function vo(e) {
  return e.map((r) => typeof r == "string" ? r : r.name).sort().join("|");
}
async function wo({
  items: e,
  manager: n,
  sceneSettings: r,
  libPath: i,
  t: a,
  onProgress: o,
  runtimeHints: h = {},
  isStale: u
}) {
  if (!e.length) return;
  const p = [], l = [];
  for (const b of e)
    (typeof b == "string" ? b.split("?")[0].split("#")[0] : b.name).toLowerCase().endsWith(".nbim") ? p.push(b) : l.push(b);
  for (const b of p) {
    if (u?.()) return;
    if (typeof b == "string") {
      const m = await fetch(b);
      if (!m.ok) throw new Error(`HTTP ${m.status} when fetching NBIM`);
      const w = await m.blob(), g = b.split("?")[0].split("#")[0].split("/").pop() || "model.nbim", s = new File([w], g);
      await n.loadNbim(s, (f, N) => {
        o(f, N);
      });
    } else
      await n.loadNbim(b, (m, w) => {
        o(m, w);
      });
  }
  if (l.length === 0) return;
  const d = await bo(
    l,
    o,
    a,
    r,
    i,
    {
      ...h,
      isStale: u
    }
  ), _ = Math.max(d.length, 1);
  for (let b = 0; b < d.length; b++) {
    if (u?.()) return;
    const m = d[b], w = 92 + Math.round(b / _ * 8);
    try {
      let g = 0;
      if (m.traverse((s) => {
        s?.isMesh && s.geometry && g++;
      }), g <= 0)
        throw new Error(`${m.name || "Model"} has no renderable mesh`);
      await n.addModel(m, (s, f) => {
        const N = Math.min(100, w + Math.round(s / 100 * (8 / _)));
        o(N, f);
      });
    } catch (g) {
      try {
        await n.removeModel(m.uuid);
      } catch {
      }
      throw g;
    }
    n.invalidateRender?.({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }
}
function xo({
  managerRef: e,
  sceneSettings: n,
  libPath: r,
  t: i,
  setCurrentFileSetId: a,
  setLoading: o,
  setStatus: h,
  setProgress: u,
  setToast: p,
  updateTree: l
}) {
  const d = j(async (b) => {
    if (!b.length || !e.current) return;
    const m = e.current, w = m.beginLoadGeneration?.() ?? 0, g = m.getChunkOptions?.() || {};
    await wo({
      items: b,
      manager: m,
      sceneSettings: n,
      libPath: r,
      t: i,
      onProgress: (s, f) => {
        u(s), f && h(nr(f)), m.invalidateRender?.();
      },
      runtimeHints: g,
      isStale: () => !e.current?.isLoadGenerationCurrent?.(w)
    }), m.invalidateRender?.({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }, [r, e, n, u, h, i]);
  return {
    processFiles: j(async (b) => {
      if (!b.length || !e.current) return;
      const m = vo(b);
      a(m), e.current.setChunkLoadingEnabled?.(!0), e.current.setContentVisible?.(!0), o(!0), h(i("loading")), u(0);
      try {
        if (await d(b), l(), e.current?.invalidateRender?.({
          invalidateInteractables: !0,
          needsBoundsUpdate: !0,
          needsCulling: !0
        }), b.some((g) => (typeof g == "string" ? g : g.name).toLowerCase().endsWith(".nbim"))) {
          const g = e.current.getStats?.();
          if (g && g.meshes <= 0)
            throw new Error("NBIM 加载完成但没有可渲染外形，请检查文件格式或分块数据");
        } else
          e.current?.fitView(!1);
        e.current?.invalidateRender?.({
          invalidateInteractables: !0,
          needsBoundsUpdate: !0,
          needsCulling: !0
        }), h(i("success"));
      } catch (w) {
        h(i("failed")), p({ message: `${i("failed")}: ${w.message}`, type: "error" });
      } finally {
        o(!1), e.current?.invalidateRender?.();
      }
    }, [d, e, a, o, u, h, p, i, l]),
    loadItemsIntoScene: d
  };
}
function Co({ mgrInstance: e, showStats: n, setStats: r }) {
  ce(() => {
    if (!e || !n) return;
    const i = () => {
      document.visibilityState === "visible" && r(e.getStats());
    };
    i();
    const a = window.setInterval(i, 1e3);
    return document.addEventListener("visibilitychange", i), () => {
      window.clearInterval(a), document.removeEventListener("visibilitychange", i);
    };
  }, [e, r, n]);
}
function No(e, n) {
  return e.includes(n) ? e.filter((r) => r !== n) : [...e, n];
}
function So(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function ko() {
  const [e, n] = V([]), r = Ie(
    () => So(e),
    [e]
  ), i = j(() => {
    n([]);
  }, []), a = j((h) => {
    n([h]);
  }, []), o = j((h) => {
    n((u) => No(u, h));
  }, []);
  return {
    selectedUuids: e,
    selectedUuid: r,
    setSelectedUuids: n,
    clearSelection: i,
    setSingleSelection: a,
    toggleSelection: o
  };
}
function Mo({
  basicLabel: e,
  geoLabel: n,
  basicProps: r,
  geoProps: i,
  ifcProps: a,
  nbimProps: o,
  nbimLabel: h = "BIM 属性"
}) {
  const u = [
    {
      name: e,
      items: wt(e, r, "basic")
    },
    {
      name: n,
      items: wt(n, i, "geometry")
    }
  ];
  return a && u.push(...Zi(a, "ifc")), u;
}
function Lo(e, n, r) {
  let i = r === (n?.uuid || n?.id) && n instanceof E.Object3D ? n : e.contentGroup.getObjectByProperty("uuid", r);
  if (!i) {
    const a = e.getStructureNodes(r);
    a && a.length > 0 && (i = a[0]);
  }
  return i || n;
}
function Eo(e) {
  if (typeof e?.userData?.ifcMetadata?.elevation == "number")
    return e.userData.ifcMetadata.elevation;
  if (!(e instanceof E.Object3D)) return;
  let n = e;
  for (; n; ) {
    const r = n.userData?.ifcMetadata?.elevation;
    if (typeof r == "number" && Number.isFinite(r))
      return r;
    n = n.parent;
  }
}
async function Io(e, n) {
  const i = ((a) => {
    let o = a instanceof E.Object3D ? a : null, h = a?.userData?.expressID;
    for (; o; ) {
      if (o.userData?.expressID !== void 0 && h === void 0 && (h = o.userData.expressID), o.userData?.ifcManager && o.userData?.modelID !== void 0)
        return {
          ifcRoot: o,
          expressID: h
        };
      o = o.parent;
    }
    return null;
  })(e);
  if (!i?.ifcRoot || i.expressID === void 0) return null;
  try {
    const a = `${i.ifcRoot.userData.modelID}:${i.expressID}`, o = n.get(a);
    if (o) return o;
    const u = await i.ifcRoot.userData.ifcManager.getItemProperties(i.ifcRoot.userData.modelID, i.expressID), p = u?.rawGroups || u?.groups || u?.normalizedGroups || null;
    return p && n.set(a, p), p;
  } catch (a) {
    return console.error("IFC Props Error", a), null;
  }
}
function Do(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = {};
  return e.forEach((r, i) => {
    const a = String(r.group || "NBIM").trim(), o = String(r.key || "").trim();
    !a || !o || (n[a] || (n[a] = []), n[a].push({
      key: o,
      value: r.value,
      rawKey: r.rawKey,
      source: r.source || "property-index",
      id: `property-index::${r.path || `${a}.${o}`}::${i}`
    }));
  }), Object.keys(n).length > 0 ? n : null;
}
function Ao({
  sceneManager: e,
  focusUuid: n,
  target: r,
  t: i,
  ifcGroups: a,
  clashSummary: o,
  isDev: h = !1
}) {
  const u = {}, p = {}, l = Eo(r), d = [r?.name, r?.userData?.name].find((f) => typeof f == "string" && f.trim().length > 0), _ = e.getBimIdByUuid(n) || n;
  if (d && (u[i("prop_name")] = d), u[i("prop_id")] = _, u[i("prop_type")] = r.type || (r.children ? "Group" : "Mesh"), typeof l == "number" && Number.isFinite(l) && (u[i("prop_storey_elevation")] = String(l)), r.getWorldPosition) {
    const f = new E.Vector3();
    r.getWorldPosition(f), p[i("prop_pos")] = `${f.x.toFixed(2)}, ${f.y.toFixed(2)}, ${f.z.toFixed(2)}`;
  }
  if (r.isMesh || r.type === "Mesh") {
    if (r instanceof E.Mesh) {
      const N = new E.Box3().setFromObject(r), y = new E.Vector3();
      N.getSize(y), p[i("prop_dim")] = `${y.x.toFixed(2)} x ${y.y.toFixed(2)} x ${y.z.toFixed(2)}`, r.geometry && (p[i("prop_vert")] = (r.geometry.attributes.position?.count || 0).toLocaleString(), p[i("prop_tri")] = r.geometry.index ? (r.geometry.index.count / 3).toLocaleString() : ((r.geometry.attributes.position?.count || 0) / 3).toLocaleString());
    } else if (r.userData?.boundingBox) {
      const N = new E.Vector3();
      r.userData.boundingBox.getSize(N), p[i("prop_dim")] = `${N.x.toFixed(2)} x ${N.y.toFixed(2)} x ${N.z.toFixed(2)}`;
    }
    r.isInstancedMesh && (p[i("prop_inst")] = r.count.toLocaleString());
    const f = e.getObjectGeometryData(n);
    f.area > 0 && (p[i("prop_area")] = f.area.toFixed(3)), f.volume > 0 && (p[i("prop_volume")] = f.volume.toFixed(3));
  } else if (r.userData?.boundingBox) {
    const f = new E.Vector3();
    r.userData.boundingBox.getSize(f), p[i("prop_dim")] = `${f.x.toFixed(2)} x ${f.y.toFixed(2)} x ${f.z.toFixed(2)}`;
  }
  const b = e.getNbimPropertySearchDocument(n), m = Do(b?.rows), w = e.getNbimProperties(n), g = e.getNbimIfcPropertyGroups(n, "raw");
  h && w && Object.keys(w).length > 0 && (console.group(`NBIM 选中属性: ${n}`), console.log(w), console.log(JSON.stringify(w, null, 2)), console.groupEnd()), h && g && (console.group(`NBIM IFC 组属性: ${n}`), console.log(g), console.log(JSON.stringify(g, null, 2)), console.groupEnd());
  const s = Mo({
    basicLabel: i("pg_basic"),
    geoLabel: i("pg_geo"),
    basicProps: u,
    geoProps: p,
    ifcProps: a || m || g || null,
    nbimProps: null
  });
  if (o) {
    const f = i("pg_clash");
    s.push({
      name: f,
      items: wt(f, [
        { key: i("clash_group_all"), value: String(o.total) },
        { key: i("clash_group_new"), value: String(o.newCount) },
        { key: i("clash_group_confirmed"), value: String(o.confirmedCount) },
        { key: i("clash_group_resolved"), value: String(o.resolvedCount) },
        { key: i("prop_status"), value: i(`clash_group_${o.worstStatus}`) }
      ].map((N, y) => ({ ...N, id: `clash-summary::${y}` })))
    });
  }
  return s;
}
function zo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  setSelectedProps: i,
  setHiddenUuids: a,
  setIsolatedUuids: o,
  updateTree: h,
  propOnSelect: u,
  ifcPropertyCacheRef: p,
  clashSummaryByUuid: l,
  focusObjectsInView: d,
  t: _,
  isDev: b = !1
}) {
  const [m, w] = V(null), [g, s] = V([]), f = j(() => {
    w(null), s([]);
  }, []), N = j(async (C, I, B = !1, S = !1) => {
    const L = e.current;
    if (!L) return;
    if (!C) {
      r([]), i(null), L.highlightObjects([]);
      return;
    }
    const M = C.uuid || C.id, k = L.resolveSelectionUuid(M);
    if (!k) return;
    const U = B ? n.includes(k) ? n.filter((X) => X !== k) : [...n, k] : [k];
    r(U), S || L.highlightObjects(U);
    const O = U[U.length - 1];
    if (!O) {
      i(null);
      return;
    }
    u?.(O, C);
    const de = Lo(L, C, O), K = await Io(de, p.current || /* @__PURE__ */ new Map()), T = Ao({
      sceneManager: L,
      focusUuid: O,
      target: de,
      t: _,
      ifcGroups: K,
      clashSummary: l[O],
      isDev: b
    });
    i(T);
  }, [
    l,
    p,
    b,
    u,
    e,
    n,
    i,
    r,
    _
  ]), y = j((C) => {
    const I = e.current;
    if (!I || !C) return !1;
    const B = C.uuid || C.id;
    if (!B) return !1;
    const S = I.resolveSelectionUuid(B);
    return !S || !I.getBoundsForObject(S) ? !1 : (w(S), d({ uuids: [S], focusUuid: S, updateSelection: !1 }));
  }, [d, e]), R = j((C) => {
    if (!!(g.length === C.length && g.every((S, L) => S === C[L]))) return;
    s(C);
    const B = e.current;
    !B || C.length > 0 || B.clearLocateFocus();
  }, [g, e]), ee = j(() => {
    f(), e.current?.clearLocateFocus(), e.current?.highlightObjects(n);
  }, [f, e, n]);
  return ce(() => {
    const C = e.current;
    if (!C || n.length <= 1) return;
    let I = !1;
    const B = async () => {
      const L = new E.Box3();
      let M = 0, k = 0;
      const U = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Map(), de = new Set(n), K = /* @__PURE__ */ new Map();
      C.contentGroup.traverse((F) => {
        const P = F.uuid, $ = F.userData?.id;
        (de.has(P) || $ && de.has($)) && (K.set(P, F), $ && K.set($, F), L.expandByObject(F));
      });
      const T = 2e3;
      let X = performance.now();
      for (let F = 0; F < n.length; F += T) {
        if (I) return;
        const P = n.slice(F, F + T);
        for (const $ of P) {
          const H = K.get($), q = C.getStructureNodes($), he = q && q.length > 0 ? q[0] : null, Q = String(H?.type || he?.type || "Object");
          O.set(Q, (O.get(Q) || 0) + 1);
          const A = H?.userData?.rootName || H?.userData?.modelName;
          A && U.add(String(A));
          const v = C.getObjectGeometryData($);
          M += v.area, k += v.volume;
        }
        performance.now() - X > 16 && (await new Promise(($) => setTimeout($, 0)), X = performance.now());
      }
      if (I) return;
      const Z = (F) => Array.from(F.entries()).sort((P, $) => $[1] - P[1]).slice(0, 4).map(([P, $]) => `${P} x${$}`).join(", "), ie = L.isEmpty() ? null : L.getSize(new E.Vector3()), fe = [
        { key: _("selected_count"), value: String(n.length) },
        { key: _("summary_models"), value: String(U.size || 1) },
        { key: _("summary_types"), value: Z(O) || "-" }
      ];
      ie && fe.push({
        key: _("summary_bounds"),
        value: `${ie.x.toFixed(2)} x ${ie.y.toFixed(2)} x ${ie.z.toFixed(2)}`
      }), M > 0 && fe.push({ key: _("prop_area"), value: M.toFixed(3) }), k > 0 && fe.push({ key: _("prop_volume"), value: k.toFixed(3) });
      const z = `${n.length} ${_("selected_count")}`;
      i([
        {
          name: z,
          items: wt(z, fe.map((F) => ({ key: F.key, value: F.value })))
        }
      ]);
    }, S = window.setTimeout(B, 200);
    return () => {
      I = !0, clearTimeout(S);
    };
  }, [n, e, _, i]), {
    locatedUuid: m,
    locateResultUuids: g,
    resetLocateState: f,
    handleSelect: N,
    handleLocateObject: y,
    handleLocateResultsChange: R,
    handleClearLocate: ee
  };
}
function Bo({
  sceneMgrRef: e,
  t: n,
  setLoading: r,
  setProgress: i,
  setStatus: a,
  setToast: o,
  setActiveTool: h,
  setConfirmState: u,
  setSelectedUuids: p,
  setSelectedProps: l,
  setChunkProgress: d,
  resetLocateState: _,
  clearSearchResult: b,
  resetClashState: m,
  resetMeasurementState: w,
  resetExplodeState: g,
  updateTree: s,
  ifcPropertyCacheRef: f,
  completedFileSetsRef: N
}) {
  const y = j(() => {
    const S = e.current;
    if (!S) return [];
    const L = [];
    return S.contentGroup.children.forEach((M) => {
      if (M.userData?.isOptimizedGroup || M.name.startsWith("optimized_")) return;
      const k = (typeof M.userData?.modelName == "string" ? M.userData.modelName : "") || M.children?.[0]?.name || "" || M.name, U = $n(en(k));
      L.push(U);
    }), Array.from(new Set(L));
  }, [e]), R = j((S) => {
    const L = y();
    if (L.length === 1)
      return L[0];
    const M = /* @__PURE__ */ new Date(), k = (O) => String(O).padStart(2, "0"), U = `${M.getFullYear()}${k(M.getMonth() + 1)}${k(M.getDate())}_${k(M.getHours())}${k(M.getMinutes())}${k(M.getSeconds())}`;
    return `${n("export_batch_name")}_${U}`;
  }, [y, n]), ee = j((S, L) => {
    const M = R(S);
    return `${$n(en((L || "").trim()) || M)}.${S}`;
  }, [R]), C = j(async (S, L) => {
    const M = e.current;
    if (!M) return;
    const k = M.contentGroup, U = ee(S, L), O = en(U);
    if (S === "nbim") {
      if (k.children.length === 0) {
        o({ message: n("no_models"), type: "info" });
        return;
      }
      r(!0), a(`${n("processing")}...`), h("none"), window.setTimeout(async () => {
        try {
          await e.current?.exportNbim(O), o({ message: n("success"), type: "success" });
        } catch (T) {
          console.error(T), o({ message: `${n("failed")}: ${T.message}`, type: "error" });
        } finally {
          r(!1);
        }
      }, 100);
      return;
    }
    const de = k.children.filter((T) => !T.userData.isOptimizedGroup);
    if (de.length === 0) {
      o({ message: n("no_models"), type: "info" });
      return;
    }
    const K = new E.Group();
    de.forEach((T) => K.add(T.clone())), r(!0), i(0), a(`${n("processing")}...`), h("none"), window.setTimeout(async () => {
      try {
        let T = null;
        if (S === "glb" ? T = await Aa(K) : S === "lmb" && (T = await za(K, (X) => a(nr(X)))), T) {
          const X = URL.createObjectURL(T), Z = document.createElement("a");
          Z.href = X, Z.download = U, Z.click(), URL.revokeObjectURL(X), o({ message: n("success"), type: "success" });
        }
      } catch (T) {
        console.error(T), o({ message: `${n("failed")}: ${T.message}`, type: "error" });
      } finally {
        r(!1), i(0);
      }
    }, 100);
  }, [ee, e, h, r, i, a, o, n]), I = j(async () => {
    e.current && u({
      isOpen: !0,
      title: n("op_clear"),
      message: n("confirm_clear"),
      action: async () => {
        r(!0), i(0), a(`${n("op_clear")}...`);
        try {
          await e.current?.clear(), p([]), _(), l(null), b(), m(), f.current.clear(), w(), d({ loaded: 0, total: 0 }), N.current.clear(), g(), s(), a(n("ready"));
        } catch (L) {
          console.error("清空场景失败:", L);
        } finally {
          r(!1);
        }
      }
    });
  }, [
    b,
    N,
    f,
    m,
    g,
    _,
    w,
    e,
    d,
    u,
    r,
    i,
    l,
    p,
    a,
    n,
    s
  ]), B = j((S = "scene") => {
    const L = e.current;
    if (L)
      try {
        const M = L.renderer, k = L.scene, U = k.background;
        S === "transparent" ? (k.background = null, M.setClearAlpha(0)) : M.setClearAlpha(1), M.render(k, L.camera);
        const O = L.canvas.toDataURL("image/png"), de = document.createElement("a");
        de.href = O, de.download = S === "transparent" ? "screenshot-transparent.png" : "screenshot.png", de.click(), k.background = U, M.setClearAlpha(1), M.render(k, L.camera), o({ message: n("success"), type: "success" });
      } catch (M) {
        console.error(M), o({ message: n("failed"), type: "error" });
      }
  }, [e, o, n]);
  return {
    getDefaultExportFileName: R,
    handleExport: C,
    handleClear: I,
    handleScreenshot: B
  };
}
function $o({
  sceneMgrRef: e,
  canvasRef: n,
  activeTool: r,
  setActiveTool: i,
  measureType: a,
  setMeasureType: o,
  pickEnabled: h,
  selectedUuids: u,
  setSelectedUuids: p,
  setSelectedProps: l,
  setMousePos: d,
  setHighlightedMeasureId: _,
  handleSelect: b,
  handleContextMenu: m,
  handleUndoVisibility: w,
  clearSelectionState: g
}) {
  const s = ue(null), f = ue(null), N = ue(null);
  ce(() => {
    const y = e.current, R = n.current;
    if (!y || !R) return;
    const ee = 6, C = (L) => {
      s.current = {
        x: L.clientX,
        y: L.clientY,
        moved: !1,
        button: L.button
      };
    }, I = (L) => {
      const M = s.current;
      if (!M || M.button !== 0 || M.moved) {
        s.current = null;
        return;
      }
      if (s.current = null, r !== "boxSelect") {
        if (r === "measure") {
          if (a !== "none") {
            const U = y.getRayIntersects(L.clientX, L.clientY);
            if (U) {
              const O = U.object.uuid;
              y.addMeasurePoint(U.point, O);
              return;
            }
          }
          const k = y.pickMeasurement(L.clientX, L.clientY);
          if (k) {
            _(k), y.highlightMeasurement(k);
            return;
          }
          _(null), y.highlightMeasurement(null);
          return;
        }
        if (h) {
          const k = y.pick(L.clientX, L.clientY);
          b(k ? k.object : null, k ? k.intersect : null, L.ctrlKey);
        }
      }
    }, B = (L) => {
      if (s.current && !s.current.moved) {
        const M = L.clientX - s.current.x, k = L.clientY - s.current.y;
        M * M + k * k > ee * ee && (s.current.moved = !0);
      }
      if (r === "measure") {
        y.updateMeasureHover(L.clientX, L.clientY), d(null);
        return;
      }
      if (L.buttons !== 0) {
        N.current = null, f.current !== null && (cancelAnimationFrame(f.current), f.current = null), d(null);
        return;
      }
      N.current = { x: L.clientX, y: L.clientY }, f.current === null && (f.current = requestAnimationFrame(() => {
        f.current = null;
        const M = N.current;
        if (!M) return;
        const k = y.getRayIntersects(M.x, M.y);
        d(k ? k.point : null);
      }));
    }, S = (L) => {
      if ((L.key === "z" || L.key === "Z") && (L.ctrlKey || L.metaKey)) {
        w();
        return;
      }
      L.key === "Escape" && (r === "measure" && a !== "none" && (o("none"), y.startMeasurement("none")), r === "boxSelect" && (y.cancelBoxSelect(), i("none")), g());
    };
    return R.addEventListener("mousedown", C), R.addEventListener("click", I), R.addEventListener("mousemove", B), R.addEventListener("contextmenu", m), window.addEventListener("keydown", S), () => {
      f.current !== null && (cancelAnimationFrame(f.current), f.current = null), N.current = null, R.removeEventListener("mousedown", C), R.removeEventListener("click", I), R.removeEventListener("mousemove", B), R.removeEventListener("contextmenu", m), window.removeEventListener("keydown", S);
    };
  }, [
    r,
    n,
    g,
    m,
    b,
    w,
    a,
    h,
    e,
    i,
    _,
    o,
    d
  ]), ce(() => {
    const y = e.current, R = n.current;
    if (!y || !R || r !== "boxSelect") return;
    y.controls.mouseButtons.LEFT = void 0;
    const ee = (B) => {
      B.button === 0 && y.startBoxSelect(B.clientX, B.clientY);
    }, C = (B) => {
      y.updateBoxSelect(B.clientX, B.clientY);
    }, I = (B) => {
      if (B.button !== 0) return;
      const S = y.endBoxSelect();
      if (S.length > 0) {
        const L = B.shiftKey ? [.../* @__PURE__ */ new Set([...u, ...S])] : S;
        p(L), l(null), y.highlightObjects(L);
      }
    };
    return R.addEventListener("pointerdown", ee), window.addEventListener("pointermove", C), window.addEventListener("pointerup", I), () => {
      R.removeEventListener("pointerdown", ee), window.removeEventListener("pointermove", C), window.removeEventListener("pointerup", I), y.controls && (y.controls.mouseButtons.LEFT = E.MOUSE.ROTATE), y.cancelBoxSelect();
    };
  }, [r, n, e, u, l, p]);
}
const Vo = [
  ".lmb",
  ".glb",
  ".gltf",
  ".ifc",
  ".nbim",
  ".fbx",
  ".obj",
  ".stl",
  ".ply",
  ".3mf",
  ".stp",
  ".step",
  ".igs",
  ".iges"
];
function Po({
  sceneMgrRef: e,
  t: n,
  processFiles: r,
  loadItemsIntoScene: i,
  setLoading: a,
  setStatus: o,
  setProgress: h,
  setToast: u,
  setActiveTool: p,
  setSelectedUuids: l,
  setSelectedProps: d,
  resetMeasurementState: _,
  updateTree: b,
  isDev: m
}) {
  const w = j(async (y) => {
    y.target.files?.length && (await r(Array.from(y.target.files)), y.target.value = "");
  }, [r]), g = j(async (y) => {
    const R = e.current;
    if (!y.target.files?.length || !R) return;
    const ee = Array.from(y.target.files);
    if (y.target.value = "", ee.filter((I) => I.name.toLowerCase().endsWith(".nbim")).length > 0) {
      u({ message: n("unsupported_format"), type: "info" });
      return;
    }
    R.setChunkLoadingEnabled?.(!1), R.setContentVisible?.(!1), a(!0), o(`${n("processing")}...`), h(0), p("none");
    try {
      await R.clear(), l([]), d(null), _(), b(), await i(ee), b(), o(`${n("processing")}...`), await R.exportNbim(), o(n("success")), u({ message: n("success"), type: "success" });
    } catch (I) {
      console.error("[ThreeViewer] handleBatchConvert error:", I), o(n("failed")), u({ message: `${n("failed")}: ${I.message}`, type: "error" });
    } finally {
      try {
        await e.current?.clear(), b();
      } catch {
      }
      e.current?.setChunkLoadingEnabled?.(!0), e.current?.setContentVisible?.(!0), a(!1);
    }
  }, [
    i,
    _,
    e,
    p,
    a,
    h,
    d,
    l,
    o,
    u,
    n,
    b
  ]), s = j(async () => {
    const y = window.prompt(n("menu_open_url"), "http://");
    if (!(!y || !y.startsWith("http"))) {
      m && console.log("[ThreeViewer] handleOpenUrl called with:", y), a(!0), o(`${n("processing")}...`);
      try {
        await r([y]);
      } catch (R) {
        console.error("[ThreeViewer] handleOpenUrl error:", R), o(n("failed")), u({ message: `${n("failed")}: ${R.message}`, type: "error" });
      } finally {
        a(!1);
      }
    }
  }, [m, r, a, o, u, n]), f = j((y) => {
    y.preventDefault(), y.stopPropagation();
  }, []), N = j(async (y) => {
    if (y.preventDefault(), y.stopPropagation(), !y.dataTransfer.files?.length) return;
    const R = Array.from(y.dataTransfer.files), ee = R.filter((C) => {
      const I = C.name.substring(C.name.lastIndexOf(".")).toLowerCase();
      return Vo.includes(I);
    });
    ee.length < R.length && u({ message: n("unsupported_format"), type: "info" }), ee.length > 0 && await r(ee);
  }, [r, u, n]);
  return {
    handleOpenFiles: w,
    handleBatchConvert: g,
    handleOpenUrl: s,
    handleDragOver: f,
    handleDrop: N
  };
}
function Fo(e) {
  const {
    propShowOutline: n,
    propShowProperties: r,
    setShowOutline: i,
    setShowProps: a
  } = e, [o, h] = V(260), [u, p] = V(300), l = ue(!1), d = ue(!1);
  return ce(() => {
    n !== void 0 && i(n);
  }, [n, i]), ce(() => {
    r !== void 0 && a(r);
  }, [r, a]), ce(() => {
    const _ = (m) => {
      if (l.current && h(Math.max(150, Math.min(500, m.clientX))), d.current) {
        const w = window.innerWidth - m.clientX;
        p(Math.max(200, Math.min(600, w)));
      }
    }, b = () => {
      l.current = !1, d.current = !1;
    };
    return window.addEventListener("mousemove", _), window.addEventListener("mouseup", b), () => {
      window.removeEventListener("mousemove", _), window.removeEventListener("mouseup", b);
    };
  }, []), {
    leftWidth: o,
    rightWidth: u,
    resizingLeft: l,
    resizingRight: d
  };
}
const Oo = { x: [0, 100], y: [0, 100], z: [0, 100] }, To = { x: !1, y: !1, z: !1 };
function Ro({ initialSettings: e, mgrInstance: n }) {
  const [r, i] = V("none"), [a, o] = V(!1), [h, u] = V(32), [p, l] = V("radial"), [d, _] = V("none"), [b, m] = V([]), [w, g] = V(null), [s, f] = V(!1), [N, y] = V(Oo), [R, ee] = V(To), [C, I] = st(
    "3dbrowser_clipHelperVisible",
    e?.clip?.helperVisible ?? !1,
    {
      serializer: (O) => String(O),
      parser: (O) => O === "true"
    }
  ), [B, S] = st(
    "3dbrowser_clipHelperOpacity",
    e?.clip?.helperOpacity ?? 0.12,
    {
      serializer: (O) => String(O),
      parser: (O) => {
        const de = Number(O);
        return Number.isFinite(de) ? de : 0.12;
      }
    }
  ), L = Ie(
    () => Math.min(0.35, Math.max(0.05, B)),
    [B]
  );
  return ce(() => {
    L !== B && S(L);
  }, [B, L, S]), ce(() => {
    n && n.setClipHelperOptions({
      visible: C,
      opacity: L
    });
  }, [C, n, L]), ce(() => {
    n && r !== "measure" && (n.clearMeasurementPreview(), n.highlightMeasurement(null), g(null), _("none"));
  }, [r, n]), ce(() => {
    if (!n || (n.setClippingEnabled(s), !s)) return;
    let O = n.computeTotalBounds(!0);
    O.isEmpty() && (O = n.computeTotalBounds(!1)), O.isEmpty() || n.updateClippingPlanes(O, N, R);
  }, [R, s, N, n]), ce(() => {
    n && n.startMeasurement(d);
  }, [d, n]), ce(() => {
    n && n.setExplodeEnabled(a);
  }, [a, n]), ce(() => {
    n && n.setExplodeStrength(h);
  }, [h, n]), ce(() => {
    n && n.setExplodeMode(p);
  }, [p, n]), {
    activeTool: r,
    setActiveTool: i,
    explodeEnabled: a,
    setExplodeEnabled: o,
    explodeStrength: h,
    setExplodeStrength: u,
    explodeMode: p,
    setExplodeMode: l,
    resetExplodeState: () => {
      o(!1), u(32), l("radial");
    },
    measureType: d,
    setMeasureType: _,
    measureHistory: b,
    setMeasureHistory: m,
    highlightedMeasureId: w,
    setHighlightedMeasureId: g,
    resetMeasurementState: () => {
      m([]), g(null), _("none");
    },
    handleMeasureUpdate: (O) => {
      m(O.map((de) => ({ id: de.id, type: de.type, val: de.val })));
    },
    clipEnabled: s,
    setClipEnabled: f,
    clipValues: N,
    setClipValues: y,
    clipActive: R,
    setClipActive: ee,
    clipHelperVisible: C,
    setClipHelperVisible: I,
    clipHelperOpacity: L,
    setClipHelperOpacity: S
  };
}
const Ft = 400;
function Uo() {
  return new Promise((e) => {
    window.requestAnimationFrame(() => e());
  });
}
function jo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  setSelectedProps: i,
  updateTree: a,
  resetLocateState: o
}) {
  const [h, u] = V({
    x: 0,
    y: 0,
    visible: !1
  }), [p, l] = V(/* @__PURE__ */ new Set()), [d, _] = V(/* @__PURE__ */ new Set()), b = ue([]), m = j(() => {
    u((C) => ({ ...C, visible: !1 }));
  }, []), w = j((C) => {
    C.preventDefault(), C.stopPropagation(), u({
      x: C.clientX,
      y: C.clientY,
      visible: !0
    });
  }, []), g = j(() => {
    const C = e.current;
    if (!C || n.length === 0) return;
    const I = n.map((S) => {
      const L = C.contentGroup.getObjectByProperty("uuid", S);
      return { uuid: S, visible: L ? L.visible : !0 };
    });
    b.current.push(I);
    const B = [...n];
    r([]), i(null), C.highlightObjects([]), m(), (async () => {
      for (let M = 0; M < B.length; M += Ft) {
        const k = B.slice(M, M + Ft), U = M + Ft >= B.length;
        C.setObjectsVisibility(k, !1, { deferRefresh: !U }), M + Ft < B.length && await Uo();
      }
      const S = new Set(p), L = new Set(d);
      B.forEach((M) => {
        S.add(M), L.delete(M);
      }), l(S), _(L), a();
    })();
  }, [
    m,
    p,
    d,
    e,
    n,
    i,
    r,
    a
  ]), s = j(() => {
    const C = e.current;
    if (!C) return;
    if (C.restoreLocateIsolation()) {
      l(/* @__PURE__ */ new Set()), _(/* @__PURE__ */ new Set()), o(), C.clearLocateFocus(), m();
      return;
    }
    (p.size > 0 || d.size > 0) && (C.setAllVisibility(!0), l(/* @__PURE__ */ new Set()), _(/* @__PURE__ */ new Set()), a()), o(), C.clearLocateFocus(), m();
  }, [m, p, d, o, e, a]), f = j((C, I) => {
    const B = e.current;
    if (!B) return;
    b.current.push([{ uuid: C, visible: !I }]), B.setObjectVisibility(C, I);
    const S = new Set(p);
    I ? S.delete(C) : S.add(C), l(S), a();
  }, [p, e, a]), N = j((C) => {
    const I = e.current;
    I && (b.current.push([{ uuid: C, visible: !0 }]), I.setObjectVisibility(C, !1), l((B) => new Set(B).add(C)), r((B) => B.filter((S) => S !== C)), a());
  }, [e, r, a]), y = j((C) => {
    const I = e.current;
    I && (I.isolateObjects([C]), l(/* @__PURE__ */ new Set()), _(/* @__PURE__ */ new Set([C])), r([C]), I.highlightObjects([C]), a(), m());
  }, [m, e, r, a]), R = j(() => {
    const C = e.current;
    if (!C || n.length === 0) return;
    const I = n.filter((B) => !d.has(B));
    I.length > 0 && (C.isolateObjects(n), _(/* @__PURE__ */ new Set([...d, ...I])), l(/* @__PURE__ */ new Set()), a()), m();
  }, [m, d, e, n, a]), ee = j(() => {
    const C = e.current;
    if (!C || b.current.length === 0) return;
    const I = b.current.pop();
    if (!I) return;
    C.applyVisibilityBatch(I, {
      recomputeBounds: !0,
      refreshExplode: !1,
      invalidateInteractables: !0
    });
    const B = new Set(p);
    I.forEach((S) => {
      S.visible ? B.delete(S.uuid) : B.add(S.uuid);
    }), l(B), a();
  }, [p, e, a]);
  return {
    contextMenu: h,
    hiddenUuids: p,
    isolatedUuids: d,
    setHiddenUuids: l,
    setIsolatedUuids: _,
    handleContextMenu: w,
    closeContextMenu: m,
    handleHideSelected: g,
    handleShowAll: s,
    handleToggleVisibility: f,
    handleHideObject: N,
    handleIsolateObject: y,
    handleIsolateSelection: R,
    handleUndoVisibility: ee
  };
}
function Ho({
  currentFileSetId: e,
  sceneMgrRef: n,
  setToast: r,
  setConfirmState: i,
  t: a,
  captureStateSnapshot: o,
  restoreStateSnapshot: h
}) {
  const [u, p] = V([]);
  ce(() => {
    if (!e) {
      p([]);
      return;
    }
    try {
      const s = localStorage.getItem(`viewpoints_${e}`);
      p(s ? JSON.parse(s) : []);
    } catch (s) {
      console.error("Failed to load viewpoints", s), p([]);
    }
  }, [e]);
  const l = j((s) => {
    if (e) {
      p(s);
      try {
        localStorage.setItem(`viewpoints_${e}`, JSON.stringify(s));
      } catch (f) {
        console.error("Failed to persist viewpoints", f);
      }
    }
  }, [e]), d = j(() => {
    const s = n.current;
    if (!s) return "";
    try {
      s.renderer.render(s.scene, s.camera);
      const f = s.canvas, N = Math.min(640 / f.width, 360 / f.height), y = Math.round(f.width * N), R = Math.round(f.height * N), ee = document.createElement("canvas");
      ee.width = y, ee.height = R;
      const C = ee.getContext("2d");
      return C ? (C.drawImage(f, 0, 0, y, R), ee.toDataURL("image/jpeg", 0.92)) : "";
    } catch (f) {
      return console.error("Failed to capture thumbnail", f), "";
    }
  }, [n]), _ = j((s, f = {
    visibility: !0,
    selection: !0,
    clip: !0,
    explode: !0
  }, N) => {
    const y = n.current;
    if (!y || !e) {
      r({ message: a("no_models"), type: "info" });
      return;
    }
    if (y.contentGroup.children.length === 0) {
      r({ message: a("no_models"), type: "info" });
      return;
    }
    const R = s || `${a("viewpoint_title")} ${u.length + 1}`, ee = y.getCameraState(), C = d(), I = o(f), B = N ? u.map((S) => S.id === N ? { ...S, name: R, cameraState: ee, image: C, saveOptions: f, stateSnapshot: I } : S) : [...u, { id: Date.now().toString(), name: R, cameraState: ee, image: C, saveOptions: f, stateSnapshot: I }];
    l(B), r({ message: a("success"), type: "success" });
  }, [o, d, e, l, n, r, a, u]), b = j((s, f) => {
    l(u.map((N) => N.id === s ? { ...N, name: f } : N));
  }, [l, u]), m = j(async (s) => {
    s.cameraState && (n.current?.setCameraState(s.cameraState), await h(s.stateSnapshot), r({ message: `${a("viewpoint_loading")}: ${s.name}`, type: "info" }));
  }, [h, n, r, a]), w = j((s) => {
    const f = u.find((N) => N.id === s);
    f && _(
      f.name,
      f.saveOptions || {
        visibility: !0,
        selection: !0,
        clip: !0,
        explode: !0
      },
      s
    );
  }, [_, u]), g = j((s) => {
    const f = u.find((N) => N.id === s);
    i({
      isOpen: !0,
      title: a("viewpoint_title"),
      message: `${a("confirm_delete")} "${f?.name || a("viewpoint_default_name")}"?`,
      action: () => {
        l(u.filter((N) => N.id !== s));
      }
    });
  }, [l, i, a, u]);
  return {
    viewpoints: u,
    handleSaveViewpoint: _,
    handleUpdateViewpointName: b,
    handleLoadViewpoint: m,
    handleOverwriteViewpoint: w,
    handleDeleteViewpoint: g
  };
}
const jn = [".lmb", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3ds", ".dae", ".stp", ".step", ".igs", ".iges"], Hn = [
  "ResizeObserver loop completed",
  "ResizeObserver loop limit",
  "texImage3D: FLIP_Y or PREMULTIPLY_ALPHA"
];
function Go({
  allowDragOpen: e,
  mgrInstance: n,
  viewportRef: r,
  t: i,
  processFiles: a,
  setToast: o,
  setErrorState: h
}) {
  ce(() => {
    if (!r.current || !n) return;
    const u = new ResizeObserver((l) => {
      const d = l[0];
      if (!d) return;
      const { width: _, height: b } = d.contentRect;
      _ === 0 || b === 0 || requestAnimationFrame(() => {
        n.resize(_, b);
      });
    });
    u.observe(r.current);
    const p = () => {
      if (!r.current) return;
      const l = r.current.getBoundingClientRect();
      n.resize(l.width, l.height);
    };
    return window.addEventListener("resize", p), () => {
      u.disconnect(), window.removeEventListener("resize", p);
    };
  }, [n, r]), ce(() => {
    const u = (l) => {
      e && (l.preventDefault(), l.stopPropagation());
    }, p = async (l) => {
      if (!e) return;
      l.preventDefault(), l.stopPropagation();
      const d = l.dataTransfer?.files ? Array.from(l.dataTransfer.files) : [];
      if (d.length === 0) return;
      const _ = d.filter((m) => {
        const w = `.${m.name.split(".").pop()?.toLowerCase()}`;
        return !jn.includes(w);
      });
      _.length > 0 && o({
        message: `${i("failed")}: 不支持的格式 - ${_.map((m) => m.name).join(", ")}`,
        type: "error"
      });
      const b = d.filter((m) => {
        const w = `.${m.name.split(".").pop()?.toLowerCase()}`;
        return jn.includes(w);
      });
      b.length > 0 && await a(b);
    };
    return window.addEventListener("dragover", u), window.addEventListener("drop", p), () => {
      window.removeEventListener("dragover", u), window.removeEventListener("drop", p);
    };
  }, [e, a, o, i]), ce(() => {
    const u = (l) => {
      const d = l.message || "";
      !d && !l.error || Hn.some((_) => d.includes(_)) || (console.error("Global Error:", l.error || d), h({
        isOpen: !0,
        title: i("failed"),
        message: d || "An unexpected error occurred",
        detail: l.error?.stack || ""
      }));
    }, p = (l) => {
      if (!l.reason) return;
      const d = l.reason?.message || String(l.reason);
      Hn.some((_) => d.includes(_)) || (console.error("Unhandled Rejection:", l.reason), h({
        isOpen: !0,
        title: i("failed"),
        message: d || "A promise was rejected without reason",
        detail: l.reason?.stack || ""
      }));
    };
    return window.addEventListener("error", u), window.addEventListener("unhandledrejection", p), () => {
      window.removeEventListener("error", u), window.removeEventListener("unhandledrejection", p);
    };
  }, [h, i]);
}
function ct(e, n, r, i) {
  r && e.push(...wt(n, r, i));
}
function Gn(e, n, r, i) {
  Object.entries(n).forEach(([a, o]) => {
    if (Array.isArray(o) || typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
      ct(r, e, [{ key: a, value: o, source: i }], i);
      return;
    }
    o && typeof o == "object" && Object.entries(o).forEach(([h, u]) => {
      ct(r, e, [{ key: `${a}.${h}`, value: u, rawKey: h, source: i }], i);
    });
  });
}
function Et(e) {
  return String(e ?? "").trim();
}
function Ut(e, n) {
  if (!e || !Array.isArray(e.rows)) return "";
  const r = new Set(n.map((a) => Pe(a))), i = e.rows.find((a) => {
    const o = Pe(a?.key || ""), h = Pe(a?.path || ""), u = Pe(a?.rawKey || "");
    return r.has(o) || r.has(h) || r.has(u);
  });
  return Et(i?.value);
}
function Ot(e, n, r, i = "") {
  const a = e.getNbimPropertySearchDocument?.(n), o = Et(
    Ut(a, ["IFC 标识.ExpressID", "IFC.ExpressID", "ExpressID"]) || r?.userData?.expressID
  ), h = Et(e.getBimIdByUuid?.(n) || a?.bimId || r?.userData?.bimId), u = Et(
    Ut(a, ["IFC 标识.类型", "IFC.类型", "IFC Type", "ifcType"]) || r?.userData?.ifcType || r?.type
  ), p = Et(
    Ut(a, ["基本信息.名称", "Object.name", "Name", "名称"]) || r?.name || a?.name || i
  );
  return h && h !== n ? h : o ? `${u && u !== "Mesh" ? u : "IFC"} #${o}` : p && p !== "Mesh" && p !== n ? p : i || n;
}
function Wo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  onSelectObject: i,
  focusObjectsInView: a,
  t: o,
  setToast: h
}) {
  const [u, p] = V([
    { id: "cond_init", propertyName: "", operator: "contains", value: "" }
  ]), [l, d] = V([]), [_, b] = V(!1), [m, w] = V(0), [g, s] = V(""), [f, N] = V([]), y = ue(-1), R = ue(0), ee = ue(!1), C = j(() => {
    const K = e.current;
    if (!K?.getNbimPropertyNameIndex) {
      N([]);
      return;
    }
    const T = typeof K.getNbimPropertyNameIndexVersion == "function" ? K.getNbimPropertyNameIndexVersion() : Date.now();
    if (y.current === T) return;
    y.current = T;
    const X = K.getNbimPropertyNameIndex() || [];
    N(
      X.map((Z) => ({
        value: String(Z.path || ""),
        label: String(Z.path || ""),
        count: Number(Z.count || 0)
      })).filter((Z) => Z.value)
    );
  }, [e]);
  ce(() => {
    C();
    const K = window.setInterval(C, 500);
    return () => window.clearInterval(K);
  }, [C]);
  const I = j((K, T) => {
    let X = T;
    for (; X; ) {
      const ie = X.userData?.originalUuid || X.userData?.modelUuid || X.userData?.rootUuid;
      if (ie) return String(ie);
      X = X.parent;
    }
    const Z = e.current?.getStructureNodes(K)?.[0];
    return Z?.userData?.originalUuid ? String(Z.userData.originalUuid) : K;
  }, [e]), B = j((K, T) => {
    const X = [], Z = T?.userData?.nbimSearchDocument || e.current?.getNbimPropertySearchDocument?.(K);
    Z && Array.isArray(Z.rows) && Z.rows.forEach((z, F) => {
      ct(X, z.group || "NBIM", [{
        key: z.key,
        value: z.value,
        rawKey: z.rawKey,
        id: `${Z.uuid || K}::${z.path || z.key}::${F}`,
        source: z.source || "property-index"
      }], z.source || "property-index");
    }), ct(X, "Object", [
      { key: "name", value: T?.name, source: "object" },
      { key: "type", value: T?.type, source: "object" },
      { key: "uuid", value: K, source: "object" },
      { key: "bimid", value: e.current?.getBimIdByUuid(K) || "", source: "object" }
    ]);
    const ie = T?.userData || {};
    Object.entries(ie).forEach(([z, F]) => {
      typeof F == "string" || typeof F == "number" || typeof F == "boolean" ? ct(X, "UserData", [{ key: z, value: F, source: "userData" }], "userData") : Array.isArray(F) && F.forEach((P, $) => {
        ct(X, "UserData", [{ key: z, value: P, id: `userData::${z}::${$}`, source: "userData" }], "userData");
      });
    });
    const fe = T?.userData?.ifcMetadata || {};
    if (Gn("IFC Metadata", fe, X, "ifcMetadata"), !Z) {
      const z = e.current?.getNbimProperties(K);
      z && typeof z == "object" && Gn("NBIM", z, X, "nbim");
      const F = e.current?.getNbimIfcPropertyGroups(K, "normalized");
      F && typeof F == "object" && Object.entries(F).forEach(([P, $]) => {
        ct(X, P, $, "nbim-ifc");
      });
    }
    return X;
  }, [e]), S = j(() => {
    const K = [], T = e.current;
    if (!T) return K;
    const X = /* @__PURE__ */ new Set(), Z = /* @__PURE__ */ new Set(), ie = /* @__PURE__ */ new Set();
    T.contentGroup.updateMatrixWorld(!0), T.contentGroup.traverse((P) => {
      const $ = P;
      if (!$.isMesh || !$.geometry || $.userData?.isIfcGridHelper) return;
      X.add($.uuid);
      const H = T.getBimIdByUuid($.uuid), q = $.userData?.expressID;
      Z.add($.uuid), H && Z.add(String(H)), q != null && Z.add(String(q));
      const he = String(
        H || q || $.uuid
      );
      ie.has(he) || (ie.add(he), K.push({
        uuid: $.uuid,
        name: Ot(T, $.uuid, $, $.name || $.uuid),
        type: $.type || "Mesh",
        modelId: I($.uuid, $),
        sourceLabel: "object",
        source: $
      }));
    });
    const fe = (P) => {
      P.forEach(($) => {
        if (!$ || $.visible === !1) return;
        const H = String($.id || "");
        if (H && $.bimId) {
          const q = String($.bimId || H);
          !ie.has(q) && X.has(H) && (Z.add(H), Z.add(String($.bimId)), ie.add(q), K.push({
            uuid: H,
            name: Ot(T, H, null, String($.name || H)),
            type: String($.type || "Node"),
            modelId: String($.userData?.originalUuid || H),
            sourceLabel: "structure",
            source: {
              name: $.name,
              type: $.type,
              userData: $.userData || {}
            }
          }));
        }
        Array.isArray($.children) && $.children.length > 0 && fe($.children);
      });
    };
    Array.isArray(T.structureRoot?.children) && T.structureRoot.children.length > 0 && fe(T.structureRoot.children);
    const z = T.getAllNbimPropertySearchDocuments?.() || [], F = /* @__PURE__ */ new Set();
    return z.forEach((P) => {
      if (!P?.rows || !Array.isArray(P.rows)) return;
      const $ = String(P.uuid || ""), H = String(P.bimId || ""), q = String(Ut(P, ["IFC 标识.ExpressID", "IFC.ExpressID", "ExpressID"]) || ""), he = H ? T.resolveNodeUuidByBimId?.(H) : null, Q = String(he || $ || H || q || "");
      if (!Q) return;
      const A = !!T.getStructureNodes?.(Q)?.length || !!(H && T.resolveNodeUuidByBimId?.(H)), v = X.has(Q) || !!H && Z.has(H) || !!q && Z.has(q);
      if (!A && !v) return;
      const ne = String(P.owner || "") + "::" + String(P.bimId || Q);
      if (F.has(ne)) return;
      F.add(ne);
      const se = Ot(T, Q, null, String(P.name || P.bimId || P.uuid));
      K.push({
        uuid: Q,
        name: se,
        type: "PropertyIndex",
        modelId: String(P.owner || Q),
        sourceLabel: "property-index",
        source: {
          name: se,
          type: "PropertyIndex",
          userData: { nbimSearchDocument: P, originalUuid: P.owner, bimId: P.bimId }
        }
      });
    }), K;
  }, [I, e]), L = j((K, T, X) => T === "equals" ? K === X : T === "contains" ? K.includes(X) : T === "notContains" ? !K.includes(X) : T === "startsWith" ? K.startsWith(X) : T === "endsWith" ? K.endsWith(X) : !1, []), M = j((K, T) => T ? K.normalizedKey === T || K.normalizedPath === T || !!K.rawKey && Pe(K.rawKey) === T || K.normalizedPath.endsWith(`.${T}`) : !1, []), k = j(async () => {
    if (!e.current || ee.current) return;
    C();
    const K = u.map((Z) => ({
      ...Z,
      normalizedPropertyName: Pe(Z.propertyName),
      normalizedValue: Pe(Z.value)
    })).filter((Z) => Z.normalizedPropertyName && Z.normalizedValue);
    if (K.length === 0) {
      d([]), b(!1), w(0), s(""), h({ message: o("search_invalid_condition"), type: "info" }), e.current.highlightObjects(n);
      return;
    }
    const T = ++R.current, X = performance.now();
    ee.current = !0, b(!0), w(0), s(o("searching"));
    try {
      await new Promise((Q) => window.requestAnimationFrame(() => Q()));
      const Z = e.current, ie = Z?.getAllNbimPropertySearchDocuments?.() || [], fe = [], z = /* @__PURE__ */ new Set();
      let F = performance.now(), P = performance.now(), $ = !1;
      if (ie.length > 0) {
        const Q = ie.length;
        for (let A = 0; A < ie.length; A++) {
          if (R.current !== T) {
            $ = !0, s(o("search_cancelled"));
            break;
          }
          const v = ie[A], ne = Array.isArray(v?.rows) ? v.rows : [];
          if (ne.length === 0) continue;
          let se = null;
          const W = /* @__PURE__ */ new Set();
          if (K.forEach((Y, pe) => {
            const re = ne.filter((Ce) => {
              const ke = Pe(Ce?.key || ""), Ge = Pe(Ce?.path || ""), G = Pe(Ce?.rawKey || ""), oe = Y.normalizedPropertyName;
              return ke === oe || Ge === oe || G === oe || Ge.endsWith(`.${oe}`);
            }), te = re.some((Ce) => {
              const ke = Pe(Ce?.value);
              return L(ke, Y.operator, Y.normalizedValue);
            });
            te && re.forEach((Ce) => {
              const ke = Pe(Ce?.value);
              L(ke, Y.operator, Y.normalizedValue) && W.add(String(Ce?.path || Ce?.key || ""));
            }), pe === 0 || se === null ? se = te : (Y.connector || "AND") === "AND" ? se = !!se && te : se = !!se || te;
          }), se) {
            const Y = String(v?.bimId || ""), pe = Y ? Z?.resolveNodeUuidByBimId?.(Y) : null, re = String(pe || v?.uuid || Y || "");
            re && !z.has(re) && (z.add(re), fe.push({
              uuid: re,
              name: Ot(e.current, re, null, String(v?.name || Y || re)),
              type: String(v?.type || "PropertyIndex"),
              modelId: String(v?.owner || re),
              source: "property-index",
              matchedBy: Array.from(W).filter(Boolean)
            }));
          }
          if ((A + 1) % 250 === 0 || A === ie.length - 1) {
            const Y = performance.now(), pe = Q > 0 ? (A + 1) / Q * 100 : 100;
            (Y - F > 80 || A === ie.length - 1) && (w(pe), F = Y), (Y - P > 16 || A === ie.length - 1) && (P = Y, await new Promise((re) => window.setTimeout(re, 0)));
          }
        }
        $ || (d(fe), w(100), s(`${o("search_results")}: ${fe.length}`));
        return;
      }
      const H = S(), q = H.length, he = 120;
      for (let Q = 0; Q < H.length; Q++) {
        if (R.current !== T) {
          $ = !0, s(o("search_cancelled"));
          break;
        }
        const A = H[Q], v = B(A.uuid, A.source);
        let ne = null;
        const se = /* @__PURE__ */ new Set();
        if (K.forEach((W, Y) => {
          const pe = v.filter((te) => M(te, W.normalizedPropertyName)), re = pe.some((te) => L(te.normalizedValue, W.operator, W.normalizedValue));
          re && pe.forEach((te) => {
            L(te.normalizedValue, W.operator, W.normalizedValue) && se.add(te.path);
          }), Y === 0 || ne === null ? ne = re : (W.connector || "AND") === "AND" ? ne = !!ne && re : ne = !!ne || re;
        }), ne && !z.has(A.uuid) && (z.add(A.uuid), fe.push({
          uuid: A.uuid,
          name: A.name || A.uuid,
          type: A.type,
          modelId: A.modelId,
          source: A.sourceLabel,
          matchedBy: Array.from(se)
        })), (Q + 1) % he === 0 || Q === H.length - 1) {
          const W = performance.now(), Y = q > 0 ? (Q + 1) / q * 100 : 100;
          (W - F > 80 || Q === H.length - 1) && (w(Y), F = W), (W - P > 16 || Q === H.length - 1) && (P = W, await new Promise((pe) => window.setTimeout(pe, 0)));
        }
      }
      $ || (d(fe), w(100), s(`${o("search_results")}: ${fe.length}`));
    } finally {
      const Z = performance.now() - X, ie = 220;
      Z < ie && await new Promise((fe) => window.setTimeout(fe, ie - Z)), b(!1), ee.current = !1;
    }
  }, [B, S, L, M, e, u, n, h, C, o]), U = j((K) => {
    if (!e.current) return;
    const T = e.current.contentGroup.getObjectByProperty("uuid", K);
    if (a({ uuids: [K], focusUuid: K }), T) {
      i(T);
      return;
    }
    r([K]);
  }, [a, i, e, r]), O = j(() => {
    R.current++, d([]), b(!1), w(0), s(""), ee.current = !1, e.current && e.current.highlightObjects(n);
  }, [e, n]), de = j(() => {
    ee.current && (R.current++, s(o("search_cancelling")));
  }, [o]);
  return {
    searchConditions: u,
    setSearchConditions: p,
    searchResults: l,
    searching: _,
    searchProgress: m,
    searchStatus: g,
    propertyFieldOptions: f,
    handleRunPropertySearch: k,
    handleApplySearchResultHighlight: U,
    handleClearSearchResult: O,
    handleCancelSearch: de
  };
}
function Ko(e, n) {
  const r = Math.max(0, e.min.x - n.max.x, n.min.x - e.max.x), i = Math.max(0, e.min.y - n.max.y, n.min.y - e.max.y), a = Math.max(0, e.min.z - n.max.z, n.min.z - e.max.z);
  return Math.sqrt(r * r + i * i + a * a);
}
function Xo(e, n) {
  e.boundingBox || e.computeBoundingBox();
  const r = e.boundingBox;
  if (!r) return null;
  const i = new E.Vector3(), a = new E.Vector3();
  r.getCenter(i), r.getSize(a).multiplyScalar(0.5), i.applyMatrix4(n);
  const o = new E.Matrix3().setFromMatrix4(n);
  return new $a(i, a, o);
}
function It(e) {
  return String(e ?? "").trim();
}
function pn(e, n) {
  if (!e || !Array.isArray(e.rows)) return "";
  const r = n.map((a) => a.toLowerCase()), i = e.rows.find((a) => {
    const o = String(a?.key || "").toLowerCase(), h = String(a?.path || "").toLowerCase(), u = String(a?.rawKey || "").toLowerCase();
    return r.some((p) => o === p || h === p || u === p || h.endsWith(`.${p}`));
  });
  return It(i?.value);
}
function Yo(e, n, r, i = "") {
  const a = e.getNbimPropertySearchDocument?.(n), o = It(
    pn(a, ["ExpressID", "IFC 标识.ExpressID", "IFC.ExpressID"]) || r?.userData?.expressID
  ), h = It(e.getBimIdByUuid?.(n) || a?.bimId || r?.userData?.bimId), u = It(
    pn(a, ["类型", "IFC 标识.类型", "ifcType"]) || r?.userData?.ifcType || r?.type
  ), p = It(
    pn(a, ["名称", "Name"]) || r?.name || a?.name || i
  );
  return h && h !== n ? h : o ? `${u && u !== "Mesh" ? u : "IFC"} #${o}` : p && p !== "Mesh" && p !== n ? p : i || n;
}
function qo(e) {
  const n = [], r = Array.isArray(e) ? [...e] : [], i = /* @__PURE__ */ new Set();
  for (; r.length > 0; ) {
    const a = r.pop();
    if (!a) continue;
    const o = String(a.uuid || a.id || "").trim();
    o && !i.has(o) && (i.add(o), n.push(o));
    const h = Array.isArray(a.children) ? a.children : [];
    for (let u = h.length - 1; u >= 0; u--)
      r.push(h[u]);
  }
  return n;
}
function Qo(e) {
  const n = [], r = e.contentGroup;
  return r && (r.updateMatrixWorld(!0), r.traverse((i) => {
    const a = i;
    if (!a.isMesh || !a.visible || !a.geometry || a.userData?.isIfcGridHelper || a.isBatchedMesh || (a.geometry.boundingBox || a.geometry.computeBoundingBox(), !a.geometry.boundingBox)) return;
    const o = a.geometry.boundingBox.clone().applyMatrix4(a.matrixWorld);
    o.isEmpty() || n.push({
      key: `fallback:${a.uuid}`,
      uuid: a.uuid,
      name: a.name || a.uuid,
      object: a,
      geometry: a.geometry,
      matrixWorld: a.matrixWorld.clone(),
      box: o
    });
  })), n;
}
function Zo({
  sceneMgrRef: e,
  treeRoot: n,
  clashModelOptions: r,
  selectedUuids: i,
  setSelectedUuids: a,
  focusObjectsInView: o,
  t: h
}) {
  const [u, p] = V([]), [l, d] = V(!1), [_, b] = V(0), [m, w] = V(""), [g, s] = V(0), [f, N] = V([]), [y, R] = V([]), [ee, C] = V(0), [I, B] = V(0), [S, L] = V(0.05), [M, k] = V(!0), [U, O] = V(!1), [de, K] = V(!0), [T, X] = V(0), [Z, ie] = V("ALL"), [fe, z] = V("ALL"), F = ue(0), P = ue(!1), $ = ue(/* @__PURE__ */ new Map()), H = Ie(() => {
    const G = /* @__PURE__ */ new Map();
    return r.forEach((oe) => G.set(oe.id, oe.name)), G;
  }, [r]), q = j((G) => {
    let oe = G;
    for (; oe; ) {
      const D = oe.userData?.originalUuid;
      if (D) return String(D);
      oe = oe.parent;
    }
    return "";
  }, []), he = j((G, oe, D) => {
    const _e = oe.attributes.position;
    if (!_e) return null;
    const be = oe.index, le = Math.floor(be ? be.count / 3 : _e.count / 3);
    return {
      uuid: G,
      geometry: oe,
      matrixWorld: D.clone(),
      triangleCount: le
    };
  }, []), Q = j(() => {
    const G = e.current;
    if (!G) return [];
    const oe = $.current;
    oe.clear();
    const D = r.map((le) => le.id).filter(Boolean), _e = qo(n);
    let be = G.collectRenderableTargets();
    if (be.length === 0 && D.length > 0 && (be = G.collectRenderableTargets(D)), be.length === 0 && _e.length > 0) {
      const le = /* @__PURE__ */ new Map(), we = 512;
      for (let Ne = 0; Ne < _e.length; Ne += we)
        G.collectRenderableTargets(_e.slice(Ne, Ne + we)).forEach((De) => {
          le.set(De.key || De.uuid, De);
        });
      be = Array.from(le.values());
    }
    return be.length === 0 && (be = Qo(G)), be.forEach((le) => {
      if (!le?.box || le.box.isEmpty()) return;
      const we = G.getStructureNodes(le.uuid) || [];
      if (we.length > 0 && we.every((Be) => Be.visible === !1)) return;
      let Ne = we[0]?.userData?.originalUuid ? String(we[0].userData.originalUuid) : q(le.object);
      !Ne && D.length === 1 && (Ne = D[0]);
      const De = {
        key: le.key,
        uuid: le.uuid,
        name: Yo(G, le.uuid, le.object, le.name || le.uuid),
        modelId: Ne,
        modelName: H.get(Ne) || Ne || le.name || le.uuid,
        box: le.box.clone(),
        testBox: le.box.clone(),
        obb: M ? Xo(le.geometry, le.matrixWorld) : null,
        meshInfo: he(le.key, le.geometry, le.matrixWorld)
      };
      oe.set(De.key, De);
    }), Array.from(oe.values());
  }, [he, H, r, M, q, e, n]), A = j((G, oe, D, _e) => {
    const be = [], le = G.geometry.attributes.position;
    if (!le) return be;
    const we = G.geometry.index, Ne = Math.floor(we ? we.count / 3 : le.count / 3), De = Math.min(Ne, _e), Be = Ne > De ? Math.max(1, Math.floor(Ne / De)) : 1, Se = new E.Vector3(), $e = new E.Vector3(), We = new E.Vector3(), je = new E.Vector3();
    for (let Ae = 0; Ae < Ne; Ae += Be) {
      const ze = we ? we.getX(Ae * 3) : Ae * 3, rt = we ? we.getX(Ae * 3 + 1) : Ae * 3 + 1, Re = we ? we.getX(Ae * 3 + 2) : Ae * 3 + 2;
      if (Se.fromBufferAttribute(le, ze).applyMatrix4(G.matrixWorld), $e.fromBufferAttribute(le, rt).applyMatrix4(G.matrixWorld), We.fromBufferAttribute(le, Re).applyMatrix4(G.matrixWorld), je.copy(Se).add($e).add(We).multiplyScalar(1 / 3), !!oe.containsPoint(je) && (be.push(je.clone()), be.length >= D))
        break;
    }
    return be;
  }, []), v = j((G, oe) => {
    const D = oe.geometry.attributes.position;
    if (!D) return !1;
    const _e = oe.geometry.index, be = Math.floor(_e ? _e.count / 3 : D.count / 3), we = Math.min(be, 12e3), Ne = be > we ? Math.max(1, Math.floor(be / we)) : 1, De = G.clone();
    De.x -= 1e-4;
    const Be = new E.Ray(De, new E.Vector3(1, 0, 0)), Se = new E.Vector3(), $e = new E.Vector3(), We = new E.Vector3(), je = new E.Vector3();
    let Ae = 0;
    for (let ze = 0; ze < be; ze += Ne) {
      const rt = _e ? _e.getX(ze * 3) : ze * 3, Re = _e ? _e.getX(ze * 3 + 1) : ze * 3 + 1, at = _e ? _e.getX(ze * 3 + 2) : ze * 3 + 2;
      $e.fromBufferAttribute(D, rt).applyMatrix4(oe.matrixWorld), We.fromBufferAttribute(D, Re).applyMatrix4(oe.matrixWorld), je.fromBufferAttribute(D, at).applyMatrix4(oe.matrixWorld), !(!Be.intersectTriangle($e, We, je, !1, Se) || Se.x < De.x) && Ae++;
    }
    return Ae % 2 === 1;
  }, []), ne = j((G, oe, D) => {
    if (!G.meshInfo || !oe.meshInfo || G.meshInfo.triangleCount <= 0 || oe.meshInfo.triangleCount <= 0) return !0;
    const _e = 3e4;
    if (G.meshInfo.triangleCount > _e || oe.meshInfo.triangleCount > _e) return !0;
    const be = A(G.meshInfo, D, 4, 6e3), le = A(oe.meshInfo, D, 4, 6e3);
    return be.length === 0 || le.length === 0 ? !1 : be.some((we) => v(we, oe.meshInfo)) || le.some((we) => v(we, G.meshInfo));
  }, [A, v]), se = j(async () => {
    if (!e.current || P.current) return;
    const G = ++F.current, oe = performance.now();
    P.current = !0, d(!0), b(0), w(h("clash_collecting")), p([]), X(0);
    try {
      const D = Q();
      if (s(D.length), D.length < 2) {
        w(h("clash_insufficient_candidates"));
        return;
      }
      const _e = new Set(f), be = new Set(y), le = _e.size > 0, we = be.size > 0, Ne = (ae, ye) => {
        const Fe = r.length <= 1 && (!ae || !ye);
        return !de && ae && ye && ae === ye ? !1 : Fe ? !0 : le && we ? _e.has(ae) && be.has(ye) || _e.has(ye) && be.has(ae) : le ? _e.has(ae) || _e.has(ye) : we ? be.has(ae) || be.has(ye) : !0;
      }, De = (ae) => !ae && r.length <= 1 ? !0 : le && we ? _e.has(ae) || be.has(ae) : le ? _e.has(ae) : we ? be.has(ae) : !0, Be = Math.max(0, S), Se = D.filter((ae) => !ae.box.isEmpty() && De(ae.modelId)).map((ae) => {
        const ye = ae.box.clone();
        return (ee > 0 || Be > 0) && ye.expandByScalar(Math.max(ee, Be)), {
          ...ae,
          testBox: ye
        };
      });
      if (Se.length < 2) {
        w(h("clash_no_results")), b(100);
        return;
      }
      Se.sort((ae, ye) => ae.testBox.min.x - ye.testBox.min.x), w(h("clash_running"));
      const $e = 2e3, We = [], je = new E.Box3(), Ae = new E.Vector3(), ze = Se.length;
      let rt = 0;
      for (let ae = 0; ae < ze; ae++) {
        if (F.current !== G) {
          w(h("clash_cancelled"));
          return;
        }
        const ye = Se[ae], Fe = ye.testBox.max.x;
        for (let Me = ae + 1; Me < ze; Me++) {
          const Oe = Se[Me];
          if (Oe.testBox.min.x > Fe) break;
          if (!Ne(ye.modelId, Oe.modelId) || (rt++, !ye.testBox.intersectsBox(Oe.testBox))) continue;
          if (M && ye.obb && Oe.obb) {
            const Nt = ye.obb.clone(), ft = Oe.obb.clone();
            if (ee > 0 && (Nt.halfSize.addScalar(ee), ft.halfSize.addScalar(ee)), !Nt.intersectsOBB(ft, Number.EPSILON * 10)) continue;
          }
          je.copy(ye.box).intersect(Oe.box);
          const Ke = !je.isEmpty();
          let tt = 0;
          Ke && (je.getSize(Ae), tt = Math.max(0, Ae.x) * Math.max(0, Ae.y) * Math.max(0, Ae.z));
          const xt = Ke ? 0 : Ko(ye.box, Oe.box), Ct = Ke && tt >= I, pt = !Ke && Be > 0 && xt <= Be;
          if (!Ct && !pt || U && Ke && !ne(ye, Oe, je)) continue;
          const mt = [ye.key, Oe.key].sort().join("::"), me = Ct ? "hard" : "clearance", Dt = me === "hard" ? tt > Math.max(0.5, I * 10) ? "high" : "medium" : xt <= Math.max(1e-3, Be * 0.25) ? "high" : "low";
          if (We.push({
            id: `clash_${me}_${mt}`,
            pairKey: mt,
            groupKey: `${me}::${ye.modelId || "unknown"}::${Oe.modelId || "unknown"}::${mt}`,
            ruleId: me === "hard" ? "hard-clash-default" : "clearance-default",
            aUuid: ye.uuid,
            bUuid: Oe.uuid,
            aName: ye.name,
            bName: Oe.name,
            overlapVolume: tt,
            distance: xt,
            severity: Dt,
            type: me,
            status: "new"
          }), We.length >= $e) break;
        }
        if (We.length >= $e) break;
        if ((ae + 1) % 50 === 0 || ae === ze - 1) {
          const Me = 30 + (ae + 1) / ze * 70;
          b(Me), X(rt), w(`${h("clash_running")} ${ae + 1}/${ze}`), await new Promise((Oe) => window.setTimeout(Oe, 0));
        }
      }
      const Re = /* @__PURE__ */ new Map(), at = { high: 3, medium: 2, low: 1 };
      We.forEach((ae) => {
        const ye = Re.get(ae.pairKey);
        if (!ye)
          Re.set(ae.pairKey, ae);
        else {
          const Fe = (ye.type === "hard" ? 1e3 : 0) + at[ye.severity], Me = (ae.type === "hard" ? 1e3 : 0) + at[ae.severity];
          (Me > Fe || Me === Fe && (ae.type === "hard" && ae.overlapVolume > ye.overlapVolume || ae.type === "clearance" && ae.distance < ye.distance)) && Re.set(ae.pairKey, ae);
        }
      });
      const ot = Array.from(Re.values()).sort((ae, ye) => ae.type !== ye.type ? ae.type === "hard" ? -1 : 1 : ae.type === "hard" ? ye.overlapVolume - ae.overlapVolume : ae.distance - ye.distance);
      p((ae) => {
        const ye = /* @__PURE__ */ new Map();
        return ae.forEach((Fe) => ye.set(Fe.pairKey, Fe.status)), ot.map((Fe) => ({
          ...Fe,
          status: ye.get(Fe.pairKey) || "new"
        }));
      }), X(rt), b(100), w(`${h("clash_results")}: ${ot.length}`), ot.length === 0 && e.current.clearLocateFocus();
    } finally {
      const D = performance.now() - oe, _e = 220;
      D < _e && await new Promise((be) => window.setTimeout(be, _e - D)), P.current = !1, d(!1);
    }
  }, [S, de, I, f, y, ee, M, U, Q, ne, e, h]), W = j(() => {
    P.current && (F.current++, w(h("clash_cancelling")));
  }, [h]), Y = j(() => {
    F.current++, P.current = !1, d(!1), b(0), w(""), s(0), X(0), ie("ALL"), z("ALL"), p([]), e.current?.clearLocateFocus(), e.current?.highlightObjects(i);
  }, [e, i]), pe = j((G) => {
    const oe = [G.aUuid, G.bUuid];
    o({
      uuids: oe,
      focusUuid: G.aUuid,
      highlightColors: {
        [G.aUuid]: "#ff4d4f",
        [G.bUuid]: "#1890ff"
      }
    });
  }, [o]), re = j((G, oe) => {
    p((D) => D.map((_e) => _e.id === G ? { ..._e, status: oe } : _e));
  }, []), te = j((G) => {
    p((oe) => oe.map((D) => {
      const _e = Z === "ALL" || Z === "NEW" && D.status === "new" || Z === "CONFIRMED" && D.status === "confirmed" || Z === "RESOLVED" && D.status === "resolved", be = fe === "ALL" || fe === "HARD" && D.type === "hard" || fe === "CLEARANCE" && D.type === "clearance";
      return _e && be ? { ...D, status: G } : D;
    }));
  }, [Z, fe]), Ce = j(() => {
    if (u.length === 0) return;
    const G = (Se) => {
      const $e = String(Se ?? "");
      return $e.includes(",") || $e.includes('"') || $e.includes(`
`) ? `"${$e.replace(/"/g, '""')}"` : $e;
    }, D = [["pairKey", "type", "severity", "ruleId", "aUuid", "aName", "bUuid", "bName", "status", "overlapVolume", "distance"].join(",")];
    u.forEach((Se) => {
      D.push([
        G(Se.pairKey),
        G(Se.type),
        G(Se.severity),
        G(Se.ruleId),
        G(Se.aUuid),
        G(Se.aName),
        G(Se.bUuid),
        G(Se.bName),
        G(Se.status),
        G(Se.overlapVolume.toFixed(6)),
        G(Se.distance.toFixed(6))
      ].join(","));
    });
    const _e = "\uFEFF" + D.join(`
`), be = new Blob([_e], { type: "text/csv;charset=utf-8;" }), le = URL.createObjectURL(be), we = /* @__PURE__ */ new Date(), Ne = (Se) => String(Se).padStart(2, "0"), De = `clash_report_${we.getFullYear()}${Ne(we.getMonth() + 1)}${Ne(we.getDate())}_${Ne(we.getHours())}${Ne(we.getMinutes())}${Ne(we.getSeconds())}.csv`, Be = document.createElement("a");
    Be.href = le, Be.download = De, Be.click(), URL.revokeObjectURL(le);
  }, [u]), ke = j(() => {
    F.current++, P.current = !1, p([]), d(!1), b(0), w(""), s(0), X(0), ie("ALL"), z("ALL");
  }, []), Ge = j(() => {
    const G = new Set(r.map((oe) => oe.id));
    N((oe) => oe.filter((D) => G.has(D))), R((oe) => oe.filter((D) => G.has(D)));
  }, [r]);
  return {
    clashResults: u,
    setClashResults: p,
    clashRunning: l,
    clashProgress: _,
    clashStatus: m,
    clashScannedCount: g,
    clashSetA: f,
    clashSetB: y,
    clashTolerance: ee,
    clashMinOverlapVolume: I,
    clashClearanceDistance: S,
    clashUseNarrowPhase: M,
    clashUseTrianglePhase: U,
    clashPruning: !0,
    clashIncludeSameModel: de,
    clashPairsScanned: T,
    clashResultFilter: Z,
    clashTypeFilter: fe,
    setClashSetA: N,
    setClashSetB: R,
    setClashTolerance: C,
    setClashMinOverlapVolume: B,
    setClashClearanceDistance: L,
    setClashUseNarrowPhase: k,
    setClashUseTrianglePhase: O,
    setClashIncludeSameModel: K,
    setClashResultFilter: ie,
    setClashTypeFilter: z,
    handleRunClashCheck: se,
    handleCancelClashCheck: W,
    handleClearClashResults: Y,
    handleFocusClashResult: pe,
    handleUpdateClashResultStatus: re,
    handleMarkFilteredClashStatus: te,
    handleExportClashCsv: Ce,
    resetClashState: ke,
    applyClashModelOptionBounds: Ge
  };
}
function Jo(e, n) {
  const r = ue(/* @__PURE__ */ new Set()), i = Ie(() => {
    const a = /* @__PURE__ */ new Map(), o = (u, p) => {
      if (!u) return;
      const l = a.get(u) || {
        total: 0,
        newCount: 0,
        confirmedCount: 0,
        resolvedCount: 0,
        worstStatus: "resolved"
      };
      l.total += 1, p === "new" ? l.newCount += 1 : p === "confirmed" ? l.confirmedCount += 1 : l.resolvedCount += 1, l.newCount > 0 ? l.worstStatus = "new" : l.confirmedCount > 0 ? l.worstStatus = "confirmed" : l.worstStatus = "resolved", a.set(u, l);
    };
    n.forEach((u) => {
      o(u.aUuid, u.status), o(u.bUuid, u.status);
    });
    const h = {};
    return a.forEach((u, p) => {
      h[p] = u;
    }), h;
  }, [n]);
  return ce(() => {
    if (!e.current) return;
    const a = e.current;
    r.current.forEach((u) => {
      const p = a.contentGroup.getObjectByProperty("uuid", u);
      p?.userData?.clash && delete p.userData.clash, (a.getStructureNodes(u) || []).forEach((d) => {
        d?.userData?.clash && delete d.userData.clash;
      });
    });
    const h = /* @__PURE__ */ new Set();
    Object.entries(i).forEach(([u, p]) => {
      h.add(u);
      const l = {
        total: p.total,
        new: p.newCount,
        confirmed: p.confirmedCount,
        resolved: p.resolvedCount,
        status: p.worstStatus
      }, d = a.contentGroup.getObjectByProperty("uuid", u);
      d && (d.userData || (d.userData = {}), d.userData.clash = l), (a.getStructureNodes(u) || []).forEach((b) => {
        b.userData || (b.userData = {}), b.userData.clash = l;
      });
    }), r.current = h;
  }, [i, e]), i;
}
function es({
  sceneMgrRef: e,
  setSelectedUuids: n,
  setSelectedProps: r,
  isolateLocate: i = !1,
  onIsolateLocate: a
}) {
  return {
    focusObjectsInView: j(({
      uuids: h,
      focusUuid: u,
      highlightColors: p,
      updateSelection: l = !0
    }) => {
      const d = e.current;
      if (!d) return !1;
      const _ = Array.from(new Set((h || []).map((m) => String(m || "").trim()).filter(Boolean)));
      if (_.length === 0) return !1;
      const b = u && _.includes(u) ? u : _[0];
      return i && (d.isolateObjectsForLocate(_), a?.(_)), d.focusHighlightObjects(_, {
        fitView: !0,
        focusUuid: b,
        highlightColors: p
      }), l && (n(_), r?.(null)), !0;
    }, [i, a, e, r, n])
  };
}
const Wn = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"), us = ({
  allowDragOpen: e = !0,
  hiddenMenus: n = [],
  libPath: r = "./libs",
  defaultLang: i,
  showStats: a,
  showOutline: o,
  showProperties: h,
  initialSettings: u,
  initialFiles: p,
  onSelect: l,
  onLoad: d,
  hideDeleteModel: _ = !1,
  performancePreset: b = "quality",
  chunkOptions: m
}) => {
  const w = yn.light, g = Ie(() => ({
    chunkReadCacheSize: m?.chunkReadCacheSize ?? 128,
    chunkPrefetchWindow: m?.chunkPrefetchWindow ?? 0,
    targetMinFps: m?.targetMinFps ?? 20,
    ghostMode: m?.ghostMode,
    loadProfile: m?.loadProfile ?? "max-speed",
    deferIfcProperties: m?.deferIfcProperties ?? !0,
    preferWorkerOctree: m?.preferWorkerOctree ?? !0,
    fastGeometrySanitize: m?.fastGeometrySanitize ?? !0
  }), [m]), [s, f] = st(
    "3dbrowser_lang",
    () => i || "zh",
    {
      serializer: (x) => x,
      parser: (x) => x === "zh" || x === "en" ? x : "zh"
    }
  ), N = ue(i);
  ce(() => {
    i && i !== N.current && (f(i), N.current = i);
  }, [i, f]);
  const y = j((x) => Lt(s, x), [s]);
  ce(() => {
    const x = (xe) => {
      xe.preventDefault();
    }, J = (xe) => {
      (xe.button === 3 || xe.button === 4) && (xe.preventDefault(), xe.stopPropagation());
    };
    return document.addEventListener("contextmenu", x, { capture: !0 }), document.addEventListener("gesturestart", x, { capture: !0 }), window.addEventListener("auxclick", x, { capture: !0 }), window.addEventListener("mousedown", J, { capture: !0 }), () => {
      document.removeEventListener("contextmenu", x, { capture: !0 }), document.removeEventListener("gesturestart", x, { capture: !0 }), window.removeEventListener("auxclick", x, { capture: !0 }), window.removeEventListener("mousedown", J, { capture: !0 });
    };
  }, []);
  const [R, ee] = V([]), {
    selectedUuids: C,
    selectedUuid: I,
    setSelectedUuids: B,
    clearSelection: S
  } = ko(), [L, M] = V(null), [k, U] = V(Lt(s, "ready")), [O, de] = V(!1), [K, T] = V(0), [X, Z] = V({
    meshes: 0,
    faces: 0,
    memory: 0,
    textureMemory: 0,
    drawCalls: 0,
    chunksLoaded: 0,
    chunksTotal: 0,
    chunksQueued: 0,
    pixelRatio: 1
  }), [ie, fe] = V({ loaded: 0, total: 0 }), [z, F] = V(null), [P, $] = V(null), [H, q] = V("solid"), [he, Q] = V(""), {
    activeTool: A,
    setActiveTool: v,
    explodeEnabled: ne,
    setExplodeEnabled: se,
    explodeStrength: W,
    setExplodeStrength: Y,
    explodeMode: pe,
    setExplodeMode: re,
    resetExplodeState: te,
    measureType: Ce,
    setMeasureType: ke,
    measureHistory: Ge,
    setMeasureHistory: G,
    highlightedMeasureId: oe,
    setHighlightedMeasureId: D,
    resetMeasurementState: _e,
    handleMeasureUpdate: be,
    clipEnabled: le,
    setClipEnabled: we,
    clipValues: Ne,
    setClipValues: De,
    clipActive: Be,
    setClipActive: Se,
    clipHelperVisible: $e,
    setClipHelperVisible: We,
    clipHelperOpacity: je,
    setClipHelperOpacity: Ae
  } = Ro({
    initialSettings: u,
    mgrInstance: z
  }), [ze, rt] = st("3dbrowser_pickEnabled", !1, {
    serializer: (x) => String(x),
    parser: (x) => x === "true"
  }), [Re, at] = st("3dbrowser_showStats", a ?? !0, {
    serializer: (x) => String(x),
    parser: (x) => x === "true"
  }), [ot, ae] = st("3dbrowser_showOutline", o ?? !0, {
    serializer: (x) => String(x),
    parser: (x) => x === "true"
  }), [ye, Fe] = st("3dbrowser_showProps", h ?? !0, {
    serializer: (x) => String(x),
    parser: (x) => x === "true"
  }), [Me, Oe] = st("3dbrowser_sceneSettings", () => {
    const x = {
      ambientInt: 0.78,
      dirInt: 1.48,
      hemiInt: 0.58,
      bgColor: "#eef2f5",
      viewCubeSize: 120,
      colorSpace: "srgb",
      toneMapping: "aces",
      exposure: 0.92,
      shadowQuality: "medium",
      adaptiveQuality: !0,
      minPixelRatio: 0.8,
      maxPixelRatio: 2,
      targetFps: 50,
      performanceMode: "balanced",
      locateIsolateMode: !1,
      backLightInt: 0.62,
      highlightColor: "#0c62a2",
      highlightShowBox: !1,
      clip: {
        helperVisible: u?.clip?.helperVisible ?? !1,
        helperOpacity: u?.clip?.helperOpacity ?? 0.12
      }
    }, J = u ? { ...x, ...u } : x;
    return J.bgColor === void 0 ? { ...J, bgColor: "#eef2f5" } : J;
  });
  ce(() => {
    a !== void 0 && at(a);
  }, [a, at]), ce(() => {
    Fa(
      Me.themeType || "indigo",
      Me.themeCustomColor
    );
  }, [Me.themeType, Me.themeCustomColor]);
  const [Ke, tt] = V({ isOpen: !1, title: "", message: "", action: () => {
  } }), [xt, Ct] = V(!1), pt = ue(null), mt = ue(null), me = ue(null), Dt = ue(/* @__PURE__ */ new Map()), Nt = ue(() => {
  }), { focusObjectsInView: ft } = es({
    sceneMgrRef: me,
    setSelectedUuids: B,
    setSelectedProps: M,
    isolateLocate: Me.locateIsolateMode === !0,
    onIsolateLocate: (x) => Nt.current(x)
  }), {
    leftWidth: xn,
    rightWidth: Cn,
    resizingLeft: rr,
    resizingRight: ar
  } = Fo({
    propShowOutline: o,
    propShowProperties: h,
    setShowOutline: ae,
    setShowProps: Fe
  });
  ce(() => {
    const x = me.current;
    x && (x.setChunkOptions(g), x.updateSettings({
      ...Me,
      performanceMode: b,
      targetFps: g.targetMinFps ?? Me.targetFps
    }));
  }, [g, b, Me]);
  const ir = R.length > 0, At = Ie(() => {
    const x = [], J = /* @__PURE__ */ new Set();
    return (R || []).forEach((xe) => {
      const Le = String(xe?.object?.userData?.originalUuid || xe?.uuid || "");
      !Le || J.has(Le) || (J.add(Le), x.push({ id: Le, name: String(xe?.name || Le) }));
    }), x;
  }, [R]), {
    clashResults: lt,
    clashRunning: or,
    clashProgress: sr,
    clashStatus: lr,
    clashScannedCount: cr,
    clashSetA: ur,
    clashSetB: dr,
    clashTolerance: hr,
    clashMinOverlapVolume: pr,
    clashClearanceDistance: mr,
    clashUseNarrowPhase: fr,
    clashUseTrianglePhase: _r,
    clashIncludeSameModel: gr,
    clashPairsScanned: yr,
    clashResultFilter: br,
    clashTypeFilter: vr,
    setClashSetA: Gt,
    setClashSetB: Wt,
    setClashTolerance: wr,
    setClashMinOverlapVolume: xr,
    setClashClearanceDistance: Cr,
    setClashUseNarrowPhase: Nr,
    setClashUseTrianglePhase: Sr,
    setClashIncludeSameModel: kr,
    setClashResultFilter: Mr,
    setClashTypeFilter: Lr,
    handleRunClashCheck: Er,
    handleCancelClashCheck: Ir,
    handleClearClashResults: Kt,
    handleFocusClashResult: Dr,
    handleUpdateClashResultStatus: Ar,
    handleMarkFilteredClashStatus: zr,
    handleExportClashCsv: Br,
    resetClashState: $r,
    applyClashModelOptionBounds: Nn
  } = Zo({
    sceneMgrRef: me,
    treeRoot: R,
    clashModelOptions: At,
    selectedUuids: C,
    setSelectedUuids: B,
    focusObjectsInView: ft,
    t: y
  }), Sn = Jo(me, lt), kn = ue(/* @__PURE__ */ new Set()), Mn = ue("");
  ce(() => {
    Mn.current = he;
  }, [he]);
  const [Xt, Yt] = V({ isOpen: !1, title: "", message: "" }), [_t, Ze] = V(null), { onManagerChunkProgress: Ln } = co({
    fileSetIdRef: Mn,
    completedFileSetsRef: kn,
    onProgress: fe,
    onCompleted: () => {
      Ze({ message: y("all_chunks_loaded"), type: "success" }), fe({ loaded: 0, total: 0 });
    }
  }), Vr = j((x, J) => {
    Ln(x, J);
  }, [Ln]);
  Co({
    mgrInstance: z,
    showStats: Re,
    setStats: Z
  }), ce(() => {
    Nn();
  }, [Nn]);
  const qt = ue(() => {
  });
  ce(() => {
    k === Lt(s === "zh" ? "en" : "zh", "ready") && U(Lt(s, "ready"));
  }, [s]);
  const En = (x) => x >= 1e6 ? (x / 1e6).toFixed(2) + "M" : x >= 1e3 ? (x / 1e3).toFixed(1) + "K" : x.toString(), Pr = (x) => x >= 1024 ? (x / 1024).toFixed(2) + " GB" : x.toFixed(1) + " MB";
  function Fr(x) {
    const J = {};
    return x.visibility && (J.hiddenUuids = Array.from(zt), J.isolatedUuids = Array.from(Bt)), x.selection && (J.selectedUuids = [...C]), x.clip && (J.clip = {
      enabled: le,
      values: {
        x: [...Ne.x],
        y: [...Ne.y],
        z: [...Ne.z]
      },
      active: { ...Be },
      helperVisible: $e,
      helperOpacity: je
    }), x.explode && (J.explode = {
      enabled: ne,
      strength: W,
      mode: pe
    }), J;
  }
  async function Or(x) {
    const J = me.current;
    if (!(!J || !x)) {
      if (qt.current?.(), J.clearLocateFocus(), x.clip && (we(x.clip.enabled), De(x.clip.values), Se(x.clip.active), We(x.clip.helperVisible), Ae(x.clip.helperOpacity)), x.explode && (se(x.explode.enabled), Y(x.explode.strength), re(x.explode.mode)), x.hiddenUuids !== void 0 || x.isolatedUuids !== void 0) {
        J.setAllVisibility(!0);
        const xe = x.hiddenUuids || [], Le = x.isolatedUuids || [];
        Le.length > 0 ? (J.isolateObjects(Le), St(/* @__PURE__ */ new Set()), kt(new Set(Le))) : (xe.forEach((Xe) => J.setObjectVisibility(Xe, !1)), St(new Set(xe)), kt(/* @__PURE__ */ new Set())), nt();
      }
      if (x.selectedUuids !== void 0 && (B(x.selectedUuids), M(null), J.highlightObjects(x.selectedUuids), x.selectedUuids.length === 1)) {
        const xe = J.contentGroup.getObjectByProperty("uuid", x.selectedUuids[0]);
        xe && await $t(xe);
      }
      queueMicrotask(() => {
        J.invalidateRender?.({ needsCulling: !0 }), requestAnimationFrame(() => J.invalidateRender?.({ needsCulling: !0 }));
      });
    }
  }
  const {
    viewpoints: Tr,
    handleSaveViewpoint: Rr,
    handleUpdateViewpointName: Ur,
    handleLoadViewpoint: jr,
    handleOverwriteViewpoint: Hr,
    handleDeleteViewpoint: Gr
  } = Ho({
    currentFileSetId: he,
    sceneMgrRef: me,
    setToast: Ze,
    setConfirmState: tt,
    t: y,
    captureStateSnapshot: Fr,
    restoreStateSnapshot: Or
  });
  ce(() => {
    z && requestAnimationFrame(() => {
      z.resize();
    });
  }, [z, ot, ye, xn, Cn]), ce(() => {
    if (_t) {
      const x = setTimeout(() => {
        Ze(null);
      }, 3e3);
      return () => clearTimeout(x);
    }
  }, [_t]);
  const nt = j(() => {
    if (!me.current) return;
    const x = me.current.structureRoot;
    if (!x) {
      ee([]);
      return;
    }
    const J = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), Le = (Ue) => {
      const Ye = (Ue || []).slice();
      for (; Ye.length; ) {
        const Te = Ye.pop();
        if (Te && (typeof Te.uuid == "string" && (J.set(Te.uuid, !!Te.expanded), xe.set(Te.uuid, Te.childrenLoaded !== !1)), Array.isArray(Te.children) && Te.children.length))
          for (const Mt of Te.children)
            Ye.push(Mt);
      }
    }, Xe = (Ue, Ye = 0, Te = !1, Mt = !1) => {
      const Jt = Ue.id, zn = Array.isArray(Ue.children) ? Ue.children : [], Ma = zn.length > 0, Bn = Mt || xe.get(Jt) === !0;
      return {
        uuid: Jt,
        name: Ue.name,
        type: Ue.type === "Mesh" ? "MESH" : "GROUP",
        depth: Ye,
        children: Bn ? zn.map((La) => Xe(La, Ye + 1, !1, !1)) : [],
        expanded: J.get(Jt) ?? !1,
        visible: Ue.visible !== !1,
        object: Ue,
        isFileNode: Te,
        hasChildren: Ma,
        childrenLoaded: Bn
      };
    };
    ee((Ue) => {
      Le(Ue);
      const Ye = [];
      return (x.children || []).forEach((Te) => {
        Te.name === "ImportedModels" || Te.name === "Tilesets" ? (Te.children || []).forEach((Mt) => {
          Ye.push(Xe(Mt, 0, !0, !0));
        }) : Ye.push(Xe(Te, 0, !0, !0));
      }), Ye;
    });
  }, []), {
    contextMenu: Qt,
    hiddenUuids: zt,
    isolatedUuids: Bt,
    setHiddenUuids: St,
    setIsolatedUuids: kt,
    handleContextMenu: Wr,
    closeContextMenu: Kr,
    handleHideSelected: Xr,
    handleShowAll: gt,
    handleToggleVisibility: Yr,
    handleHideObject: qr,
    handleIsolateObject: Qr,
    handleIsolateSelection: Zr,
    handleUndoVisibility: Jr
  } = jo({
    sceneMgrRef: me,
    selectedUuids: C,
    setSelectedUuids: B,
    setSelectedProps: M,
    updateTree: nt,
    resetLocateState: () => qt.current()
  });
  Nt.current = (x) => {
    if (!Me.locateIsolateMode) return;
    const J = Array.from(new Set((x || []).map((xe) => String(xe || "").trim()).filter(Boolean)));
    J.length !== 0 && (St((xe) => xe.size === 0 ? xe : /* @__PURE__ */ new Set()), kt((xe) => xe.size === J.length && J.every((Le) => xe.has(Le)) ? xe : new Set(J)));
  };
  const ea = (x) => {
    if (!me.current) return;
    const J = me.current.contentGroup.getObjectByProperty("uuid", x), xe = me.current.getStructureNodes(x);
    if (J || xe) {
      const Le = J?.name || xe?.[0]?.name || "Item";
      tt({
        isOpen: !0,
        title: y("delete_item"),
        message: `${y("confirm_delete")} "${Le}"?`,
        action: async () => {
          de(!0), U(y("delete_item") + "...");
          try {
            await me.current?.removeModel(x), B((Xe) => {
              const Ue = Xe.filter((Ye) => Ye !== x);
              return me.current?.highlightObjects(Ue), Ue.length === 0 && M(null), Ue;
            }), nt(), U(y("ready")), Ze({ message: y("success"), type: "success" });
          } catch (Xe) {
            console.error("删除对象失败:", Xe), Ze({ message: y("failed") + ": " + (Xe instanceof Error ? Xe.message : String(Xe)), type: "error" });
          } finally {
            de(!1);
          }
        }
      });
    }
  }, In = () => {
    S(), M(null), me.current?.highlightObjects([]), me.current?.invalidateRender?.({ needsCulling: !0 });
  };
  ce(() => {
    if (!pt.current) return;
    const x = new Ba(pt.current, {
      performancePreset: b,
      chunkOptions: g
    });
    return me.current = x, F(x), d && d(x), x.updateSettings(Me), requestAnimationFrame(() => {
      x.resize();
    }), x.onChunkProgress = Vr, x.onMeasureUpdate = be, x.onStructureUpdate = () => {
      nt();
    }, () => {
      x.dispose();
    };
  }, []), ce(() => {
    if (!z || !p) return;
    (async () => {
      const J = Array.isArray(p) ? p : [p];
      console.log("[ThreeViewer] loadInitial with items:", J), await Zt(J);
    })();
  }, [z, p]);
  const ta = (x) => {
    const J = {
      ...Me,
      ...x
    };
    Oe(J), me.current && me.current.updateSettings(J);
  }, {
    locatedUuid: na,
    locateResultUuids: ra,
    resetLocateState: Dn,
    handleSelect: $t,
    handleLocateObject: aa,
    handleLocateResultsChange: ia,
    handleClearLocate: oa
  } = zo({
    sceneMgrRef: me,
    selectedUuids: C,
    setSelectedUuids: B,
    setSelectedProps: M,
    setHiddenUuids: St,
    setIsolatedUuids: kt,
    updateTree: nt,
    propOnSelect: l,
    ifcPropertyCacheRef: Dt,
    clashSummaryByUuid: Sn,
    focusObjectsInView: ft,
    t: y,
    isDev: Wn
  });
  qt.current = Dn;
  const {
    searchConditions: sa,
    setSearchConditions: la,
    searchResults: Vt,
    searching: ca,
    searchProgress: ua,
    searchStatus: da,
    propertyFieldOptions: ha,
    handleRunPropertySearch: pa,
    handleApplySearchResultHighlight: ma,
    handleClearSearchResult: Pt,
    handleCancelSearch: fa
  } = Wo({
    sceneMgrRef: me,
    selectedUuids: C,
    setSelectedUuids: B,
    onSelectObject: $t,
    focusObjectsInView: ft,
    t: y,
    setToast: Ze
  }), An = Ie(() => {
    const x = [];
    return Ce !== "none" && x.push({
      key: "measure",
      label: y("mode_measure"),
      onClear: () => {
        ke("none"), v("none"), me.current?.clearMeasurementPreview();
      }
    }), le && x.push({
      key: "clip",
      label: y("mode_clip"),
      onClear: () => {
        we(!1), v("none");
      }
    }), Vt.length > 0 && x.push({
      key: "search",
      label: `${y("mode_search")} ${Vt.length}`,
      onClear: Pt
    }), zt.size > 0 && x.push({
      key: "hidden",
      label: `${y("mode_hidden")} ${zt.size}`,
      onClear: gt,
      clearLabel: y("mode_restore_visibility") || y("mode_clear")
    }), Bt.size > 0 && x.push({
      key: "isolated",
      label: `${y("mode_isolated")} ${Bt.size}`,
      onClear: gt,
      clearLabel: y("mode_restore_visibility") || y("mode_clear")
    }), A === "boxSelect" && x.push({
      key: "boxSelect",
      label: y("mode_box_select"),
      onClear: () => v("none")
    }), lt.length > 0 && x.push({
      key: "clash",
      label: `${y("mode_clash")} ${lt.length}`,
      onClear: Kt
    }), x;
  }, [
    A,
    lt.length,
    le,
    Kt,
    Pt,
    gt,
    zt.size,
    Bt.size,
    Ce,
    Vt.length,
    y
  ]), _a = j((x) => {
    if (!me.current) return;
    const J = Array.from(new Set(
      lt.filter((xe) => xe.status === x).flatMap((xe) => [xe.aUuid, xe.bUuid]).filter(Boolean)
    ));
    J.length !== 0 && (me.current.clearLocateFocus(), me.current.isolateObjects(J), St(/* @__PURE__ */ new Set()), kt(new Set(J)), nt(), me.current.fitViewToObjects(J));
  }, [lt, nt]), { processFiles: Zt, loadItemsIntoScene: ga } = xo({
    managerRef: me,
    sceneSettings: Me,
    libPath: r,
    t: y,
    setCurrentFileSetId: Q,
    setLoading: de,
    setStatus: U,
    setProgress: T,
    setToast: Ze,
    updateTree: nt
  });
  Go({
    allowDragOpen: e,
    mgrInstance: z,
    viewportRef: mt,
    t: y,
    processFiles: Zt,
    setToast: Ze,
    setErrorState: Yt
  });
  const {
    getDefaultExportFileName: ya,
    handleExport: ba,
    handleClear: va,
    handleScreenshot: wa
  } = Bo({
    sceneMgrRef: me,
    t: y,
    setLoading: de,
    setProgress: T,
    setStatus: U,
    setToast: Ze,
    setActiveTool: v,
    setConfirmState: tt,
    setSelectedUuids: B,
    setSelectedProps: M,
    setChunkProgress: fe,
    resetLocateState: Dn,
    clearSearchResult: Pt,
    resetClashState: $r,
    resetMeasurementState: _e,
    resetExplodeState: te,
    updateTree: nt,
    ifcPropertyCacheRef: Dt,
    completedFileSetsRef: kn
  }), {
    handleOpenFiles: xa,
    handleBatchConvert: Ca,
    handleOpenUrl: Na,
    handleDragOver: Sa,
    handleDrop: ka
  } = Po({
    sceneMgrRef: me,
    t: y,
    processFiles: Zt,
    loadItemsIntoScene: ga,
    setLoading: de,
    setStatus: U,
    setProgress: T,
    setToast: Ze,
    setActiveTool: v,
    setSelectedUuids: B,
    setSelectedProps: M,
    resetMeasurementState: _e,
    updateTree: nt,
    isDev: Wn
  });
  return $o({
    sceneMgrRef: me,
    canvasRef: pt,
    activeTool: A,
    setActiveTool: v,
    measureType: Ce,
    setMeasureType: ke,
    pickEnabled: ze,
    selectedUuids: C,
    setSelectedUuids: B,
    setSelectedProps: M,
    setMousePos: $,
    setHighlightedMeasureId: D,
    handleSelect: $t,
    handleContextMenu: Wr,
    handleUndoVisibility: Jr,
    clearSelectionState: In
  }), /* @__PURE__ */ t(lo, { t: y, theme: w, children: /* @__PURE__ */ c(
    "div",
    {
      className: "ui-container ui-app-shell font-medium",
      onDragOver: Sa,
      onDrop: ka,
      children: [
        /* @__PURE__ */ t(
          wi,
          {
            t: y,
            handleOpenFiles: xa,
            handleBatchConvert: Ca,
            handleOpenUrl: Na,
            handleView: (x) => {
              me.current?.setView(x);
            },
            handleClear: va,
            openScreenshotPanel: () => v("screenshot"),
            handleDisplayModeChange: (x) => {
              me.current && (q(x), me.current.contentGroup.traverse((J) => {
                J.isMesh && J.material && (Array.isArray(J.material) ? J.material : [J.material]).forEach((Le) => {
                  x === "transparent" ? (Le.wireframe = !1, Le.transparent = !0, Le.opacity = 0.5) : (Le.wireframe = !1, Le.transparent = !1, Le.opacity = 1);
                });
              }), me.current.requestRender());
            },
            displayMode: H,
            pickEnabled: ze,
            setPickEnabled: rt,
            activeTool: A,
            setActiveTool: v,
            showOutline: ot,
            setShowOutline: ae,
            showProps: ye,
            setShowProps: Fe,
            showStats: Re,
            setShowStats: at,
            sceneMgr: me.current,
            theme: w,
            hiddenMenus: n,
            onOpenAbout: () => Ct(!0),
            hasModels: ir
          }
        ),
        /* @__PURE__ */ c("div", { className: "ui-main-layout", children: [
          ot && /* @__PURE__ */ c("div", { className: "ui-sidebar ui-sidebar-left", style: { width: `${xn}px` }, children: [
            /* @__PURE__ */ c("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: y("interface_outline") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => ae(!1),
                  children: /* @__PURE__ */ t(ut, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(
              Ii,
              {
                t: y,
                treeRoot: R,
                setTreeRoot: ee,
                selectedUuid: I,
                locatedUuid: na,
                onSelect: (x, J) => $t(J, null, !1, !0),
                onToggleVisibility: Yr,
                onDelete: (x) => {
                  const J = x?.uuid || x?.id;
                  J && ea(J);
                },
                onHide: qr,
                onIsolate: Qr,
                onShowAll: gt,
                onLocate: aa,
                onClearLocate: oa,
                onLocateResultsChange: ia,
                locateResultUuids: ra,
                clashSummaryByUuid: Sn
              }
            ) }),
            /* @__PURE__ */ t(
              "div",
              {
                className: "ui-sidebar-resize ui-sidebar-resize-left",
                onMouseDown: () => rr.current = !0
              }
            )
          ] }),
          /* @__PURE__ */ c("div", { ref: mt, className: "ui-viewport-shell", style: { backgroundColor: w.canvasBg }, children: [
            /* @__PURE__ */ t("canvas", { ref: pt, className: "ui-viewport-canvas" }),
            /* @__PURE__ */ t(so, { sceneMgr: z, theme: w, lang: s }),
            Qt.visible && /* @__PURE__ */ t(
              wn,
              {
                x: Qt.x,
                y: Qt.y,
                items: [
                  {
                    label: y("hide_selected"),
                    onClick: Xr,
                    disabled: C.length === 0
                  },
                  {
                    label: y("isolate_selection"),
                    onClick: Zr,
                    disabled: C.length === 0
                  },
                  {
                    label: y("clear_selection"),
                    onClick: In,
                    disabled: C.length === 0
                  },
                  {
                    label: y("show_all"),
                    onClick: gt
                  }
                ],
                onClose: Kr,
                theme: w
              }
            ),
            _t && /* @__PURE__ */ c("div", { className: "ui-toast", children: [
              /* @__PURE__ */ t("div", { className: `ui-toast-dot ${_t.type === "error" ? "ui-toast-dot-error" : _t.type === "success" ? "ui-toast-dot-success" : "ui-toast-dot-info"}` }),
              /* @__PURE__ */ t("span", { className: "ui-toast-message", children: _t.message }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-toast-close",
                  onClick: () => Ze(null),
                  children: /* @__PURE__ */ t(ut, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ t(qi, { t: y, loading: O, status: k, progress: K, theme: w }),
            A === "measure" && /* @__PURE__ */ t(
              Vi,
              {
                t: y,
                sceneMgr: me.current,
                measureType: Ce,
                setMeasureType: ke,
                measureHistory: Ge,
                highlightedId: oe,
                onHighlight: (x) => {
                  D(x), me.current?.highlightMeasurement(x), x && me.current?.locateMeasurement(x);
                },
                onDelete: (x) => {
                  me.current?.removeMeasurement(x), G((J) => J.filter((xe) => xe.id !== x)), oe === x && (D(null), me.current?.highlightMeasurement(null));
                },
                onClear: () => {
                  me.current?.clearAllMeasurements(), _e();
                },
                onClose: () => v("none"),
                theme: w
              }
            ),
            A === "clip" && /* @__PURE__ */ t(
              Pi,
              {
                t: y,
                sceneMgr: me.current,
                onClose: () => v("none"),
                clipEnabled: le,
                setClipEnabled: we,
                clipValues: Ne,
                setClipValues: De,
                clipActive: Be,
                setClipActive: Se,
                clipHelperVisible: $e,
                setClipHelperVisible: We,
                clipHelperOpacity: je,
                setClipHelperOpacity: Ae,
                theme: w
              }
            ),
            A === "export" && /* @__PURE__ */ t(
              Fi,
              {
                t: y,
                onClose: () => v("none"),
                onExport: ba,
                getDefaultFileName: ya,
                theme: w
              }
            ),
            A === "screenshot" && /* @__PURE__ */ t(
              Oi,
              {
                t: y,
                onClose: () => v("none"),
                onCapture: (x) => {
                  wa(x), v("none");
                },
                theme: w
              }
            ),
            A === "settings" && /* @__PURE__ */ t(
              Di,
              {
                t: y,
                onClose: () => v("none"),
                settings: Me,
                onUpdate: ta,
                currentLang: s,
                setLang: f,
                showStats: Re,
                setShowStats: at,
                theme: w
              }
            ),
            A === "viewpoint" && /* @__PURE__ */ t(
              Ri,
              {
                t: y,
                viewpoints: Tr,
                onSave: Rr,
                onUpdateName: Ur,
                onLoad: jr,
                onDelete: Gr,
                onOverwrite: Hr,
                onClose: () => v("none"),
                theme: w
              }
            ),
            A === "search" && /* @__PURE__ */ t(
              Gi,
              {
                t: y,
                onClose: () => v("none"),
                conditions: sa,
                results: Vt,
                searching: ca,
                searchProgress: ua,
                searchStatus: da,
                propertyFieldOptions: ha,
                onConditionsChange: la,
                onSearch: () => void pa(),
                onCancelSearch: fa,
                onApplyResultHighlight: ma,
                onClearResult: Pt,
                theme: w
              }
            ),
            A === "clash" && /* @__PURE__ */ t(
              Yi,
              {
                t: y,
                onClose: () => v("none"),
                running: or,
                progress: sr,
                status: lr,
                scannedCount: cr,
                pairsScanned: yr,
                results: lt,
                resultFilter: br,
                modelOptions: At,
                setA: ur,
                setB: dr,
                tolerance: hr,
                minOverlapVolume: pr,
                clearanceDistance: mr,
                useNarrowPhase: fr,
                useTrianglePhase: _r,
                includeSameModel: gr,
                onSetAChange: Gt,
                onSetBChange: Wt,
                onToleranceChange: wr,
                onMinOverlapVolumeChange: xr,
                onClearanceDistanceChange: Cr,
                onUseNarrowPhaseChange: Nr,
                onUseTrianglePhaseChange: Sr,
                onIncludeSameModelChange: kr,
                onRun: () => void Er(),
                onCancel: Ir,
                onClear: Kt,
                onExportCsv: Br,
                onIsolateByStatus: _a,
                onRestoreVisibility: gt,
                onResultFilterChange: Mr,
                typeFilter: vr,
                onTypeFilterChange: Lr,
                onUpdateResultStatus: Ar,
                onMarkFilteredStatus: zr,
                onSetASelectAll: () => Gt(At.map((x) => x.id)),
                onSetAClear: () => Gt([]),
                onSetBSelectAll: () => Wt(At.map((x) => x.id)),
                onSetBClear: () => Wt([]),
                onFocusResult: Dr,
                theme: w
              }
            ),
            A === "explode" && /* @__PURE__ */ t(
              Ui,
              {
                t: y,
                onClose: () => v("none"),
                enabled: ne,
                strength: W,
                mode: pe,
                onEnabledChange: se,
                onStrengthChange: Y,
                onModeChange: re,
                onReset: () => {
                  te(), me.current?.resetExplode();
                },
                theme: w
              }
            )
          ] }),
          ye && /* @__PURE__ */ c("div", { className: "ui-sidebar ui-sidebar-right", style: { width: `${Cn}px` }, children: [
            /* @__PURE__ */ c("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: y("interface_props") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => Fe(!1),
                  children: /* @__PURE__ */ t(ut, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(ao, { t: y, selectedProps: L, theme: w }) }),
            /* @__PURE__ */ t(
              "div",
              {
                onMouseDown: () => ar.current = !0,
                className: "ui-sidebar-resize ui-sidebar-resize-right"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-statusbar", children: [
          /* @__PURE__ */ c("div", { className: "ui-statusbar-left", children: [
            /* @__PURE__ */ t("span", { children: k }),
            O && /* @__PURE__ */ c("span", { children: [
              K,
              "%"
            ] }),
            I && C.length > 1 && /* @__PURE__ */ c("span", { className: "ui-statusbar-meta", children: [
              y("selected_count"),
              ": ",
              C.length
            ] }),
            ie.total > 0 && ie.loaded < ie.total && /* @__PURE__ */ c("div", { className: "ui-chunk-progress", children: [
              /* @__PURE__ */ c("span", { children: [
                y("chunk_loading"),
                ": ",
                ie.loaded,
                "/",
                ie.total
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-compact", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "ui-progress-fill",
                  style: { width: `${ie.loaded / ie.total * 100}%` }
                }
              ) })
            ] }),
            An.length > 0 && /* @__PURE__ */ t("div", { className: "ui-mode-tray", children: An.map((x) => /* @__PURE__ */ c("div", { className: "ui-mode-pill", children: [
              /* @__PURE__ */ t("span", { children: x.label }),
              /* @__PURE__ */ t("button", { onClick: x.onClear, children: x.clearLabel || y("mode_clear") })
            ] }, x.key)) })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-statusbar-right", children: [
            P && /* @__PURE__ */ c("div", { className: "ui-statusbar-coords", children: [
              P.x.toFixed(2),
              ", ",
              P.y.toFixed(2),
              ", ",
              P.z.toFixed(2)
            ] }),
            /* @__PURE__ */ c("div", { className: "ui-tips", children: [
              /* @__PURE__ */ t("span", { children: y("tips_rotate") }),
              /* @__PURE__ */ t("span", { className: "ui-tips-separator", children: "|" }),
              /* @__PURE__ */ t("span", { children: y("tips_pan") }),
              /* @__PURE__ */ t("span", { className: "ui-tips-separator", children: "|" }),
              /* @__PURE__ */ t("span", { children: y("tips_zoom") })
            ] }),
            Re && /* @__PURE__ */ c("div", { className: "ui-stats-group", children: [
              /* @__PURE__ */ c("div", { className: "ui-stats-item", title: y("stats_original_meshes"), children: [
                /* @__PURE__ */ t(Kn, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: En(X.meshes) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-stats-item", title: y("stats_triangles"), children: [
                /* @__PURE__ */ t(ai, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: En(X.faces) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-stats-item", children: [
                /* @__PURE__ */ t(ei, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: Pr(X.memory) })
              ] }),
              X.chunksTotal > 0 && /* @__PURE__ */ c("div", { className: "ui-statusbar-metric", title: y("stats_chunks"), children: [
                "CH ",
                X.chunksLoaded,
                "/",
                X.chunksTotal
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-statusbar-metric", title: y("stats_pixel_ratio"), children: [
                "DPR ",
                X.pixelRatio
              ] })
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-statusbar-tag ui-statusbar-tag-compact",
                onClick: () => f(s === "zh" ? "en" : "zh"),
                children: s === "zh" ? "EN" : "中文"
              }
            ),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t("div", { className: "ui-statusbar-tag ui-statusbar-tag-compact ui-statusbar-brand", children: /* @__PURE__ */ t("span", { className: "ui-statusbar-brand-label", children: "3D BROWSER" }) })
          ] })
        ] }),
        /* @__PURE__ */ t(
          io,
          {
            isOpen: Ke.isOpen,
            title: Ke.title,
            message: Ke.message,
            onConfirm: () => {
              Ke.action(), tt({ ...Ke, isOpen: !1 });
            },
            onCancel: () => tt({ ...Ke, isOpen: !1 }),
            t: y,
            theme: w
          }
        ),
        /* @__PURE__ */ t(
          oo,
          {
            isOpen: xt,
            onClose: () => Ct(!1),
            t: y,
            theme: w
          }
        ),
        Xt.isOpen && /* @__PURE__ */ t("div", { className: "ui-error-overlay", children: /* @__PURE__ */ c("div", { className: "ui-error-content ui-error-content-wide", children: [
          /* @__PURE__ */ c("div", { className: "ui-error-header ui-error-header-danger", children: [
            /* @__PURE__ */ t("span", { children: Xt.title }),
            /* @__PURE__ */ t(
              "div",
              {
                onClick: () => Yt((x) => ({ ...x, isOpen: !1 })),
                className: "ui-error-close",
                children: /* @__PURE__ */ t(ut, { width: 18, height: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-error-body", children: [
            /* @__PURE__ */ t("div", { className: "ui-error-message", children: Xt.message }),
            /* @__PURE__ */ t("div", { className: "ui-error-actions", children: /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-primary ui-btn-modal-confirm",
                onClick: () => Yt((x) => ({ ...x, isOpen: !1 })),
                children: y("confirm")
              }
            ) })
          ] })
        ] }) })
      ]
    }
  ) });
};
export {
  ss as DEFAULT_FONT,
  Ba as SceneManager,
  us as ThreeViewer,
  ls as colors,
  Lt as getTranslation,
  bo as loadModelFiles,
  cs as resolveThemeColors,
  yn as themes
};
