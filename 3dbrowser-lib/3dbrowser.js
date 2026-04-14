import { jsx as t, jsxs as l, Fragment as ne } from "react/jsx-runtime";
import jt, { useState as I, useEffect as Q, useRef as q, useCallback as R, useMemo as Ee, Component as li } from "react";
import { s as gn, a as Ut, e as ci, b as ui, S as di } from "./utils-6y_dwJDR.js";
import * as M from "three";
import { OBB as hi } from "three/examples/jsm/math/OBB.js";
const Zt = {
  light: {
    bg: "#F8FAFF",
    panelBg: "#FFFFFF",
    headerBg: "#E0E2EC",
    border: "#d2d2d2",
    text: "#1C1B1F",
    textLight: "#000000",
    textMuted: "#49454F",
    accent: "#0c62a2",
    highlight: "#E0E2EC",
    itemHover: "rgba(12, 98, 162, 0.08)",
    success: "#217346",
    warning: "#CA8A04",
    danger: "#B3261E",
    canvasBg: "#FFFFFF",
    shadow: "rgba(0, 0, 0, 0.15)"
  }
}, pi = "'Roboto', 'Inter', 'Segoe UI', 'Microsoft YaHei', sans-serif", So = Zt.light;
function $e(e) {
  return typeof window > "u" ? "" : getComputedStyle(document.documentElement).getPropertyValue(e).trim();
}
function ko() {
  const e = Zt.light, n = {
    bg: $e("--bg-primary"),
    panelBg: $e("--bg-panel"),
    headerBg: $e("--bg-header"),
    border: $e("--border-color"),
    text: $e("--text-primary"),
    textLight: "#000000",
    textMuted: $e("--text-muted"),
    accent: $e("--accent"),
    highlight: $e("--bg-selected"),
    itemHover: $e("--bg-hover"),
    success: $e("--success"),
    warning: $e("--warning"),
    danger: $e("--error"),
    canvasBg: $e("--bg-canvas"),
    shadow: $e("--shadow-md")
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
const mi = {
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
    processing: "Processing",
    no_selection: "No selection",
    no_models: "No model loaded",
    no_measurements: "No measurements",
    search_nodes: "Search nodes...",
    search_props: "Search properties...",
    copy_all_props: "Copy All",
    copy_group_props: "Copy Group",
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
    ctx_show_all: "Show All",
    hide_selected: "Hide Selected",
    show_all: "Show All",
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
    st_highlight_box: "Show Bounding Box",
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
    processing: "处理中",
    no_selection: "未选择对象",
    no_models: "未加载模型",
    no_measurements: "无测量结果",
    search_nodes: "搜索节点...",
    search_props: "搜索属性...",
    copy_all_props: "复制全部",
    copy_group_props: "复制组",
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
    ctx_show_all: "显示所有",
    hide_selected: "隐藏选中",
    show_all: "显示全部",
    ctx_hide_selection: "隐藏选择",
    monitor_meshes: "网格",
    monitor_faces: "面",
    monitor_mem: "显存",
    monitor_calls: "绘制",
    selected_count: "已选择",
    tips_rotate: "左键旋转",
    tips_pan: "中键平移",
    tips_zoom: "滚轮缩放",
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
    st_highlight_box: "显示包围盒",
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
    stats_original_meshes: "原始网格",
    stats_triangles: "三角面",
    stats_chunks: "分片",
    stats_pixel_ratio: "像素比",
    confirm: "确定",
    writing: "正在写入文件..."
  }
}, bt = (e, n) => mi[e][n] || n, yn = 24, fi = 1.5, ae = (e, n = {}) => {
  const { size: r, color: a, ...i } = n;
  return /* @__PURE__ */ t(
    "svg",
    {
      width: r || yn,
      height: r || yn,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: a || "currentColor",
      strokeWidth: fi,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...i,
      children: e
    }
  );
}, en = (e) => ae(/* @__PURE__ */ t("polyline", { points: "9 18 15 12 9 6" }), e), _i = (e) => ae(/* @__PURE__ */ t("polyline", { points: "15 18 9 12 15 6" }), e), tn = (e) => ae(/* @__PURE__ */ t("polyline", { points: "6 9 12 15 18 9" }), e), gi = (e) => ae(/* @__PURE__ */ t("polyline", { points: "18 15 12 9 6 15" }), e), yi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "7" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "2.5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "2", x2: "12", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "19", x2: "12", y2: "22" }),
    /* @__PURE__ */ t("line", { x1: "2", y1: "12", x2: "5", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "12", x2: "22", y2: "12" })
  ] }),
  e
), bi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), ot = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ] }),
  e
), vi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ t("polyline", { points: "14 2 14 8 20 8" })
  ] }),
  e
), wi = (e) => ae(
  /* @__PURE__ */ t(ne, { children: /* @__PURE__ */ t("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" }) }),
  e
), xi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("rect", { x: "2", y: "2", width: "20", height: "16", rx: "1" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "14", x2: "6", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "14", x2: "12", y2: "16" }),
    /* @__PURE__ */ t("line", { x1: "18", y1: "14", x2: "18", y2: "17" })
  ] }),
  e
), Ci = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("circle", { cx: "6", cy: "6", r: "3" }),
    /* @__PURE__ */ t("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ t("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
    /* @__PURE__ */ t("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
    /* @__PURE__ */ t("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
  ] }),
  e
), Ni = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ t("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ] }),
  e
), Si = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] }),
  e
), ki = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), Mi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" }),
    /* @__PURE__ */ t("path", { d: "M13 13l6 6" })
  ] }),
  e
), Mn = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    /* @__PURE__ */ t("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ] }),
  e
), Li = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] }),
  e
), Ei = (e) => ae(
  /* @__PURE__ */ t(ne, { children: /* @__PURE__ */ t("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) }),
  e
), zi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  e
), Di = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  e
), Vi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ t("line", { x1: "16.65", y1: "16.65", x2: "21", y2: "21" })
  ] }),
  e
), Ai = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] }),
  e
), Bi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ t("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ t("polyline", { points: "21 15 16 10 5 21" })
  ] }),
  e
), Oi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
    /* @__PURE__ */ t("polyline", { points: "2 12 12 17 22 12" }),
    /* @__PURE__ */ t("polyline", { points: "2 17 12 22 22 17" })
  ] }),
  e
), Pi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
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
), Ii = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4z", fill: "none" }),
    /* @__PURE__ */ t("line", { x1: "7", y1: "5", x2: "17", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "5", y1: "7", x2: "5", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "17", y1: "19", x2: "7", y2: "19" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "17", x2: "19", y2: "7" })
  ] }),
  e
), $i = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Fi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,16 12,13 21,16 12,21", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Ti = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Ri = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), ji = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,3 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Ui = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,3 12,13 21,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Hi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
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
), Wi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
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
), Gi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
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
), Xi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
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
), Ki = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.35" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Yi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "none" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Qi = (e) => ae(
  /* @__PURE__ */ t(ne, { children: /* @__PURE__ */ t("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }),
  e
), qi = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ t("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  e
), bn = (e) => ae(
  /* @__PURE__ */ l(ne, { children: [
    /* @__PURE__ */ t("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    /* @__PURE__ */ t("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
  ] }),
  e
), Ve = ({
  icon: e,
  label: n,
  active: r,
  theme: a,
  style: i,
  className: s = "",
  disabled: d,
  ...c
}) => /* @__PURE__ */ l(
  "button",
  {
    style: { opacity: d ? 0.4 : 1, cursor: d ? "not-allowed" : "pointer", ...i },
    className: `ui-toolbar-btn ${r ? "active" : ""} ${s}`,
    disabled: d,
    ...c,
    children: [
      /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-icon", children: e }),
      n && /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-label", children: n })
    ]
  }
), Ji = (e) => {
  const {
    t: n,
    theme: r,
    hiddenMenus: a = []
  } = e, i = (m) => (a || []).includes(m), s = jt.useRef(null), d = jt.useRef(null), [c, u] = I(null), h = jt.useRef(null);
  Q(() => {
    const m = (_) => {
      h.current && !h.current.contains(_.target) && u(null);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, []);
  const p = (m) => {
    u(c === m ? null : m);
  }, v = (m, _) => c !== m ? null : /* @__PURE__ */ t("div", { ref: h, className: "ui-toolbar-menu", children: _ }), f = (m, _, o) => /* @__PURE__ */ l(
    "div",
    {
      className: "ui-toolbar-menu-item",
      onClick: o,
      children: [
        /* @__PURE__ */ t("span", { className: "ui-toolbar-menu-icon", children: m }),
        _
      ]
    }
  ), b = () => /* @__PURE__ */ t("div", { className: "ui-toolbar-menu-divider" });
  return /* @__PURE__ */ l("div", { className: "ui-toolbar", children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "file",
        ref: s,
        style: { display: "none" },
        multiple: !0,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.nbim,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: e.handleOpenFiles
      }
    ),
    /* @__PURE__ */ t(
      "input",
      {
        type: "file",
        ref: d,
        style: { display: "none" },
        multiple: !0,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: e.handleBatchConvert
      }
    ),
    !i("file") && /* @__PURE__ */ t("div", { className: "ui-toolbar-group", children: /* @__PURE__ */ l("div", { className: "ui-toolbar-menu-anchor", children: [
      /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(vi, {}),
          label: n("tb_file"),
          active: c === "file",
          onClick: () => p("file"),
          theme: r
        }
      ),
      v("file", /* @__PURE__ */ l(ne, { children: [
        !i("open_file") && f(/* @__PURE__ */ t(Qi, {}), n("menu_open_file"), () => {
          s.current?.click(), u(null);
        }),
        !i("export") && f(/* @__PURE__ */ t(qi, {}), n("menu_export"), () => {
          e.setActiveTool?.("export"), u(null);
        }),
        !i("clear") && /* @__PURE__ */ l(ne, { children: [
          b(),
          f(/* @__PURE__ */ t(bi, {}), n("op_clear"), () => {
            e.handleClear?.(), u(null);
          })
        ] })
      ] }))
    ] }) }),
    !i("view") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(wi, {}),
          label: n("tb_fit"),
          onClick: () => e.sceneMgr?.fitView(),
          theme: r
        }
      ),
      /* @__PURE__ */ l("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Ve,
          {
            icon: /* @__PURE__ */ t(Di, {}),
            label: n("tb_view"),
            active: c === "views",
            onClick: () => p("views"),
            theme: r
          }
        ),
        v("views", /* @__PURE__ */ l(ne, { children: [
          f(/* @__PURE__ */ t(Ti, {}), n("view_front"), () => {
            e.handleView?.("front"), u(null);
          }),
          f(/* @__PURE__ */ t(Ri, {}), n("view_back"), () => {
            e.handleView?.("back"), u(null);
          }),
          f(/* @__PURE__ */ t($i, {}), n("view_top"), () => {
            e.handleView?.("top"), u(null);
          }),
          f(/* @__PURE__ */ t(Fi, {}), n("view_bottom"), () => {
            e.handleView?.("bottom"), u(null);
          }),
          f(/* @__PURE__ */ t(ji, {}), n("view_left"), () => {
            e.handleView?.("left"), u(null);
          }),
          f(/* @__PURE__ */ t(Ui, {}), n("view_right"), () => {
            e.handleView?.("right"), u(null);
          }),
          b(),
          f(/* @__PURE__ */ t(Wi, {}), n("view_se"), () => {
            e.handleView?.("se"), u(null);
          }),
          f(/* @__PURE__ */ t(Hi, {}), n("view_sw"), () => {
            e.handleView?.("sw"), u(null);
          }),
          f(/* @__PURE__ */ t(Gi, {}), n("view_ne"), () => {
            e.handleView?.("ne"), u(null);
          }),
          f(/* @__PURE__ */ t(Xi, {}), n("view_nw"), () => {
            e.handleView?.("nw"), u(null);
          })
        ] }))
      ] })
    ] }),
    !i("interface") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      !i("wireframe") && /* @__PURE__ */ l("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Ve,
          {
            icon: /* @__PURE__ */ t(Oi, {}),
            label: n("display_mode") || "样式",
            active: c === "displayMode",
            onClick: () => p("displayMode"),
            theme: r
          }
        ),
        v("displayMode", /* @__PURE__ */ l(ne, { children: [
          f(/* @__PURE__ */ t(Ki, {}), n("dm_solid") || "着色", () => {
            e.handleDisplayModeChange?.("solid"), u(null);
          }),
          f(/* @__PURE__ */ t(Yi, {}), n("dm_transparent") || "透明", () => {
            e.handleDisplayModeChange?.("transparent"), u(null);
          })
        ] }))
      ] }),
      !i("outline") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Mn, {}),
          label: n("tb_model"),
          active: e.showOutline,
          onClick: () => e.setShowOutline?.(!e.showOutline),
          theme: r
        }
      ),
      !i("props") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Li, {}),
          label: n("tb_props"),
          active: e.showProps,
          onClick: () => e.setShowProps?.(!e.showProps),
          theme: r
        }
      ),
      !i("pick") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Mi, {}),
          label: n("tb_pick"),
          active: e.pickEnabled,
          onClick: () => e.setPickEnabled?.(!e.pickEnabled),
          theme: r
        }
      )
    ] }),
    !i("tool") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      !i("measure") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(xi, {}),
          label: n("tb_measure"),
          active: e.activeTool === "measure",
          onClick: () => e.setActiveTool?.(e.activeTool === "measure" ? "none" : "measure"),
          theme: r
        }
      ),
      !i("boxSelect") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ii, {}),
          label: n("tb_boxSelect"),
          active: e.activeTool === "boxSelect",
          onClick: () => e.setActiveTool?.(e.activeTool === "boxSelect" ? "none" : "boxSelect"),
          theme: r
        }
      ),
      !i("clip") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ci, {}),
          label: n("tb_clip"),
          active: e.activeTool === "clip",
          onClick: () => e.setActiveTool?.(e.activeTool === "clip" ? "none" : "clip"),
          theme: r
        }
      ),
      !i("viewpoint") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(zi, {}),
          label: n("tb_view"),
          active: e.activeTool === "viewpoint",
          onClick: () => e.setActiveTool?.(e.activeTool === "viewpoint" ? "none" : "viewpoint"),
          theme: r
        }
      ),
      !i("screenshot") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Bi, {}),
          label: n("tb_screenshot") || "截图",
          active: e.activeTool === "screenshot",
          onClick: () => e.openScreenshotPanel?.(),
          theme: r
        }
      ),
      !i("search") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Vi, {}),
          label: n("tb_search") || "搜索",
          active: e.activeTool === "search",
          onClick: () => e.setActiveTool?.(e.activeTool === "search" ? "none" : "search"),
          theme: r
        }
      ),
      !i("clash") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(yi, {}),
          label: n("tb_clash") || "碰撞",
          active: e.activeTool === "clash",
          onClick: () => e.setActiveTool?.(e.activeTool === "clash" ? "none" : "clash"),
          theme: r
        }
      ),
      !i("explode") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Pi, {}),
          label: n("tb_explode") || "爆炸",
          active: e.activeTool === "explode",
          onClick: () => e.setActiveTool?.(e.activeTool === "explode" ? "none" : "explode"),
          theme: r
        }
      )
    ] }),
    !i("about") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      !i("settings") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ni, {}),
          label: n("tb_settings"),
          active: e.activeTool === "settings",
          onClick: () => e.setActiveTool?.(e.activeTool === "settings" ? "none" : "settings"),
          theme: r
        }
      ),
      /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Si, {}),
          label: n("tb_about"),
          onClick: () => e.onOpenAbout?.(),
          theme: r
        }
      )
    ] })
  ] });
}, Ae = ({
  children: e,
  variant: n = "default",
  size: r = "md",
  active: a,
  theme: i,
  style: s,
  className: d = "",
  ...c
}) => {
  let u = "ui-btn";
  return n === "primary" ? u += " ui-btn-primary" : n === "danger" ? u += " ui-btn-danger" : n === "ghost" ? u += " ui-btn-ghost" : u += " ui-btn-default", r === "sm" ? u += " ui-btn-sm" : r === "lg" ? u += " ui-btn-lg" : u += " ui-btn-md", a && (u += " active"), /* @__PURE__ */ t("button", { className: `${u} ${d}`, style: s, ...c, children: e });
}, ht = ({
  min: e,
  max: n,
  step: r = 1,
  value: a,
  onChange: i,
  theme: s,
  disabled: d = !1,
  style: c
}) => {
  const u = (a - e) / (n - e) * 100, h = q(null), p = R((f) => {
    if (!h.current) return a;
    const b = h.current.getBoundingClientRect(), m = Math.max(0, Math.min(1, (f - b.left) / b.width)), _ = e + m * (n - e);
    return Math.round(_ / r) * r;
  }, [e, n, r, a]), v = R((f) => {
    if (d) return;
    f.preventDefault();
    const b = p(f.clientX);
    i(Math.max(e, Math.min(n, b)));
    const m = (o) => {
      const y = p(o.clientX);
      i(Math.max(e, Math.min(n, y)));
    }, _ = () => {
      document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", _);
    };
    document.addEventListener("mousemove", m), document.addEventListener("mouseup", _);
  }, [p, i, e, n, d]);
  return /* @__PURE__ */ l(
    "div",
    {
      ref: h,
      className: `ui-slider ui-slider-control ${d ? "ui-slider-control-disabled" : "ui-slider-control-interactive"}`,
      style: {
        width: "100%",
        minWidth: 0,
        ...c
      },
      onMouseDown: v,
      children: [
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-track"
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-progress",
            style: {
              width: `${u}%`
            }
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${u}%`,
              cursor: d ? "not-allowed" : "default"
            }
          }
        )
      ]
    }
  );
}, Zi = ({
  min: e,
  max: n,
  value: r,
  onChange: a,
  theme: i,
  disabled: s = !1,
  style: d
}) => {
  const c = q(null), u = (r[0] - e) / (n - e) * 100, h = (r[1] - e) / (n - e) * 100, p = R((m) => {
    if (!c.current) return e;
    const _ = c.current.getBoundingClientRect(), o = Math.max(0, Math.min(1, (m - _.left) / _.width));
    return e + o * (n - e);
  }, [e, n]), v = R((m) => {
    if (s) return;
    m.preventDefault(), m.stopPropagation();
    const _ = (y) => {
      const C = p(y.clientX);
      a([Math.max(e, Math.min(r[1] - 1, Math.round(C))), r[1]]);
    }, o = () => {
      document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", o);
    };
    document.addEventListener("mousemove", _), document.addEventListener("mouseup", o);
  }, [s, p, a, e, r]), f = R((m) => {
    if (s) return;
    m.preventDefault(), m.stopPropagation();
    const _ = (y) => {
      const C = p(y.clientX);
      a([r[0], Math.min(n, Math.max(r[0] + 1, Math.round(C)))]);
    }, o = () => {
      document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", o);
    };
    document.addEventListener("mousemove", _), document.addEventListener("mouseup", o);
  }, [s, p, a, n, r]), b = R((m) => {
    if (s) return;
    m.preventDefault(), m.stopPropagation();
    const _ = p(m.clientX), o = Math.abs(_ - r[0]), y = Math.abs(_ - r[1]);
    o <= y ? a([Math.max(e, Math.min(r[1] - 1, Math.round(_))), r[1]]) : a([r[0], Math.min(n, Math.max(r[0] + 1, Math.round(_)))]);
  }, [s, p, a, e, n, r]);
  return /* @__PURE__ */ l(
    "div",
    {
      ref: c,
      className: "ui-slider",
      style: {
        opacity: s ? 0.5 : 1,
        width: "100%",
        minWidth: 0,
        flex: 1,
        height: "24px",
        position: "relative",
        cursor: s ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        ...d
      },
      onClick: b,
      children: [
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-track",
            style: {
              position: "absolute",
              width: "100%",
              height: "6px",
              backgroundColor: "var(--border-color)",
              borderRadius: "3px"
            }
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-progress",
            style: {
              position: "absolute",
              left: `${u}%`,
              width: `${h - u}%`,
              height: "6px",
              backgroundColor: "var(--accent)",
              borderRadius: "3px"
            }
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${u}%`,
              width: "16px",
              height: "16px",
              backgroundColor: "var(--bg-primary)",
              border: "2px solid var(--accent)",
              borderRadius: "50%",
              cursor: s ? "not-allowed" : "default",
              position: "absolute",
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              zIndex: 1
            },
            onMouseDown: v
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${h}%`,
              width: "16px",
              height: "16px",
              backgroundColor: "var(--bg-primary)",
              border: "2px solid var(--accent)",
              borderRadius: "50%",
              cursor: s ? "not-allowed" : "default",
              position: "absolute",
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              zIndex: 1
            },
            onMouseDown: f
          }
        )
      ]
    }
  );
}, mt = ({ checked: e, onChange: n, disabled: r = !1, className: a = "" }) => /* @__PURE__ */ t(
  "button",
  {
    className: `ui-switch ${e ? "active" : ""} ${r ? "disabled" : ""} ${a}`,
    onClick: () => !r && n(!e),
    role: "switch",
    "aria-checked": e,
    disabled: r,
    children: /* @__PURE__ */ t("div", { className: "ui-switch-thumb" })
  }
), qt = ({
  options: e,
  value: n,
  onChange: r,
  className: a = ""
}) => /* @__PURE__ */ t("div", { className: `ui-segmented ${a}`, children: e.map((i) => /* @__PURE__ */ l(
  "button",
  {
    className: `ui-segmented-item ${n === i.value ? "active" : ""}`,
    onClick: () => r(i.value),
    children: [
      i.icon && /* @__PURE__ */ t("span", { children: i.icon }),
      /* @__PURE__ */ t("span", { children: i.label })
    ]
  },
  i.value
)) }), ea = ({ value: e, onChange: n, style: r }) => /* @__PURE__ */ l("div", { className: "ui-color-picker", style: r, children: [
  /* @__PURE__ */ t(
    "input",
    {
      type: "color",
      value: e,
      onChange: (a) => n(a.target.value),
      className: "ui-color-picker-input"
    }
  ),
  /* @__PURE__ */ t("span", { className: "ui-color-picker-value", children: e })
] }), vt = ({ value: e, options: n, onChange: r, className: a = "", style: i, disabled: s }) => {
  const [d, c] = I(!1), u = q(null), h = n.find((p) => p.value === e) || n[0];
  return Q(() => {
    const p = (v) => {
      u.current && !u.current.contains(v.target) && c(!1);
    };
    return d && document.addEventListener("mousedown", p), () => {
      document.removeEventListener("mousedown", p);
    };
  }, [d]), /* @__PURE__ */ l(
    "div",
    {
      ref: u,
      className: `ui-select-custom ${d ? "open" : ""} ${s ? "disabled" : ""}`,
      style: i,
      children: [
        /* @__PURE__ */ l(
          "div",
          {
            className: `ui-select-selector ui-input ${a}`,
            onClick: () => !s && c(!d),
            children: [
              /* @__PURE__ */ t("span", { className: "ui-select-selection-item", children: h?.label }),
              /* @__PURE__ */ t("span", { className: "ui-select-arrow", children: /* @__PURE__ */ t("svg", { viewBox: "64 64 896 896", width: "12", height: "12", fill: "currentColor", children: /* @__PURE__ */ t("path", { d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" }) }) })
            ]
          }
        ),
        d && !s && /* @__PURE__ */ t("div", { className: "ui-select-dropdown", children: n.map((p) => /* @__PURE__ */ t(
          "div",
          {
            className: `ui-select-item ${p.value === e ? "selected" : ""}`,
            onClick: () => {
              r(p.value), c(!1);
            },
            children: p.label
          },
          p.value
        )) })
      ]
    }
  );
}, Ge = ({
  label: e,
  checked: n,
  onChange: r,
  disabled: a = !1,
  style: i,
  labelStyle: s
}) => /* @__PURE__ */ l(
  "label",
  {
    className: `ui-checkbox ${a ? "ui-checkbox-disabled" : ""}`,
    style: i,
    onClick: (d) => {
      a || (d.preventDefault(), r(!n));
    },
    children: [
      /* @__PURE__ */ t(
        "div",
        {
          className: `ui-checkbox-box ${n ? "ui-checkbox-box-checked" : ""}`,
          children: n && /* @__PURE__ */ t(
            "svg",
            {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "white",
              strokeWidth: "3",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "ui-checkbox-icon",
              children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" })
            }
          )
        }
      ),
      e && /* @__PURE__ */ t("span", { className: "ui-checkbox-label", style: s, children: e })
    ]
  }
), Ht = ({
  value: e,
  onChange: n,
  min: r,
  max: a,
  step: i = 1,
  unit: s,
  className: d = "",
  style: c,
  ...u
}) => {
  const [h, p] = I(() => String(e));
  Q(() => {
    p(String(e));
  }, [e]);
  const v = (o) => {
    let y = o;
    return r !== void 0 && (y = Math.max(r, y)), a !== void 0 && (y = Math.min(a, y)), y;
  }, f = (o) => {
    const y = o.target.value;
    if (p(y), y.trim() === "") return;
    const C = parseFloat(y);
    isNaN(C) || n(v(C));
  }, b = () => {
    if (h.trim() === "") {
      p(String(e));
      return;
    }
    const o = parseFloat(h);
    if (isNaN(o)) {
      p(String(e));
      return;
    }
    const y = v(o);
    p(String(y)), y !== e && n(y);
  }, m = () => {
    const o = v(e + i);
    p(String(o)), n(o);
  }, _ = () => {
    const o = v(e - i);
    p(String(o)), n(o);
  };
  return /* @__PURE__ */ l(
    "div",
    {
      className: `ui-input-number ui-input-number-root ${d}`,
      style: c,
      children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "number",
            value: h,
            onChange: f,
            onBlur: b,
            min: r,
            max: a,
            step: i,
            className: `ui-input ui-input-number-input ${s ? "ui-input-number-input-with-unit" : "ui-input-number-input-with-controls"}`,
            ...u
          }
        ),
        s && /* @__PURE__ */ t("span", { className: "ui-input-number-unit", children: s }),
        /* @__PURE__ */ l("div", { className: "ui-input-number-controls", children: [
          /* @__PURE__ */ t(
            "button",
            {
              onClick: m,
              className: "ui-input-number-btn",
              title: "Increase",
              style: { flex: 1 },
              children: "▲"
            }
          ),
          /* @__PURE__ */ t(
            "button",
            {
              onClick: _,
              className: "ui-input-number-btn",
              title: "Decrease",
              style: { flex: 1 },
              children: "▼"
            }
          )
        ] })
      ]
    }
  );
}, Ln = ({
  prevTitle: e,
  nextTitle: n,
  currentPage: r,
  totalPages: a,
  onPrev: i,
  onNext: s,
  rightContent: d
}) => /* @__PURE__ */ l("div", { className: "ui-page-nav-wrap", children: [
  /* @__PURE__ */ l("div", { className: "ui-page-nav-group", children: [
    /* @__PURE__ */ t(
      Ae,
      {
        variant: "ghost",
        className: "ui-properties-action ui-icon-btn ui-page-nav-btn",
        onClick: i,
        disabled: r <= 1,
        title: e,
        children: /* @__PURE__ */ t(_i, { size: 20 })
      }
    ),
    /* @__PURE__ */ l("span", { className: "ui-page-nav-indicator", children: [
      r,
      "/",
      a
    ] }),
    /* @__PURE__ */ t(
      Ae,
      {
        variant: "ghost",
        className: "ui-properties-action ui-icon-btn ui-page-nav-btn",
        onClick: s,
        disabled: r >= a,
        title: n,
        children: /* @__PURE__ */ t(en, { size: 20 })
      }
    )
  ] }),
  d
] }), En = ({ x: e, y: n, items: r, onClose: a, theme: i }) => {
  const s = q(null);
  return Q(() => {
    const d = (u) => {
      s.current && !s.current.contains(u.target) && a();
    }, c = (u) => {
      u.key === "Escape" && a();
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", c);
    };
  }, [a]), /* @__PURE__ */ t(
    "div",
    {
      ref: s,
      className: "ui-context-menu",
      style: { left: e, top: n },
      children: r.map((d, c) => d.divider ? /* @__PURE__ */ t(
        "div",
        {
          className: "ui-context-menu-divider"
        },
        c
      ) : d.slider ? /* @__PURE__ */ l("div", { className: "ui-context-menu-item", style: { display: "flex", flexDirection: "column", gap: "4px", cursor: "default" }, children: [
        /* @__PURE__ */ l("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-secondary)" }, children: [
          /* @__PURE__ */ t("span", { children: d.label }),
          /* @__PURE__ */ l("span", { children: [
            Math.round((d.value || 0) * 100),
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
            value: d.value || 0,
            onChange: (u) => d.onChange?.(parseFloat(u.target.value)),
            style: { width: "100%", cursor: "pointer" }
          }
        )
      ] }, c) : /* @__PURE__ */ t(
        "div",
        {
          onClick: () => {
            !d.disabled && d.onClick && (d.onClick(), a());
          },
          className: `ui-context-menu-item ${d.disabled ? "disabled" : ""}`,
          children: d.label
        },
        c
      ))
    }
  );
}, ta = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]), na = (...e) => {
  for (const n of e) {
    if (typeof n != "string") continue;
    const r = n.trim();
    if (!ta.has(r.toLowerCase()))
      return r;
  }
  return "";
}, zn = (e, n = [], r = []) => {
  if (!e) return n;
  for (let a = 0; a < e.length; a++) {
    const i = e[a];
    i.isLastChild = a === e.length - 1, i.parentIsLast = [...r], n.push(i), i.expanded && i.children && i.children.length > 0 && zn(i.children, n, [...r, i.isLastChild]);
  }
  return n;
}, ra = (e) => {
  const n = /* @__PURE__ */ new Map(), r = (a) => {
    a.forEach((i) => {
      n.set(i.uuid, i.expanded), i.children.length > 0 && r(i.children);
    });
  };
  return r(e), n;
}, Dn = (e, n) => e.map((r) => ({
  ...r,
  expanded: n.get(r.uuid) ?? r.expanded,
  children: Dn(r.children, n)
})), dt = (e) => {
  const n = e?.object?.children ?? e?.children;
  return Array.isArray(n) ? n : [];
}, Dt = (e, n, r = !1) => {
  const a = Array.isArray(e?.children) ? e.children : [], i = e?.type === "Mesh" ? `Mesh_${e?.id ?? "?"}` : `Group_${e?.id ?? "?"}`;
  return {
    uuid: e?.id ?? e?.uuid ?? String(Math.random()),
    name: na(e?.name, e?.userData?.name) || i,
    type: e?.type === "Mesh" ? "MESH" : "GROUP",
    depth: n,
    children: [],
    expanded: !1,
    visible: e?.visible !== !1,
    object: e,
    isFileNode: r,
    hasChildren: a.length > 0,
    childrenLoaded: !1
  };
}, Wt = (e) => e.childrenLoaded || !e.hasChildren ? e : {
  ...e,
  childrenLoaded: !0,
  children: dt(e).map((n) => Dt(n, e.depth + 1))
}, Vn = (e, n) => e ? e.id === n || e.uuid === n ? !0 : (Array.isArray(e.children) ? e.children : []).some((a) => Vn(a, n)) : !1, Gt = (e) => {
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
}, ia = ({
  t: e,
  treeRoot: n,
  setTreeRoot: r,
  selectedUuid: a,
  locatedUuid: i,
  onSelect: s,
  onToggleVisibility: d,
  onDelete: c,
  onIsolate: u,
  onHide: h,
  onShowAll: p,
  onLocate: v,
  onClearLocate: f,
  onLocateResultsChange: b,
  locateResultUuids: m = [],
  clashSummaryByUuid: _ = {}
}) => {
  const [o, y] = I(""), [C, g] = I(null), [F, j] = I(0), [N, T] = I(400), x = q(null), L = q(null), S = q(null), O = q(""), [z, U] = I(null);
  Q(() => {
    if (!x.current) return;
    const B = new ResizeObserver((D) => {
      D.forEach((se) => T(se.contentRect.height));
    });
    return B.observe(x.current), () => B.disconnect();
  }, []), Q(() => {
    const B = O.current;
    if (!B && o && (S.current = ra(n)), B && !o && S.current) {
      const D = S.current;
      r((se) => Dn(se, D)), S.current = null;
    }
    O.current = o;
  }, [o, r, n]), Q(() => {
    z && L.current === "tree" && r((B) => {
      const D = (ge) => {
        let ze = !1;
        return [ge.map((Me) => {
          let Pe = Me;
          if (Me.uuid === z)
            return ze = !0, Me;
          !Me.childrenLoaded && Me.hasChildren && dt(Me).some((K) => Vn(K, z)) && (Pe = Wt(Me));
          const [Fe, Ke] = D(Pe.children);
          return Ke && (ze = !0), {
            ...Pe,
            expanded: Ke ? !0 : Pe.expanded,
            children: Fe
          };
        }), ze];
      }, [se, pe] = D(B);
      return pe ? se : B;
    });
  }, [z, r]);
  const P = (B, D) => {
    const se = D.toLowerCase();
    return B.reduce((pe, ge) => {
      const ze = !D || Gt(ge).includes(se), He = D ? dt(ge).map((Fe) => Dt(Fe, ge.depth + 1)) : ge.children, Me = P(He, D);
      return (!D || ze || Me.length > 0) && pe.push({
        ...ge,
        childrenLoaded: D ? !0 : ge.childrenLoaded,
        hasChildren: ge.hasChildren ?? dt(ge).length > 0,
        expanded: D ? !0 : ge.expanded,
        children: Me
      }), pe;
    }, []);
  }, H = Ee(() => P(n, o), [n, o]), W = Ee(() => zn(H), [H]), V = Ee(() => {
    if (!o) return null;
    const B = o.toLowerCase(), D = [...n];
    for (; D.length > 0; ) {
      const se = D.shift();
      if (Gt(se).includes(B)) return se;
      dt(se).map((pe) => Dt(pe, (se.depth ?? 0) + 1)).forEach((pe) => D.push(pe));
    }
    return null;
  }, [o, n]), E = Ee(() => {
    if (!o.trim()) return [];
    const B = o.trim().toLowerCase(), D = [], se = [...n];
    for (; se.length > 0; ) {
      const pe = se.shift();
      Gt(pe).includes(B) && D.push(pe), dt(pe).map((ge) => Dt(ge, (pe.depth ?? 0) + 1)).forEach((ge) => se.push(ge));
    }
    return D;
  }, [o, n]), $ = 24, A = W.length * $, de = Math.max(0, Math.floor(F / $)), ie = Math.ceil(N / $), he = Math.min(W.length, de + ie + 1), le = W.slice(de, he);
  Q(() => {
    L.current === "tree" && (L.current = null);
  }, [a]), Q(() => {
    const B = o.trim() ? E.map((D) => D.uuid) : [];
    b?.(B);
  }, [E, o, b]);
  const _e = (B) => {
    const D = (se) => se.map((pe) => pe.uuid === B ? { ...Wt(pe), expanded: !pe.expanded } : pe.children.length > 0 ? { ...pe, children: D(pe.children) } : pe);
    r((se) => D(se));
  }, re = () => {
    const B = (D) => D.map((se) => {
      const pe = Wt(se);
      return {
        ...pe,
        expanded: pe.hasChildren,
        children: B(pe.children)
      };
    });
    r((D) => B(D));
  }, be = () => {
    const B = (D) => D.map((se) => ({
      ...se,
      expanded: !1,
      children: B(se.children)
    }));
    r((D) => B(D));
  }, fe = () => {
    V && v?.(V.object);
  }, xe = (B) => {
    const D = _[B];
    return D ? D.worstStatus === "new" ? {
      label: `${e("clash_group_new")} ${D.newCount}`,
      color: "var(--error)"
    } : D.worstStatus === "confirmed" ? {
      label: `${e("clash_group_confirmed")} ${D.confirmedCount}`,
      color: "var(--warning, #f59e0b)"
    } : {
      label: `${e("clash_group_resolved")} ${D.resolvedCount}`,
      color: "var(--success)"
    } : null;
  };
  return /* @__PURE__ */ l("div", { className: "ui-tree-panel", children: [
    /* @__PURE__ */ l("div", { className: "ui-search-bar", children: [
      /* @__PURE__ */ l("div", { className: "ui-search-input-wrap", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "text",
            placeholder: e("search_nodes"),
            value: o,
            onChange: (B) => y(B.target.value),
            onKeyDown: (B) => {
              B.key === "Enter" && (B.preventDefault(), fe());
            },
            className: "ui-input ui-input-compact"
          }
        ),
        o && /* @__PURE__ */ t("button", { className: "ui-search-clear", onClick: () => y(""), children: /* @__PURE__ */ t(ot, { width: 14, height: 14 }) })
      ] }),
      o && /* @__PURE__ */ l("div", { className: "ui-tree-search-meta", children: [
        /* @__PURE__ */ l("span", { children: [
          e("search_results"),
          ": ",
          E.length
        ] }),
        /* @__PURE__ */ t(
          Ae,
          {
            variant: "ghost",
            className: "ui-properties-action",
            onClick: fe,
            disabled: !V,
            children: e("locate_first_match")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        ref: x,
        className: "ui-tree-container flex-1 overflow-auto",
        onScroll: (B) => j(B.currentTarget.scrollTop),
        children: /* @__PURE__ */ t("div", { style: { height: A, position: "relative", minWidth: "max-content" }, children: /* @__PURE__ */ t("div", { style: { position: "absolute", top: de * $, left: 0, right: 0, minWidth: "max-content" }, children: le.map((B) => /* @__PURE__ */ l(
          "div",
          {
            className: `ui-tree-node ${B.uuid === z ? "selected" : ""} ${m.includes(B.uuid) ? "matched" : ""} ${B.uuid === i ? "located" : ""}`,
            style: { paddingLeft: 8 + B.depth * 16 },
            onClick: () => {
              L.current = "tree", U(B.uuid), s(B.uuid, B.object);
            },
            onDoubleClick: (D) => {
              B.hasChildren && (D.stopPropagation(), _e(B.uuid));
            },
            onContextMenu: (D) => {
              D.preventDefault(), g({ x: D.clientX, y: D.clientY, node: B });
            },
            children: [
              /* @__PURE__ */ t(
                "div",
                {
                  className: "ui-tree-expander",
                  onClick: (D) => {
                    D.stopPropagation(), _e(B.uuid);
                  },
                  children: B.hasChildren ? B.expanded ? /* @__PURE__ */ t(tn, { size: 12 }) : /* @__PURE__ */ t(en, { size: 12 }) : null
                }
              ),
              /* @__PURE__ */ t(
                Ge,
                {
                  checked: B.visible,
                  onChange: (D) => d(B.uuid, D),
                  style: { marginRight: 4, padding: 0, flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ l("div", { className: "ui-tree-label", children: [
                o && B.name.toLowerCase().includes(o.toLowerCase()) ? /* @__PURE__ */ t("span", { children: B.name.split(new RegExp(`(${o})`, "gi")).map(
                  (D, se) => D.toLowerCase() === o.toLowerCase() ? /* @__PURE__ */ t("span", { className: "ui-search-hit", children: D }, se) : D
                ) }) : B.name,
                (() => {
                  const D = xe(B.uuid);
                  return D ? /* @__PURE__ */ t(
                    "span",
                    {
                      style: {
                        marginLeft: 6,
                        padding: "0 6px",
                        borderRadius: "var(--radius-xl)",
                        border: `1px solid ${D.color}`,
                        color: D.color,
                        fontSize: "var(--font-size-label)",
                        lineHeight: "16px",
                        display: "inline-flex",
                        alignItems: "center",
                        verticalAlign: "middle"
                      },
                      children: D.label
                    }
                  ) : null;
                })()
              ] })
            ]
          },
          B.uuid
        )) }) })
      }
    ),
    C && /* @__PURE__ */ t(
      En,
      {
        x: C.x,
        y: C.y,
        onClose: () => g(null),
        items: [
          {
            label: e("locate_in_view"),
            onClick: () => v?.(C.node.object)
          },
          {
            divider: !0
          },
          {
            label: e("expand_all"),
            onClick: re
          },
          {
            label: e("collapse_all"),
            onClick: be
          },
          ...C.node.isFileNode ? [
            { divider: !0 },
            {
              label: e("delete_item"),
              onClick: () => c?.(C.node.object)
            }
          ] : []
        ]
      }
    )
  ] });
}, Xe = ({
  title: e,
  onClose: n,
  children: r,
  width: a = 300,
  height: i,
  x: s = 100,
  y: d = 100,
  resizable: c = !1,
  movable: u = !0,
  storageId: h,
  modal: p = !1,
  autoHeight: v = i === void 0,
  closeLabel: f = "Close"
}) => {
  const b = q(null), m = h === "tool_measure" ? 320 : 220, _ = h === "tool_measure" ? 400 : 120, o = () => {
    if (p)
      return {
        x: Math.max(0, (window.innerWidth - a) / 2),
        y: Math.max(0, (window.innerHeight - (i ?? _)) / 2)
      };
    if (h)
      try {
        const E = localStorage.getItem(`panel_${h}`);
        if (E) {
          const $ = JSON.parse(E);
          if ($.pos && typeof $.pos.x == "number" && typeof $.pos.y == "number")
            return {
              x: Math.min(Math.max(0, $.pos.x), window.innerWidth - 50),
              y: Math.min(Math.max(0, $.pos.y), window.innerHeight - 50)
            };
        }
      } catch {
      }
    return s === 100 && d === 100 && !h ? {
      x: Math.max(0, (window.innerWidth - a) / 2),
      y: Math.max(0, (window.innerHeight - (i ?? _)) / 2)
    } : { x: s, y: d };
  }, y = () => {
    if (h && c)
      try {
        const E = localStorage.getItem(`panel_${h}`);
        if (E) {
          const $ = JSON.parse(E);
          if ($.size && typeof $.size.w == "number" && typeof $.size.h == "number")
            return {
              w: Math.max(m, $.size.w),
              h: Math.max(_, $.size.h)
            };
        }
      } catch {
      }
    return { w: a, h: i ?? _ };
  }, C = q(o()), g = q(y()), F = q(!1), j = q(!1), N = q(null), T = q({ x: 0, y: 0 }), x = q({ x: 0, y: 0 }), L = q({ w: 0, h: 0 }), S = R(() => {
    const E = b.current;
    if (!E) return;
    const $ = C.current, A = g.current;
    E.style.transform = `translate(${$.x}px, ${$.y}px)`, E.style.width = `${A.w}px`, v || (E.style.height = `${A.h}px`);
  }, [v]), O = R((E) => {
    if (!F.current && !j.current) return;
    E.preventDefault();
    const $ = E.clientX - T.current.x, A = E.clientY - T.current.y, de = b.current;
    if (F.current) {
      let ie = window.innerWidth, he = window.innerHeight;
      de?.parentElement && (ie = de.parentElement.clientWidth, he = de.parentElement.clientHeight);
      const le = v && de?.offsetHeight || g.current.h, _e = ie - g.current.w, re = he - le;
      C.current = {
        x: Math.max(0, Math.min(x.current.x + $, _e)),
        y: Math.max(0, Math.min(x.current.y + A, re))
      }, S();
    } else if (j.current && N.current) {
      const ie = N.current;
      let he = L.current.w, le = L.current.h, _e = x.current.x, re = x.current.y;
      if (ie.includes("e") && (he = Math.max(m, L.current.w + $)), ie.includes("w")) {
        const be = L.current.w - m, fe = Math.min($, be);
        he = L.current.w - fe, _e = x.current.x + fe;
      }
      if (ie.includes("s") && (le = Math.max(_, L.current.h + A)), ie.includes("n")) {
        const be = L.current.h - _, fe = Math.min(A, be);
        le = L.current.h - fe, re = x.current.y + fe;
      }
      g.current = { w: he, h: le }, (ie.includes("w") || ie.includes("n")) && (C.current = { x: _e, y: re }), S();
    }
  }, [m, _, v, S]), z = R(() => {
    if ((F.current || j.current) && h)
      try {
        localStorage.setItem(`panel_${h}`, JSON.stringify({
          pos: C.current,
          size: g.current
        }));
      } catch {
      }
    F.current = !1, j.current = !1, N.current = null, document.body.style.cursor = "";
  }, [h]);
  Q(() => (document.addEventListener("mousemove", O), document.addEventListener("mouseup", z), () => {
    document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", z);
  }), [O, z]), Q(() => {
    if (!p) return;
    const E = () => {
      const $ = v ? Math.min(window.innerHeight - 64, b.current?.offsetHeight || g.current.h) : g.current.h;
      C.current = {
        x: Math.max(0, (window.innerWidth - g.current.w) / 2),
        y: Math.max(0, (window.innerHeight - $) / 2)
      }, S();
    };
    return window.addEventListener("resize", E), E(), () => window.removeEventListener("resize", E);
  }, [v, p, S]);
  const U = (E) => {
    p || E.button !== 0 || !u || (E.preventDefault(), E.stopPropagation(), F.current = !0, T.current = { x: E.clientX, y: E.clientY }, x.current = { ...C.current }, document.body.style.cursor = "grabbing");
  }, P = (E) => ($) => {
    if (p || $.button !== 0 || !c) return;
    $.preventDefault(), $.stopPropagation(), j.current = !0, N.current = E, T.current = { x: $.clientX, y: $.clientY }, L.current = { ...g.current }, x.current = { ...C.current };
    const A = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    };
    document.body.style.cursor = A[E];
  }, H = (E) => {
    E.stopPropagation(), n?.();
  }, W = C.current, V = g.current;
  return /* @__PURE__ */ l(ne, { children: [
    p && /* @__PURE__ */ t(
      "div",
      {
        className: "ui-modal-scrim"
      }
    ),
    /* @__PURE__ */ l(
      "div",
      {
        ref: b,
        className: `ui-panel${p ? " ui-panel-modal" : ""}`,
        style: {
          position: p ? "fixed" : "absolute",
          left: 0,
          top: 0,
          transform: `translate(${W.x}px, ${W.y}px)`,
          width: V.w,
          height: v ? "auto" : V.h,
          maxHeight: v ? "calc(100vh - 64px)" : void 0,
          zIndex: p ? 2e3 : 200,
          willChange: F.current || j.current ? "transform, width, height" : "auto"
        },
        children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: `ui-panel-header ${!u || p ? "ui-panel-header-static" : ""}`,
              onMouseDown: U,
              children: [
                /* @__PURE__ */ t("span", { className: "ui-panel-title", children: e }),
                n && /* @__PURE__ */ t(
                  "button",
                  {
                    className: "ui-panel-close",
                    onClick: H,
                    title: f,
                    children: /* @__PURE__ */ t(ot, { width: 14, height: 14 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t("div", { className: "ui-panel-content", children: r }),
          c && !p && /* @__PURE__ */ l(ne, { children: [
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-e", onMouseDown: P("e") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-s", onMouseDown: P("s") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-w", onMouseDown: P("w") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-se", onMouseDown: P("se") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-sw", onMouseDown: P("sw") })
          ] })
        ]
      }
    )
  ] });
}, Qe = ({ label: e, children: n, labelWidth: r = "80px", stretch: a = !1 }) => /* @__PURE__ */ l(
  "div",
  {
    className: "ui-form-row ui-form-row-tight",
    children: [
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
          className: `ui-form-value ${a ? "ui-form-value-stretch" : ""} ${a ? "" : "ui-form-value-end"}`,
          children: n
        }
      )
    ]
  }
), aa = ({
  t: e,
  // 翻译函数
  onClose: n,
  // 关闭回调
  settings: r,
  // 场景设置
  onUpdate: a,
  // 设置更新回调
  currentLang: i,
  // 当前语言
  setLang: s,
  // 设置语言回调
  showStats: d,
  // 是否显示统计
  setShowStats: c,
  // 设置统计显示回调
  // 样式配置
  theme: u
  // 主题配置
}) => {
  const [h, p] = I("general"), v = [
    { value: "general", label: e("setting_general") || "通用" },
    { value: "lighting", label: e("st_lighting") || "光照" },
    { value: "viewport", label: e("st_viewport") || "视口" },
    { value: "highlight", label: e("st_highlight") || "高亮" }
  ];
  return /* @__PURE__ */ t(
    Xe,
    {
      title: e("settings"),
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 360,
      height: 400,
      modal: !0,
      movable: !1,
      theme: u,
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", style: { flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-sticky-tabs", children: /* @__PURE__ */ t(
          qt,
          {
            options: v,
            value: h,
            onChange: (f) => p(f)
          }
        ) }),
        h === "general" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Qe, { label: e("st_lang"), labelWidth: "70px", stretch: !0, children: /* @__PURE__ */ t(
            vt,
            {
              value: i,
              options: [
                { value: "zh", label: "简体中文" },
                { value: "en", label: "English" }
              ],
              onChange: (f) => s(f)
            }
          ) }),
          /* @__PURE__ */ t(Qe, { label: e("st_monitor"), labelWidth: "70px", children: /* @__PURE__ */ t(
            mt,
            {
              checked: d,
              onChange: (f) => c(f)
            }
          ) })
        ] }),
        h === "lighting" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Qe, { label: e("st_ambient") || "环境光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              ht,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: r.ambientInt || 0,
                onChange: (f) => a({ ambientInt: f })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.ambientInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(Qe, { label: e("st_dir") || "主光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              ht,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: r.dirInt || 0,
                onChange: (f) => a({ dirInt: f })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.dirInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(Qe, { label: e("st_back") || "背光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              ht,
              {
                min: 0,
                max: 2,
                step: 0.05,
                value: r.backLightInt ?? 0.5,
                onChange: (f) => a({ backLightInt: f })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.backLightInt ?? 0.5).toFixed(2) })
          ] }) })
        ] }),
        h === "viewport" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Qe, { label: e("st_viewcube_size"), labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              ht,
              {
                min: 120,
                max: 180,
                step: 5,
                value: r.viewCubeSize || 120,
                onChange: (f) => a({ viewCubeSize: f })
              }
            ) }),
            /* @__PURE__ */ l("div", { className: "ui-result-item-secondary-value ui-result-item-secondary-value-wide", children: [
              r.viewCubeSize || 120,
              "px"
            ] })
          ] }) }),
          /* @__PURE__ */ t(Qe, { label: e("st_adaptive_quality") || "Adaptive", labelWidth: "90px", children: /* @__PURE__ */ t(
            mt,
            {
              checked: r.adaptiveQuality !== !1,
              onChange: (f) => a({ adaptiveQuality: f })
            }
          ) }),
          /* @__PURE__ */ t(Qe, { label: e("st_performance_profile") || "性能策略", labelWidth: "90px", children: /* @__PURE__ */ t("div", { className: "ui-inline-actions ui-inline-actions-end", children: /* @__PURE__ */ t(
            qt,
            {
              options: [
                { value: "smooth", label: e("st_perf_smooth") || "流畅优先" },
                { value: "balanced", label: e("st_perf_balanced") || "平衡" },
                { value: "quality", label: e("st_perf_quality") || "画质优先" }
              ],
              value: r.performanceMode || "balanced",
              onChange: (f) => a({ performanceMode: f })
            }
          ) }) })
        ] }),
        h === "highlight" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Qe, { label: e("st_highlight_color") || "高亮颜色", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ t(
            ea,
            {
              value: r.highlightColor || "#ff9f1c",
              onChange: (f) => a({ highlightColor: f })
            }
          ) }),
          /* @__PURE__ */ t(Qe, { label: e("st_highlight_box") || "显示包围盒", labelWidth: "90px", children: /* @__PURE__ */ t(
            mt,
            {
              checked: r.highlightShowBox === !0,
              onChange: (f) => a({ highlightShowBox: f })
            }
          ) })
        ] })
      ] })
    }
  );
}, An = {
  Trash: () => /* @__PURE__ */ t("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Close: () => /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 2L12 12M12 2L2 12", strokeLinecap: "round" }) })
}, oa = ({ onClick: e, disabled: n }) => /* @__PURE__ */ t(
  Ae,
  {
    onClick: e,
    disabled: n,
    variant: "ghost",
    size: "sm",
    className: "ui-btn-icon",
    title: "Clear All",
    children: /* @__PURE__ */ t(An.Trash, {})
  }
), sa = ({ children: e, empty: n, emptyText: r }) => /* @__PURE__ */ t("div", { className: "ui-data-panel ui-measure-results", children: n ? /* @__PURE__ */ t("div", { className: "ui-measure-empty", children: r }) : e }), la = ({ item: e, isHighlighted: n, onHighlight: r, onDelete: a }) => /* @__PURE__ */ l(
  "div",
  {
    onClick: r,
    className: `ui-list-item ui-measure-item ${n ? "selected" : ""}`,
    children: [
      /* @__PURE__ */ t("span", { className: "ui-measure-item-value", children: e.val }),
      /* @__PURE__ */ t(
        "button",
        {
          onClick: (i) => {
            i.stopPropagation(), a();
          },
          className: "ui-btn ui-btn-icon-sm ui-btn-ghost",
          style: { opacity: 0.6, marginLeft: "8px" },
          onMouseEnter: (i) => i.currentTarget.style.opacity = "1",
          onMouseLeave: (i) => i.currentTarget.style.opacity = "0.6",
          children: /* @__PURE__ */ t(An.Close, {})
        }
      )
    ]
  }
), ca = ({ label: e }) => /* @__PURE__ */ t("div", { className: "ui-group-title", children: e }), ua = ({
  t: e,
  sceneMgr: n,
  measureType: r,
  setMeasureType: a,
  measureHistory: i,
  onDelete: s,
  onClear: d,
  onClose: c,
  highlightedId: u,
  onHighlight: h
}) => {
  const p = Ee(() => {
    const m = {
      dist: [],
      angle: [],
      coord: []
    };
    return i.forEach((_) => {
      m[_.type] && m[_.type].push(_);
    }), m;
  }, [i]), v = (m) => {
    a(m), n?.startMeasurement(m);
  }, f = () => {
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
  }, b = (m) => {
    switch (m) {
      case "dist":
        return e("measure_dist") || "Distance";
      case "angle":
        return e("measure_angle") || "Angle";
      case "coord":
        return e("measure_coord") || "Coordinate";
      default:
        return m;
    }
  };
  return /* @__PURE__ */ t(
    Xe,
    {
      title: e("measure_title"),
      closeLabel: e("panel_close") || "关闭",
      onClose: c,
      width: 300,
      height: 400,
      resizable: !0,
      storageId: "tool_measure",
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between", children: [
          /* @__PURE__ */ l("div", { className: "ui-segmented ui-measure-types", children: [
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "none" ? "active" : ""}`,
                onClick: () => v("none"),
                children: /* @__PURE__ */ t("span", { children: e("measure_none") || "None" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "dist" ? "active" : ""}`,
                onClick: () => v("dist"),
                children: /* @__PURE__ */ t("span", { children: e("measure_dist") || "Distance" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "angle" ? "active" : ""}`,
                onClick: () => v("angle"),
                children: /* @__PURE__ */ t("span", { children: e("measure_angle") || "Angle" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "coord" ? "active" : ""}`,
                onClick: () => v("coord"),
                children: /* @__PURE__ */ t("span", { children: e("measure_coord") || "Coord" })
              }
            )
          ] }),
          /* @__PURE__ */ t(oa, { onClick: d, disabled: i.length === 0 })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ t("span", { children: f() }),
          r !== "none" && /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-muted", children: "[ESC] Exit" })
        ] }),
        /* @__PURE__ */ t(sa, { empty: i.length === 0, emptyText: e("no_measurements") || "No measurements", children: i.length > 0 && /* @__PURE__ */ t("div", { className: "ui-measure-results-scroll", children: Object.entries(p).map(([m, _]) => _.length === 0 ? null : /* @__PURE__ */ l("div", { children: [
          /* @__PURE__ */ t(ca, { label: b(m) }),
          _.map((o) => /* @__PURE__ */ t(
            la,
            {
              item: o,
              isHighlighted: u === o.id,
              onHighlight: () => h?.(o.id),
              onDelete: () => s(o.id)
            },
            o.id
          ))
        ] }, m)) }) })
      ] })
    }
  );
}, Xt = ({ axis: e, label: n, active: r, value: a, onToggle: i, onChange: s, disabled: d = !1 }) => /* @__PURE__ */ l(
  "div",
  {
    className: `ui-clip-axis-row${d ? " ui-is-disabled" : ""}`,
    children: [
      /* @__PURE__ */ t(
        Ge,
        {
          checked: r,
          onChange: (c) => i(c),
          style: {
            width: "16px",
            height: "16px",
            cursor: "pointer",
            flexShrink: 0
          }
        }
      ),
      /* @__PURE__ */ t(
        "span",
        {
          className: `ui-clip-axis-label${r ? " is-active" : ""}`,
          children: e.toUpperCase()
        }
      ),
      /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
        Zi,
        {
          min: 0,
          max: 100,
          value: a,
          onChange: s,
          disabled: d || !r
        }
      ) }),
      /* @__PURE__ */ l(
        "span",
        {
          className: "ui-clip-axis-value",
          children: [
            String(Math.round(a[0])).padStart(2, "0"),
            "-",
            String(Math.round(a[1])).padStart(2, "0"),
            "%"
          ]
        }
      )
    ]
  }
), da = ({
  t: e,
  onClose: n,
  clipEnabled: r,
  setClipEnabled: a,
  clipValues: i,
  setClipValues: s,
  clipActive: d,
  setClipActive: c,
  clipHelperVisible: u,
  setClipHelperVisible: h,
  clipHelperOpacity: p,
  setClipHelperOpacity: v
}) => {
  const f = () => {
    s({ x: [0, 100], y: [0, 100], z: [0, 100] });
  };
  return /* @__PURE__ */ t(
    Xe,
    {
      title: e("clip_title"),
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 320,
      height: 420,
      resizable: !1,
      storageId: "tool_clip",
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ l("div", { className: "ui-panel-section", children: [
          /* @__PURE__ */ l("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_enable") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(mt, { checked: r, onChange: (b) => a(b) }) })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_helper_visible") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(
              mt,
              {
                checked: u,
                onChange: (b) => h(b),
                disabled: !r
              }
            ) })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_helper_opacity") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value ui-form-value-stretch", children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
              /* @__PURE__ */ t(
                ht,
                {
                  min: 0.05,
                  max: 0.35,
                  step: 0.01,
                  value: p,
                  onChange: (b) => v(b),
                  disabled: !r || !u
                }
              ),
              /* @__PURE__ */ l("span", { className: "ui-slider-value", children: [
                Math.round(p * 100),
                "%"
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `ui-panel-section ui-panel-section-fill${r ? "" : " ui-is-disabled"}`,
            children: [
              /* @__PURE__ */ t(
                Xt,
                {
                  axis: "x",
                  label: e("clip_x"),
                  active: d.x,
                  value: i.x,
                  onToggle: (b) => c({ ...d, x: b }),
                  onChange: (b) => s({ ...i, x: b }),
                  disabled: !r
                }
              ),
              /* @__PURE__ */ t(
                Xt,
                {
                  axis: "y",
                  label: e("clip_y"),
                  active: d.y,
                  value: i.y,
                  onToggle: (b) => c({ ...d, y: b }),
                  onChange: (b) => s({ ...i, y: b }),
                  disabled: !r
                }
              ),
              /* @__PURE__ */ t(
                Xt,
                {
                  axis: "z",
                  label: e("clip_z"),
                  active: d.z,
                  value: i.z,
                  onToggle: (b) => c({ ...d, z: b }),
                  onChange: (b) => s({ ...i, z: b }),
                  disabled: !r
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ t("div", { className: "ui-panel-footer", children: /* @__PURE__ */ t(Ae, { variant: "default", onClick: f, disabled: !r, children: e("clip_reset") || "重置范围" }) })
      ] })
    }
  );
}, ha = ({ t: e, onClose: n, onExport: r, getDefaultFileName: a, theme: i }) => {
  const [s, d] = I("glb"), [c, u] = I(() => a("glb"));
  return Q(() => {
    u(a(s));
  }, [s, a]), /* @__PURE__ */ t(Xe, { title: e("export_title"), closeLabel: e("panel_close") || "关闭", onClose: n, width: 320, height: 520, resizable: !1, theme: i, storageId: "tool_export", children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", children: [
    /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption", children: [
      e("export_format"),
      ":"
    ] }),
    [
      { id: "glb", label: "GLB", desc: e("export_glb") },
      { id: "lmb", label: "LMB", desc: e("export_lmb") },
      { id: "nbim", label: "NBIM", desc: e("export_nbim") }
    ].map((h) => /* @__PURE__ */ l("label", { className: `ui-choice-card ${s === h.id ? "active" : ""}`, children: [
      /* @__PURE__ */ t(
        "input",
        {
          type: "radio",
          name: "exportFmt",
          checked: s === h.id,
          onChange: () => d(h.id),
          className: "ui-choice-card-radio"
        }
      ),
      /* @__PURE__ */ l("div", { className: "ui-choice-card-content", children: [
        /* @__PURE__ */ t("div", { className: "ui-choice-card-title", children: h.label }),
        /* @__PURE__ */ t("div", { className: "ui-choice-card-desc", children: h.desc })
      ] })
    ] }, h.id)),
    /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
      e("export_filename") || "文件名",
      ":"
    ] }),
    /* @__PURE__ */ t(
      "input",
      {
        type: "text",
        value: c,
        onChange: (h) => u(h.target.value),
        placeholder: e("export_filename_placeholder") || "请输入文件名",
        className: "ui-input ui-input-compact"
      }
    ),
    /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("export_filename_hint") || "留空时自动按模型名生成" }),
    /* @__PURE__ */ t(
      Ae,
      {
        theme: i,
        onClick: () => r(s, c),
        className: "ui-toolpanel-submit",
        children: e("export_btn")
      }
    )
  ] }) });
}, pa = ({ t: e, onClose: n, onCapture: r, theme: a }) => {
  const [i, s] = I("scene"), d = [
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
    Xe,
    {
      title: e("op_screenshot") || "场景截图",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 320,
      height: 340,
      resizable: !1,
      theme: a,
      storageId: "tool_screenshot",
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption", children: [
          e("screenshot_mode") || "截图方式",
          ":"
        ] }),
        d.map((c) => /* @__PURE__ */ l("label", { className: `ui-choice-card ${i === c.id ? "active" : ""}`, children: [
          /* @__PURE__ */ t(
            "input",
            {
              type: "radio",
              name: "screenshotMode",
              checked: i === c.id,
              onChange: () => s(c.id),
              className: "ui-choice-card-radio"
            }
          ),
          /* @__PURE__ */ l("div", { className: "ui-choice-card-content", children: [
            /* @__PURE__ */ t("div", { className: "ui-choice-card-title", children: c.label }),
            /* @__PURE__ */ t("div", { className: "ui-choice-card-desc", children: c.desc })
          ] })
        ] }, c.id)),
        /* @__PURE__ */ t(
          Ae,
          {
            theme: a,
            onClick: () => r(i),
            className: "ui-toolpanel-submit",
            children: e("btn_confirm") || "确定"
          }
        )
      ] })
    }
  );
}, ma = {
  visibility: !0,
  selection: !0,
  clip: !0,
  explode: !0
}, fa = ({
  t: e,
  onClose: n,
  viewpoints: r,
  onSave: a,
  onUpdateName: i,
  onLoad: s,
  onDelete: d,
  theme: c
}) => {
  const [u, h] = I(""), [p, v] = I({}), [f, b] = I(ma);
  Q(() => {
    h(`${e("viewpoint_title") || "视点"} ${r.length + 1}`);
  }, [r.length, e]), Q(() => {
    v(
      r.reduce((o, y) => (o[y.id] = y.name, o), {})
    );
  }, [r]);
  const m = () => {
    const o = u.trim();
    o && (a(o, f), h(`${e("viewpoint_title") || "视点"} ${r.length + 1}`));
  }, _ = (o) => {
    const y = (p[o] || "").trim();
    if (!y) {
      v((C) => ({
        ...C,
        [o]: r.find((g) => g.id === o)?.name || ""
      }));
      return;
    }
    i(o, y);
  };
  return /* @__PURE__ */ t(
    Xe,
    {
      title: e("viewpoint_title") || "视点管理",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 320,
      height: 470,
      resizable: !0,
      theme: c,
      storageId: "tool_viewpoint",
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body ui-toolpanel-body-dense", children: [
        /* @__PURE__ */ l("div", { className: "ui-inline-actions", children: [
          /* @__PURE__ */ t(
            "input",
            {
              autoFocus: !0,
              value: u,
              onChange: (o) => h(o.target.value),
              onKeyDown: (o) => {
                o.key === "Enter" && m();
              },
              className: "ui-input",
              placeholder: e("viewpoint_title") || "视点名称"
            }
          ),
          /* @__PURE__ */ t(Ae, { variant: "primary", onClick: m, children: e("btn_confirm") || "保存" })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-viewpoint-options", children: [
          /* @__PURE__ */ t(
            Ge,
            {
              label: e("viewpoint_save_visibility") || "保存可见性",
              checked: f.visibility,
              onChange: (o) => b((y) => ({ ...y, visibility: o }))
            }
          ),
          /* @__PURE__ */ t(
            Ge,
            {
              label: e("viewpoint_save_selection") || "保存选择",
              checked: f.selection,
              onChange: (o) => b((y) => ({ ...y, selection: o }))
            }
          ),
          /* @__PURE__ */ t(
            Ge,
            {
              label: e("viewpoint_save_clip") || "保存剖切",
              checked: f.clip,
              onChange: (o) => b((y) => ({ ...y, clip: o }))
            }
          ),
          /* @__PURE__ */ t(
            Ge,
            {
              label: e("viewpoint_save_explode") || "保存爆炸图",
              checked: f.explode,
              onChange: (o) => b((y) => ({ ...y, explode: o }))
            }
          )
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-viewpoint-list-wrap", children: r.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-empty-state", children: e("viewpoint_empty") || "暂无保存的视点" }) : /* @__PURE__ */ t("div", { className: "ui-viewpoint-grid", children: r.map((o) => /* @__PURE__ */ l("div", { className: "ui-viewpoint-card-v2", children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: "ui-viewpoint-image",
              onDoubleClick: () => s(o),
              title: e("viewpoint_load") || "双击恢复视点",
              children: [
                o.image ? /* @__PURE__ */ t(
                  "img",
                  {
                    src: o.image,
                    alt: o.name
                  }
                ) : /* @__PURE__ */ t("div", { className: "ui-viewpoint-no-preview", children: e("viewpoint_no_preview") || "无预览" }),
                /* @__PURE__ */ t(
                  "button",
                  {
                    className: "ui-viewpoint-delete",
                    onClick: (y) => {
                      y.stopPropagation(), d(o.id);
                    },
                    title: e("delete_item") || "删除",
                    children: /* @__PURE__ */ t(ki, { size: 12 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              className: "ui-viewpoint-name",
              value: p[o.id] || "",
              onChange: (y) => v((C) => ({
                ...C,
                [o.id]: y.target.value
              })),
              onBlur: () => _(o.id),
              onKeyDown: (y) => {
                y.key === "Enter" && y.currentTarget.blur();
              }
            }
          ),
          /* @__PURE__ */ l("div", { className: "ui-viewpoint-flags", children: [
            o.saveOptions?.visibility !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_visibility") || "可见性" }),
            o.saveOptions?.selection !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_selection") || "选择" }),
            o.saveOptions?.clip !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_clip") || "剖切" }),
            o.saveOptions?.explode !== !1 && /* @__PURE__ */ t("span", { children: e("viewpoint_flag_explode") || "爆炸图" })
          ] })
        ] }, o.id)) }) })
      ] })
    }
  );
}, Kt = ({ label: e, children: n, stretch: r = !1 }) => /* @__PURE__ */ l(
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
), _a = ({
  t: e,
  onClose: n,
  enabled: r,
  strength: a,
  mode: i,
  onEnabledChange: s,
  onStrengthChange: d,
  onModeChange: c,
  onReset: u,
  theme: h
}) => /* @__PURE__ */ t(
  Xe,
  {
    title: e("explode_title") || "爆炸图",
    closeLabel: e("panel_close") || "关闭",
    onClose: n,
    width: 340,
    storageId: "tool_explode",
    modal: !1,
    autoHeight: !0,
    theme: h,
    children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body ui-toolpanel-body-compact", children: [
      /* @__PURE__ */ t(Kt, { label: e("explode_enable") || "启用", children: /* @__PURE__ */ t(mt, { checked: r, onChange: s }) }),
      /* @__PURE__ */ t(Kt, { label: e("explode_strength") || "强度", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
        /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
          ht,
          {
            min: 0,
            max: 100,
            step: 1,
            value: a,
            onChange: d
          }
        ) }),
        /* @__PURE__ */ l("div", { className: "ui-slider-value ui-slider-value-strong", children: [
          a,
          "%"
        ] })
      ] }) }),
      /* @__PURE__ */ t(Kt, { label: e("explode_mode") || "方向", stretch: !0, children: /* @__PURE__ */ t(
        qt,
        {
          options: [
            { value: "radial", label: e("explode_mode_radial") || "四周" },
            { value: "horizontal", label: e("explode_mode_horizontal") || "横向" },
            { value: "vertical", label: e("explode_mode_vertical") || "纵向" }
          ],
          value: i,
          onChange: (p) => c(p)
        }
      ) }),
      /* @__PURE__ */ t("div", { className: "ui-panel-footer ui-panel-footer-spaced", children: /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: u, children: e("explode_reset") || "重置" }) })
    ] })
  }
), ga = [
  { value: "equals", labelKey: "search_op_equals", fallback: "等于" },
  { value: "contains", labelKey: "search_op_contains", fallback: "包含" },
  { value: "notContains", labelKey: "search_op_not_contains", fallback: "不包含" },
  { value: "startsWith", labelKey: "search_op_starts_with", fallback: "开头" },
  { value: "endsWith", labelKey: "search_op_ends_with", fallback: "结尾" }
], ya = [
  { value: "AND", labelKey: "search_connector_and", fallback: "且" },
  { value: "OR", labelKey: "search_connector_or", fallback: "或" }
], ba = ({
  t: e,
  onClose: n,
  conditions: r,
  results: a,
  searching: i,
  searchProgress: s,
  searchStatus: d,
  onConditionsChange: c,
  onSearch: u,
  onCancelSearch: h,
  onApplyResultHighlight: p,
  onClearResult: v,
  theme: f
}) => {
  const [b, m] = I(1), [_, o] = I(50);
  Q(() => {
    m(1);
  }, [a.length, _]);
  const y = Math.max(1, Math.ceil(a.length / _)), C = Math.min(b, y), g = (C - 1) * _, F = Ee(() => a.slice(g, g + _), [a, g, _]), j = (x, L) => {
    c(r.map((S) => S.id === x ? { ...S, ...L } : S));
  }, N = () => {
    const x = `cond_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    c([
      ...r,
      {
        id: x,
        propertyName: "",
        operator: "contains",
        value: "",
        connector: "AND"
      }
    ]);
  }, T = (x) => {
    const L = r.filter((S) => S.id !== x);
    c(L.length > 0 ? L : [{ id: "cond_init", propertyName: "", operator: "contains", value: "" }]);
  };
  return /* @__PURE__ */ t(
    Xe,
    {
      title: e("tb_search") || "属性搜索",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 420,
      storageId: "tool_search",
      autoHeight: !0,
      theme: f,
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between", children: [
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption", children: e("search_conditions") || "搜索条件" }),
          /* @__PURE__ */ l("div", { className: "ui-toolpanel-row", children: [
            /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: N, children: e("search_add_condition") || "添加条件" }),
            /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: u, disabled: i, children: i ? e("searching") || "搜索中..." : e("search_run") || "搜索" })
          ] })
        ] }),
        r.map((x, L) => /* @__PURE__ */ l(
          "div",
          {
            className: `ui-toolpanel-grid ui-toolpanel-grid-condition ${L > 0 ? "ui-toolpanel-grid-condition-linked" : "ui-toolpanel-grid-condition-first"}`,
            children: [
              L > 0 && /* @__PURE__ */ t(
                vt,
                {
                  value: x.connector || "AND",
                  options: ya.map((S) => ({ value: S.value, label: e(S.labelKey) || S.fallback })),
                  onChange: (S) => j(x.id, { connector: S }),
                  className: "ui-input-compact",
                  style: { width: "64px", flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ t(
                "input",
                {
                  className: "ui-input ui-input-compact",
                  placeholder: e("search_field_name") || "属性名",
                  value: x.propertyName,
                  onChange: (S) => j(x.id, { propertyName: S.target.value }),
                  style: { flex: 1, minWidth: 0 }
                }
              ),
              /* @__PURE__ */ t(
                vt,
                {
                  value: x.operator,
                  options: ga.map((S) => ({ value: S.value, label: e(S.labelKey) || S.fallback })),
                  onChange: (S) => j(x.id, { operator: S }),
                  className: "ui-input-compact",
                  style: { width: "92px" }
                }
              ),
              /* @__PURE__ */ t(
                "input",
                {
                  className: "ui-input ui-input-compact",
                  placeholder: e("search_field_value") || "属性值",
                  value: x.value,
                  onChange: (S) => j(x.id, { value: S.target.value }),
                  style: { flex: 1, minWidth: 0 }
                }
              ),
              L > 0 ? /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-search-clear ui-search-clear-static",
                  onClick: () => T(x.id),
                  title: e("remove_condition") || "移除条件",
                  style: { flexShrink: 0, width: "24px" },
                  children: /* @__PURE__ */ t(ot, { width: 14, height: 14 })
                }
              ) : /* @__PURE__ */ t("div", { style: { width: "24px", flexShrink: 0 } })
            ]
          },
          x.id
        )),
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ l("span", { children: [
            e("search_results") || "搜索结果",
            ": ",
            a.length
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-toolpanel-row", children: [
            /* @__PURE__ */ t("span", { children: e("search_page_size") || "每页" }),
            /* @__PURE__ */ t(
              vt,
              {
                value: String(_),
                onChange: (x) => o(Number(x) || 50),
                options: [
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" }
                ],
                className: "ui-input-compact",
                style: { minWidth: 68 }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-box ui-search-results-box", children: a.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: e("search_no_results") || "暂无结果" }) : F.map((x) => /* @__PURE__ */ t(
          "div",
          {
            className: "ui-search-result-item ui-search-result-item-simple",
            title: `${x.uuid}
${x.matchedBy.join(`
`)}`,
            children: /* @__PURE__ */ l(
              "button",
              {
                className: "ui-search-result-main",
                onClick: () => p(x.uuid),
                children: [
                  /* @__PURE__ */ t("span", { children: x.name || x.uuid }),
                  /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: [x.type, x.modelId, ...x.matchedBy].filter(Boolean).join(" · ") })
                ]
              }
            )
          },
          x.uuid
        )) }),
        a.length > 0 && /* @__PURE__ */ t(
          Ln,
          {
            prevTitle: e("search_page_prev") || "上一页",
            nextTitle: e("search_page_next") || "下一页",
            currentPage: C,
            totalPages: y,
            onPrev: () => m((x) => Math.max(1, x - 1)),
            onNext: () => m((x) => Math.min(y, x + 1)),
            rightContent: /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: v, children: e("search_clear") || "清除结果" })
          }
        ),
        i && /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay", children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-overlay-card", children: [
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay-title", children: d || e("searching") || "搜索中..." }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full", children: /* @__PURE__ */ t("div", { className: "ui-progress-fill", style: { width: `${Math.max(0, Math.min(100, s))}%` } }) }),
          /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: [
              Math.round(s),
              "%"
            ] }),
            /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: h, children: e("search_cancel") || "取消搜索" })
          ] })
        ] }) })
      ] })
    }
  );
}, va = ({
  t: e,
  onClose: n,
  running: r,
  progress: a,
  status: i,
  scannedCount: s,
  pairsScanned: d,
  results: c,
  resultFilter: u,
  modelOptions: h,
  setA: p,
  setB: v,
  tolerance: f,
  minOverlapVolume: b,
  clearanceDistance: m,
  useNarrowPhase: _,
  useTrianglePhase: o,
  includeSameModel: y,
  onSetAChange: C,
  onSetBChange: g,
  onToleranceChange: F,
  onMinOverlapVolumeChange: j,
  onClearanceDistanceChange: N,
  onUseNarrowPhaseChange: T,
  onUseTrianglePhaseChange: x,
  onIncludeSameModelChange: L,
  onRun: S,
  onCancel: O,
  onClear: z,
  onExportCsv: U,
  onIsolateByStatus: P,
  onRestoreVisibility: H,
  onResultFilterChange: W,
  typeFilter: V,
  onTypeFilterChange: E,
  onUpdateResultStatus: $,
  onMarkFilteredStatus: A,
  onSetASelectAll: de,
  onSetAClear: ie,
  onSetBSelectAll: he,
  onSetBClear: le,
  onFocusResult: _e,
  theme: re
}) => {
  const [be, fe] = I(1), [xe, B] = I(50), [D, se] = I(h.length <= 4), [pe, ge] = I(!1);
  Q(() => {
    fe(1);
  }, [c.length, xe]);
  const ze = c, He = Math.max(1, Math.ceil(ze.length / xe)), Me = Math.min(be, He), Pe = (Me - 1) * xe, Fe = Ee(() => ze.slice(Pe, Pe + xe), [ze, Pe, xe]), Ke = Ee(() => new Set(p), [p]), st = Ee(() => new Set(v), [v]), G = i || (r ? e("clash_running") || "正在执行碰撞检查..." : e("clash_ready") || "准备就绪"), K = `${e("clash_set_a") || "模型集 A"} ${p.length} · ${e("clash_set_b") || "模型集 B"} ${v.length}`, Y = (k, ee, ce) => {
    const te = new Set(k);
    te.has(ee) ? te.delete(ee) : te.add(ee), ce(Array.from(te));
  };
  return /* @__PURE__ */ t(
    Xe,
    {
      title: e("tb_clash") || "碰撞检查",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 500,
      storageId: "tool_clash",
      autoHeight: !0,
      theme: re,
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body ui-clash-panel", children: [
        /* @__PURE__ */ l("div", { className: "ui-clash-hero", children: [
          /* @__PURE__ */ l("div", { className: "ui-clash-hero-main", children: [
            /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong ui-clash-hero-title", children: G }),
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption ui-clash-hero-meta", children: [
              e("clash_scope_visible") || "范围：当前可见构件",
              " · ",
              e("clash_candidates") || "候选",
              " ",
              s,
              " · ",
              e("clash_pairs_scanned") || "已扫描对数",
              " ",
              d
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-toolpanel-row ui-toolpanel-wrap ui-clash-hero-actions", children: [
            r ? /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: O, children: e("search_cancel") || "取消搜索" }) : /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: S, variant: "primary", children: e("clash_run") || "开始检查" }),
            /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: z, children: e("clash_clear") || "清空结果" }),
            /* @__PURE__ */ t(Ae, { className: "ui-properties-action", onClick: U, disabled: c.length === 0, children: e("clash_export_csv") || "导出 CSV" })
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full ui-clash-progress", children: /* @__PURE__ */ t("div", { className: "ui-progress-fill", style: { width: `${Math.max(0, Math.min(100, a))}%` } }) })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-clash-section", children: [
          /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "ui-clash-section-toggle",
              onClick: () => se((k) => !k),
              children: [
                /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-strong ui-clash-section-title", children: e("clash_scope_visible") || "检测范围" }),
                /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption ui-clash-section-summary", children: K })
              ]
            }
          ),
          D && /* @__PURE__ */ l("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
            /* @__PURE__ */ l("div", { className: "ui-selection-box", children: [
              /* @__PURE__ */ l("div", { className: "ui-selection-box-header", children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: e("clash_set_a") || "模型集 A" }),
                /* @__PURE__ */ l("div", { className: "ui-selection-box-actions", children: [
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: de, children: e("select_all") || "全选" }),
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: ie, children: e("search_clear") || "清空" })
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: h.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("clash_no_models") || "暂无模型" }) : h.map((k) => /* @__PURE__ */ t(
                Ge,
                {
                  checked: Ke.has(k.id),
                  onChange: () => Y(p, k.id, C),
                  label: k.name,
                  labelStyle: { fontSize: 11 }
                },
                `a_${k.id}`
              )) })
            ] }),
            /* @__PURE__ */ l("div", { className: "ui-selection-box", children: [
              /* @__PURE__ */ l("div", { className: "ui-selection-box-header", children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: e("clash_set_b") || "模型集 B" }),
                /* @__PURE__ */ l("div", { className: "ui-selection-box-actions", children: [
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: he, children: e("select_all") || "全选" }),
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: le, children: e("search_clear") || "清空" })
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: h.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("clash_no_models") || "暂无模型" }) : h.map((k) => /* @__PURE__ */ t(
                Ge,
                {
                  checked: st.has(k.id),
                  onChange: () => Y(v, k.id, g),
                  label: k.name,
                  labelStyle: { fontSize: 11 }
                },
                `b_${k.id}`
              )) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-clash-section", children: [
          /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "ui-clash-section-toggle",
              onClick: () => ge((k) => !k),
              children: [
                /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-strong ui-clash-section-title", children: e("settings_more") || "高级设置" }),
                /* @__PURE__ */ l("span", { className: "ui-toolpanel-caption ui-clash-section-summary", children: [
                  e("clash_tolerance") || "容差",
                  " / ",
                  e("clash_min_overlap") || "最小重叠体积",
                  " / ",
                  e("clash_clearance_distance") || "最小净空距离"
                ] })
              ]
            }
          ),
          pe && /* @__PURE__ */ l(ne, { children: [
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: e("clash_tolerance") || "容差" }),
                /* @__PURE__ */ t(
                  Ht,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(f) ? f : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (k) => F(Math.max(0, k || 0)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: e("clash_min_overlap") || "最小重叠体积" }),
                /* @__PURE__ */ t(
                  Ht,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(b) ? b : 0,
                    min: 0,
                    step: 1e-6,
                    onChange: (k) => j(Math.max(0, k || 0)),
                    style: { width: "100%" }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: e("clash_clearance_distance") || "最小净空距离" }),
                /* @__PURE__ */ t(
                  Ht,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(m) ? m : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (k) => N(Math.max(0, k || 0)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-clash-option-stack", children: [
                /* @__PURE__ */ t(
                  Ge,
                  {
                    checked: _,
                    onChange: T,
                    label: e("clash_narrow_phase") || "启用精筛（OBB）",
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Ge,
                  {
                    checked: o,
                    onChange: x,
                    label: e("clash_triangle_phase") || "启用三角面复核",
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Ge,
                  {
                    checked: y,
                    onChange: L,
                    label: e("clash_include_same_model") || "包含同模型内检测",
                    labelStyle: { fontSize: 12 }
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-clash-results-header", children: [
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption-strong ui-clash-results-title", children: [
              e("clash_results") || "碰撞结果",
              " ",
              ze.length
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("locate_in_view") || "点击条目定位到视图" })
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-row", children: /* @__PURE__ */ t(
            vt,
            {
              value: String(xe),
              onChange: (k) => B(Number(k) || 50),
              options: [
                { value: "20", label: "20" },
                { value: "50", label: "50" },
                { value: "100", label: "100" }
              ],
              className: "ui-input-compact",
              style: { minWidth: 68 }
            }
          ) })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-box ui-clash-results-box", children: ze.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: e("clash_no_results") || "暂无碰撞结果" }) : Fe.map((k) => /* @__PURE__ */ l(
          "button",
          {
            className: "ui-search-result-item ui-clash-result-item",
            onClick: () => _e(k),
            title: `${k.aUuid} <> ${k.bUuid}`,
            children: [
              /* @__PURE__ */ t("div", { className: "ui-clash-result-top", children: /* @__PURE__ */ l("span", { className: "ui-clash-result-title", children: [
                k.aName || k.aUuid,
                " ",
                " <> ",
                " ",
                k.bName || k.bUuid
              ] }) }),
              /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-clash-result-meta", children: [
                /* @__PURE__ */ l("span", { className: "ui-result-item-secondary", children: [
                  k.aUuid,
                  " ",
                  " <> ",
                  " ",
                  k.bUuid
                ] }),
                /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: k.type === "hard" ? `${e("clash_overlap_volume") || "重叠体积"}: ${k.overlapVolume.toFixed(6)}` : `${e("clash_clearance_value") || "净空距离"}: ${k.distance.toFixed(6)}` })
              ] })
            ]
          },
          k.id
        )) }),
        ze.length > 0 && /* @__PURE__ */ t(
          Ln,
          {
            prevTitle: e("search_page_prev") || "上一页",
            nextTitle: e("search_page_next") || "下一页",
            currentPage: Me,
            totalPages: He,
            onPrev: () => fe((k) => Math.max(1, k - 1)),
            onNext: () => fe((k) => Math.min(He, k + 1))
          }
        )
      ] })
    }
  );
}, wa = ({ t: e, loading: n, status: r, progress: a, theme: i }) => n ? /* @__PURE__ */ t("div", { className: "ui-loading-overlay", children: /* @__PURE__ */ l("div", { className: "ui-loading-box", children: [
  /* @__PURE__ */ l("div", { className: "ui-loading-header", children: [
    /* @__PURE__ */ t("div", { className: "ui-loading-title", children: r }),
    /* @__PURE__ */ l("div", { className: "ui-loading-percent", children: [
      Math.round(a),
      "%"
    ] })
  ] }),
  /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-loading-progress", children: /* @__PURE__ */ t(
    "div",
    {
      className: "ui-progress-fill",
      style: {
        width: `${a}%`,
        transition: "width 0.3s ease-out"
      }
    }
  ) }),
  /* @__PURE__ */ l("div", { className: "ui-loading-meta", children: [
    /* @__PURE__ */ l("svg", { className: "ui-loading-spinner", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ t("circle", { className: "ui-loading-spinner-track", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
      /* @__PURE__ */ t("path", { className: "ui-loading-spinner-head", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
    ] }),
    /* @__PURE__ */ t("span", { children: e(a === 100 ? "processing" : "loading_resources") })
  ] })
] }) }) : null;
function rt(e) {
  return String(e ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
function Bn(e) {
  if (e == null) return "";
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean") return String(e);
  if (Array.isArray(e)) return e.map((n) => Bn(n)).filter(Boolean).join(", ");
  if (typeof e == "object")
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  return String(e);
}
function xa(e) {
  return Array.isArray(e) ? e : Object.entries(e).map(([n, r]) => ({ key: n, value: r }));
}
function wt(e, n, r) {
  return xa(n).map((a, i) => {
    const s = String(a.key ?? "").trim(), d = Bn(a.value);
    if (!s || !d) return null;
    const c = `${e}.${s}`;
    return {
      id: a.id || `${e}::${s}::${i}`,
      group: e,
      key: s,
      value: d,
      path: c,
      rawKey: a.rawKey,
      source: a.source || r,
      normalizedGroup: rt(e),
      normalizedKey: rt(s),
      normalizedPath: rt(c),
      normalizedValue: rt(d)
    };
  }).filter(Boolean);
}
function Ca(e, n) {
  return e ? Object.entries(e).map(([r, a]) => ({
    name: r,
    items: wt(r, a, n)
  })).filter((r) => r.items.length > 0) : [];
}
function Na(e, n) {
  const r = rt(n);
  return r ? e.map((a) => ({
    ...a,
    items: a.items.filter(
      (i) => i.normalizedGroup.includes(r) || i.normalizedKey.includes(r) || i.normalizedPath.includes(r) || i.normalizedValue.includes(r)
    )
  })).filter((a) => a.items.length > 0) : e;
}
function Sa(e) {
  return e.map((n) => [`[${n.name}]`, ...n.items.map((r) => `${r.key}: ${r.value}`)].join(`
`)).join(`

`);
}
const ka = ({ t: e, selectedProps: n }) => {
  const [r, a] = I(/* @__PURE__ */ new Set()), [i, s] = I(""), [d, c] = I(null), u = Ee(() => n, [n]), h = (m) => {
    const _ = new Set(r);
    _.has(m) ? _.delete(m) : _.add(m), a(_);
  }, p = async (m) => {
    try {
      await navigator.clipboard.writeText(m), c(m), setTimeout(() => c(null), 1500);
    } catch (_) {
      try {
        const o = document.createElement("textarea");
        o.value = m, o.setAttribute("readonly", "true"), o.style.position = "fixed", o.style.left = "-9999px", o.style.top = "0", document.body.appendChild(o), o.focus(), o.select();
        const y = document.execCommand("copy");
        if (document.body.removeChild(o), y) {
          c(m), setTimeout(() => c(null), 1500);
          return;
        }
      } catch {
      }
      console.error("Failed to copy", _);
    }
  }, v = Ee(() => u ? Na(u, i) : null, [u, i]);
  Q(() => {
    if (!v || !i) return;
    const m = new Set(v.map((_) => _.name));
    a((_) => {
      const o = new Set(_);
      return m.forEach((y) => o.delete(y)), o;
    });
  }, [v, i]);
  const f = v ? v.length : 0, b = v ? v.reduce((m, _) => m + _.items.length, 0) : 0;
  return /* @__PURE__ */ l("div", { className: "ui-properties-panel", children: [
    n && /* @__PURE__ */ l("div", { className: "ui-properties-toolbar", children: [
      /* @__PURE__ */ t("div", { className: "ui-search-input-wrap", children: /* @__PURE__ */ t(
        "input",
        {
          type: "text",
          placeholder: e("search_props"),
          value: i,
          onChange: (m) => s(m.target.value),
          className: "ui-input ui-input-compact"
        }
      ) }),
      /* @__PURE__ */ l("div", { className: "ui-properties-subbar", children: [
        /* @__PURE__ */ l("div", { className: "ui-properties-meta", children: [
          e(i ? "search_results" : "prop_groups") + `: ${f}`,
          /* @__PURE__ */ t("span", { children: " · " }),
          e("prop_items") + `: ${b}`
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-properties-actions", children: /* @__PURE__ */ t(
          "button",
          {
            className: "ui-properties-action ui-properties-icon-btn",
            onClick: () => u && p(Sa(u)),
            disabled: !u,
            title: e("copy_all_props"),
            children: /* @__PURE__ */ t(bn, { size: 14 })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "ui-properties-scroll", children: v ? v.map((m) => /* @__PURE__ */ l("div", { children: [
      /* @__PURE__ */ l("div", { className: `ui-prop-group${r.has(m.name) ? " collapsed" : ""}`, onClick: () => h(m.name), children: [
        /* @__PURE__ */ t("span", { children: m.name }),
        /* @__PURE__ */ l("div", { className: "ui-prop-group-actions", children: [
          /* @__PURE__ */ t(
            "button",
            {
              className: "ui-prop-copy",
              onClick: (_) => {
                _.stopPropagation(), p([`[${m.name}]`, ...m.items.map((o) => `${o.key}: ${o.value}`)].join(`
`));
              },
              title: e("copy_group_props"),
              children: /* @__PURE__ */ t(bn, { size: 12 })
            }
          ),
          /* @__PURE__ */ t("span", { className: "ui-prop-group-chevron", children: r.has(m.name) ? /* @__PURE__ */ t(en, { width: 14, height: 14 }) : /* @__PURE__ */ t(tn, { width: 14, height: 14 }) })
        ] })
      ] }),
      !r.has(m.name) && m.items.map((_) => /* @__PURE__ */ l("div", { className: "ui-prop-row", children: [
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-prop-key",
            title: `${_.path} (${e("click_to_copy")})`,
            onClick: () => p(_.key),
            children: _.key
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-prop-value",
            title: `${_.value}
${_.path}`,
            onClick: () => p(_.value),
            children: _.value
          }
        )
      ] }, _.id))
    ] }, m.name)) : /* @__PURE__ */ t("div", { className: "ui-properties-empty", children: e("no_selection") }) }),
    d && /* @__PURE__ */ t("div", { className: "ui-copy-toast", children: e("copied") })
  ] });
}, Ma = ({ isOpen: e, title: n, message: r, onConfirm: a, onCancel: i, t: s, theme: d }) => e ? /* @__PURE__ */ t(
  Xe,
  {
    title: n,
    onClose: i,
    width: 360,
    height: 188,
    modal: !0,
    movable: !1,
    theme: d,
    children: /* @__PURE__ */ l(
      "div",
      {
        className: "ui-modal-body ui-modal-body-confirm",
        children: [
          /* @__PURE__ */ t("div", { className: "ui-modal-message", children: r }),
          /* @__PURE__ */ l("div", { className: "ui-modal-actions", children: [
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-default ui-modal-action-btn",
                onClick: i,
                children: s("btn_cancel")
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-danger ui-modal-action-btn",
                onClick: a,
                children: s("btn_confirm")
              }
            )
          ] })
        ]
      }
    )
  }
) : null, La = ({ isOpen: e, onClose: n, t: r, theme: a }) => {
  if (!e) return null;
  const [i, s] = I(!0);
  return /* @__PURE__ */ t(
    Xe,
    {
      title: r("about_title"),
      onClose: n,
      width: 400,
      height: 520,
      modal: !0,
      movable: !1,
      theme: a,
      children: /* @__PURE__ */ l("div", { className: "ui-modal-body ui-modal-body-scroll ui-about-modal", children: [
        /* @__PURE__ */ l("div", { className: "ui-about-hero", children: [
          /* @__PURE__ */ t("div", { className: "ui-about-app-name", children: "3D Browser" }),
          /* @__PURE__ */ t("div", { className: "ui-about-tagline", children: r("about_tagline") })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-about-meta-card", children: [
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("about_version") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value", children: "1.6.0" })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("about_author") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value", children: "zhangly1403@163.com" })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("project_url") }),
            /* @__PURE__ */ t("a", { href: "https://github.com/zly258/3dbrowser", target: "_blank", rel: "noopener noreferrer", className: "ui-link", children: "github.com/zly258/3dbrowser" })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: r("about_license") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value ui-about-license-badge", children: r("about_license_nc") })
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-about-license-card", children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: "ui-about-license-toggle",
              onClick: () => s(!i),
              children: [
                /* @__PURE__ */ t("span", { className: "ui-about-license-title", children: r("license_details") }),
                i ? /* @__PURE__ */ t(gi, { width: 14, height: 14 }) : /* @__PURE__ */ t(tn, { width: 14, height: 14 })
              ]
            }
          ),
          i && /* @__PURE__ */ l("div", { className: "ui-about-license-content", children: [
            /* @__PURE__ */ t("div", { className: "ui-about-license-summary", children: r("license_summary") }),
            /* @__PURE__ */ l("div", { className: "ui-about-license-link", children: [
              r("full_license"),
              " ",
              /* @__PURE__ */ t("a", { href: "https://creativecommons.org/licenses/by-nc/4.0/", target: "_blank", rel: "noopener noreferrer", className: "ui-link", children: "CC BY-NC 4.0" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-about-footer", children: r("about_copyright") })
      ] })
    }
  );
}, Ea = ({ sceneMgr: e, lang: n = "zh", theme: r }) => {
  const a = q(null), i = q(null), s = q(null), d = q(null), c = q(null), u = q(null), h = q(new M.Raycaster()), p = q(new M.Vector2()), v = q(null), f = e?.settings?.viewCubeSize || 120, b = (C) => bt(n, C);
  Q(() => {
    if (!i.current || !a.current) return;
    const C = f, g = f, F = i.current, j = F.getContext("webgl2", {
      antialias: !0,
      alpha: !0,
      preserveDrawingBuffer: !1
    });
    j && (j.pixelStorei(j.UNPACK_FLIP_Y_WEBGL, !1), j.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1));
    const N = new M.WebGLRenderer({
      canvas: F,
      context: j || void 0,
      antialias: !0,
      alpha: !0,
      precision: "mediump"
    });
    N.setSize(C, g), N.setPixelRatio(window.devicePixelRatio), s.current = N;
    const T = new M.Scene();
    d.current = T;
    const x = new M.PerspectiveCamera(45, 1, 0.1, 100);
    x.position.set(0, 0, 3.5), x.lookAt(0, 0, 0), c.current = x;
    const L = new M.AmbientLight(16777215, 1);
    T.add(L);
    const S = new M.DirectionalLight(16777215, 0.6);
    S.position.set(5, 5, 5), T.add(S);
    const O = new M.Group();
    T.add(O), u.current = O;
    const z = (he, le = 0) => {
      const _e = document.createElement("canvas");
      _e.width = 128, _e.height = 128;
      const re = _e.getContext("2d");
      return re && (re.fillStyle = "#f8f9fa", re.fillRect(0, 0, 128, 128), re.save(), re.translate(64, 64), le !== 0 && re.rotate(le * Math.PI / 180), re.fillStyle = "#333333", re.font = n === "zh" ? 'bold 54px "Microsoft YaHei", sans-serif' : "bold 32px Arial, sans-serif", re.textAlign = "center", re.textBaseline = "middle", re.fillText(he, 0, 0), re.restore(), re.strokeStyle = "#cccccc", re.lineWidth = 4, re.strokeRect(2, 2, 124, 124)), new M.CanvasTexture(_e);
    }, U = 16316922, P = 16316922, H = 16316922, W = (he, le, _e, re, be, fe = 0) => {
      const xe = new M.BoxGeometry(he.x, he.y, he.z);
      let B;
      if (be) {
        const se = z(be, fe);
        B = new M.MeshPhongMaterial({
          map: se,
          transparent: !0,
          opacity: 0.98,
          shininess: 30
        });
      } else
        B = new M.MeshPhongMaterial({
          color: re,
          transparent: !0,
          opacity: 0.98,
          shininess: 30
        });
      const D = new M.Mesh(xe, B);
      return D.position.copy(le), D.name = _e, D.userData.originalOpacity = B.opacity, D.userData.originalColor = B.color.clone(), D.userData.isFace = !!be, O.add(D), D;
    }, V = 0.88, E = 0.12, $ = 0.12, A = 0.5;
    W(new M.Vector3(V, 0.05, V), new M.Vector3(0, -A, 0), "front", U, b("cube_front")), W(new M.Vector3(V, 0.05, V), new M.Vector3(0, A, 0), "back", U, b("cube_back"), 180), W(new M.Vector3(V, V, 0.05), new M.Vector3(0, 0, A), "top", U, b("cube_top"), 360), W(new M.Vector3(V, V, 0.05), new M.Vector3(0, 0, -A), "bottom", U, b("cube_bottom")), W(new M.Vector3(0.05, V, V), new M.Vector3(-A, 0, 0), "left", U, b("cube_left"), 90), W(new M.Vector3(0.05, V, V), new M.Vector3(A, 0, 0), "right", U, b("cube_right"), 270), W(new M.Vector3(V, E, E), new M.Vector3(0, -A, A), "top-front", P), W(new M.Vector3(V, E, E), new M.Vector3(0, A, A), "top-back", P), W(new M.Vector3(E, V, E), new M.Vector3(-A, 0, A), "top-left", P), W(new M.Vector3(E, V, E), new M.Vector3(A, 0, A), "top-right", P), W(new M.Vector3(V, E, E), new M.Vector3(0, -A, -A), "bottom-front", P), W(new M.Vector3(V, E, E), new M.Vector3(0, A, -A), "bottom-back", P), W(new M.Vector3(E, V, E), new M.Vector3(-A, 0, -A), "bottom-left", P), W(new M.Vector3(E, V, E), new M.Vector3(A, 0, -A), "bottom-right", P), W(new M.Vector3(E, E, V), new M.Vector3(-A, -A, 0), "front-left", P), W(new M.Vector3(E, E, V), new M.Vector3(A, -A, 0), "front-right", P), W(new M.Vector3(E, E, V), new M.Vector3(-A, A, 0), "back-left", P), W(new M.Vector3(E, E, V), new M.Vector3(A, A, 0), "back-right", P), W(new M.Vector3($, $, $), new M.Vector3(-A, -A, A), "top-front-left", H), W(new M.Vector3($, $, $), new M.Vector3(A, -A, A), "top-front-right", H), W(new M.Vector3($, $, $), new M.Vector3(-A, A, A), "top-back-left", H), W(new M.Vector3($, $, $), new M.Vector3(A, A, A), "top-back-right", H), W(new M.Vector3($, $, $), new M.Vector3(-A, -A, -A), "bottom-front-left", H), W(new M.Vector3($, $, $), new M.Vector3(A, -A, -A), "bottom-front-right", H), W(new M.Vector3($, $, $), new M.Vector3(-A, A, -A), "bottom-back-left", H), W(new M.Vector3($, $, $), new M.Vector3(A, A, -A), "bottom-back-right", H);
    let de;
    const ie = () => {
      de = requestAnimationFrame(ie), e && u.current && u.current.quaternion.copy(e.camera.quaternion).invert(), N.render(T, x);
    };
    return ie(), () => {
      cancelAnimationFrame(de), N.dispose(), T.traverse((he) => {
        he instanceof M.Mesh && (he.geometry.dispose(), Array.isArray(he.material) ? he.material.forEach((le) => le.dispose()) : he.material.dispose());
      });
    };
  }, [e, f, n]);
  const m = (C) => {
    if (!i.current || !d.current || !c.current || !u.current) return;
    const g = i.current.getBoundingClientRect();
    p.current.x = (C.clientX - g.left) / g.width * 2 - 1, p.current.y = -((C.clientY - g.top) / g.height) * 2 + 1, h.current.setFromCamera(p.current, c.current);
    const F = h.current.intersectObjects(u.current.children);
    if (F.length > 0) {
      const j = F[0].object;
      if (v.current !== j) {
        if (v.current) {
          const T = v.current.material;
          T.opacity = v.current.userData.originalOpacity, T.color.copy(v.current.userData.originalColor);
        }
        v.current = j;
        const N = j.material;
        N.opacity = 1, N.color.set(30932);
      }
      a.current.style.cursor = "pointer";
    } else {
      if (v.current) {
        const j = v.current.material;
        j.opacity = v.current.userData.originalOpacity, j.color.copy(v.current.userData.originalColor), v.current = null;
      }
      a.current.style.cursor = "default";
    }
  }, _ = () => {
    if (v.current) {
      const C = v.current.material;
      C.opacity = v.current.userData.originalOpacity, C.color.copy(v.current.userData.originalColor), v.current = null;
    }
  }, o = (C) => {
    if (!i.current || !d.current || !c.current || !e) return;
    const g = i.current.getBoundingClientRect();
    p.current.x = (C.clientX - g.left) / g.width * 2 - 1, p.current.y = -((C.clientY - g.top) / g.height) * 2 + 1, h.current.setFromCamera(p.current, c.current);
    const F = h.current.intersectObjects(u.current.children);
    if (F.length > 0) {
      const j = F[0].object.name;
      y(j);
    }
  }, y = (C) => {
    if (!e) return;
    let g = C;
    C === "top-front-right" ? g = "se" : C === "top-front-left" ? g = "sw" : C === "top-back-right" ? g = "ne" : C === "top-back-left" && (g = "nw"), e.setView(g);
  };
  return /* @__PURE__ */ t(
    "div",
    {
      ref: a,
      style: {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: `${f}px`,
        height: `${f}px`,
        zIndex: 100,
        pointerEvents: "auto",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden"
      },
      onClick: o,
      onMouseMove: m,
      onMouseLeave: _,
      children: /* @__PURE__ */ t("canvas", { ref: i })
    }
  );
};
class za extends li {
  constructor(n) {
    super(n), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(n) {
    return { hasError: !0, error: n };
  }
  componentDidCatch(n, r) {
    console.error("ErrorBoundary捕获到错误:", n, r);
  }
  render() {
    if (this.state.hasError) {
      const { t: n, theme: r } = this.props;
      return /* @__PURE__ */ l("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: r.bg,
        color: r.text,
        fontFamily: pi,
        gap: "20px",
        padding: "40px",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ t("div", { style: { fontSize: "48px", lineHeight: 1 }, children: "⚠️" }),
        /* @__PURE__ */ t("h1", { style: { fontSize: "var(--font-size-title)", margin: 0, fontWeight: 700 }, children: n("error_title") }),
        /* @__PURE__ */ t("p", { style: { color: r.textMuted, maxWidth: "600px", lineHeight: "1.6", fontSize: "var(--font-size-body)" }, children: n("error_msg") }),
        /* @__PURE__ */ t(
          "button",
          {
            onClick: () => window.location.reload(),
            style: {
              padding: "10px 24px",
              backgroundColor: r.accent,
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "var(--font-size-body)",
              minHeight: "var(--control-h-md)"
            },
            children: n("error_reload")
          }
        )
      ] });
    }
    return this.props.children;
  }
}
function nt(e, n, r = {}) {
  const {
    storage: a = typeof window < "u" ? window.localStorage : void 0,
    serializer: i = JSON.stringify,
    parser: s = JSON.parse
  } = r, d = () => typeof n == "function" ? n() : n, [c, u] = I(() => {
    const h = d();
    if (!a) return h;
    try {
      const p = a.getItem(e);
      return p === null ? h : s(p);
    } catch (p) {
      return console.warn(`[usePersistentState] Failed to read "${e}"`, p), h;
    }
  });
  return Q(() => {
    if (a)
      try {
        a.setItem(e, i(c));
      } catch (h) {
        console.warn(`[usePersistentState] Failed to write "${e}"`, h);
      }
  }, [e, i, c, a]), [c, u];
}
function Da({
  fileSetIdRef: e,
  completedFileSetsRef: n,
  onProgress: r,
  onCompleted: a
}) {
  const i = q(null), s = q(null), d = R(() => {
    i.current = null;
    const u = s.current;
    if (!u) return;
    s.current = null;
    const { loaded: h, total: p } = u;
    r((f) => f.loaded === h && f.total === p ? f : { loaded: h, total: p });
    const v = e.current;
    h === p && p > 0 && v && (n.current.has(v) || (n.current.add(v), a()));
  }, [n, e, a, r]), c = R((u, h) => {
    s.current = { loaded: u, total: h }, i.current === null && (i.current = requestAnimationFrame(d));
  }, [d]);
  return Q(() => () => {
    i.current !== null && (cancelAnimationFrame(i.current), i.current = null), s.current = null;
  }, []), { onManagerChunkProgress: c };
}
function Jt(e) {
  return e.replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "").toLowerCase();
}
function vn(e) {
  const n = Jt(e), r = n.split("/"), a = r[r.length - 1];
  return Array.from(/* @__PURE__ */ new Set([
    n,
    a,
    `./${n}`,
    `./${a}`
  ]));
}
function Va(e) {
  const n = e.filter((i) => i instanceof File);
  if (n.length === 0) return null;
  const r = /* @__PURE__ */ new Map(), a = (i, s) => {
    !i || r.has(i) || r.set(i, URL.createObjectURL(s));
  };
  return n.forEach((i) => {
    a(Jt(i.name), i);
    const s = i.webkitRelativePath;
    if (s) {
      const d = s.split("/").slice(1).join("/");
      a(Jt(d), i);
    }
  }), {
    resolve: (i) => {
      if (!i || /^(blob:|data:|https?:)/i.test(i)) return i;
      for (const s of vn(i)) {
        const d = r.get(s);
        if (d) return d;
      }
      return i;
    },
    has: (i) => vn(i).some((s) => r.has(s)),
    dispose: () => {
      r.forEach((i) => URL.revokeObjectURL(i)), r.clear();
    }
  };
}
const Aa = {
  fetch: "reading",
  parse: "analyzing",
  normalize: "processing",
  optimize: "processing",
  addToScene: "processing"
}, Ba = {
  fetch: [0, 20],
  parse: [20, 58],
  normalize: [58, 72],
  optimize: [72, 92],
  addToScene: [92, 100]
}, Yt = /* @__PURE__ */ new Map();
let Qt = null;
async function Oa() {
  return Qt || (Qt = Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/DRACOLoader.js"),
    import("three/examples/jsm/loaders/KTX2Loader.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js")
  ]).then(([e, n, r, a]) => ({
    GLTFLoader: e.GLTFLoader,
    DRACOLoader: n.DRACOLoader,
    KTX2Loader: r.KTX2Loader,
    MeshoptDecoder: a.MeshoptDecoder
  }))), Qt;
}
function On(e) {
  if (!Yt.has(e)) {
    const n = e.replace(/\/$/, ""), r = typeof window < "u" ? new URL(n ? `${n}/` : "./", window.location.href).toString().replace(/\/$/, "") : n;
    Yt.set(e, r);
  }
  return Yt.get(e);
}
function Pa(e, n, r) {
  const a = Va(e), i = new M.LoadingManager();
  return a && i.setURLModifier((d) => a.resolve(d)), { manager: i, cleanup: () => {
    a?.dispose();
  }, resourceResolver: a };
}
async function Ia(e, n) {
  const { GLTFLoader: r, DRACOLoader: a, KTX2Loader: i, MeshoptDecoder: s } = await Oa(), d = On(n), c = typeof window < "u" && !!window.createImageBitmap;
  let u = null;
  const h = new a(e);
  h.setDecoderPath(`${d}/draco/gltf/`);
  const p = new i(e);
  if (p.setTranscoderPath(`${d}/basis/`), typeof document < "u")
    try {
      u = new M.WebGLRenderer({ canvas: document.createElement("canvas") }), p.detectSupport(u);
    } catch (f) {
      console.warn("[LoaderUtils] KTX2 detectSupport failed", f);
    }
  const v = new r(e);
  return v.setDRACOLoader(h), v.setMeshoptDecoder(s), c && v.setKTX2Loader(p), {
    loader: v,
    cleanup: () => {
      h.dispose(), p.dispose(), u?.dispose();
    }
  };
}
function $a(e, n, r, a, i) {
  return (s, d, c) => {
    const [u, h] = Ba[s], p = Math.min(100, Math.max(0, Number.isFinite(d) ? d : 0)), v = u + p / 100 * (h - u), f = a + v / 100 * i, b = c || `${n(Aa[s])} ${r}`;
    e(Math.round(f), b);
  };
}
async function Fa(e, n, r, a, i, s, d, c, u) {
  const h = Pa(a), { manager: p, cleanup: v, resourceResolver: f } = h;
  try {
    if (r === "lmb") {
      const { LMBLoader: b } = await import("./lmbLoader-9Jgmv6We.js"), m = new b();
      return i("parse", 0), await m.loadAsync(
        n,
        (_) => i("parse", _ * 100),
        { fastMode: (u.loadProfile ?? "balanced") === "max-speed" }
      );
    }
    if (r === "glb" || r === "gltf") {
      const { loader: b, cleanup: m } = await Ia(p, c);
      i("parse", 0);
      try {
        return (await new Promise((o, y) => {
          b.load(
            n,
            o,
            (C) => {
              C.total && C.total > 0 ? i("parse", C.loaded / C.total * 100) : i("parse", 50);
            },
            y
          );
        })).scene;
      } finally {
        m();
      }
    }
    if (r === "fbx") {
      const { FBXLoader: b } = await import("three/examples/jsm/loaders/FBXLoader.js"), m = new b(p);
      return i("parse", 0), await new Promise((_, o) => {
        m.load(
          n,
          _,
          (y) => {
            y.total && y.total > 0 ? i("parse", y.loaded / y.total * 100) : i("parse", 50);
          },
          o
        );
      });
    }
    if (r === "ifc") {
      const { loadIFC: b } = await import("./ifcLoader-i8P25jbv.js");
      i("parse", 0);
      const m = {
        ...d,
        deferIfcProperties: u.deferIfcProperties ?? !0
      };
      return await b(
        typeof e == "string" ? n : e,
        (_, o) => i("parse", _, o),
        s,
        c,
        m
      );
    }
    if (r === "obj") {
      const [{ OBJLoader: b }, { MTLLoader: m }] = await Promise.all([
        import("three/examples/jsm/loaders/OBJLoader.js"),
        import("three/examples/jsm/loaders/MTLLoader.js")
      ]), _ = new b(p), o = n.replace(/\.[^.]+$/i, ".mtl");
      if (f?.has(o))
        try {
          const y = await new Promise((C, g) => {
            new m(p).load(o, C, void 0, g);
          });
          y.preload(), _.setMaterials(y);
        } catch (y) {
          console.warn("[LoaderUtils] Failed to load companion MTL", y);
        }
      return i("parse", 0), await _.loadAsync(n, (y) => {
        y.total && y.total > 0 ? i("parse", y.loaded / y.total * 100) : i("parse", 50);
      });
    }
    if (r === "stl") {
      const { STLLoader: b } = await import("three/examples/jsm/loaders/STLLoader.js"), m = new b(p);
      i("parse", 0);
      const _ = await m.loadAsync(n, (o) => {
        o.total && o.total > 0 && i("parse", o.loaded / o.total * 100);
      });
      return new M.Mesh(_, new M.MeshStandardMaterial({ color: 8947848 }));
    }
    if (r === "ply") {
      const { PLYLoader: b } = await import("three/examples/jsm/loaders/PLYLoader.js"), m = new b(p);
      i("parse", 0);
      const _ = await m.loadAsync(n, (o) => {
        o.total && o.total > 0 && i("parse", o.loaded / o.total * 100);
      });
      return new M.Mesh(_, new M.MeshStandardMaterial({
        color: 8947848,
        vertexColors: _.hasAttribute("color")
      }));
    }
    if (r === "3mf") {
      const { ThreeMFLoader: b } = await import("three/examples/jsm/loaders/3MFLoader.js"), m = new b(p);
      return i("parse", 0), await m.loadAsync(n, (_) => {
        _.total && _.total > 0 && i("parse", _.loaded / _.total * 100);
      });
    }
    if (r === "stp" || r === "step" || r === "igs" || r === "iges") {
      i("fetch", 0);
      const b = typeof e == "string" ? await fetch(n).then((C) => C.arrayBuffer()) : await e.arrayBuffer(), _ = `${On(c)}/occt-import-js/occt-import-js.wasm`, { OCCTLoader: o } = await import("./occtLoader-CqjlQM7F.js"), y = new o(_);
      return i("parse", 0), await y.load(b, s, (C, g) => i("parse", C, g));
    }
    return null;
  } finally {
    v();
  }
}
function wn(e, n, r = "full") {
  let i = 0;
  e.traverse((s) => {
    if (s.isMesh) {
      if (r === "fast" && i >= 3200) return;
      const d = s;
      d.frustumCulled = n.frustumCulling ?? !0, i += 1, d.geometry.boundingBox || d.geometry.computeBoundingBox(), d.geometry.boundingSphere || d.geometry.computeBoundingSphere(), (Array.isArray(d.material) ? d.material : [d.material]).forEach((u) => {
        u && "wireframe" in u && (u.wireframe = !1);
      });
    }
  });
}
const Ta = async (e, n, r, a, i = "./libs", s = {}) => {
  const d = [], c = e.length;
  for (let u = 0; u < c && !s.isStale?.(); u++) {
    const h = e[u], p = typeof h == "string";
    let v = "", f = "", b = "";
    p ? (b = h, v = b.split("?")[0].split("#")[0].split("/").pop() || "model", f = v.split(".").pop()?.toLowerCase() || "") : (v = h.name, f = v.split(".").pop()?.toLowerCase() || "", b = URL.createObjectURL(h));
    const m = u / c * 100, _ = 100 / c, o = $a(n, r, v, m, _);
    try {
      o("fetch", 5);
      const y = await Fa(h, b, f, e, o, r, a, i, s);
      if (!y) continue;
      y.name = v, o("normalize", 30, `${r("processing")} ${v}`);
      const C = s.fastGeometrySanitize ?? !0;
      wn(y, a, C ? "fast" : "full"), C && setTimeout(() => {
        s.isStale?.() || wn(y, a, "full");
      }, 0), o("optimize", 100, `${r("analyzing")} ${v}`), o("addToScene", 100, `${r("success")} ${v}`), d.push(y);
    } catch (y) {
      console.error(`加载 ${v} 失败`, y);
    } finally {
      p || URL.revokeObjectURL(b);
    }
  }
  return n(100, r("analyzing")), d;
};
function Pn(e) {
  return e ? e.replace(/:\s*\d+%/g, "").replace(/\(\d+%\)/g, "").replace(/\d+%/g, "").trim() : "";
}
function Ra(e) {
  return e.map((r) => typeof r == "string" ? r : r.name).sort().join("|");
}
async function ja({
  items: e,
  manager: n,
  sceneSettings: r,
  libPath: a,
  t: i,
  onProgress: s,
  runtimeHints: d = {},
  isStale: c
}) {
  if (!e.length) return;
  const u = [], h = [];
  for (const f of e)
    (typeof f == "string" ? f.split("?")[0].split("#")[0] : f.name).toLowerCase().endsWith(".nbim") ? u.push(f) : h.push(f);
  for (const f of u) {
    if (c?.()) return;
    if (typeof f == "string") {
      const b = await fetch(f);
      if (!b.ok) throw new Error(`HTTP ${b.status} when fetching NBIM`);
      const m = await b.blob(), _ = f.split("?")[0].split("#")[0].split("/").pop() || "model.nbim", o = new File([m], _);
      await n.loadNbim(o, (y, C) => {
        s(y, C);
      });
    } else
      await n.loadNbim(f, (b, m) => {
        s(b, m);
      });
  }
  if (h.length === 0) return;
  const p = await Ta(
    h,
    s,
    i,
    r,
    a,
    {
      ...d,
      isStale: c
    }
  ), v = Math.max(p.length, 1);
  for (let f = 0; f < p.length; f++) {
    if (c?.()) return;
    const b = p[f], m = 92 + Math.round(f / v * 8);
    await n.addModel(b, (_, o) => {
      const y = Math.min(100, m + Math.round(_ / 100 * (8 / v)));
      s(y, o);
    });
  }
}
function Ua({
  managerRef: e,
  sceneSettings: n,
  libPath: r,
  t: a,
  setCurrentFileSetId: i,
  setLoading: s,
  setStatus: d,
  setProgress: c,
  setToast: u,
  updateTree: h
}) {
  const p = R(async (f) => {
    if (!f.length || !e.current) return;
    const b = e.current.beginLoadGeneration?.() ?? 0, m = e.current.getChunkOptions?.() || {};
    await ja({
      items: f,
      manager: e.current,
      sceneSettings: n,
      libPath: r,
      t: a,
      onProgress: (_, o) => {
        c(_), o && d(Pn(o));
      },
      runtimeHints: m,
      isStale: () => !e.current?.isLoadGenerationCurrent?.(b)
    });
  }, [r, e, n, c, d, a]);
  return {
    processFiles: R(async (f) => {
      if (!f.length || !e.current) return;
      const b = Ra(f);
      i(b), e.current.setChunkLoadingEnabled?.(!0), e.current.setContentVisible?.(!0), s(!0), d(a("loading")), c(0);
      try {
        if (await p(f), h(), f.some((_) => (typeof _ == "string" ? _ : _.name).toLowerCase().endsWith(".nbim"))) {
          const _ = e.current.getStats?.();
          if (_ && _.meshes <= 0)
            throw new Error("NBIM 加载完成但没有可渲染外形，请检查文件格式或分块数据");
        } else
          e.current?.fitView(!1);
        d(a("success"));
      } catch (m) {
        d(a("failed")), u({ message: `${a("failed")}: ${m.message}`, type: "error" });
      } finally {
        s(!1);
      }
    }, [p, e, i, s, c, d, u, a, h]),
    loadItemsIntoScene: p
  };
}
function Ha({ mgrInstance: e, showStats: n, setStats: r }) {
  Q(() => {
    if (!e || !n) return;
    const a = () => {
      document.visibilityState === "visible" && r(e.getStats());
    };
    a();
    const i = window.setInterval(a, 1e3);
    return document.addEventListener("visibilitychange", a), () => {
      window.clearInterval(i), document.removeEventListener("visibilitychange", a);
    };
  }, [e, r, n]);
}
function Wa(e, n) {
  return e.includes(n) ? e.filter((r) => r !== n) : [...e, n];
}
function Ga(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Xa() {
  const [e, n] = I([]), r = Ee(
    () => Ga(e),
    [e]
  ), a = R(() => {
    n([]);
  }, []), i = R((d) => {
    n([d]);
  }, []), s = R((d) => {
    n((c) => Wa(c, d));
  }, []);
  return {
    selectedUuids: e,
    selectedUuid: r,
    setSelectedUuids: n,
    clearSelection: a,
    setSingleSelection: i,
    toggleSelection: s
  };
}
function Ka({
  basicLabel: e,
  geoLabel: n,
  basicProps: r,
  geoProps: a,
  ifcProps: i,
  nbimProps: s,
  nbimLabel: d = "BIM 属性"
}) {
  const c = [
    {
      name: e,
      items: wt(e, r, "basic")
    },
    {
      name: n,
      items: wt(n, a, "geometry")
    }
  ];
  return i && c.push(...Ca(i, "ifc")), c;
}
function Ya(e, n, r) {
  let a = r === (n?.uuid || n?.id) && n instanceof M.Object3D ? n : e.contentGroup.getObjectByProperty("uuid", r);
  if (!a) {
    const i = e.getStructureNodes(r);
    i && i.length > 0 && (a = i[0]);
  }
  return a || n;
}
function Qa(e) {
  if (typeof e?.userData?.ifcMetadata?.elevation == "number")
    return e.userData.ifcMetadata.elevation;
  if (!(e instanceof M.Object3D)) return;
  let n = e;
  for (; n; ) {
    const r = n.userData?.ifcMetadata?.elevation;
    if (typeof r == "number" && Number.isFinite(r))
      return r;
    n = n.parent;
  }
}
async function qa(e, n) {
  const a = ((i) => {
    let s = i instanceof M.Object3D ? i : null, d = i?.userData?.expressID;
    for (; s; ) {
      if (s.userData?.expressID !== void 0 && d === void 0 && (d = s.userData.expressID), s.userData?.ifcManager && s.userData?.modelID !== void 0)
        return {
          ifcRoot: s,
          expressID: d
        };
      s = s.parent;
    }
    return null;
  })(e);
  if (!a?.ifcRoot || a.expressID === void 0) return null;
  try {
    const i = `${a.ifcRoot.userData.modelID}:${a.expressID}`, s = n.get(i);
    if (s) return s;
    const c = await a.ifcRoot.userData.ifcManager.getItemProperties(a.ifcRoot.userData.modelID, a.expressID), u = c?.rawGroups || c?.groups || c?.normalizedGroups || null;
    return u && n.set(i, u), u;
  } catch (i) {
    return console.error("IFC Props Error", i), null;
  }
}
function Ja({
  sceneManager: e,
  focusUuid: n,
  target: r,
  t: a,
  ifcGroups: i,
  clashSummary: s,
  isDev: d = !1
}) {
  const c = {}, u = {}, h = Qa(r), p = [r?.name, r?.userData?.name].find((_) => typeof _ == "string" && _.trim().length > 0), v = e.getBimIdByUuid(n) || n;
  if (p && (c[a("prop_name")] = p), c[a("prop_id")] = v, c[a("prop_type")] = r.type || (r.children ? "Group" : "Mesh"), typeof h == "number" && Number.isFinite(h) && (c[a("prop_storey_elevation")] = String(h)), r.getWorldPosition) {
    const _ = new M.Vector3();
    r.getWorldPosition(_), u[a("prop_pos")] = `${_.x.toFixed(2)}, ${_.y.toFixed(2)}, ${_.z.toFixed(2)}`;
  }
  if (r.isMesh || r.type === "Mesh") {
    if (r instanceof M.Mesh) {
      const o = new M.Box3().setFromObject(r), y = new M.Vector3();
      o.getSize(y), u[a("prop_dim")] = `${y.x.toFixed(2)} x ${y.y.toFixed(2)} x ${y.z.toFixed(2)}`, r.geometry && (u[a("prop_vert")] = (r.geometry.attributes.position?.count || 0).toLocaleString(), u[a("prop_tri")] = r.geometry.index ? (r.geometry.index.count / 3).toLocaleString() : ((r.geometry.attributes.position?.count || 0) / 3).toLocaleString());
    } else if (r.userData?.boundingBox) {
      const o = new M.Vector3();
      r.userData.boundingBox.getSize(o), u[a("prop_dim")] = `${o.x.toFixed(2)} x ${o.y.toFixed(2)} x ${o.z.toFixed(2)}`;
    }
    r.isInstancedMesh && (u[a("prop_inst")] = r.count.toLocaleString());
    const _ = e.getObjectGeometryData(n);
    _.area > 0 && (u[a("prop_area")] = _.area.toFixed(3)), _.volume > 0 && (u[a("prop_volume")] = _.volume.toFixed(3));
  } else if (r.userData?.boundingBox) {
    const _ = new M.Vector3();
    r.userData.boundingBox.getSize(_), u[a("prop_dim")] = `${_.x.toFixed(2)} x ${_.y.toFixed(2)} x ${_.z.toFixed(2)}`;
  }
  const f = e.getNbimProperties(n), b = e.getNbimIfcPropertyGroups(n, "raw");
  d && f && Object.keys(f).length > 0 && (console.group(`NBIM 选中属性: ${n}`), console.log(f), console.log(JSON.stringify(f, null, 2)), console.groupEnd()), d && b && (console.group(`NBIM IFC 组属性: ${n}`), console.log(b), console.log(JSON.stringify(b, null, 2)), console.groupEnd());
  const m = Ka({
    basicLabel: a("pg_basic"),
    geoLabel: a("pg_geo"),
    basicProps: c,
    geoProps: u,
    ifcProps: i || b || null,
    nbimProps: null
  });
  if (s) {
    const _ = a("pg_clash");
    m.push({
      name: _,
      items: wt(_, [
        { key: a("clash_group_all"), value: String(s.total) },
        { key: a("clash_group_new"), value: String(s.newCount) },
        { key: a("clash_group_confirmed"), value: String(s.confirmedCount) },
        { key: a("clash_group_resolved"), value: String(s.resolvedCount) },
        { key: a("prop_status"), value: a(`clash_group_${s.worstStatus}`) }
      ].map((o, y) => ({ ...o, id: `clash-summary::${y}` })))
    });
  }
  return m;
}
function Za({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  setSelectedProps: a,
  setHiddenUuids: i,
  setIsolatedUuids: s,
  updateTree: d,
  propOnSelect: c,
  ifcPropertyCacheRef: u,
  clashSummaryByUuid: h,
  focusObjectsInView: p,
  t: v,
  isDev: f = !1
}) {
  const [b, m] = I(null), [_, o] = I([]), y = R(() => {
    m(null), o([]);
  }, []), C = R(async (N, T, x = !1) => {
    const L = e.current;
    if (!L) return;
    if (!N) {
      r([]), a(null), L.highlightObjects([]);
      return;
    }
    const S = N.uuid || N.id, O = L.resolveSelectionUuid(S);
    if (!O) return;
    const z = x ? n.includes(O) ? n.filter((V) => V !== O) : [...n, O] : [O];
    r(z), L.highlightObjects(z);
    const U = z[z.length - 1];
    if (!U) {
      a(null);
      return;
    }
    c?.(U, N);
    const P = Ya(L, N, U), H = await qa(P, u.current || /* @__PURE__ */ new Map()), W = Ja({
      sceneManager: L,
      focusUuid: U,
      target: P,
      t: v,
      ifcGroups: H,
      clashSummary: h[U],
      isDev: f
    });
    a(W);
  }, [
    h,
    u,
    f,
    c,
    e,
    n,
    a,
    r,
    v
  ]), g = R((N) => {
    const T = e.current;
    if (!T || !N) return !1;
    const x = N.uuid || N.id;
    if (!x) return !1;
    const L = T.resolveSelectionUuid(x);
    return !L || !T.getBoundsForObject(L) ? !1 : (m(L), p({ uuids: [L], focusUuid: L, updateSelection: !1 }));
  }, [p, e]), F = R((N) => {
    if (!!(_.length === N.length && _.every((L, S) => L === N[S]))) return;
    o(N);
    const x = e.current;
    !x || N.length > 0 || x.clearLocateFocus();
  }, [_, e]), j = R(() => {
    y(), e.current?.clearLocateFocus(), e.current?.highlightObjects(n);
  }, [y, e, n]);
  return {
    locatedUuid: b,
    locateResultUuids: _,
    resetLocateState: y,
    handleSelect: C,
    handleLocateObject: g,
    handleLocateResultsChange: F,
    handleClearLocate: j
  };
}
function eo({
  sceneMgrRef: e,
  t: n,
  setLoading: r,
  setProgress: a,
  setStatus: i,
  setToast: s,
  setActiveTool: d,
  setConfirmState: c,
  setSelectedUuids: u,
  setSelectedProps: h,
  setChunkProgress: p,
  resetLocateState: v,
  clearSearchResult: f,
  resetClashState: b,
  resetMeasurementState: m,
  resetExplodeState: _,
  updateTree: o,
  ifcPropertyCacheRef: y,
  completedFileSetsRef: C
}) {
  const g = R(() => {
    const L = e.current;
    if (!L) return [];
    const S = [];
    return L.contentGroup.children.forEach((O) => {
      if (O.userData?.isOptimizedGroup || O.name.startsWith("optimized_")) return;
      const z = (typeof O.userData?.modelName == "string" ? O.userData.modelName : "") || O.children?.[0]?.name || "" || O.name, U = gn(Ut(z));
      S.push(U);
    }), Array.from(new Set(S));
  }, [e]), F = R((L) => {
    const S = g();
    if (S.length === 1)
      return S[0];
    const O = /* @__PURE__ */ new Date(), z = (P) => String(P).padStart(2, "0"), U = `${O.getFullYear()}${z(O.getMonth() + 1)}${z(O.getDate())}_${z(O.getHours())}${z(O.getMinutes())}${z(O.getSeconds())}`;
    return `${n("export_batch_name")}_${U}`;
  }, [g, n]), j = R((L, S) => {
    const O = F(L);
    return `${gn(Ut((S || "").trim()) || O)}.${L}`;
  }, [F]), N = R(async (L, S) => {
    const O = e.current;
    if (!O) return;
    const z = O.contentGroup, U = j(L, S), P = Ut(U);
    if (L === "nbim") {
      if (z.children.length === 0) {
        s({ message: n("no_models"), type: "info" });
        return;
      }
      r(!0), i(`${n("processing")}...`), d("none"), window.setTimeout(async () => {
        try {
          await e.current?.exportNbim(P), s({ message: n("success"), type: "success" });
        } catch (V) {
          console.error(V), s({ message: `${n("failed")}: ${V.message}`, type: "error" });
        } finally {
          r(!1);
        }
      }, 100);
      return;
    }
    const H = z.children.filter((V) => !V.userData.isOptimizedGroup);
    if (H.length === 0) {
      s({ message: n("no_models"), type: "info" });
      return;
    }
    const W = new M.Group();
    H.forEach((V) => W.add(V.clone())), r(!0), a(0), i(`${n("processing")}...`), d("none"), window.setTimeout(async () => {
      try {
        let V = null;
        if (L === "glb" ? V = await ci(W) : L === "lmb" && (V = await ui(W, (E) => i(Pn(E)))), V) {
          const E = URL.createObjectURL(V), $ = document.createElement("a");
          $.href = E, $.download = U, $.click(), URL.revokeObjectURL(E), s({ message: n("success"), type: "success" });
        }
      } catch (V) {
        console.error(V), s({ message: `${n("failed")}: ${V.message}`, type: "error" });
      } finally {
        r(!1), a(0);
      }
    }, 100);
  }, [j, e, d, r, a, i, s, n]), T = R(async () => {
    e.current && c({
      isOpen: !0,
      title: n("op_clear"),
      message: n("confirm_clear"),
      action: async () => {
        r(!0), a(0), i(`${n("op_clear")}...`);
        try {
          await e.current?.clear(), u([]), v(), h(null), f(), b(), y.current.clear(), m(), p({ loaded: 0, total: 0 }), C.current.clear(), _(), o(), i(n("ready"));
        } catch (S) {
          console.error("清空场景失败:", S);
        } finally {
          r(!1);
        }
      }
    });
  }, [
    f,
    C,
    y,
    b,
    _,
    v,
    m,
    e,
    p,
    c,
    r,
    a,
    h,
    u,
    i,
    n,
    o
  ]), x = R((L = "scene") => {
    const S = e.current;
    if (S)
      try {
        const O = S.renderer, z = S.scene, U = z.background;
        L === "transparent" ? (z.background = null, O.setClearAlpha(0)) : O.setClearAlpha(1), O.render(z, S.camera);
        const P = S.canvas.toDataURL("image/png"), H = document.createElement("a");
        H.href = P, H.download = L === "transparent" ? "screenshot-transparent.png" : "screenshot.png", H.click(), z.background = U, O.setClearAlpha(1), O.render(z, S.camera), s({ message: n("success"), type: "success" });
      } catch (O) {
        console.error(O), s({ message: n("failed"), type: "error" });
      }
  }, [e, s, n]);
  return {
    getDefaultExportFileName: F,
    handleExport: N,
    handleClear: T,
    handleScreenshot: x
  };
}
function to({
  sceneMgrRef: e,
  canvasRef: n,
  activeTool: r,
  setActiveTool: a,
  measureType: i,
  setMeasureType: s,
  pickEnabled: d,
  selectedUuids: c,
  setSelectedUuids: u,
  setSelectedProps: h,
  setMousePos: p,
  setHighlightedMeasureId: v,
  handleSelect: f,
  handleContextMenu: b,
  handleUndoVisibility: m,
  clearSelectionState: _
}) {
  const o = q(null), y = q(null), C = q(null);
  Q(() => {
    const g = e.current, F = n.current;
    if (!g || !F) return;
    const j = 6, N = (S) => {
      o.current = {
        x: S.clientX,
        y: S.clientY,
        moved: !1,
        button: S.button
      };
    }, T = (S) => {
      const O = o.current;
      if (!O || O.button !== 0 || O.moved) {
        o.current = null;
        return;
      }
      if (o.current = null, r !== "boxSelect") {
        if (r === "measure") {
          if (i !== "none") {
            const U = g.getRayIntersects(S.clientX, S.clientY);
            if (U) {
              const P = U.object.uuid;
              g.addMeasurePoint(U.point, P);
              return;
            }
          }
          const z = g.pickMeasurement(S.clientX, S.clientY);
          if (z) {
            v(z), g.highlightMeasurement(z);
            return;
          }
          v(null), g.highlightMeasurement(null);
          return;
        }
        if (d) {
          const z = g.pick(S.clientX, S.clientY);
          f(z ? z.object : null, z ? z.intersect : null, S.ctrlKey);
        }
      }
    }, x = (S) => {
      if (o.current && !o.current.moved) {
        const O = S.clientX - o.current.x, z = S.clientY - o.current.y;
        O * O + z * z > j * j && (o.current.moved = !0);
      }
      if (r === "measure") {
        g.updateMeasureHover(S.clientX, S.clientY), p(null);
        return;
      }
      if (S.buttons !== 0) {
        C.current = null, y.current !== null && (cancelAnimationFrame(y.current), y.current = null), p(null);
        return;
      }
      C.current = { x: S.clientX, y: S.clientY }, y.current === null && (y.current = requestAnimationFrame(() => {
        y.current = null;
        const O = C.current;
        if (!O) return;
        const z = g.getRayIntersects(O.x, O.y);
        p(z ? z.point : null);
      }));
    }, L = (S) => {
      if ((S.key === "z" || S.key === "Z") && (S.ctrlKey || S.metaKey)) {
        m();
        return;
      }
      S.key === "Escape" && (r === "measure" && i !== "none" && (s("none"), g.startMeasurement("none")), r === "boxSelect" && (g.cancelBoxSelect(), a("none")), _());
    };
    return F.addEventListener("mousedown", N), F.addEventListener("click", T), F.addEventListener("mousemove", x), F.addEventListener("contextmenu", b), window.addEventListener("keydown", L), () => {
      y.current !== null && (cancelAnimationFrame(y.current), y.current = null), C.current = null, F.removeEventListener("mousedown", N), F.removeEventListener("click", T), F.removeEventListener("mousemove", x), F.removeEventListener("contextmenu", b), window.removeEventListener("keydown", L);
    };
  }, [
    r,
    n,
    _,
    b,
    f,
    m,
    i,
    d,
    e,
    a,
    v,
    s,
    p
  ]), Q(() => {
    const g = e.current, F = n.current;
    if (!g || !F || r !== "boxSelect") return;
    g.controls.mouseButtons.LEFT = void 0;
    const j = (x) => {
      x.button === 0 && g.startBoxSelect(x.clientX, x.clientY);
    }, N = (x) => {
      g.updateBoxSelect(x.clientX, x.clientY);
    }, T = (x) => {
      if (x.button !== 0) return;
      const L = g.endBoxSelect();
      if (L.length > 0) {
        const S = x.shiftKey ? [.../* @__PURE__ */ new Set([...c, ...L])] : L;
        u(S), h(null), g.highlightObjects(S);
      }
    };
    return F.addEventListener("pointerdown", j), window.addEventListener("pointermove", N), window.addEventListener("pointerup", T), () => {
      F.removeEventListener("pointerdown", j), window.removeEventListener("pointermove", N), window.removeEventListener("pointerup", T), g.controls && (g.controls.mouseButtons.LEFT = M.MOUSE.ROTATE), g.cancelBoxSelect();
    };
  }, [r, n, e, c, h, u]);
}
const no = [
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
function ro({
  sceneMgrRef: e,
  t: n,
  processFiles: r,
  loadItemsIntoScene: a,
  setLoading: i,
  setStatus: s,
  setProgress: d,
  setToast: c,
  setActiveTool: u,
  setSelectedUuids: h,
  setSelectedProps: p,
  resetMeasurementState: v,
  updateTree: f,
  isDev: b
}) {
  const m = R(async (g) => {
    g.target.files?.length && (await r(Array.from(g.target.files)), g.target.value = "");
  }, [r]), _ = R(async (g) => {
    const F = e.current;
    if (!g.target.files?.length || !F) return;
    const j = Array.from(g.target.files);
    if (g.target.value = "", j.filter((T) => T.name.toLowerCase().endsWith(".nbim")).length > 0) {
      c({ message: n("unsupported_format"), type: "info" });
      return;
    }
    F.setChunkLoadingEnabled?.(!1), F.setContentVisible?.(!1), i(!0), s(`${n("processing")}...`), d(0), u("none");
    try {
      await F.clear(), h([]), p(null), v(), f(), await a(j), f(), s(`${n("processing")}...`), await F.exportNbim(), s(n("success")), c({ message: n("success"), type: "success" });
    } catch (T) {
      console.error("[ThreeViewer] handleBatchConvert error:", T), s(n("failed")), c({ message: `${n("failed")}: ${T.message}`, type: "error" });
    } finally {
      try {
        await e.current?.clear(), f();
      } catch {
      }
      e.current?.setChunkLoadingEnabled?.(!0), e.current?.setContentVisible?.(!0), i(!1);
    }
  }, [
    a,
    v,
    e,
    u,
    i,
    d,
    p,
    h,
    s,
    c,
    n,
    f
  ]), o = R(async () => {
    const g = window.prompt(n("menu_open_url"), "http://");
    if (!(!g || !g.startsWith("http"))) {
      b && console.log("[ThreeViewer] handleOpenUrl called with:", g), i(!0), s(`${n("processing")}...`);
      try {
        await r([g]);
      } catch (F) {
        console.error("[ThreeViewer] handleOpenUrl error:", F), s(n("failed")), c({ message: `${n("failed")}: ${F.message}`, type: "error" });
      } finally {
        i(!1);
      }
    }
  }, [b, r, i, s, c, n]), y = R((g) => {
    g.preventDefault(), g.stopPropagation();
  }, []), C = R(async (g) => {
    if (g.preventDefault(), g.stopPropagation(), !g.dataTransfer.files?.length) return;
    const F = Array.from(g.dataTransfer.files), j = F.filter((N) => {
      const T = N.name.substring(N.name.lastIndexOf(".")).toLowerCase();
      return no.includes(T);
    });
    j.length < F.length && c({ message: n("unsupported_format"), type: "info" }), j.length > 0 && await r(j);
  }, [r, c, n]);
  return {
    handleOpenFiles: m,
    handleBatchConvert: _,
    handleOpenUrl: o,
    handleDragOver: y,
    handleDrop: C
  };
}
function io(e) {
  const {
    propShowOutline: n,
    propShowProperties: r,
    setShowOutline: a,
    setShowProps: i
  } = e, [s, d] = I(260), [c, u] = I(300), h = q(!1), p = q(!1);
  return Q(() => {
    n !== void 0 && a(n);
  }, [n, a]), Q(() => {
    r !== void 0 && i(r);
  }, [r, i]), Q(() => {
    const v = (b) => {
      if (h.current && d(Math.max(150, Math.min(500, b.clientX))), p.current) {
        const m = window.innerWidth - b.clientX;
        u(Math.max(200, Math.min(600, m)));
      }
    }, f = () => {
      h.current = !1, p.current = !1;
    };
    return window.addEventListener("mousemove", v), window.addEventListener("mouseup", f), () => {
      window.removeEventListener("mousemove", v), window.removeEventListener("mouseup", f);
    };
  }, []), {
    leftWidth: s,
    rightWidth: c,
    resizingLeft: h,
    resizingRight: p
  };
}
const ao = { x: [0, 100], y: [0, 100], z: [0, 100] }, oo = { x: !1, y: !1, z: !1 };
function so({ initialSettings: e, mgrInstance: n }) {
  const [r, a] = I("none"), [i, s] = I(!1), [d, c] = I(32), [u, h] = I("radial"), [p, v] = I("none"), [f, b] = I([]), [m, _] = I(null), [o, y] = I(!1), [C, g] = I(ao), [F, j] = I(oo), [N, T] = nt(
    "3dbrowser_clipHelperVisible",
    e?.clip?.helperVisible ?? !1,
    {
      serializer: (P) => String(P),
      parser: (P) => P === "true"
    }
  ), [x, L] = nt(
    "3dbrowser_clipHelperOpacity",
    e?.clip?.helperOpacity ?? 0.12,
    {
      serializer: (P) => String(P),
      parser: (P) => {
        const H = Number(P);
        return Number.isFinite(H) ? H : 0.12;
      }
    }
  ), S = Ee(
    () => Math.min(0.35, Math.max(0.05, x)),
    [x]
  );
  return Q(() => {
    S !== x && L(S);
  }, [x, S, L]), Q(() => {
    n && n.setClipHelperOptions({
      visible: N,
      opacity: S
    });
  }, [N, n, S]), Q(() => {
    n && r !== "measure" && (n.clearMeasurementPreview(), n.highlightMeasurement(null), _(null), v("none"));
  }, [r, n]), Q(() => {
    if (!n || (n.setClippingEnabled(o), !o)) return;
    let P = n.computeTotalBounds(!0);
    P.isEmpty() && (P = n.computeTotalBounds(!1)), P.isEmpty() || n.updateClippingPlanes(P, C, F);
  }, [F, o, C, n]), Q(() => {
    n && n.startMeasurement(p);
  }, [p, n]), Q(() => {
    n && n.setExplodeEnabled(i);
  }, [i, n]), Q(() => {
    n && n.setExplodeStrength(d);
  }, [d, n]), Q(() => {
    n && n.setExplodeMode(u);
  }, [u, n]), {
    activeTool: r,
    setActiveTool: a,
    explodeEnabled: i,
    setExplodeEnabled: s,
    explodeStrength: d,
    setExplodeStrength: c,
    explodeMode: u,
    setExplodeMode: h,
    resetExplodeState: () => {
      s(!1), c(32), h("radial");
    },
    measureType: p,
    setMeasureType: v,
    measureHistory: f,
    setMeasureHistory: b,
    highlightedMeasureId: m,
    setHighlightedMeasureId: _,
    resetMeasurementState: () => {
      b([]), _(null), v("none");
    },
    handleMeasureUpdate: (P) => {
      b(P.map((H) => ({ id: H.id, type: H.type, val: H.val })));
    },
    clipEnabled: o,
    setClipEnabled: y,
    clipValues: C,
    setClipValues: g,
    clipActive: F,
    setClipActive: j,
    clipHelperVisible: N,
    setClipHelperVisible: T,
    clipHelperOpacity: S,
    setClipHelperOpacity: L
  };
}
const zt = 400;
function lo() {
  return new Promise((e) => {
    window.requestAnimationFrame(() => e());
  });
}
function co({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  setSelectedProps: a,
  updateTree: i,
  resetLocateState: s
}) {
  const [d, c] = I({
    x: 0,
    y: 0,
    visible: !1
  }), [u, h] = I(/* @__PURE__ */ new Set()), [p, v] = I(/* @__PURE__ */ new Set()), f = q([]), b = R(() => {
    c((N) => ({ ...N, visible: !1 }));
  }, []), m = R((N) => {
    N.preventDefault(), N.stopPropagation(), c({
      x: N.clientX,
      y: N.clientY,
      visible: !0
    });
  }, []), _ = R(() => {
    const N = e.current;
    if (!N || n.length === 0) return;
    const T = n.map((L) => {
      const S = N.contentGroup.getObjectByProperty("uuid", L);
      return { uuid: L, visible: S ? S.visible : !0 };
    });
    f.current.push(T);
    const x = [...n];
    r([]), a(null), N.highlightObjects([]), b(), (async () => {
      for (let O = 0; O < x.length; O += zt) {
        const z = x.slice(O, O + zt), U = O + zt >= x.length;
        N.setObjectsVisibility(z, !1, { deferRefresh: !U }), O + zt < x.length && await lo();
      }
      const L = new Set(u), S = new Set(p);
      x.forEach((O) => {
        L.add(O), S.delete(O);
      }), h(L), v(S), i();
    })();
  }, [
    b,
    u,
    p,
    e,
    n,
    a,
    r,
    i
  ]), o = R(() => {
    const N = e.current;
    N && ((u.size > 0 || p.size > 0) && (N.setAllVisibility(!0), h(/* @__PURE__ */ new Set()), v(/* @__PURE__ */ new Set()), i()), s(), N.clearLocateFocus(), b());
  }, [b, u, p, s, e, i]), y = R((N, T) => {
    const x = e.current;
    if (!x) return;
    f.current.push([{ uuid: N, visible: !T }]), x.setObjectVisibility(N, T);
    const L = new Set(u);
    T ? L.delete(N) : L.add(N), h(L), i();
  }, [u, e, i]), C = R((N) => {
    const T = e.current;
    T && (f.current.push([{ uuid: N, visible: !0 }]), T.setObjectVisibility(N, !1), h((x) => new Set(x).add(N)), r((x) => x.filter((L) => L !== N)), i());
  }, [e, r, i]), g = R((N) => {
    const T = e.current;
    T && (T.isolateObjects([N]), h(/* @__PURE__ */ new Set()), v(/* @__PURE__ */ new Set([N])), r([N]), T.highlightObjects([N]), i(), b());
  }, [b, e, r, i]), F = R(() => {
    const N = e.current;
    if (!N || n.length === 0) return;
    const T = n.filter((x) => !p.has(x));
    T.length > 0 && (N.isolateObjects(n), v(/* @__PURE__ */ new Set([...p, ...T])), h(/* @__PURE__ */ new Set()), i()), b();
  }, [b, p, e, n, i]), j = R(() => {
    const N = e.current;
    if (!N || f.current.length === 0) return;
    const T = f.current.pop();
    if (!T) return;
    N.applyVisibilityBatch(T, {
      recomputeBounds: !0,
      refreshExplode: !1,
      invalidateInteractables: !0
    });
    const x = new Set(u);
    T.forEach((L) => {
      L.visible ? x.delete(L.uuid) : x.add(L.uuid);
    }), h(x), i();
  }, [u, e, i]);
  return {
    contextMenu: d,
    hiddenUuids: u,
    isolatedUuids: p,
    setHiddenUuids: h,
    setIsolatedUuids: v,
    handleContextMenu: m,
    closeContextMenu: b,
    handleHideSelected: _,
    handleShowAll: o,
    handleToggleVisibility: y,
    handleHideObject: C,
    handleIsolateObject: g,
    handleIsolateSelection: F,
    handleUndoVisibility: j
  };
}
function uo({
  currentFileSetId: e,
  sceneMgrRef: n,
  setToast: r,
  setConfirmState: a,
  t: i,
  captureStateSnapshot: s,
  restoreStateSnapshot: d
}) {
  const [c, u] = I([]);
  Q(() => {
    if (!e) {
      u([]);
      return;
    }
    try {
      const o = localStorage.getItem(`viewpoints_${e}`);
      u(o ? JSON.parse(o) : []);
    } catch (o) {
      console.error("Failed to load viewpoints", o), u([]);
    }
  }, [e]);
  const h = R((o) => {
    if (e) {
      u(o);
      try {
        localStorage.setItem(`viewpoints_${e}`, JSON.stringify(o));
      } catch (y) {
        console.error("Failed to persist viewpoints", y);
      }
    }
  }, [e]), p = R(() => {
    const o = n.current;
    if (!o) return "";
    try {
      o.renderer.render(o.scene, o.camera);
      const y = o.canvas, C = Math.min(640 / y.width, 360 / y.height), g = Math.round(y.width * C), F = Math.round(y.height * C), j = document.createElement("canvas");
      j.width = g, j.height = F;
      const N = j.getContext("2d");
      return N ? (N.drawImage(y, 0, 0, g, F), j.toDataURL("image/jpeg", 0.92)) : "";
    } catch (y) {
      return console.error("Failed to capture thumbnail", y), "";
    }
  }, [n]), v = R((o, y = {
    visibility: !0,
    selection: !0,
    clip: !0,
    explode: !0
  }, C) => {
    const g = n.current;
    if (!g || !e) {
      r({ message: i("no_models"), type: "info" });
      return;
    }
    if (g.contentGroup.children.length === 0) {
      r({ message: i("no_models"), type: "info" });
      return;
    }
    const F = o || `${i("viewpoint_title")} ${c.length + 1}`, j = g.getCameraState(), N = p(), T = s(y), x = C ? c.map((L) => L.id === C ? { ...L, name: F, cameraState: j, image: N, saveOptions: y, stateSnapshot: T } : L) : [...c, { id: Date.now().toString(), name: F, cameraState: j, image: N, saveOptions: y, stateSnapshot: T }];
    h(x), r({ message: i("success"), type: "success" });
  }, [s, p, e, h, n, r, i, c]), f = R((o, y) => {
    h(c.map((C) => C.id === o ? { ...C, name: y } : C));
  }, [h, c]), b = R(async (o) => {
    o.cameraState && (n.current?.setCameraState(o.cameraState), await d(o.stateSnapshot), r({ message: `${i("viewpoint_loading")}: ${o.name}`, type: "info" }));
  }, [d, n, r, i]), m = R((o) => {
    const y = c.find((C) => C.id === o);
    y && v(
      y.name,
      y.saveOptions || {
        visibility: !0,
        selection: !0,
        clip: !0,
        explode: !0
      },
      o
    );
  }, [v, c]), _ = R((o) => {
    const y = c.find((C) => C.id === o);
    a({
      isOpen: !0,
      title: i("viewpoint_title"),
      message: `${i("confirm_delete")} "${y?.name || i("viewpoint_default_name")}"?`,
      action: () => {
        h(c.filter((C) => C.id !== o));
      }
    });
  }, [h, a, i, c]);
  return {
    viewpoints: c,
    handleSaveViewpoint: v,
    handleUpdateViewpointName: f,
    handleLoadViewpoint: b,
    handleOverwriteViewpoint: m,
    handleDeleteViewpoint: _
  };
}
const xn = [".lmb", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3ds", ".dae", ".stp", ".step", ".igs", ".iges"], Cn = [
  "ResizeObserver loop completed",
  "ResizeObserver loop limit",
  "texImage3D: FLIP_Y or PREMULTIPLY_ALPHA"
];
function ho({
  allowDragOpen: e,
  mgrInstance: n,
  viewportRef: r,
  t: a,
  processFiles: i,
  setToast: s,
  setErrorState: d
}) {
  Q(() => {
    if (!r.current || !n) return;
    const c = new ResizeObserver((h) => {
      const p = h[0];
      if (!p) return;
      const { width: v, height: f } = p.contentRect;
      v === 0 || f === 0 || requestAnimationFrame(() => {
        n.resize(v, f);
      });
    });
    c.observe(r.current);
    const u = () => {
      if (!r.current) return;
      const h = r.current.getBoundingClientRect();
      n.resize(h.width, h.height);
    };
    return window.addEventListener("resize", u), () => {
      c.disconnect(), window.removeEventListener("resize", u);
    };
  }, [n, r]), Q(() => {
    const c = (h) => {
      e && (h.preventDefault(), h.stopPropagation());
    }, u = async (h) => {
      if (!e) return;
      h.preventDefault(), h.stopPropagation();
      const p = h.dataTransfer?.files ? Array.from(h.dataTransfer.files) : [];
      if (p.length === 0) return;
      const v = p.filter((b) => {
        const m = `.${b.name.split(".").pop()?.toLowerCase()}`;
        return !xn.includes(m);
      });
      v.length > 0 && s({
        message: `${a("failed")}: 不支持的格式 - ${v.map((b) => b.name).join(", ")}`,
        type: "error"
      });
      const f = p.filter((b) => {
        const m = `.${b.name.split(".").pop()?.toLowerCase()}`;
        return xn.includes(m);
      });
      f.length > 0 && await i(f);
    };
    return window.addEventListener("dragover", c), window.addEventListener("drop", u), () => {
      window.removeEventListener("dragover", c), window.removeEventListener("drop", u);
    };
  }, [e, i, s, a]), Q(() => {
    const c = (h) => {
      const p = h.message || "";
      !p && !h.error || Cn.some((v) => p.includes(v)) || (console.error("Global Error:", h.error || p), d({
        isOpen: !0,
        title: a("failed"),
        message: p || "An unexpected error occurred",
        detail: h.error?.stack || ""
      }));
    }, u = (h) => {
      if (!h.reason) return;
      const p = h.reason?.message || String(h.reason);
      Cn.some((v) => p.includes(v)) || (console.error("Unhandled Rejection:", h.reason), d({
        isOpen: !0,
        title: a("failed"),
        message: p || "A promise was rejected without reason",
        detail: h.reason?.stack || ""
      }));
    };
    return window.addEventListener("error", c), window.addEventListener("unhandledrejection", u), () => {
      window.removeEventListener("error", c), window.removeEventListener("unhandledrejection", u);
    };
  }, [d, a]);
}
function pt(e, n, r, a) {
  r && e.push(...wt(n, r, a));
}
function Nn(e, n, r, a) {
  Object.entries(n).forEach(([i, s]) => {
    if (Array.isArray(s) || typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
      pt(r, e, [{ key: i, value: s, source: a }], a);
      return;
    }
    s && typeof s == "object" && Object.entries(s).forEach(([d, c]) => {
      pt(r, e, [{ key: `${i}.${d}`, value: c, rawKey: d, source: a }], a);
    });
  });
}
function po({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  onSelectObject: a,
  focusObjectsInView: i,
  t: s,
  setToast: d
}) {
  const [c, u] = I([
    { id: "cond_init", propertyName: "", operator: "contains", value: "" }
  ]), [h, p] = I([]), [v, f] = I(!1), [b, m] = I(0), [_, o] = I(""), y = q(0), C = q(!1), g = R((z, U) => {
    let P = U;
    for (; P; ) {
      const W = P.userData?.originalUuid || P.userData?.modelUuid || P.userData?.rootUuid;
      if (W) return String(W);
      P = P.parent;
    }
    const H = e.current?.getStructureNodes(z)?.[0];
    return H?.userData?.originalUuid ? String(H.userData.originalUuid) : z;
  }, [e]), F = R((z, U) => {
    const P = [];
    pt(P, "Object", [
      { key: "name", value: U?.name, source: "object" },
      { key: "type", value: U?.type, source: "object" },
      { key: "uuid", value: z, source: "object" },
      { key: "bimid", value: e.current?.getBimIdByUuid(z) || "", source: "object" }
    ]);
    const H = U?.userData || {};
    Object.entries(H).forEach(([$, A]) => {
      typeof A == "string" || typeof A == "number" || typeof A == "boolean" ? pt(P, "UserData", [{ key: $, value: A, source: "userData" }], "userData") : Array.isArray(A) && A.forEach((de, ie) => {
        pt(P, "UserData", [{ key: $, value: de, id: `userData::${$}::${ie}`, source: "userData" }], "userData");
      });
    });
    const W = U?.userData?.ifcMetadata || {};
    Nn("IFC Metadata", W, P, "ifcMetadata");
    const V = e.current?.getNbimProperties(z);
    V && typeof V == "object" && Nn("NBIM", V, P, "nbim");
    const E = e.current?.getNbimIfcPropertyGroups(z, "normalized");
    return E && typeof E == "object" && Object.entries(E).forEach(([$, A]) => {
      pt(P, $, A, "nbim-ifc");
    }), P;
  }, [e]), j = R(() => {
    const z = [], U = /* @__PURE__ */ new Set(), P = e.current;
    if (!P) return z;
    P.contentGroup.updateMatrixWorld(!0), P.contentGroup.traverse((W) => {
      const V = W;
      !V.isMesh || !V.visible || !V.geometry || V.userData?.isIfcGridHelper || U.has(V.uuid) || (U.add(V.uuid), z.push({
        uuid: V.uuid,
        name: V.name || V.uuid,
        type: V.type || "Mesh",
        modelId: g(V.uuid, V),
        sourceLabel: "object",
        source: V
      }));
    });
    const H = (W) => {
      W.forEach((V) => {
        if (!V || V.visible === !1) return;
        const E = String(V.id || "");
        E && V.bimId && !U.has(E) && (U.add(E), z.push({
          uuid: E,
          name: String(V.name || E),
          type: String(V.type || "Node"),
          modelId: String(V.userData?.originalUuid || V.id || E),
          sourceLabel: "structure",
          source: {
            name: V.name,
            type: V.type,
            userData: V.userData || {}
          }
        })), Array.isArray(V.children) && V.children.length > 0 && H(V.children);
      });
    };
    return Array.isArray(P.structureRoot?.children) && P.structureRoot.children.length > 0 && H(P.structureRoot.children), z;
  }, [g, e]), N = R((z, U, P) => U === "equals" ? z === P : U === "contains" ? z.includes(P) : U === "notContains" ? !z.includes(P) : U === "startsWith" ? z.startsWith(P) : U === "endsWith" ? z.endsWith(P) : !1, []), T = R((z, U) => U ? z.normalizedKey === U || z.normalizedPath === U || !!z.rawKey && rt(z.rawKey) === U || z.normalizedPath.endsWith(`.${U}`) : !1, []), x = R(async () => {
    if (!e.current || C.current) return;
    const z = c.map((H) => ({
      ...H,
      normalizedPropertyName: rt(H.propertyName),
      normalizedValue: rt(H.value)
    })).filter((H) => H.normalizedPropertyName && H.normalizedValue);
    if (z.length === 0) {
      p([]), f(!1), m(0), o(""), d({ message: s("search_invalid_condition"), type: "info" }), e.current.highlightObjects(n);
      return;
    }
    const U = ++y.current, P = performance.now();
    C.current = !0, f(!0), m(0), o(s("searching"));
    try {
      const H = j(), W = H.length, V = 600, E = [];
      let $ = performance.now(), A = !1;
      for (let de = 0; de < H.length; de++) {
        if (y.current !== U) {
          A = !0, o(s("search_cancelled"));
          break;
        }
        const ie = H[de], he = F(ie.uuid, ie.source);
        let le = null;
        const _e = /* @__PURE__ */ new Set();
        if (z.forEach((re, be) => {
          const fe = he.filter((B) => T(B, re.normalizedPropertyName)), xe = fe.some((B) => N(B.normalizedValue, re.operator, re.normalizedValue));
          xe && fe.forEach((B) => {
            N(B.normalizedValue, re.operator, re.normalizedValue) && _e.add(B.path);
          }), be === 0 || le === null ? le = xe : (re.connector || "AND") === "AND" ? le = !!le && xe : le = !!le || xe;
        }), le && E.push({
          uuid: ie.uuid,
          name: ie.name || ie.uuid,
          type: ie.type,
          modelId: ie.modelId,
          source: ie.sourceLabel,
          matchedBy: Array.from(_e)
        }), (de + 1) % V === 0 || de === H.length - 1) {
          const re = performance.now(), be = W > 0 ? (de + 1) / W * 100 : 100;
          (re - $ > 120 || de === H.length - 1) && (m(be), $ = re), await new Promise((fe) => window.setTimeout(fe, 0));
        }
      }
      A || (p(E), m(100), o(`${s("search_results")}: ${E.length}`));
    } finally {
      const H = performance.now() - P, W = 220;
      H < W && await new Promise((V) => window.setTimeout(V, W - H)), f(!1), C.current = !1;
    }
  }, [F, j, N, T, e, c, n, d, s]), L = R((z) => {
    if (!e.current) return;
    const U = e.current.contentGroup.getObjectByProperty("uuid", z);
    if (i({ uuids: [z], focusUuid: z }), U) {
      a(U);
      return;
    }
    r([z]);
  }, [i, a, e, r]), S = R(() => {
    y.current++, p([]), f(!1), m(0), o(""), C.current = !1, e.current && e.current.highlightObjects(n);
  }, [e, n]), O = R(() => {
    C.current && (y.current++, o(s("search_cancelling")));
  }, [s]);
  return {
    searchConditions: c,
    setSearchConditions: u,
    searchResults: h,
    searching: v,
    searchProgress: b,
    searchStatus: _,
    handleRunPropertySearch: x,
    handleApplySearchResultHighlight: L,
    handleClearSearchResult: S,
    handleCancelSearch: O
  };
}
function Sn(e, n) {
  return e.boundingBox || e.computeBoundingBox(), e.boundingBox ? e.boundingBox.clone().applyMatrix4(n) : null;
}
function mo(e, n) {
  const r = Math.max(0, e.min.x - n.max.x, n.min.x - e.max.x), a = Math.max(0, e.min.y - n.max.y, n.min.y - e.max.y), i = Math.max(0, e.min.z - n.max.z, n.min.z - e.max.z);
  return Math.sqrt(r * r + a * a + i * i);
}
function fo(e, n) {
  e.boundingBox || e.computeBoundingBox();
  const r = e.boundingBox;
  if (!r) return null;
  const a = new M.Vector3(), i = new M.Vector3();
  r.getCenter(a), r.getSize(i).multiplyScalar(0.5), a.applyMatrix4(n);
  const s = new M.Matrix3().setFromMatrix4(n);
  return new hi(a, i, s);
}
function _o({
  sceneMgrRef: e,
  treeRoot: n,
  clashModelOptions: r,
  selectedUuids: a,
  setSelectedUuids: i,
  focusObjectsInView: s,
  t: d
}) {
  const [c, u] = I([]), [h, p] = I(!1), [v, f] = I(0), [b, m] = I(""), [_, o] = I(0), [y, C] = I([]), [g, F] = I([]), [j, N] = I(0), [T, x] = I(0), [L, S] = I(0.05), [O, z] = I(!0), [U, P] = I(!1), [H, W] = I(!1), [V, E] = I(0), [$, A] = I("ALL"), [de, ie] = I("ALL"), he = q(0), le = q(!1), _e = q(/* @__PURE__ */ new Map()), re = Ee(() => {
    const G = /* @__PURE__ */ new Map();
    return r.forEach((K) => G.set(K.id, K.name)), G;
  }, [r]), be = R((G) => {
    let K = G;
    for (; K; ) {
      const Y = K.userData?.originalUuid;
      if (Y) return String(Y);
      K = K.parent;
    }
    return "";
  }, []), fe = R((G, K, Y) => {
    const k = K.attributes.position;
    if (!k) return null;
    const ee = K.index, ce = Math.floor(ee ? ee.count / 3 : k.count / 3);
    return {
      uuid: G,
      geometry: K,
      matrixWorld: Y.clone(),
      triangleCount: ce
    };
  }, []), xe = R(() => {
    const G = e.current;
    if (!G) return [];
    const K = _e.current;
    return K.clear(), G.contentGroup.updateMatrixWorld(!0), G.contentGroup.traverse((Y) => {
      const k = Y;
      if (!k.isMesh || !k.visible || !k.geometry || k.userData?.isIfcGridHelper) return;
      const ee = Sn(k.geometry, k.matrixWorld);
      if (!ee || ee.isEmpty()) return;
      const ce = be(k), te = {
        uuid: k.uuid,
        name: k.name || k.uuid,
        modelId: ce,
        modelName: re.get(ce) || ce || k.name || k.uuid,
        box: ee,
        testBox: ee.clone(),
        obb: O ? fo(k.geometry, k.matrixWorld) : null,
        meshInfo: fe(k.uuid, k.geometry, k.matrixWorld)
      };
      K.set(te.uuid, te);
    }), G.optimizedMapping.forEach((Y, k) => {
      if (K.has(k) || !Y || Y.length === 0) return;
      const ee = G.getStructureNodes(k) || [];
      if (ee.length > 0 && ee.every((ve) => ve.visible === !1)) return;
      const ce = new M.Box3();
      if (Y.forEach((ve) => {
        const Ne = ve.geometry || ve.mesh.geometry;
        if (!Ne) return;
        const ue = new M.Matrix4();
        ve.mesh.getMatrixAt(ve.instanceId, ue), ue.premultiply(ve.mesh.matrixWorld);
        const we = Sn(Ne, ue);
        we && !we.isEmpty() && ce.union(we);
      }), ce.isEmpty()) return;
      const te = ee[0], ye = te?.userData?.originalUuid ? String(te.userData.originalUuid) : "";
      K.set(k, {
        uuid: k,
        name: te?.name || k,
        modelId: ye,
        modelName: re.get(ye) || ye || te?.name || k,
        box: ce,
        testBox: ce.clone(),
        obb: null,
        meshInfo: null
      });
    }), Array.from(K.values());
  }, [fe, re, O, be, e]), B = R((G, K, Y, k) => {
    const ee = [], ce = G.geometry.attributes.position;
    if (!ce) return ee;
    const te = G.geometry.index, ye = Math.floor(te ? te.count / 3 : ce.count / 3), ve = Math.min(ye, k), Ne = ye > ve ? Math.max(1, Math.floor(ye / ve)) : 1, ue = new M.Vector3(), we = new M.Vector3(), De = new M.Vector3(), Ie = new M.Vector3();
    for (let Se = 0; Se < ye; Se += Ne) {
      const ke = te ? te.getX(Se * 3) : Se * 3, qe = te ? te.getX(Se * 3 + 1) : Se * 3 + 1, J = te ? te.getX(Se * 3 + 2) : Se * 3 + 2;
      if (ue.fromBufferAttribute(ce, ke).applyMatrix4(G.matrixWorld), we.fromBufferAttribute(ce, qe).applyMatrix4(G.matrixWorld), De.fromBufferAttribute(ce, J).applyMatrix4(G.matrixWorld), Ie.copy(ue).add(we).add(De).multiplyScalar(1 / 3), !!K.containsPoint(Ie) && (ee.push(Ie.clone()), ee.length >= Y))
        break;
    }
    return ee;
  }, []), D = R((G, K) => {
    const Y = K.geometry.attributes.position;
    if (!Y) return !1;
    const k = K.geometry.index, ee = Math.floor(k ? k.count / 3 : Y.count / 3), te = Math.min(ee, 12e3), ye = ee > te ? Math.max(1, Math.floor(ee / te)) : 1, ve = G.clone();
    ve.x -= 1e-4;
    const Ne = new M.Ray(ve, new M.Vector3(1, 0, 0)), ue = new M.Vector3(), we = new M.Vector3(), De = new M.Vector3(), Ie = new M.Vector3();
    let Se = 0;
    for (let ke = 0; ke < ee; ke += ye) {
      const qe = k ? k.getX(ke * 3) : ke * 3, J = k ? k.getX(ke * 3 + 1) : ke * 3 + 1, oe = k ? k.getX(ke * 3 + 2) : ke * 3 + 2;
      we.fromBufferAttribute(Y, qe).applyMatrix4(K.matrixWorld), De.fromBufferAttribute(Y, J).applyMatrix4(K.matrixWorld), Ie.fromBufferAttribute(Y, oe).applyMatrix4(K.matrixWorld), !(!Ne.intersectTriangle(we, De, Ie, !1, ue) || ue.x < ve.x) && Se++;
    }
    return Se % 2 === 1;
  }, []), se = R((G, K, Y) => {
    if (!G.meshInfo || !K.meshInfo || G.meshInfo.triangleCount <= 0 || K.meshInfo.triangleCount <= 0) return !0;
    const k = 3e4;
    if (G.meshInfo.triangleCount > k || K.meshInfo.triangleCount > k) return !0;
    const ee = B(G.meshInfo, Y, 4, 6e3), ce = B(K.meshInfo, Y, 4, 6e3);
    return ee.length === 0 || ce.length === 0 ? !1 : ee.some((te) => D(te, K.meshInfo)) || ce.some((te) => D(te, G.meshInfo));
  }, [B, D]), pe = R(async () => {
    if (!e.current || le.current) return;
    const G = ++he.current, K = performance.now();
    le.current = !0, p(!0), f(0), m(d("clash_collecting")), u([]), E(0);
    try {
      const Y = xe();
      if (o(Y.length), Y.length < 2) {
        m(d("clash_insufficient_candidates"));
        return;
      }
      const k = new Set(y), ee = new Set(g), ce = k.size > 0, te = ee.size > 0, ye = (J, oe) => !H && J && oe && J === oe ? !1 : ce && te ? k.has(J) && ee.has(oe) || k.has(oe) && ee.has(J) : ce ? k.has(J) || k.has(oe) : te ? ee.has(J) || ee.has(oe) : !0, ve = (J) => ce && te ? k.has(J) || ee.has(J) : ce ? k.has(J) : te ? ee.has(J) : !0, Ne = Math.max(0, L), ue = Y.filter((J) => !J.box.isEmpty() && ve(J.modelId)).map((J) => {
        const oe = J.box.clone();
        return (j > 0 || Ne > 0) && oe.expandByScalar(Math.max(j, Ne)), {
          ...J,
          testBox: oe
        };
      });
      if (ue.length < 2) {
        m(d("clash_no_results")), f(100);
        return;
      }
      ue.sort((J, oe) => J.testBox.min.x - oe.testBox.min.x), m(d("clash_running"));
      const we = 2e3, De = [], Ie = new M.Box3(), Se = new M.Vector3(), ke = ue.length;
      let qe = 0;
      for (let J = 0; J < ke; J++) {
        if (he.current !== G) {
          m(d("clash_cancelled"));
          return;
        }
        const oe = ue[J], Te = oe.testBox.max.x;
        for (let Je = J + 1; Je < ke; Je++) {
          const Le = ue[Je];
          if (Le.testBox.min.x > Te) break;
          if (!ye(oe.modelId, Le.modelId) || (qe++, !oe.testBox.intersectsBox(Le.testBox))) continue;
          if (O && oe.obb && Le.obb) {
            const gt = oe.obb.clone(), Z = Le.obb.clone();
            if (j > 0 && (gt.halfSize.addScalar(j), Z.halfSize.addScalar(j)), !gt.intersectsOBB(Z, Number.EPSILON * 10)) continue;
          }
          Ie.copy(oe.box).intersect(Le.box);
          const Ze = !Ie.isEmpty();
          let Re = 0;
          Ze && (Ie.getSize(Se), Re = Math.max(0, Se.x) * Math.max(0, Se.y) * Math.max(0, Se.z));
          const ft = Ze ? 0 : mo(oe.box, Le.box), et = Ze && Re >= T, it = !Ze && Ne > 0 && ft <= Ne;
          if (!et && !it || U && Ze && !se(oe, Le, Ie)) continue;
          const _t = [oe.uuid, Le.uuid].sort().join("::"), tt = et ? "hard" : "clearance", lt = tt === "hard" ? Re > Math.max(0.5, T * 10) ? "high" : "medium" : ft <= Math.max(1e-3, Ne * 0.25) ? "high" : "low";
          if (De.push({
            id: `clash_${tt}_${_t}_${De.length}`,
            pairKey: _t,
            groupKey: `${tt}::${oe.modelId || "unknown"}::${Le.modelId || "unknown"}::${_t}`,
            ruleId: tt === "hard" ? "hard-clash-default" : "clearance-default",
            aUuid: oe.uuid,
            bUuid: Le.uuid,
            aName: oe.name,
            bName: Le.name,
            overlapVolume: Re,
            distance: ft,
            severity: lt,
            type: tt,
            status: "new"
          }), De.length >= we) break;
        }
        if (De.length >= we) break;
        if ((J + 1) % 50 === 0 || J === ke - 1) {
          const Je = 30 + (J + 1) / ke * 70;
          f(Je), E(qe), m(`${d("clash_running")} ${J + 1}/${ke}`), await new Promise((Le) => window.setTimeout(Le, 0));
        }
      }
      De.sort((J, oe) => J.type !== oe.type ? J.type === "hard" ? -1 : 1 : J.type === "hard" ? oe.overlapVolume - J.overlapVolume : J.distance - oe.distance), u((J) => {
        const oe = /* @__PURE__ */ new Map();
        return J.forEach((Te) => oe.set(Te.pairKey, Te.status)), De.map((Te) => ({
          ...Te,
          status: oe.get(Te.pairKey) || "new"
        }));
      }), E(qe), f(100), m(`${d("clash_results")}: ${De.length}`), De.length === 0 && e.current.clearLocateFocus();
    } finally {
      const Y = performance.now() - K, k = 220;
      Y < k && await new Promise((ee) => window.setTimeout(ee, k - Y)), le.current = !1, p(!1);
    }
  }, [L, H, T, y, g, j, O, U, xe, se, e, d]), ge = R(() => {
    le.current && (he.current++, m(d("clash_cancelling")));
  }, [d]), ze = R(() => {
    he.current++, le.current = !1, p(!1), f(0), m(""), o(0), E(0), A("ALL"), ie("ALL"), u([]), e.current?.clearLocateFocus(), e.current?.highlightObjects(a);
  }, [e, a]), He = R((G) => {
    const K = [G.aUuid, G.bUuid];
    s({
      uuids: K,
      focusUuid: G.aUuid,
      highlightColors: {
        [G.aUuid]: "#ff4d4f",
        [G.bUuid]: "#1890ff"
      }
    });
  }, [s]), Me = R((G, K) => {
    u((Y) => Y.map((k) => k.id === G ? { ...k, status: K } : k));
  }, []), Pe = R((G) => {
    u((K) => K.map((Y) => {
      const k = $ === "ALL" || $ === "NEW" && Y.status === "new" || $ === "CONFIRMED" && Y.status === "confirmed" || $ === "RESOLVED" && Y.status === "resolved", ee = de === "ALL" || de === "HARD" && Y.type === "hard" || de === "CLEARANCE" && Y.type === "clearance";
      return k && ee ? { ...Y, status: G } : Y;
    }));
  }, [$, de]), Fe = R(() => {
    if (c.length === 0) return;
    const G = (ue) => {
      const we = String(ue ?? "");
      return we.includes(",") || we.includes('"') || we.includes(`
`) ? `"${we.replace(/"/g, '""')}"` : we;
    }, Y = [["pairKey", "type", "severity", "ruleId", "aUuid", "aName", "bUuid", "bName", "status", "overlapVolume", "distance"].join(",")];
    c.forEach((ue) => {
      Y.push([
        G(ue.pairKey),
        G(ue.type),
        G(ue.severity),
        G(ue.ruleId),
        G(ue.aUuid),
        G(ue.aName),
        G(ue.bUuid),
        G(ue.bName),
        G(ue.status),
        G(ue.overlapVolume.toFixed(6)),
        G(ue.distance.toFixed(6))
      ].join(","));
    });
    const k = "\uFEFF" + Y.join(`
`), ee = new Blob([k], { type: "text/csv;charset=utf-8;" }), ce = URL.createObjectURL(ee), te = /* @__PURE__ */ new Date(), ye = (ue) => String(ue).padStart(2, "0"), ve = `clash_report_${te.getFullYear()}${ye(te.getMonth() + 1)}${ye(te.getDate())}_${ye(te.getHours())}${ye(te.getMinutes())}${ye(te.getSeconds())}.csv`, Ne = document.createElement("a");
    Ne.href = ce, Ne.download = ve, Ne.click(), URL.revokeObjectURL(ce);
  }, [c]), Ke = R(() => {
    he.current++, le.current = !1, u([]), p(!1), f(0), m(""), o(0), E(0), A("ALL"), ie("ALL");
  }, []), st = R(() => {
    const G = new Set(r.map((K) => K.id));
    C((K) => K.filter((Y) => G.has(Y))), F((K) => K.filter((Y) => G.has(Y)));
  }, [r]);
  return {
    clashResults: c,
    setClashResults: u,
    clashRunning: h,
    clashProgress: v,
    clashStatus: b,
    clashScannedCount: _,
    clashSetA: y,
    clashSetB: g,
    clashTolerance: j,
    clashMinOverlapVolume: T,
    clashClearanceDistance: L,
    clashUseNarrowPhase: O,
    clashUseTrianglePhase: U,
    clashIncludeSameModel: H,
    clashPairsScanned: V,
    clashResultFilter: $,
    clashTypeFilter: de,
    setClashSetA: C,
    setClashSetB: F,
    setClashTolerance: N,
    setClashMinOverlapVolume: x,
    setClashClearanceDistance: S,
    setClashUseNarrowPhase: z,
    setClashUseTrianglePhase: P,
    setClashIncludeSameModel: W,
    setClashResultFilter: A,
    setClashTypeFilter: ie,
    handleRunClashCheck: pe,
    handleCancelClashCheck: ge,
    handleClearClashResults: ze,
    handleFocusClashResult: He,
    handleUpdateClashResultStatus: Me,
    handleMarkFilteredClashStatus: Pe,
    handleExportClashCsv: Fe,
    resetClashState: Ke,
    applyClashModelOptionBounds: st
  };
}
function go(e, n) {
  const r = q(/* @__PURE__ */ new Set()), a = Ee(() => {
    const i = /* @__PURE__ */ new Map(), s = (c, u) => {
      if (!c) return;
      const h = i.get(c) || {
        total: 0,
        newCount: 0,
        confirmedCount: 0,
        resolvedCount: 0,
        worstStatus: "resolved"
      };
      h.total += 1, u === "new" ? h.newCount += 1 : u === "confirmed" ? h.confirmedCount += 1 : h.resolvedCount += 1, h.newCount > 0 ? h.worstStatus = "new" : h.confirmedCount > 0 ? h.worstStatus = "confirmed" : h.worstStatus = "resolved", i.set(c, h);
    };
    n.forEach((c) => {
      s(c.aUuid, c.status), s(c.bUuid, c.status);
    });
    const d = {};
    return i.forEach((c, u) => {
      d[u] = c;
    }), d;
  }, [n]);
  return Q(() => {
    if (!e.current) return;
    const i = e.current;
    r.current.forEach((c) => {
      const u = i.contentGroup.getObjectByProperty("uuid", c);
      u?.userData?.clash && delete u.userData.clash, (i.getStructureNodes(c) || []).forEach((p) => {
        p?.userData?.clash && delete p.userData.clash;
      });
    });
    const d = /* @__PURE__ */ new Set();
    Object.entries(a).forEach(([c, u]) => {
      d.add(c);
      const h = {
        total: u.total,
        new: u.newCount,
        confirmed: u.confirmedCount,
        resolved: u.resolvedCount,
        status: u.worstStatus
      }, p = i.contentGroup.getObjectByProperty("uuid", c);
      p && (p.userData || (p.userData = {}), p.userData.clash = h), (i.getStructureNodes(c) || []).forEach((f) => {
        f.userData || (f.userData = {}), f.userData.clash = h;
      });
    }), r.current = d;
  }, [a, e]), a;
}
function yo({
  sceneMgrRef: e,
  setSelectedUuids: n,
  setSelectedProps: r
}) {
  return {
    focusObjectsInView: R(({
      uuids: i,
      focusUuid: s,
      highlightColors: d,
      updateSelection: c = !0
    }) => {
      const u = e.current;
      if (!u) return !1;
      const h = Array.from(new Set((i || []).map((v) => String(v || "").trim()).filter(Boolean)));
      if (h.length === 0) return !1;
      const p = s && h.includes(s) ? s : h[0];
      return u.setLocateFocusContext(h, p, d), u.fitViewToObjects(h), c && (n(h), r?.(null)), !0;
    }, [e, r, n])
  };
}
const kn = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"), Mo = ({
  allowDragOpen: e = !0,
  hiddenMenus: n = [],
  libPath: r = "./libs",
  defaultLang: a,
  showStats: i,
  showOutline: s,
  showProperties: d,
  initialSettings: c,
  initialFiles: u,
  onSelect: h,
  onLoad: p,
  hideDeleteModel: v = !1,
  performancePreset: f = "quality",
  chunkOptions: b
}) => {
  const m = Zt.light, _ = Ee(() => ({
    chunkReadCacheSize: b?.chunkReadCacheSize ?? 128,
    chunkPrefetchWindow: b?.chunkPrefetchWindow ?? 0,
    targetMinFps: b?.targetMinFps ?? 20,
    ghostMode: b?.ghostMode,
    loadProfile: b?.loadProfile ?? "max-speed",
    deferIfcProperties: b?.deferIfcProperties ?? !0,
    preferWorkerOctree: b?.preferWorkerOctree ?? !0,
    fastGeometrySanitize: b?.fastGeometrySanitize ?? !0
  }), [b]), [o, y] = nt(
    "3dbrowser_lang",
    () => a || "zh",
    {
      serializer: (w) => w,
      parser: (w) => w === "zh" || w === "en" ? w : "zh"
    }
  ), C = q(a);
  Q(() => {
    a && a !== C.current && (y(a), C.current = a);
  }, [a, y]);
  const g = R((w) => bt(o, w), [o]);
  Q(() => {
    const w = (me) => {
      me.preventDefault();
    }, X = (me) => {
      (me.button === 3 || me.button === 4) && (me.preventDefault(), me.stopPropagation());
    };
    return document.addEventListener("contextmenu", w, { capture: !0 }), document.addEventListener("gesturestart", w, { capture: !0 }), window.addEventListener("auxclick", w, { capture: !0 }), window.addEventListener("mousedown", X, { capture: !0 }), () => {
      document.removeEventListener("contextmenu", w, { capture: !0 }), document.removeEventListener("gesturestart", w, { capture: !0 }), window.removeEventListener("auxclick", w, { capture: !0 }), window.removeEventListener("mousedown", X, { capture: !0 });
    };
  }, []);
  const [F, j] = I([]), {
    selectedUuids: N,
    selectedUuid: T,
    setSelectedUuids: x,
    clearSelection: L
  } = Xa(), [S, O] = I(null), [z, U] = I(bt(o, "ready")), [P, H] = I(!1), [W, V] = I(0), [E, $] = I({
    meshes: 0,
    faces: 0,
    memory: 0,
    textureMemory: 0,
    drawCalls: 0,
    chunksLoaded: 0,
    chunksTotal: 0,
    chunksQueued: 0,
    pixelRatio: 1
  }), [A, de] = I({ loaded: 0, total: 0 }), [ie, he] = I(null), [le, _e] = I(null), [re, be] = I("solid"), [fe, xe] = I(""), {
    activeTool: B,
    setActiveTool: D,
    explodeEnabled: se,
    setExplodeEnabled: pe,
    explodeStrength: ge,
    setExplodeStrength: ze,
    explodeMode: He,
    setExplodeMode: Me,
    resetExplodeState: Pe,
    measureType: Fe,
    setMeasureType: Ke,
    measureHistory: st,
    setMeasureHistory: G,
    highlightedMeasureId: K,
    setHighlightedMeasureId: Y,
    resetMeasurementState: k,
    handleMeasureUpdate: ee,
    clipEnabled: ce,
    setClipEnabled: te,
    clipValues: ye,
    setClipValues: ve,
    clipActive: Ne,
    setClipActive: ue,
    clipHelperVisible: we,
    setClipHelperVisible: De,
    clipHelperOpacity: Ie,
    setClipHelperOpacity: Se
  } = so({
    initialSettings: c,
    mgrInstance: ie
  }), [ke, qe] = nt("3dbrowser_pickEnabled", !1, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [J, oe] = nt("3dbrowser_showStats", i ?? !0, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [Te, Je] = nt("3dbrowser_showOutline", s ?? !0, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [Le, Ze] = nt("3dbrowser_showProps", d ?? !0, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [Re, ft] = nt("3dbrowser_sceneSettings", () => {
    const w = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: m.canvasBg,
      viewCubeSize: 120,
      colorSpace: "srgb",
      toneMapping: "aces",
      exposure: 1,
      shadowQuality: "medium",
      adaptiveQuality: !0,
      minPixelRatio: 0.8,
      maxPixelRatio: 2,
      targetFps: 50,
      performanceMode: "balanced",
      backLightInt: 0.5,
      highlightColor: "#0c62a2",
      highlightShowBox: !1,
      clip: {
        helperVisible: c?.clip?.helperVisible ?? !1,
        helperOpacity: c?.clip?.helperOpacity ?? 0.12
      }
    }, X = c ? { ...w, ...c } : w;
    return X.bgColor === void 0 ? { ...X, bgColor: m.canvasBg } : X;
  });
  Q(() => {
    i !== void 0 && oe(i);
  }, [i, oe]);
  const [et, it] = I({ isOpen: !1, title: "", message: "", action: () => {
  } }), [_t, tt] = I(!1), lt = q(null), gt = q(null), Z = q(null), nn = q(/* @__PURE__ */ new Map()), { focusObjectsInView: Vt } = yo({
    sceneMgrRef: Z,
    setSelectedUuids: x,
    setSelectedProps: O
  }), {
    leftWidth: rn,
    rightWidth: an,
    resizingLeft: In,
    resizingRight: $n
  } = io({
    propShowOutline: s,
    propShowProperties: d,
    setShowOutline: Je,
    setShowProps: Ze
  });
  Q(() => {
    const w = Z.current;
    w && (w.setChunkOptions(_), w.updateSettings({
      ...Re,
      performanceMode: f,
      targetFps: _.targetMinFps ?? Re.targetFps
    }));
  }, [_, f, Re]);
  const Fn = F.length > 0, xt = Ee(() => {
    const w = [], X = /* @__PURE__ */ new Set();
    return (F || []).forEach((me) => {
      const Ce = String(me?.object?.userData?.originalUuid || me?.uuid || "");
      !Ce || X.has(Ce) || (X.add(Ce), w.push({ id: Ce, name: String(me?.name || Ce) }));
    }), w;
  }, [F]), {
    clashResults: at,
    clashRunning: Tn,
    clashProgress: Rn,
    clashStatus: jn,
    clashScannedCount: Un,
    clashSetA: Hn,
    clashSetB: Wn,
    clashTolerance: Gn,
    clashMinOverlapVolume: Xn,
    clashClearanceDistance: Kn,
    clashUseNarrowPhase: Yn,
    clashUseTrianglePhase: Qn,
    clashIncludeSameModel: qn,
    clashPairsScanned: Jn,
    clashResultFilter: Zn,
    clashTypeFilter: er,
    setClashSetA: At,
    setClashSetB: Bt,
    setClashTolerance: tr,
    setClashMinOverlapVolume: nr,
    setClashClearanceDistance: rr,
    setClashUseNarrowPhase: ir,
    setClashUseTrianglePhase: ar,
    setClashIncludeSameModel: or,
    setClashResultFilter: sr,
    setClashTypeFilter: lr,
    handleRunClashCheck: cr,
    handleCancelClashCheck: ur,
    handleClearClashResults: Ot,
    handleFocusClashResult: dr,
    handleUpdateClashResultStatus: hr,
    handleMarkFilteredClashStatus: pr,
    handleExportClashCsv: mr,
    resetClashState: fr,
    applyClashModelOptionBounds: on
  } = _o({
    sceneMgrRef: Z,
    treeRoot: F,
    clashModelOptions: xt,
    selectedUuids: N,
    setSelectedUuids: x,
    focusObjectsInView: Vt,
    t: g
  }), sn = go(Z, at), ln = q(/* @__PURE__ */ new Set()), cn = q("");
  Q(() => {
    cn.current = fe;
  }, [fe]);
  const [Pt, It] = I({ isOpen: !1, title: "", message: "" }), [ct, We] = I(null), { onManagerChunkProgress: un } = Da({
    fileSetIdRef: cn,
    completedFileSetsRef: ln,
    onProgress: de,
    onCompleted: () => {
      We({ message: g("all_chunks_loaded"), type: "success" }), de({ loaded: 0, total: 0 });
    }
  }), _r = R((w, X) => {
    un(w, X);
  }, [un]);
  Ha({
    mgrInstance: ie,
    showStats: J,
    setStats: $
  }), Q(() => {
    on();
  }, [on]);
  const $t = q(() => {
  });
  Q(() => {
    z === bt(o === "zh" ? "en" : "zh", "ready") && U(bt(o, "ready"));
  }, [o]);
  const dn = (w) => w >= 1e6 ? (w / 1e6).toFixed(2) + "M" : w >= 1e3 ? (w / 1e3).toFixed(1) + "K" : w.toString(), gr = (w) => w >= 1024 ? (w / 1024).toFixed(2) + " GB" : w.toFixed(1) + " MB";
  function yr(w) {
    const X = {};
    return w.visibility && (X.hiddenUuids = Array.from(Ct), X.isolatedUuids = Array.from(Nt)), w.selection && (X.selectedUuids = [...N]), w.clip && (X.clip = {
      enabled: ce,
      values: {
        x: [...ye.x],
        y: [...ye.y],
        z: [...ye.z]
      },
      active: { ...Ne },
      helperVisible: we,
      helperOpacity: Ie
    }), w.explode && (X.explode = {
      enabled: se,
      strength: ge,
      mode: He
    }), X;
  }
  async function br(w) {
    const X = Z.current;
    if (!(!X || !w)) {
      if ($t.current?.(), X.clearLocateFocus(), w.clip && (te(w.clip.enabled), ve(w.clip.values), ue(w.clip.active), De(w.clip.helperVisible), Se(w.clip.helperOpacity)), w.explode && (pe(w.explode.enabled), ze(w.explode.strength), Me(w.explode.mode)), w.hiddenUuids !== void 0 || w.isolatedUuids !== void 0) {
        X.setAllVisibility(!0);
        const me = w.hiddenUuids || [], Ce = w.isolatedUuids || [];
        Ce.length > 0 ? (X.isolateObjects(Ce), St(/* @__PURE__ */ new Set()), kt(new Set(Ce))) : (me.forEach((je) => X.setObjectVisibility(je, !1)), St(new Set(me)), kt(/* @__PURE__ */ new Set())), Ye();
      }
      if (w.selectedUuids !== void 0 && (x(w.selectedUuids), O(null), X.highlightObjects(w.selectedUuids), w.selectedUuids.length === 1)) {
        const me = X.contentGroup.getObjectByProperty("uuid", w.selectedUuids[0]);
        me && await Mt(me);
      }
    }
  }
  const {
    viewpoints: vr,
    handleSaveViewpoint: wr,
    handleUpdateViewpointName: xr,
    handleLoadViewpoint: Cr,
    handleOverwriteViewpoint: Nr,
    handleDeleteViewpoint: Sr
  } = uo({
    currentFileSetId: fe,
    sceneMgrRef: Z,
    setToast: We,
    setConfirmState: it,
    t: g,
    captureStateSnapshot: yr,
    restoreStateSnapshot: br
  });
  Q(() => {
    ie && requestAnimationFrame(() => {
      ie.resize();
    });
  }, [ie, Te, Le, rn, an]), Q(() => {
    if (ct) {
      const w = setTimeout(() => {
        We(null);
      }, 3e3);
      return () => clearTimeout(w);
    }
  }, [ct]);
  const Ye = R(() => {
    if (!Z.current) return;
    const w = Z.current.structureRoot;
    if (!w) {
      j([]);
      return;
    }
    const X = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), Ce = (Oe) => {
      const Ue = (Oe || []).slice();
      for (; Ue.length; ) {
        const Be = Ue.pop();
        if (Be && (typeof Be.uuid == "string" && (X.set(Be.uuid, !!Be.expanded), me.set(Be.uuid, Be.childrenLoaded !== !1)), Array.isArray(Be.children) && Be.children.length))
          for (const yt of Be.children)
            Ue.push(yt);
      }
    }, je = (Oe, Ue = 0, Be = !1, yt = !1) => {
      const Rt = Oe.id, fn = Array.isArray(Oe.children) ? Oe.children : [], oi = fn.length > 0, _n = yt || me.get(Rt) === !0;
      return {
        uuid: Rt,
        name: Oe.name,
        type: Oe.type === "Mesh" ? "MESH" : "GROUP",
        depth: Ue,
        children: _n ? fn.map((si) => je(si, Ue + 1, !1, !1)) : [],
        expanded: X.get(Rt) ?? !1,
        visible: Oe.visible !== !1,
        object: Oe,
        isFileNode: Be,
        hasChildren: oi,
        childrenLoaded: _n
      };
    };
    j((Oe) => {
      Ce(Oe);
      const Ue = [];
      return (w.children || []).forEach((Be) => {
        Be.name === "ImportedModels" || Be.name === "Tilesets" ? (Be.children || []).forEach((yt) => {
          Ue.push(je(yt, 0, !0, !0));
        }) : Ue.push(je(Be, 0, !0, !0));
      }), Ue;
    });
  }, []), {
    contextMenu: Ft,
    hiddenUuids: Ct,
    isolatedUuids: Nt,
    setHiddenUuids: St,
    setIsolatedUuids: kt,
    handleContextMenu: kr,
    closeContextMenu: Mr,
    handleHideSelected: Lr,
    handleShowAll: ut,
    handleToggleVisibility: Er,
    handleHideObject: zr,
    handleIsolateObject: Dr,
    handleIsolateSelection: Vr,
    handleUndoVisibility: Ar
  } = co({
    sceneMgrRef: Z,
    selectedUuids: N,
    setSelectedUuids: x,
    setSelectedProps: O,
    updateTree: Ye,
    resetLocateState: () => $t.current()
  }), Br = (w) => {
    if (!Z.current) return;
    const X = Z.current.contentGroup.getObjectByProperty("uuid", w), me = Z.current.getStructureNodes(w);
    if (X || me) {
      const Ce = X?.name || me?.[0]?.name || "Item";
      it({
        isOpen: !0,
        title: g("delete_item"),
        message: `${g("confirm_delete")} "${Ce}"?`,
        action: async () => {
          H(!0), U(g("delete_item") + "...");
          try {
            await Z.current?.removeModel(w), x((je) => {
              const Oe = je.filter((Ue) => Ue !== w);
              return Z.current?.highlightObjects(Oe), Oe.length === 0 && O(null), Oe;
            }), Ye(), U(g("ready")), We({ message: g("success"), type: "success" });
          } catch (je) {
            console.error("删除对象失败:", je), We({ message: g("failed") + ": " + (je instanceof Error ? je.message : String(je)), type: "error" });
          } finally {
            H(!1);
          }
        }
      });
    }
  }, hn = () => {
    L(), O(null), Z.current?.highlightObjects([]);
  };
  Q(() => {
    if (!lt.current) return;
    const w = new di(lt.current, {
      performancePreset: f,
      chunkOptions: _
    });
    return Z.current = w, he(w), p && p(w), w.updateSettings(Re), requestAnimationFrame(() => {
      w.resize();
    }), w.onChunkProgress = _r, w.onMeasureUpdate = ee, w.onStructureUpdate = () => {
      Ye();
    }, () => {
      w.dispose();
    };
  }, []), Q(() => {
    if (!ie || !u) return;
    (async () => {
      const X = Array.isArray(u) ? u : [u];
      console.log("[ThreeViewer] loadInitial with items:", X), await Tt(X);
    })();
  }, [ie, u]);
  const Or = (w) => {
    const X = {
      ...Re,
      ...w
    };
    ft(X), Z.current && Z.current.updateSettings(X);
  }, {
    locatedUuid: Pr,
    locateResultUuids: Ir,
    resetLocateState: pn,
    handleSelect: Mt,
    handleLocateObject: $r,
    handleLocateResultsChange: Fr,
    handleClearLocate: Tr
  } = Za({
    sceneMgrRef: Z,
    selectedUuids: N,
    setSelectedUuids: x,
    setSelectedProps: O,
    setHiddenUuids: St,
    setIsolatedUuids: kt,
    updateTree: Ye,
    propOnSelect: h,
    ifcPropertyCacheRef: nn,
    clashSummaryByUuid: sn,
    focusObjectsInView: Vt,
    t: g,
    isDev: kn
  });
  $t.current = pn;
  const {
    searchConditions: Rr,
    setSearchConditions: jr,
    searchResults: Lt,
    searching: Ur,
    searchProgress: Hr,
    searchStatus: Wr,
    handleRunPropertySearch: Gr,
    handleApplySearchResultHighlight: Xr,
    handleClearSearchResult: Et,
    handleCancelSearch: Kr
  } = po({
    sceneMgrRef: Z,
    selectedUuids: N,
    setSelectedUuids: x,
    onSelectObject: Mt,
    focusObjectsInView: Vt,
    t: g,
    setToast: We
  }), mn = Ee(() => {
    const w = [];
    return Fe !== "none" && w.push({
      key: "measure",
      label: g("mode_measure"),
      onClear: () => {
        Ke("none"), D("none"), Z.current?.clearMeasurementPreview();
      }
    }), ce && w.push({
      key: "clip",
      label: g("mode_clip"),
      onClear: () => {
        te(!1), D("none");
      }
    }), Lt.length > 0 && w.push({
      key: "search",
      label: `${g("mode_search")} ${Lt.length}`,
      onClear: Et
    }), Ct.size > 0 && w.push({
      key: "hidden",
      label: `${g("mode_hidden")} ${Ct.size}`,
      onClear: ut
    }), Nt.size > 0 && w.push({
      key: "isolated",
      label: `${g("mode_isolated")} ${Nt.size}`,
      onClear: ut
    }), B === "boxSelect" && w.push({
      key: "boxSelect",
      label: g("mode_box_select"),
      onClear: () => D("none")
    }), at.length > 0 && w.push({
      key: "clash",
      label: `${g("mode_clash")} ${at.length}`,
      onClear: Ot
    }), w;
  }, [
    B,
    at.length,
    ce,
    Ot,
    Et,
    ut,
    Ct.size,
    Nt.size,
    Fe,
    Lt.length,
    g
  ]), Yr = R((w) => {
    if (!Z.current) return;
    const X = Array.from(new Set(
      at.filter((me) => me.status === w).flatMap((me) => [me.aUuid, me.bUuid]).filter(Boolean)
    ));
    X.length !== 0 && (Z.current.clearLocateFocus(), Z.current.isolateObjects(X), St(/* @__PURE__ */ new Set()), kt(new Set(X)), Ye(), Z.current.fitViewToObjects(X));
  }, [at, Ye]), { processFiles: Tt, loadItemsIntoScene: Qr } = Ua({
    managerRef: Z,
    sceneSettings: Re,
    libPath: r,
    t: g,
    setCurrentFileSetId: xe,
    setLoading: H,
    setStatus: U,
    setProgress: V,
    setToast: We,
    updateTree: Ye
  });
  ho({
    allowDragOpen: e,
    mgrInstance: ie,
    viewportRef: gt,
    t: g,
    processFiles: Tt,
    setToast: We,
    setErrorState: It
  });
  const {
    getDefaultExportFileName: qr,
    handleExport: Jr,
    handleClear: Zr,
    handleScreenshot: ei
  } = eo({
    sceneMgrRef: Z,
    t: g,
    setLoading: H,
    setProgress: V,
    setStatus: U,
    setToast: We,
    setActiveTool: D,
    setConfirmState: it,
    setSelectedUuids: x,
    setSelectedProps: O,
    setChunkProgress: de,
    resetLocateState: pn,
    clearSearchResult: Et,
    resetClashState: fr,
    resetMeasurementState: k,
    resetExplodeState: Pe,
    updateTree: Ye,
    ifcPropertyCacheRef: nn,
    completedFileSetsRef: ln
  }), {
    handleOpenFiles: ti,
    handleBatchConvert: ni,
    handleOpenUrl: ri,
    handleDragOver: ii,
    handleDrop: ai
  } = ro({
    sceneMgrRef: Z,
    t: g,
    processFiles: Tt,
    loadItemsIntoScene: Qr,
    setLoading: H,
    setStatus: U,
    setProgress: V,
    setToast: We,
    setActiveTool: D,
    setSelectedUuids: x,
    setSelectedProps: O,
    resetMeasurementState: k,
    updateTree: Ye,
    isDev: kn
  });
  return to({
    sceneMgrRef: Z,
    canvasRef: lt,
    activeTool: B,
    setActiveTool: D,
    measureType: Fe,
    setMeasureType: Ke,
    pickEnabled: ke,
    selectedUuids: N,
    setSelectedUuids: x,
    setSelectedProps: O,
    setMousePos: _e,
    setHighlightedMeasureId: Y,
    handleSelect: Mt,
    handleContextMenu: kr,
    handleUndoVisibility: Ar,
    clearSelectionState: hn
  }), /* @__PURE__ */ t(za, { t: g, theme: m, children: /* @__PURE__ */ l(
    "div",
    {
      className: "ui-container ui-app-shell font-medium",
      onDragOver: ii,
      onDrop: ai,
      children: [
        /* @__PURE__ */ t(
          Ji,
          {
            t: g,
            handleOpenFiles: ti,
            handleBatchConvert: ni,
            handleOpenUrl: ri,
            handleView: (w) => {
              Z.current?.setView(w);
            },
            handleClear: Zr,
            openScreenshotPanel: () => D("screenshot"),
            handleDisplayModeChange: (w) => {
              Z.current && (be(w), Z.current.contentGroup.traverse((X) => {
                X.isMesh && X.material && (Array.isArray(X.material) ? X.material : [X.material]).forEach((Ce) => {
                  w === "transparent" ? (Ce.wireframe = !1, Ce.transparent = !0, Ce.opacity = 0.5) : (Ce.wireframe = !1, Ce.transparent = !1, Ce.opacity = 1);
                });
              }), Z.current.requestRender());
            },
            displayMode: re,
            pickEnabled: ke,
            setPickEnabled: qe,
            activeTool: B,
            setActiveTool: D,
            showOutline: Te,
            setShowOutline: Je,
            showProps: Le,
            setShowProps: Ze,
            showStats: J,
            setShowStats: oe,
            sceneMgr: Z.current,
            theme: m,
            hiddenMenus: n,
            onOpenAbout: () => tt(!0),
            hasModels: Fn
          }
        ),
        /* @__PURE__ */ l("div", { className: "ui-main-layout", children: [
          Te && /* @__PURE__ */ l("div", { className: "ui-sidebar ui-sidebar-left", style: { width: `${rn}px` }, children: [
            /* @__PURE__ */ l("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: g("interface_outline") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => Je(!1),
                  children: /* @__PURE__ */ t(ot, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(
              ia,
              {
                t: g,
                treeRoot: F,
                setTreeRoot: j,
                selectedUuid: T,
                locatedUuid: Pr,
                onSelect: (w, X) => Mt(X),
                onToggleVisibility: Er,
                onDelete: (w) => {
                  const X = w?.uuid || w?.id;
                  X && Br(X);
                },
                onHide: zr,
                onIsolate: Dr,
                onShowAll: ut,
                onLocate: $r,
                onClearLocate: Tr,
                onLocateResultsChange: Fr,
                locateResultUuids: Ir,
                clashSummaryByUuid: sn
              }
            ) }),
            /* @__PURE__ */ t(
              "div",
              {
                className: "ui-sidebar-resize ui-sidebar-resize-left",
                onMouseDown: () => In.current = !0
              }
            )
          ] }),
          /* @__PURE__ */ l("div", { ref: gt, className: "ui-viewport-shell", style: { backgroundColor: m.canvasBg }, children: [
            /* @__PURE__ */ t("canvas", { ref: lt, className: "ui-viewport-canvas" }),
            /* @__PURE__ */ t(Ea, { sceneMgr: ie, theme: m, lang: o }),
            Ft.visible && /* @__PURE__ */ t(
              En,
              {
                x: Ft.x,
                y: Ft.y,
                items: [
                  {
                    label: g("hide_selected"),
                    onClick: Lr,
                    disabled: N.length === 0
                  },
                  {
                    label: g("isolate_selection"),
                    onClick: Vr,
                    disabled: N.length === 0
                  },
                  {
                    label: g("clear_selection"),
                    onClick: hn,
                    disabled: N.length === 0
                  },
                  {
                    label: g("show_all"),
                    onClick: ut
                  }
                ],
                onClose: Mr,
                theme: m
              }
            ),
            ct && /* @__PURE__ */ l("div", { className: "ui-toast", children: [
              /* @__PURE__ */ t("div", { className: `ui-toast-dot ${ct.type === "error" ? "ui-toast-dot-error" : ct.type === "success" ? "ui-toast-dot-success" : "ui-toast-dot-info"}` }),
              /* @__PURE__ */ t("span", { className: "ui-toast-message", children: ct.message }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-toast-close",
                  onClick: () => We(null),
                  children: /* @__PURE__ */ t(ot, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ t(wa, { t: g, loading: P, status: z, progress: W, theme: m }),
            B === "measure" && /* @__PURE__ */ t(
              ua,
              {
                t: g,
                sceneMgr: Z.current,
                measureType: Fe,
                setMeasureType: Ke,
                measureHistory: st,
                highlightedId: K,
                onHighlight: (w) => {
                  Y(w), Z.current?.highlightMeasurement(w), w && Z.current?.locateMeasurement(w);
                },
                onDelete: (w) => {
                  Z.current?.removeMeasurement(w), G((X) => X.filter((me) => me.id !== w)), K === w && (Y(null), Z.current?.highlightMeasurement(null));
                },
                onClear: () => {
                  Z.current?.clearAllMeasurements(), k();
                },
                onClose: () => D("none"),
                theme: m
              }
            ),
            B === "clip" && /* @__PURE__ */ t(
              da,
              {
                t: g,
                sceneMgr: Z.current,
                onClose: () => D("none"),
                clipEnabled: ce,
                setClipEnabled: te,
                clipValues: ye,
                setClipValues: ve,
                clipActive: Ne,
                setClipActive: ue,
                clipHelperVisible: we,
                setClipHelperVisible: De,
                clipHelperOpacity: Ie,
                setClipHelperOpacity: Se,
                theme: m
              }
            ),
            B === "export" && /* @__PURE__ */ t(
              ha,
              {
                t: g,
                onClose: () => D("none"),
                onExport: Jr,
                getDefaultFileName: qr,
                theme: m
              }
            ),
            B === "screenshot" && /* @__PURE__ */ t(
              pa,
              {
                t: g,
                onClose: () => D("none"),
                onCapture: (w) => {
                  ei(w), D("none");
                },
                theme: m
              }
            ),
            B === "settings" && /* @__PURE__ */ t(
              aa,
              {
                t: g,
                onClose: () => D("none"),
                settings: Re,
                onUpdate: Or,
                currentLang: o,
                setLang: y,
                showStats: J,
                setShowStats: oe,
                theme: m
              }
            ),
            B === "viewpoint" && /* @__PURE__ */ t(
              fa,
              {
                t: g,
                viewpoints: vr,
                onSave: wr,
                onUpdateName: xr,
                onLoad: Cr,
                onDelete: Sr,
                onOverwrite: Nr,
                onClose: () => D("none"),
                theme: m
              }
            ),
            B === "search" && /* @__PURE__ */ t(
              ba,
              {
                t: g,
                onClose: () => D("none"),
                conditions: Rr,
                results: Lt,
                searching: Ur,
                searchProgress: Hr,
                searchStatus: Wr,
                onConditionsChange: jr,
                onSearch: () => void Gr(),
                onCancelSearch: Kr,
                onApplyResultHighlight: Xr,
                onClearResult: Et,
                theme: m
              }
            ),
            B === "clash" && /* @__PURE__ */ t(
              va,
              {
                t: g,
                onClose: () => D("none"),
                running: Tn,
                progress: Rn,
                status: jn,
                scannedCount: Un,
                pairsScanned: Jn,
                results: at,
                resultFilter: Zn,
                modelOptions: xt,
                setA: Hn,
                setB: Wn,
                tolerance: Gn,
                minOverlapVolume: Xn,
                clearanceDistance: Kn,
                useNarrowPhase: Yn,
                useTrianglePhase: Qn,
                includeSameModel: qn,
                onSetAChange: At,
                onSetBChange: Bt,
                onToleranceChange: tr,
                onMinOverlapVolumeChange: nr,
                onClearanceDistanceChange: rr,
                onUseNarrowPhaseChange: ir,
                onUseTrianglePhaseChange: ar,
                onIncludeSameModelChange: or,
                onRun: () => void cr(),
                onCancel: ur,
                onClear: Ot,
                onExportCsv: mr,
                onIsolateByStatus: Yr,
                onRestoreVisibility: ut,
                onResultFilterChange: sr,
                typeFilter: er,
                onTypeFilterChange: lr,
                onUpdateResultStatus: hr,
                onMarkFilteredStatus: pr,
                onSetASelectAll: () => At(xt.map((w) => w.id)),
                onSetAClear: () => At([]),
                onSetBSelectAll: () => Bt(xt.map((w) => w.id)),
                onSetBClear: () => Bt([]),
                onFocusResult: dr,
                theme: m
              }
            ),
            B === "explode" && /* @__PURE__ */ t(
              _a,
              {
                t: g,
                onClose: () => D("none"),
                enabled: se,
                strength: ge,
                mode: He,
                onEnabledChange: pe,
                onStrengthChange: ze,
                onModeChange: Me,
                onReset: () => {
                  Pe(), Z.current?.resetExplode();
                },
                theme: m
              }
            )
          ] }),
          Le && /* @__PURE__ */ l("div", { className: "ui-sidebar ui-sidebar-right", style: { width: `${an}px` }, children: [
            /* @__PURE__ */ l("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: g("interface_props") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => Ze(!1),
                  children: /* @__PURE__ */ t(ot, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(ka, { t: g, selectedProps: S, theme: m }) }),
            /* @__PURE__ */ t(
              "div",
              {
                onMouseDown: () => $n.current = !0,
                className: "ui-sidebar-resize ui-sidebar-resize-right"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-statusbar", children: [
          /* @__PURE__ */ l("div", { className: "ui-statusbar-left", children: [
            /* @__PURE__ */ t("span", { children: z }),
            P && /* @__PURE__ */ l("span", { children: [
              W,
              "%"
            ] }),
            T && N.length > 1 && /* @__PURE__ */ l("span", { className: "ui-statusbar-meta", children: [
              g("selected_count"),
              ": ",
              N.length
            ] }),
            A.total > 0 && A.loaded < A.total && /* @__PURE__ */ l("div", { className: "ui-chunk-progress", children: [
              /* @__PURE__ */ l("span", { children: [
                g("chunk_loading"),
                ": ",
                A.loaded,
                "/",
                A.total
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-compact", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "ui-progress-fill",
                  style: { width: `${A.loaded / A.total * 100}%` }
                }
              ) })
            ] }),
            mn.length > 0 && /* @__PURE__ */ t("div", { className: "ui-mode-tray", children: mn.map((w) => /* @__PURE__ */ l("div", { className: "ui-mode-pill", children: [
              /* @__PURE__ */ t("span", { children: w.label }),
              /* @__PURE__ */ t("button", { onClick: w.onClear, children: g("mode_clear") })
            ] }, w.key)) })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-statusbar-right", children: [
            le && /* @__PURE__ */ l("div", { className: "ui-statusbar-coords", children: [
              le.x.toFixed(2),
              ", ",
              le.y.toFixed(2),
              ", ",
              le.z.toFixed(2)
            ] }),
            /* @__PURE__ */ l("div", { className: "ui-tips", children: [
              /* @__PURE__ */ t("span", { children: g("tips_rotate") }),
              /* @__PURE__ */ t("span", { children: g("tips_pan") }),
              /* @__PURE__ */ t("span", { children: g("tips_zoom") })
            ] }),
            J && /* @__PURE__ */ l("div", { className: "ui-stats-group", children: [
              /* @__PURE__ */ l("div", { className: "ui-stats-item", title: g("stats_original_meshes"), children: [
                /* @__PURE__ */ t(Mn, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: dn(E.meshes) })
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-stats-item", title: g("stats_triangles"), children: [
                /* @__PURE__ */ t(Ai, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: dn(E.faces) })
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-stats-item", children: [
                /* @__PURE__ */ t(Ei, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: gr(E.memory) })
              ] }),
              E.chunksTotal > 0 && /* @__PURE__ */ l("div", { className: "ui-statusbar-metric", title: g("stats_chunks"), children: [
                "CH ",
                E.chunksLoaded,
                "/",
                E.chunksTotal
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-statusbar-metric", title: g("stats_pixel_ratio"), children: [
                "DPR ",
                E.pixelRatio
              ] })
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-statusbar-tag ui-statusbar-tag-compact",
                onClick: () => y(o === "zh" ? "en" : "zh"),
                children: o === "zh" ? "EN" : "中文"
              }
            ),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t("div", { className: "ui-statusbar-tag ui-statusbar-tag-compact ui-statusbar-brand", children: /* @__PURE__ */ t("span", { className: "ui-statusbar-brand-label", children: "3D BROWSER" }) })
          ] })
        ] }),
        /* @__PURE__ */ t(
          Ma,
          {
            isOpen: et.isOpen,
            title: et.title,
            message: et.message,
            onConfirm: () => {
              et.action(), it({ ...et, isOpen: !1 });
            },
            onCancel: () => it({ ...et, isOpen: !1 }),
            t: g,
            theme: m
          }
        ),
        /* @__PURE__ */ t(
          La,
          {
            isOpen: _t,
            onClose: () => tt(!1),
            t: g,
            theme: m
          }
        ),
        Pt.isOpen && /* @__PURE__ */ t("div", { className: "ui-error-overlay", children: /* @__PURE__ */ l("div", { className: "ui-error-content ui-error-content-wide", children: [
          /* @__PURE__ */ l("div", { className: "ui-error-header ui-error-header-danger", children: [
            /* @__PURE__ */ t("span", { children: Pt.title }),
            /* @__PURE__ */ t(
              "div",
              {
                onClick: () => It((w) => ({ ...w, isOpen: !1 })),
                className: "ui-error-close",
                children: /* @__PURE__ */ t(ot, { width: 18, height: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-error-body", children: [
            /* @__PURE__ */ t("div", { className: "ui-error-message", children: Pt.message }),
            /* @__PURE__ */ t("div", { className: "ui-error-actions", children: /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-primary ui-btn-modal-confirm",
                onClick: () => It((w) => ({ ...w, isOpen: !1 })),
                children: g("confirm")
              }
            ) })
          ] })
        ] }) })
      ]
    }
  ) });
};
export {
  pi as DEFAULT_FONT,
  di as SceneManager,
  Mo as ThreeViewer,
  So as colors,
  bt as getTranslation,
  Ta as loadModelFiles,
  ko as resolveThemeColors,
  Zt as themes
};
