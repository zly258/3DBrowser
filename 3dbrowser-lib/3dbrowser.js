import { jsx as t, jsxs as l, Fragment as ae } from "react/jsx-runtime";
import _t, { useState as O, useEffect as q, useRef as ee, useCallback as T, useMemo as Se, Component as sr } from "react";
import { s as yn, a as Kt, e as lr, b as cr, S as ur } from "./utils-DuOAw0Kj.js";
import * as L from "three";
import { OBB as dr } from "three/examples/jsm/math/OBB.js";
const an = {
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
}, hr = "'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif", ko = an.light;
function Pe(e) {
  return typeof window > "u" ? "" : getComputedStyle(document.documentElement).getPropertyValue(e).trim();
}
function Mo() {
  const e = an.light, n = {
    bg: Pe("--bg-primary"),
    panelBg: Pe("--bg-panel"),
    headerBg: Pe("--bg-header"),
    border: Pe("--border-color"),
    text: Pe("--text-primary"),
    textLight: "#000000",
    textMuted: Pe("--text-muted"),
    accent: Pe("--accent"),
    highlight: Pe("--bg-selected"),
    itemHover: Pe("--bg-hover"),
    success: Pe("--success"),
    warning: Pe("--warning"),
    danger: Pe("--error"),
    canvasBg: Pe("--bg-canvas"),
    shadow: Pe("--shadow-md")
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
const pr = {
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
}, Ct = (e, n) => pr[e][n] || n, bn = 24, mr = 1.5, se = (e, n = {}) => {
  const { size: i, color: a, ...r } = n;
  return /* @__PURE__ */ t(
    "svg",
    {
      width: i || bn,
      height: i || bn,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: a || "currentColor",
      strokeWidth: mr,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...r,
      children: e
    }
  );
}, It = (e) => se(/* @__PURE__ */ t("polyline", { points: "9 18 15 12 9 6" }), e), fr = (e) => se(/* @__PURE__ */ t("polyline", { points: "15 18 9 12 15 6" }), e), Ot = (e) => se(/* @__PURE__ */ t("polyline", { points: "6 9 12 15 18 9" }), e), _r = (e) => se(/* @__PURE__ */ t("polyline", { points: "18 15 12 9 6 15" }), e), gr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "7" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "2.5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "2", x2: "12", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "19", x2: "12", y2: "22" }),
    /* @__PURE__ */ t("line", { x1: "2", y1: "12", x2: "5", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "12", x2: "22", y2: "12" })
  ] }),
  e
), yr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), ot = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ] }),
  e
), br = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ t("polyline", { points: "14 2 14 8 20 8" })
  ] }),
  e
), vr = (e) => se(
  /* @__PURE__ */ t(ae, { children: /* @__PURE__ */ t("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" }) }),
  e
), wr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("rect", { x: "2", y: "2", width: "20", height: "16", rx: "1" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "14", x2: "6", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "14", x2: "12", y2: "16" }),
    /* @__PURE__ */ t("line", { x1: "18", y1: "14", x2: "18", y2: "17" })
  ] }),
  e
), xr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("circle", { cx: "6", cy: "6", r: "3" }),
    /* @__PURE__ */ t("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ t("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
    /* @__PURE__ */ t("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
    /* @__PURE__ */ t("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
  ] }),
  e
), Cr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ t("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ] }),
  e
), Nr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] }),
  e
), Sr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), kr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" }),
    /* @__PURE__ */ t("path", { d: "M13 13l6 6" })
  ] }),
  e
), kn = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    /* @__PURE__ */ t("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ] }),
  e
), Mr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] }),
  e
), Lr = (e) => se(
  /* @__PURE__ */ t(ae, { children: /* @__PURE__ */ t("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) }),
  e
), Er = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  e
), zr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  e
), Dr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ t("line", { x1: "16.65", y1: "16.65", x2: "21", y2: "21" })
  ] }),
  e
), Vr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] }),
  e
), Ar = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ t("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ t("polyline", { points: "21 15 16 10 5 21" })
  ] }),
  e
), $r = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
    /* @__PURE__ */ t("polyline", { points: "2 12 12 17 22 12" }),
    /* @__PURE__ */ t("polyline", { points: "2 17 12 22 22 17" })
  ] }),
  e
), Br = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
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
), Ir = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4z", fill: "none" }),
    /* @__PURE__ */ t("line", { x1: "7", y1: "5", x2: "17", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "5", y1: "7", x2: "5", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "17", y1: "19", x2: "7", y2: "19" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "17", x2: "19", y2: "7" })
  ] }),
  e
), Or = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Fr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,16 12,13 21,16 12,21", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Pr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Tr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Rr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "3,8 12,3 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), jr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("polygon", { points: "21,8 12,3 12,13 21,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Ur = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
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
), Hr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
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
), Gr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
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
), Wr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
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
), Kr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.35" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Xr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "none" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Yr = (e) => se(
  /* @__PURE__ */ t(ae, { children: /* @__PURE__ */ t("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }),
  e
), qr = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ t("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  e
), tn = (e) => se(
  /* @__PURE__ */ l(ae, { children: [
    /* @__PURE__ */ t("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    /* @__PURE__ */ t("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
  ] }),
  e
), Le = ({
  icon: e,
  label: n,
  active: i,
  theme: a,
  style: r,
  className: s = "",
  disabled: h,
  ...c
}) => /* @__PURE__ */ l(
  "button",
  {
    style: { opacity: h ? 0.4 : 1, cursor: h ? "not-allowed" : "pointer", ...r },
    className: `ui-toolbar-btn ${i ? "active" : ""} ${s}`,
    disabled: h,
    ...c,
    children: [
      /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-icon", children: e }),
      n && /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-label", children: n })
    ]
  }
), Qr = (e) => {
  const {
    t: n,
    theme: i,
    hiddenMenus: a = []
  } = e, r = (m) => (a || []).includes(m), s = _t.useRef(null), h = _t.useRef(null), [c, u] = O(null), p = _t.useRef(null);
  q(() => {
    const m = (_) => {
      p.current && !p.current.contains(_.target) && u(null);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, []);
  const d = (m) => {
    u(c === m ? null : m);
  }, y = (m, _) => c !== m ? null : /* @__PURE__ */ t("div", { ref: p, className: "ui-toolbar-menu", children: _ }), f = (m, _, o) => /* @__PURE__ */ l(
    "div",
    {
      className: "ui-toolbar-menu-item",
      onClick: o,
      children: [
        /* @__PURE__ */ t("span", { className: "ui-toolbar-menu-icon", children: m }),
        _
      ]
    }
  ), v = () => /* @__PURE__ */ t("div", { className: "ui-toolbar-menu-divider" });
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
        ref: h,
        style: { display: "none" },
        multiple: !0,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: e.handleBatchConvert
      }
    ),
    !r("file") && /* @__PURE__ */ t("div", { className: "ui-toolbar-group", children: /* @__PURE__ */ l("div", { className: "ui-toolbar-menu-anchor", children: [
      /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(br, {}),
          label: n("tb_file"),
          active: c === "file",
          onClick: () => d("file"),
          theme: i
        }
      ),
      y("file", /* @__PURE__ */ l(ae, { children: [
        !r("open_file") && f(/* @__PURE__ */ t(Yr, {}), n("menu_open_file"), () => {
          s.current?.click(), u(null);
        }),
        !r("export") && f(/* @__PURE__ */ t(qr, {}), n("menu_export"), () => {
          e.setActiveTool?.("export"), u(null);
        }),
        !r("clear") && /* @__PURE__ */ l(ae, { children: [
          v(),
          f(/* @__PURE__ */ t(yr, {}), n("op_clear"), () => {
            e.handleClear?.(), u(null);
          })
        ] })
      ] }))
    ] }) }),
    !r("view") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(vr, {}),
          label: n("tb_fit"),
          onClick: () => e.sceneMgr?.fitView(),
          theme: i
        }
      ),
      /* @__PURE__ */ l("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Le,
          {
            icon: /* @__PURE__ */ t(zr, {}),
            label: n("tb_view"),
            active: c === "views",
            onClick: () => d("views"),
            theme: i
          }
        ),
        y("views", /* @__PURE__ */ l(ae, { children: [
          f(/* @__PURE__ */ t(Pr, {}), n("view_front"), () => {
            e.handleView?.("front"), u(null);
          }),
          f(/* @__PURE__ */ t(Tr, {}), n("view_back"), () => {
            e.handleView?.("back"), u(null);
          }),
          f(/* @__PURE__ */ t(Or, {}), n("view_top"), () => {
            e.handleView?.("top"), u(null);
          }),
          f(/* @__PURE__ */ t(Fr, {}), n("view_bottom"), () => {
            e.handleView?.("bottom"), u(null);
          }),
          f(/* @__PURE__ */ t(Rr, {}), n("view_left"), () => {
            e.handleView?.("left"), u(null);
          }),
          f(/* @__PURE__ */ t(jr, {}), n("view_right"), () => {
            e.handleView?.("right"), u(null);
          }),
          v(),
          f(/* @__PURE__ */ t(Hr, {}), n("view_se"), () => {
            e.handleView?.("se"), u(null);
          }),
          f(/* @__PURE__ */ t(Ur, {}), n("view_sw"), () => {
            e.handleView?.("sw"), u(null);
          }),
          f(/* @__PURE__ */ t(Gr, {}), n("view_ne"), () => {
            e.handleView?.("ne"), u(null);
          }),
          f(/* @__PURE__ */ t(Wr, {}), n("view_nw"), () => {
            e.handleView?.("nw"), u(null);
          })
        ] }))
      ] })
    ] }),
    !r("interface") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      !r("wireframe") && /* @__PURE__ */ l("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Le,
          {
            icon: /* @__PURE__ */ t($r, {}),
            label: n("display_mode") || "样式",
            active: c === "displayMode",
            onClick: () => d("displayMode"),
            theme: i
          }
        ),
        y("displayMode", /* @__PURE__ */ l(ae, { children: [
          f(/* @__PURE__ */ t(Kr, {}), n("dm_solid") || "着色", () => {
            e.handleDisplayModeChange?.("solid"), u(null);
          }),
          f(/* @__PURE__ */ t(Xr, {}), n("dm_transparent") || "透明", () => {
            e.handleDisplayModeChange?.("transparent"), u(null);
          })
        ] }))
      ] }),
      !r("outline") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(kn, {}),
          label: n("tb_model"),
          active: e.showOutline,
          onClick: () => e.setShowOutline?.(!e.showOutline),
          theme: i
        }
      ),
      !r("props") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Mr, {}),
          label: n("tb_props"),
          active: e.showProps,
          onClick: () => e.setShowProps?.(!e.showProps),
          theme: i
        }
      ),
      !r("pick") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(kr, {}),
          label: n("tb_pick"),
          active: e.pickEnabled,
          onClick: () => e.setPickEnabled?.(!e.pickEnabled),
          theme: i
        }
      )
    ] }),
    !r("tool") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      !r("measure") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(wr, {}),
          label: n("tb_measure"),
          active: e.activeTool === "measure",
          onClick: () => e.setActiveTool?.(e.activeTool === "measure" ? "none" : "measure"),
          theme: i
        }
      ),
      !r("boxSelect") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Ir, {}),
          label: n("tb_boxSelect"),
          active: e.activeTool === "boxSelect",
          onClick: () => e.setActiveTool?.(e.activeTool === "boxSelect" ? "none" : "boxSelect"),
          theme: i
        }
      ),
      !r("clip") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(xr, {}),
          label: n("tb_clip"),
          active: e.activeTool === "clip",
          onClick: () => e.setActiveTool?.(e.activeTool === "clip" ? "none" : "clip"),
          theme: i
        }
      ),
      !r("viewpoint") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Er, {}),
          label: n("tb_view"),
          active: e.activeTool === "viewpoint",
          onClick: () => e.setActiveTool?.(e.activeTool === "viewpoint" ? "none" : "viewpoint"),
          theme: i
        }
      ),
      !r("screenshot") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Ar, {}),
          label: n("tb_screenshot") || "截图",
          active: e.activeTool === "screenshot",
          onClick: () => e.openScreenshotPanel?.(),
          theme: i
        }
      ),
      !r("search") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Dr, {}),
          label: n("tb_search") || "搜索",
          active: e.activeTool === "search",
          onClick: () => e.setActiveTool?.(e.activeTool === "search" ? "none" : "search"),
          theme: i
        }
      ),
      !r("clash") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(gr, {}),
          label: n("tb_clash") || "碰撞",
          active: e.activeTool === "clash",
          onClick: () => e.setActiveTool?.(e.activeTool === "clash" ? "none" : "clash"),
          theme: i
        }
      ),
      !r("explode") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Br, {}),
          label: n("tb_explode") || "爆炸",
          active: e.activeTool === "explode",
          onClick: () => e.setActiveTool?.(e.activeTool === "explode" ? "none" : "explode"),
          theme: i
        }
      )
    ] }),
    !r("about") && /* @__PURE__ */ l("div", { className: "ui-toolbar-group", children: [
      !r("settings") && /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Cr, {}),
          label: n("tb_settings"),
          active: e.activeTool === "settings",
          onClick: () => e.setActiveTool?.(e.activeTool === "settings" ? "none" : "settings"),
          theme: i
        }
      ),
      /* @__PURE__ */ t(
        Le,
        {
          icon: /* @__PURE__ */ t(Nr, {}),
          label: n("tb_about"),
          onClick: () => e.onOpenAbout?.(),
          theme: i
        }
      )
    ] })
  ] });
}, Ee = ({
  children: e,
  variant: n = "default",
  size: i = "md",
  active: a,
  theme: r,
  style: s,
  className: h = "",
  ...c
}) => {
  let u = "ui-btn";
  return n === "primary" ? u += " ui-btn-primary" : n === "danger" ? u += " ui-btn-danger" : n === "ghost" ? u += " ui-btn-ghost" : u += " ui-btn-default", i === "sm" ? u += " ui-btn-sm" : i === "lg" ? u += " ui-btn-lg" : u += " ui-btn-md", a && (u += " active"), /* @__PURE__ */ t("button", { className: `${u} ${h}`, style: s, ...c, children: e });
}, mt = ({
  min: e,
  max: n,
  step: i = 1,
  value: a,
  onChange: r,
  theme: s,
  disabled: h = !1,
  style: c
}) => {
  const u = (a - e) / (n - e) * 100, p = ee(null), d = T((f) => {
    if (!p.current) return a;
    const v = p.current.getBoundingClientRect(), m = Math.max(0, Math.min(1, (f - v.left) / v.width)), _ = e + m * (n - e);
    return Math.round(_ / i) * i;
  }, [e, n, i, a]), y = T((f) => {
    if (h) return;
    f.preventDefault();
    const v = d(f.clientX);
    r(Math.max(e, Math.min(n, v)));
    const m = (o) => {
      const b = d(o.clientX);
      r(Math.max(e, Math.min(n, b)));
    }, _ = () => {
      document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", _);
    };
    document.addEventListener("mousemove", m), document.addEventListener("mouseup", _);
  }, [d, r, e, n, h]);
  return /* @__PURE__ */ l(
    "div",
    {
      ref: p,
      className: `ui-slider ui-slider-control ${h ? "ui-slider-control-disabled" : "ui-slider-control-interactive"}`,
      style: {
        width: "100%",
        minWidth: 0,
        ...c
      },
      onMouseDown: y,
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
              cursor: h ? "not-allowed" : "default"
            }
          }
        )
      ]
    }
  );
}, Jr = ({
  min: e,
  max: n,
  value: i,
  onChange: a,
  theme: r,
  disabled: s = !1,
  style: h
}) => {
  const c = ee(null), u = (i[0] - e) / (n - e) * 100, p = (i[1] - e) / (n - e) * 100, d = T((m) => {
    if (!c.current) return e;
    const _ = c.current.getBoundingClientRect(), o = Math.max(0, Math.min(1, (m - _.left) / _.width));
    return e + o * (n - e);
  }, [e, n]), y = T((m) => {
    if (s) return;
    m.preventDefault(), m.stopPropagation();
    const _ = (b) => {
      const k = d(b.clientX);
      a([Math.max(e, Math.min(i[1] - 1, Math.round(k))), i[1]]);
    }, o = () => {
      document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", o);
    };
    document.addEventListener("mousemove", _), document.addEventListener("mouseup", o);
  }, [s, d, a, e, i]), f = T((m) => {
    if (s) return;
    m.preventDefault(), m.stopPropagation();
    const _ = (b) => {
      const k = d(b.clientX);
      a([i[0], Math.min(n, Math.max(i[0] + 1, Math.round(k)))]);
    }, o = () => {
      document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", o);
    };
    document.addEventListener("mousemove", _), document.addEventListener("mouseup", o);
  }, [s, d, a, n, i]), v = T((m) => {
    if (s) return;
    m.preventDefault(), m.stopPropagation();
    const _ = d(m.clientX), o = Math.abs(_ - i[0]), b = Math.abs(_ - i[1]);
    o <= b ? a([Math.max(e, Math.min(i[1] - 1, Math.round(_))), i[1]]) : a([i[0], Math.min(n, Math.max(i[0] + 1, Math.round(_)))]);
  }, [s, d, a, e, n, i]);
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
        ...h
      },
      onClick: v,
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
              width: `${p - u}%`,
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
            onMouseDown: y
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${p}%`,
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
}, gt = ({ checked: e, onChange: n, disabled: i = !1, className: a = "" }) => /* @__PURE__ */ t(
  "button",
  {
    className: `ui-switch ${e ? "active" : ""} ${i ? "disabled" : ""} ${a}`,
    onClick: () => !i && n(!e),
    role: "switch",
    "aria-checked": e,
    disabled: i,
    children: /* @__PURE__ */ t("div", { className: "ui-switch-thumb" })
  }
), nn = ({
  options: e,
  value: n,
  onChange: i,
  className: a = ""
}) => /* @__PURE__ */ t("div", { className: `ui-segmented ${a}`, children: e.map((r) => /* @__PURE__ */ l(
  "button",
  {
    className: `ui-segmented-item ${n === r.value ? "active" : ""}`,
    onClick: () => i(r.value),
    children: [
      r.icon && /* @__PURE__ */ t("span", { children: r.icon }),
      /* @__PURE__ */ t("span", { children: r.label })
    ]
  },
  r.value
)) }), Zr = ({ value: e, onChange: n, style: i }) => /* @__PURE__ */ l("div", { className: "ui-color-picker", style: i, children: [
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
] }), Nt = ({ value: e, options: n, onChange: i, className: a = "", style: r, disabled: s }) => {
  const [h, c] = O(!1), u = ee(null), p = n.find((d) => d.value === e) || n[0];
  return q(() => {
    const d = (y) => {
      u.current && !u.current.contains(y.target) && c(!1);
    };
    return h && document.addEventListener("mousedown", d), () => {
      document.removeEventListener("mousedown", d);
    };
  }, [h]), /* @__PURE__ */ l(
    "div",
    {
      ref: u,
      className: `ui-select-custom ${h ? "open" : ""} ${s ? "disabled" : ""}`,
      style: r,
      children: [
        /* @__PURE__ */ l(
          "div",
          {
            className: `ui-select-selector ui-input ${a}`,
            onClick: () => !s && c(!h),
            children: [
              /* @__PURE__ */ t("span", { className: "ui-select-selection-item", children: p?.label }),
              /* @__PURE__ */ t("span", { className: "ui-select-arrow", children: /* @__PURE__ */ t("svg", { viewBox: "64 64 896 896", width: "12", height: "12", fill: "currentColor", children: /* @__PURE__ */ t("path", { d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" }) }) })
            ]
          }
        ),
        h && !s && /* @__PURE__ */ t("div", { className: "ui-select-dropdown", children: n.map((d) => /* @__PURE__ */ t(
          "div",
          {
            className: `ui-select-item ${d.value === e ? "selected" : ""}`,
            onClick: () => {
              i(d.value), c(!1);
            },
            children: d.label
          },
          d.value
        )) })
      ]
    }
  );
}, Xe = ({
  label: e,
  checked: n,
  onChange: i,
  disabled: a = !1,
  style: r,
  labelStyle: s
}) => /* @__PURE__ */ l(
  "label",
  {
    className: `ui-checkbox ${a ? "ui-checkbox-disabled" : ""}`,
    style: r,
    onClick: (h) => {
      a || (h.preventDefault(), i(!n));
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
), Xt = ({
  value: e,
  onChange: n,
  min: i,
  max: a,
  step: r = 1,
  unit: s,
  className: h = "",
  style: c,
  ...u
}) => {
  const [p, d] = O(() => String(e));
  q(() => {
    d(String(e));
  }, [e]);
  const y = (o) => {
    let b = o;
    return i !== void 0 && (b = Math.max(i, b)), a !== void 0 && (b = Math.min(a, b)), b;
  }, f = (o) => {
    const b = o.target.value;
    if (d(b), b.trim() === "") return;
    const k = parseFloat(b);
    isNaN(k) || n(y(k));
  }, v = () => {
    if (p.trim() === "") {
      d(String(e));
      return;
    }
    const o = parseFloat(p);
    if (isNaN(o)) {
      d(String(e));
      return;
    }
    const b = y(o);
    d(String(b)), b !== e && n(b);
  }, m = () => {
    const o = y(e + r);
    d(String(o)), n(o);
  }, _ = () => {
    const o = y(e - r);
    d(String(o)), n(o);
  };
  return /* @__PURE__ */ l(
    "div",
    {
      className: `ui-input-number ui-input-number-root ${h}`,
      style: c,
      children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "number",
            value: p,
            onChange: f,
            onBlur: v,
            min: i,
            max: a,
            step: r,
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
}, Mn = ({
  prevTitle: e,
  nextTitle: n,
  currentPage: i,
  totalPages: a,
  onPrev: r,
  onNext: s,
  rightContent: h
}) => /* @__PURE__ */ l("div", { className: "ui-page-nav-wrap", children: [
  /* @__PURE__ */ l("div", { className: "ui-page-nav-group", children: [
    /* @__PURE__ */ t(
      Ee,
      {
        variant: "ghost",
        className: "ui-properties-action ui-icon-btn ui-page-nav-btn",
        onClick: r,
        disabled: i <= 1,
        title: e,
        children: /* @__PURE__ */ t(fr, { size: 20 })
      }
    ),
    /* @__PURE__ */ l("span", { className: "ui-page-nav-indicator", children: [
      i,
      "/",
      a
    ] }),
    /* @__PURE__ */ t(
      Ee,
      {
        variant: "ghost",
        className: "ui-properties-action ui-icon-btn ui-page-nav-btn",
        onClick: s,
        disabled: i >= a,
        title: n,
        children: /* @__PURE__ */ t(It, { size: 20 })
      }
    )
  ] }),
  h
] }), Ln = ({ x: e, y: n, items: i, onClose: a, theme: r }) => {
  const s = ee(null);
  return q(() => {
    const h = (u) => {
      s.current && !s.current.contains(u.target) && a();
    }, c = (u) => {
      u.key === "Escape" && a();
    };
    return document.addEventListener("mousedown", h), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", h), document.removeEventListener("keydown", c);
    };
  }, [a]), /* @__PURE__ */ t(
    "div",
    {
      ref: s,
      className: "ui-context-menu",
      style: { left: e, top: n },
      children: i.map((h, c) => h.divider ? /* @__PURE__ */ t(
        "div",
        {
          className: "ui-context-menu-divider"
        },
        c
      ) : h.slider ? /* @__PURE__ */ l("div", { className: "ui-context-menu-item", style: { display: "flex", flexDirection: "column", gap: "4px", cursor: "default" }, children: [
        /* @__PURE__ */ l("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-secondary)" }, children: [
          /* @__PURE__ */ t("span", { children: h.label }),
          /* @__PURE__ */ l("span", { children: [
            Math.round((h.value || 0) * 100),
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
            value: h.value || 0,
            onChange: (u) => h.onChange?.(parseFloat(u.target.value)),
            style: { width: "100%", cursor: "pointer" }
          }
        )
      ] }, c) : /* @__PURE__ */ t(
        "div",
        {
          onClick: () => {
            !h.disabled && h.onClick && (h.onClick(), a());
          },
          className: `ui-context-menu-item ${h.disabled ? "disabled" : ""}`,
          children: h.label
        },
        c
      ))
    }
  );
}, ea = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]), ta = (...e) => {
  for (const n of e) {
    if (n == null) continue;
    const i = String(n).trim();
    if (!ea.has(i.toLowerCase()))
      return i;
  }
  return "";
}, En = (e, n = [], i = []) => {
  if (!e) return n;
  for (let a = 0; a < e.length; a++) {
    const r = e[a];
    r.isLastChild = a === e.length - 1, r.parentIsLast = [...i], n.push(r), r.expanded && r.children && r.children.length > 0 && En(r.children, n, [...i, r.isLastChild]);
  }
  return n;
}, na = (e) => {
  const n = /* @__PURE__ */ new Map(), i = (a) => {
    a.forEach((r) => {
      n.set(r.uuid, r.expanded), r.children.length > 0 && i(r.children);
    });
  };
  return i(e), n;
}, zn = (e, n) => e.map((i) => ({
  ...i,
  expanded: n.get(i.uuid) ?? i.expanded,
  children: zn(i.children, n)
})), pt = (e) => {
  const n = e?.object?.children ?? e?.children;
  return Array.isArray(n) ? n : [];
}, Bt = (e, n, i = !1) => {
  const a = Array.isArray(e?.children) ? e.children : [], r = e?.type === "Mesh" ? `Mesh_${e?.id ?? "?"}` : `Group_${e?.id ?? "?"}`;
  return {
    uuid: e?.id ?? e?.uuid ?? String(Math.random()),
    name: ta(e?.name, e?.userData?.name) || r,
    type: e?.type === "Mesh" ? "MESH" : "GROUP",
    depth: n,
    children: [],
    expanded: !1,
    visible: e?.visible !== !1,
    object: e,
    isFileNode: i,
    hasChildren: a.length > 0,
    childrenLoaded: !1
  };
}, Yt = (e) => e.childrenLoaded || !e.hasChildren ? e : {
  ...e,
  childrenLoaded: !0,
  children: pt(e).map((n) => Bt(n, e.depth + 1))
}, Dn = (e, n) => e ? e.id === n || e.uuid === n ? !0 : (Array.isArray(e.children) ? e.children : []).some((a) => Dn(a, n)) : !1, qt = (e) => {
  const n = e?.object ?? e, i = n?.userData?.ifcMetadata || {};
  return [
    n?.name,
    n?.type,
    n?.bimId,
    n?.userData?.bimId,
    n?.userData?.expressID,
    n?.userData?.ifcType,
    n?.userData?.globalId,
    i.storey,
    i.category,
    i.typeName,
    i.globalId,
    ...i.systems || [],
    ...i.materials || [],
    ...i.classifications || []
  ].filter(Boolean).join(" ").toLowerCase();
}, ia = _t.memo(({
  node: e,
  isActive: n,
  isMatched: i,
  isLocated: a,
  searchQuery: r,
  clashBadge: s,
  onSelect: h,
  onToggleNode: c,
  onToggleVisibility: u,
  onContextMenu: p
}) => /* @__PURE__ */ l(
  "div",
  {
    className: `ui-tree-node ${n ? "selected" : ""} ${i ? "matched" : ""} ${a ? "located" : ""}`,
    style: { paddingLeft: 8 + e.depth * 16 },
    onClick: () => h(e),
    onDoubleClick: (d) => {
      e.hasChildren && (d.stopPropagation(), c(e.uuid));
    },
    onContextMenu: (d) => p(d, e),
    children: [
      /* @__PURE__ */ t(
        "div",
        {
          className: "ui-tree-expander",
          onClick: (d) => {
            d.stopPropagation(), c(e.uuid);
          },
          children: e.hasChildren ? e.expanded ? /* @__PURE__ */ t(Ot, { size: 12 }) : /* @__PURE__ */ t(It, { size: 12 }) : null
        }
      ),
      /* @__PURE__ */ t(
        Xe,
        {
          checked: e.visible,
          onChange: (d) => u(e.uuid, d),
          style: { marginRight: 4, padding: 0, flexShrink: 0 }
        }
      ),
      /* @__PURE__ */ l("div", { className: "ui-tree-label", children: [
        r && e.name.toLowerCase().includes(r.toLowerCase()) ? /* @__PURE__ */ t("span", { children: e.name.split(new RegExp(`(${r})`, "gi")).map(
          (d, y) => d.toLowerCase() === r.toLowerCase() ? /* @__PURE__ */ t("span", { className: "ui-search-hit", children: d }, y) : d
        ) }) : e.name,
        s && /* @__PURE__ */ t(
          "span",
          {
            style: {
              marginLeft: 6,
              padding: "0 6px",
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${s.color}`,
              color: s.color,
              fontSize: "var(--font-size-label)",
              lineHeight: "16px",
              display: "inline-flex",
              alignItems: "center",
              verticalAlign: "middle"
            },
            children: s.label
          }
        )
      ] })
    ]
  }
), (e, n) => e.isActive === n.isActive && e.isMatched === n.isMatched && e.isLocated === n.isLocated && e.node === n.node && e.node.visible === n.node.visible && e.node.expanded === n.node.expanded && e.searchQuery === n.searchQuery && e.clashBadge?.label === n.clashBadge?.label), ra = ({
  t: e,
  treeRoot: n,
  setTreeRoot: i,
  selectedUuid: a,
  locatedUuid: r,
  onSelect: s,
  onToggleVisibility: h,
  onDelete: c,
  onIsolate: u,
  onHide: p,
  onShowAll: d,
  onLocate: y,
  onClearLocate: f,
  onLocateResultsChange: v,
  locateResultUuids: m = [],
  clashSummaryByUuid: _ = {}
}) => {
  const [o, b] = O(""), [k, g] = O(null), [P, R] = O(0), [S, I] = O(400), C = ee(null), D = ee(null), N = ee(null), $ = ee(""), [E, F] = O(null);
  q(() => {
    if (!C.current) return;
    const j = new ResizeObserver((B) => {
      B.forEach((de) => I(de.contentRect.height));
    });
    return j.observe(C.current), () => j.disconnect();
  }, []), q(() => {
    const j = $.current;
    if (!j && o && (N.current = na(n)), j && !o && N.current) {
      const B = N.current;
      i((de) => zn(de, B)), N.current = null;
    }
    $.current = o;
  }, [o, i, n]), q(() => {
    E && D.current === "tree" && i((j) => {
      const B = (be) => {
        let ke = !1;
        return [be.map((Ne) => {
          let Ie = Ne;
          if (Ne.uuid === E)
            return ke = !0, Ne;
          !Ne.childrenLoaded && Ne.hasChildren && pt(Ne).some((Y) => Dn(Y, E)) && (Ie = Yt(Ne));
          const [je, qe] = B(Ie.children);
          return qe && (ke = !0), {
            ...Ie,
            expanded: qe ? !0 : Ie.expanded,
            children: je
          };
        }), ke];
      }, [de, he] = B(j);
      return he ? de : j;
    });
  }, [E, i]);
  const A = (j, B) => {
    const de = B.toLowerCase();
    return j.reduce((he, be) => {
      const ke = !B || qt(be).includes(de), We = B ? pt(be).map((je) => Bt(je, be.depth + 1)) : be.children, Ne = A(We, B);
      return (!B || ke || Ne.length > 0) && he.push({
        ...be,
        childrenLoaded: B ? !0 : be.childrenLoaded,
        hasChildren: be.hasChildren ?? pt(be).length > 0,
        expanded: B ? !0 : be.expanded,
        children: Ne
      }), he;
    }, []);
  }, U = Se(() => A(n, o), [n, o]), G = Se(() => En(U), [U]), H = Se(() => {
    if (!o) return null;
    const j = o.toLowerCase(), B = [...n];
    for (; B.length > 0; ) {
      const de = B.shift();
      if (qt(de).includes(j)) return de;
      pt(de).map((he) => Bt(he, (de.depth ?? 0) + 1)).forEach((he) => B.push(he));
    }
    return null;
  }, [o, n]), x = Se(() => {
    if (!o.trim()) return [];
    const j = o.trim().toLowerCase(), B = [], de = [...n];
    for (; de.length > 0; ) {
      const he = de.shift();
      qt(he).includes(j) && B.push(he), pt(he).map((be) => Bt(be, (he.depth ?? 0) + 1)).forEach((be) => de.push(be));
    }
    return B;
  }, [o, n]), V = 24, z = G.length * V, ce = Math.max(0, Math.floor(P / V)), re = Math.ceil(S / V), Z = Math.min(G.length, ce + re + 1), te = G.slice(ce, Z);
  q(() => {
    D.current === "tree" && (D.current = null);
  }, [a]), q(() => {
    const j = o.trim() ? x.map((B) => B.uuid) : [];
    v?.(j);
  }, [x, o, v]);
  const ue = (j) => {
    const B = (de) => de.map((he) => he.uuid === j ? { ...Yt(he), expanded: !he.expanded } : he.children.length > 0 ? { ...he, children: B(he.children) } : he);
    i((de) => B(de));
  }, ne = () => {
    const j = (B) => B.map((de) => {
      const he = Yt(de);
      return {
        ...he,
        expanded: he.hasChildren,
        children: j(he.children)
      };
    });
    i((B) => j(B));
  }, ge = () => {
    const j = (B) => B.map((de) => ({
      ...de,
      expanded: !1,
      children: j(de.children)
    }));
    i((B) => j(B));
  }, _e = () => {
    H && y?.(H.object);
  }, ye = (j) => {
    const B = _[j];
    return B ? B.worstStatus === "new" ? {
      label: `${e("clash_group_new")} ${B.newCount}`,
      color: "var(--error)"
    } : B.worstStatus === "confirmed" ? {
      label: `${e("clash_group_confirmed")} ${B.confirmedCount}`,
      color: "var(--warning, #f59e0b)"
    } : {
      label: `${e("clash_group_resolved")} ${B.resolvedCount}`,
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
            onChange: (j) => b(j.target.value),
            onKeyDown: (j) => {
              j.key === "Enter" && (j.preventDefault(), _e());
            },
            className: "ui-input ui-input-compact"
          }
        ),
        o && /* @__PURE__ */ t("button", { className: "ui-search-clear", onClick: () => b(""), children: /* @__PURE__ */ t(ot, { width: 14, height: 14 }) })
      ] }),
      o && /* @__PURE__ */ l("div", { className: "ui-tree-search-meta", children: [
        /* @__PURE__ */ l("span", { children: [
          e("search_results"),
          ": ",
          x.length
        ] }),
        /* @__PURE__ */ t(
          Ee,
          {
            variant: "ghost",
            className: "ui-properties-action",
            onClick: _e,
            disabled: !H,
            children: e("locate_first_match")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        ref: C,
        className: "ui-tree-container flex-1 overflow-auto",
        onScroll: (j) => R(j.currentTarget.scrollTop),
        children: /* @__PURE__ */ t("div", { style: { height: z, position: "relative", minWidth: "max-content" }, children: /* @__PURE__ */ t("div", { style: { position: "absolute", top: ce * V, left: 0, right: 0, minWidth: "max-content" }, children: te.map((j) => /* @__PURE__ */ t(
          ia,
          {
            node: j,
            isActive: j.uuid === E,
            isMatched: m.includes(j.uuid),
            isLocated: j.uuid === r,
            searchQuery: o,
            clashBadge: ye(j.uuid),
            onSelect: (B) => {
              D.current = "tree", F(B.uuid), s(B.uuid, B.object);
            },
            onToggleNode: ue,
            onToggleVisibility: h,
            onContextMenu: (B, de) => {
              B.preventDefault(), g({ x: B.clientX, y: B.clientY, node: de });
            }
          },
          j.uuid
        )) }) })
      }
    ),
    k && /* @__PURE__ */ t(
      Ln,
      {
        x: k.x,
        y: k.y,
        onClose: () => g(null),
        items: [
          {
            label: e("locate_in_view"),
            onClick: () => y?.(k.node.object)
          },
          {
            divider: !0
          },
          {
            label: e("expand_all"),
            onClick: ne
          },
          {
            label: e("collapse_all"),
            onClick: ge
          },
          ...k.node.isFileNode ? [
            { divider: !0 },
            {
              label: e("delete_item"),
              onClick: () => c?.(k.node.object)
            }
          ] : []
        ]
      }
    )
  ] });
}, Ye = ({
  title: e,
  onClose: n,
  children: i,
  width: a = 300,
  height: r,
  x: s = 100,
  y: h = 100,
  resizable: c = !1,
  movable: u = !0,
  storageId: p,
  modal: d = !1,
  autoHeight: y = r === void 0,
  closeLabel: f = "Close"
}) => {
  const v = ee(null), m = p === "tool_measure" ? 320 : 220, _ = p === "tool_measure" ? 400 : 120, o = () => {
    if (d)
      return {
        x: Math.max(0, (window.innerWidth - a) / 2),
        y: Math.max(0, (window.innerHeight - (r ?? _)) / 2)
      };
    if (p)
      try {
        const x = localStorage.getItem(`panel_${p}`);
        if (x) {
          const V = JSON.parse(x);
          if (V.pos && typeof V.pos.x == "number" && typeof V.pos.y == "number")
            return {
              x: Math.min(Math.max(0, V.pos.x), window.innerWidth - 50),
              y: Math.min(Math.max(0, V.pos.y), window.innerHeight - 50)
            };
        }
      } catch {
      }
    return s === 100 && h === 100 && !p ? {
      x: Math.max(0, (window.innerWidth - a) / 2),
      y: Math.max(0, (window.innerHeight - (r ?? _)) / 2)
    } : { x: s, y: h };
  }, b = () => {
    if (p && c)
      try {
        const x = localStorage.getItem(`panel_${p}`);
        if (x) {
          const V = JSON.parse(x);
          if (V.size && typeof V.size.w == "number" && typeof V.size.h == "number")
            return {
              w: Math.max(m, V.size.w),
              h: Math.max(_, V.size.h)
            };
        }
      } catch {
      }
    return { w: a, h: r ?? _ };
  }, k = ee(o()), g = ee(b()), P = ee(!1), R = ee(!1), S = ee(null), I = ee({ x: 0, y: 0 }), C = ee({ x: 0, y: 0 }), D = ee({ w: 0, h: 0 }), N = T(() => {
    const x = v.current;
    if (!x) return;
    const V = k.current, z = g.current;
    x.style.transform = `translate(${V.x}px, ${V.y}px)`, x.style.width = `${z.w}px`, y || (x.style.height = `${z.h}px`);
  }, [y]), $ = T((x) => {
    if (!P.current && !R.current) return;
    x.preventDefault();
    const V = x.clientX - I.current.x, z = x.clientY - I.current.y, ce = v.current;
    if (P.current) {
      let re = window.innerWidth, Z = window.innerHeight;
      ce?.parentElement && (re = ce.parentElement.clientWidth, Z = ce.parentElement.clientHeight);
      const te = y && ce?.offsetHeight || g.current.h, ue = re - g.current.w, ne = Z - te;
      k.current = {
        x: Math.max(0, Math.min(C.current.x + V, ue)),
        y: Math.max(0, Math.min(C.current.y + z, ne))
      }, N();
    } else if (R.current && S.current) {
      const re = S.current;
      let Z = D.current.w, te = D.current.h, ue = C.current.x, ne = C.current.y;
      if (re.includes("e") && (Z = Math.max(m, D.current.w + V)), re.includes("w")) {
        const ge = D.current.w - m, _e = Math.min(V, ge);
        Z = D.current.w - _e, ue = C.current.x + _e;
      }
      if (re.includes("s") && (te = Math.max(_, D.current.h + z)), re.includes("n")) {
        const ge = D.current.h - _, _e = Math.min(z, ge);
        te = D.current.h - _e, ne = C.current.y + _e;
      }
      g.current = { w: Z, h: te }, (re.includes("w") || re.includes("n")) && (k.current = { x: ue, y: ne }), N();
    }
  }, [m, _, y, N]), E = T(() => {
    if ((P.current || R.current) && p)
      try {
        localStorage.setItem(`panel_${p}`, JSON.stringify({
          pos: k.current,
          size: g.current
        }));
      } catch {
      }
    P.current = !1, R.current = !1, S.current = null, document.body.style.cursor = "";
  }, [p]);
  q(() => (document.addEventListener("mousemove", $), document.addEventListener("mouseup", E), () => {
    document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", E);
  }), [$, E]), q(() => {
    if (!d) return;
    const x = () => {
      const V = y ? Math.min(window.innerHeight - 64, v.current?.offsetHeight || g.current.h) : g.current.h;
      k.current = {
        x: Math.max(0, (window.innerWidth - g.current.w) / 2),
        y: Math.max(0, (window.innerHeight - V) / 2)
      }, N();
    };
    return window.addEventListener("resize", x), x(), () => window.removeEventListener("resize", x);
  }, [y, d, N]);
  const F = (x) => {
    d || x.button !== 0 || !u || (x.preventDefault(), x.stopPropagation(), P.current = !0, I.current = { x: x.clientX, y: x.clientY }, C.current = { ...k.current }, document.body.style.cursor = "grabbing");
  }, A = (x) => (V) => {
    if (d || V.button !== 0 || !c) return;
    V.preventDefault(), V.stopPropagation(), R.current = !0, S.current = x, I.current = { x: V.clientX, y: V.clientY }, D.current = { ...g.current }, C.current = { ...k.current };
    const z = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    };
    document.body.style.cursor = z[x];
  }, U = (x) => {
    x.stopPropagation(), n?.();
  }, G = k.current, H = g.current;
  return /* @__PURE__ */ l(ae, { children: [
    d && /* @__PURE__ */ t(
      "div",
      {
        className: "ui-modal-scrim"
      }
    ),
    /* @__PURE__ */ l(
      "div",
      {
        ref: v,
        className: `ui-panel${d ? " ui-panel-modal" : ""}`,
        style: {
          position: d ? "fixed" : "absolute",
          left: 0,
          top: 0,
          transform: `translate(${G.x}px, ${G.y}px)`,
          width: H.w,
          height: y ? "auto" : H.h,
          maxHeight: y ? "calc(100vh - 64px)" : void 0,
          zIndex: d ? 2e3 : 200,
          willChange: P.current || R.current ? "transform, width, height" : "auto"
        },
        children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: `ui-panel-header ${!u || d ? "ui-panel-header-static" : ""}`,
              onMouseDown: F,
              children: [
                /* @__PURE__ */ t("span", { className: "ui-panel-title", children: e }),
                n && /* @__PURE__ */ t(
                  "button",
                  {
                    className: "ui-panel-close",
                    onClick: U,
                    title: f,
                    children: /* @__PURE__ */ t(ot, { width: 14, height: 14 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t("div", { className: "ui-panel-content", children: i }),
          c && !d && /* @__PURE__ */ l(ae, { children: [
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-e", onMouseDown: A("e") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-s", onMouseDown: A("s") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-w", onMouseDown: A("w") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-se", onMouseDown: A("se") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-sw", onMouseDown: A("sw") })
          ] })
        ]
      }
    )
  ] });
}, Ze = ({ label: e, children: n, labelWidth: i = "80px", stretch: a = !1 }) => /* @__PURE__ */ l(
  "div",
  {
    className: "ui-form-row ui-form-row-tight",
    children: [
      /* @__PURE__ */ t(
        "span",
        {
          className: "ui-form-label ui-form-label-dynamic",
          style: { "--label-width": i },
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
  settings: i,
  // 场景设置
  onUpdate: a,
  // 设置更新回调
  currentLang: r,
  // 当前语言
  setLang: s,
  // 设置语言回调
  showStats: h,
  // 是否显示统计
  setShowStats: c,
  // 设置统计显示回调
  // 样式配置
  theme: u
  // 主题配置
}) => {
  const [p, d] = O("general"), y = [
    { value: "general", label: e("setting_general") || "通用" },
    { value: "lighting", label: e("st_lighting") || "光照" },
    { value: "viewport", label: e("st_viewport") || "视口" },
    { value: "highlight", label: e("st_highlight") || "高亮" }
  ];
  return /* @__PURE__ */ t(
    Ye,
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
          nn,
          {
            options: y,
            value: p,
            onChange: (f) => d(f)
          }
        ) }),
        p === "general" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Ze, { label: e("st_lang"), labelWidth: "70px", stretch: !0, children: /* @__PURE__ */ t(
            Nt,
            {
              value: r,
              options: [
                { value: "zh", label: "简体中文" },
                { value: "en", label: "English" }
              ],
              onChange: (f) => s(f)
            }
          ) }),
          /* @__PURE__ */ t(Ze, { label: e("st_monitor"), labelWidth: "70px", children: /* @__PURE__ */ t(
            gt,
            {
              checked: h,
              onChange: (f) => c(f)
            }
          ) })
        ] }),
        p === "lighting" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Ze, { label: e("st_ambient") || "环境光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              mt,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: i.ambientInt || 0,
                onChange: (f) => a({ ambientInt: f })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (i.ambientInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(Ze, { label: e("st_dir") || "主光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              mt,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: i.dirInt || 0,
                onChange: (f) => a({ dirInt: f })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (i.dirInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(Ze, { label: e("st_back") || "背光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              mt,
              {
                min: 0,
                max: 2,
                step: 0.05,
                value: i.backLightInt ?? 0.5,
                onChange: (f) => a({ backLightInt: f })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (i.backLightInt ?? 0.5).toFixed(2) })
          ] }) })
        ] }),
        p === "viewport" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Ze, { label: e("st_viewcube_size"), labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              mt,
              {
                min: 120,
                max: 180,
                step: 5,
                value: i.viewCubeSize || 120,
                onChange: (f) => a({ viewCubeSize: f })
              }
            ) }),
            /* @__PURE__ */ l("div", { className: "ui-result-item-secondary-value ui-result-item-secondary-value-wide", children: [
              i.viewCubeSize || 120,
              "px"
            ] })
          ] }) }),
          /* @__PURE__ */ t(Ze, { label: e("st_adaptive_quality") || "Adaptive", labelWidth: "90px", children: /* @__PURE__ */ t(
            gt,
            {
              checked: i.adaptiveQuality !== !1,
              onChange: (f) => a({ adaptiveQuality: f })
            }
          ) }),
          /* @__PURE__ */ t(Ze, { label: e("st_performance_profile") || "性能策略", labelWidth: "90px", children: /* @__PURE__ */ t("div", { className: "ui-inline-actions ui-inline-actions-end", children: /* @__PURE__ */ t(
            nn,
            {
              options: [
                { value: "smooth", label: e("st_perf_smooth") || "流畅优先" },
                { value: "balanced", label: e("st_perf_balanced") || "平衡" },
                { value: "quality", label: e("st_perf_quality") || "画质优先" }
              ],
              value: i.performanceMode || "balanced",
              onChange: (f) => a({ performanceMode: f })
            }
          ) }) })
        ] }),
        p === "highlight" && /* @__PURE__ */ l("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Ze, { label: e("st_highlight_color") || "高亮颜色", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ t(
            Zr,
            {
              value: i.highlightColor || "#ff9f1c",
              onChange: (f) => a({ highlightColor: f })
            }
          ) }),
          /* @__PURE__ */ t(Ze, { label: e("st_highlight_box") || "显示包围盒", labelWidth: "90px", children: /* @__PURE__ */ t(
            gt,
            {
              checked: i.highlightShowBox === !0,
              onChange: (f) => a({ highlightShowBox: f })
            }
          ) })
        ] })
      ] })
    }
  );
}, Vn = {
  Trash: () => /* @__PURE__ */ t("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Close: () => /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 2L12 12M12 2L2 12", strokeLinecap: "round" }) })
}, oa = ({ onClick: e, disabled: n }) => /* @__PURE__ */ t(
  Ee,
  {
    onClick: e,
    disabled: n,
    variant: "ghost",
    size: "sm",
    className: "ui-btn-icon",
    title: "Clear All",
    children: /* @__PURE__ */ t(Vn.Trash, {})
  }
), sa = ({ children: e, empty: n, emptyText: i }) => /* @__PURE__ */ t("div", { className: "ui-data-panel ui-measure-results", children: n ? /* @__PURE__ */ t("div", { className: "ui-measure-empty", children: i }) : e }), la = ({ item: e, isHighlighted: n, onHighlight: i, onDelete: a }) => /* @__PURE__ */ l(
  "div",
  {
    onClick: i,
    className: `ui-list-item ui-measure-item ${n ? "selected" : ""}`,
    children: [
      /* @__PURE__ */ t("span", { className: "ui-measure-item-value", children: e.val }),
      /* @__PURE__ */ t(
        "button",
        {
          onClick: (r) => {
            r.stopPropagation(), a();
          },
          className: "ui-btn ui-btn-icon-sm ui-btn-ghost",
          style: { opacity: 0.6, marginLeft: "8px" },
          onMouseEnter: (r) => r.currentTarget.style.opacity = "1",
          onMouseLeave: (r) => r.currentTarget.style.opacity = "0.6",
          children: /* @__PURE__ */ t(Vn.Close, {})
        }
      )
    ]
  }
), ca = ({ label: e }) => /* @__PURE__ */ t("div", { className: "ui-group-title", children: e }), ua = ({
  t: e,
  sceneMgr: n,
  measureType: i,
  setMeasureType: a,
  measureHistory: r,
  onDelete: s,
  onClear: h,
  onClose: c,
  highlightedId: u,
  onHighlight: p
}) => {
  const d = Se(() => {
    const m = {
      dist: [],
      angle: [],
      coord: []
    };
    return r.forEach((_) => {
      m[_.type] && m[_.type].push(_);
    }), m;
  }, [r]), y = (m) => {
    a(m), n?.startMeasurement(m);
  }, f = () => {
    switch (i) {
      case "dist":
        return e("measure_instruct_dist");
      case "angle":
        return e("measure_instruct_angle");
      case "coord":
        return e("measure_instruct_coord");
      default:
        return "";
    }
  }, v = (m) => {
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
    Ye,
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
                className: `ui-segmented-item ${i === "none" ? "active" : ""}`,
                onClick: () => y("none"),
                children: /* @__PURE__ */ t("span", { children: e("measure_none") || "None" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${i === "dist" ? "active" : ""}`,
                onClick: () => y("dist"),
                children: /* @__PURE__ */ t("span", { children: e("measure_dist") || "Distance" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${i === "angle" ? "active" : ""}`,
                onClick: () => y("angle"),
                children: /* @__PURE__ */ t("span", { children: e("measure_angle") || "Angle" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${i === "coord" ? "active" : ""}`,
                onClick: () => y("coord"),
                children: /* @__PURE__ */ t("span", { children: e("measure_coord") || "Coord" })
              }
            )
          ] }),
          /* @__PURE__ */ t(oa, { onClick: h, disabled: r.length === 0 })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ t("span", { children: f() }),
          i !== "none" && /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-muted", children: "[ESC] Exit" })
        ] }),
        /* @__PURE__ */ t(sa, { empty: r.length === 0, emptyText: e("no_measurements") || "No measurements", children: r.length > 0 && /* @__PURE__ */ t("div", { className: "ui-measure-results-scroll", children: Object.entries(d).map(([m, _]) => _.length === 0 ? null : /* @__PURE__ */ l("div", { children: [
          /* @__PURE__ */ t(ca, { label: v(m) }),
          _.map((o) => /* @__PURE__ */ t(
            la,
            {
              item: o,
              isHighlighted: u === o.id,
              onHighlight: () => p?.(o.id),
              onDelete: () => s(o.id)
            },
            o.id
          ))
        ] }, m)) }) })
      ] })
    }
  );
}, Qt = ({ axis: e, label: n, active: i, value: a, onToggle: r, onChange: s, disabled: h = !1 }) => /* @__PURE__ */ l(
  "div",
  {
    className: `ui-clip-axis-row${h ? " ui-is-disabled" : ""}`,
    children: [
      /* @__PURE__ */ t(
        Xe,
        {
          checked: i,
          onChange: (c) => r(c),
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
          className: `ui-clip-axis-label${i ? " is-active" : ""}`,
          children: e.toUpperCase()
        }
      ),
      /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
        Jr,
        {
          min: 0,
          max: 100,
          value: a,
          onChange: s,
          disabled: h || !i
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
  clipEnabled: i,
  setClipEnabled: a,
  clipValues: r,
  setClipValues: s,
  clipActive: h,
  setClipActive: c,
  clipHelperVisible: u,
  setClipHelperVisible: p,
  clipHelperOpacity: d,
  setClipHelperOpacity: y
}) => {
  const f = () => {
    s({ x: [0, 100], y: [0, 100], z: [0, 100] });
  };
  return /* @__PURE__ */ t(
    Ye,
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
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(gt, { checked: i, onChange: (v) => a(v) }) })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_helper_visible") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(
              gt,
              {
                checked: u,
                onChange: (v) => p(v),
                disabled: !i
              }
            ) })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_helper_opacity") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value ui-form-value-stretch", children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
              /* @__PURE__ */ t(
                mt,
                {
                  min: 0.05,
                  max: 0.35,
                  step: 0.01,
                  value: d,
                  onChange: (v) => y(v),
                  disabled: !i || !u
                }
              ),
              /* @__PURE__ */ l("span", { className: "ui-slider-value", children: [
                Math.round(d * 100),
                "%"
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `ui-panel-section ui-panel-section-fill${i ? "" : " ui-is-disabled"}`,
            children: [
              /* @__PURE__ */ t(
                Qt,
                {
                  axis: "x",
                  label: e("clip_x"),
                  active: h.x,
                  value: r.x,
                  onToggle: (v) => c({ ...h, x: v }),
                  onChange: (v) => s({ ...r, x: v }),
                  disabled: !i
                }
              ),
              /* @__PURE__ */ t(
                Qt,
                {
                  axis: "y",
                  label: e("clip_y"),
                  active: h.y,
                  value: r.y,
                  onToggle: (v) => c({ ...h, y: v }),
                  onChange: (v) => s({ ...r, y: v }),
                  disabled: !i
                }
              ),
              /* @__PURE__ */ t(
                Qt,
                {
                  axis: "z",
                  label: e("clip_z"),
                  active: h.z,
                  value: r.z,
                  onToggle: (v) => c({ ...h, z: v }),
                  onChange: (v) => s({ ...r, z: v }),
                  disabled: !i
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ t("div", { className: "ui-panel-footer", children: /* @__PURE__ */ t(Ee, { variant: "default", onClick: f, disabled: !i, children: e("clip_reset") || "重置范围" }) })
      ] })
    }
  );
}, ha = ({ t: e, onClose: n, onExport: i, getDefaultFileName: a, theme: r }) => {
  const [s, h] = O("glb"), [c, u] = O(() => a("glb"));
  return q(() => {
    u(a(s));
  }, [s, a]), /* @__PURE__ */ t(Ye, { title: e("export_title"), closeLabel: e("panel_close") || "关闭", onClose: n, width: 320, height: 520, resizable: !1, theme: r, storageId: "tool_export", children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body", children: [
    /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption", children: [
      e("export_format"),
      ":"
    ] }),
    [
      { id: "glb", label: "GLB", desc: e("export_glb") },
      { id: "lmb", label: "LMB", desc: e("export_lmb") },
      { id: "nbim", label: "NBIM", desc: e("export_nbim") }
    ].map((p) => /* @__PURE__ */ l("label", { className: `ui-choice-card ${s === p.id ? "active" : ""}`, children: [
      /* @__PURE__ */ t(
        "input",
        {
          type: "radio",
          name: "exportFmt",
          checked: s === p.id,
          onChange: () => h(p.id),
          className: "ui-choice-card-radio"
        }
      ),
      /* @__PURE__ */ l("div", { className: "ui-choice-card-content", children: [
        /* @__PURE__ */ t("div", { className: "ui-choice-card-title", children: p.label }),
        /* @__PURE__ */ t("div", { className: "ui-choice-card-desc", children: p.desc })
      ] })
    ] }, p.id)),
    /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
      e("export_filename") || "文件名",
      ":"
    ] }),
    /* @__PURE__ */ t(
      "input",
      {
        type: "text",
        value: c,
        onChange: (p) => u(p.target.value),
        placeholder: e("export_filename_placeholder") || "请输入文件名",
        className: "ui-input ui-input-compact"
      }
    ),
    /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("export_filename_hint") || "留空时自动按模型名生成" }),
    /* @__PURE__ */ t(
      Ee,
      {
        theme: r,
        onClick: () => i(s, c),
        className: "ui-toolpanel-submit",
        children: e("export_btn")
      }
    )
  ] }) });
}, pa = ({ t: e, onClose: n, onCapture: i, theme: a }) => {
  const [r, s] = O("scene"), h = [
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
    Ye,
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
        h.map((c) => /* @__PURE__ */ l("label", { className: `ui-choice-card ${r === c.id ? "active" : ""}`, children: [
          /* @__PURE__ */ t(
            "input",
            {
              type: "radio",
              name: "screenshotMode",
              checked: r === c.id,
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
          Ee,
          {
            theme: a,
            onClick: () => i(r),
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
  viewpoints: i,
  onSave: a,
  onUpdateName: r,
  onLoad: s,
  onDelete: h,
  theme: c
}) => {
  const [u, p] = O(""), [d, y] = O({}), [f, v] = O(ma);
  q(() => {
    p(`${e("viewpoint_title") || "视点"} ${i.length + 1}`);
  }, [i.length, e]), q(() => {
    y(
      i.reduce((o, b) => (o[b.id] = b.name, o), {})
    );
  }, [i]);
  const m = () => {
    const o = u.trim();
    o && (a(o, f), p(`${e("viewpoint_title") || "视点"} ${i.length + 1}`));
  }, _ = (o) => {
    const b = (d[o] || "").trim();
    if (!b) {
      y((k) => ({
        ...k,
        [o]: i.find((g) => g.id === o)?.name || ""
      }));
      return;
    }
    r(o, b);
  };
  return /* @__PURE__ */ t(
    Ye,
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
              onChange: (o) => p(o.target.value),
              onKeyDown: (o) => {
                o.key === "Enter" && m();
              },
              className: "ui-input",
              placeholder: e("viewpoint_title") || "视点名称"
            }
          ),
          /* @__PURE__ */ t(Ee, { variant: "primary", onClick: m, children: e("btn_confirm") || "保存" })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-viewpoint-options", children: [
          /* @__PURE__ */ t(
            Xe,
            {
              label: e("viewpoint_save_visibility") || "保存可见性",
              checked: f.visibility,
              onChange: (o) => v((b) => ({ ...b, visibility: o }))
            }
          ),
          /* @__PURE__ */ t(
            Xe,
            {
              label: e("viewpoint_save_selection") || "保存选择",
              checked: f.selection,
              onChange: (o) => v((b) => ({ ...b, selection: o }))
            }
          ),
          /* @__PURE__ */ t(
            Xe,
            {
              label: e("viewpoint_save_clip") || "保存剖切",
              checked: f.clip,
              onChange: (o) => v((b) => ({ ...b, clip: o }))
            }
          ),
          /* @__PURE__ */ t(
            Xe,
            {
              label: e("viewpoint_save_explode") || "保存爆炸图",
              checked: f.explode,
              onChange: (o) => v((b) => ({ ...b, explode: o }))
            }
          )
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-viewpoint-list-wrap", children: i.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-empty-state", children: e("viewpoint_empty") || "暂无保存的视点" }) : /* @__PURE__ */ t("div", { className: "ui-viewpoint-grid", children: i.map((o) => /* @__PURE__ */ l("div", { className: "ui-viewpoint-card-v2", children: [
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
                    onClick: (b) => {
                      b.stopPropagation(), h(o.id);
                    },
                    title: e("delete_item") || "删除",
                    children: /* @__PURE__ */ t(Sr, { size: 12 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              className: "ui-viewpoint-name",
              value: d[o.id] || "",
              onChange: (b) => y((k) => ({
                ...k,
                [o.id]: b.target.value
              })),
              onBlur: () => _(o.id),
              onKeyDown: (b) => {
                b.key === "Enter" && b.currentTarget.blur();
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
}, Jt = ({ label: e, children: n, stretch: i = !1 }) => /* @__PURE__ */ l(
  "div",
  {
    className: "ui-form-row ui-form-row-tight",
    children: [
      /* @__PURE__ */ t("span", { className: "ui-form-label", children: e }),
      /* @__PURE__ */ t(
        "div",
        {
          className: `ui-form-value${i ? " ui-form-value-stretch ui-form-value-start" : ""}`,
          children: n
        }
      )
    ]
  }
), _a = ({
  t: e,
  onClose: n,
  enabled: i,
  strength: a,
  mode: r,
  onEnabledChange: s,
  onStrengthChange: h,
  onModeChange: c,
  onReset: u,
  theme: p
}) => /* @__PURE__ */ t(
  Ye,
  {
    title: e("explode_title") || "爆炸图",
    closeLabel: e("panel_close") || "关闭",
    onClose: n,
    width: 340,
    storageId: "tool_explode",
    modal: !1,
    autoHeight: !0,
    theme: p,
    children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body ui-toolpanel-body-compact", children: [
      /* @__PURE__ */ t(Jt, { label: e("explode_enable") || "启用", children: /* @__PURE__ */ t(gt, { checked: i, onChange: s }) }),
      /* @__PURE__ */ t(Jt, { label: e("explode_strength") || "强度", stretch: !0, children: /* @__PURE__ */ l("div", { className: "ui-slider-field", children: [
        /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
          mt,
          {
            min: 0,
            max: 100,
            step: 1,
            value: a,
            onChange: h
          }
        ) }),
        /* @__PURE__ */ l("div", { className: "ui-slider-value ui-slider-value-strong", children: [
          a,
          "%"
        ] })
      ] }) }),
      /* @__PURE__ */ t(Jt, { label: e("explode_mode") || "方向", stretch: !0, children: /* @__PURE__ */ t(
        nn,
        {
          options: [
            { value: "radial", label: e("explode_mode_radial") || "四周" },
            { value: "horizontal", label: e("explode_mode_horizontal") || "横向" },
            { value: "vertical", label: e("explode_mode_vertical") || "纵向" }
          ],
          value: r,
          onChange: (d) => c(d)
        }
      ) }),
      /* @__PURE__ */ t("div", { className: "ui-panel-footer ui-panel-footer-spaced", children: /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: u, children: e("explode_reset") || "重置" }) })
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
  conditions: i,
  results: a,
  searching: r,
  searchProgress: s,
  searchStatus: h,
  onConditionsChange: c,
  onSearch: u,
  onCancelSearch: p,
  onApplyResultHighlight: d,
  onClearResult: y,
  theme: f
}) => {
  const [v, m] = O(1), [_, o] = O(50);
  q(() => {
    m(1);
  }, [a.length, _]);
  const b = Math.max(1, Math.ceil(a.length / _)), k = Math.min(v, b), g = (k - 1) * _, P = Se(() => a.slice(g, g + _), [a, g, _]), R = (C, D) => {
    c(i.map((N) => N.id === C ? { ...N, ...D } : N));
  }, S = () => {
    const C = `cond_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    c([
      ...i,
      {
        id: C,
        propertyName: "",
        operator: "contains",
        value: "",
        connector: "AND"
      }
    ]);
  }, I = (C) => {
    const D = i.filter((N) => N.id !== C);
    c(D.length > 0 ? D : [{ id: "cond_init", propertyName: "", operator: "contains", value: "" }]);
  };
  return /* @__PURE__ */ t(
    Ye,
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
            /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: S, children: e("search_add_condition") || "添加条件" }),
            /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: u, disabled: r, children: r ? e("searching") || "搜索中..." : e("search_run") || "搜索" })
          ] })
        ] }),
        i.map((C, D) => /* @__PURE__ */ l(
          "div",
          {
            className: `ui-toolpanel-grid ui-toolpanel-grid-condition ${D > 0 ? "ui-toolpanel-grid-condition-linked" : "ui-toolpanel-grid-condition-first"}`,
            children: [
              D > 0 && /* @__PURE__ */ t(
                Nt,
                {
                  value: C.connector || "AND",
                  options: ya.map((N) => ({ value: N.value, label: e(N.labelKey) || N.fallback })),
                  onChange: (N) => R(C.id, { connector: N }),
                  className: "ui-input-compact",
                  style: { width: "64px", flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ t(
                "input",
                {
                  className: "ui-input ui-input-compact",
                  placeholder: e("search_field_name") || "属性名",
                  value: C.propertyName,
                  onChange: (N) => R(C.id, { propertyName: N.target.value }),
                  style: { flex: 1, minWidth: 0 }
                }
              ),
              /* @__PURE__ */ t(
                Nt,
                {
                  value: C.operator,
                  options: ga.map((N) => ({ value: N.value, label: e(N.labelKey) || N.fallback })),
                  onChange: (N) => R(C.id, { operator: N }),
                  className: "ui-input-compact",
                  style: { width: "92px" }
                }
              ),
              /* @__PURE__ */ t(
                "input",
                {
                  className: "ui-input ui-input-compact",
                  placeholder: e("search_field_value") || "属性值",
                  value: C.value,
                  onChange: (N) => R(C.id, { value: N.target.value }),
                  style: { flex: 1, minWidth: 0 }
                }
              ),
              D > 0 ? /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-search-clear ui-search-clear-static",
                  onClick: () => I(C.id),
                  title: e("remove_condition") || "移除条件",
                  style: { flexShrink: 0, width: "24px" },
                  children: /* @__PURE__ */ t(ot, { width: 14, height: 14 })
                }
              ) : /* @__PURE__ */ t("div", { style: { width: "24px", flexShrink: 0 } })
            ]
          },
          C.id
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
              Nt,
              {
                value: String(_),
                onChange: (C) => o(Number(C) || 50),
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
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-box ui-search-results-box", children: a.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: e("search_no_results") || "暂无结果" }) : P.map((C) => /* @__PURE__ */ t(
          "div",
          {
            className: "ui-search-result-item ui-search-result-item-simple",
            title: `${C.uuid}
${C.matchedBy.join(`
`)}`,
            children: /* @__PURE__ */ l(
              "button",
              {
                className: "ui-search-result-main",
                onClick: () => d(C.uuid),
                children: [
                  /* @__PURE__ */ t("span", { children: C.name || C.uuid }),
                  /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: [C.type, C.modelId, ...C.matchedBy].filter(Boolean).join(" · ") })
                ]
              }
            )
          },
          C.uuid
        )) }),
        a.length > 0 && /* @__PURE__ */ t(
          Mn,
          {
            prevTitle: e("search_page_prev") || "上一页",
            nextTitle: e("search_page_next") || "下一页",
            currentPage: k,
            totalPages: b,
            onPrev: () => m((C) => Math.max(1, C - 1)),
            onNext: () => m((C) => Math.min(b, C + 1)),
            rightContent: /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: y, children: e("search_clear") || "清除结果" })
          }
        ),
        r && /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay", children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-overlay-card", children: [
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay-title", children: h || e("searching") || "搜索中..." }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full", children: /* @__PURE__ */ t("div", { className: "ui-progress-fill", style: { width: `${Math.max(0, Math.min(100, s))}%` } }) }),
          /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: [
              Math.round(s),
              "%"
            ] }),
            /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: p, children: e("search_cancel") || "取消搜索" })
          ] })
        ] }) })
      ] })
    }
  );
}, va = ({
  t: e,
  onClose: n,
  running: i,
  progress: a,
  status: r,
  scannedCount: s,
  pairsScanned: h,
  results: c,
  resultFilter: u,
  modelOptions: p,
  setA: d,
  setB: y,
  tolerance: f,
  minOverlapVolume: v,
  clearanceDistance: m,
  useNarrowPhase: _,
  useTrianglePhase: o,
  includeSameModel: b,
  onSetAChange: k,
  onSetBChange: g,
  onToleranceChange: P,
  onMinOverlapVolumeChange: R,
  onClearanceDistanceChange: S,
  onUseNarrowPhaseChange: I,
  onUseTrianglePhaseChange: C,
  onIncludeSameModelChange: D,
  onRun: N,
  onCancel: $,
  onClear: E,
  onExportCsv: F,
  onIsolateByStatus: A,
  onRestoreVisibility: U,
  onResultFilterChange: G,
  typeFilter: H,
  onTypeFilterChange: x,
  onUpdateResultStatus: V,
  onMarkFilteredStatus: z,
  onSetASelectAll: ce,
  onSetAClear: re,
  onSetBSelectAll: Z,
  onSetBClear: te,
  onFocusResult: ue,
  theme: ne
}) => {
  const [ge, _e] = O(1), [ye, j] = O(50), [B, de] = O(p.length <= 4), [he, be] = O(!1);
  q(() => {
    _e(1);
  }, [c.length, ye]);
  const ke = c, We = Math.max(1, Math.ceil(ke.length / ye)), Ne = Math.min(ge, We), Ie = (Ne - 1) * ye, je = Se(() => ke.slice(Ie, Ie + ye), [ke, Ie, ye]), qe = Se(() => new Set(d), [d]), st = Se(() => new Set(y), [y]), K = r || (i ? e("clash_running") || "正在执行碰撞检查..." : e("clash_ready") || "准备就绪"), Y = `${e("clash_set_a") || "模型集 A"} ${d.length} · ${e("clash_set_b") || "模型集 B"} ${y.length}`, Q = (M, ie, pe) => {
    const le = new Set(M);
    le.has(ie) ? le.delete(ie) : le.add(ie), pe(Array.from(le));
  };
  return /* @__PURE__ */ t(
    Ye,
    {
      title: e("tb_clash") || "碰撞检查",
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 500,
      storageId: "tool_clash",
      autoHeight: !0,
      theme: ne,
      children: /* @__PURE__ */ l("div", { className: "ui-toolpanel-body ui-clash-panel", children: [
        /* @__PURE__ */ l("div", { className: "ui-clash-hero", children: [
          /* @__PURE__ */ l("div", { className: "ui-clash-hero-main", children: [
            /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong ui-clash-hero-title", children: K }),
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-caption ui-clash-hero-meta", children: [
              e("clash_scope_visible") || "范围：当前可见构件",
              " · ",
              e("clash_candidates") || "候选",
              " ",
              s,
              " · ",
              e("clash_pairs_scanned") || "已扫描对数",
              " ",
              h
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-toolpanel-row ui-toolpanel-wrap ui-clash-hero-actions", children: [
            i ? /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: $, children: e("search_cancel") || "取消搜索" }) : /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: N, variant: "primary", children: e("clash_run") || "开始检查" }),
            /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: E, children: e("clash_clear") || "清空结果" }),
            /* @__PURE__ */ t(Ee, { className: "ui-properties-action", onClick: F, disabled: c.length === 0, children: e("clash_export_csv") || "导出 CSV" })
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full ui-clash-progress", children: /* @__PURE__ */ t("div", { className: "ui-progress-fill", style: { width: `${Math.max(0, Math.min(100, a))}%` } }) })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-clash-section", children: [
          /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "ui-clash-section-toggle",
              onClick: () => de((M) => !M),
              children: [
                /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-strong ui-clash-section-title", children: e("clash_scope_visible") || "检测范围" }),
                /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption ui-clash-section-summary", children: Y })
              ]
            }
          ),
          B && /* @__PURE__ */ l("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
            /* @__PURE__ */ l("div", { className: "ui-selection-box", children: [
              /* @__PURE__ */ l("div", { className: "ui-selection-box-header", children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: e("clash_set_a") || "模型集 A" }),
                /* @__PURE__ */ l("div", { className: "ui-selection-box-actions", children: [
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: ce, children: e("select_all") || "全选" }),
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: re, children: e("search_clear") || "清空" })
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: p.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("clash_no_models") || "暂无模型" }) : p.map((M) => /* @__PURE__ */ t(
                Xe,
                {
                  checked: qe.has(M.id),
                  onChange: () => Q(d, M.id, k),
                  label: M.name,
                  labelStyle: { fontSize: 11 }
                },
                `a_${M.id}`
              )) })
            ] }),
            /* @__PURE__ */ l("div", { className: "ui-selection-box", children: [
              /* @__PURE__ */ l("div", { className: "ui-selection-box-header", children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: e("clash_set_b") || "模型集 B" }),
                /* @__PURE__ */ l("div", { className: "ui-selection-box-actions", children: [
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: Z, children: e("select_all") || "全选" }),
                  /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: te, children: e("search_clear") || "清空" })
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: p.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("clash_no_models") || "暂无模型" }) : p.map((M) => /* @__PURE__ */ t(
                Xe,
                {
                  checked: st.has(M.id),
                  onChange: () => Q(y, M.id, g),
                  label: M.name,
                  labelStyle: { fontSize: 11 }
                },
                `b_${M.id}`
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
              onClick: () => be((M) => !M),
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
          he && /* @__PURE__ */ l(ae, { children: [
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: e("clash_tolerance") || "容差" }),
                /* @__PURE__ */ t(
                  Xt,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(f) ? f : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (M) => P(Math.max(0, M || 0)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: e("clash_min_overlap") || "最小重叠体积" }),
                /* @__PURE__ */ t(
                  Xt,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(v) ? v : 0,
                    min: 0,
                    step: 1e-6,
                    onChange: (M) => R(Math.max(0, M || 0)),
                    style: { width: "100%" }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: e("clash_clearance_distance") || "最小净空距离" }),
                /* @__PURE__ */ t(
                  Xt,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(m) ? m : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (M) => S(Math.max(0, M || 0)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-clash-option-stack", children: [
                /* @__PURE__ */ t(
                  Xe,
                  {
                    checked: _,
                    onChange: I,
                    label: e("clash_narrow_phase") || "启用精筛（OBB）",
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Xe,
                  {
                    checked: o,
                    onChange: C,
                    label: e("clash_triangle_phase") || "启用三角面复核",
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Xe,
                  {
                    checked: b,
                    onChange: D,
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
              ke.length
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: e("locate_in_view") || "点击条目定位到视图" })
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-row", children: /* @__PURE__ */ t(
            Nt,
            {
              value: String(ye),
              onChange: (M) => j(Number(M) || 50),
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
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-box ui-clash-results-box", children: ke.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: e("clash_no_results") || "暂无碰撞结果" }) : je.map((M) => /* @__PURE__ */ l(
          "button",
          {
            className: "ui-search-result-item ui-clash-result-item",
            onClick: () => ue(M),
            title: `${M.aUuid} <> ${M.bUuid}`,
            children: [
              /* @__PURE__ */ t("div", { className: "ui-clash-result-top", children: /* @__PURE__ */ l("span", { className: "ui-clash-result-title", children: [
                M.aName || M.aUuid,
                " ",
                " <> ",
                " ",
                M.bName || M.bUuid
              ] }) }),
              /* @__PURE__ */ l("div", { className: "ui-toolpanel-row-between ui-clash-result-meta", children: [
                /* @__PURE__ */ l("span", { className: "ui-result-item-secondary", children: [
                  M.aUuid,
                  " ",
                  " <> ",
                  " ",
                  M.bUuid
                ] }),
                /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: M.type === "hard" ? `${e("clash_overlap_volume") || "重叠体积"}: ${M.overlapVolume.toFixed(6)}` : `${e("clash_clearance_value") || "净空距离"}: ${M.distance.toFixed(6)}` })
              ] })
            ]
          },
          M.id
        )) }),
        ke.length > 0 && /* @__PURE__ */ t(
          Mn,
          {
            prevTitle: e("search_page_prev") || "上一页",
            nextTitle: e("search_page_next") || "下一页",
            currentPage: Ne,
            totalPages: We,
            onPrev: () => _e((M) => Math.max(1, M - 1)),
            onNext: () => _e((M) => Math.min(We, M + 1))
          }
        )
      ] })
    }
  );
}, wa = ({ t: e, loading: n, status: i, progress: a, theme: r }) => n ? /* @__PURE__ */ t("div", { className: "ui-loading-overlay", children: /* @__PURE__ */ l("div", { className: "ui-loading-box", children: [
  /* @__PURE__ */ l("div", { className: "ui-loading-header", children: [
    /* @__PURE__ */ t("div", { className: "ui-loading-title", children: i }),
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
function An(e) {
  if (e == null) return "";
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean") return String(e);
  if (Array.isArray(e)) return e.map((n) => An(n)).filter(Boolean).join(", ");
  if (typeof e == "object")
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  return String(e);
}
function xa(e) {
  return Array.isArray(e) ? e : Object.entries(e).map(([n, i]) => ({ key: n, value: i }));
}
function yt(e, n, i) {
  return xa(n).map((a, r) => {
    const s = String(a.key ?? "").trim(), h = An(a.value);
    if (!s || !h) return null;
    const c = `${e}.${s}`;
    return {
      id: a.id || `${e}::${s}::${r}`,
      group: e,
      key: s,
      value: h,
      path: c,
      rawKey: a.rawKey,
      source: a.source || i,
      normalizedGroup: rt(e),
      normalizedKey: rt(s),
      normalizedPath: rt(c),
      normalizedValue: rt(h)
    };
  }).filter(Boolean);
}
function Ca(e, n) {
  return e ? Object.entries(e).map(([i, a]) => ({
    name: i,
    items: yt(i, a, n)
  })).filter((i) => i.items.length > 0) : [];
}
function Na(e, n) {
  const i = rt(n);
  return i ? e.map((a) => ({
    ...a,
    items: a.items.filter(
      (r) => r.normalizedGroup.includes(i) || r.normalizedKey.includes(i) || r.normalizedPath.includes(i) || r.normalizedValue.includes(i)
    )
  })).filter((a) => a.items.length > 0) : e.filter((a) => a.items.length > 0);
}
function Sa(e) {
  return e.map((n) => [`[${n.name}]`, ...n.items.map((i) => `${i.key}: ${i.value}`)].join(`
`)).join(`

`);
}
const ka = _t.memo(({ item: e, handleCopy: n, t: i }) => /* @__PURE__ */ l("div", { className: "ui-prop-row", children: [
  /* @__PURE__ */ t(
    "div",
    {
      className: "ui-prop-key",
      title: `${e.path} (${i("click_to_copy")})`,
      onClick: () => n(e.key),
      children: e.key
    }
  ),
  /* @__PURE__ */ t(
    "div",
    {
      className: "ui-prop-value",
      title: `${e.value}
${e.path}`,
      onClick: () => n(e.value),
      children: e.value
    }
  )
] }));
_t.memo(({ group: e, isCollapsed: n, toggleGroup: i, handleCopy: a, t: r }) => /* @__PURE__ */ l("div", { children: [
  /* @__PURE__ */ l("div", { className: `ui-prop-group${n ? " collapsed" : ""}`, onClick: () => i(e.name), children: [
    /* @__PURE__ */ t("span", { children: e.name }),
    /* @__PURE__ */ l("div", { className: "ui-prop-group-actions", children: [
      /* @__PURE__ */ t(
        "button",
        {
          className: "ui-prop-copy",
          onClick: (s) => {
            s.stopPropagation(), a([`[${e.name}]`, ...e.items.map((h) => `${h.key}: ${h.value}`)].join(`
`));
          },
          title: r("copy_group_props"),
          children: /* @__PURE__ */ t(tn, { size: 12 })
        }
      ),
      /* @__PURE__ */ t("span", { className: "ui-prop-group-chevron", children: n ? /* @__PURE__ */ t(It, { width: 14, height: 14 }) : /* @__PURE__ */ t(Ot, { width: 14, height: 14 }) })
    ] })
  ] }),
  !n && e.items.map((s) => /* @__PURE__ */ t(ka, { item: s, handleCopy: a, t: r }, s.id))
] }));
const Ma = ({ t: e, selectedProps: n }) => {
  const [i, a] = O(/* @__PURE__ */ new Set()), [r, s] = O(""), [h, c] = O(null), u = Se(() => n, [n]), p = (m) => {
    const _ = new Set(i);
    _.has(m) ? _.delete(m) : _.add(m), a(_);
  }, d = async (m) => {
    try {
      await navigator.clipboard.writeText(m), c(m), setTimeout(() => c(null), 1500);
    } catch (_) {
      try {
        const o = document.createElement("textarea");
        o.value = m, o.setAttribute("readonly", "true"), o.style.position = "fixed", o.style.left = "-9999px", o.style.top = "0", document.body.appendChild(o), o.focus(), o.select();
        const b = document.execCommand("copy");
        if (document.body.removeChild(o), b) {
          c(m), setTimeout(() => c(null), 1500);
          return;
        }
      } catch {
      }
      console.error("Failed to copy", _);
    }
  }, y = Se(() => u ? Na(u, r) : null, [u, r]);
  q(() => {
    if (!y || !r) return;
    const m = new Set(y.map((_) => _.name));
    a((_) => {
      const o = new Set(_);
      return m.forEach((b) => o.delete(b)), o;
    });
  }, [y, r]);
  const f = y ? y.length : 0, v = y ? y.reduce((m, _) => m + _.items.length, 0) : 0;
  return /* @__PURE__ */ l("div", { className: "ui-properties-panel", children: [
    n && /* @__PURE__ */ l("div", { className: "ui-properties-toolbar", children: [
      /* @__PURE__ */ t("div", { className: "ui-search-input-wrap", children: /* @__PURE__ */ t(
        "input",
        {
          type: "text",
          placeholder: e("search_props"),
          value: r,
          onChange: (m) => s(m.target.value),
          className: "ui-input ui-input-compact"
        }
      ) }),
      /* @__PURE__ */ l("div", { className: "ui-properties-subbar", children: [
        /* @__PURE__ */ l("div", { className: "ui-properties-meta", children: [
          e(r ? "search_results" : "prop_groups") + `: ${f}`,
          /* @__PURE__ */ t("span", { children: " 路 " }),
          e("prop_items") + `: ${v}`
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-properties-actions", children: /* @__PURE__ */ t(
          "button",
          {
            className: "ui-properties-action ui-properties-icon-btn",
            onClick: () => u && d(Sa(u)),
            disabled: !u,
            title: e("copy_all_props"),
            children: /* @__PURE__ */ t(tn, { size: 14 })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "ui-properties-scroll", children: y ? y.map((m) => /* @__PURE__ */ l("div", { children: [
      /* @__PURE__ */ l("div", { className: `ui-prop-group${i.has(m.name) ? " collapsed" : ""}`, onClick: () => p(m.name), children: [
        /* @__PURE__ */ t("span", { children: m.name }),
        /* @__PURE__ */ l("div", { className: "ui-prop-group-actions", children: [
          /* @__PURE__ */ t(
            "button",
            {
              className: "ui-prop-copy",
              onClick: (_) => {
                _.stopPropagation(), d([`[${m.name}]`, ...m.items.map((o) => `${o.key}: ${o.value}`)].join(`
`));
              },
              title: e("copy_group_props"),
              children: /* @__PURE__ */ t(tn, { size: 12 })
            }
          ),
          /* @__PURE__ */ t("span", { className: "ui-prop-group-chevron", children: i.has(m.name) ? /* @__PURE__ */ t(It, { width: 14, height: 14 }) : /* @__PURE__ */ t(Ot, { width: 14, height: 14 }) })
        ] })
      ] }),
      !i.has(m.name) && m.items.map((_) => /* @__PURE__ */ l("div", { className: "ui-prop-row", children: [
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-prop-key",
            title: `${_.path} (${e("click_to_copy")})`,
            onClick: () => d(_.key),
            children: _.key
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-prop-value",
            title: `${_.value}
${_.path}`,
            onClick: () => d(_.value),
            children: _.value
          }
        )
      ] }, _.id))
    ] }, m.name)) : /* @__PURE__ */ t("div", { className: "ui-properties-empty", children: e("no_selection") }) }),
    h && /* @__PURE__ */ t("div", { className: "ui-copy-toast", children: e("copied") })
  ] });
}, La = ({ isOpen: e, title: n, message: i, onConfirm: a, onCancel: r, t: s, theme: h }) => e ? /* @__PURE__ */ t(
  Ye,
  {
    title: n,
    onClose: r,
    width: 360,
    height: 188,
    modal: !0,
    movable: !1,
    theme: h,
    children: /* @__PURE__ */ l(
      "div",
      {
        className: "ui-modal-body ui-modal-body-confirm",
        children: [
          /* @__PURE__ */ t("div", { className: "ui-modal-message", children: i }),
          /* @__PURE__ */ l("div", { className: "ui-modal-actions", children: [
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-default ui-modal-action-btn",
                onClick: r,
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
) : null, Ea = ({ isOpen: e, onClose: n, t: i, theme: a }) => {
  if (!e) return null;
  const [r, s] = O(!1);
  return /* @__PURE__ */ t(
    Ye,
    {
      title: i("about_title"),
      onClose: n,
      width: 400,
      height: r ? 500 : 350,
      modal: !0,
      movable: !1,
      theme: a,
      children: /* @__PURE__ */ l("div", { className: "ui-modal-body ui-modal-body-scroll ui-about-modal", children: [
        /* @__PURE__ */ l("div", { className: "ui-about-hero", children: [
          /* @__PURE__ */ t("div", { className: "ui-about-app-name", children: "3D Browser" }),
          /* @__PURE__ */ t("div", { className: "ui-about-tagline", children: i("about_tagline") })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-about-meta-card", children: [
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: i("about_version") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value", children: "1.6.0" })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: i("about_author") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value", children: "zhangly1403@163.com" })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: i("project_url") }),
            /* @__PURE__ */ t("a", { href: "https://github.com/zly258/3dbrowser", target: "_blank", rel: "noopener noreferrer", className: "ui-link", children: "github.com/zly258/3dbrowser" })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-about-meta-label", children: i("about_license") }),
            /* @__PURE__ */ t("span", { className: "ui-about-meta-value ui-about-license-badge", children: i("about_license_nc") })
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-about-license-card", children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: "ui-about-license-toggle",
              onClick: () => s(!r),
              children: [
                /* @__PURE__ */ t("span", { className: "ui-about-license-title", children: i("license_details") }),
                r ? /* @__PURE__ */ t(_r, { width: 14, height: 14 }) : /* @__PURE__ */ t(Ot, { width: 14, height: 14 })
              ]
            }
          ),
          r && /* @__PURE__ */ l("div", { className: "ui-about-license-content", children: [
            /* @__PURE__ */ t("div", { className: "ui-about-license-summary", children: i("license_summary") }),
            /* @__PURE__ */ l("div", { className: "ui-about-license-link", children: [
              i("full_license"),
              " ",
              /* @__PURE__ */ t("a", { href: "https://creativecommons.org/licenses/by-nc/4.0/", target: "_blank", rel: "noopener noreferrer", className: "ui-link", children: "CC BY-NC 4.0" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-about-footer", children: i("about_copyright") })
      ] })
    }
  );
}, za = ({ sceneMgr: e, lang: n = "zh", theme: i }) => {
  const a = ee(null), r = ee(null), s = ee(null), h = ee(null), c = ee(null), u = ee(null), p = ee(new L.Raycaster()), d = ee(new L.Vector2()), y = ee(null), f = e?.settings?.viewCubeSize || 120, v = (k) => Ct(n, k);
  q(() => {
    if (!r.current || !a.current) return;
    const k = f, g = f, P = r.current, R = P.getContext("webgl2", {
      antialias: !0,
      alpha: !0,
      preserveDrawingBuffer: !1
    });
    R && (R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL, !1), R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1));
    const S = new L.WebGLRenderer({
      canvas: P,
      context: R || void 0,
      antialias: !0,
      alpha: !0,
      precision: "mediump"
    });
    S.setSize(k, g), S.setPixelRatio(window.devicePixelRatio), s.current = S;
    const I = new L.Scene();
    h.current = I;
    const C = new L.PerspectiveCamera(45, 1, 0.1, 100);
    C.position.set(0, 0, 3.5), C.lookAt(0, 0, 0), c.current = C;
    const D = new L.AmbientLight(16777215, 1);
    I.add(D);
    const N = new L.DirectionalLight(16777215, 0.6);
    N.position.set(5, 5, 5), I.add(N);
    const $ = new L.Group();
    I.add($), u.current = $;
    const E = (Z, te = 0) => {
      const ue = document.createElement("canvas");
      ue.width = 128, ue.height = 128;
      const ne = ue.getContext("2d");
      return ne && (ne.fillStyle = "#f8f9fa", ne.fillRect(0, 0, 128, 128), ne.save(), ne.translate(64, 64), te !== 0 && ne.rotate(te * Math.PI / 180), ne.fillStyle = "#333333", ne.font = n === "zh" ? 'bold 54px "Microsoft YaHei", sans-serif' : "bold 32px Arial, sans-serif", ne.textAlign = "center", ne.textBaseline = "middle", ne.fillText(Z, 0, 0), ne.restore(), ne.strokeStyle = "#cccccc", ne.lineWidth = 4, ne.strokeRect(2, 2, 124, 124)), new L.CanvasTexture(ue);
    }, F = 16316922, A = 16316922, U = 16316922, G = (Z, te, ue, ne, ge, _e = 0) => {
      const ye = new L.BoxGeometry(Z.x, Z.y, Z.z);
      let j;
      if (ge) {
        const de = E(ge, _e);
        j = new L.MeshPhongMaterial({
          map: de,
          transparent: !0,
          opacity: 0.98,
          shininess: 30
        });
      } else
        j = new L.MeshPhongMaterial({
          color: ne,
          transparent: !0,
          opacity: 0.98,
          shininess: 30
        });
      const B = new L.Mesh(ye, j);
      return B.position.copy(te), B.name = ue, B.userData.originalOpacity = j.opacity, B.userData.originalColor = j.color.clone(), B.userData.isFace = !!ge, $.add(B), B;
    }, H = 0.88, x = 0.12, V = 0.12, z = 0.5;
    G(new L.Vector3(H, 0.05, H), new L.Vector3(0, -z, 0), "front", F, v("cube_front")), G(new L.Vector3(H, 0.05, H), new L.Vector3(0, z, 0), "back", F, v("cube_back"), 180), G(new L.Vector3(H, H, 0.05), new L.Vector3(0, 0, z), "top", F, v("cube_top"), 360), G(new L.Vector3(H, H, 0.05), new L.Vector3(0, 0, -z), "bottom", F, v("cube_bottom")), G(new L.Vector3(0.05, H, H), new L.Vector3(-z, 0, 0), "left", F, v("cube_left"), 90), G(new L.Vector3(0.05, H, H), new L.Vector3(z, 0, 0), "right", F, v("cube_right"), 270), G(new L.Vector3(H, x, x), new L.Vector3(0, -z, z), "top-front", A), G(new L.Vector3(H, x, x), new L.Vector3(0, z, z), "top-back", A), G(new L.Vector3(x, H, x), new L.Vector3(-z, 0, z), "top-left", A), G(new L.Vector3(x, H, x), new L.Vector3(z, 0, z), "top-right", A), G(new L.Vector3(H, x, x), new L.Vector3(0, -z, -z), "bottom-front", A), G(new L.Vector3(H, x, x), new L.Vector3(0, z, -z), "bottom-back", A), G(new L.Vector3(x, H, x), new L.Vector3(-z, 0, -z), "bottom-left", A), G(new L.Vector3(x, H, x), new L.Vector3(z, 0, -z), "bottom-right", A), G(new L.Vector3(x, x, H), new L.Vector3(-z, -z, 0), "front-left", A), G(new L.Vector3(x, x, H), new L.Vector3(z, -z, 0), "front-right", A), G(new L.Vector3(x, x, H), new L.Vector3(-z, z, 0), "back-left", A), G(new L.Vector3(x, x, H), new L.Vector3(z, z, 0), "back-right", A), G(new L.Vector3(V, V, V), new L.Vector3(-z, -z, z), "top-front-left", U), G(new L.Vector3(V, V, V), new L.Vector3(z, -z, z), "top-front-right", U), G(new L.Vector3(V, V, V), new L.Vector3(-z, z, z), "top-back-left", U), G(new L.Vector3(V, V, V), new L.Vector3(z, z, z), "top-back-right", U), G(new L.Vector3(V, V, V), new L.Vector3(-z, -z, -z), "bottom-front-left", U), G(new L.Vector3(V, V, V), new L.Vector3(z, -z, -z), "bottom-front-right", U), G(new L.Vector3(V, V, V), new L.Vector3(-z, z, -z), "bottom-back-left", U), G(new L.Vector3(V, V, V), new L.Vector3(z, z, -z), "bottom-back-right", U);
    let ce;
    const re = () => {
      ce = requestAnimationFrame(re), e && u.current && u.current.quaternion.copy(e.camera.quaternion).invert(), S.render(I, C);
    };
    return re(), () => {
      cancelAnimationFrame(ce), S.dispose(), I.traverse((Z) => {
        Z instanceof L.Mesh && (Z.geometry.dispose(), Array.isArray(Z.material) ? Z.material.forEach((te) => te.dispose()) : Z.material.dispose());
      });
    };
  }, [e, f, n]);
  const m = (k) => {
    if (!r.current || !h.current || !c.current || !u.current) return;
    const g = r.current.getBoundingClientRect();
    d.current.x = (k.clientX - g.left) / g.width * 2 - 1, d.current.y = -((k.clientY - g.top) / g.height) * 2 + 1, p.current.setFromCamera(d.current, c.current);
    const P = p.current.intersectObjects(u.current.children);
    if (P.length > 0) {
      const R = P[0].object;
      if (y.current !== R) {
        if (y.current) {
          const I = y.current.material;
          I.opacity = y.current.userData.originalOpacity, I.color.copy(y.current.userData.originalColor);
        }
        y.current = R;
        const S = R.material;
        S.opacity = 1, S.color.set(30932);
      }
      a.current.style.cursor = "pointer";
    } else {
      if (y.current) {
        const R = y.current.material;
        R.opacity = y.current.userData.originalOpacity, R.color.copy(y.current.userData.originalColor), y.current = null;
      }
      a.current.style.cursor = "default";
    }
  }, _ = () => {
    if (y.current) {
      const k = y.current.material;
      k.opacity = y.current.userData.originalOpacity, k.color.copy(y.current.userData.originalColor), y.current = null;
    }
  }, o = (k) => {
    if (!r.current || !h.current || !c.current || !e) return;
    const g = r.current.getBoundingClientRect();
    d.current.x = (k.clientX - g.left) / g.width * 2 - 1, d.current.y = -((k.clientY - g.top) / g.height) * 2 + 1, p.current.setFromCamera(d.current, c.current);
    const P = p.current.intersectObjects(u.current.children);
    if (P.length > 0) {
      const R = P[0].object.name;
      b(R);
    }
  }, b = (k) => {
    if (!e) return;
    let g = k;
    k === "top-front-right" ? g = "se" : k === "top-front-left" ? g = "sw" : k === "top-back-right" ? g = "ne" : k === "top-back-left" && (g = "nw"), e.setView(g);
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
      children: /* @__PURE__ */ t("canvas", { ref: r })
    }
  );
};
class Da extends sr {
  constructor(n) {
    super(n), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(n) {
    return { hasError: !0, error: n };
  }
  componentDidCatch(n, i) {
    console.error("ErrorBoundary捕获到错误:", n, i);
  }
  render() {
    if (this.state.hasError) {
      const { t: n, theme: i } = this.props;
      return /* @__PURE__ */ l("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: i.bg,
        color: i.text,
        fontFamily: hr,
        gap: "20px",
        padding: "40px",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ t("div", { style: { fontSize: "48px", lineHeight: 1 }, children: "⚠️" }),
        /* @__PURE__ */ t("h1", { style: { fontSize: "var(--font-size-title)", margin: 0, fontWeight: 700 }, children: n("error_title") }),
        /* @__PURE__ */ t("p", { style: { color: i.textMuted, maxWidth: "600px", lineHeight: "1.6", fontSize: "var(--font-size-body)" }, children: n("error_msg") }),
        /* @__PURE__ */ t(
          "button",
          {
            onClick: () => window.location.reload(),
            style: {
              padding: "10px 24px",
              backgroundColor: i.accent,
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
function it(e, n, i = {}) {
  const {
    storage: a = typeof window < "u" ? window.localStorage : void 0,
    serializer: r = JSON.stringify,
    parser: s = JSON.parse
  } = i, h = () => typeof n == "function" ? n() : n, [c, u] = O(() => {
    const p = h();
    if (!a) return p;
    try {
      const d = a.getItem(e);
      return d === null ? p : s(d);
    } catch (d) {
      return console.warn(`[usePersistentState] Failed to read "${e}"`, d), p;
    }
  });
  return q(() => {
    if (a)
      try {
        a.setItem(e, r(c));
      } catch (p) {
        console.warn(`[usePersistentState] Failed to write "${e}"`, p);
      }
  }, [e, r, c, a]), [c, u];
}
function Va({
  fileSetIdRef: e,
  completedFileSetsRef: n,
  onProgress: i,
  onCompleted: a
}) {
  const r = ee(null), s = ee(null), h = T(() => {
    r.current = null;
    const u = s.current;
    if (!u) return;
    s.current = null;
    const { loaded: p, total: d } = u;
    i((f) => f.loaded === p && f.total === d ? f : { loaded: p, total: d });
    const y = e.current;
    p === d && d > 0 && y && (n.current.has(y) || (n.current.add(y), a()));
  }, [n, e, a, i]), c = T((u, p) => {
    s.current = { loaded: u, total: p }, r.current === null && (r.current = requestAnimationFrame(h));
  }, [h]);
  return q(() => () => {
    r.current !== null && (cancelAnimationFrame(r.current), r.current = null), s.current = null;
  }, []), { onManagerChunkProgress: c };
}
function rn(e) {
  return e.replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "").toLowerCase();
}
function vn(e) {
  const n = rn(e), i = n.split("/"), a = i[i.length - 1];
  return Array.from(/* @__PURE__ */ new Set([
    n,
    a,
    `./${n}`,
    `./${a}`
  ]));
}
function Aa(e) {
  const n = e.filter((r) => r instanceof File);
  if (n.length === 0) return null;
  const i = /* @__PURE__ */ new Map(), a = (r, s) => {
    !r || i.has(r) || i.set(r, URL.createObjectURL(s));
  };
  return n.forEach((r) => {
    a(rn(r.name), r);
    const s = r.webkitRelativePath;
    if (s) {
      const h = s.split("/").slice(1).join("/");
      a(rn(h), r);
    }
  }), {
    resolve: (r) => {
      if (!r || /^(blob:|data:|https?:)/i.test(r)) return r;
      for (const s of vn(r)) {
        const h = i.get(s);
        if (h) return h;
      }
      return r;
    },
    has: (r) => vn(r).some((s) => i.has(s)),
    dispose: () => {
      i.forEach((r) => URL.revokeObjectURL(r)), i.clear();
    }
  };
}
const $a = {
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
}, Zt = /* @__PURE__ */ new Map();
let en = null;
async function Ia() {
  return en || (en = Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/DRACOLoader.js"),
    import("three/examples/jsm/loaders/KTX2Loader.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js")
  ]).then(([e, n, i, a]) => ({
    GLTFLoader: e.GLTFLoader,
    DRACOLoader: n.DRACOLoader,
    KTX2Loader: i.KTX2Loader,
    MeshoptDecoder: a.MeshoptDecoder
  }))), en;
}
function $n(e) {
  if (!Zt.has(e)) {
    const n = e.replace(/\/$/, ""), i = typeof window < "u" ? new URL(n ? `${n}/` : "./", window.location.href).toString().replace(/\/$/, "") : n;
    Zt.set(e, i);
  }
  return Zt.get(e);
}
function Oa(e, n, i) {
  const a = Aa(e), r = new L.LoadingManager();
  return a && r.setURLModifier((h) => a.resolve(h)), { manager: r, cleanup: () => {
    a?.dispose();
  }, resourceResolver: a };
}
async function Fa(e, n) {
  const { GLTFLoader: i, DRACOLoader: a, KTX2Loader: r, MeshoptDecoder: s } = await Ia(), h = $n(n), c = typeof window < "u" && !!window.createImageBitmap;
  let u = null;
  const p = new a(e);
  p.setDecoderPath(`${h}/draco/gltf/`);
  const d = new r(e);
  if (d.setTranscoderPath(`${h}/basis/`), typeof document < "u")
    try {
      u = new L.WebGLRenderer({ canvas: document.createElement("canvas") }), d.detectSupport(u);
    } catch (f) {
      console.warn("[LoaderUtils] KTX2 detectSupport failed", f);
    }
  const y = new i(e);
  return y.setDRACOLoader(p), y.setMeshoptDecoder(s), c && y.setKTX2Loader(d), {
    loader: y,
    cleanup: () => {
      p.dispose(), d.dispose(), u?.dispose();
    }
  };
}
function Pa(e, n, i, a, r) {
  return (s, h, c) => {
    const [u, p] = Ba[s], d = Math.min(100, Math.max(0, Number.isFinite(h) ? h : 0)), y = u + d / 100 * (p - u), f = a + y / 100 * r, v = c || `${n($a[s])} ${i}`;
    e(Math.round(f), v);
  };
}
async function Ta(e, n, i, a, r, s, h, c, u) {
  const p = Oa(a), { manager: d, cleanup: y, resourceResolver: f } = p;
  try {
    if (i === "lmb") {
      const { LMBLoader: v } = await import("./lmbLoader-9Jgmv6We.js"), m = new v();
      return r("parse", 0), await m.loadAsync(
        n,
        (_) => r("parse", _ * 100),
        { fastMode: (u.loadProfile ?? "balanced") === "max-speed" }
      );
    }
    if (i === "glb" || i === "gltf") {
      const { loader: v, cleanup: m } = await Fa(d, c);
      r("parse", 0);
      try {
        return (await new Promise((o, b) => {
          v.load(
            n,
            o,
            (k) => {
              k.total && k.total > 0 ? r("parse", k.loaded / k.total * 100) : r("parse", 50);
            },
            b
          );
        })).scene;
      } finally {
        m();
      }
    }
    if (i === "fbx") {
      const { FBXLoader: v } = await import("three/examples/jsm/loaders/FBXLoader.js"), m = new v(d);
      return r("parse", 0), await new Promise((_, o) => {
        m.load(
          n,
          _,
          (b) => {
            b.total && b.total > 0 ? r("parse", b.loaded / b.total * 100) : r("parse", 50);
          },
          o
        );
      });
    }
    if (i === "ifc") {
      const { loadIFC: v } = await import("./ifcLoader-CKZqNA_I.js");
      r("parse", 0);
      const m = {
        ...h,
        deferIfcProperties: u.deferIfcProperties ?? !0
      };
      return await v(
        typeof e == "string" ? n : e,
        (_, o) => r("parse", _, o),
        s,
        c,
        m
      );
    }
    if (i === "obj") {
      const [{ OBJLoader: v }, { MTLLoader: m }] = await Promise.all([
        import("three/examples/jsm/loaders/OBJLoader.js"),
        import("three/examples/jsm/loaders/MTLLoader.js")
      ]), _ = new v(d), o = n.replace(/\.[^.]+$/i, ".mtl");
      if (f?.has(o))
        try {
          const b = await new Promise((k, g) => {
            new m(d).load(o, k, void 0, g);
          });
          b.preload(), _.setMaterials(b);
        } catch (b) {
          console.warn("[LoaderUtils] Failed to load companion MTL", b);
        }
      return r("parse", 0), await _.loadAsync(n, (b) => {
        b.total && b.total > 0 ? r("parse", b.loaded / b.total * 100) : r("parse", 50);
      });
    }
    if (i === "stl") {
      const { STLLoader: v } = await import("three/examples/jsm/loaders/STLLoader.js"), m = new v(d);
      r("parse", 0);
      const _ = await m.loadAsync(n, (o) => {
        o.total && o.total > 0 && r("parse", o.loaded / o.total * 100);
      });
      return new L.Mesh(_, new L.MeshStandardMaterial({ color: 8947848 }));
    }
    if (i === "ply") {
      const { PLYLoader: v } = await import("three/examples/jsm/loaders/PLYLoader.js"), m = new v(d);
      r("parse", 0);
      const _ = await m.loadAsync(n, (o) => {
        o.total && o.total > 0 && r("parse", o.loaded / o.total * 100);
      });
      return new L.Mesh(_, new L.MeshStandardMaterial({
        color: 8947848,
        vertexColors: _.hasAttribute("color")
      }));
    }
    if (i === "3mf") {
      const { ThreeMFLoader: v } = await import("three/examples/jsm/loaders/3MFLoader.js"), m = new v(d);
      return r("parse", 0), await m.loadAsync(n, (_) => {
        _.total && _.total > 0 && r("parse", _.loaded / _.total * 100);
      });
    }
    if (i === "stp" || i === "step" || i === "igs" || i === "iges") {
      r("fetch", 0);
      const v = typeof e == "string" ? await fetch(n).then((k) => k.arrayBuffer()) : await e.arrayBuffer(), _ = `${$n(c)}/occt-import-js/occt-import-js.wasm`, { OCCTLoader: o } = await import("./occtLoader-CqjlQM7F.js"), b = new o(_);
      return r("parse", 0), await b.load(v, s, (k, g) => r("parse", k, g));
    }
    return null;
  } finally {
    y();
  }
}
function wn(e, n, i = "full") {
  let r = 0;
  e.traverse((s) => {
    if (s.isMesh) {
      if (i === "fast" && r >= 3200) return;
      const h = s;
      h.frustumCulled = n.frustumCulling ?? !0, r += 1, h.geometry.boundingBox || h.geometry.computeBoundingBox(), h.geometry.boundingSphere || h.geometry.computeBoundingSphere(), (Array.isArray(h.material) ? h.material : [h.material]).forEach((u) => {
        u && "wireframe" in u && (u.wireframe = !1);
      });
    }
  });
}
const Ra = async (e, n, i, a, r = "./libs", s = {}) => {
  const h = [], c = e.length;
  for (let u = 0; u < c && !s.isStale?.(); u++) {
    const p = e[u], d = typeof p == "string";
    let y = "", f = "", v = "";
    d ? (v = p, y = v.split("?")[0].split("#")[0].split("/").pop() || "model", f = y.split(".").pop()?.toLowerCase() || "") : (y = p.name, f = y.split(".").pop()?.toLowerCase() || "", v = URL.createObjectURL(p));
    const m = u / c * 100, _ = 100 / c, o = Pa(n, i, y, m, _);
    try {
      o("fetch", 5);
      const b = await Ta(p, v, f, e, o, i, a, r, s);
      if (!b) continue;
      b.name = y, o("normalize", 30, `${i("processing")} ${y}`);
      const k = s.fastGeometrySanitize ?? !0;
      wn(b, a, k ? "fast" : "full"), k && setTimeout(() => {
        s.isStale?.() || wn(b, a, "full");
      }, 0), o("optimize", 100, `${i("analyzing")} ${y}`), o("addToScene", 100, `${i("success")} ${y}`), h.push(b);
    } catch (b) {
      console.error(`加载 ${y} 失败`, b);
    } finally {
      d || URL.revokeObjectURL(v);
    }
  }
  return n(100, i("analyzing")), h;
};
function Bn(e) {
  return e ? e.replace(/:\s*\d+%/g, "").replace(/\(\d+%\)/g, "").replace(/\d+%/g, "").trim() : "";
}
function ja(e) {
  return e.map((i) => typeof i == "string" ? i : i.name).sort().join("|");
}
async function Ua({
  items: e,
  manager: n,
  sceneSettings: i,
  libPath: a,
  t: r,
  onProgress: s,
  runtimeHints: h = {},
  isStale: c
}) {
  if (!e.length) return;
  const u = [], p = [];
  for (const f of e)
    (typeof f == "string" ? f.split("?")[0].split("#")[0] : f.name).toLowerCase().endsWith(".nbim") ? u.push(f) : p.push(f);
  for (const f of u) {
    if (c?.()) return;
    if (typeof f == "string") {
      const v = await fetch(f);
      if (!v.ok) throw new Error(`HTTP ${v.status} when fetching NBIM`);
      const m = await v.blob(), _ = f.split("?")[0].split("#")[0].split("/").pop() || "model.nbim", o = new File([m], _);
      await n.loadNbim(o, (b, k) => {
        s(b, k);
      });
    } else
      await n.loadNbim(f, (v, m) => {
        s(v, m);
      });
  }
  if (p.length === 0) return;
  const d = await Ra(
    p,
    s,
    r,
    i,
    a,
    {
      ...h,
      isStale: c
    }
  ), y = Math.max(d.length, 1);
  for (let f = 0; f < d.length; f++) {
    if (c?.()) return;
    const v = d[f], m = 92 + Math.round(f / y * 8);
    await n.addModel(v, (_, o) => {
      const b = Math.min(100, m + Math.round(_ / 100 * (8 / y)));
      s(b, o);
    }), n.invalidateRender?.({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }
}
function Ha({
  managerRef: e,
  sceneSettings: n,
  libPath: i,
  t: a,
  setCurrentFileSetId: r,
  setLoading: s,
  setStatus: h,
  setProgress: c,
  setToast: u,
  updateTree: p
}) {
  const d = T(async (f) => {
    if (!f.length || !e.current) return;
    const v = e.current, m = v.beginLoadGeneration?.() ?? 0, _ = v.getChunkOptions?.() || {};
    await Ua({
      items: f,
      manager: v,
      sceneSettings: n,
      libPath: i,
      t: a,
      onProgress: (o, b) => {
        c(o), b && h(Bn(b)), v.invalidateRender?.();
      },
      runtimeHints: _,
      isStale: () => !e.current?.isLoadGenerationCurrent?.(m)
    }), v.invalidateRender?.({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }, [i, e, n, c, h, a]);
  return {
    processFiles: T(async (f) => {
      if (!f.length || !e.current) return;
      const v = ja(f);
      r(v), e.current.setChunkLoadingEnabled?.(!0), e.current.setContentVisible?.(!0), s(!0), h(a("loading")), c(0);
      try {
        if (await d(f), p(), e.current?.invalidateRender?.({
          invalidateInteractables: !0,
          needsBoundsUpdate: !0,
          needsCulling: !0
        }), f.some((_) => (typeof _ == "string" ? _ : _.name).toLowerCase().endsWith(".nbim"))) {
          const _ = e.current.getStats?.();
          if (_ && _.meshes <= 0)
            throw new Error("NBIM 加载完成但没有可渲染外形，请检查文件格式或分块数据");
        } else
          e.current?.fitView(!1);
        e.current?.invalidateRender?.({
          invalidateInteractables: !0,
          needsBoundsUpdate: !0,
          needsCulling: !0
        }), h(a("success"));
      } catch (m) {
        h(a("failed")), u({ message: `${a("failed")}: ${m.message}`, type: "error" });
      } finally {
        s(!1), e.current?.invalidateRender?.();
      }
    }, [d, e, r, s, c, h, u, a, p]),
    loadItemsIntoScene: d
  };
}
function Ga({ mgrInstance: e, showStats: n, setStats: i }) {
  q(() => {
    if (!e || !n) return;
    const a = () => {
      document.visibilityState === "visible" && i(e.getStats());
    };
    a();
    const r = window.setInterval(a, 1e3);
    return document.addEventListener("visibilitychange", a), () => {
      window.clearInterval(r), document.removeEventListener("visibilitychange", a);
    };
  }, [e, i, n]);
}
function Wa(e, n) {
  return e.includes(n) ? e.filter((i) => i !== n) : [...e, n];
}
function Ka(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Xa() {
  const [e, n] = O([]), i = Se(
    () => Ka(e),
    [e]
  ), a = T(() => {
    n([]);
  }, []), r = T((h) => {
    n([h]);
  }, []), s = T((h) => {
    n((c) => Wa(c, h));
  }, []);
  return {
    selectedUuids: e,
    selectedUuid: i,
    setSelectedUuids: n,
    clearSelection: a,
    setSingleSelection: r,
    toggleSelection: s
  };
}
function Ya({
  basicLabel: e,
  geoLabel: n,
  basicProps: i,
  geoProps: a,
  ifcProps: r,
  nbimProps: s,
  nbimLabel: h = "BIM 属性"
}) {
  const c = [
    {
      name: e,
      items: yt(e, i, "basic")
    },
    {
      name: n,
      items: yt(n, a, "geometry")
    }
  ];
  return r && c.push(...Ca(r, "ifc")), c;
}
function qa(e, n, i) {
  let a = i === (n?.uuid || n?.id) && n instanceof L.Object3D ? n : e.contentGroup.getObjectByProperty("uuid", i);
  if (!a) {
    const r = e.getStructureNodes(i);
    r && r.length > 0 && (a = r[0]);
  }
  return a || n;
}
function Qa(e) {
  if (typeof e?.userData?.ifcMetadata?.elevation == "number")
    return e.userData.ifcMetadata.elevation;
  if (!(e instanceof L.Object3D)) return;
  let n = e;
  for (; n; ) {
    const i = n.userData?.ifcMetadata?.elevation;
    if (typeof i == "number" && Number.isFinite(i))
      return i;
    n = n.parent;
  }
}
async function Ja(e, n) {
  const a = ((r) => {
    let s = r instanceof L.Object3D ? r : null, h = r?.userData?.expressID;
    for (; s; ) {
      if (s.userData?.expressID !== void 0 && h === void 0 && (h = s.userData.expressID), s.userData?.ifcManager && s.userData?.modelID !== void 0)
        return {
          ifcRoot: s,
          expressID: h
        };
      s = s.parent;
    }
    return null;
  })(e);
  if (!a?.ifcRoot || a.expressID === void 0) return null;
  try {
    const r = `${a.ifcRoot.userData.modelID}:${a.expressID}`, s = n.get(r);
    if (s) return s;
    const c = await a.ifcRoot.userData.ifcManager.getItemProperties(a.ifcRoot.userData.modelID, a.expressID), u = c?.rawGroups || c?.groups || c?.normalizedGroups || null;
    return u && n.set(r, u), u;
  } catch (r) {
    return console.error("IFC Props Error", r), null;
  }
}
function Za({
  sceneManager: e,
  focusUuid: n,
  target: i,
  t: a,
  ifcGroups: r,
  clashSummary: s,
  isDev: h = !1
}) {
  const c = {}, u = {}, p = Qa(i), d = [i?.name, i?.userData?.name].find((_) => typeof _ == "string" && _.trim().length > 0), y = e.getBimIdByUuid(n) || n;
  if (d && (c[a("prop_name")] = d), c[a("prop_id")] = y, c[a("prop_type")] = i.type || (i.children ? "Group" : "Mesh"), typeof p == "number" && Number.isFinite(p) && (c[a("prop_storey_elevation")] = String(p)), i.getWorldPosition) {
    const _ = new L.Vector3();
    i.getWorldPosition(_), u[a("prop_pos")] = `${_.x.toFixed(2)}, ${_.y.toFixed(2)}, ${_.z.toFixed(2)}`;
  }
  if (i.isMesh || i.type === "Mesh") {
    if (i instanceof L.Mesh) {
      const o = new L.Box3().setFromObject(i), b = new L.Vector3();
      o.getSize(b), u[a("prop_dim")] = `${b.x.toFixed(2)} x ${b.y.toFixed(2)} x ${b.z.toFixed(2)}`, i.geometry && (u[a("prop_vert")] = (i.geometry.attributes.position?.count || 0).toLocaleString(), u[a("prop_tri")] = i.geometry.index ? (i.geometry.index.count / 3).toLocaleString() : ((i.geometry.attributes.position?.count || 0) / 3).toLocaleString());
    } else if (i.userData?.boundingBox) {
      const o = new L.Vector3();
      i.userData.boundingBox.getSize(o), u[a("prop_dim")] = `${o.x.toFixed(2)} x ${o.y.toFixed(2)} x ${o.z.toFixed(2)}`;
    }
    i.isInstancedMesh && (u[a("prop_inst")] = i.count.toLocaleString());
    const _ = e.getObjectGeometryData(n);
    _.area > 0 && (u[a("prop_area")] = _.area.toFixed(3)), _.volume > 0 && (u[a("prop_volume")] = _.volume.toFixed(3));
  } else if (i.userData?.boundingBox) {
    const _ = new L.Vector3();
    i.userData.boundingBox.getSize(_), u[a("prop_dim")] = `${_.x.toFixed(2)} x ${_.y.toFixed(2)} x ${_.z.toFixed(2)}`;
  }
  const f = e.getNbimProperties(n), v = e.getNbimIfcPropertyGroups(n, "raw");
  h && f && Object.keys(f).length > 0 && (console.group(`NBIM 选中属性: ${n}`), console.log(f), console.log(JSON.stringify(f, null, 2)), console.groupEnd()), h && v && (console.group(`NBIM IFC 组属性: ${n}`), console.log(v), console.log(JSON.stringify(v, null, 2)), console.groupEnd());
  const m = Ya({
    basicLabel: a("pg_basic"),
    geoLabel: a("pg_geo"),
    basicProps: c,
    geoProps: u,
    ifcProps: r || v || null,
    nbimProps: null
  });
  if (s) {
    const _ = a("pg_clash");
    m.push({
      name: _,
      items: yt(_, [
        { key: a("clash_group_all"), value: String(s.total) },
        { key: a("clash_group_new"), value: String(s.newCount) },
        { key: a("clash_group_confirmed"), value: String(s.confirmedCount) },
        { key: a("clash_group_resolved"), value: String(s.resolvedCount) },
        { key: a("prop_status"), value: a(`clash_group_${s.worstStatus}`) }
      ].map((o, b) => ({ ...o, id: `clash-summary::${b}` })))
    });
  }
  return m;
}
function eo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: i,
  setSelectedProps: a,
  setHiddenUuids: r,
  setIsolatedUuids: s,
  updateTree: h,
  propOnSelect: c,
  ifcPropertyCacheRef: u,
  clashSummaryByUuid: p,
  focusObjectsInView: d,
  t: y,
  isDev: f = !1
}) {
  const [v, m] = O(null), [_, o] = O([]), b = T(() => {
    m(null), o([]);
  }, []), k = T(async (S, I, C = !1, D = !1) => {
    const N = e.current;
    if (!N) return;
    if (!S) {
      i([]), a(null), N.highlightObjects([]);
      return;
    }
    const $ = S.uuid || S.id, E = N.resolveSelectionUuid($);
    if (!E) return;
    const F = C ? n.includes(E) ? n.filter((x) => x !== E) : [...n, E] : [E];
    i(F), D || N.highlightObjects(F);
    const A = F[F.length - 1];
    if (!A) {
      a(null);
      return;
    }
    c?.(A, S);
    const U = qa(N, S, A), G = await Ja(U, u.current || /* @__PURE__ */ new Map()), H = Za({
      sceneManager: N,
      focusUuid: A,
      target: U,
      t: y,
      ifcGroups: G,
      clashSummary: p[A],
      isDev: f
    });
    a(H);
  }, [
    p,
    u,
    f,
    c,
    e,
    n,
    a,
    i,
    y
  ]), g = T((S) => {
    const I = e.current;
    if (!I || !S) return !1;
    const C = S.uuid || S.id;
    if (!C) return !1;
    const D = I.resolveSelectionUuid(C);
    return !D || !I.getBoundsForObject(D) ? !1 : (m(D), d({ uuids: [D], focusUuid: D, updateSelection: !1 }));
  }, [d, e]), P = T((S) => {
    if (!!(_.length === S.length && _.every((D, N) => D === S[N]))) return;
    o(S);
    const C = e.current;
    !C || S.length > 0 || C.clearLocateFocus();
  }, [_, e]), R = T(() => {
    b(), e.current?.clearLocateFocus(), e.current?.highlightObjects(n);
  }, [b, e, n]);
  return q(() => {
    const S = e.current;
    if (!S || n.length <= 1) return;
    let I = !1;
    const C = async () => {
      const N = new L.Box3();
      let $ = 0, E = 0;
      const F = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), U = new Set(n), G = /* @__PURE__ */ new Map();
      S.contentGroup.traverse((Z) => {
        const te = Z.uuid, ue = Z.userData?.id;
        (U.has(te) || ue && U.has(ue)) && (G.set(te, Z), ue && G.set(ue, Z), N.expandByObject(Z));
      });
      const H = 2e3;
      let x = performance.now();
      for (let Z = 0; Z < n.length; Z += H) {
        if (I) return;
        const te = n.slice(Z, Z + H);
        for (const ue of te) {
          const ne = G.get(ue), ge = S.getStructureNodes(ue), _e = ge && ge.length > 0 ? ge[0] : null, ye = String(ne?.type || _e?.type || "Object");
          A.set(ye, (A.get(ye) || 0) + 1);
          const j = ne?.userData?.rootName || ne?.userData?.modelName;
          j && F.add(String(j));
          const B = S.getObjectGeometryData(ue);
          $ += B.area, E += B.volume;
        }
        performance.now() - x > 16 && (await new Promise((ue) => setTimeout(ue, 0)), x = performance.now());
      }
      if (I) return;
      const V = (Z) => Array.from(Z.entries()).sort((te, ue) => ue[1] - te[1]).slice(0, 4).map(([te, ue]) => `${te} x${ue}`).join(", "), z = N.isEmpty() ? null : N.getSize(new L.Vector3()), ce = [
        { key: y("selected_count"), value: String(n.length) },
        { key: y("summary_models"), value: String(F.size || 1) },
        { key: y("summary_types"), value: V(A) || "-" }
      ];
      z && ce.push({
        key: y("summary_bounds"),
        value: `${z.x.toFixed(2)} x ${z.y.toFixed(2)} x ${z.z.toFixed(2)}`
      }), $ > 0 && ce.push({ key: y("prop_area"), value: $.toFixed(3) }), E > 0 && ce.push({ key: y("prop_volume"), value: E.toFixed(3) });
      const re = `${n.length} ${y("selected_count")}`;
      a([
        {
          name: re,
          items: yt(re, ce.map((Z) => ({ key: Z.key, value: Z.value })))
        }
      ]);
    }, D = window.setTimeout(C, 200);
    return () => {
      I = !0, clearTimeout(D);
    };
  }, [n, e, y, a]), {
    locatedUuid: v,
    locateResultUuids: _,
    resetLocateState: b,
    handleSelect: k,
    handleLocateObject: g,
    handleLocateResultsChange: P,
    handleClearLocate: R
  };
}
function to({
  sceneMgrRef: e,
  t: n,
  setLoading: i,
  setProgress: a,
  setStatus: r,
  setToast: s,
  setActiveTool: h,
  setConfirmState: c,
  setSelectedUuids: u,
  setSelectedProps: p,
  setChunkProgress: d,
  resetLocateState: y,
  clearSearchResult: f,
  resetClashState: v,
  resetMeasurementState: m,
  resetExplodeState: _,
  updateTree: o,
  ifcPropertyCacheRef: b,
  completedFileSetsRef: k
}) {
  const g = T(() => {
    const D = e.current;
    if (!D) return [];
    const N = [];
    return D.contentGroup.children.forEach(($) => {
      if ($.userData?.isOptimizedGroup || $.name.startsWith("optimized_")) return;
      const E = (typeof $.userData?.modelName == "string" ? $.userData.modelName : "") || $.children?.[0]?.name || "" || $.name, F = yn(Kt(E));
      N.push(F);
    }), Array.from(new Set(N));
  }, [e]), P = T((D) => {
    const N = g();
    if (N.length === 1)
      return N[0];
    const $ = /* @__PURE__ */ new Date(), E = (A) => String(A).padStart(2, "0"), F = `${$.getFullYear()}${E($.getMonth() + 1)}${E($.getDate())}_${E($.getHours())}${E($.getMinutes())}${E($.getSeconds())}`;
    return `${n("export_batch_name")}_${F}`;
  }, [g, n]), R = T((D, N) => {
    const $ = P(D);
    return `${yn(Kt((N || "").trim()) || $)}.${D}`;
  }, [P]), S = T(async (D, N) => {
    const $ = e.current;
    if (!$) return;
    const E = $.contentGroup, F = R(D, N), A = Kt(F);
    if (D === "nbim") {
      if (E.children.length === 0) {
        s({ message: n("no_models"), type: "info" });
        return;
      }
      i(!0), r(`${n("processing")}...`), h("none"), window.setTimeout(async () => {
        try {
          await e.current?.exportNbim(A), s({ message: n("success"), type: "success" });
        } catch (H) {
          console.error(H), s({ message: `${n("failed")}: ${H.message}`, type: "error" });
        } finally {
          i(!1);
        }
      }, 100);
      return;
    }
    const U = E.children.filter((H) => !H.userData.isOptimizedGroup);
    if (U.length === 0) {
      s({ message: n("no_models"), type: "info" });
      return;
    }
    const G = new L.Group();
    U.forEach((H) => G.add(H.clone())), i(!0), a(0), r(`${n("processing")}...`), h("none"), window.setTimeout(async () => {
      try {
        let H = null;
        if (D === "glb" ? H = await lr(G) : D === "lmb" && (H = await cr(G, (x) => r(Bn(x)))), H) {
          const x = URL.createObjectURL(H), V = document.createElement("a");
          V.href = x, V.download = F, V.click(), URL.revokeObjectURL(x), s({ message: n("success"), type: "success" });
        }
      } catch (H) {
        console.error(H), s({ message: `${n("failed")}: ${H.message}`, type: "error" });
      } finally {
        i(!1), a(0);
      }
    }, 100);
  }, [R, e, h, i, a, r, s, n]), I = T(async () => {
    e.current && c({
      isOpen: !0,
      title: n("op_clear"),
      message: n("confirm_clear"),
      action: async () => {
        i(!0), a(0), r(`${n("op_clear")}...`);
        try {
          await e.current?.clear(), u([]), y(), p(null), f(), v(), b.current.clear(), m(), d({ loaded: 0, total: 0 }), k.current.clear(), _(), o(), r(n("ready"));
        } catch (N) {
          console.error("清空场景失败:", N);
        } finally {
          i(!1);
        }
      }
    });
  }, [
    f,
    k,
    b,
    v,
    _,
    y,
    m,
    e,
    d,
    c,
    i,
    a,
    p,
    u,
    r,
    n,
    o
  ]), C = T((D = "scene") => {
    const N = e.current;
    if (N)
      try {
        const $ = N.renderer, E = N.scene, F = E.background;
        D === "transparent" ? (E.background = null, $.setClearAlpha(0)) : $.setClearAlpha(1), $.render(E, N.camera);
        const A = N.canvas.toDataURL("image/png"), U = document.createElement("a");
        U.href = A, U.download = D === "transparent" ? "screenshot-transparent.png" : "screenshot.png", U.click(), E.background = F, $.setClearAlpha(1), $.render(E, N.camera), s({ message: n("success"), type: "success" });
      } catch ($) {
        console.error($), s({ message: n("failed"), type: "error" });
      }
  }, [e, s, n]);
  return {
    getDefaultExportFileName: P,
    handleExport: S,
    handleClear: I,
    handleScreenshot: C
  };
}
function no({
  sceneMgrRef: e,
  canvasRef: n,
  activeTool: i,
  setActiveTool: a,
  measureType: r,
  setMeasureType: s,
  pickEnabled: h,
  selectedUuids: c,
  setSelectedUuids: u,
  setSelectedProps: p,
  setMousePos: d,
  setHighlightedMeasureId: y,
  handleSelect: f,
  handleContextMenu: v,
  handleUndoVisibility: m,
  clearSelectionState: _
}) {
  const o = ee(null), b = ee(null), k = ee(null);
  q(() => {
    const g = e.current, P = n.current;
    if (!g || !P) return;
    const R = 6, S = (N) => {
      o.current = {
        x: N.clientX,
        y: N.clientY,
        moved: !1,
        button: N.button
      };
    }, I = (N) => {
      const $ = o.current;
      if (!$ || $.button !== 0 || $.moved) {
        o.current = null;
        return;
      }
      if (o.current = null, i !== "boxSelect") {
        if (i === "measure") {
          if (r !== "none") {
            const F = g.getRayIntersects(N.clientX, N.clientY);
            if (F) {
              const A = F.object.uuid;
              g.addMeasurePoint(F.point, A);
              return;
            }
          }
          const E = g.pickMeasurement(N.clientX, N.clientY);
          if (E) {
            y(E), g.highlightMeasurement(E);
            return;
          }
          y(null), g.highlightMeasurement(null);
          return;
        }
        if (h) {
          const E = g.pick(N.clientX, N.clientY);
          f(E ? E.object : null, E ? E.intersect : null, N.ctrlKey);
        }
      }
    }, C = (N) => {
      if (o.current && !o.current.moved) {
        const $ = N.clientX - o.current.x, E = N.clientY - o.current.y;
        $ * $ + E * E > R * R && (o.current.moved = !0);
      }
      if (i === "measure") {
        g.updateMeasureHover(N.clientX, N.clientY), d(null);
        return;
      }
      if (N.buttons !== 0) {
        k.current = null, b.current !== null && (cancelAnimationFrame(b.current), b.current = null), d(null);
        return;
      }
      k.current = { x: N.clientX, y: N.clientY }, b.current === null && (b.current = requestAnimationFrame(() => {
        b.current = null;
        const $ = k.current;
        if (!$) return;
        const E = g.getRayIntersects($.x, $.y);
        d(E ? E.point : null);
      }));
    }, D = (N) => {
      if ((N.key === "z" || N.key === "Z") && (N.ctrlKey || N.metaKey)) {
        m();
        return;
      }
      N.key === "Escape" && (i === "measure" && r !== "none" && (s("none"), g.startMeasurement("none")), i === "boxSelect" && (g.cancelBoxSelect(), a("none")), _());
    };
    return P.addEventListener("mousedown", S), P.addEventListener("click", I), P.addEventListener("mousemove", C), P.addEventListener("contextmenu", v), window.addEventListener("keydown", D), () => {
      b.current !== null && (cancelAnimationFrame(b.current), b.current = null), k.current = null, P.removeEventListener("mousedown", S), P.removeEventListener("click", I), P.removeEventListener("mousemove", C), P.removeEventListener("contextmenu", v), window.removeEventListener("keydown", D);
    };
  }, [
    i,
    n,
    _,
    v,
    f,
    m,
    r,
    h,
    e,
    a,
    y,
    s,
    d
  ]), q(() => {
    const g = e.current, P = n.current;
    if (!g || !P || i !== "boxSelect") return;
    g.controls.mouseButtons.LEFT = void 0;
    const R = (C) => {
      C.button === 0 && g.startBoxSelect(C.clientX, C.clientY);
    }, S = (C) => {
      g.updateBoxSelect(C.clientX, C.clientY);
    }, I = (C) => {
      if (C.button !== 0) return;
      const D = g.endBoxSelect();
      if (D.length > 0) {
        const N = C.shiftKey ? [.../* @__PURE__ */ new Set([...c, ...D])] : D;
        u(N), p(null), g.highlightObjects(N);
      }
    };
    return P.addEventListener("pointerdown", R), window.addEventListener("pointermove", S), window.addEventListener("pointerup", I), () => {
      P.removeEventListener("pointerdown", R), window.removeEventListener("pointermove", S), window.removeEventListener("pointerup", I), g.controls && (g.controls.mouseButtons.LEFT = L.MOUSE.ROTATE), g.cancelBoxSelect();
    };
  }, [i, n, e, c, p, u]);
}
const io = [
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
  processFiles: i,
  loadItemsIntoScene: a,
  setLoading: r,
  setStatus: s,
  setProgress: h,
  setToast: c,
  setActiveTool: u,
  setSelectedUuids: p,
  setSelectedProps: d,
  resetMeasurementState: y,
  updateTree: f,
  isDev: v
}) {
  const m = T(async (g) => {
    g.target.files?.length && (await i(Array.from(g.target.files)), g.target.value = "");
  }, [i]), _ = T(async (g) => {
    const P = e.current;
    if (!g.target.files?.length || !P) return;
    const R = Array.from(g.target.files);
    if (g.target.value = "", R.filter((I) => I.name.toLowerCase().endsWith(".nbim")).length > 0) {
      c({ message: n("unsupported_format"), type: "info" });
      return;
    }
    P.setChunkLoadingEnabled?.(!1), P.setContentVisible?.(!1), r(!0), s(`${n("processing")}...`), h(0), u("none");
    try {
      await P.clear(), p([]), d(null), y(), f(), await a(R), f(), s(`${n("processing")}...`), await P.exportNbim(), s(n("success")), c({ message: n("success"), type: "success" });
    } catch (I) {
      console.error("[ThreeViewer] handleBatchConvert error:", I), s(n("failed")), c({ message: `${n("failed")}: ${I.message}`, type: "error" });
    } finally {
      try {
        await e.current?.clear(), f();
      } catch {
      }
      e.current?.setChunkLoadingEnabled?.(!0), e.current?.setContentVisible?.(!0), r(!1);
    }
  }, [
    a,
    y,
    e,
    u,
    r,
    h,
    d,
    p,
    s,
    c,
    n,
    f
  ]), o = T(async () => {
    const g = window.prompt(n("menu_open_url"), "http://");
    if (!(!g || !g.startsWith("http"))) {
      v && console.log("[ThreeViewer] handleOpenUrl called with:", g), r(!0), s(`${n("processing")}...`);
      try {
        await i([g]);
      } catch (P) {
        console.error("[ThreeViewer] handleOpenUrl error:", P), s(n("failed")), c({ message: `${n("failed")}: ${P.message}`, type: "error" });
      } finally {
        r(!1);
      }
    }
  }, [v, i, r, s, c, n]), b = T((g) => {
    g.preventDefault(), g.stopPropagation();
  }, []), k = T(async (g) => {
    if (g.preventDefault(), g.stopPropagation(), !g.dataTransfer.files?.length) return;
    const P = Array.from(g.dataTransfer.files), R = P.filter((S) => {
      const I = S.name.substring(S.name.lastIndexOf(".")).toLowerCase();
      return io.includes(I);
    });
    R.length < P.length && c({ message: n("unsupported_format"), type: "info" }), R.length > 0 && await i(R);
  }, [i, c, n]);
  return {
    handleOpenFiles: m,
    handleBatchConvert: _,
    handleOpenUrl: o,
    handleDragOver: b,
    handleDrop: k
  };
}
function ao(e) {
  const {
    propShowOutline: n,
    propShowProperties: i,
    setShowOutline: a,
    setShowProps: r
  } = e, [s, h] = O(260), [c, u] = O(300), p = ee(!1), d = ee(!1);
  return q(() => {
    n !== void 0 && a(n);
  }, [n, a]), q(() => {
    i !== void 0 && r(i);
  }, [i, r]), q(() => {
    const y = (v) => {
      if (p.current && h(Math.max(150, Math.min(500, v.clientX))), d.current) {
        const m = window.innerWidth - v.clientX;
        u(Math.max(200, Math.min(600, m)));
      }
    }, f = () => {
      p.current = !1, d.current = !1;
    };
    return window.addEventListener("mousemove", y), window.addEventListener("mouseup", f), () => {
      window.removeEventListener("mousemove", y), window.removeEventListener("mouseup", f);
    };
  }, []), {
    leftWidth: s,
    rightWidth: c,
    resizingLeft: p,
    resizingRight: d
  };
}
const oo = { x: [0, 100], y: [0, 100], z: [0, 100] }, so = { x: !1, y: !1, z: !1 };
function lo({ initialSettings: e, mgrInstance: n }) {
  const [i, a] = O("none"), [r, s] = O(!1), [h, c] = O(32), [u, p] = O("radial"), [d, y] = O("none"), [f, v] = O([]), [m, _] = O(null), [o, b] = O(!1), [k, g] = O(oo), [P, R] = O(so), [S, I] = it(
    "3dbrowser_clipHelperVisible",
    e?.clip?.helperVisible ?? !1,
    {
      serializer: (A) => String(A),
      parser: (A) => A === "true"
    }
  ), [C, D] = it(
    "3dbrowser_clipHelperOpacity",
    e?.clip?.helperOpacity ?? 0.12,
    {
      serializer: (A) => String(A),
      parser: (A) => {
        const U = Number(A);
        return Number.isFinite(U) ? U : 0.12;
      }
    }
  ), N = Se(
    () => Math.min(0.35, Math.max(0.05, C)),
    [C]
  );
  return q(() => {
    N !== C && D(N);
  }, [C, N, D]), q(() => {
    n && n.setClipHelperOptions({
      visible: S,
      opacity: N
    });
  }, [S, n, N]), q(() => {
    n && i !== "measure" && (n.clearMeasurementPreview(), n.highlightMeasurement(null), _(null), y("none"));
  }, [i, n]), q(() => {
    if (!n || (n.setClippingEnabled(o), !o)) return;
    let A = n.computeTotalBounds(!0);
    A.isEmpty() && (A = n.computeTotalBounds(!1)), A.isEmpty() || n.updateClippingPlanes(A, k, P);
  }, [P, o, k, n]), q(() => {
    n && n.startMeasurement(d);
  }, [d, n]), q(() => {
    n && n.setExplodeEnabled(r);
  }, [r, n]), q(() => {
    n && n.setExplodeStrength(h);
  }, [h, n]), q(() => {
    n && n.setExplodeMode(u);
  }, [u, n]), {
    activeTool: i,
    setActiveTool: a,
    explodeEnabled: r,
    setExplodeEnabled: s,
    explodeStrength: h,
    setExplodeStrength: c,
    explodeMode: u,
    setExplodeMode: p,
    resetExplodeState: () => {
      s(!1), c(32), p("radial");
    },
    measureType: d,
    setMeasureType: y,
    measureHistory: f,
    setMeasureHistory: v,
    highlightedMeasureId: m,
    setHighlightedMeasureId: _,
    resetMeasurementState: () => {
      v([]), _(null), y("none");
    },
    handleMeasureUpdate: (A) => {
      v(A.map((U) => ({ id: U.id, type: U.type, val: U.val })));
    },
    clipEnabled: o,
    setClipEnabled: b,
    clipValues: k,
    setClipValues: g,
    clipActive: P,
    setClipActive: R,
    clipHelperVisible: S,
    setClipHelperVisible: I,
    clipHelperOpacity: N,
    setClipHelperOpacity: D
  };
}
const $t = 400;
function co() {
  return new Promise((e) => {
    window.requestAnimationFrame(() => e());
  });
}
function uo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: i,
  setSelectedProps: a,
  updateTree: r,
  resetLocateState: s
}) {
  const [h, c] = O({
    x: 0,
    y: 0,
    visible: !1
  }), [u, p] = O(/* @__PURE__ */ new Set()), [d, y] = O(/* @__PURE__ */ new Set()), f = ee([]), v = T(() => {
    c((S) => ({ ...S, visible: !1 }));
  }, []), m = T((S) => {
    S.preventDefault(), S.stopPropagation(), c({
      x: S.clientX,
      y: S.clientY,
      visible: !0
    });
  }, []), _ = T(() => {
    const S = e.current;
    if (!S || n.length === 0) return;
    const I = n.map((D) => {
      const N = S.contentGroup.getObjectByProperty("uuid", D);
      return { uuid: D, visible: N ? N.visible : !0 };
    });
    f.current.push(I);
    const C = [...n];
    i([]), a(null), S.highlightObjects([]), v(), (async () => {
      for (let $ = 0; $ < C.length; $ += $t) {
        const E = C.slice($, $ + $t), F = $ + $t >= C.length;
        S.setObjectsVisibility(E, !1, { deferRefresh: !F }), $ + $t < C.length && await co();
      }
      const D = new Set(u), N = new Set(d);
      C.forEach(($) => {
        D.add($), N.delete($);
      }), p(D), y(N), r();
    })();
  }, [
    v,
    u,
    d,
    e,
    n,
    a,
    i,
    r
  ]), o = T(() => {
    const S = e.current;
    S && ((u.size > 0 || d.size > 0) && (S.setAllVisibility(!0), p(/* @__PURE__ */ new Set()), y(/* @__PURE__ */ new Set()), r()), s(), S.clearLocateFocus(), v());
  }, [v, u, d, s, e, r]), b = T((S, I) => {
    const C = e.current;
    if (!C) return;
    f.current.push([{ uuid: S, visible: !I }]), C.setObjectVisibility(S, I);
    const D = new Set(u);
    I ? D.delete(S) : D.add(S), p(D), r();
  }, [u, e, r]), k = T((S) => {
    const I = e.current;
    I && (f.current.push([{ uuid: S, visible: !0 }]), I.setObjectVisibility(S, !1), p((C) => new Set(C).add(S)), i((C) => C.filter((D) => D !== S)), r());
  }, [e, i, r]), g = T((S) => {
    const I = e.current;
    I && (I.isolateObjects([S]), p(/* @__PURE__ */ new Set()), y(/* @__PURE__ */ new Set([S])), i([S]), I.highlightObjects([S]), r(), v());
  }, [v, e, i, r]), P = T(() => {
    const S = e.current;
    if (!S || n.length === 0) return;
    const I = n.filter((C) => !d.has(C));
    I.length > 0 && (S.isolateObjects(n), y(/* @__PURE__ */ new Set([...d, ...I])), p(/* @__PURE__ */ new Set()), r()), v();
  }, [v, d, e, n, r]), R = T(() => {
    const S = e.current;
    if (!S || f.current.length === 0) return;
    const I = f.current.pop();
    if (!I) return;
    S.applyVisibilityBatch(I, {
      recomputeBounds: !0,
      refreshExplode: !1,
      invalidateInteractables: !0
    });
    const C = new Set(u);
    I.forEach((D) => {
      D.visible ? C.delete(D.uuid) : C.add(D.uuid);
    }), p(C), r();
  }, [u, e, r]);
  return {
    contextMenu: h,
    hiddenUuids: u,
    isolatedUuids: d,
    setHiddenUuids: p,
    setIsolatedUuids: y,
    handleContextMenu: m,
    closeContextMenu: v,
    handleHideSelected: _,
    handleShowAll: o,
    handleToggleVisibility: b,
    handleHideObject: k,
    handleIsolateObject: g,
    handleIsolateSelection: P,
    handleUndoVisibility: R
  };
}
function ho({
  currentFileSetId: e,
  sceneMgrRef: n,
  setToast: i,
  setConfirmState: a,
  t: r,
  captureStateSnapshot: s,
  restoreStateSnapshot: h
}) {
  const [c, u] = O([]);
  q(() => {
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
  const p = T((o) => {
    if (e) {
      u(o);
      try {
        localStorage.setItem(`viewpoints_${e}`, JSON.stringify(o));
      } catch (b) {
        console.error("Failed to persist viewpoints", b);
      }
    }
  }, [e]), d = T(() => {
    const o = n.current;
    if (!o) return "";
    try {
      o.renderer.render(o.scene, o.camera);
      const b = o.canvas, k = Math.min(640 / b.width, 360 / b.height), g = Math.round(b.width * k), P = Math.round(b.height * k), R = document.createElement("canvas");
      R.width = g, R.height = P;
      const S = R.getContext("2d");
      return S ? (S.drawImage(b, 0, 0, g, P), R.toDataURL("image/jpeg", 0.92)) : "";
    } catch (b) {
      return console.error("Failed to capture thumbnail", b), "";
    }
  }, [n]), y = T((o, b = {
    visibility: !0,
    selection: !0,
    clip: !0,
    explode: !0
  }, k) => {
    const g = n.current;
    if (!g || !e) {
      i({ message: r("no_models"), type: "info" });
      return;
    }
    if (g.contentGroup.children.length === 0) {
      i({ message: r("no_models"), type: "info" });
      return;
    }
    const P = o || `${r("viewpoint_title")} ${c.length + 1}`, R = g.getCameraState(), S = d(), I = s(b), C = k ? c.map((D) => D.id === k ? { ...D, name: P, cameraState: R, image: S, saveOptions: b, stateSnapshot: I } : D) : [...c, { id: Date.now().toString(), name: P, cameraState: R, image: S, saveOptions: b, stateSnapshot: I }];
    p(C), i({ message: r("success"), type: "success" });
  }, [s, d, e, p, n, i, r, c]), f = T((o, b) => {
    p(c.map((k) => k.id === o ? { ...k, name: b } : k));
  }, [p, c]), v = T(async (o) => {
    o.cameraState && (n.current?.setCameraState(o.cameraState), await h(o.stateSnapshot), i({ message: `${r("viewpoint_loading")}: ${o.name}`, type: "info" }));
  }, [h, n, i, r]), m = T((o) => {
    const b = c.find((k) => k.id === o);
    b && y(
      b.name,
      b.saveOptions || {
        visibility: !0,
        selection: !0,
        clip: !0,
        explode: !0
      },
      o
    );
  }, [y, c]), _ = T((o) => {
    const b = c.find((k) => k.id === o);
    a({
      isOpen: !0,
      title: r("viewpoint_title"),
      message: `${r("confirm_delete")} "${b?.name || r("viewpoint_default_name")}"?`,
      action: () => {
        p(c.filter((k) => k.id !== o));
      }
    });
  }, [p, a, r, c]);
  return {
    viewpoints: c,
    handleSaveViewpoint: y,
    handleUpdateViewpointName: f,
    handleLoadViewpoint: v,
    handleOverwriteViewpoint: m,
    handleDeleteViewpoint: _
  };
}
const xn = [".lmb", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3ds", ".dae", ".stp", ".step", ".igs", ".iges"], Cn = [
  "ResizeObserver loop completed",
  "ResizeObserver loop limit",
  "texImage3D: FLIP_Y or PREMULTIPLY_ALPHA"
];
function po({
  allowDragOpen: e,
  mgrInstance: n,
  viewportRef: i,
  t: a,
  processFiles: r,
  setToast: s,
  setErrorState: h
}) {
  q(() => {
    if (!i.current || !n) return;
    const c = new ResizeObserver((p) => {
      const d = p[0];
      if (!d) return;
      const { width: y, height: f } = d.contentRect;
      y === 0 || f === 0 || requestAnimationFrame(() => {
        n.resize(y, f);
      });
    });
    c.observe(i.current);
    const u = () => {
      if (!i.current) return;
      const p = i.current.getBoundingClientRect();
      n.resize(p.width, p.height);
    };
    return window.addEventListener("resize", u), () => {
      c.disconnect(), window.removeEventListener("resize", u);
    };
  }, [n, i]), q(() => {
    const c = (p) => {
      e && (p.preventDefault(), p.stopPropagation());
    }, u = async (p) => {
      if (!e) return;
      p.preventDefault(), p.stopPropagation();
      const d = p.dataTransfer?.files ? Array.from(p.dataTransfer.files) : [];
      if (d.length === 0) return;
      const y = d.filter((v) => {
        const m = `.${v.name.split(".").pop()?.toLowerCase()}`;
        return !xn.includes(m);
      });
      y.length > 0 && s({
        message: `${a("failed")}: 不支持的格式 - ${y.map((v) => v.name).join(", ")}`,
        type: "error"
      });
      const f = d.filter((v) => {
        const m = `.${v.name.split(".").pop()?.toLowerCase()}`;
        return xn.includes(m);
      });
      f.length > 0 && await r(f);
    };
    return window.addEventListener("dragover", c), window.addEventListener("drop", u), () => {
      window.removeEventListener("dragover", c), window.removeEventListener("drop", u);
    };
  }, [e, r, s, a]), q(() => {
    const c = (p) => {
      const d = p.message || "";
      !d && !p.error || Cn.some((y) => d.includes(y)) || (console.error("Global Error:", p.error || d), h({
        isOpen: !0,
        title: a("failed"),
        message: d || "An unexpected error occurred",
        detail: p.error?.stack || ""
      }));
    }, u = (p) => {
      if (!p.reason) return;
      const d = p.reason?.message || String(p.reason);
      Cn.some((y) => d.includes(y)) || (console.error("Unhandled Rejection:", p.reason), h({
        isOpen: !0,
        title: a("failed"),
        message: d || "A promise was rejected without reason",
        detail: p.reason?.stack || ""
      }));
    };
    return window.addEventListener("error", c), window.addEventListener("unhandledrejection", u), () => {
      window.removeEventListener("error", c), window.removeEventListener("unhandledrejection", u);
    };
  }, [h, a]);
}
function ft(e, n, i, a) {
  i && e.push(...yt(n, i, a));
}
function Nn(e, n, i, a) {
  Object.entries(n).forEach(([r, s]) => {
    if (Array.isArray(s) || typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
      ft(i, e, [{ key: r, value: s, source: a }], a);
      return;
    }
    s && typeof s == "object" && Object.entries(s).forEach(([h, c]) => {
      ft(i, e, [{ key: `${r}.${h}`, value: c, rawKey: h, source: a }], a);
    });
  });
}
function mo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: i,
  onSelectObject: a,
  focusObjectsInView: r,
  t: s,
  setToast: h
}) {
  const [c, u] = O([
    { id: "cond_init", propertyName: "", operator: "contains", value: "" }
  ]), [p, d] = O([]), [y, f] = O(!1), [v, m] = O(0), [_, o] = O(""), b = ee(0), k = ee(!1), g = T((E, F) => {
    let A = F;
    for (; A; ) {
      const G = A.userData?.originalUuid || A.userData?.modelUuid || A.userData?.rootUuid;
      if (G) return String(G);
      A = A.parent;
    }
    const U = e.current?.getStructureNodes(E)?.[0];
    return U?.userData?.originalUuid ? String(U.userData.originalUuid) : E;
  }, [e]), P = T((E, F) => {
    const A = [];
    ft(A, "Object", [
      { key: "name", value: F?.name, source: "object" },
      { key: "type", value: F?.type, source: "object" },
      { key: "uuid", value: E, source: "object" },
      { key: "bimid", value: e.current?.getBimIdByUuid(E) || "", source: "object" }
    ]);
    const U = F?.userData || {};
    Object.entries(U).forEach(([V, z]) => {
      typeof z == "string" || typeof z == "number" || typeof z == "boolean" ? ft(A, "UserData", [{ key: V, value: z, source: "userData" }], "userData") : Array.isArray(z) && z.forEach((ce, re) => {
        ft(A, "UserData", [{ key: V, value: ce, id: `userData::${V}::${re}`, source: "userData" }], "userData");
      });
    });
    const G = F?.userData?.ifcMetadata || {};
    Nn("IFC Metadata", G, A, "ifcMetadata");
    const H = e.current?.getNbimProperties(E);
    H && typeof H == "object" && Nn("NBIM", H, A, "nbim");
    const x = e.current?.getNbimIfcPropertyGroups(E, "normalized");
    return x && typeof x == "object" && Object.entries(x).forEach(([V, z]) => {
      ft(A, V, z, "nbim-ifc");
    }), A;
  }, [e]), R = T(() => {
    const E = [], F = e.current;
    if (!F) return E;
    const A = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set();
    F.contentGroup.updateMatrixWorld(!0), F.contentGroup.traverse((H) => {
      const x = H;
      if (!x.isMesh || !x.geometry || x.userData?.isIfcGridHelper) return;
      A.add(x.uuid);
      const V = String(
        F.getBimIdByUuid(x.uuid) || x.userData?.expressID || x.uuid
      );
      U.has(V) || (U.add(V), E.push({
        uuid: x.uuid,
        name: x.name || x.uuid,
        type: x.type || "Mesh",
        modelId: g(x.uuid, x),
        sourceLabel: "object",
        source: x
      }));
    });
    const G = (H) => {
      H.forEach((x) => {
        if (!x || x.visible === !1) return;
        const V = String(x.id || "");
        if (V && x.bimId) {
          const z = String(x.bimId || V);
          !U.has(z) && A.has(V) && (U.add(z), E.push({
            uuid: V,
            name: String(x.name || V),
            type: String(x.type || "Node"),
            modelId: String(x.userData?.originalUuid || V),
            sourceLabel: "structure",
            source: {
              name: x.name,
              type: x.type,
              userData: x.userData || {}
            }
          }));
        }
        Array.isArray(x.children) && x.children.length > 0 && G(x.children);
      });
    };
    return Array.isArray(F.structureRoot?.children) && F.structureRoot.children.length > 0 && G(F.structureRoot.children), E;
  }, [g, e]), S = T((E, F, A) => F === "equals" ? E === A : F === "contains" ? E.includes(A) : F === "notContains" ? !E.includes(A) : F === "startsWith" ? E.startsWith(A) : F === "endsWith" ? E.endsWith(A) : !1, []), I = T((E, F) => F ? E.normalizedKey === F || E.normalizedPath === F || !!E.rawKey && rt(E.rawKey) === F || E.normalizedPath.endsWith(`.${F}`) : !1, []), C = T(async () => {
    if (!e.current || k.current) return;
    const E = c.map((U) => ({
      ...U,
      normalizedPropertyName: rt(U.propertyName),
      normalizedValue: rt(U.value)
    })).filter((U) => U.normalizedPropertyName && U.normalizedValue);
    if (E.length === 0) {
      d([]), f(!1), m(0), o(""), h({ message: s("search_invalid_condition"), type: "info" }), e.current.highlightObjects(n);
      return;
    }
    const F = ++b.current, A = performance.now();
    k.current = !0, f(!0), m(0), o(s("searching"));
    try {
      const U = R(), G = U.length, H = 600, x = [];
      let V = performance.now(), z = !1;
      for (let ce = 0; ce < U.length; ce++) {
        if (b.current !== F) {
          z = !0, o(s("search_cancelled"));
          break;
        }
        const re = U[ce], Z = P(re.uuid, re.source);
        let te = null;
        const ue = /* @__PURE__ */ new Set();
        if (E.forEach((ne, ge) => {
          const _e = Z.filter((j) => I(j, ne.normalizedPropertyName)), ye = _e.some((j) => S(j.normalizedValue, ne.operator, ne.normalizedValue));
          ye && _e.forEach((j) => {
            S(j.normalizedValue, ne.operator, ne.normalizedValue) && ue.add(j.path);
          }), ge === 0 || te === null ? te = ye : (ne.connector || "AND") === "AND" ? te = !!te && ye : te = !!te || ye;
        }), te && x.push({
          uuid: re.uuid,
          name: re.name || re.uuid,
          type: re.type,
          modelId: re.modelId,
          source: re.sourceLabel,
          matchedBy: Array.from(ue)
        }), (ce + 1) % H === 0 || ce === U.length - 1) {
          const ne = performance.now(), ge = G > 0 ? (ce + 1) / G * 100 : 100;
          (ne - V > 120 || ce === U.length - 1) && (m(ge), V = ne), await new Promise((_e) => window.setTimeout(_e, 0));
        }
      }
      z || (d(x), m(100), o(`${s("search_results")}: ${x.length}`));
    } finally {
      const U = performance.now() - A, G = 220;
      U < G && await new Promise((H) => window.setTimeout(H, G - U)), f(!1), k.current = !1;
    }
  }, [P, R, S, I, e, c, n, h, s]), D = T((E) => {
    if (!e.current) return;
    const F = e.current.contentGroup.getObjectByProperty("uuid", E);
    if (r({ uuids: [E], focusUuid: E }), F) {
      a(F);
      return;
    }
    i([E]);
  }, [r, a, e, i]), N = T(() => {
    b.current++, d([]), f(!1), m(0), o(""), k.current = !1, e.current && e.current.highlightObjects(n);
  }, [e, n]), $ = T(() => {
    k.current && (b.current++, o(s("search_cancelling")));
  }, [s]);
  return {
    searchConditions: c,
    setSearchConditions: u,
    searchResults: p,
    searching: y,
    searchProgress: v,
    searchStatus: _,
    handleRunPropertySearch: C,
    handleApplySearchResultHighlight: D,
    handleClearSearchResult: N,
    handleCancelSearch: $
  };
}
function fo(e, n) {
  const i = Math.max(0, e.min.x - n.max.x, n.min.x - e.max.x), a = Math.max(0, e.min.y - n.max.y, n.min.y - e.max.y), r = Math.max(0, e.min.z - n.max.z, n.min.z - e.max.z);
  return Math.sqrt(i * i + a * a + r * r);
}
function _o(e, n) {
  e.boundingBox || e.computeBoundingBox();
  const i = e.boundingBox;
  if (!i) return null;
  const a = new L.Vector3(), r = new L.Vector3();
  i.getCenter(a), i.getSize(r).multiplyScalar(0.5), a.applyMatrix4(n);
  const s = new L.Matrix3().setFromMatrix4(n);
  return new dr(a, r, s);
}
function go({
  sceneMgrRef: e,
  treeRoot: n,
  clashModelOptions: i,
  selectedUuids: a,
  setSelectedUuids: r,
  focusObjectsInView: s,
  t: h
}) {
  const [c, u] = O([]), [p, d] = O(!1), [y, f] = O(0), [v, m] = O(""), [_, o] = O(0), [b, k] = O([]), [g, P] = O([]), [R, S] = O(0), [I, C] = O(0), [D, N] = O(0.05), [$, E] = O(!0), [F, A] = O(!1), [U, G] = O(!1), [H, x] = O(0), [V, z] = O("ALL"), [ce, re] = O("ALL"), Z = ee(0), te = ee(!1), ue = ee(/* @__PURE__ */ new Map()), ne = Se(() => {
    const K = /* @__PURE__ */ new Map();
    return i.forEach((Y) => K.set(Y.id, Y.name)), K;
  }, [i]), ge = T((K) => {
    let Y = K;
    for (; Y; ) {
      const Q = Y.userData?.originalUuid;
      if (Q) return String(Q);
      Y = Y.parent;
    }
    return "";
  }, []), _e = T((K, Y, Q) => {
    const M = Y.attributes.position;
    if (!M) return null;
    const ie = Y.index, pe = Math.floor(ie ? ie.count / 3 : M.count / 3);
    return {
      uuid: K,
      geometry: Y,
      matrixWorld: Q.clone(),
      triangleCount: pe
    };
  }, []), ye = T(() => {
    const K = e.current;
    if (!K) return [];
    const Y = ue.current;
    Y.clear();
    const Q = /* @__PURE__ */ new Set();
    return K.contentGroup.traverse((M) => {
      const ie = M;
      ie.isMesh && ie.geometry && !ie.userData?.isIfcGridHelper && Q.add(ie.uuid);
    }), K.collectRenderableTargets().forEach((M) => {
      if (!Q.has(M.uuid) || M.box.isEmpty()) return;
      const ie = K.getStructureNodes(M.uuid) || [];
      if (ie.length > 0 && ie.every((ve) => ve.visible === !1)) return;
      const pe = ie[0]?.userData?.originalUuid ? String(ie[0].userData.originalUuid) : ge(M.object), le = {
        key: M.key,
        uuid: M.uuid,
        name: M.name || M.uuid,
        modelId: pe,
        modelName: ne.get(pe) || pe || M.name || M.uuid,
        box: M.box.clone(),
        testBox: M.box.clone(),
        obb: $ ? _o(M.geometry, M.matrixWorld) : null,
        meshInfo: _e(M.key, M.geometry, M.matrixWorld)
      };
      Y.set(le.key, le);
    }), Array.from(Y.values());
  }, [_e, ne, $, ge, e]), j = T((K, Y, Q, M) => {
    const ie = [], pe = K.geometry.attributes.position;
    if (!pe) return ie;
    const le = K.geometry.index, ve = Math.floor(le ? le.count / 3 : pe.count / 3), Te = Math.min(ve, M), ze = ve > Te ? Math.max(1, Math.floor(ve / Te)) : 1, me = new L.Vector3(), Me = new L.Vector3(), Re = new L.Vector3(), Oe = new L.Vector3();
    for (let xe = 0; xe < ve; xe += ze) {
      const Ce = le ? le.getX(xe * 3) : xe * 3, et = le ? le.getX(xe * 3 + 1) : xe * 3 + 1, $e = le ? le.getX(xe * 3 + 2) : xe * 3 + 2;
      if (me.fromBufferAttribute(pe, Ce).applyMatrix4(K.matrixWorld), Me.fromBufferAttribute(pe, et).applyMatrix4(K.matrixWorld), Re.fromBufferAttribute(pe, $e).applyMatrix4(K.matrixWorld), Oe.copy(me).add(Me).add(Re).multiplyScalar(1 / 3), !!Y.containsPoint(Oe) && (ie.push(Oe.clone()), ie.length >= Q))
        break;
    }
    return ie;
  }, []), B = T((K, Y) => {
    const Q = Y.geometry.attributes.position;
    if (!Q) return !1;
    const M = Y.geometry.index, ie = Math.floor(M ? M.count / 3 : Q.count / 3), le = Math.min(ie, 12e3), ve = ie > le ? Math.max(1, Math.floor(ie / le)) : 1, Te = K.clone();
    Te.x -= 1e-4;
    const ze = new L.Ray(Te, new L.Vector3(1, 0, 0)), me = new L.Vector3(), Me = new L.Vector3(), Re = new L.Vector3(), Oe = new L.Vector3();
    let xe = 0;
    for (let Ce = 0; Ce < ie; Ce += ve) {
      const et = M ? M.getX(Ce * 3) : Ce * 3, $e = M ? M.getX(Ce * 3 + 1) : Ce * 3 + 1, tt = M ? M.getX(Ce * 3 + 2) : Ce * 3 + 2;
      Me.fromBufferAttribute(Q, et).applyMatrix4(Y.matrixWorld), Re.fromBufferAttribute(Q, $e).applyMatrix4(Y.matrixWorld), Oe.fromBufferAttribute(Q, tt).applyMatrix4(Y.matrixWorld), !(!ze.intersectTriangle(Me, Re, Oe, !1, me) || me.x < Te.x) && xe++;
    }
    return xe % 2 === 1;
  }, []), de = T((K, Y, Q) => {
    if (!K.meshInfo || !Y.meshInfo || K.meshInfo.triangleCount <= 0 || Y.meshInfo.triangleCount <= 0) return !0;
    const M = 3e4;
    if (K.meshInfo.triangleCount > M || Y.meshInfo.triangleCount > M) return !0;
    const ie = j(K.meshInfo, Q, 4, 6e3), pe = j(Y.meshInfo, Q, 4, 6e3);
    return ie.length === 0 || pe.length === 0 ? !1 : ie.some((le) => B(le, Y.meshInfo)) || pe.some((le) => B(le, K.meshInfo));
  }, [j, B]), he = T(async () => {
    if (!e.current || te.current) return;
    const K = ++Z.current, Y = performance.now();
    te.current = !0, d(!0), f(0), m(h("clash_collecting")), u([]), x(0);
    try {
      const Q = ye();
      if (o(Q.length), Q.length < 2) {
        m(h("clash_insufficient_candidates"));
        return;
      }
      const M = new Set(b), ie = new Set(g), pe = M.size > 0, le = ie.size > 0, ve = (X, oe) => !U && X && oe && X === oe ? !1 : pe && le ? M.has(X) && ie.has(oe) || M.has(oe) && ie.has(X) : pe ? M.has(X) || M.has(oe) : le ? ie.has(X) || ie.has(oe) : !0, Te = (X) => pe && le ? M.has(X) || ie.has(X) : pe ? M.has(X) : le ? ie.has(X) : !0, ze = Math.max(0, D), me = Q.filter((X) => !X.box.isEmpty() && Te(X.modelId)).map((X) => {
        const oe = X.box.clone();
        return (R > 0 || ze > 0) && oe.expandByScalar(Math.max(R, ze)), {
          ...X,
          testBox: oe
        };
      });
      if (me.length < 2) {
        m(h("clash_no_results")), f(100);
        return;
      }
      me.sort((X, oe) => X.testBox.min.x - oe.testBox.min.x), m(h("clash_running"));
      const Me = 2e3, Re = [], Oe = new L.Box3(), xe = new L.Vector3(), Ce = me.length;
      let et = 0;
      for (let X = 0; X < Ce; X++) {
        if (Z.current !== K) {
          m(h("clash_cancelled"));
          return;
        }
        const oe = me[X], Fe = oe.testBox.max.x;
        for (let De = X + 1; De < Ce; De++) {
          const Ve = me[De];
          if (Ve.testBox.min.x > Fe) break;
          if (!ve(oe.modelId, Ve.modelId) || (et++, !oe.testBox.intersectsBox(Ve.testBox))) continue;
          if ($ && oe.obb && Ve.obb) {
            const ut = oe.obb.clone(), wt = Ve.obb.clone();
            if (R > 0 && (ut.halfSize.addScalar(R), wt.halfSize.addScalar(R)), !ut.intersectsOBB(wt, Number.EPSILON * 10)) continue;
          }
          Oe.copy(oe.box).intersect(Ve.box);
          const Ue = !Oe.isEmpty();
          let Qe = 0;
          Ue && (Oe.getSize(xe), Qe = Math.max(0, xe.x) * Math.max(0, xe.y) * Math.max(0, xe.z));
          const bt = Ue ? 0 : fo(oe.box, Ve.box), vt = Ue && Qe >= I, lt = !Ue && ze > 0 && bt <= ze;
          if (!vt && !lt || F && Ue && !de(oe, Ve, Oe)) continue;
          const ct = [oe.key, Ve.key].sort().join("::"), J = vt ? "hard" : "clearance", St = J === "hard" ? Qe > Math.max(0.5, I * 10) ? "high" : "medium" : bt <= Math.max(1e-3, ze * 0.25) ? "high" : "low";
          if (Re.push({
            id: `clash_${J}_${ct}`,
            pairKey: ct,
            groupKey: `${J}::${oe.modelId || "unknown"}::${Ve.modelId || "unknown"}::${ct}`,
            ruleId: J === "hard" ? "hard-clash-default" : "clearance-default",
            aUuid: oe.uuid,
            bUuid: Ve.uuid,
            aName: oe.name,
            bName: Ve.name,
            overlapVolume: Qe,
            distance: bt,
            severity: St,
            type: J,
            status: "new"
          }), Re.length >= Me) break;
        }
        if (Re.length >= Me) break;
        if ((X + 1) % 50 === 0 || X === Ce - 1) {
          const De = 30 + (X + 1) / Ce * 70;
          f(De), x(et), m(`${h("clash_running")} ${X + 1}/${Ce}`), await new Promise((Ve) => window.setTimeout(Ve, 0));
        }
      }
      const $e = /* @__PURE__ */ new Map(), tt = { high: 3, medium: 2, low: 1 };
      Re.forEach((X) => {
        const oe = $e.get(X.pairKey);
        if (!oe)
          $e.set(X.pairKey, X);
        else {
          const Fe = (oe.type === "hard" ? 1e3 : 0) + tt[oe.severity], De = (X.type === "hard" ? 1e3 : 0) + tt[X.severity];
          (De > Fe || De === Fe && (X.type === "hard" && X.overlapVolume > oe.overlapVolume || X.type === "clearance" && X.distance < oe.distance)) && $e.set(X.pairKey, X);
        }
      });
      const nt = Array.from($e.values()).sort((X, oe) => X.type !== oe.type ? X.type === "hard" ? -1 : 1 : X.type === "hard" ? oe.overlapVolume - X.overlapVolume : X.distance - oe.distance);
      u((X) => {
        const oe = /* @__PURE__ */ new Map();
        return X.forEach((Fe) => oe.set(Fe.pairKey, Fe.status)), nt.map((Fe) => ({
          ...Fe,
          status: oe.get(Fe.pairKey) || "new"
        }));
      }), x(et), f(100), m(`${h("clash_results")}: ${nt.length}`), nt.length === 0 && e.current.clearLocateFocus();
    } finally {
      const Q = performance.now() - Y, M = 220;
      Q < M && await new Promise((ie) => window.setTimeout(ie, M - Q)), te.current = !1, d(!1);
    }
  }, [D, U, I, b, g, R, $, F, ye, de, e, h]), be = T(() => {
    te.current && (Z.current++, m(h("clash_cancelling")));
  }, [h]), ke = T(() => {
    Z.current++, te.current = !1, d(!1), f(0), m(""), o(0), x(0), z("ALL"), re("ALL"), u([]), e.current?.clearLocateFocus(), e.current?.highlightObjects(a);
  }, [e, a]), We = T((K) => {
    const Y = [K.aUuid, K.bUuid];
    s({
      uuids: Y,
      focusUuid: K.aUuid,
      highlightColors: {
        [K.aUuid]: "#ff4d4f",
        [K.bUuid]: "#1890ff"
      }
    });
  }, [s]), Ne = T((K, Y) => {
    u((Q) => Q.map((M) => M.id === K ? { ...M, status: Y } : M));
  }, []), Ie = T((K) => {
    u((Y) => Y.map((Q) => {
      const M = V === "ALL" || V === "NEW" && Q.status === "new" || V === "CONFIRMED" && Q.status === "confirmed" || V === "RESOLVED" && Q.status === "resolved", ie = ce === "ALL" || ce === "HARD" && Q.type === "hard" || ce === "CLEARANCE" && Q.type === "clearance";
      return M && ie ? { ...Q, status: K } : Q;
    }));
  }, [V, ce]), je = T(() => {
    if (c.length === 0) return;
    const K = (me) => {
      const Me = String(me ?? "");
      return Me.includes(",") || Me.includes('"') || Me.includes(`
`) ? `"${Me.replace(/"/g, '""')}"` : Me;
    }, Q = [["pairKey", "type", "severity", "ruleId", "aUuid", "aName", "bUuid", "bName", "status", "overlapVolume", "distance"].join(",")];
    c.forEach((me) => {
      Q.push([
        K(me.pairKey),
        K(me.type),
        K(me.severity),
        K(me.ruleId),
        K(me.aUuid),
        K(me.aName),
        K(me.bUuid),
        K(me.bName),
        K(me.status),
        K(me.overlapVolume.toFixed(6)),
        K(me.distance.toFixed(6))
      ].join(","));
    });
    const M = "\uFEFF" + Q.join(`
`), ie = new Blob([M], { type: "text/csv;charset=utf-8;" }), pe = URL.createObjectURL(ie), le = /* @__PURE__ */ new Date(), ve = (me) => String(me).padStart(2, "0"), Te = `clash_report_${le.getFullYear()}${ve(le.getMonth() + 1)}${ve(le.getDate())}_${ve(le.getHours())}${ve(le.getMinutes())}${ve(le.getSeconds())}.csv`, ze = document.createElement("a");
    ze.href = pe, ze.download = Te, ze.click(), URL.revokeObjectURL(pe);
  }, [c]), qe = T(() => {
    Z.current++, te.current = !1, u([]), d(!1), f(0), m(""), o(0), x(0), z("ALL"), re("ALL");
  }, []), st = T(() => {
    const K = new Set(i.map((Y) => Y.id));
    k((Y) => Y.filter((Q) => K.has(Q))), P((Y) => Y.filter((Q) => K.has(Q)));
  }, [i]);
  return {
    clashResults: c,
    setClashResults: u,
    clashRunning: p,
    clashProgress: y,
    clashStatus: v,
    clashScannedCount: _,
    clashSetA: b,
    clashSetB: g,
    clashTolerance: R,
    clashMinOverlapVolume: I,
    clashClearanceDistance: D,
    clashUseNarrowPhase: $,
    clashUseTrianglePhase: F,
    clashPruning: !0,
    clashIncludeSameModel: U,
    clashPairsScanned: H,
    clashResultFilter: V,
    clashTypeFilter: ce,
    setClashSetA: k,
    setClashSetB: P,
    setClashTolerance: S,
    setClashMinOverlapVolume: C,
    setClashClearanceDistance: N,
    setClashUseNarrowPhase: E,
    setClashUseTrianglePhase: A,
    setClashIncludeSameModel: G,
    setClashResultFilter: z,
    setClashTypeFilter: re,
    handleRunClashCheck: he,
    handleCancelClashCheck: be,
    handleClearClashResults: ke,
    handleFocusClashResult: We,
    handleUpdateClashResultStatus: Ne,
    handleMarkFilteredClashStatus: Ie,
    handleExportClashCsv: je,
    resetClashState: qe,
    applyClashModelOptionBounds: st
  };
}
function yo(e, n) {
  const i = ee(/* @__PURE__ */ new Set()), a = Se(() => {
    const r = /* @__PURE__ */ new Map(), s = (c, u) => {
      if (!c) return;
      const p = r.get(c) || {
        total: 0,
        newCount: 0,
        confirmedCount: 0,
        resolvedCount: 0,
        worstStatus: "resolved"
      };
      p.total += 1, u === "new" ? p.newCount += 1 : u === "confirmed" ? p.confirmedCount += 1 : p.resolvedCount += 1, p.newCount > 0 ? p.worstStatus = "new" : p.confirmedCount > 0 ? p.worstStatus = "confirmed" : p.worstStatus = "resolved", r.set(c, p);
    };
    n.forEach((c) => {
      s(c.aUuid, c.status), s(c.bUuid, c.status);
    });
    const h = {};
    return r.forEach((c, u) => {
      h[u] = c;
    }), h;
  }, [n]);
  return q(() => {
    if (!e.current) return;
    const r = e.current;
    i.current.forEach((c) => {
      const u = r.contentGroup.getObjectByProperty("uuid", c);
      u?.userData?.clash && delete u.userData.clash, (r.getStructureNodes(c) || []).forEach((d) => {
        d?.userData?.clash && delete d.userData.clash;
      });
    });
    const h = /* @__PURE__ */ new Set();
    Object.entries(a).forEach(([c, u]) => {
      h.add(c);
      const p = {
        total: u.total,
        new: u.newCount,
        confirmed: u.confirmedCount,
        resolved: u.resolvedCount,
        status: u.worstStatus
      }, d = r.contentGroup.getObjectByProperty("uuid", c);
      d && (d.userData || (d.userData = {}), d.userData.clash = p), (r.getStructureNodes(c) || []).forEach((f) => {
        f.userData || (f.userData = {}), f.userData.clash = p;
      });
    }), i.current = h;
  }, [a, e]), a;
}
function bo({
  sceneMgrRef: e,
  setSelectedUuids: n,
  setSelectedProps: i
}) {
  return {
    focusObjectsInView: T(({
      uuids: r,
      focusUuid: s,
      highlightColors: h,
      updateSelection: c = !0
    }) => {
      const u = e.current;
      if (!u) return !1;
      const p = Array.from(new Set((r || []).map((y) => String(y || "").trim()).filter(Boolean)));
      if (p.length === 0) return !1;
      const d = s && p.includes(s) ? s : p[0];
      return u.focusHighlightObjects(p, {
        fitView: !0,
        focusUuid: d,
        highlightColors: h
      }), c && (n(p), i?.(null)), !0;
    }, [e, i, n])
  };
}
const Sn = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"), Lo = ({
  allowDragOpen: e = !0,
  hiddenMenus: n = [],
  libPath: i = "./libs",
  defaultLang: a,
  showStats: r,
  showOutline: s,
  showProperties: h,
  initialSettings: c,
  initialFiles: u,
  onSelect: p,
  onLoad: d,
  hideDeleteModel: y = !1,
  performancePreset: f = "quality",
  chunkOptions: v
}) => {
  const m = an.light, _ = Se(() => ({
    chunkReadCacheSize: v?.chunkReadCacheSize ?? 128,
    chunkPrefetchWindow: v?.chunkPrefetchWindow ?? 0,
    targetMinFps: v?.targetMinFps ?? 20,
    ghostMode: v?.ghostMode,
    loadProfile: v?.loadProfile ?? "max-speed",
    deferIfcProperties: v?.deferIfcProperties ?? !0,
    preferWorkerOctree: v?.preferWorkerOctree ?? !0,
    fastGeometrySanitize: v?.fastGeometrySanitize ?? !0
  }), [v]), [o, b] = it(
    "3dbrowser_lang",
    () => a || "zh",
    {
      serializer: (w) => w,
      parser: (w) => w === "zh" || w === "en" ? w : "zh"
    }
  ), k = ee(a);
  q(() => {
    a && a !== k.current && (b(a), k.current = a);
  }, [a, b]);
  const g = T((w) => Ct(o, w), [o]);
  q(() => {
    const w = (fe) => {
      fe.preventDefault();
    }, W = (fe) => {
      (fe.button === 3 || fe.button === 4) && (fe.preventDefault(), fe.stopPropagation());
    };
    return document.addEventListener("contextmenu", w, { capture: !0 }), document.addEventListener("gesturestart", w, { capture: !0 }), window.addEventListener("auxclick", w, { capture: !0 }), window.addEventListener("mousedown", W, { capture: !0 }), () => {
      document.removeEventListener("contextmenu", w, { capture: !0 }), document.removeEventListener("gesturestart", w, { capture: !0 }), window.removeEventListener("auxclick", w, { capture: !0 }), window.removeEventListener("mousedown", W, { capture: !0 });
    };
  }, []);
  const [P, R] = O([]), {
    selectedUuids: S,
    selectedUuid: I,
    setSelectedUuids: C,
    clearSelection: D
  } = Xa(), [N, $] = O(null), [E, F] = O(Ct(o, "ready")), [A, U] = O(!1), [G, H] = O(0), [x, V] = O({
    meshes: 0,
    faces: 0,
    memory: 0,
    textureMemory: 0,
    drawCalls: 0,
    chunksLoaded: 0,
    chunksTotal: 0,
    chunksQueued: 0,
    pixelRatio: 1
  }), [z, ce] = O({ loaded: 0, total: 0 }), [re, Z] = O(null), [te, ue] = O(null), [ne, ge] = O("solid"), [_e, ye] = O(""), {
    activeTool: j,
    setActiveTool: B,
    explodeEnabled: de,
    setExplodeEnabled: he,
    explodeStrength: be,
    setExplodeStrength: ke,
    explodeMode: We,
    setExplodeMode: Ne,
    resetExplodeState: Ie,
    measureType: je,
    setMeasureType: qe,
    measureHistory: st,
    setMeasureHistory: K,
    highlightedMeasureId: Y,
    setHighlightedMeasureId: Q,
    resetMeasurementState: M,
    handleMeasureUpdate: ie,
    clipEnabled: pe,
    setClipEnabled: le,
    clipValues: ve,
    setClipValues: Te,
    clipActive: ze,
    setClipActive: me,
    clipHelperVisible: Me,
    setClipHelperVisible: Re,
    clipHelperOpacity: Oe,
    setClipHelperOpacity: xe
  } = lo({
    initialSettings: c,
    mgrInstance: re
  }), [Ce, et] = it("3dbrowser_pickEnabled", !1, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [$e, tt] = it("3dbrowser_showStats", r ?? !0, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [nt, X] = it("3dbrowser_showOutline", s ?? !0, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [oe, Fe] = it("3dbrowser_showProps", h ?? !0, {
    serializer: (w) => String(w),
    parser: (w) => w === "true"
  }), [De, Ve] = it("3dbrowser_sceneSettings", () => {
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
    }, W = c ? { ...w, ...c } : w;
    return W.bgColor === void 0 ? { ...W, bgColor: m.canvasBg } : W;
  });
  q(() => {
    r !== void 0 && tt(r);
  }, [r, tt]);
  const [Ue, Qe] = O({ isOpen: !1, title: "", message: "", action: () => {
  } }), [bt, vt] = O(!1), lt = ee(null), ct = ee(null), J = ee(null), St = ee(/* @__PURE__ */ new Map()), { focusObjectsInView: ut } = bo({
    sceneMgrRef: J,
    setSelectedUuids: C,
    setSelectedProps: $
  }), {
    leftWidth: wt,
    rightWidth: on,
    resizingLeft: In,
    resizingRight: On
  } = ao({
    propShowOutline: s,
    propShowProperties: h,
    setShowOutline: X,
    setShowProps: Fe
  });
  q(() => {
    const w = J.current;
    w && (w.setChunkOptions(_), w.updateSettings({
      ...De,
      performanceMode: f,
      targetFps: _.targetMinFps ?? De.targetFps
    }));
  }, [_, f, De]);
  const Fn = P.length > 0, kt = Se(() => {
    const w = [], W = /* @__PURE__ */ new Set();
    return (P || []).forEach((fe) => {
      const we = String(fe?.object?.userData?.originalUuid || fe?.uuid || "");
      !we || W.has(we) || (W.add(we), w.push({ id: we, name: String(fe?.name || we) }));
    }), w;
  }, [P]), {
    clashResults: at,
    clashRunning: Pn,
    clashProgress: Tn,
    clashStatus: Rn,
    clashScannedCount: jn,
    clashSetA: Un,
    clashSetB: Hn,
    clashTolerance: Gn,
    clashMinOverlapVolume: Wn,
    clashClearanceDistance: Kn,
    clashUseNarrowPhase: Xn,
    clashUseTrianglePhase: Yn,
    clashIncludeSameModel: qn,
    clashPairsScanned: Qn,
    clashResultFilter: Jn,
    clashTypeFilter: Zn,
    setClashSetA: Ft,
    setClashSetB: Pt,
    setClashTolerance: ei,
    setClashMinOverlapVolume: ti,
    setClashClearanceDistance: ni,
    setClashUseNarrowPhase: ii,
    setClashUseTrianglePhase: ri,
    setClashIncludeSameModel: ai,
    setClashResultFilter: oi,
    setClashTypeFilter: si,
    handleRunClashCheck: li,
    handleCancelClashCheck: ci,
    handleClearClashResults: Tt,
    handleFocusClashResult: ui,
    handleUpdateClashResultStatus: di,
    handleMarkFilteredClashStatus: hi,
    handleExportClashCsv: pi,
    resetClashState: mi,
    applyClashModelOptionBounds: sn
  } = go({
    sceneMgrRef: J,
    treeRoot: P,
    clashModelOptions: kt,
    selectedUuids: S,
    setSelectedUuids: C,
    focusObjectsInView: ut,
    t: g
  }), ln = yo(J, at), cn = ee(/* @__PURE__ */ new Set()), un = ee("");
  q(() => {
    un.current = _e;
  }, [_e]);
  const [Rt, jt] = O({ isOpen: !1, title: "", message: "" }), [dt, Ke] = O(null), { onManagerChunkProgress: dn } = Va({
    fileSetIdRef: un,
    completedFileSetsRef: cn,
    onProgress: ce,
    onCompleted: () => {
      Ke({ message: g("all_chunks_loaded"), type: "success" }), ce({ loaded: 0, total: 0 });
    }
  }), fi = T((w, W) => {
    dn(w, W);
  }, [dn]);
  Ga({
    mgrInstance: re,
    showStats: $e,
    setStats: V
  }), q(() => {
    sn();
  }, [sn]);
  const Ut = ee(() => {
  });
  q(() => {
    E === Ct(o === "zh" ? "en" : "zh", "ready") && F(Ct(o, "ready"));
  }, [o]);
  const hn = (w) => w >= 1e6 ? (w / 1e6).toFixed(2) + "M" : w >= 1e3 ? (w / 1e3).toFixed(1) + "K" : w.toString(), _i = (w) => w >= 1024 ? (w / 1024).toFixed(2) + " GB" : w.toFixed(1) + " MB";
  function gi(w) {
    const W = {};
    return w.visibility && (W.hiddenUuids = Array.from(Mt), W.isolatedUuids = Array.from(Lt)), w.selection && (W.selectedUuids = [...S]), w.clip && (W.clip = {
      enabled: pe,
      values: {
        x: [...ve.x],
        y: [...ve.y],
        z: [...ve.z]
      },
      active: { ...ze },
      helperVisible: Me,
      helperOpacity: Oe
    }), w.explode && (W.explode = {
      enabled: de,
      strength: be,
      mode: We
    }), W;
  }
  async function yi(w) {
    const W = J.current;
    if (!(!W || !w)) {
      if (Ut.current?.(), W.clearLocateFocus(), w.clip && (le(w.clip.enabled), Te(w.clip.values), me(w.clip.active), Re(w.clip.helperVisible), xe(w.clip.helperOpacity)), w.explode && (he(w.explode.enabled), ke(w.explode.strength), Ne(w.explode.mode)), w.hiddenUuids !== void 0 || w.isolatedUuids !== void 0) {
        W.setAllVisibility(!0);
        const fe = w.hiddenUuids || [], we = w.isolatedUuids || [];
        we.length > 0 ? (W.isolateObjects(we), Et(/* @__PURE__ */ new Set()), zt(new Set(we))) : (fe.forEach((He) => W.setObjectVisibility(He, !1)), Et(new Set(fe)), zt(/* @__PURE__ */ new Set())), Je();
      }
      if (w.selectedUuids !== void 0 && (C(w.selectedUuids), $(null), W.highlightObjects(w.selectedUuids), w.selectedUuids.length === 1)) {
        const fe = W.contentGroup.getObjectByProperty("uuid", w.selectedUuids[0]);
        fe && await Dt(fe);
      }
      queueMicrotask(() => {
        W.invalidateRender?.({ needsCulling: !0 }), requestAnimationFrame(() => W.invalidateRender?.({ needsCulling: !0 }));
      });
    }
  }
  const {
    viewpoints: bi,
    handleSaveViewpoint: vi,
    handleUpdateViewpointName: wi,
    handleLoadViewpoint: xi,
    handleOverwriteViewpoint: Ci,
    handleDeleteViewpoint: Ni
  } = ho({
    currentFileSetId: _e,
    sceneMgrRef: J,
    setToast: Ke,
    setConfirmState: Qe,
    t: g,
    captureStateSnapshot: gi,
    restoreStateSnapshot: yi
  });
  q(() => {
    re && requestAnimationFrame(() => {
      re.resize();
    });
  }, [re, nt, oe, wt, on]), q(() => {
    if (dt) {
      const w = setTimeout(() => {
        Ke(null);
      }, 3e3);
      return () => clearTimeout(w);
    }
  }, [dt]);
  const Je = T(() => {
    if (!J.current) return;
    const w = J.current.structureRoot;
    if (!w) {
      R([]);
      return;
    }
    const W = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map(), we = (Be) => {
      const Ge = (Be || []).slice();
      for (; Ge.length; ) {
        const Ae = Ge.pop();
        if (Ae && (typeof Ae.uuid == "string" && (W.set(Ae.uuid, !!Ae.expanded), fe.set(Ae.uuid, Ae.childrenLoaded !== !1)), Array.isArray(Ae.children) && Ae.children.length))
          for (const xt of Ae.children)
            Ge.push(xt);
      }
    }, He = (Be, Ge = 0, Ae = !1, xt = !1) => {
      const Wt = Be.id, _n = Array.isArray(Be.children) ? Be.children : [], ar = _n.length > 0, gn = xt || fe.get(Wt) === !0;
      return {
        uuid: Wt,
        name: Be.name,
        type: Be.type === "Mesh" ? "MESH" : "GROUP",
        depth: Ge,
        children: gn ? _n.map((or) => He(or, Ge + 1, !1, !1)) : [],
        expanded: W.get(Wt) ?? !1,
        visible: Be.visible !== !1,
        object: Be,
        isFileNode: Ae,
        hasChildren: ar,
        childrenLoaded: gn
      };
    };
    R((Be) => {
      we(Be);
      const Ge = [];
      return (w.children || []).forEach((Ae) => {
        Ae.name === "ImportedModels" || Ae.name === "Tilesets" ? (Ae.children || []).forEach((xt) => {
          Ge.push(He(xt, 0, !0, !0));
        }) : Ge.push(He(Ae, 0, !0, !0));
      }), Ge;
    });
  }, []), {
    contextMenu: Ht,
    hiddenUuids: Mt,
    isolatedUuids: Lt,
    setHiddenUuids: Et,
    setIsolatedUuids: zt,
    handleContextMenu: Si,
    closeContextMenu: ki,
    handleHideSelected: Mi,
    handleShowAll: ht,
    handleToggleVisibility: Li,
    handleHideObject: Ei,
    handleIsolateObject: zi,
    handleIsolateSelection: Di,
    handleUndoVisibility: Vi
  } = uo({
    sceneMgrRef: J,
    selectedUuids: S,
    setSelectedUuids: C,
    setSelectedProps: $,
    updateTree: Je,
    resetLocateState: () => Ut.current()
  }), Ai = (w) => {
    if (!J.current) return;
    const W = J.current.contentGroup.getObjectByProperty("uuid", w), fe = J.current.getStructureNodes(w);
    if (W || fe) {
      const we = W?.name || fe?.[0]?.name || "Item";
      Qe({
        isOpen: !0,
        title: g("delete_item"),
        message: `${g("confirm_delete")} "${we}"?`,
        action: async () => {
          U(!0), F(g("delete_item") + "...");
          try {
            await J.current?.removeModel(w), C((He) => {
              const Be = He.filter((Ge) => Ge !== w);
              return J.current?.highlightObjects(Be), Be.length === 0 && $(null), Be;
            }), Je(), F(g("ready")), Ke({ message: g("success"), type: "success" });
          } catch (He) {
            console.error("删除对象失败:", He), Ke({ message: g("failed") + ": " + (He instanceof Error ? He.message : String(He)), type: "error" });
          } finally {
            U(!1);
          }
        }
      });
    }
  }, pn = () => {
    D(), $(null), J.current?.highlightObjects([]), J.current?.invalidateRender?.({ needsCulling: !0 });
  };
  q(() => {
    if (!lt.current) return;
    const w = new ur(lt.current, {
      performancePreset: f,
      chunkOptions: _
    });
    return J.current = w, Z(w), d && d(w), w.updateSettings(De), requestAnimationFrame(() => {
      w.resize();
    }), w.onChunkProgress = fi, w.onMeasureUpdate = ie, w.onStructureUpdate = () => {
      Je();
    }, () => {
      w.dispose();
    };
  }, []), q(() => {
    if (!re || !u) return;
    (async () => {
      const W = Array.isArray(u) ? u : [u];
      console.log("[ThreeViewer] loadInitial with items:", W), await Gt(W);
    })();
  }, [re, u]);
  const $i = (w) => {
    const W = {
      ...De,
      ...w
    };
    Ve(W), J.current && J.current.updateSettings(W);
  }, {
    locatedUuid: Bi,
    locateResultUuids: Ii,
    resetLocateState: mn,
    handleSelect: Dt,
    handleLocateObject: Oi,
    handleLocateResultsChange: Fi,
    handleClearLocate: Pi
  } = eo({
    sceneMgrRef: J,
    selectedUuids: S,
    setSelectedUuids: C,
    setSelectedProps: $,
    setHiddenUuids: Et,
    setIsolatedUuids: zt,
    updateTree: Je,
    propOnSelect: p,
    ifcPropertyCacheRef: St,
    clashSummaryByUuid: ln,
    focusObjectsInView: ut,
    t: g,
    isDev: Sn
  });
  Ut.current = mn;
  const {
    searchConditions: Ti,
    setSearchConditions: Ri,
    searchResults: Vt,
    searching: ji,
    searchProgress: Ui,
    searchStatus: Hi,
    handleRunPropertySearch: Gi,
    handleApplySearchResultHighlight: Wi,
    handleClearSearchResult: At,
    handleCancelSearch: Ki
  } = mo({
    sceneMgrRef: J,
    selectedUuids: S,
    setSelectedUuids: C,
    onSelectObject: Dt,
    focusObjectsInView: ut,
    t: g,
    setToast: Ke
  }), fn = Se(() => {
    const w = [];
    return je !== "none" && w.push({
      key: "measure",
      label: g("mode_measure"),
      onClear: () => {
        qe("none"), B("none"), J.current?.clearMeasurementPreview();
      }
    }), pe && w.push({
      key: "clip",
      label: g("mode_clip"),
      onClear: () => {
        le(!1), B("none");
      }
    }), Vt.length > 0 && w.push({
      key: "search",
      label: `${g("mode_search")} ${Vt.length}`,
      onClear: At
    }), Mt.size > 0 && w.push({
      key: "hidden",
      label: `${g("mode_hidden")} ${Mt.size}`,
      onClear: ht
    }), Lt.size > 0 && w.push({
      key: "isolated",
      label: `${g("mode_isolated")} ${Lt.size}`,
      onClear: ht
    }), j === "boxSelect" && w.push({
      key: "boxSelect",
      label: g("mode_box_select"),
      onClear: () => B("none")
    }), at.length > 0 && w.push({
      key: "clash",
      label: `${g("mode_clash")} ${at.length}`,
      onClear: Tt
    }), w;
  }, [
    j,
    at.length,
    pe,
    Tt,
    At,
    ht,
    Mt.size,
    Lt.size,
    je,
    Vt.length,
    g
  ]), Xi = T((w) => {
    if (!J.current) return;
    const W = Array.from(new Set(
      at.filter((fe) => fe.status === w).flatMap((fe) => [fe.aUuid, fe.bUuid]).filter(Boolean)
    ));
    W.length !== 0 && (J.current.clearLocateFocus(), J.current.isolateObjects(W), Et(/* @__PURE__ */ new Set()), zt(new Set(W)), Je(), J.current.fitViewToObjects(W));
  }, [at, Je]), { processFiles: Gt, loadItemsIntoScene: Yi } = Ha({
    managerRef: J,
    sceneSettings: De,
    libPath: i,
    t: g,
    setCurrentFileSetId: ye,
    setLoading: U,
    setStatus: F,
    setProgress: H,
    setToast: Ke,
    updateTree: Je
  });
  po({
    allowDragOpen: e,
    mgrInstance: re,
    viewportRef: ct,
    t: g,
    processFiles: Gt,
    setToast: Ke,
    setErrorState: jt
  });
  const {
    getDefaultExportFileName: qi,
    handleExport: Qi,
    handleClear: Ji,
    handleScreenshot: Zi
  } = to({
    sceneMgrRef: J,
    t: g,
    setLoading: U,
    setProgress: H,
    setStatus: F,
    setToast: Ke,
    setActiveTool: B,
    setConfirmState: Qe,
    setSelectedUuids: C,
    setSelectedProps: $,
    setChunkProgress: ce,
    resetLocateState: mn,
    clearSearchResult: At,
    resetClashState: mi,
    resetMeasurementState: M,
    resetExplodeState: Ie,
    updateTree: Je,
    ifcPropertyCacheRef: St,
    completedFileSetsRef: cn
  }), {
    handleOpenFiles: er,
    handleBatchConvert: tr,
    handleOpenUrl: nr,
    handleDragOver: ir,
    handleDrop: rr
  } = ro({
    sceneMgrRef: J,
    t: g,
    processFiles: Gt,
    loadItemsIntoScene: Yi,
    setLoading: U,
    setStatus: F,
    setProgress: H,
    setToast: Ke,
    setActiveTool: B,
    setSelectedUuids: C,
    setSelectedProps: $,
    resetMeasurementState: M,
    updateTree: Je,
    isDev: Sn
  });
  return no({
    sceneMgrRef: J,
    canvasRef: lt,
    activeTool: j,
    setActiveTool: B,
    measureType: je,
    setMeasureType: qe,
    pickEnabled: Ce,
    selectedUuids: S,
    setSelectedUuids: C,
    setSelectedProps: $,
    setMousePos: ue,
    setHighlightedMeasureId: Q,
    handleSelect: Dt,
    handleContextMenu: Si,
    handleUndoVisibility: Vi,
    clearSelectionState: pn
  }), /* @__PURE__ */ t(Da, { t: g, theme: m, children: /* @__PURE__ */ l(
    "div",
    {
      className: "ui-container ui-app-shell font-medium",
      onDragOver: ir,
      onDrop: rr,
      children: [
        /* @__PURE__ */ t(
          Qr,
          {
            t: g,
            handleOpenFiles: er,
            handleBatchConvert: tr,
            handleOpenUrl: nr,
            handleView: (w) => {
              J.current?.setView(w);
            },
            handleClear: Ji,
            openScreenshotPanel: () => B("screenshot"),
            handleDisplayModeChange: (w) => {
              J.current && (ge(w), J.current.contentGroup.traverse((W) => {
                W.isMesh && W.material && (Array.isArray(W.material) ? W.material : [W.material]).forEach((we) => {
                  w === "transparent" ? (we.wireframe = !1, we.transparent = !0, we.opacity = 0.5) : (we.wireframe = !1, we.transparent = !1, we.opacity = 1);
                });
              }), J.current.requestRender());
            },
            displayMode: ne,
            pickEnabled: Ce,
            setPickEnabled: et,
            activeTool: j,
            setActiveTool: B,
            showOutline: nt,
            setShowOutline: X,
            showProps: oe,
            setShowProps: Fe,
            showStats: $e,
            setShowStats: tt,
            sceneMgr: J.current,
            theme: m,
            hiddenMenus: n,
            onOpenAbout: () => vt(!0),
            hasModels: Fn
          }
        ),
        /* @__PURE__ */ l("div", { className: "ui-main-layout", children: [
          nt && /* @__PURE__ */ l("div", { className: "ui-sidebar ui-sidebar-left", style: { width: `${wt}px` }, children: [
            /* @__PURE__ */ l("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: g("interface_outline") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => X(!1),
                  children: /* @__PURE__ */ t(ot, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(
              ra,
              {
                t: g,
                treeRoot: P,
                setTreeRoot: R,
                selectedUuid: I,
                locatedUuid: Bi,
                onSelect: (w, W) => Dt(W, null, !1, !0),
                onToggleVisibility: Li,
                onDelete: (w) => {
                  const W = w?.uuid || w?.id;
                  W && Ai(W);
                },
                onHide: Ei,
                onIsolate: zi,
                onShowAll: ht,
                onLocate: Oi,
                onClearLocate: Pi,
                onLocateResultsChange: Fi,
                locateResultUuids: Ii,
                clashSummaryByUuid: ln
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
          /* @__PURE__ */ l("div", { ref: ct, className: "ui-viewport-shell", style: { backgroundColor: m.canvasBg }, children: [
            /* @__PURE__ */ t("canvas", { ref: lt, className: "ui-viewport-canvas" }),
            /* @__PURE__ */ t(za, { sceneMgr: re, theme: m, lang: o }),
            Ht.visible && /* @__PURE__ */ t(
              Ln,
              {
                x: Ht.x,
                y: Ht.y,
                items: [
                  {
                    label: g("hide_selected"),
                    onClick: Mi,
                    disabled: S.length === 0
                  },
                  {
                    label: g("isolate_selection"),
                    onClick: Di,
                    disabled: S.length === 0
                  },
                  {
                    label: g("clear_selection"),
                    onClick: pn,
                    disabled: S.length === 0
                  },
                  {
                    label: g("show_all"),
                    onClick: ht
                  }
                ],
                onClose: ki,
                theme: m
              }
            ),
            dt && /* @__PURE__ */ l("div", { className: "ui-toast", children: [
              /* @__PURE__ */ t("div", { className: `ui-toast-dot ${dt.type === "error" ? "ui-toast-dot-error" : dt.type === "success" ? "ui-toast-dot-success" : "ui-toast-dot-info"}` }),
              /* @__PURE__ */ t("span", { className: "ui-toast-message", children: dt.message }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-toast-close",
                  onClick: () => Ke(null),
                  children: /* @__PURE__ */ t(ot, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ t(wa, { t: g, loading: A, status: E, progress: G, theme: m }),
            j === "measure" && /* @__PURE__ */ t(
              ua,
              {
                t: g,
                sceneMgr: J.current,
                measureType: je,
                setMeasureType: qe,
                measureHistory: st,
                highlightedId: Y,
                onHighlight: (w) => {
                  Q(w), J.current?.highlightMeasurement(w), w && J.current?.locateMeasurement(w);
                },
                onDelete: (w) => {
                  J.current?.removeMeasurement(w), K((W) => W.filter((fe) => fe.id !== w)), Y === w && (Q(null), J.current?.highlightMeasurement(null));
                },
                onClear: () => {
                  J.current?.clearAllMeasurements(), M();
                },
                onClose: () => B("none"),
                theme: m
              }
            ),
            j === "clip" && /* @__PURE__ */ t(
              da,
              {
                t: g,
                sceneMgr: J.current,
                onClose: () => B("none"),
                clipEnabled: pe,
                setClipEnabled: le,
                clipValues: ve,
                setClipValues: Te,
                clipActive: ze,
                setClipActive: me,
                clipHelperVisible: Me,
                setClipHelperVisible: Re,
                clipHelperOpacity: Oe,
                setClipHelperOpacity: xe,
                theme: m
              }
            ),
            j === "export" && /* @__PURE__ */ t(
              ha,
              {
                t: g,
                onClose: () => B("none"),
                onExport: Qi,
                getDefaultFileName: qi,
                theme: m
              }
            ),
            j === "screenshot" && /* @__PURE__ */ t(
              pa,
              {
                t: g,
                onClose: () => B("none"),
                onCapture: (w) => {
                  Zi(w), B("none");
                },
                theme: m
              }
            ),
            j === "settings" && /* @__PURE__ */ t(
              aa,
              {
                t: g,
                onClose: () => B("none"),
                settings: De,
                onUpdate: $i,
                currentLang: o,
                setLang: b,
                showStats: $e,
                setShowStats: tt,
                theme: m
              }
            ),
            j === "viewpoint" && /* @__PURE__ */ t(
              fa,
              {
                t: g,
                viewpoints: bi,
                onSave: vi,
                onUpdateName: wi,
                onLoad: xi,
                onDelete: Ni,
                onOverwrite: Ci,
                onClose: () => B("none"),
                theme: m
              }
            ),
            j === "search" && /* @__PURE__ */ t(
              ba,
              {
                t: g,
                onClose: () => B("none"),
                conditions: Ti,
                results: Vt,
                searching: ji,
                searchProgress: Ui,
                searchStatus: Hi,
                onConditionsChange: Ri,
                onSearch: () => void Gi(),
                onCancelSearch: Ki,
                onApplyResultHighlight: Wi,
                onClearResult: At,
                theme: m
              }
            ),
            j === "clash" && /* @__PURE__ */ t(
              va,
              {
                t: g,
                onClose: () => B("none"),
                running: Pn,
                progress: Tn,
                status: Rn,
                scannedCount: jn,
                pairsScanned: Qn,
                results: at,
                resultFilter: Jn,
                modelOptions: kt,
                setA: Un,
                setB: Hn,
                tolerance: Gn,
                minOverlapVolume: Wn,
                clearanceDistance: Kn,
                useNarrowPhase: Xn,
                useTrianglePhase: Yn,
                includeSameModel: qn,
                onSetAChange: Ft,
                onSetBChange: Pt,
                onToleranceChange: ei,
                onMinOverlapVolumeChange: ti,
                onClearanceDistanceChange: ni,
                onUseNarrowPhaseChange: ii,
                onUseTrianglePhaseChange: ri,
                onIncludeSameModelChange: ai,
                onRun: () => void li(),
                onCancel: ci,
                onClear: Tt,
                onExportCsv: pi,
                onIsolateByStatus: Xi,
                onRestoreVisibility: ht,
                onResultFilterChange: oi,
                typeFilter: Zn,
                onTypeFilterChange: si,
                onUpdateResultStatus: di,
                onMarkFilteredStatus: hi,
                onSetASelectAll: () => Ft(kt.map((w) => w.id)),
                onSetAClear: () => Ft([]),
                onSetBSelectAll: () => Pt(kt.map((w) => w.id)),
                onSetBClear: () => Pt([]),
                onFocusResult: ui,
                theme: m
              }
            ),
            j === "explode" && /* @__PURE__ */ t(
              _a,
              {
                t: g,
                onClose: () => B("none"),
                enabled: de,
                strength: be,
                mode: We,
                onEnabledChange: he,
                onStrengthChange: ke,
                onModeChange: Ne,
                onReset: () => {
                  Ie(), J.current?.resetExplode();
                },
                theme: m
              }
            )
          ] }),
          oe && /* @__PURE__ */ l("div", { className: "ui-sidebar ui-sidebar-right", style: { width: `${on}px` }, children: [
            /* @__PURE__ */ l("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: g("interface_props") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => Fe(!1),
                  children: /* @__PURE__ */ t(ot, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(Ma, { t: g, selectedProps: N, theme: m }) }),
            /* @__PURE__ */ t(
              "div",
              {
                onMouseDown: () => On.current = !0,
                className: "ui-sidebar-resize ui-sidebar-resize-right"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "ui-statusbar", children: [
          /* @__PURE__ */ l("div", { className: "ui-statusbar-left", children: [
            /* @__PURE__ */ t("span", { children: E }),
            A && /* @__PURE__ */ l("span", { children: [
              G,
              "%"
            ] }),
            I && S.length > 1 && /* @__PURE__ */ l("span", { className: "ui-statusbar-meta", children: [
              g("selected_count"),
              ": ",
              S.length
            ] }),
            z.total > 0 && z.loaded < z.total && /* @__PURE__ */ l("div", { className: "ui-chunk-progress", children: [
              /* @__PURE__ */ l("span", { children: [
                g("chunk_loading"),
                ": ",
                z.loaded,
                "/",
                z.total
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-compact", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "ui-progress-fill",
                  style: { width: `${z.loaded / z.total * 100}%` }
                }
              ) })
            ] }),
            fn.length > 0 && /* @__PURE__ */ t("div", { className: "ui-mode-tray", children: fn.map((w) => /* @__PURE__ */ l("div", { className: "ui-mode-pill", children: [
              /* @__PURE__ */ t("span", { children: w.label }),
              /* @__PURE__ */ t("button", { onClick: w.onClear, children: g("mode_clear") })
            ] }, w.key)) })
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-statusbar-right", children: [
            te && /* @__PURE__ */ l("div", { className: "ui-statusbar-coords", children: [
              te.x.toFixed(2),
              ", ",
              te.y.toFixed(2),
              ", ",
              te.z.toFixed(2)
            ] }),
            /* @__PURE__ */ l("div", { className: "ui-tips", children: [
              /* @__PURE__ */ t("span", { children: g("tips_rotate") }),
              /* @__PURE__ */ t("span", { children: g("tips_pan") }),
              /* @__PURE__ */ t("span", { children: g("tips_zoom") })
            ] }),
            $e && /* @__PURE__ */ l("div", { className: "ui-stats-group", children: [
              /* @__PURE__ */ l("div", { className: "ui-stats-item", title: g("stats_original_meshes"), children: [
                /* @__PURE__ */ t(kn, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: hn(x.meshes) })
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-stats-item", title: g("stats_triangles"), children: [
                /* @__PURE__ */ t(Vr, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: hn(x.faces) })
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-stats-item", children: [
                /* @__PURE__ */ t(Lr, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: _i(x.memory) })
              ] }),
              x.chunksTotal > 0 && /* @__PURE__ */ l("div", { className: "ui-statusbar-metric", title: g("stats_chunks"), children: [
                "CH ",
                x.chunksLoaded,
                "/",
                x.chunksTotal
              ] }),
              /* @__PURE__ */ l("div", { className: "ui-statusbar-metric", title: g("stats_pixel_ratio"), children: [
                "DPR ",
                x.pixelRatio
              ] })
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-statusbar-tag ui-statusbar-tag-compact",
                onClick: () => b(o === "zh" ? "en" : "zh"),
                children: o === "zh" ? "EN" : "中文"
              }
            ),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t("div", { className: "ui-statusbar-tag ui-statusbar-tag-compact ui-statusbar-brand", children: /* @__PURE__ */ t("span", { className: "ui-statusbar-brand-label", children: "3D BROWSER" }) })
          ] })
        ] }),
        /* @__PURE__ */ t(
          La,
          {
            isOpen: Ue.isOpen,
            title: Ue.title,
            message: Ue.message,
            onConfirm: () => {
              Ue.action(), Qe({ ...Ue, isOpen: !1 });
            },
            onCancel: () => Qe({ ...Ue, isOpen: !1 }),
            t: g,
            theme: m
          }
        ),
        /* @__PURE__ */ t(
          Ea,
          {
            isOpen: bt,
            onClose: () => vt(!1),
            t: g,
            theme: m
          }
        ),
        Rt.isOpen && /* @__PURE__ */ t("div", { className: "ui-error-overlay", children: /* @__PURE__ */ l("div", { className: "ui-error-content ui-error-content-wide", children: [
          /* @__PURE__ */ l("div", { className: "ui-error-header ui-error-header-danger", children: [
            /* @__PURE__ */ t("span", { children: Rt.title }),
            /* @__PURE__ */ t(
              "div",
              {
                onClick: () => jt((w) => ({ ...w, isOpen: !1 })),
                className: "ui-error-close",
                children: /* @__PURE__ */ t(ot, { width: 18, height: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ l("div", { className: "ui-error-body", children: [
            /* @__PURE__ */ t("div", { className: "ui-error-message", children: Rt.message }),
            /* @__PURE__ */ t("div", { className: "ui-error-actions", children: /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-primary ui-btn-modal-confirm",
                onClick: () => jt((w) => ({ ...w, isOpen: !1 })),
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
  hr as DEFAULT_FONT,
  ur as SceneManager,
  Lo as ThreeViewer,
  ko as colors,
  Ct as getTranslation,
  Ra as loadModelFiles,
  Mo as resolveThemeColors,
  an as themes
};
