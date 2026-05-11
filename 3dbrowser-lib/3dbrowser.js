import { jsx as t, jsxs as c, Fragment as ge } from "react/jsx-runtime";
import jt, { useRef as se, useState as V, useEffect as ce, useMemo as Ee, useCallback as U, useLayoutEffect as Si, Component as ki } from "react";
import { s as An, a as Zt, e as Mi, b as Li, S as Ei } from "./utils-CKkY57Rv.js";
import * as E from "three";
import { OBB as Ii } from "three/examples/jsm/math/OBB.js";
const fn = {
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
}, es = "'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif", ts = fn.light;
function He(e) {
  return typeof window > "u" ? "" : getComputedStyle(document.documentElement).getPropertyValue(e).trim();
}
function ns() {
  const e = fn.light, n = {
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
const Di = {
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
}, Lt = (e, n) => Di[e][n] || n;
function Ai(e, n) {
  return (e || []).includes(n);
}
const zn = 24, zi = 1.5, ve = (e, n = {}) => {
  const { size: r, color: a, ...i } = n;
  return /* @__PURE__ */ t(
    "svg",
    {
      width: r || zn,
      height: r || zn,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: a || "currentColor",
      strokeWidth: zi,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...i,
      children: e
    }
  );
}, _n = (e) => ve(/* @__PURE__ */ t("polyline", { points: "9 18 15 12 9 6" }), e), Bi = (e) => ve(/* @__PURE__ */ t("polyline", { points: "15 18 9 12 15 6" }), e), gn = (e) => ve(/* @__PURE__ */ t("polyline", { points: "6 9 12 15 18 9" }), e), Fi = (e) => ve(/* @__PURE__ */ t("polyline", { points: "18 15 12 9 6 15" }), e), Vi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "7" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "2.5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "2", x2: "12", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "19", x2: "12", y2: "22" }),
    /* @__PURE__ */ t("line", { x1: "2", y1: "12", x2: "5", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "12", x2: "22", y2: "12" })
  ] }),
  e
), Pi = (e) => ve(
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
), $i = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ t("polyline", { points: "14 2 14 8 20 8" })
  ] }),
  e
), Oi = (e) => ve(
  /* @__PURE__ */ t(ge, { children: /* @__PURE__ */ t("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" }) }),
  e
), Ti = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("rect", { x: "2", y: "2", width: "20", height: "16", rx: "1" }),
    /* @__PURE__ */ t("line", { x1: "6", y1: "14", x2: "6", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "14", x2: "12", y2: "16" }),
    /* @__PURE__ */ t("line", { x1: "18", y1: "14", x2: "18", y2: "17" })
  ] }),
  e
), Ri = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "6", cy: "6", r: "3" }),
    /* @__PURE__ */ t("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ t("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
    /* @__PURE__ */ t("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
    /* @__PURE__ */ t("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
  ] }),
  e
), Ui = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ t("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ] }),
  e
), ji = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] }),
  e
), Hi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ t("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ t("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  e
), Gi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" }),
    /* @__PURE__ */ t("path", { d: "M13 13l6 6" })
  ] }),
  e
), jn = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    /* @__PURE__ */ t("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ] }),
  e
), Wi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] }),
  e
), Ki = (e) => ve(
  /* @__PURE__ */ t(ge, { children: /* @__PURE__ */ t("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) }),
  e
), Xi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  e
), Yi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    /* @__PURE__ */ t("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  e
), qi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ t("line", { x1: "16.65", y1: "16.65", x2: "21", y2: "21" })
  ] }),
  e
), Qi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ t("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] }),
  e
), Ji = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ t("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ t("polyline", { points: "21 15 16 10 5 21" })
  ] }),
  e
), Zi = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
    /* @__PURE__ */ t("polyline", { points: "2 12 12 17 22 12" }),
    /* @__PURE__ */ t("polyline", { points: "2 17 12 22 22 17" })
  ] }),
  e
), ea = (e) => ve(
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
), ta = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("path", { d: "M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4z", fill: "none" }),
    /* @__PURE__ */ t("line", { x1: "7", y1: "5", x2: "17", y2: "5" }),
    /* @__PURE__ */ t("line", { x1: "5", y1: "7", x2: "5", y2: "17" }),
    /* @__PURE__ */ t("line", { x1: "17", y1: "19", x2: "7", y2: "19" }),
    /* @__PURE__ */ t("line", { x1: "19", y1: "17", x2: "19", y2: "7" })
  ] }),
  e
), na = (e) => ve(
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
), ra = (e) => ve(
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
), ia = (e) => ve(
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
), aa = (e) => ve(
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
), oa = (e) => ve(
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
), sa = (e) => ve(
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
), la = (e) => ve(
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
), ca = (e) => ve(
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
), ua = (e) => ve(
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
), da = (e) => ve(
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
), ha = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.35" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), pa = (e) => ve(
  /* @__PURE__ */ c(ge, { children: [
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "none" }),
    /* @__PURE__ */ t("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "13", x2: "12", y2: "21", strokeDasharray: "2 2" }),
    /* @__PURE__ */ t("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ t("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  e
), Bn = (e) => ve(
  /* @__PURE__ */ t(ge, { children: /* @__PURE__ */ t("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }),
  e
), Fn = (e) => ve(
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
  theme: a,
  style: i,
  className: o = "",
  disabled: h,
  ...u
}) => /* @__PURE__ */ c(
  "button",
  {
    style: { opacity: h ? 0.4 : 1, cursor: h ? "not-allowed" : "pointer", ...i },
    className: `ui-toolbar-btn ${r ? "active" : ""} ${o}`,
    disabled: h,
    ...u,
    children: [
      /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-icon", children: e }),
      n && /* @__PURE__ */ t("div", { className: "ui-toolbar-btn-label", children: n })
    ]
  }
), ma = (e) => {
  const {
    t: n,
    theme: r,
    hiddenMenus: a = []
  } = e, i = se(null), o = se(null), h = se(null), [u, p] = V(null), l = (s) => Ai(a, s);
  ce(() => {
    if (!u) return;
    const s = (N) => {
      h.current && !h.current.contains(N.target) && p(null);
    }, g = (N) => {
      N.key === "Escape" && p(null);
    };
    return document.addEventListener("mousedown", s), document.addEventListener("keydown", g), () => {
      document.removeEventListener("mousedown", s), document.removeEventListener("keydown", g);
    };
  }, [u]);
  const d = (s) => {
    p((g) => g === s ? null : s);
  }, f = () => p(null), _ = (s, g) => u !== s ? null : /* @__PURE__ */ t("div", { className: "ui-toolbar-menu", role: "menu", children: g }), m = (s, g, N) => /* @__PURE__ */ c(
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
        /* @__PURE__ */ t("span", { children: g })
      ]
    }
  ), b = () => /* @__PURE__ */ t("div", { className: "ui-toolbar-menu-divider" }), x = (s) => {
    e.setActiveTool?.(e.activeTool === s ? "none" : s);
  };
  return /* @__PURE__ */ c("div", { ref: h, className: "ui-toolbar", children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "file",
        ref: i,
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
          icon: /* @__PURE__ */ t($i, {}),
          label: n("tb_file") || "文件",
          active: u === "file",
          onClick: () => d("file"),
          theme: r
        }
      ),
      _("file", /* @__PURE__ */ c(ge, { children: [
        !l("open_file") && m(/* @__PURE__ */ t(Bn, {}), n("menu_open_file") || "打开文件", () => {
          i.current?.click(), f();
        }),
        !l("open_url") && m(/* @__PURE__ */ t(Bn, {}), n("menu_open_url") || "打开地址", () => {
          e.handleOpenUrl?.(), f();
        }),
        !l("batch_convert") && /* @__PURE__ */ c(ge, { children: [
          b(),
          m(/* @__PURE__ */ t(Fn, {}), n("menu_batch_convert") || "批量转换", () => {
            o.current?.click(), f();
          })
        ] }),
        !l("export") && /* @__PURE__ */ c(ge, { children: [
          b(),
          m(/* @__PURE__ */ t(Fn, {}), n("menu_export") || "导出", () => {
            e.setActiveTool?.("export"), f();
          })
        ] }),
        !l("clear") && /* @__PURE__ */ c(ge, { children: [
          b(),
          m(/* @__PURE__ */ t(Pi, {}), n("op_clear") || "清空", () => {
            e.handleClear?.(), f();
          })
        ] })
      ] }))
    ] }) }),
    !l("view") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("fit_view") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Oi, {}),
          label: n("tb_fit") || "充满",
          onClick: () => e.sceneMgr?.restoreView(),
          theme: r
        }
      ),
      !l("views") && /* @__PURE__ */ c("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Ve,
          {
            icon: /* @__PURE__ */ t(Yi, {}),
            label: n("tb_view") || "视图",
            active: u === "views",
            onClick: () => d("views"),
            theme: r
          }
        ),
        _("views", /* @__PURE__ */ c(ge, { children: [
          m(/* @__PURE__ */ t(ia, {}), n("view_front") || "前视图", () => {
            e.handleView?.("front"), f();
          }),
          m(/* @__PURE__ */ t(aa, {}), n("view_back") || "后视图", () => {
            e.handleView?.("back"), f();
          }),
          m(/* @__PURE__ */ t(na, {}), n("view_top") || "顶视图", () => {
            e.handleView?.("top"), f();
          }),
          m(/* @__PURE__ */ t(ra, {}), n("view_bottom") || "底视图", () => {
            e.handleView?.("bottom"), f();
          }),
          m(/* @__PURE__ */ t(oa, {}), n("view_left") || "左视图", () => {
            e.handleView?.("left"), f();
          }),
          m(/* @__PURE__ */ t(sa, {}), n("view_right") || "右视图", () => {
            e.handleView?.("right"), f();
          }),
          b(),
          m(/* @__PURE__ */ t(ca, {}), n("view_se") || "东南", () => {
            e.handleView?.("se"), f();
          }),
          m(/* @__PURE__ */ t(la, {}), n("view_sw") || "西南", () => {
            e.handleView?.("sw"), f();
          }),
          m(/* @__PURE__ */ t(ua, {}), n("view_ne") || "东北", () => {
            e.handleView?.("ne"), f();
          }),
          m(/* @__PURE__ */ t(da, {}), n("view_nw") || "西北", () => {
            e.handleView?.("nw"), f();
          })
        ] }))
      ] })
    ] }),
    !l("interface") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("wireframe") && /* @__PURE__ */ c("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ t(
          Ve,
          {
            icon: /* @__PURE__ */ t(Zi, {}),
            label: n("display_mode") || "样式",
            active: u === "displayMode",
            onClick: () => d("displayMode"),
            theme: r
          }
        ),
        _("displayMode", /* @__PURE__ */ c(ge, { children: [
          m(/* @__PURE__ */ t(ha, {}), n("dm_solid") || "着色", () => {
            e.handleDisplayModeChange?.("solid"), f();
          }),
          m(/* @__PURE__ */ t(pa, {}), n("dm_transparent") || "透明", () => {
            e.handleDisplayModeChange?.("transparent"), f();
          })
        ] }))
      ] }),
      !l("outline") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(jn, {}),
          label: n("tb_model") || "模型",
          active: e.showOutline,
          onClick: () => e.setShowOutline?.(!e.showOutline),
          theme: r
        }
      ),
      !l("props") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Wi, {}),
          label: n("tb_props") || "属性",
          active: e.showProps,
          onClick: () => e.setShowProps?.(!e.showProps),
          theme: r
        }
      ),
      !l("pick") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Gi, {}),
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
          icon: /* @__PURE__ */ t(Ti, {}),
          label: n("tb_measure") || "测量",
          active: e.activeTool === "measure",
          onClick: () => x("measure"),
          theme: r
        }
      ),
      !l("boxSelect") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ta, {}),
          label: n("tb_boxSelect") || "框选",
          active: e.activeTool === "boxSelect",
          onClick: () => x("boxSelect"),
          theme: r
        }
      ),
      !l("clip") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ri, {}),
          label: n("tb_clip") || "剖切",
          active: e.activeTool === "clip",
          onClick: () => x("clip"),
          theme: r
        }
      ),
      !l("viewpoint") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Xi, {}),
          label: n("tb_view") || "视点",
          active: e.activeTool === "viewpoint",
          onClick: () => x("viewpoint"),
          theme: r
        }
      ),
      !l("screenshot") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ji, {}),
          label: n("tb_screenshot") || "截图",
          active: e.activeTool === "screenshot",
          onClick: () => e.openScreenshotPanel?.(),
          theme: r
        }
      ),
      !l("search") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(qi, {}),
          label: n("tb_search") || "搜索",
          active: e.activeTool === "search",
          onClick: () => x("search"),
          theme: r
        }
      ),
      !l("clash") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Vi, {}),
          label: n("tb_clash") || "碰撞",
          active: e.activeTool === "clash",
          onClick: () => x("clash"),
          theme: r
        }
      ),
      !l("explode") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ea, {}),
          label: n("tb_explode") || "爆炸",
          active: e.activeTool === "explode",
          onClick: () => x("explode"),
          theme: r
        }
      )
    ] }),
    !l("about") && /* @__PURE__ */ c("div", { className: "ui-toolbar-group", children: [
      !l("settings") && /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(Ui, {}),
          label: n("tb_settings") || "设置",
          active: e.activeTool === "settings",
          onClick: () => x("settings"),
          theme: r
        }
      ),
      /* @__PURE__ */ t(
        Ve,
        {
          icon: /* @__PURE__ */ t(ji, {}),
          label: n("tb_about") || "关于",
          onClick: () => e.onOpenAbout?.(),
          theme: r
        }
      )
    ] })
  ] });
};
function qe(...e) {
  return e.filter(Boolean).join(" ");
}
function at(e, n, r) {
  return Math.max(n, Math.min(r, e));
}
function hn(e, n, r) {
  return r === n ? 0 : at((e - n) / (r - n) * 100, 0, 100);
}
function fa(e, n) {
  if (!Number.isFinite(n) || n <= 0) return e;
  const r = Math.round(e / n) * n, a = _a(n);
  return Number(r.toFixed(a));
}
function Hn(e, n, r, a = 1) {
  return at(fa(e, a), n, r);
}
function pn(e, n, r, a, i = 1) {
  const o = at((e - n.left) / n.width, 0, 1);
  return Hn(r + o * (a - r), r, a, i);
}
function _a(e) {
  const n = String(e);
  return n.includes(".") && n.split(".")[1]?.length || 0;
}
const Le = jt.forwardRef(({
  children: e,
  variant: n = "default",
  size: r = "md",
  active: a = !1,
  theme: i,
  className: o,
  type: h = "button",
  ...u
}, p) => /* @__PURE__ */ t(
  "button",
  {
    ref: p,
    type: h,
    className: qe("ui-btn", n === "primary" ? "ui-btn-primary" : n === "danger" ? "ui-btn-danger" : n === "ghost" ? "ui-btn-ghost" : "ui-btn-default", r === "sm" ? "ui-btn-sm" : r === "lg" ? "ui-btn-lg" : "ui-btn-md", a && "active", o),
    ...u,
    children: e
  }
));
Le.displayName = "Button";
function dt({
  value: e,
  options: n,
  onChange: r,
  className: a,
  style: i,
  disabled: o = !1,
  placeholder: h,
  searchable: u = !1,
  searchPlaceholder: p,
  emptyText: l = "暂无数据"
}) {
  const [d, f] = V(!1), [_, m] = V(""), b = se(null), x = Ee(
    () => n.find((N) => N.value === e),
    [n, e]
  ), s = Ee(() => {
    if (!u || !_.trim()) return n;
    const N = _.trim().toLocaleLowerCase();
    return n.filter(
      (y) => String(y.label ?? y.value).toLocaleLowerCase().includes(N) || String(y.value ?? "").toLocaleLowerCase().includes(N)
    );
  }, [n, u, _]);
  ce(() => {
    if (!d) return;
    const N = (P) => {
      b.current && !b.current.contains(P.target) && f(!1);
    }, y = (P) => {
      P.key === "Escape" && f(!1);
    };
    return document.addEventListener("mousedown", N), document.addEventListener("keydown", y), () => {
      document.removeEventListener("mousedown", N), document.removeEventListener("keydown", y);
    };
  }, [d]);
  const g = (N) => {
    N.disabled || (r(N.value), f(!1), m(""));
  };
  return /* @__PURE__ */ c("div", { ref: b, className: qe("ui-select-custom", d && "open", o && "disabled"), style: i, children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: qe("ui-select-selector", "ui-input", a),
        onClick: () => !o && f((N) => !N),
        disabled: o,
        "aria-haspopup": "listbox",
        "aria-expanded": d,
        children: [
          /* @__PURE__ */ t("span", { className: "ui-select-selection-item", children: x?.label ?? h ?? "" }),
          /* @__PURE__ */ t("span", { className: "ui-select-arrow", "aria-hidden": "true", children: /* @__PURE__ */ t("svg", { viewBox: "64 64 896 896", width: "12", height: "12", fill: "currentColor", children: /* @__PURE__ */ t("path", { d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" }) }) })
        ]
      }
    ),
    d && !o && /* @__PURE__ */ c("div", { className: "ui-select-dropdown", role: "listbox", children: [
      u && /* @__PURE__ */ t("div", { className: "ui-select-search-wrap", children: /* @__PURE__ */ t(
        "input",
        {
          className: "ui-input ui-input-compact ui-select-search-input",
          value: _,
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
          className: qe("ui-select-item", N.value === e && "selected", N.disabled && "disabled"),
          onClick: () => g(N),
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
const Ze = ({
  label: e,
  checked: n,
  onChange: r,
  disabled: a = !1,
  className: i,
  style: o,
  labelStyle: h,
  name: u,
  value: p
}) => {
  const l = () => {
    a || r(!n);
  };
  return /* @__PURE__ */ c("label", { className: qe("ui-checkbox", a && "ui-checkbox-disabled", i), style: o, children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "checkbox",
        name: u,
        value: p,
        checked: n,
        disabled: a,
        onChange: l,
        className: "ui-checkbox-native",
        "aria-hidden": "true",
        tabIndex: -1,
        style: { position: "absolute", opacity: 0, pointerEvents: "none" }
      }
    ),
    /* @__PURE__ */ t("span", { className: qe("ui-checkbox-box", n && "ui-checkbox-box-checked"), "aria-hidden": "true", children: n && /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: "ui-checkbox-icon", children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" }) }) }),
    e && /* @__PURE__ */ t("span", { className: "ui-checkbox-label", style: h, children: e })
  ] });
}, vt = ({
  min: e,
  max: n,
  step: r = 1,
  value: a,
  onChange: i,
  theme: o,
  disabled: h = !1,
  style: u,
  className: p
}) => {
  const l = se(null), d = Hn(a, e, n, r), f = hn(d, e, n), _ = U((b) => {
    if (!l.current) return;
    const x = l.current.getBoundingClientRect();
    i(pn(b, x, e, n, r));
  }, [e, n, r, i]), m = U((b) => {
    if (h) return;
    b.preventDefault(), _(b.clientX);
    const x = (g) => _(g.clientX), s = () => {
      document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", s);
    };
    document.addEventListener("mousemove", x), document.addEventListener("mouseup", s);
  }, [h, _]);
  return /* @__PURE__ */ c(
    "div",
    {
      ref: l,
      className: qe("ui-slider", "ui-slider-control", h ? "ui-slider-control-disabled" : "ui-slider-control-interactive", p),
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
        /* @__PURE__ */ t("div", { className: "ui-slider-progress", style: { width: `${f}%` } }),
        /* @__PURE__ */ t("div", { className: "ui-slider-thumb", style: { left: `${f}%`, cursor: h ? "not-allowed" : "default" } })
      ]
    }
  );
}, ga = ({
  min: e,
  max: n,
  value: r,
  onChange: a,
  theme: i,
  disabled: o = !1,
  style: h,
  className: u
}) => {
  const p = se(null), l = Ee(() => {
    const x = at(Math.min(r[0], r[1]), e, n), s = at(Math.max(r[0], r[1]), e, n);
    return [x, s];
  }, [r, e, n]), d = hn(l[0], e, n), f = hn(l[1], e, n), _ = U((x, s) => {
    if (!p.current) return;
    const g = p.current.getBoundingClientRect(), N = pn(s, g, e, n, 1);
    a(x === "start" ? [at(N, e, l[1] - 1), l[1]] : [l[0], at(N, l[0] + 1, n)]);
  }, [e, n, l, a]), m = U((x, s) => {
    if (o) return;
    s.preventDefault(), s.stopPropagation(), _(x, s.clientX);
    const g = (y) => _(x, y.clientX), N = () => {
      document.removeEventListener("mousemove", g), document.removeEventListener("mouseup", N);
    };
    document.addEventListener("mousemove", g), document.addEventListener("mouseup", N);
  }, [o, _]), b = U((x) => {
    if (o || !p.current) return;
    x.preventDefault(), x.stopPropagation();
    const s = p.current.getBoundingClientRect(), g = pn(x.clientX, s, e, n, 1), N = Math.abs(g - l[0]), y = Math.abs(g - l[1]);
    _(N <= y ? "start" : "end", x.clientX);
  }, [o, e, n, l, _]);
  return /* @__PURE__ */ c(
    "div",
    {
      ref: p,
      className: qe("ui-slider", "ui-dual-slider", o ? "ui-slider-control-disabled" : "ui-slider-control-interactive", u),
      style: h,
      onClick: b,
      role: "group",
      "aria-disabled": o,
      children: [
        /* @__PURE__ */ t("div", { className: "ui-slider-track" }),
        /* @__PURE__ */ t("div", { className: "ui-slider-progress", style: { left: `${d}%`, width: `${f - d}%` } }),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb ui-dual-slider-thumb ui-dual-slider-thumb-start",
            style: { left: `${d}%`, cursor: o ? "not-allowed" : "default" },
            onMouseDown: (x) => m("start", x)
          }
        ),
        /* @__PURE__ */ t(
          "div",
          {
            className: "ui-slider-thumb ui-dual-slider-thumb ui-dual-slider-thumb-end",
            style: { left: `${f}%`, cursor: o ? "not-allowed" : "default" },
            onMouseDown: (x) => m("end", x)
          }
        )
      ]
    }
  );
}, en = ({
  value: e,
  onChange: n,
  min: r = Number.NEGATIVE_INFINITY,
  max: a = Number.POSITIVE_INFINITY,
  step: i = 1,
  unit: o,
  className: h,
  style: u,
  disabled: p,
  ...l
}) => {
  const [d, f] = V(() => String(e));
  ce(() => {
    f(String(e));
  }, [e]);
  const _ = (b) => {
    if (b.trim() === "") {
      f(String(e));
      return;
    }
    const x = Number(b);
    if (!Number.isFinite(x)) {
      f(String(e));
      return;
    }
    const s = at(x, r, a);
    f(String(s)), s !== e && n(s);
  }, m = (b) => {
    const x = b.target.value;
    if (f(x), x.trim() === "") return;
    const s = Number(x);
    if (!Number.isFinite(s)) return;
    const g = at(s, r, a);
    g !== e && n(g);
  };
  return /* @__PURE__ */ c("div", { className: qe("ui-input-number", "ui-input-number-root", p && "disabled", h), style: u, children: [
    /* @__PURE__ */ t(
      "input",
      {
        type: "number",
        value: d,
        onChange: m,
        onBlur: () => _(d),
        min: Number.isFinite(r) ? r : void 0,
        max: Number.isFinite(a) ? a : void 0,
        step: i,
        disabled: p,
        className: qe("ui-input", "ui-input-number-input", o && "ui-input-number-input-with-unit"),
        ...l
      }
    ),
    o && /* @__PURE__ */ t("span", { className: "ui-input-number-unit", children: o })
  ] });
}, ht = jt.forwardRef(({
  checked: e,
  onChange: n,
  disabled: r = !1,
  className: a,
  type: i = "button",
  ...o
}, h) => /* @__PURE__ */ t(
  "button",
  {
    ref: h,
    type: i,
    className: qe("ui-switch", e && "active", r && "disabled", a),
    onClick: () => !r && n(!e),
    role: "switch",
    "aria-checked": e,
    disabled: r,
    ...o,
    children: /* @__PURE__ */ t("span", { className: "ui-switch-thumb" })
  }
));
ht.displayName = "Switch";
const Gn = ({
  prevTitle: e,
  nextTitle: n,
  currentPage: r,
  totalPages: a,
  onPrev: i,
  onNext: o,
  rightContent: h
}) => /* @__PURE__ */ c("div", { className: "ui-page-nav-wrap", children: [
  /* @__PURE__ */ c("div", { className: "ui-page-nav-group", children: [
    /* @__PURE__ */ t(
      Le,
      {
        variant: "ghost",
        className: "ui-page-nav-btn",
        onClick: i,
        disabled: r <= 1,
        title: e,
        "aria-label": e,
        children: /* @__PURE__ */ t(Bi, { size: 20, strokeWidth: 2.2 })
      }
    ),
    /* @__PURE__ */ c("span", { className: "ui-page-nav-indicator", children: [
      r,
      "/",
      a
    ] }),
    /* @__PURE__ */ t(
      Le,
      {
        variant: "ghost",
        className: "ui-page-nav-btn",
        onClick: o,
        disabled: r >= a,
        title: n,
        "aria-label": n,
        children: /* @__PURE__ */ t(_n, { size: 20, strokeWidth: 2.2 })
      }
    )
  ] }),
  h && /* @__PURE__ */ t("div", { className: "ui-page-nav-right", children: h })
] }), ya = ({
  value: e,
  onChange: n,
  showValue: r = !0,
  className: a = "",
  style: i
}) => /* @__PURE__ */ c("div", { className: qe("ui-color-picker", a), style: i, children: [
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
  className: a = ""
}) => /* @__PURE__ */ t("div", { className: `ui-segmented ${a}`, children: e.map((i) => /* @__PURE__ */ c(
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
)) }), yt = 8, yn = ({
  x: e,
  y: n,
  items: r,
  onClose: a,
  theme: i
}) => {
  const o = se(null), [h, u] = V({ left: e, top: n });
  Si(() => {
    const d = o.current;
    if (!d) return;
    const f = d.getBoundingClientRect(), _ = Math.min(
      Math.max(yt, e),
      Math.max(yt, window.innerWidth - f.width - yt)
    ), m = Math.min(
      Math.max(yt, n),
      Math.max(yt, window.innerHeight - f.height - yt)
    );
    u({ left: _, top: m });
  }, [e, n, r]), jt.useEffect(() => {
    const d = (_) => {
      o.current && !o.current.contains(_.target) && a();
    }, f = (_) => {
      _.key === "Escape" && a();
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", f);
    };
  }, [a]);
  const p = (d) => {
    d.disabled || !d.onClick || (d.onClick(), a());
  }, l = (d, f) => {
    d.key !== "Enter" && d.key !== " " || (d.preventDefault(), p(f));
  };
  return /* @__PURE__ */ t(
    "div",
    {
      ref: o,
      className: "ui-context-menu",
      style: { left: h.left, top: h.top },
      role: "menu",
      children: r.map((d, f) => {
        if (d.divider)
          return /* @__PURE__ */ t(
            "div",
            {
              className: "ui-context-menu-divider"
            },
            `divider_${f}`
          );
        if (d.slider) {
          const _ = d.value ?? 0;
          return /* @__PURE__ */ c(
            "div",
            {
              className: "ui-context-menu-item ui-context-menu-slider",
              children: [
                /* @__PURE__ */ c("div", { className: "ui-context-menu-slider-row", children: [
                  /* @__PURE__ */ t("span", { children: d.label }),
                  /* @__PURE__ */ c("span", { children: [
                    Math.round(_ * 100),
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
                    value: _,
                    onChange: (m) => d.onChange?.(parseFloat(m.target.value)),
                    className: "ui-context-menu-slider-input"
                  }
                )
              ]
            },
            `slider_${f}`
          );
        }
        return /* @__PURE__ */ t(
          "div",
          {
            role: "menuitem",
            tabIndex: d.disabled ? -1 : 0,
            "aria-disabled": d.disabled,
            onClick: () => p(d),
            onKeyDown: (_) => l(_, d),
            className: `ui-context-menu-item${d.disabled ? " disabled" : ""}`,
            children: d.label
          },
          `item_${f}`
        );
      })
    }
  );
}, ba = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]), va = (...e) => {
  for (const n of e) {
    if (n == null) continue;
    const r = String(n).trim();
    if (!ba.has(r.toLowerCase()))
      return r;
  }
  return "";
}, Wn = (e, n = [], r = []) => {
  if (!e) return n;
  for (let a = 0; a < e.length; a++) {
    const i = e[a];
    i.isLastChild = a === e.length - 1, i.parentIsLast = [...r], n.push(i), i.expanded && i.children && i.children.length > 0 && Wn(i.children, n, [...r, i.isLastChild]);
  }
  return n;
}, wa = (e) => {
  const n = /* @__PURE__ */ new Map(), r = (a) => {
    a.forEach((i) => {
      n.set(i.uuid, i.expanded), i.children.length > 0 && r(i.children);
    });
  };
  return r(e), n;
}, Kn = (e, n) => e.map((r) => ({
  ...r,
  expanded: n.get(r.uuid) ?? r.expanded,
  children: Kn(r.children, n)
})), bt = (e) => {
  const n = e?.object?.children ?? e?.children;
  return Array.isArray(n) ? n : [];
}, Rt = (e, n, r = !1) => {
  const a = Array.isArray(e?.children) ? e.children : [], i = e?.type === "Mesh" ? `Mesh_${e?.id ?? "?"}` : `Group_${e?.id ?? "?"}`;
  return {
    uuid: e?.id ?? e?.uuid ?? String(Math.random()),
    name: va(e?.name, e?.userData?.name) || i,
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
}, tn = (e) => e.childrenLoaded || !e.hasChildren ? e : {
  ...e,
  childrenLoaded: !0,
  children: bt(e).map((n) => Rt(n, e.depth + 1))
}, Xn = (e, n) => e ? e.id === n || e.uuid === n ? !0 : (Array.isArray(e.children) ? e.children : []).some((a) => Xn(a, n)) : !1, nn = (e) => {
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
}, xa = jt.memo(({
  node: e,
  isActive: n,
  isMatched: r,
  isLocated: a,
  searchQuery: i,
  clashBadge: o,
  onSelect: h,
  onToggleNode: u,
  onToggleVisibility: p,
  onContextMenu: l
}) => /* @__PURE__ */ c(
  "div",
  {
    className: `ui-tree-node ${n ? "selected" : ""} ${r ? "matched" : ""} ${a ? "located" : ""}`,
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
          children: e.hasChildren ? e.expanded ? /* @__PURE__ */ t(gn, { size: 12 }) : /* @__PURE__ */ t(_n, { size: 12 }) : null
        }
      ),
      /* @__PURE__ */ t(
        Ze,
        {
          checked: e.visible,
          onChange: (d) => p(e.uuid, d),
          style: { marginRight: 4, padding: 0, flexShrink: 0 }
        }
      ),
      /* @__PURE__ */ c("div", { className: "ui-tree-label", children: [
        i && e.name.toLowerCase().includes(i.toLowerCase()) ? /* @__PURE__ */ t("span", { children: e.name.split(new RegExp(`(${i})`, "gi")).map(
          (d, f) => d.toLowerCase() === i.toLowerCase() ? /* @__PURE__ */ t("span", { className: "ui-search-hit", children: d }, f) : d
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
), (e, n) => e.isActive === n.isActive && e.isMatched === n.isMatched && e.isLocated === n.isLocated && e.node === n.node && e.node.visible === n.node.visible && e.node.expanded === n.node.expanded && e.searchQuery === n.searchQuery && e.clashBadge?.label === n.clashBadge?.label), Ca = ({
  t: e,
  treeRoot: n,
  setTreeRoot: r,
  selectedUuid: a,
  locatedUuid: i,
  onSelect: o,
  onToggleVisibility: h,
  onDelete: u,
  onIsolate: p,
  onHide: l,
  onShowAll: d,
  onLocate: f,
  onClearLocate: _,
  onLocateResultsChange: m,
  locateResultUuids: b = [],
  clashSummaryByUuid: x = {}
}) => {
  const [s, g] = V(""), [N, y] = V(null), [P, Y] = V(0), [C, I] = V(400), B = se(null), S = se(null), k = se(null), M = se(""), [L, W] = V(null);
  ce(() => {
    if (!B.current) return;
    const z = new ResizeObserver((w) => {
      w.forEach((le) => I(le.contentRect.height));
    });
    return z.observe(B.current), () => z.disconnect();
  }, []), ce(() => {
    const z = M.current;
    if (!z && s && (k.current = wa(n)), z && !s && k.current) {
      const w = k.current;
      r((le) => Kn(le, w)), k.current = null;
    }
    M.current = s;
  }, [s, r, n]), ce(() => {
    L && S.current === "tree" && r((z) => {
      const w = (G) => {
        let X = !1;
        return [G.map((re) => {
          let te = re;
          if (re.uuid === L)
            return X = !0, re;
          !re.childrenLoaded && re.hasChildren && bt(re).some((ae) => Xn(ae, L)) && (te = tn(re));
          const [Ce, ke] = w(te.children);
          return ke && (X = !0), {
            ...te,
            expanded: ke ? !0 : te.expanded,
            children: Ce
          };
        }), X];
      }, [le, pe] = w(z);
      return pe ? le : z;
    });
  }, [L, r]);
  const $ = (z, w) => {
    const le = w.toLowerCase();
    return z.reduce((pe, G) => {
      const X = !w || nn(G).includes(le), he = w ? bt(G).map((Ce) => Rt(Ce, G.depth + 1)) : G.children, re = $(he, w);
      return (!w || X || re.length > 0) && pe.push({
        ...G,
        childrenLoaded: w ? !0 : G.childrenLoaded,
        hasChildren: G.hasChildren ?? bt(G).length > 0,
        expanded: w ? !0 : G.expanded,
        children: re
      }), pe;
    }, []);
  }, de = Ee(() => $(n, s), [n, s]), K = Ee(() => Wn(de), [de]), O = Ee(() => {
    if (!s) return null;
    const z = s.toLowerCase(), w = [...n];
    for (; w.length > 0; ) {
      const le = w.shift();
      if (nn(le).includes(z)) return le;
      bt(le).map((pe) => Rt(pe, (le.depth ?? 0) + 1)).forEach((pe) => w.push(pe));
    }
    return null;
  }, [s, n]), q = Ee(() => {
    if (!s.trim()) return [];
    const z = s.trim().toLowerCase(), w = [], le = [...n];
    for (; le.length > 0; ) {
      const pe = le.shift();
      nn(pe).includes(z) && w.push(pe), bt(pe).map((G) => Rt(G, (pe.depth ?? 0) + 1)).forEach((G) => le.push(G));
    }
    return w;
  }, [s, n]), F = 24, T = K.length * F, ue = Math.max(0, Math.floor(P / F)), A = Math.ceil(C / F), ee = Math.min(K.length, ue + A + 1), J = K.slice(ue, ee);
  ce(() => {
    S.current === "tree" && (S.current = null);
  }, [a]), ce(() => {
    const z = s.trim() ? q.map((w) => w.uuid) : [];
    m?.(z);
  }, [q, s, m]);
  const R = (z) => {
    const w = (le) => le.map((pe) => pe.uuid === z ? { ...tn(pe), expanded: !pe.expanded } : pe.children.length > 0 ? { ...pe, children: w(pe.children) } : pe);
    r((le) => w(le));
  }, H = () => {
    const z = (w) => w.map((le) => {
      const pe = tn(le);
      return {
        ...pe,
        expanded: pe.hasChildren,
        children: z(pe.children)
      };
    });
    r((w) => z(w));
  }, ne = () => {
    const z = (w) => w.map((le) => ({
      ...le,
      expanded: !1,
      children: z(le.children)
    }));
    r((w) => z(w));
  }, me = () => {
    O && f?.(O.object);
  }, Q = (z) => {
    const w = x[z];
    return w ? w.worstStatus === "new" ? {
      label: `${e("clash_group_new")} ${w.newCount}`,
      color: "var(--error)"
    } : w.worstStatus === "confirmed" ? {
      label: `${e("clash_group_confirmed")} ${w.confirmedCount}`,
      color: "var(--warning, #f59e0b)"
    } : {
      label: `${e("clash_group_resolved")} ${w.resolvedCount}`,
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
            onChange: (z) => g(z.target.value),
            onKeyDown: (z) => {
              z.key === "Enter" && (z.preventDefault(), me());
            },
            className: "ui-input ui-input-compact"
          }
        ),
        s && /* @__PURE__ */ t("button", { className: "ui-search-clear", onClick: () => g(""), children: /* @__PURE__ */ t(ut, { width: 14, height: 14 }) })
      ] }),
      s && /* @__PURE__ */ c("div", { className: "ui-tree-search-meta", children: [
        /* @__PURE__ */ c("span", { children: [
          e("search_results"),
          ": ",
          q.length
        ] }),
        /* @__PURE__ */ t(
          Le,
          {
            variant: "ghost",
            className: "ui-properties-action",
            onClick: me,
            disabled: !O,
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
        onScroll: (z) => Y(z.currentTarget.scrollTop),
        children: /* @__PURE__ */ t("div", { style: { height: T, position: "relative", minWidth: "max-content" }, children: /* @__PURE__ */ t("div", { style: { position: "absolute", top: ue * F, left: 0, right: 0, minWidth: "max-content" }, children: J.map((z) => /* @__PURE__ */ t(
          xa,
          {
            node: z,
            isActive: z.uuid === L,
            isMatched: b.includes(z.uuid),
            isLocated: z.uuid === i,
            searchQuery: s,
            clashBadge: Q(z.uuid),
            onSelect: (w) => {
              S.current = "tree", W(w.uuid), o(w.uuid, w.object);
            },
            onToggleNode: R,
            onToggleVisibility: h,
            onContextMenu: (w, le) => {
              w.preventDefault(), y({ x: w.clientX, y: w.clientY, node: le });
            }
          },
          z.uuid
        )) }) })
      }
    ),
    N && /* @__PURE__ */ t(
      yn,
      {
        x: N.x,
        y: N.y,
        onClose: () => y(null),
        items: [
          {
            label: e("locate_in_view"),
            onClick: () => f?.(N.node.object)
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
            onClick: ne
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
  width: a = 300,
  height: i,
  x: o = 100,
  y: h = 100,
  resizable: u = !1,
  movable: p = !0,
  storageId: l,
  modal: d = !1,
  autoHeight: f = i === void 0,
  closeLabel: _ = "Close"
}) => {
  const m = se(null), b = l === "tool_measure" ? 320 : l === "tool_search" ? 560 : 220, x = l === "tool_measure" ? 400 : l === "tool_search" ? 480 : 120, s = () => {
    if (d)
      return {
        x: Math.max(0, (window.innerWidth - a) / 2),
        y: Math.max(0, (window.innerHeight - (i ?? x)) / 2)
      };
    if (l)
      try {
        const F = localStorage.getItem(`panel_${l}`);
        if (F) {
          const T = JSON.parse(F);
          if (T.pos && typeof T.pos.x == "number" && typeof T.pos.y == "number")
            return {
              x: Math.min(Math.max(0, T.pos.x), window.innerWidth - 50),
              y: Math.min(Math.max(0, T.pos.y), window.innerHeight - 50)
            };
        }
      } catch {
      }
    return o === 100 && h === 100 && !l ? {
      x: Math.max(0, (window.innerWidth - a) / 2),
      y: Math.max(0, (window.innerHeight - (i ?? x)) / 2)
    } : { x: o, y: h };
  }, g = () => {
    if (l && u)
      try {
        const F = localStorage.getItem(`panel_${l}`);
        if (F) {
          const T = JSON.parse(F);
          if (T.size && typeof T.size.w == "number" && typeof T.size.h == "number")
            return {
              w: Math.max(b, T.size.w),
              h: Math.max(x, T.size.h)
            };
        }
      } catch {
      }
    return { w: a, h: i ?? x };
  }, N = se(s()), y = se(g()), P = se(!1), Y = se(!1), C = se(null), I = se({ x: 0, y: 0 }), B = se({ x: 0, y: 0 }), S = se({ w: 0, h: 0 }), k = U(() => {
    const F = m.current;
    if (!F) return;
    const T = N.current, ue = y.current;
    F.style.transform = `translate(${T.x}px, ${T.y}px)`, F.style.width = `${ue.w}px`, f || (F.style.height = `${ue.h}px`);
  }, [f]), M = U((F) => {
    if (!P.current && !Y.current) return;
    F.preventDefault();
    const T = F.clientX - I.current.x, ue = F.clientY - I.current.y, A = m.current;
    if (P.current) {
      let ee = window.innerWidth, J = window.innerHeight;
      A?.parentElement && (ee = A.parentElement.clientWidth, J = A.parentElement.clientHeight);
      const R = f && A?.offsetHeight || y.current.h, H = ee - y.current.w, ne = J - R;
      N.current = {
        x: Math.max(0, Math.min(B.current.x + T, H)),
        y: Math.max(0, Math.min(B.current.y + ue, ne))
      }, k();
    } else if (Y.current && C.current) {
      const ee = C.current;
      let J = S.current.w, R = S.current.h, H = B.current.x, ne = B.current.y;
      if (ee.includes("e") && (J = Math.max(b, S.current.w + T)), ee.includes("w")) {
        const me = S.current.w - b, Q = Math.min(T, me);
        J = S.current.w - Q, H = B.current.x + Q;
      }
      if (ee.includes("s") && (R = Math.max(x, S.current.h + ue)), ee.includes("n")) {
        const me = S.current.h - x, Q = Math.min(ue, me);
        R = S.current.h - Q, ne = B.current.y + Q;
      }
      y.current = { w: J, h: R }, (ee.includes("w") || ee.includes("n")) && (N.current = { x: H, y: ne }), k();
    }
  }, [b, x, f, k]), L = U(() => {
    if ((P.current || Y.current) && l)
      try {
        localStorage.setItem(`panel_${l}`, JSON.stringify({
          pos: N.current,
          size: y.current
        }));
      } catch {
      }
    P.current = !1, Y.current = !1, C.current = null, document.body.style.cursor = "";
  }, [l]);
  ce(() => (document.addEventListener("mousemove", M), document.addEventListener("mouseup", L), () => {
    document.removeEventListener("mousemove", M), document.removeEventListener("mouseup", L);
  }), [M, L]), ce(() => {
    if (!d) return;
    const F = () => {
      const T = f ? Math.min(window.innerHeight - 64, m.current?.offsetHeight || y.current.h) : y.current.h;
      N.current = {
        x: Math.max(0, (window.innerWidth - y.current.w) / 2),
        y: Math.max(0, (window.innerHeight - T) / 2)
      }, k();
    };
    return window.addEventListener("resize", F), F(), () => window.removeEventListener("resize", F);
  }, [f, d, k]);
  const W = (F) => {
    d || F.button !== 0 || !p || (F.preventDefault(), F.stopPropagation(), P.current = !0, I.current = { x: F.clientX, y: F.clientY }, B.current = { ...N.current }, document.body.style.cursor = "grabbing");
  }, $ = (F) => (T) => {
    if (d || T.button !== 0 || !u) return;
    T.preventDefault(), T.stopPropagation(), Y.current = !0, C.current = F, I.current = { x: T.clientX, y: T.clientY }, S.current = { ...y.current }, B.current = { ...N.current };
    const ue = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    };
    document.body.style.cursor = ue[F];
  }, de = (F) => {
    F.stopPropagation(), n?.();
  }, K = N.current, O = y.current, q = typeof window < "u" ? Math.max(x, Math.min(O.h, window.innerHeight - 64)) : O.h;
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
        className: `ui-panel${d ? " ui-panel-modal" : ""}`,
        style: {
          position: d ? "fixed" : "absolute",
          left: 0,
          top: 0,
          transform: `translate(${K.x}px, ${K.y}px)`,
          width: O.w,
          height: f ? "auto" : q,
          maxHeight: "calc(100vh - 64px)",
          zIndex: d ? 2e3 : 200,
          willChange: P.current || Y.current ? "transform, width, height" : "auto"
        },
        children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `ui-panel-header ${!p || d ? "ui-panel-header-static" : ""}`,
              onMouseDown: W,
              children: [
                /* @__PURE__ */ t("span", { className: "ui-panel-title", children: e }),
                n && /* @__PURE__ */ t(
                  "button",
                  {
                    className: "ui-panel-close",
                    onClick: de,
                    title: _,
                    children: /* @__PURE__ */ t(ut, { width: 14, height: 14 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ t("div", { className: "ui-panel-content", children: r }),
          u && !d && /* @__PURE__ */ c(ge, { children: [
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-e", onMouseDown: $("e") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-s", onMouseDown: $("s") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-w", onMouseDown: $("w") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-se", onMouseDown: $("se") }),
            /* @__PURE__ */ t("div", { className: "ui-panel-resize-handle ui-panel-resize-sw", onMouseDown: $("sw") })
          ] })
        ]
      }
    )
  ] });
}, Je = ({ label: e, children: n, labelWidth: r = "80px", stretch: a = !1 }) => /* @__PURE__ */ c(
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
), Na = ({
  t: e,
  onClose: n,
  settings: r,
  onUpdate: a,
  currentLang: i,
  setLang: o,
  showStats: h,
  setShowStats: u,
  theme: p
}) => {
  const [l, d] = V("general"), f = [
    { value: "general", label: e("setting_general") || "通用" },
    { value: "lighting", label: e("st_lighting") || "光照" },
    { value: "viewport", label: e("st_viewport") || "视口" },
    { value: "highlight", label: e("st_highlight") || "高亮" }
  ];
  return /* @__PURE__ */ t(
    et,
    {
      title: e("settings"),
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 400,
      height: 400,
      modal: !0,
      movable: !1,
      theme: p,
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-settings-panel-body", children: [
        /* @__PURE__ */ t("div", { className: "ui-toolpanel-sticky-tabs", children: /* @__PURE__ */ t(
          Tt,
          {
            options: f,
            value: l,
            onChange: (_) => d(_)
          }
        ) }),
        l === "general" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Je, { label: e("st_lang"), labelWidth: "70px", stretch: !0, children: /* @__PURE__ */ t(
            dt,
            {
              value: i,
              options: [
                { value: "zh", label: "简体中文" },
                { value: "en", label: "English" }
              ],
              onChange: (_) => o(_)
            }
          ) }),
          /* @__PURE__ */ t(Je, { label: e("st_monitor"), labelWidth: "82px", children: /* @__PURE__ */ t(
            ht,
            {
              checked: h,
              onChange: (_) => u(_)
            }
          ) }),
          /* @__PURE__ */ t(Je, { label: e("st_locate_mode") || "定位方式", labelWidth: "82px", stretch: !0, children: /* @__PURE__ */ t(
            Tt,
            {
              options: [
                { value: "normal", label: e("st_locate_mode_normal") || "普通定位" },
                { value: "isolate", label: e("st_locate_mode_isolate") || "隔离定位" }
              ],
              value: r.locateIsolateMode === !0 ? "isolate" : "normal",
              onChange: (_) => a({ locateIsolateMode: _ === "isolate" })
            }
          ) }),
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted ui-settings-hint", children: r.locateIsolateMode === !0 ? e("st_locate_mode_isolate_hint") || "定位时临时隐藏其他对象，大模型恢复时可能较慢。" : e("st_locate_mode_normal_hint") || "只移动视图并高亮对象，速度最快。" })
        ] }),
        l === "lighting" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Je, { label: e("st_ambient") || "环境光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: r.ambientInt || 0,
                onChange: (_) => a({ ambientInt: _ })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.ambientInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(Je, { label: e("st_dir") || "主光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: r.dirInt || 0,
                onChange: (_) => a({ dirInt: _ })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.dirInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ t(Je, { label: e("st_back") || "背光", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 0,
                max: 2,
                step: 0.05,
                value: r.backLightInt ?? 0.5,
                onChange: (_) => a({ backLightInt: _ })
              }
            ) }),
            /* @__PURE__ */ t("div", { className: "ui-result-item-secondary-value", children: (r.backLightInt ?? 0.5).toFixed(2) })
          ] }) })
        ] }),
        l === "viewport" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Je, { label: e("st_viewcube_size"), labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
              vt,
              {
                min: 120,
                max: 180,
                step: 5,
                value: r.viewCubeSize || 120,
                onChange: (_) => a({ viewCubeSize: _ })
              }
            ) }),
            /* @__PURE__ */ c("div", { className: "ui-result-item-secondary-value ui-result-item-secondary-value-wide", children: [
              r.viewCubeSize || 120,
              "px"
            ] })
          ] }) }),
          /* @__PURE__ */ t(Je, { label: e("st_adaptive_quality") || "Adaptive", labelWidth: "90px", children: /* @__PURE__ */ t(
            ht,
            {
              checked: r.adaptiveQuality !== !1,
              onChange: (_) => a({ adaptiveQuality: _ })
            }
          ) }),
          /* @__PURE__ */ t(Je, { label: e("st_performance_profile") || "性能策略", labelWidth: "90px", children: /* @__PURE__ */ t("div", { className: "ui-inline-actions ui-inline-actions-end", children: /* @__PURE__ */ t(
            Tt,
            {
              options: [
                { value: "smooth", label: e("st_perf_smooth") || "流畅优先" },
                { value: "balanced", label: e("st_perf_balanced") || "平衡" },
                { value: "quality", label: e("st_perf_quality") || "画质优先" }
              ],
              value: r.performanceMode || "balanced",
              onChange: (_) => a({ performanceMode: _ })
            }
          ) }) })
        ] }),
        l === "highlight" && /* @__PURE__ */ c("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ t(Je, { label: e("st_highlight_color") || "高亮颜色", labelWidth: "90px", stretch: !0, children: /* @__PURE__ */ t(
            ya,
            {
              value: r.highlightColor || "#ff9f1c",
              onChange: (_) => a({ highlightColor: _ })
            }
          ) }),
          /* @__PURE__ */ t(Je, { label: e("st_highlight_box") || "高亮/定位包围盒", labelWidth: "110px", children: /* @__PURE__ */ t(
            ht,
            {
              checked: r.highlightShowBox === !0,
              onChange: (_) => a({ highlightShowBox: _ })
            }
          ) }),
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted ui-settings-hint", children: e("st_highlight_box_hint") || "开启后，高亮和定位都会显示包围盒；关闭后只保留颜色高亮和视图定位。" })
        ] })
      ] })
    }
  );
}, Yn = {
  Trash: () => /* @__PURE__ */ t("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Close: () => /* @__PURE__ */ t("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ t("path", { d: "M2 2L12 12M12 2L2 12", strokeLinecap: "round" }) })
}, Sa = ({ onClick: e, disabled: n }) => /* @__PURE__ */ t(
  Le,
  {
    onClick: e,
    disabled: n,
    variant: "ghost",
    size: "sm",
    className: "ui-btn-icon",
    title: "Clear All",
    children: /* @__PURE__ */ t(Yn.Trash, {})
  }
), ka = ({ children: e, empty: n, emptyText: r }) => /* @__PURE__ */ t("div", { className: "ui-data-panel ui-measure-results", children: n ? /* @__PURE__ */ t("div", { className: "ui-measure-empty", children: r }) : e }), Ma = ({ item: e, isHighlighted: n, onHighlight: r, onDelete: a }) => /* @__PURE__ */ c(
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
          className: "ui-btn ui-btn-icon-sm ui-btn-ghost ui-measure-item-delete",
          children: /* @__PURE__ */ t(Yn.Close, {})
        }
      )
    ]
  }
), La = ({ label: e }) => /* @__PURE__ */ t("div", { className: "ui-group-title", children: e }), Ea = ({
  t: e,
  sceneMgr: n,
  measureType: r,
  setMeasureType: a,
  measureHistory: i,
  onDelete: o,
  onClear: h,
  onClose: u,
  highlightedId: p,
  onHighlight: l
}) => {
  const d = Ee(() => {
    const b = {
      dist: [],
      angle: [],
      coord: []
    };
    return i.forEach((x) => {
      b[x.type] && b[x.type].push(x);
    }), b;
  }, [i]), f = (b) => {
    a(b), n?.startMeasurement(b);
  }, _ = () => {
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
  }, m = (b) => {
    switch (b) {
      case "dist":
        return e("measure_dist") || "Distance";
      case "angle":
        return e("measure_angle") || "Angle";
      case "coord":
        return e("measure_coord") || "Coordinate";
      default:
        return b;
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
                onClick: () => f("none"),
                children: /* @__PURE__ */ t("span", { children: e("measure_none") || "None" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "dist" ? "active" : ""}`,
                onClick: () => f("dist"),
                children: /* @__PURE__ */ t("span", { children: e("measure_dist") || "Distance" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "angle" ? "active" : ""}`,
                onClick: () => f("angle"),
                children: /* @__PURE__ */ t("span", { children: e("measure_angle") || "Angle" })
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                className: `ui-segmented-item ${r === "coord" ? "active" : ""}`,
                onClick: () => f("coord"),
                children: /* @__PURE__ */ t("span", { children: e("measure_coord") || "Coord" })
              }
            )
          ] }),
          /* @__PURE__ */ t(Sa, { onClick: h, disabled: i.length === 0 })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ t("span", { children: _() }),
          r !== "none" && /* @__PURE__ */ t("span", { className: "ui-toolpanel-caption-muted", children: "[ESC] Exit" })
        ] }),
        /* @__PURE__ */ t(ka, { empty: i.length === 0, emptyText: e("no_measurements") || "No measurements", children: i.length > 0 && /* @__PURE__ */ t("div", { className: "ui-measure-results-scroll", children: Object.entries(d).map(([b, x]) => x.length === 0 ? null : /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ t(La, { label: m(b) }),
          x.map((s) => /* @__PURE__ */ t(
            Ma,
            {
              item: s,
              isHighlighted: p === s.id,
              onHighlight: () => l?.(s.id),
              onDelete: () => o(s.id)
            },
            s.id
          ))
        ] }, b)) }) })
      ] })
    }
  );
}, rn = ({ axis: e, label: n, active: r, value: a, onToggle: i, onChange: o, disabled: h = !1 }) => /* @__PURE__ */ c(
  "div",
  {
    className: `ui-clip-axis-row${h ? " ui-is-disabled" : ""}`,
    children: [
      /* @__PURE__ */ t(
        Ze,
        {
          checked: r,
          onChange: (u) => i(u),
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
        ga,
        {
          min: 0,
          max: 100,
          value: a,
          onChange: o,
          disabled: h || !r
        }
      ) }),
      /* @__PURE__ */ c(
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
), Ia = ({
  t: e,
  onClose: n,
  clipEnabled: r,
  setClipEnabled: a,
  clipValues: i,
  setClipValues: o,
  clipActive: h,
  setClipActive: u,
  clipHelperVisible: p,
  setClipHelperVisible: l,
  clipHelperOpacity: d,
  setClipHelperOpacity: f
}) => {
  const _ = () => {
    o({ x: [0, 100], y: [0, 100], z: [0, 100] });
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: e("clip_title"),
      closeLabel: e("panel_close") || "关闭",
      onClose: n,
      width: 340,
      height: 420,
      resizable: !0,
      storageId: "tool_clip",
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-clip-panel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-panel-section ui-clip-panel-section", children: [
          /* @__PURE__ */ c("div", { className: "ui-form-row ui-clip-form-row", children: [
            /* @__PURE__ */ t("span", { className: "ui-form-label", children: e("clip_enable") }),
            /* @__PURE__ */ t("div", { className: "ui-form-value", children: /* @__PURE__ */ t(ht, { checked: r, onChange: (m) => a(m) }) })
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
                  onChange: (m) => f(m),
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
                rn,
                {
                  axis: "x",
                  label: e("clip_x"),
                  active: h.x,
                  value: i.x,
                  onToggle: (m) => u({ ...h, x: m }),
                  onChange: (m) => o({ ...i, x: m }),
                  disabled: !r
                }
              ),
              /* @__PURE__ */ t(
                rn,
                {
                  axis: "y",
                  label: e("clip_y"),
                  active: h.y,
                  value: i.y,
                  onToggle: (m) => u({ ...h, y: m }),
                  onChange: (m) => o({ ...i, y: m }),
                  disabled: !r
                }
              ),
              /* @__PURE__ */ t(
                rn,
                {
                  axis: "z",
                  label: e("clip_z"),
                  active: h.z,
                  value: i.z,
                  onToggle: (m) => u({ ...h, z: m }),
                  onChange: (m) => o({ ...i, z: m }),
                  disabled: !r
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ t("div", { className: "ui-panel-footer ui-clip-panel-footer", children: /* @__PURE__ */ t(Le, { variant: "default", onClick: _, disabled: !r, children: e("clip_reset") || "重置范围" }) })
      ] })
    }
  );
}, Da = ({ t: e, onClose: n, onExport: r, getDefaultFileName: a, theme: i }) => {
  const [o, h] = V("glb"), [u, p] = V(() => a("glb"));
  return ce(() => {
    p(a(o));
  }, [o, a]), /* @__PURE__ */ t(et, { title: e("export_title"), closeLabel: e("panel_close") || "关闭", onClose: n, width: 360, height: 520, resizable: !0, theme: i, storageId: "tool_export", children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body", children: [
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
      Le,
      {
        theme: i,
        onClick: () => r(o, u),
        className: "ui-toolpanel-submit",
        children: e("export_btn")
      }
    )
  ] }) });
}, Aa = ({ t: e, onClose: n, onCapture: r, theme: a }) => {
  const [i, o] = V("scene"), h = [
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
      width: 360,
      height: 340,
      resizable: !0,
      theme: a,
      storageId: "tool_screenshot",
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-caption", children: [
          e("screenshot_mode") || "截图方式",
          ":"
        ] }),
        h.map((u) => /* @__PURE__ */ c("label", { className: `ui-choice-card ${i === u.id ? "active" : ""}`, children: [
          /* @__PURE__ */ t(
            "input",
            {
              type: "radio",
              name: "screenshotMode",
              checked: i === u.id,
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
          Le,
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
}, za = {
  visibility: !0,
  selection: !0,
  clip: !0,
  explode: !0
}, Ba = ({
  t: e,
  onClose: n,
  viewpoints: r,
  onSave: a,
  onUpdateName: i,
  onLoad: o,
  onDelete: h,
  theme: u
}) => {
  const [p, l] = V(""), [d, f] = V({}), [_, m] = V(za);
  ce(() => {
    l(`${e("viewpoint_title") || "视点"} ${r.length + 1}`);
  }, [r.length, e]), ce(() => {
    f(
      r.reduce((s, g) => (s[g.id] = g.name, s), {})
    );
  }, [r]);
  const b = () => {
    const s = p.trim();
    s && (a(s, _), l(`${e("viewpoint_title") || "视点"} ${r.length + 1}`));
  }, x = (s) => {
    const g = (d[s] || "").trim();
    if (!g) {
      f((N) => ({
        ...N,
        [s]: r.find((y) => y.id === s)?.name || ""
      }));
      return;
    }
    i(s, g);
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
                s.key === "Enter" && b();
              },
              className: "ui-input",
              placeholder: e("viewpoint_title") || "视点名称"
            }
          ),
          /* @__PURE__ */ t(Le, { variant: "primary", onClick: b, children: e("btn_confirm") || "保存" })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-viewpoint-options", children: [
          /* @__PURE__ */ t(
            Ze,
            {
              label: e("viewpoint_save_visibility") || "保存可见性",
              checked: _.visibility,
              onChange: (s) => m((g) => ({ ...g, visibility: s }))
            }
          ),
          /* @__PURE__ */ t(
            Ze,
            {
              label: e("viewpoint_save_selection") || "保存选择",
              checked: _.selection,
              onChange: (s) => m((g) => ({ ...g, selection: s }))
            }
          ),
          /* @__PURE__ */ t(
            Ze,
            {
              label: e("viewpoint_save_clip") || "保存剖切",
              checked: _.clip,
              onChange: (s) => m((g) => ({ ...g, clip: s }))
            }
          ),
          /* @__PURE__ */ t(
            Ze,
            {
              label: e("viewpoint_save_explode") || "保存爆炸图",
              checked: _.explode,
              onChange: (s) => m((g) => ({ ...g, explode: s }))
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
                    onClick: (g) => {
                      g.stopPropagation(), h(s.id);
                    },
                    title: e("delete_item") || "删除",
                    children: /* @__PURE__ */ t(Hi, { size: 12 })
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
              onChange: (g) => f((N) => ({
                ...N,
                [s.id]: g.target.value
              })),
              onBlur: () => x(s.id),
              onKeyDown: (g) => {
                g.key === "Enter" && g.currentTarget.blur();
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
}, an = ({ label: e, children: n, stretch: r = !1 }) => /* @__PURE__ */ c(
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
), Fa = ({
  t: e,
  onClose: n,
  enabled: r,
  strength: a,
  mode: i,
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
      /* @__PURE__ */ t(an, { label: e("explode_enable") || "启用", children: /* @__PURE__ */ t(ht, { checked: r, onChange: o }) }),
      /* @__PURE__ */ t(an, { label: e("explode_strength") || "强度", stretch: !0, children: /* @__PURE__ */ c("div", { className: "ui-slider-field", children: [
        /* @__PURE__ */ t("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ t(
          vt,
          {
            min: 0,
            max: 100,
            step: 1,
            value: a,
            onChange: h
          }
        ) }),
        /* @__PURE__ */ c("div", { className: "ui-slider-value ui-slider-value-strong", children: [
          a,
          "%"
        ] })
      ] }) }),
      /* @__PURE__ */ t(an, { label: e("explode_mode") || "方向", stretch: !0, children: /* @__PURE__ */ t(
        Tt,
        {
          options: [
            { value: "radial", label: e("explode_mode_radial") || "四周" },
            { value: "horizontal", label: e("explode_mode_horizontal") || "横向" },
            { value: "vertical", label: e("explode_mode_vertical") || "纵向" }
          ],
          value: i,
          onChange: (d) => u(d)
        }
      ) }),
      /* @__PURE__ */ t("div", { className: "ui-panel-footer ui-panel-footer-spaced", children: /* @__PURE__ */ t(Le, { className: "ui-properties-action", onClick: p, children: e("explode_reset") || "重置" }) })
    ] })
  }
), Va = [
  { value: "equals", labelKey: "search_op_equals", fallback: "等于" },
  { value: "contains", labelKey: "search_op_contains", fallback: "包含" },
  {
    value: "notContains",
    labelKey: "search_op_not_contains",
    fallback: "不包含"
  },
  { value: "startsWith", labelKey: "search_op_starts_with", fallback: "开头" },
  { value: "endsWith", labelKey: "search_op_ends_with", fallback: "结尾" }
], Pa = [
  { value: "AND", labelKey: "search_connector_and", fallback: "且" },
  { value: "OR", labelKey: "search_connector_or", fallback: "或" }
], $a = ({
  t: e,
  onClose: n,
  conditions: r,
  results: a,
  searching: i,
  searchProgress: o,
  searchStatus: h,
  propertyFieldOptions: u,
  onConditionsChange: p,
  onSearch: l,
  onCancelSearch: d,
  onApplyResultHighlight: f,
  onClearResult: _,
  theme: m
}) => {
  const [b, x] = V(1), [s, g] = V(10);
  ce(() => {
    x(1);
  }, [a.length, s]);
  const N = Math.max(1, Math.ceil(a.length / s)), y = Math.min(b, N), P = (y - 1) * s, Y = Ee(
    () => a.slice(P, P + s),
    [a, P, s]
  ), C = (S, k) => {
    p(
      r.map((M) => M.id === S ? { ...M, ...k } : M)
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
    const k = r.filter((M) => M.id !== S);
    p(
      k.length > 0 ? k : [
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
      width: 680,
      height: 560,
      resizable: !0,
      storageId: "tool_search",
      autoHeight: !1,
      theme: m,
      children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-body ui-search-panel-body", children: [
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between", children: [
          /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption", children: e("search_conditions") || "搜索条件" }),
          /* @__PURE__ */ c("div", { className: "ui-toolpanel-row", children: [
            /* @__PURE__ */ t(Le, { className: "ui-properties-action", onClick: I, children: e("search_add_condition") || "添加条件" }),
            /* @__PURE__ */ t(
              Le,
              {
                className: "ui-properties-action",
                onClick: l,
                disabled: i,
                children: i ? e("searching") || "搜索中..." : e("search_run") || "搜索"
              }
            )
          ] })
        ] }),
        r.map((S, k) => /* @__PURE__ */ c("div", { className: "ui-search-condition-row", children: [
          /* @__PURE__ */ t("div", { className: "ui-search-condition-connector-cell", children: k > 0 && /* @__PURE__ */ t(
            dt,
            {
              value: S.connector || "AND",
              options: Pa.map((M) => ({
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
              options: Va.map((M) => ({
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
          /* @__PURE__ */ t("div", { className: "ui-search-condition-action-cell", children: k > 0 && /* @__PURE__ */ t(
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
          a.length
        ] }) }),
        /* @__PURE__ */ c("div", { className: "ui-toolpanel-results-box ui-search-results-box", children: [
          /* @__PURE__ */ c("div", { className: "ui-search-hint-strip", children: [
            e("search_fields_total") || "可搜索属性",
            ": ",
            u.length
          ] }),
          a.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: e("search_no_results") || "暂无结果" }) : Y.map((S) => /* @__PURE__ */ t(
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
                  onClick: () => f(S.uuid),
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
          Gn,
          {
            prevTitle: e("search_page_prev") || "上一页",
            nextTitle: e("search_page_next") || "下一页",
            currentPage: y,
            totalPages: N,
            onPrev: () => x((S) => Math.max(1, S - 1)),
            onNext: () => x((S) => Math.min(N, S + 1)),
            rightContent: /* @__PURE__ */ c("div", { className: "ui-search-page-actions", children: [
              /* @__PURE__ */ t(
                dt,
                {
                  value: String(s),
                  onChange: (S) => g(Number(S) || 10),
                  options: [
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" }
                  ],
                  className: "ui-input-compact ui-search-page-size"
                }
              ),
              /* @__PURE__ */ t(
                Le,
                {
                  className: "ui-properties-action",
                  onClick: _,
                  disabled: a.length === 0,
                  children: e("search_clear") || "清除结果"
                }
              )
            ] })
          }
        ) }),
        i && /* @__PURE__ */ t("div", { className: "ui-toolpanel-overlay", children: /* @__PURE__ */ c("div", { className: "ui-toolpanel-overlay-card", children: [
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
              Le,
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
}, Oa = (e) => (n, r) => {
  const a = e(n);
  return a && a !== n ? a : r;
}, Vn = ({ title: e, summary: n, expanded: r, onToggle: a }) => /* @__PURE__ */ c("button", { type: "button", className: "ui-clash-section-toggle", onClick: a, children: [
  /* @__PURE__ */ c("span", { className: "ui-clash-section-title-wrap", children: [
    /* @__PURE__ */ t("span", { className: `ui-clash-section-arrow${r ? " expanded" : ""}`, children: "›" }),
    /* @__PURE__ */ t("span", { className: "ui-clash-section-title", children: e })
  ] }),
  n && /* @__PURE__ */ t("span", { className: "ui-clash-section-summary", children: n })
] }), on = ({ label: e, children: n }) => /* @__PURE__ */ c("label", { className: "ui-clash-field", children: [
  /* @__PURE__ */ t("span", { className: "ui-clash-field-label", children: e }),
  /* @__PURE__ */ t("span", { className: "ui-clash-field-control", children: n })
] }), sn = (e) => Number.isFinite(e) ? Math.abs(e) >= 1e6 ? `${(e / 1e6).toFixed(1)}M` : Math.abs(e) >= 1e3 ? `${(e / 1e3).toFixed(1)}K` : String(e) : "0", Ta = (e, n) => n === "high" ? e("clash_severity_high", "高") : n === "medium" ? e("clash_severity_medium", "中") : e("clash_severity_low", "低"), Ra = (e, n) => n === "hard" ? e("clash_type_hard", "硬碰撞") : e("clash_type_clearance", "净空碰撞"), Ua = ({
  t: e,
  onClose: n,
  running: r,
  progress: a,
  status: i,
  scannedCount: o,
  pairsScanned: h,
  results: u,
  modelOptions: p,
  setA: l,
  setB: d,
  tolerance: f,
  minOverlapVolume: _,
  clearanceDistance: m,
  useNarrowPhase: b,
  useTrianglePhase: x,
  includeSameModel: s,
  onSetAChange: g,
  onSetBChange: N,
  onToleranceChange: y,
  onMinOverlapVolumeChange: P,
  onClearanceDistanceChange: Y,
  onUseNarrowPhaseChange: C,
  onUseTrianglePhaseChange: I,
  onIncludeSameModelChange: B,
  onRun: S,
  onCancel: k,
  onClear: M,
  onExportCsv: L,
  onRestoreVisibility: W,
  typeFilter: $,
  onTypeFilterChange: de,
  onSetASelectAll: K,
  onSetAClear: O,
  onSetBSelectAll: q,
  onSetBClear: F,
  onFocusResult: T,
  theme: ue
}) => {
  const A = Oa(e), [ee, J] = V(1), [R, H] = V(10), [ne, me] = V(!1), [Q, z] = V(!1);
  ce(() => {
    J(1);
  }, [u.length, R, $]);
  const w = Ee(() => $ === "HARD" ? u.filter((D) => D.type === "hard") : $ === "CLEARANCE" ? u.filter((D) => D.type === "clearance") : u, [u, $]), le = Math.max(1, Math.ceil(w.length / R)), pe = Math.min(ee, le), G = (pe - 1) * R, X = Ee(
    () => w.slice(G, G + R),
    [w, G, R]
  ), he = Ee(() => new Set(l), [l]), re = Ee(() => new Set(d), [d]), te = Math.max(0, Math.min(100, Number.isFinite(a) ? a : 0)), Ce = i || (r ? A("clash_running", "正在执行碰撞检查...") : A("clash_ready", "准备就绪")), ke = `${A("clash_set_a", "模型集 A")} ${l.length} · ${A("clash_set_b", "模型集 B")} ${d.length}`, Ge = `${w.length} ${A("clash_results", "碰撞结果")}`, j = `${A("clash_tolerance", "容差")} ${f} · ${A("clash_clearance_distance", "净空")} ${m}`, ae = (D, _e, be) => {
    const oe = new Set(D);
    oe.has(_e) ? oe.delete(_e) : oe.add(_e), be(Array.from(oe));
  };
  return /* @__PURE__ */ t(
    et,
    {
      title: A("tb_clash", "碰撞"),
      closeLabel: A("panel_close", "关闭"),
      onClose: n,
      width: 560,
      height: 560,
      resizable: !0,
      storageId: "tool_clash",
      autoHeight: !1,
      theme: ue,
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
                  A("clash_candidates", "候选"),
                  " ",
                  /* @__PURE__ */ t("b", { children: sn(o) })
                ] }),
                /* @__PURE__ */ c("span", { children: [
                  A("clash_pairs_scanned", "已扫描"),
                  " ",
                  /* @__PURE__ */ t("b", { children: sn(h) })
                ] }),
                /* @__PURE__ */ c("span", { children: [
                  A("clash_results", "结果"),
                  " ",
                  /* @__PURE__ */ t("b", { children: sn(u.length) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "ui-clash-actions-row", children: [
              r ? /* @__PURE__ */ t(Le, { className: "ui-properties-action", onClick: k, children: A("search_cancel", "取消") }) : /* @__PURE__ */ t(Le, { className: "ui-properties-action", onClick: S, variant: "primary", children: A("clash_run", "开始检查") }),
              /* @__PURE__ */ t(Le, { className: "ui-properties-action", onClick: M, children: A("clash_clear", "清空结果") }),
              /* @__PURE__ */ t(Le, { className: "ui-properties-action", onClick: L, disabled: u.length === 0, children: A("clash_export_csv", "导出 CSV") })
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-clash-section", children: [
            /* @__PURE__ */ t(
              Vn,
              {
                title: A("clash_scope_visible", "检测范围"),
                summary: ke,
                expanded: ne,
                onToggle: () => me((D) => !D)
              }
            ),
            ne && /* @__PURE__ */ c("div", { className: "ui-clash-section-content ui-clash-scope-grid", children: [
              /* @__PURE__ */ c("div", { className: "ui-selection-box", children: [
                /* @__PURE__ */ c("div", { className: "ui-selection-box-header", children: [
                  /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: A("clash_set_a", "模型集 A") }),
                  /* @__PURE__ */ c("div", { className: "ui-selection-box-actions", children: [
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: K, children: A("select_all", "全选") }),
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: O, children: A("search_clear", "清空") })
                  ] })
                ] }),
                /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: p.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: A("clash_no_models", "暂无模型") }) : p.map((D) => /* @__PURE__ */ t(
                  Ze,
                  {
                    checked: he.has(D.id),
                    onChange: () => ae(l, D.id, g),
                    label: D.name,
                    labelStyle: { fontSize: 12 }
                  },
                  `a_${D.id}`
                )) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-selection-box", children: [
                /* @__PURE__ */ c("div", { className: "ui-selection-box-header", children: [
                  /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption-strong", children: A("clash_set_b", "模型集 B") }),
                  /* @__PURE__ */ c("div", { className: "ui-selection-box-actions", children: [
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: q, children: A("select_all", "全选") }),
                    /* @__PURE__ */ t("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: F, children: A("search_clear", "清空") })
                  ] })
                ] }),
                /* @__PURE__ */ t("div", { className: "ui-selection-box-list ui-clash-selection-list", children: p.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: A("clash_no_models", "暂无模型") }) : p.map((D) => /* @__PURE__ */ t(
                  Ze,
                  {
                    checked: re.has(D.id),
                    onChange: () => ae(d, D.id, N),
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
              Vn,
              {
                title: A("settings_more", "检测参数"),
                summary: j,
                expanded: Q,
                onToggle: () => z((D) => !D)
              }
            ),
            Q && /* @__PURE__ */ c("div", { className: "ui-clash-section-content ui-clash-settings-compact", children: [
              /* @__PURE__ */ c("div", { className: "ui-clash-fields-grid", children: [
                /* @__PURE__ */ t(on, { label: A("clash_tolerance", "容差"), children: /* @__PURE__ */ t(
                  en,
                  {
                    className: "ui-input-compact ui-clash-input-full",
                    value: Number.isFinite(f) ? f : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (D) => y(Math.max(0, D || 0))
                  }
                ) }),
                /* @__PURE__ */ t(on, { label: A("clash_min_overlap", "最小重叠体积"), children: /* @__PURE__ */ t(
                  en,
                  {
                    className: "ui-input-compact ui-clash-input-full",
                    value: Number.isFinite(_) ? _ : 0,
                    min: 0,
                    step: 1e-6,
                    onChange: (D) => P(Math.max(0, D || 0))
                  }
                ) }),
                /* @__PURE__ */ t(on, { label: A("clash_clearance_distance", "最小净空距离"), children: /* @__PURE__ */ t(
                  en,
                  {
                    className: "ui-input-compact ui-clash-input-full",
                    value: Number.isFinite(m) ? m : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (D) => Y(Math.max(0, D || 0))
                  }
                ) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-clash-option-stack ui-clash-option-grid", children: [
                /* @__PURE__ */ t(
                  Ze,
                  {
                    checked: b,
                    onChange: C,
                    label: A("clash_narrow_phase", "精筛（OBB）"),
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Ze,
                  {
                    checked: x,
                    onChange: I,
                    label: A("clash_triangle_phase", "三角面复核"),
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ t(
                  Ze,
                  {
                    checked: s,
                    onChange: B,
                    label: A("clash_include_same_model", "同模型内检测"),
                    labelStyle: { fontSize: 12 }
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-clash-section ui-clash-results-section", children: [
            /* @__PURE__ */ c("div", { className: "ui-clash-section-toggle ui-clash-section-toggle-static", children: [
              /* @__PURE__ */ t("span", { className: "ui-clash-section-title-wrap", children: /* @__PURE__ */ t("span", { className: "ui-clash-section-title", children: A("clash_results", "碰撞结果") }) }),
              /* @__PURE__ */ t("span", { className: "ui-clash-section-summary", children: Ge })
            ] }),
            /* @__PURE__ */ c("div", { className: "ui-clash-section-content ui-clash-results-content", children: [
              /* @__PURE__ */ c("div", { className: "ui-clash-results-toolbar ui-clash-results-toolbar-simple", children: [
                /* @__PURE__ */ t(
                  dt,
                  {
                    value: $,
                    onChange: (D) => de(D),
                    options: [
                      { value: "ALL", label: A("clash_type_all", "全部类型") },
                      { value: "HARD", label: A("clash_type_hard", "硬碰撞") },
                      { value: "CLEARANCE", label: A("clash_type_clearance", "净空碰撞") }
                    ],
                    className: "ui-input-compact ui-clash-filter-select",
                    style: { width: 136 }
                  }
                ),
                /* @__PURE__ */ t(
                  dt,
                  {
                    value: String(R),
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
                /* @__PURE__ */ t(Le, { size: "sm", className: "ui-properties-action", onClick: W, children: A("show_all", "恢复显示") })
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-box ui-clash-results-box", children: w.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-toolpanel-results-empty", children: A("clash_no_results", "暂无碰撞结果") }) : X.map((D) => /* @__PURE__ */ c(
                "button",
                {
                  className: "ui-search-result-item ui-clash-result-item",
                  onClick: () => T(D),
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
                      /* @__PURE__ */ t("span", { className: `ui-clash-badge ui-clash-badge-${D.severity}`, children: Ta(A, D.severity) })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "ui-toolpanel-row-between ui-clash-result-meta", children: [
                      /* @__PURE__ */ c("span", { className: "ui-result-item-secondary", children: [
                        Ra(A, D.type),
                        " · ",
                        D.type === "hard" ? A("clash_overlap_volume", "重叠体积") : A("clash_distance", "净空距离")
                      ] }),
                      /* @__PURE__ */ t("span", { className: "ui-result-item-secondary-value", children: D.type === "hard" ? D.overlapVolume.toFixed(6) : D.distance.toFixed(6) })
                    ] })
                  ]
                },
                D.id
              )) }),
              w.length > 0 && /* @__PURE__ */ t("div", { className: "ui-clash-pagination", children: /* @__PURE__ */ t(
                Gn,
                {
                  prevTitle: A("search_page_prev", "上一页"),
                  nextTitle: A("search_page_next", "下一页"),
                  currentPage: pe,
                  totalPages: le,
                  onPrev: () => J((D) => Math.max(1, D - 1)),
                  onNext: () => J((D) => Math.min(le, D + 1))
                }
              ) })
            ] })
          ] })
        ] }),
        r && /* @__PURE__ */ t("div", { className: "ui-clash-running-overlay", children: /* @__PURE__ */ c("div", { className: "ui-clash-running-card", children: [
          /* @__PURE__ */ t("div", { className: "ui-clash-running-title", children: Ce }),
          /* @__PURE__ */ c("div", { className: "ui-clash-running-meta", children: [
            A("clash_candidates", "候选"),
            " ",
            o,
            " · ",
            A("clash_pairs_scanned", "已扫描对数"),
            " ",
            h
          ] }),
          /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-full ui-clash-running-progress", children: /* @__PURE__ */ t("div", { className: "ui-progress-fill", style: { width: `${te}%` } }) }),
          /* @__PURE__ */ c("div", { className: "ui-clash-running-footer", children: [
            /* @__PURE__ */ c("span", { children: [
              Math.round(te),
              "%"
            ] }),
            /* @__PURE__ */ t(Le, { size: "sm", onClick: k, children: A("search_cancel", "取消") })
          ] })
        ] }) })
      ] })
    }
  );
}, ja = ({
  t: e,
  loading: n,
  status: r,
  progress: a,
  theme: i
}) => {
  if (!n) return null;
  const o = Math.max(0, Math.min(100, Number.isFinite(a) ? a : 0)), h = `${Math.round(o)}%`;
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
function qn(e) {
  if (e == null) return "";
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean") return String(e);
  if (Array.isArray(e)) return e.map((n) => qn(n)).filter(Boolean).join(", ");
  if (typeof e == "object")
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  return String(e);
}
function Ha(e) {
  return Array.isArray(e) ? e : Object.entries(e).map(([n, r]) => ({ key: n, value: r }));
}
function wt(e, n, r) {
  return Ha(n).map((a, i) => {
    const o = String(a.key ?? "").trim(), h = qn(a.value);
    if (!o || !h) return null;
    const u = `${e}.${o}`;
    return {
      id: a.id || `${e}::${o}::${i}`,
      group: e,
      key: o,
      value: h,
      path: u,
      rawKey: a.rawKey,
      source: a.source || r,
      normalizedGroup: Pe(e),
      normalizedKey: Pe(o),
      normalizedPath: Pe(u),
      normalizedValue: Pe(h)
    };
  }).filter(Boolean);
}
function Ga(e, n) {
  return e ? Object.entries(e).map(([r, a]) => ({
    name: r,
    items: wt(r, a, n)
  })).filter((r) => r.items.length > 0) : [];
}
function Wa(e, n) {
  const r = Pe(n);
  return r ? e.map((a) => ({
    ...a,
    items: a.items.filter(
      (i) => i.normalizedGroup.includes(r) || i.normalizedKey.includes(r) || i.normalizedPath.includes(r) || i.normalizedValue.includes(r)
    )
  })).filter((a) => a.items.length > 0) : e.filter((a) => a.items.length > 0);
}
function ln(e) {
  return e.map((n) => [`[${n.name}]`, ...n.items.map((r) => `${r.key}: ${r.value}`)].join(`
`)).join(`

`);
}
const Ka = 1200, Xa = 120;
async function Ya(e) {
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
function qa(e, n) {
  const [r, a] = V(e);
  return ce(() => {
    const i = window.setTimeout(() => {
      a(e);
    }, n);
    return () => {
      window.clearTimeout(i);
    };
  }, [e, n]), r;
}
const Qa = ({
  t: e,
  selectedProps: n,
  theme: r
}) => {
  const [a, i] = V(/* @__PURE__ */ new Set()), [o, h] = V(""), [u, p] = V(!1), [l, d] = V(null), f = se(null), _ = qa(
    o.trim(),
    Xa
  );
  ce(() => () => {
    f.current !== null && window.clearTimeout(f.current);
  }, []), ce(() => {
    i(/* @__PURE__ */ new Set()), h(""), d(null);
  }, [n]);
  const m = Ee(() => n ? Wa(n, _) : null, [n, _]);
  ce(() => {
    if (!m || !_) return;
    const L = new Set(
      m.map((W) => W.name)
    );
    i((W) => {
      const $ = new Set(W);
      return L.forEach((de) => $.delete(de)), $;
    });
  }, [m, _]);
  const b = Ee(() => m ? m.reduce((L, W) => L + W.items.length, 0) : 0, [m]), x = m?.length ?? 0, s = () => {
    p(!0), f.current !== null && window.clearTimeout(f.current), f.current = window.setTimeout(() => {
      p(!1), f.current = null;
    }, Ka);
  }, g = async (L) => {
    await Ya(L) && s();
  }, N = (L) => [
    `[${L.name}]`,
    ...L.items.map((W) => `${W.key}: ${W.value}`)
  ].join(`
`), y = (L) => `${L.key}: ${L.value}`, P = (L) => {
    i((W) => {
      const $ = new Set(W);
      return $.has(L) ? $.delete(L) : $.add(L), $;
    });
  }, Y = () => {
    i(/* @__PURE__ */ new Set());
  }, C = () => {
    m && i(new Set(m.map((L) => L.name)));
  }, I = () => {
    h("");
  }, B = () => {
    d(null);
  }, S = (L) => {
    L.preventDefault();
    const W = [
      {
        label: e("expand_all") || "全部展开",
        onClick: Y,
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
          n && g(ln(n));
        },
        disabled: !n
      }
    ];
    d({
      x: L.clientX,
      y: L.clientY,
      items: W
    });
  }, k = (L, W) => {
    L.preventDefault(), L.stopPropagation();
    const de = [
      {
        label: a.has(W.name) ? e("expand_group") || "展开分组" : e("collapse_group") || "折叠分组",
        onClick: () => P(W.name)
      },
      {
        label: e("expand_all") || "全部展开",
        onClick: Y
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
        onClick: () => g(N(W))
      },
      {
        label: e("copy_all_props") || "复制全部",
        onClick: () => {
          n && g(ln(n));
        },
        disabled: !n
      }
    ];
    d({
      x: L.clientX,
      y: L.clientY,
      items: de
    });
  }, M = (L, W, $) => {
    L.preventDefault(), L.stopPropagation();
    const de = [
      {
        label: e("copy_item_props") || "复制单个",
        onClick: () => g(y($))
      },
      {
        label: e("copy_prop_key") || "复制属性名",
        onClick: () => g($.key)
      },
      {
        label: e("copy_prop_value") || "复制属性值",
        onClick: () => g($.value)
      },
      {
        divider: !0
      },
      {
        label: e("copy_group_props") || "复制分组",
        onClick: () => g(N(W))
      },
      {
        label: e("copy_all_props") || "复制全部",
        onClick: () => {
          n && g(ln(n));
        },
        disabled: !n
      }
    ];
    d({
      x: L.clientX,
      y: L.clientY,
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
                onChange: (L) => h(L.target.value),
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
            _ ? e("search_results") || "搜索结果" : e("prop_groups") || "属性组",
            ": ",
            x,
            /* @__PURE__ */ t("span", { children: " · " }),
            e("prop_items") || "属性项",
            ": ",
            b
          ] }) })
        ] }),
        /* @__PURE__ */ t("div", { className: "ui-properties-scroll", children: m ? m.length === 0 ? /* @__PURE__ */ t("div", { className: "ui-properties-empty", children: e("search_no_results") || "暂无结果" }) : m.map((L) => {
          const W = a.has(L.name);
          return /* @__PURE__ */ c(
            "div",
            {
              className: "ui-prop-group-block",
              style: {
                margin: W ? "4px 0" : "0"
              },
              children: [
                /* @__PURE__ */ c(
                  "div",
                  {
                    className: `ui-prop-group${W ? " collapsed" : ""}`,
                    onClick: () => P(L.name),
                    onContextMenu: ($) => k($, L),
                    children: [
                      /* @__PURE__ */ t("span", { className: "truncate", children: L.name }),
                      /* @__PURE__ */ c("div", { className: "ui-prop-group-actions", children: [
                        /* @__PURE__ */ t("span", { className: "ui-result-item-secondary", children: L.items.length }),
                        /* @__PURE__ */ t("span", { className: "ui-prop-group-chevron", children: W ? /* @__PURE__ */ t(_n, { width: 14, height: 14 }) : /* @__PURE__ */ t(gn, { width: 14, height: 14 }) })
                      ] })
                    ]
                  }
                ),
                !W && L.items.map(($) => /* @__PURE__ */ c(
                  "div",
                  {
                    className: "ui-prop-row",
                    onContextMenu: (de) => M(de, L, $),
                    children: [
                      /* @__PURE__ */ t(
                        "div",
                        {
                          className: "ui-prop-key",
                          title: `${$.path} (${e("click_to_copy") || "点击复制"})`,
                          onDoubleClick: () => g($.key),
                          children: $.key
                        }
                      ),
                      /* @__PURE__ */ t(
                        "div",
                        {
                          className: "ui-prop-value",
                          title: `${$.value}
${$.path}`,
                          onDoubleClick: () => g($.value),
                          children: $.value
                        }
                      )
                    ]
                  },
                  $.id
                ))
              ]
            },
            L.name
          );
        }) : /* @__PURE__ */ t("div", { className: "ui-properties-empty", children: e("no_selection") || "未选择对象" }) }),
        l && /* @__PURE__ */ t(
          yn,
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
}, Ja = ({
  isOpen: e,
  title: n,
  message: r,
  onConfirm: a,
  onCancel: i,
  t: o,
  theme: h
}) => e ? /* @__PURE__ */ t(
  et,
  {
    title: n,
    onClose: i,
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
          Le,
          {
            variant: "default",
            className: "ui-modal-action-btn",
            onClick: i,
            children: o("btn_cancel")
          }
        ),
        /* @__PURE__ */ t(
          Le,
          {
            variant: "danger",
            className: "ui-modal-action-btn",
            onClick: a,
            children: o("btn_confirm")
          }
        )
      ] })
    ] })
  }
) : null, Za = ({ isOpen: e, onClose: n, t: r, theme: a }) => {
  if (!e) return null;
  const [i, o] = V(!1);
  return e ? /* @__PURE__ */ t(
    et,
    {
      title: r("about_title"),
      onClose: n,
      closeLabel: r("panel_close") || "关闭",
      width: 400,
      height: i ? 500 : 350,
      modal: !0,
      movable: !1,
      theme: a,
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
                i ? /* @__PURE__ */ t(Fi, { width: 14, height: 14 }) : /* @__PURE__ */ t(gn, { width: 14, height: 14 })
              ]
            }
          ),
          i && /* @__PURE__ */ c("div", { className: "ui-about-license-content", children: [
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
}, eo = ({ sceneMgr: e, lang: n = "zh", theme: r }) => {
  const a = se(null), i = se(null), o = se(null), h = se(null), u = se(null), p = se(null), l = se([]), d = se(new E.Raycaster()), f = se(new E.Vector2()), _ = se(null), m = e?.settings?.viewCubeSize || 132, b = (C) => Lt(n, C);
  ce(() => {
    if (!i.current || !a.current) return;
    const C = m, I = m, B = i.current, S = B.getContext("webgl2", {
      antialias: !0,
      alpha: !0,
      preserveDrawingBuffer: !1
    });
    S && (S.pixelStorei(S.UNPACK_FLIP_Y_WEBGL, !1), S.pixelStorei(S.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1));
    const k = new E.WebGLRenderer({
      canvas: B,
      context: S || void 0,
      antialias: !0,
      alpha: !0,
      precision: "mediump"
    });
    k.setSize(C, I, !1), k.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), k.setClearColor(0, 0), k.outputColorSpace = E.SRGBColorSpace, o.current = k;
    const M = new E.Scene();
    h.current = M;
    const L = new E.PerspectiveCamera(38, 1, 0.1, 100);
    L.position.set(0, 0, 3.8), L.lookAt(0, 0, 0), u.current = L;
    const W = new E.AmbientLight(16777215, 1.9);
    M.add(W);
    const $ = new E.DirectionalLight(16777215, 0.35);
    $.position.set(3, 4, 5), M.add($);
    const de = new E.Group();
    M.add(de), p.current = de, l.current = [];
    const O = ((G, X) => getComputedStyle(document.documentElement).getPropertyValue(G).trim() || X)("--accent", "#0C62A2"), q = new E.Color("#F3F6FA"), F = new E.Color("#E6ECF3"), T = new E.Color("#C9D3DF"), ue = new E.Color("#D5DEE9"), A = new E.Color("#8F9DAE");
    new E.Color(O);
    const ee = (G, X, he, re, te, Ce) => {
      const ke = Math.min(Ce, re / 2, te / 2);
      G.beginPath(), G.moveTo(X + ke, he), G.lineTo(X + re - ke, he), G.quadraticCurveTo(X + re, he, X + re, he + ke), G.lineTo(X + re, he + te - ke), G.quadraticCurveTo(X + re, he + te, X + re - ke, he + te), G.lineTo(X + ke, he + te), G.quadraticCurveTo(X, he + te, X, he + te - ke), G.lineTo(X, he + ke), G.quadraticCurveTo(X, he, X + ke, he), G.closePath();
    }, J = (G, X = 0) => {
      const he = document.createElement("canvas"), re = 256;
      he.width = re, he.height = re;
      const te = he.getContext("2d");
      te && (te.clearRect(0, 0, re, re), te.fillStyle = "#F3F6FA", te.fillRect(0, 0, re, re), te.fillStyle = "#EAF0F6", ee(te, 24, 24, 208, 208, 12), te.fill(), te.strokeStyle = "rgba(143,157,174,0.75)", te.lineWidth = 3, ee(te, 28, 28, 200, 200, 10), te.stroke(), te.save(), te.translate(re / 2, re / 2), X !== 0 && te.rotate(X * Math.PI / 180), te.fillStyle = "#1F2933", te.font = n === "zh" ? '700 82px "Microsoft YaHei", "PingFang SC", sans-serif' : '700 48px "Segoe UI", Arial, sans-serif', te.textAlign = "center", te.textBaseline = "middle", te.fillText(G, 0, 2), te.restore());
      const Ce = new E.CanvasTexture(he);
      return Ce.colorSpace = E.SRGBColorSpace, Ce.anisotropy = 4, Ce.needsUpdate = !0, Ce;
    }, R = (G) => {
      const X = new E.EdgesGeometry(G.geometry, 24), he = new E.LineBasicMaterial({
        color: A,
        transparent: !0,
        opacity: 0.72
      }), re = new E.LineSegments(X, he);
      re.userData.isViewCubeFrame = !0, G.add(re);
    }, H = (G, X, he, re, te, Ce = 0) => {
      const ke = new E.BoxGeometry(G.x, G.y, G.z), Ge = new E.MeshLambertMaterial({
        color: te ? new E.Color("#FFFFFF") : re,
        map: te ? J(te, Ce) : void 0,
        transparent: !0,
        opacity: te ? 0.98 : 0.96
      }), j = new E.Mesh(ke, Ge);
      return j.position.copy(X), j.name = he, j.userData.originalOpacity = Ge.opacity, j.userData.originalColor = Ge.color.clone(), j.userData.isFace = !!te, j.userData.clickable = !0, R(j), de.add(j), l.current.push(j), j;
    }, ne = 0.84, me = 0.12, Q = 0.14, z = 0.055, w = 0.5;
    H(new E.Vector3(ne, z, ne), new E.Vector3(0, -w, 0), "front", q, b("cube_front")), H(new E.Vector3(ne, z, ne), new E.Vector3(0, w, 0), "back", q, b("cube_back"), 180), H(new E.Vector3(ne, ne, z), new E.Vector3(0, 0, w), "top", q, b("cube_top"), 360), H(new E.Vector3(ne, ne, z), new E.Vector3(0, 0, -w), "bottom", F, b("cube_bottom")), H(new E.Vector3(z, ne, ne), new E.Vector3(-w, 0, 0), "left", F, b("cube_left"), 90), H(new E.Vector3(z, ne, ne), new E.Vector3(w, 0, 0), "right", F, b("cube_right"), 270), H(new E.Vector3(ne, me, me), new E.Vector3(0, -w, w), "top-front", T), H(new E.Vector3(ne, me, me), new E.Vector3(0, w, w), "top-back", T), H(new E.Vector3(me, ne, me), new E.Vector3(-w, 0, w), "top-left", T), H(new E.Vector3(me, ne, me), new E.Vector3(w, 0, w), "top-right", T), H(new E.Vector3(ne, me, me), new E.Vector3(0, -w, -w), "bottom-front", T), H(new E.Vector3(ne, me, me), new E.Vector3(0, w, -w), "bottom-back", T), H(new E.Vector3(me, ne, me), new E.Vector3(-w, 0, -w), "bottom-left", T), H(new E.Vector3(me, ne, me), new E.Vector3(w, 0, -w), "bottom-right", T), H(new E.Vector3(me, me, ne), new E.Vector3(-w, -w, 0), "front-left", T), H(new E.Vector3(me, me, ne), new E.Vector3(w, -w, 0), "front-right", T), H(new E.Vector3(me, me, ne), new E.Vector3(-w, w, 0), "back-left", T), H(new E.Vector3(me, me, ne), new E.Vector3(w, w, 0), "back-right", T), H(new E.Vector3(Q, Q, Q), new E.Vector3(-w, -w, w), "top-front-left", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(w, -w, w), "top-front-right", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(-w, w, w), "top-back-left", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(w, w, w), "top-back-right", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(-w, -w, -w), "bottom-front-left", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(w, -w, -w), "bottom-front-right", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(-w, w, -w), "bottom-back-left", ue), H(new E.Vector3(Q, Q, Q), new E.Vector3(w, w, -w), "bottom-back-right", ue), de.rotation.set(0, 0, 0);
    let le = 0;
    const pe = () => {
      le = requestAnimationFrame(pe), e && p.current && p.current.quaternion.copy(e.camera.quaternion).invert(), k.render(M, L);
    };
    return pe(), () => {
      cancelAnimationFrame(le), l.current = [], k.dispose(), M.traverse((G) => {
        if (G instanceof E.Mesh) {
          G.geometry.dispose();
          const X = G.material;
          Array.isArray(X) ? X.forEach((he) => {
            "map" in he && he.map && he.map.dispose(), he.dispose();
          }) : (X.map && X.map.dispose(), X.dispose());
        }
        if (G instanceof E.LineSegments) {
          G.geometry.dispose();
          const X = G.material;
          Array.isArray(X) ? X.forEach((he) => he.dispose()) : X.dispose();
        }
      });
    };
  }, [e, m, n]);
  const x = (C) => {
    if (!C) return;
    const I = C.material;
    I.opacity = C.userData.originalOpacity, I.color.copy(C.userData.originalColor), C.scale.set(1, 1, 1);
  }, s = (C) => {
    const I = C.material;
    C.userData.isFace ? (I.color.set(16777215), I.opacity = 1) : (I.color.set(12179711), I.opacity = 1), C.scale.set(1.02, 1.02, 1.02);
  }, g = (C) => {
    if (!i.current || !u.current) return null;
    const I = i.current.getBoundingClientRect();
    f.current.x = (C.clientX - I.left) / I.width * 2 - 1, f.current.y = -((C.clientY - I.top) / I.height) * 2 + 1, d.current.setFromCamera(f.current, u.current);
    const B = d.current.intersectObjects(l.current, !1);
    return B.length === 0 ? null : B[0].object;
  }, N = (C) => {
    if (!a.current) return;
    const I = g(C);
    I ? (_.current !== I && (x(_.current), _.current = I, s(I)), a.current.style.cursor = "pointer") : (x(_.current), _.current = null, a.current.style.cursor = "default");
  }, y = () => {
    x(_.current), _.current = null, a.current && (a.current.style.cursor = "default");
  }, P = (C) => {
    if (!e) return;
    const I = g(C);
    I && Y(I.name);
  }, Y = (C) => {
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
      ref: a,
      className: "ui-viewcube ui-viewcube-clean",
      style: {
        width: `${m}px`,
        height: `${m}px`
      },
      onClick: P,
      onMouseMove: N,
      onMouseLeave: y,
      children: /* @__PURE__ */ t("canvas", { ref: i, className: "ui-viewcube-canvas" })
    }
  );
};
class to extends ki {
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
    const { children: n, t: r, theme: a } = this.props;
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
    storage: a = typeof window < "u" ? window.localStorage : void 0,
    serializer: i = JSON.stringify,
    parser: o = JSON.parse
  } = r, h = () => typeof n == "function" ? n() : n, [u, p] = V(() => {
    const l = h();
    if (!a) return l;
    try {
      const d = a.getItem(e);
      return d === null ? l : o(d);
    } catch (d) {
      return console.warn(`[usePersistentState] Failed to read "${e}"`, d), l;
    }
  });
  return ce(() => {
    if (a)
      try {
        a.setItem(e, i(u));
      } catch (l) {
        console.warn(`[usePersistentState] Failed to write "${e}"`, l);
      }
  }, [e, i, u, a]), [u, p];
}
function no({
  fileSetIdRef: e,
  completedFileSetsRef: n,
  onProgress: r,
  onCompleted: a
}) {
  const i = se(null), o = se(null), h = U(() => {
    i.current = null;
    const p = o.current;
    if (!p) return;
    o.current = null;
    const { loaded: l, total: d } = p;
    r((_) => _.loaded === l && _.total === d ? _ : { loaded: l, total: d });
    const f = e.current;
    l === d && d > 0 && f && (n.current.has(f) || (n.current.add(f), a()));
  }, [n, e, a, r]), u = U((p, l) => {
    o.current = { loaded: p, total: l }, i.current === null && (i.current = requestAnimationFrame(h));
  }, [h]);
  return ce(() => () => {
    i.current !== null && (cancelAnimationFrame(i.current), i.current = null), o.current = null;
  }, []), { onManagerChunkProgress: u };
}
function mn(e) {
  return e.replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "").toLowerCase();
}
function Pn(e) {
  const n = mn(e), r = n.split("/"), a = r[r.length - 1];
  return Array.from(/* @__PURE__ */ new Set([
    n,
    a,
    `./${n}`,
    `./${a}`
  ]));
}
function ro(e) {
  const n = e.filter((i) => i instanceof File);
  if (n.length === 0) return null;
  const r = /* @__PURE__ */ new Map(), a = (i, o) => {
    !i || r.has(i) || r.set(i, URL.createObjectURL(o));
  };
  return n.forEach((i) => {
    a(mn(i.name), i);
    const o = i.webkitRelativePath;
    if (o) {
      const h = o.split("/").slice(1).join("/");
      a(mn(h), i);
    }
  }), {
    resolve: (i) => {
      if (!i || /^(blob:|data:|https?:)/i.test(i)) return i;
      for (const o of Pn(i)) {
        const h = r.get(o);
        if (h) return h;
      }
      return i;
    },
    has: (i) => Pn(i).some((o) => r.has(o)),
    dispose: () => {
      r.forEach((i) => URL.revokeObjectURL(i)), r.clear();
    }
  };
}
const io = {
  fetch: "reading",
  parse: "analyzing",
  normalize: "processing",
  optimize: "processing",
  addToScene: "processing"
}, ao = {
  fetch: [0, 20],
  parse: [20, 58],
  normalize: [58, 72],
  optimize: [72, 92],
  addToScene: [92, 100]
}, cn = /* @__PURE__ */ new Map();
let un = null;
async function oo() {
  return un || (un = Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/DRACOLoader.js"),
    import("three/examples/jsm/loaders/KTX2Loader.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js")
  ]).then(([e, n, r, a]) => ({
    GLTFLoader: e.GLTFLoader,
    DRACOLoader: n.DRACOLoader,
    KTX2Loader: r.KTX2Loader,
    MeshoptDecoder: a.MeshoptDecoder
  }))), un;
}
function Qn(e) {
  if (!cn.has(e)) {
    const n = e.replace(/\/$/, ""), r = typeof window < "u" ? new URL(n ? `${n}/` : "./", window.location.href).toString().replace(/\/$/, "") : n;
    cn.set(e, r);
  }
  return cn.get(e);
}
function so(e, n, r) {
  const a = ro(e), i = new E.LoadingManager();
  return a && i.setURLModifier((h) => a.resolve(h)), { manager: i, cleanup: () => {
    a?.dispose();
  }, resourceResolver: a };
}
async function lo(e, n) {
  const { GLTFLoader: r, DRACOLoader: a, KTX2Loader: i, MeshoptDecoder: o } = await oo(), h = Qn(n), u = typeof window < "u" && !!window.createImageBitmap;
  let p = null;
  const l = new a(e);
  l.setDecoderPath(`${h}/draco/gltf/`);
  const d = new i(e);
  if (d.setTranscoderPath(`${h}/basis/`), typeof document < "u")
    try {
      p = new E.WebGLRenderer({ canvas: document.createElement("canvas") }), d.detectSupport(p);
    } catch (_) {
      console.warn("[LoaderUtils] KTX2 detectSupport failed", _);
    }
  const f = new r(e);
  return f.setDRACOLoader(l), f.setMeshoptDecoder(o), u && f.setKTX2Loader(d), {
    loader: f,
    cleanup: () => {
      l.dispose(), d.dispose(), p?.dispose();
    }
  };
}
function co(e, n, r, a, i) {
  return (o, h, u) => {
    const [p, l] = ao[o], d = Math.min(100, Math.max(0, Number.isFinite(h) ? h : 0)), f = p + d / 100 * (l - p), _ = a + f / 100 * i, m = u || `${n(io[o])} ${r}`;
    e(Math.round(_), m);
  };
}
async function uo(e, n, r, a, i, o, h, u, p) {
  const l = so(a), { manager: d, cleanup: f, resourceResolver: _ } = l;
  try {
    if (r === "lmb") {
      const { LMBLoader: m } = await import("./lmbLoader-9Jgmv6We.js"), b = new m();
      return i("parse", 0), await b.loadAsync(
        n,
        (x) => i("parse", x * 100),
        { fastMode: (p.loadProfile ?? "balanced") === "max-speed" }
      );
    }
    if (r === "glb" || r === "gltf") {
      const { loader: m, cleanup: b } = await lo(d, u);
      i("parse", 0);
      try {
        return (await new Promise((s, g) => {
          m.load(
            n,
            s,
            (N) => {
              N.total && N.total > 0 ? i("parse", N.loaded / N.total * 100) : i("parse", 50);
            },
            g
          );
        })).scene;
      } finally {
        b();
      }
    }
    if (r === "fbx") {
      const { FBXLoader: m } = await import("three/examples/jsm/loaders/FBXLoader.js"), b = new m(d);
      return i("parse", 0), await new Promise((x, s) => {
        b.load(
          n,
          x,
          (g) => {
            g.total && g.total > 0 ? i("parse", g.loaded / g.total * 100) : i("parse", 50);
          },
          s
        );
      });
    }
    if (r === "ifc") {
      const { loadIFC: m } = await import("./ifcLoader-tq3Xf-61.js");
      i("parse", 0);
      const b = {
        ...h,
        deferIfcProperties: p.deferIfcProperties ?? !0
      };
      return await m(
        typeof e == "string" ? n : e,
        (x, s) => i("parse", x, s),
        o,
        u,
        b
      );
    }
    if (r === "obj") {
      const [{ OBJLoader: m }, { MTLLoader: b }] = await Promise.all([
        import("three/examples/jsm/loaders/OBJLoader.js"),
        import("three/examples/jsm/loaders/MTLLoader.js")
      ]), x = new m(d), s = n.replace(/\.[^.]+$/i, ".mtl");
      if (_?.has(s))
        try {
          const g = await new Promise((N, y) => {
            new b(d).load(s, N, void 0, y);
          });
          g.preload(), x.setMaterials(g);
        } catch (g) {
          console.warn("[LoaderUtils] Failed to load companion MTL", g);
        }
      return i("parse", 0), await x.loadAsync(n, (g) => {
        g.total && g.total > 0 ? i("parse", g.loaded / g.total * 100) : i("parse", 50);
      });
    }
    if (r === "stl") {
      const { STLLoader: m } = await import("three/examples/jsm/loaders/STLLoader.js"), b = new m(d);
      i("parse", 0);
      const x = await b.loadAsync(n, (s) => {
        s.total && s.total > 0 && i("parse", s.loaded / s.total * 100);
      });
      return new E.Mesh(x, new E.MeshStandardMaterial({ color: 8947848 }));
    }
    if (r === "ply") {
      const { PLYLoader: m } = await import("three/examples/jsm/loaders/PLYLoader.js"), b = new m(d);
      i("parse", 0);
      const x = await b.loadAsync(n, (s) => {
        s.total && s.total > 0 && i("parse", s.loaded / s.total * 100);
      });
      return new E.Mesh(x, new E.MeshStandardMaterial({
        color: 8947848,
        vertexColors: x.hasAttribute("color")
      }));
    }
    if (r === "3mf") {
      const { ThreeMFLoader: m } = await import("three/examples/jsm/loaders/3MFLoader.js"), b = new m(d);
      return i("parse", 0), await b.loadAsync(n, (x) => {
        x.total && x.total > 0 && i("parse", x.loaded / x.total * 100);
      });
    }
    if (r === "stp" || r === "step" || r === "igs" || r === "iges") {
      i("fetch", 0);
      const m = typeof e == "string" ? await fetch(n).then((N) => N.arrayBuffer()) : await e.arrayBuffer(), x = `${Qn(u)}/occt-import-js/occt-import-js.wasm`, { OCCTLoader: s } = await import("./occtLoader-CqjlQM7F.js"), g = new s(x);
      return i("parse", 0), await g.load(m, o, (N, y) => i("parse", N, y));
    }
    return null;
  } finally {
    f();
  }
}
function $n(e, n, r = "full") {
  let i = 0;
  e.traverse((o) => {
    if (o.isMesh) {
      if (r === "fast" && i >= 3200) return;
      const h = o;
      h.frustumCulled = n.frustumCulling ?? !0, i += 1, h.geometry.boundingBox || h.geometry.computeBoundingBox(), h.geometry.boundingSphere || h.geometry.computeBoundingSphere(), (Array.isArray(h.material) ? h.material : [h.material]).forEach((p) => {
        p && "wireframe" in p && (p.wireframe = !1);
      });
    }
  });
}
const ho = async (e, n, r, a, i = "./libs", o = {}) => {
  const h = [], u = e.length;
  for (let p = 0; p < u && !o.isStale?.(); p++) {
    const l = e[p], d = typeof l == "string";
    let f = "", _ = "", m = "";
    d ? (m = l, f = m.split("?")[0].split("#")[0].split("/").pop() || "model", _ = f.split(".").pop()?.toLowerCase() || "") : (f = l.name, _ = f.split(".").pop()?.toLowerCase() || "", m = URL.createObjectURL(l));
    const b = p / u * 100, x = 100 / u, s = co(n, r, f, b, x);
    try {
      s("fetch", 5);
      const g = await uo(l, m, _, e, s, r, a, i, o);
      if (!g) continue;
      g.name = f, s("normalize", 30, `${r("processing")} ${f}`);
      const N = o.fastGeometrySanitize ?? !0;
      $n(g, a, N ? "fast" : "full"), N && setTimeout(() => {
        o.isStale?.() || $n(g, a, "full");
      }, 0), s("optimize", 100, `${r("analyzing")} ${f}`), s("addToScene", 100, `${r("success")} ${f}`), h.push(g);
    } catch (g) {
      console.error(`加载 ${f} 失败`, g);
    } finally {
      d || URL.revokeObjectURL(m);
    }
  }
  return n(100, r("analyzing")), h;
};
function Jn(e) {
  return e ? e.replace(/:\s*\d+%/g, "").replace(/\(\d+%\)/g, "").replace(/\d+%/g, "").trim() : "";
}
function po(e) {
  return e.map((r) => typeof r == "string" ? r : r.name).sort().join("|");
}
async function mo({
  items: e,
  manager: n,
  sceneSettings: r,
  libPath: a,
  t: i,
  onProgress: o,
  runtimeHints: h = {},
  isStale: u
}) {
  if (!e.length) return;
  const p = [], l = [];
  for (const _ of e)
    (typeof _ == "string" ? _.split("?")[0].split("#")[0] : _.name).toLowerCase().endsWith(".nbim") ? p.push(_) : l.push(_);
  for (const _ of p) {
    if (u?.()) return;
    if (typeof _ == "string") {
      const m = await fetch(_);
      if (!m.ok) throw new Error(`HTTP ${m.status} when fetching NBIM`);
      const b = await m.blob(), x = _.split("?")[0].split("#")[0].split("/").pop() || "model.nbim", s = new File([b], x);
      await n.loadNbim(s, (g, N) => {
        o(g, N);
      });
    } else
      await n.loadNbim(_, (m, b) => {
        o(m, b);
      });
  }
  if (l.length === 0) return;
  const d = await ho(
    l,
    o,
    i,
    r,
    a,
    {
      ...h,
      isStale: u
    }
  ), f = Math.max(d.length, 1);
  for (let _ = 0; _ < d.length; _++) {
    if (u?.()) return;
    const m = d[_], b = 92 + Math.round(_ / f * 8);
    try {
      let x = 0;
      if (m.traverse((s) => {
        s?.isMesh && s.geometry && x++;
      }), x <= 0)
        throw new Error(`${m.name || "Model"} has no renderable mesh`);
      await n.addModel(m, (s, g) => {
        const N = Math.min(100, b + Math.round(s / 100 * (8 / f)));
        o(N, g);
      });
    } catch (x) {
      try {
        await n.removeModel(m.uuid);
      } catch {
      }
      throw x;
    }
    n.invalidateRender?.({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }
}
function fo({
  managerRef: e,
  sceneSettings: n,
  libPath: r,
  t: a,
  setCurrentFileSetId: i,
  setLoading: o,
  setStatus: h,
  setProgress: u,
  setToast: p,
  updateTree: l
}) {
  const d = U(async (_) => {
    if (!_.length || !e.current) return;
    const m = e.current, b = m.beginLoadGeneration?.() ?? 0, x = m.getChunkOptions?.() || {};
    await mo({
      items: _,
      manager: m,
      sceneSettings: n,
      libPath: r,
      t: a,
      onProgress: (s, g) => {
        u(s), g && h(Jn(g)), m.invalidateRender?.();
      },
      runtimeHints: x,
      isStale: () => !e.current?.isLoadGenerationCurrent?.(b)
    }), m.invalidateRender?.({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }, [r, e, n, u, h, a]);
  return {
    processFiles: U(async (_) => {
      if (!_.length || !e.current) return;
      const m = po(_);
      i(m), e.current.setChunkLoadingEnabled?.(!0), e.current.setContentVisible?.(!0), o(!0), h(a("loading")), u(0);
      try {
        if (await d(_), l(), e.current?.invalidateRender?.({
          invalidateInteractables: !0,
          needsBoundsUpdate: !0,
          needsCulling: !0
        }), _.some((x) => (typeof x == "string" ? x : x.name).toLowerCase().endsWith(".nbim"))) {
          const x = e.current.getStats?.();
          if (x && x.meshes <= 0)
            throw new Error("NBIM 加载完成但没有可渲染外形，请检查文件格式或分块数据");
        } else
          e.current?.fitView(!1);
        e.current?.invalidateRender?.({
          invalidateInteractables: !0,
          needsBoundsUpdate: !0,
          needsCulling: !0
        }), h(a("success"));
      } catch (b) {
        h(a("failed")), p({ message: `${a("failed")}: ${b.message}`, type: "error" });
      } finally {
        o(!1), e.current?.invalidateRender?.();
      }
    }, [d, e, i, o, u, h, p, a, l]),
    loadItemsIntoScene: d
  };
}
function _o({ mgrInstance: e, showStats: n, setStats: r }) {
  ce(() => {
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
function go(e, n) {
  return e.includes(n) ? e.filter((r) => r !== n) : [...e, n];
}
function yo(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function bo() {
  const [e, n] = V([]), r = Ee(
    () => yo(e),
    [e]
  ), a = U(() => {
    n([]);
  }, []), i = U((h) => {
    n([h]);
  }, []), o = U((h) => {
    n((u) => go(u, h));
  }, []);
  return {
    selectedUuids: e,
    selectedUuid: r,
    setSelectedUuids: n,
    clearSelection: a,
    setSingleSelection: i,
    toggleSelection: o
  };
}
function vo({
  basicLabel: e,
  geoLabel: n,
  basicProps: r,
  geoProps: a,
  ifcProps: i,
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
      items: wt(n, a, "geometry")
    }
  ];
  return i && u.push(...Ga(i, "ifc")), u;
}
function wo(e, n, r) {
  let a = r === (n?.uuid || n?.id) && n instanceof E.Object3D ? n : e.contentGroup.getObjectByProperty("uuid", r);
  if (!a) {
    const i = e.getStructureNodes(r);
    i && i.length > 0 && (a = i[0]);
  }
  return a || n;
}
function xo(e) {
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
async function Co(e, n) {
  const a = ((i) => {
    let o = i instanceof E.Object3D ? i : null, h = i?.userData?.expressID;
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
  if (!a?.ifcRoot || a.expressID === void 0) return null;
  try {
    const i = `${a.ifcRoot.userData.modelID}:${a.expressID}`, o = n.get(i);
    if (o) return o;
    const u = await a.ifcRoot.userData.ifcManager.getItemProperties(a.ifcRoot.userData.modelID, a.expressID), p = u?.rawGroups || u?.groups || u?.normalizedGroups || null;
    return p && n.set(i, p), p;
  } catch (i) {
    return console.error("IFC Props Error", i), null;
  }
}
function No(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const n = {};
  return e.forEach((r, a) => {
    const i = String(r.group || "NBIM").trim(), o = String(r.key || "").trim();
    !i || !o || (n[i] || (n[i] = []), n[i].push({
      key: o,
      value: r.value,
      rawKey: r.rawKey,
      source: r.source || "property-index",
      id: `property-index::${r.path || `${i}.${o}`}::${a}`
    }));
  }), Object.keys(n).length > 0 ? n : null;
}
function So({
  sceneManager: e,
  focusUuid: n,
  target: r,
  t: a,
  ifcGroups: i,
  clashSummary: o,
  isDev: h = !1
}) {
  const u = {}, p = {}, l = xo(r), d = [r?.name, r?.userData?.name].find((g) => typeof g == "string" && g.trim().length > 0), f = e.getBimIdByUuid(n) || n;
  if (d && (u[a("prop_name")] = d), u[a("prop_id")] = f, u[a("prop_type")] = r.type || (r.children ? "Group" : "Mesh"), typeof l == "number" && Number.isFinite(l) && (u[a("prop_storey_elevation")] = String(l)), r.getWorldPosition) {
    const g = new E.Vector3();
    r.getWorldPosition(g), p[a("prop_pos")] = `${g.x.toFixed(2)}, ${g.y.toFixed(2)}, ${g.z.toFixed(2)}`;
  }
  if (r.isMesh || r.type === "Mesh") {
    if (r instanceof E.Mesh) {
      const N = new E.Box3().setFromObject(r), y = new E.Vector3();
      N.getSize(y), p[a("prop_dim")] = `${y.x.toFixed(2)} x ${y.y.toFixed(2)} x ${y.z.toFixed(2)}`, r.geometry && (p[a("prop_vert")] = (r.geometry.attributes.position?.count || 0).toLocaleString(), p[a("prop_tri")] = r.geometry.index ? (r.geometry.index.count / 3).toLocaleString() : ((r.geometry.attributes.position?.count || 0) / 3).toLocaleString());
    } else if (r.userData?.boundingBox) {
      const N = new E.Vector3();
      r.userData.boundingBox.getSize(N), p[a("prop_dim")] = `${N.x.toFixed(2)} x ${N.y.toFixed(2)} x ${N.z.toFixed(2)}`;
    }
    r.isInstancedMesh && (p[a("prop_inst")] = r.count.toLocaleString());
    const g = e.getObjectGeometryData(n);
    g.area > 0 && (p[a("prop_area")] = g.area.toFixed(3)), g.volume > 0 && (p[a("prop_volume")] = g.volume.toFixed(3));
  } else if (r.userData?.boundingBox) {
    const g = new E.Vector3();
    r.userData.boundingBox.getSize(g), p[a("prop_dim")] = `${g.x.toFixed(2)} x ${g.y.toFixed(2)} x ${g.z.toFixed(2)}`;
  }
  const _ = e.getNbimPropertySearchDocument(n), m = No(_?.rows), b = e.getNbimProperties(n), x = e.getNbimIfcPropertyGroups(n, "raw");
  h && b && Object.keys(b).length > 0 && (console.group(`NBIM 选中属性: ${n}`), console.log(b), console.log(JSON.stringify(b, null, 2)), console.groupEnd()), h && x && (console.group(`NBIM IFC 组属性: ${n}`), console.log(x), console.log(JSON.stringify(x, null, 2)), console.groupEnd());
  const s = vo({
    basicLabel: a("pg_basic"),
    geoLabel: a("pg_geo"),
    basicProps: u,
    geoProps: p,
    ifcProps: i || m || x || null,
    nbimProps: null
  });
  if (o) {
    const g = a("pg_clash");
    s.push({
      name: g,
      items: wt(g, [
        { key: a("clash_group_all"), value: String(o.total) },
        { key: a("clash_group_new"), value: String(o.newCount) },
        { key: a("clash_group_confirmed"), value: String(o.confirmedCount) },
        { key: a("clash_group_resolved"), value: String(o.resolvedCount) },
        { key: a("prop_status"), value: a(`clash_group_${o.worstStatus}`) }
      ].map((N, y) => ({ ...N, id: `clash-summary::${y}` })))
    });
  }
  return s;
}
function ko({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  setSelectedProps: a,
  setHiddenUuids: i,
  setIsolatedUuids: o,
  updateTree: h,
  propOnSelect: u,
  ifcPropertyCacheRef: p,
  clashSummaryByUuid: l,
  focusObjectsInView: d,
  t: f,
  isDev: _ = !1
}) {
  const [m, b] = V(null), [x, s] = V([]), g = U(() => {
    b(null), s([]);
  }, []), N = U(async (C, I, B = !1, S = !1) => {
    const k = e.current;
    if (!k) return;
    if (!C) {
      r([]), a(null), k.highlightObjects([]);
      return;
    }
    const M = C.uuid || C.id, L = k.resolveSelectionUuid(M);
    if (!L) return;
    const W = B ? n.includes(L) ? n.filter((q) => q !== L) : [...n, L] : [L];
    r(W), S || k.highlightObjects(W);
    const $ = W[W.length - 1];
    if (!$) {
      a(null);
      return;
    }
    u?.($, C);
    const de = wo(k, C, $), K = await Co(de, p.current || /* @__PURE__ */ new Map()), O = So({
      sceneManager: k,
      focusUuid: $,
      target: de,
      t: f,
      ifcGroups: K,
      clashSummary: l[$],
      isDev: _
    });
    a(O);
  }, [
    l,
    p,
    _,
    u,
    e,
    n,
    a,
    r,
    f
  ]), y = U((C) => {
    const I = e.current;
    if (!I || !C) return !1;
    const B = C.uuid || C.id;
    if (!B) return !1;
    const S = I.resolveSelectionUuid(B);
    return !S || !I.getBoundsForObject(S) ? !1 : (b(S), d({ uuids: [S], focusUuid: S, updateSelection: !1 }));
  }, [d, e]), P = U((C) => {
    if (!!(x.length === C.length && x.every((S, k) => S === C[k]))) return;
    s(C);
    const B = e.current;
    !B || C.length > 0 || B.clearLocateFocus();
  }, [x, e]), Y = U(() => {
    g(), e.current?.clearLocateFocus(), e.current?.highlightObjects(n);
  }, [g, e, n]);
  return ce(() => {
    const C = e.current;
    if (!C || n.length <= 1) return;
    let I = !1;
    const B = async () => {
      const k = new E.Box3();
      let M = 0, L = 0;
      const W = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), de = new Set(n), K = /* @__PURE__ */ new Map();
      C.contentGroup.traverse((ee) => {
        const J = ee.uuid, R = ee.userData?.id;
        (de.has(J) || R && de.has(R)) && (K.set(J, ee), R && K.set(R, ee), k.expandByObject(ee));
      });
      const O = 2e3;
      let q = performance.now();
      for (let ee = 0; ee < n.length; ee += O) {
        if (I) return;
        const J = n.slice(ee, ee + O);
        for (const R of J) {
          const H = K.get(R), ne = C.getStructureNodes(R), me = ne && ne.length > 0 ? ne[0] : null, Q = String(H?.type || me?.type || "Object");
          $.set(Q, ($.get(Q) || 0) + 1);
          const z = H?.userData?.rootName || H?.userData?.modelName;
          z && W.add(String(z));
          const w = C.getObjectGeometryData(R);
          M += w.area, L += w.volume;
        }
        performance.now() - q > 16 && (await new Promise((R) => setTimeout(R, 0)), q = performance.now());
      }
      if (I) return;
      const F = (ee) => Array.from(ee.entries()).sort((J, R) => R[1] - J[1]).slice(0, 4).map(([J, R]) => `${J} x${R}`).join(", "), T = k.isEmpty() ? null : k.getSize(new E.Vector3()), ue = [
        { key: f("selected_count"), value: String(n.length) },
        { key: f("summary_models"), value: String(W.size || 1) },
        { key: f("summary_types"), value: F($) || "-" }
      ];
      T && ue.push({
        key: f("summary_bounds"),
        value: `${T.x.toFixed(2)} x ${T.y.toFixed(2)} x ${T.z.toFixed(2)}`
      }), M > 0 && ue.push({ key: f("prop_area"), value: M.toFixed(3) }), L > 0 && ue.push({ key: f("prop_volume"), value: L.toFixed(3) });
      const A = `${n.length} ${f("selected_count")}`;
      a([
        {
          name: A,
          items: wt(A, ue.map((ee) => ({ key: ee.key, value: ee.value })))
        }
      ]);
    }, S = window.setTimeout(B, 200);
    return () => {
      I = !0, clearTimeout(S);
    };
  }, [n, e, f, a]), {
    locatedUuid: m,
    locateResultUuids: x,
    resetLocateState: g,
    handleSelect: N,
    handleLocateObject: y,
    handleLocateResultsChange: P,
    handleClearLocate: Y
  };
}
function Mo({
  sceneMgrRef: e,
  t: n,
  setLoading: r,
  setProgress: a,
  setStatus: i,
  setToast: o,
  setActiveTool: h,
  setConfirmState: u,
  setSelectedUuids: p,
  setSelectedProps: l,
  setChunkProgress: d,
  resetLocateState: f,
  clearSearchResult: _,
  resetClashState: m,
  resetMeasurementState: b,
  resetExplodeState: x,
  updateTree: s,
  ifcPropertyCacheRef: g,
  completedFileSetsRef: N
}) {
  const y = U(() => {
    const S = e.current;
    if (!S) return [];
    const k = [];
    return S.contentGroup.children.forEach((M) => {
      if (M.userData?.isOptimizedGroup || M.name.startsWith("optimized_")) return;
      const L = (typeof M.userData?.modelName == "string" ? M.userData.modelName : "") || M.children?.[0]?.name || "" || M.name, W = An(Zt(L));
      k.push(W);
    }), Array.from(new Set(k));
  }, [e]), P = U((S) => {
    const k = y();
    if (k.length === 1)
      return k[0];
    const M = /* @__PURE__ */ new Date(), L = ($) => String($).padStart(2, "0"), W = `${M.getFullYear()}${L(M.getMonth() + 1)}${L(M.getDate())}_${L(M.getHours())}${L(M.getMinutes())}${L(M.getSeconds())}`;
    return `${n("export_batch_name")}_${W}`;
  }, [y, n]), Y = U((S, k) => {
    const M = P(S);
    return `${An(Zt((k || "").trim()) || M)}.${S}`;
  }, [P]), C = U(async (S, k) => {
    const M = e.current;
    if (!M) return;
    const L = M.contentGroup, W = Y(S, k), $ = Zt(W);
    if (S === "nbim") {
      if (L.children.length === 0) {
        o({ message: n("no_models"), type: "info" });
        return;
      }
      r(!0), i(`${n("processing")}...`), h("none"), window.setTimeout(async () => {
        try {
          await e.current?.exportNbim($), o({ message: n("success"), type: "success" });
        } catch (O) {
          console.error(O), o({ message: `${n("failed")}: ${O.message}`, type: "error" });
        } finally {
          r(!1);
        }
      }, 100);
      return;
    }
    const de = L.children.filter((O) => !O.userData.isOptimizedGroup);
    if (de.length === 0) {
      o({ message: n("no_models"), type: "info" });
      return;
    }
    const K = new E.Group();
    de.forEach((O) => K.add(O.clone())), r(!0), a(0), i(`${n("processing")}...`), h("none"), window.setTimeout(async () => {
      try {
        let O = null;
        if (S === "glb" ? O = await Mi(K) : S === "lmb" && (O = await Li(K, (q) => i(Jn(q)))), O) {
          const q = URL.createObjectURL(O), F = document.createElement("a");
          F.href = q, F.download = W, F.click(), URL.revokeObjectURL(q), o({ message: n("success"), type: "success" });
        }
      } catch (O) {
        console.error(O), o({ message: `${n("failed")}: ${O.message}`, type: "error" });
      } finally {
        r(!1), a(0);
      }
    }, 100);
  }, [Y, e, h, r, a, i, o, n]), I = U(async () => {
    e.current && u({
      isOpen: !0,
      title: n("op_clear"),
      message: n("confirm_clear"),
      action: async () => {
        r(!0), a(0), i(`${n("op_clear")}...`);
        try {
          await e.current?.clear(), p([]), f(), l(null), _(), m(), g.current.clear(), b(), d({ loaded: 0, total: 0 }), N.current.clear(), x(), s(), i(n("ready"));
        } catch (k) {
          console.error("清空场景失败:", k);
        } finally {
          r(!1);
        }
      }
    });
  }, [
    _,
    N,
    g,
    m,
    x,
    f,
    b,
    e,
    d,
    u,
    r,
    a,
    l,
    p,
    i,
    n,
    s
  ]), B = U((S = "scene") => {
    const k = e.current;
    if (k)
      try {
        const M = k.renderer, L = k.scene, W = L.background;
        S === "transparent" ? (L.background = null, M.setClearAlpha(0)) : M.setClearAlpha(1), M.render(L, k.camera);
        const $ = k.canvas.toDataURL("image/png"), de = document.createElement("a");
        de.href = $, de.download = S === "transparent" ? "screenshot-transparent.png" : "screenshot.png", de.click(), L.background = W, M.setClearAlpha(1), M.render(L, k.camera), o({ message: n("success"), type: "success" });
      } catch (M) {
        console.error(M), o({ message: n("failed"), type: "error" });
      }
  }, [e, o, n]);
  return {
    getDefaultExportFileName: P,
    handleExport: C,
    handleClear: I,
    handleScreenshot: B
  };
}
function Lo({
  sceneMgrRef: e,
  canvasRef: n,
  activeTool: r,
  setActiveTool: a,
  measureType: i,
  setMeasureType: o,
  pickEnabled: h,
  selectedUuids: u,
  setSelectedUuids: p,
  setSelectedProps: l,
  setMousePos: d,
  setHighlightedMeasureId: f,
  handleSelect: _,
  handleContextMenu: m,
  handleUndoVisibility: b,
  clearSelectionState: x
}) {
  const s = se(null), g = se(null), N = se(null);
  ce(() => {
    const y = e.current, P = n.current;
    if (!y || !P) return;
    const Y = 6, C = (k) => {
      s.current = {
        x: k.clientX,
        y: k.clientY,
        moved: !1,
        button: k.button
      };
    }, I = (k) => {
      const M = s.current;
      if (!M || M.button !== 0 || M.moved) {
        s.current = null;
        return;
      }
      if (s.current = null, r !== "boxSelect") {
        if (r === "measure") {
          if (i !== "none") {
            const W = y.getRayIntersects(k.clientX, k.clientY);
            if (W) {
              const $ = W.object.uuid;
              y.addMeasurePoint(W.point, $);
              return;
            }
          }
          const L = y.pickMeasurement(k.clientX, k.clientY);
          if (L) {
            f(L), y.highlightMeasurement(L);
            return;
          }
          f(null), y.highlightMeasurement(null);
          return;
        }
        if (h) {
          const L = y.pick(k.clientX, k.clientY);
          _(L ? L.object : null, L ? L.intersect : null, k.ctrlKey);
        }
      }
    }, B = (k) => {
      if (s.current && !s.current.moved) {
        const M = k.clientX - s.current.x, L = k.clientY - s.current.y;
        M * M + L * L > Y * Y && (s.current.moved = !0);
      }
      if (r === "measure") {
        y.updateMeasureHover(k.clientX, k.clientY), d(null);
        return;
      }
      if (k.buttons !== 0) {
        N.current = null, g.current !== null && (cancelAnimationFrame(g.current), g.current = null), d(null);
        return;
      }
      N.current = { x: k.clientX, y: k.clientY }, g.current === null && (g.current = requestAnimationFrame(() => {
        g.current = null;
        const M = N.current;
        if (!M) return;
        const L = y.getRayIntersects(M.x, M.y);
        d(L ? L.point : null);
      }));
    }, S = (k) => {
      if ((k.key === "z" || k.key === "Z") && (k.ctrlKey || k.metaKey)) {
        b();
        return;
      }
      k.key === "Escape" && (r === "measure" && i !== "none" && (o("none"), y.startMeasurement("none")), r === "boxSelect" && (y.cancelBoxSelect(), a("none")), x());
    };
    return P.addEventListener("mousedown", C), P.addEventListener("click", I), P.addEventListener("mousemove", B), P.addEventListener("contextmenu", m), window.addEventListener("keydown", S), () => {
      g.current !== null && (cancelAnimationFrame(g.current), g.current = null), N.current = null, P.removeEventListener("mousedown", C), P.removeEventListener("click", I), P.removeEventListener("mousemove", B), P.removeEventListener("contextmenu", m), window.removeEventListener("keydown", S);
    };
  }, [
    r,
    n,
    x,
    m,
    _,
    b,
    i,
    h,
    e,
    a,
    f,
    o,
    d
  ]), ce(() => {
    const y = e.current, P = n.current;
    if (!y || !P || r !== "boxSelect") return;
    y.controls.mouseButtons.LEFT = void 0;
    const Y = (B) => {
      B.button === 0 && y.startBoxSelect(B.clientX, B.clientY);
    }, C = (B) => {
      y.updateBoxSelect(B.clientX, B.clientY);
    }, I = (B) => {
      if (B.button !== 0) return;
      const S = y.endBoxSelect();
      if (S.length > 0) {
        const k = B.shiftKey ? [.../* @__PURE__ */ new Set([...u, ...S])] : S;
        p(k), l(null), y.highlightObjects(k);
      }
    };
    return P.addEventListener("pointerdown", Y), window.addEventListener("pointermove", C), window.addEventListener("pointerup", I), () => {
      P.removeEventListener("pointerdown", Y), window.removeEventListener("pointermove", C), window.removeEventListener("pointerup", I), y.controls && (y.controls.mouseButtons.LEFT = E.MOUSE.ROTATE), y.cancelBoxSelect();
    };
  }, [r, n, e, u, l, p]);
}
const Eo = [
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
function Io({
  sceneMgrRef: e,
  t: n,
  processFiles: r,
  loadItemsIntoScene: a,
  setLoading: i,
  setStatus: o,
  setProgress: h,
  setToast: u,
  setActiveTool: p,
  setSelectedUuids: l,
  setSelectedProps: d,
  resetMeasurementState: f,
  updateTree: _,
  isDev: m
}) {
  const b = U(async (y) => {
    y.target.files?.length && (await r(Array.from(y.target.files)), y.target.value = "");
  }, [r]), x = U(async (y) => {
    const P = e.current;
    if (!y.target.files?.length || !P) return;
    const Y = Array.from(y.target.files);
    if (y.target.value = "", Y.filter((I) => I.name.toLowerCase().endsWith(".nbim")).length > 0) {
      u({ message: n("unsupported_format"), type: "info" });
      return;
    }
    P.setChunkLoadingEnabled?.(!1), P.setContentVisible?.(!1), i(!0), o(`${n("processing")}...`), h(0), p("none");
    try {
      await P.clear(), l([]), d(null), f(), _(), await a(Y), _(), o(`${n("processing")}...`), await P.exportNbim(), o(n("success")), u({ message: n("success"), type: "success" });
    } catch (I) {
      console.error("[ThreeViewer] handleBatchConvert error:", I), o(n("failed")), u({ message: `${n("failed")}: ${I.message}`, type: "error" });
    } finally {
      try {
        await e.current?.clear(), _();
      } catch {
      }
      e.current?.setChunkLoadingEnabled?.(!0), e.current?.setContentVisible?.(!0), i(!1);
    }
  }, [
    a,
    f,
    e,
    p,
    i,
    h,
    d,
    l,
    o,
    u,
    n,
    _
  ]), s = U(async () => {
    const y = window.prompt(n("menu_open_url"), "http://");
    if (!(!y || !y.startsWith("http"))) {
      m && console.log("[ThreeViewer] handleOpenUrl called with:", y), i(!0), o(`${n("processing")}...`);
      try {
        await r([y]);
      } catch (P) {
        console.error("[ThreeViewer] handleOpenUrl error:", P), o(n("failed")), u({ message: `${n("failed")}: ${P.message}`, type: "error" });
      } finally {
        i(!1);
      }
    }
  }, [m, r, i, o, u, n]), g = U((y) => {
    y.preventDefault(), y.stopPropagation();
  }, []), N = U(async (y) => {
    if (y.preventDefault(), y.stopPropagation(), !y.dataTransfer.files?.length) return;
    const P = Array.from(y.dataTransfer.files), Y = P.filter((C) => {
      const I = C.name.substring(C.name.lastIndexOf(".")).toLowerCase();
      return Eo.includes(I);
    });
    Y.length < P.length && u({ message: n("unsupported_format"), type: "info" }), Y.length > 0 && await r(Y);
  }, [r, u, n]);
  return {
    handleOpenFiles: b,
    handleBatchConvert: x,
    handleOpenUrl: s,
    handleDragOver: g,
    handleDrop: N
  };
}
function Do(e) {
  const {
    propShowOutline: n,
    propShowProperties: r,
    setShowOutline: a,
    setShowProps: i
  } = e, [o, h] = V(260), [u, p] = V(300), l = se(!1), d = se(!1);
  return ce(() => {
    n !== void 0 && a(n);
  }, [n, a]), ce(() => {
    r !== void 0 && i(r);
  }, [r, i]), ce(() => {
    const f = (m) => {
      if (l.current && h(Math.max(150, Math.min(500, m.clientX))), d.current) {
        const b = window.innerWidth - m.clientX;
        p(Math.max(200, Math.min(600, b)));
      }
    }, _ = () => {
      l.current = !1, d.current = !1;
    };
    return window.addEventListener("mousemove", f), window.addEventListener("mouseup", _), () => {
      window.removeEventListener("mousemove", f), window.removeEventListener("mouseup", _);
    };
  }, []), {
    leftWidth: o,
    rightWidth: u,
    resizingLeft: l,
    resizingRight: d
  };
}
const Ao = { x: [0, 100], y: [0, 100], z: [0, 100] }, zo = { x: !1, y: !1, z: !1 };
function Bo({ initialSettings: e, mgrInstance: n }) {
  const [r, a] = V("none"), [i, o] = V(!1), [h, u] = V(32), [p, l] = V("radial"), [d, f] = V("none"), [_, m] = V([]), [b, x] = V(null), [s, g] = V(!1), [N, y] = V(Ao), [P, Y] = V(zo), [C, I] = st(
    "3dbrowser_clipHelperVisible",
    e?.clip?.helperVisible ?? !1,
    {
      serializer: ($) => String($),
      parser: ($) => $ === "true"
    }
  ), [B, S] = st(
    "3dbrowser_clipHelperOpacity",
    e?.clip?.helperOpacity ?? 0.12,
    {
      serializer: ($) => String($),
      parser: ($) => {
        const de = Number($);
        return Number.isFinite(de) ? de : 0.12;
      }
    }
  ), k = Ee(
    () => Math.min(0.35, Math.max(0.05, B)),
    [B]
  );
  return ce(() => {
    k !== B && S(k);
  }, [B, k, S]), ce(() => {
    n && n.setClipHelperOptions({
      visible: C,
      opacity: k
    });
  }, [C, n, k]), ce(() => {
    n && r !== "measure" && (n.clearMeasurementPreview(), n.highlightMeasurement(null), x(null), f("none"));
  }, [r, n]), ce(() => {
    if (!n || (n.setClippingEnabled(s), !s)) return;
    let $ = n.computeTotalBounds(!0);
    $.isEmpty() && ($ = n.computeTotalBounds(!1)), $.isEmpty() || n.updateClippingPlanes($, N, P);
  }, [P, s, N, n]), ce(() => {
    n && n.startMeasurement(d);
  }, [d, n]), ce(() => {
    n && n.setExplodeEnabled(i);
  }, [i, n]), ce(() => {
    n && n.setExplodeStrength(h);
  }, [h, n]), ce(() => {
    n && n.setExplodeMode(p);
  }, [p, n]), {
    activeTool: r,
    setActiveTool: a,
    explodeEnabled: i,
    setExplodeEnabled: o,
    explodeStrength: h,
    setExplodeStrength: u,
    explodeMode: p,
    setExplodeMode: l,
    resetExplodeState: () => {
      o(!1), u(32), l("radial");
    },
    measureType: d,
    setMeasureType: f,
    measureHistory: _,
    setMeasureHistory: m,
    highlightedMeasureId: b,
    setHighlightedMeasureId: x,
    resetMeasurementState: () => {
      m([]), x(null), f("none");
    },
    handleMeasureUpdate: ($) => {
      m($.map((de) => ({ id: de.id, type: de.type, val: de.val })));
    },
    clipEnabled: s,
    setClipEnabled: g,
    clipValues: N,
    setClipValues: y,
    clipActive: P,
    setClipActive: Y,
    clipHelperVisible: C,
    setClipHelperVisible: I,
    clipHelperOpacity: k,
    setClipHelperOpacity: S
  };
}
const $t = 400;
function Fo() {
  return new Promise((e) => {
    window.requestAnimationFrame(() => e());
  });
}
function Vo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  setSelectedProps: a,
  updateTree: i,
  resetLocateState: o
}) {
  const [h, u] = V({
    x: 0,
    y: 0,
    visible: !1
  }), [p, l] = V(/* @__PURE__ */ new Set()), [d, f] = V(/* @__PURE__ */ new Set()), _ = se([]), m = U(() => {
    u((C) => ({ ...C, visible: !1 }));
  }, []), b = U((C) => {
    C.preventDefault(), C.stopPropagation(), u({
      x: C.clientX,
      y: C.clientY,
      visible: !0
    });
  }, []), x = U(() => {
    const C = e.current;
    if (!C || n.length === 0) return;
    const I = n.map((S) => {
      const k = C.contentGroup.getObjectByProperty("uuid", S);
      return { uuid: S, visible: k ? k.visible : !0 };
    });
    _.current.push(I);
    const B = [...n];
    r([]), a(null), C.highlightObjects([]), m(), (async () => {
      for (let M = 0; M < B.length; M += $t) {
        const L = B.slice(M, M + $t), W = M + $t >= B.length;
        C.setObjectsVisibility(L, !1, { deferRefresh: !W }), M + $t < B.length && await Fo();
      }
      const S = new Set(p), k = new Set(d);
      B.forEach((M) => {
        S.add(M), k.delete(M);
      }), l(S), f(k), i();
    })();
  }, [
    m,
    p,
    d,
    e,
    n,
    a,
    r,
    i
  ]), s = U(() => {
    const C = e.current;
    if (!C) return;
    if (C.restoreLocateIsolation()) {
      l(/* @__PURE__ */ new Set()), f(/* @__PURE__ */ new Set()), o(), C.clearLocateFocus(), m();
      return;
    }
    (p.size > 0 || d.size > 0) && (C.setAllVisibility(!0), l(/* @__PURE__ */ new Set()), f(/* @__PURE__ */ new Set()), i()), o(), C.clearLocateFocus(), m();
  }, [m, p, d, o, e, i]), g = U((C, I) => {
    const B = e.current;
    if (!B) return;
    _.current.push([{ uuid: C, visible: !I }]), B.setObjectVisibility(C, I);
    const S = new Set(p);
    I ? S.delete(C) : S.add(C), l(S), i();
  }, [p, e, i]), N = U((C) => {
    const I = e.current;
    I && (_.current.push([{ uuid: C, visible: !0 }]), I.setObjectVisibility(C, !1), l((B) => new Set(B).add(C)), r((B) => B.filter((S) => S !== C)), i());
  }, [e, r, i]), y = U((C) => {
    const I = e.current;
    I && (I.isolateObjects([C]), l(/* @__PURE__ */ new Set()), f(/* @__PURE__ */ new Set([C])), r([C]), I.highlightObjects([C]), i(), m());
  }, [m, e, r, i]), P = U(() => {
    const C = e.current;
    if (!C || n.length === 0) return;
    const I = n.filter((B) => !d.has(B));
    I.length > 0 && (C.isolateObjects(n), f(/* @__PURE__ */ new Set([...d, ...I])), l(/* @__PURE__ */ new Set()), i()), m();
  }, [m, d, e, n, i]), Y = U(() => {
    const C = e.current;
    if (!C || _.current.length === 0) return;
    const I = _.current.pop();
    if (!I) return;
    C.applyVisibilityBatch(I, {
      recomputeBounds: !0,
      refreshExplode: !1,
      invalidateInteractables: !0
    });
    const B = new Set(p);
    I.forEach((S) => {
      S.visible ? B.delete(S.uuid) : B.add(S.uuid);
    }), l(B), i();
  }, [p, e, i]);
  return {
    contextMenu: h,
    hiddenUuids: p,
    isolatedUuids: d,
    setHiddenUuids: l,
    setIsolatedUuids: f,
    handleContextMenu: b,
    closeContextMenu: m,
    handleHideSelected: x,
    handleShowAll: s,
    handleToggleVisibility: g,
    handleHideObject: N,
    handleIsolateObject: y,
    handleIsolateSelection: P,
    handleUndoVisibility: Y
  };
}
function Po({
  currentFileSetId: e,
  sceneMgrRef: n,
  setToast: r,
  setConfirmState: a,
  t: i,
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
  const l = U((s) => {
    if (e) {
      p(s);
      try {
        localStorage.setItem(`viewpoints_${e}`, JSON.stringify(s));
      } catch (g) {
        console.error("Failed to persist viewpoints", g);
      }
    }
  }, [e]), d = U(() => {
    const s = n.current;
    if (!s) return "";
    try {
      s.renderer.render(s.scene, s.camera);
      const g = s.canvas, N = Math.min(640 / g.width, 360 / g.height), y = Math.round(g.width * N), P = Math.round(g.height * N), Y = document.createElement("canvas");
      Y.width = y, Y.height = P;
      const C = Y.getContext("2d");
      return C ? (C.drawImage(g, 0, 0, y, P), Y.toDataURL("image/jpeg", 0.92)) : "";
    } catch (g) {
      return console.error("Failed to capture thumbnail", g), "";
    }
  }, [n]), f = U((s, g = {
    visibility: !0,
    selection: !0,
    clip: !0,
    explode: !0
  }, N) => {
    const y = n.current;
    if (!y || !e) {
      r({ message: i("no_models"), type: "info" });
      return;
    }
    if (y.contentGroup.children.length === 0) {
      r({ message: i("no_models"), type: "info" });
      return;
    }
    const P = s || `${i("viewpoint_title")} ${u.length + 1}`, Y = y.getCameraState(), C = d(), I = o(g), B = N ? u.map((S) => S.id === N ? { ...S, name: P, cameraState: Y, image: C, saveOptions: g, stateSnapshot: I } : S) : [...u, { id: Date.now().toString(), name: P, cameraState: Y, image: C, saveOptions: g, stateSnapshot: I }];
    l(B), r({ message: i("success"), type: "success" });
  }, [o, d, e, l, n, r, i, u]), _ = U((s, g) => {
    l(u.map((N) => N.id === s ? { ...N, name: g } : N));
  }, [l, u]), m = U(async (s) => {
    s.cameraState && (n.current?.setCameraState(s.cameraState), await h(s.stateSnapshot), r({ message: `${i("viewpoint_loading")}: ${s.name}`, type: "info" }));
  }, [h, n, r, i]), b = U((s) => {
    const g = u.find((N) => N.id === s);
    g && f(
      g.name,
      g.saveOptions || {
        visibility: !0,
        selection: !0,
        clip: !0,
        explode: !0
      },
      s
    );
  }, [f, u]), x = U((s) => {
    const g = u.find((N) => N.id === s);
    a({
      isOpen: !0,
      title: i("viewpoint_title"),
      message: `${i("confirm_delete")} "${g?.name || i("viewpoint_default_name")}"?`,
      action: () => {
        l(u.filter((N) => N.id !== s));
      }
    });
  }, [l, a, i, u]);
  return {
    viewpoints: u,
    handleSaveViewpoint: f,
    handleUpdateViewpointName: _,
    handleLoadViewpoint: m,
    handleOverwriteViewpoint: b,
    handleDeleteViewpoint: x
  };
}
const On = [".lmb", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3ds", ".dae", ".stp", ".step", ".igs", ".iges"], Tn = [
  "ResizeObserver loop completed",
  "ResizeObserver loop limit",
  "texImage3D: FLIP_Y or PREMULTIPLY_ALPHA"
];
function $o({
  allowDragOpen: e,
  mgrInstance: n,
  viewportRef: r,
  t: a,
  processFiles: i,
  setToast: o,
  setErrorState: h
}) {
  ce(() => {
    if (!r.current || !n) return;
    const u = new ResizeObserver((l) => {
      const d = l[0];
      if (!d) return;
      const { width: f, height: _ } = d.contentRect;
      f === 0 || _ === 0 || requestAnimationFrame(() => {
        n.resize(f, _);
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
      const f = d.filter((m) => {
        const b = `.${m.name.split(".").pop()?.toLowerCase()}`;
        return !On.includes(b);
      });
      f.length > 0 && o({
        message: `${a("failed")}: 不支持的格式 - ${f.map((m) => m.name).join(", ")}`,
        type: "error"
      });
      const _ = d.filter((m) => {
        const b = `.${m.name.split(".").pop()?.toLowerCase()}`;
        return On.includes(b);
      });
      _.length > 0 && await i(_);
    };
    return window.addEventListener("dragover", u), window.addEventListener("drop", p), () => {
      window.removeEventListener("dragover", u), window.removeEventListener("drop", p);
    };
  }, [e, i, o, a]), ce(() => {
    const u = (l) => {
      const d = l.message || "";
      !d && !l.error || Tn.some((f) => d.includes(f)) || (console.error("Global Error:", l.error || d), h({
        isOpen: !0,
        title: a("failed"),
        message: d || "An unexpected error occurred",
        detail: l.error?.stack || ""
      }));
    }, p = (l) => {
      if (!l.reason) return;
      const d = l.reason?.message || String(l.reason);
      Tn.some((f) => d.includes(f)) || (console.error("Unhandled Rejection:", l.reason), h({
        isOpen: !0,
        title: a("failed"),
        message: d || "A promise was rejected without reason",
        detail: l.reason?.stack || ""
      }));
    };
    return window.addEventListener("error", u), window.addEventListener("unhandledrejection", p), () => {
      window.removeEventListener("error", u), window.removeEventListener("unhandledrejection", p);
    };
  }, [h, a]);
}
function ct(e, n, r, a) {
  r && e.push(...wt(n, r, a));
}
function Rn(e, n, r, a) {
  Object.entries(n).forEach(([i, o]) => {
    if (Array.isArray(o) || typeof o == "string" || typeof o == "number" || typeof o == "boolean") {
      ct(r, e, [{ key: i, value: o, source: a }], a);
      return;
    }
    o && typeof o == "object" && Object.entries(o).forEach(([h, u]) => {
      ct(r, e, [{ key: `${i}.${h}`, value: u, rawKey: h, source: a }], a);
    });
  });
}
function Et(e) {
  return String(e ?? "").trim();
}
function Ut(e, n) {
  if (!e || !Array.isArray(e.rows)) return "";
  const r = new Set(n.map((i) => Pe(i))), a = e.rows.find((i) => {
    const o = Pe(i?.key || ""), h = Pe(i?.path || ""), u = Pe(i?.rawKey || "");
    return r.has(o) || r.has(h) || r.has(u);
  });
  return Et(a?.value);
}
function Ot(e, n, r, a = "") {
  const i = e.getNbimPropertySearchDocument?.(n), o = Et(
    Ut(i, ["IFC 标识.ExpressID", "IFC.ExpressID", "ExpressID"]) || r?.userData?.expressID
  ), h = Et(e.getBimIdByUuid?.(n) || i?.bimId || r?.userData?.bimId), u = Et(
    Ut(i, ["IFC 标识.类型", "IFC.类型", "IFC Type", "ifcType"]) || r?.userData?.ifcType || r?.type
  ), p = Et(
    Ut(i, ["基本信息.名称", "Object.name", "Name", "名称"]) || r?.name || i?.name || a
  );
  return h && h !== n ? h : o ? `${u && u !== "Mesh" ? u : "IFC"} #${o}` : p && p !== "Mesh" && p !== n ? p : a || n;
}
function Oo({
  sceneMgrRef: e,
  selectedUuids: n,
  setSelectedUuids: r,
  onSelectObject: a,
  focusObjectsInView: i,
  t: o,
  setToast: h
}) {
  const [u, p] = V([
    { id: "cond_init", propertyName: "", operator: "contains", value: "" }
  ]), [l, d] = V([]), [f, _] = V(!1), [m, b] = V(0), [x, s] = V(""), [g, N] = V([]), y = se(-1), P = se(0), Y = se(!1), C = U(() => {
    const K = e.current;
    if (!K?.getNbimPropertyNameIndex) {
      N([]);
      return;
    }
    const O = typeof K.getNbimPropertyNameIndexVersion == "function" ? K.getNbimPropertyNameIndexVersion() : Date.now();
    if (y.current === O) return;
    y.current = O;
    const q = K.getNbimPropertyNameIndex() || [];
    N(
      q.map((F) => ({
        value: String(F.path || ""),
        label: String(F.path || ""),
        count: Number(F.count || 0)
      })).filter((F) => F.value)
    );
  }, [e]);
  ce(() => {
    C();
    const K = window.setInterval(C, 500);
    return () => window.clearInterval(K);
  }, [C]);
  const I = U((K, O) => {
    let q = O;
    for (; q; ) {
      const T = q.userData?.originalUuid || q.userData?.modelUuid || q.userData?.rootUuid;
      if (T) return String(T);
      q = q.parent;
    }
    const F = e.current?.getStructureNodes(K)?.[0];
    return F?.userData?.originalUuid ? String(F.userData.originalUuid) : K;
  }, [e]), B = U((K, O) => {
    const q = [], F = O?.userData?.nbimSearchDocument || e.current?.getNbimPropertySearchDocument?.(K);
    F && Array.isArray(F.rows) && F.rows.forEach((A, ee) => {
      ct(q, A.group || "NBIM", [{
        key: A.key,
        value: A.value,
        rawKey: A.rawKey,
        id: `${F.uuid || K}::${A.path || A.key}::${ee}`,
        source: A.source || "property-index"
      }], A.source || "property-index");
    }), ct(q, "Object", [
      { key: "name", value: O?.name, source: "object" },
      { key: "type", value: O?.type, source: "object" },
      { key: "uuid", value: K, source: "object" },
      { key: "bimid", value: e.current?.getBimIdByUuid(K) || "", source: "object" }
    ]);
    const T = O?.userData || {};
    Object.entries(T).forEach(([A, ee]) => {
      typeof ee == "string" || typeof ee == "number" || typeof ee == "boolean" ? ct(q, "UserData", [{ key: A, value: ee, source: "userData" }], "userData") : Array.isArray(ee) && ee.forEach((J, R) => {
        ct(q, "UserData", [{ key: A, value: J, id: `userData::${A}::${R}`, source: "userData" }], "userData");
      });
    });
    const ue = O?.userData?.ifcMetadata || {};
    if (Rn("IFC Metadata", ue, q, "ifcMetadata"), !F) {
      const A = e.current?.getNbimProperties(K);
      A && typeof A == "object" && Rn("NBIM", A, q, "nbim");
      const ee = e.current?.getNbimIfcPropertyGroups(K, "normalized");
      ee && typeof ee == "object" && Object.entries(ee).forEach(([J, R]) => {
        ct(q, J, R, "nbim-ifc");
      });
    }
    return q;
  }, [e]), S = U(() => {
    const K = [], O = e.current;
    if (!O) return K;
    const q = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set();
    O.contentGroup.updateMatrixWorld(!0), O.contentGroup.traverse((J) => {
      const R = J;
      if (!R.isMesh || !R.geometry || R.userData?.isIfcGridHelper) return;
      q.add(R.uuid);
      const H = O.getBimIdByUuid(R.uuid), ne = R.userData?.expressID;
      F.add(R.uuid), H && F.add(String(H)), ne != null && F.add(String(ne));
      const me = String(
        H || ne || R.uuid
      );
      T.has(me) || (T.add(me), K.push({
        uuid: R.uuid,
        name: Ot(O, R.uuid, R, R.name || R.uuid),
        type: R.type || "Mesh",
        modelId: I(R.uuid, R),
        sourceLabel: "object",
        source: R
      }));
    });
    const ue = (J) => {
      J.forEach((R) => {
        if (!R || R.visible === !1) return;
        const H = String(R.id || "");
        if (H && R.bimId) {
          const ne = String(R.bimId || H);
          !T.has(ne) && q.has(H) && (F.add(H), F.add(String(R.bimId)), T.add(ne), K.push({
            uuid: H,
            name: Ot(O, H, null, String(R.name || H)),
            type: String(R.type || "Node"),
            modelId: String(R.userData?.originalUuid || H),
            sourceLabel: "structure",
            source: {
              name: R.name,
              type: R.type,
              userData: R.userData || {}
            }
          }));
        }
        Array.isArray(R.children) && R.children.length > 0 && ue(R.children);
      });
    };
    Array.isArray(O.structureRoot?.children) && O.structureRoot.children.length > 0 && ue(O.structureRoot.children);
    const A = O.getAllNbimPropertySearchDocuments?.() || [], ee = /* @__PURE__ */ new Set();
    return A.forEach((J) => {
      if (!J?.rows || !Array.isArray(J.rows)) return;
      const R = String(J.uuid || ""), H = String(J.bimId || ""), ne = String(Ut(J, ["IFC 标识.ExpressID", "IFC.ExpressID", "ExpressID"]) || ""), me = H ? O.resolveNodeUuidByBimId?.(H) : null, Q = String(me || R || H || ne || "");
      if (!Q) return;
      const z = !!O.getStructureNodes?.(Q)?.length || !!(H && O.resolveNodeUuidByBimId?.(H)), w = q.has(Q) || !!H && F.has(H) || !!ne && F.has(ne);
      if (!z && !w) return;
      const le = String(J.owner || "") + "::" + String(J.bimId || Q);
      if (ee.has(le)) return;
      ee.add(le);
      const pe = Ot(O, Q, null, String(J.name || J.bimId || J.uuid));
      K.push({
        uuid: Q,
        name: pe,
        type: "PropertyIndex",
        modelId: String(J.owner || Q),
        sourceLabel: "property-index",
        source: {
          name: pe,
          type: "PropertyIndex",
          userData: { nbimSearchDocument: J, originalUuid: J.owner, bimId: J.bimId }
        }
      });
    }), K;
  }, [I, e]), k = U((K, O, q) => O === "equals" ? K === q : O === "contains" ? K.includes(q) : O === "notContains" ? !K.includes(q) : O === "startsWith" ? K.startsWith(q) : O === "endsWith" ? K.endsWith(q) : !1, []), M = U((K, O) => O ? K.normalizedKey === O || K.normalizedPath === O || !!K.rawKey && Pe(K.rawKey) === O || K.normalizedPath.endsWith(`.${O}`) : !1, []), L = U(async () => {
    if (!e.current || Y.current) return;
    C();
    const K = u.map((F) => ({
      ...F,
      normalizedPropertyName: Pe(F.propertyName),
      normalizedValue: Pe(F.value)
    })).filter((F) => F.normalizedPropertyName && F.normalizedValue);
    if (K.length === 0) {
      d([]), _(!1), b(0), s(""), h({ message: o("search_invalid_condition"), type: "info" }), e.current.highlightObjects(n);
      return;
    }
    const O = ++P.current, q = performance.now();
    Y.current = !0, _(!0), b(0), s(o("searching"));
    try {
      await new Promise((Q) => window.requestAnimationFrame(() => Q()));
      const F = e.current, T = F?.getAllNbimPropertySearchDocuments?.() || [], ue = [], A = /* @__PURE__ */ new Set();
      let ee = performance.now(), J = performance.now(), R = !1;
      if (T.length > 0) {
        const Q = T.length;
        for (let z = 0; z < T.length; z++) {
          if (P.current !== O) {
            R = !0, s(o("search_cancelled"));
            break;
          }
          const w = T[z], le = Array.isArray(w?.rows) ? w.rows : [];
          if (le.length === 0) continue;
          let pe = null;
          const G = /* @__PURE__ */ new Set();
          if (K.forEach((X, he) => {
            const re = le.filter((Ce) => {
              const ke = Pe(Ce?.key || ""), Ge = Pe(Ce?.path || ""), j = Pe(Ce?.rawKey || ""), ae = X.normalizedPropertyName;
              return ke === ae || Ge === ae || j === ae || Ge.endsWith(`.${ae}`);
            }), te = re.some((Ce) => {
              const ke = Pe(Ce?.value);
              return k(ke, X.operator, X.normalizedValue);
            });
            te && re.forEach((Ce) => {
              const ke = Pe(Ce?.value);
              k(ke, X.operator, X.normalizedValue) && G.add(String(Ce?.path || Ce?.key || ""));
            }), he === 0 || pe === null ? pe = te : (X.connector || "AND") === "AND" ? pe = !!pe && te : pe = !!pe || te;
          }), pe) {
            const X = String(w?.bimId || ""), he = X ? F?.resolveNodeUuidByBimId?.(X) : null, re = String(he || w?.uuid || X || "");
            re && !A.has(re) && (A.add(re), ue.push({
              uuid: re,
              name: Ot(e.current, re, null, String(w?.name || X || re)),
              type: String(w?.type || "PropertyIndex"),
              modelId: String(w?.owner || re),
              source: "property-index",
              matchedBy: Array.from(G).filter(Boolean)
            }));
          }
          if ((z + 1) % 250 === 0 || z === T.length - 1) {
            const X = performance.now(), he = Q > 0 ? (z + 1) / Q * 100 : 100;
            (X - ee > 80 || z === T.length - 1) && (b(he), ee = X), (X - J > 16 || z === T.length - 1) && (J = X, await new Promise((re) => window.setTimeout(re, 0)));
          }
        }
        R || (d(ue), b(100), s(`${o("search_results")}: ${ue.length}`));
        return;
      }
      const H = S(), ne = H.length, me = 120;
      for (let Q = 0; Q < H.length; Q++) {
        if (P.current !== O) {
          R = !0, s(o("search_cancelled"));
          break;
        }
        const z = H[Q], w = B(z.uuid, z.source);
        let le = null;
        const pe = /* @__PURE__ */ new Set();
        if (K.forEach((G, X) => {
          const he = w.filter((te) => M(te, G.normalizedPropertyName)), re = he.some((te) => k(te.normalizedValue, G.operator, G.normalizedValue));
          re && he.forEach((te) => {
            k(te.normalizedValue, G.operator, G.normalizedValue) && pe.add(te.path);
          }), X === 0 || le === null ? le = re : (G.connector || "AND") === "AND" ? le = !!le && re : le = !!le || re;
        }), le && !A.has(z.uuid) && (A.add(z.uuid), ue.push({
          uuid: z.uuid,
          name: z.name || z.uuid,
          type: z.type,
          modelId: z.modelId,
          source: z.sourceLabel,
          matchedBy: Array.from(pe)
        })), (Q + 1) % me === 0 || Q === H.length - 1) {
          const G = performance.now(), X = ne > 0 ? (Q + 1) / ne * 100 : 100;
          (G - ee > 80 || Q === H.length - 1) && (b(X), ee = G), (G - J > 16 || Q === H.length - 1) && (J = G, await new Promise((he) => window.setTimeout(he, 0)));
        }
      }
      R || (d(ue), b(100), s(`${o("search_results")}: ${ue.length}`));
    } finally {
      const F = performance.now() - q, T = 220;
      F < T && await new Promise((ue) => window.setTimeout(ue, T - F)), _(!1), Y.current = !1;
    }
  }, [B, S, k, M, e, u, n, h, C, o]), W = U((K) => {
    if (!e.current) return;
    const O = e.current.contentGroup.getObjectByProperty("uuid", K);
    if (i({ uuids: [K], focusUuid: K }), O) {
      a(O);
      return;
    }
    r([K]);
  }, [i, a, e, r]), $ = U(() => {
    P.current++, d([]), _(!1), b(0), s(""), Y.current = !1, e.current && e.current.highlightObjects(n);
  }, [e, n]), de = U(() => {
    Y.current && (P.current++, s(o("search_cancelling")));
  }, [o]);
  return {
    searchConditions: u,
    setSearchConditions: p,
    searchResults: l,
    searching: f,
    searchProgress: m,
    searchStatus: x,
    propertyFieldOptions: g,
    handleRunPropertySearch: L,
    handleApplySearchResultHighlight: W,
    handleClearSearchResult: $,
    handleCancelSearch: de
  };
}
function To(e, n) {
  const r = Math.max(0, e.min.x - n.max.x, n.min.x - e.max.x), a = Math.max(0, e.min.y - n.max.y, n.min.y - e.max.y), i = Math.max(0, e.min.z - n.max.z, n.min.z - e.max.z);
  return Math.sqrt(r * r + a * a + i * i);
}
function Ro(e, n) {
  e.boundingBox || e.computeBoundingBox();
  const r = e.boundingBox;
  if (!r) return null;
  const a = new E.Vector3(), i = new E.Vector3();
  r.getCenter(a), r.getSize(i).multiplyScalar(0.5), a.applyMatrix4(n);
  const o = new E.Matrix3().setFromMatrix4(n);
  return new Ii(a, i, o);
}
function It(e) {
  return String(e ?? "").trim();
}
function dn(e, n) {
  if (!e || !Array.isArray(e.rows)) return "";
  const r = n.map((i) => i.toLowerCase()), a = e.rows.find((i) => {
    const o = String(i?.key || "").toLowerCase(), h = String(i?.path || "").toLowerCase(), u = String(i?.rawKey || "").toLowerCase();
    return r.some((p) => o === p || h === p || u === p || h.endsWith(`.${p}`));
  });
  return It(a?.value);
}
function Uo(e, n, r, a = "") {
  const i = e.getNbimPropertySearchDocument?.(n), o = It(
    dn(i, ["ExpressID", "IFC 标识.ExpressID", "IFC.ExpressID"]) || r?.userData?.expressID
  ), h = It(e.getBimIdByUuid?.(n) || i?.bimId || r?.userData?.bimId), u = It(
    dn(i, ["类型", "IFC 标识.类型", "ifcType"]) || r?.userData?.ifcType || r?.type
  ), p = It(
    dn(i, ["名称", "Name"]) || r?.name || i?.name || a
  );
  return h && h !== n ? h : o ? `${u && u !== "Mesh" ? u : "IFC"} #${o}` : p && p !== "Mesh" && p !== n ? p : a || n;
}
function jo(e) {
  const n = [], r = Array.isArray(e) ? [...e] : [], a = /* @__PURE__ */ new Set();
  for (; r.length > 0; ) {
    const i = r.pop();
    if (!i) continue;
    const o = String(i.uuid || i.id || "").trim();
    o && !a.has(o) && (a.add(o), n.push(o));
    const h = Array.isArray(i.children) ? i.children : [];
    for (let u = h.length - 1; u >= 0; u--)
      r.push(h[u]);
  }
  return n;
}
function Ho(e) {
  const n = [], r = e.contentGroup;
  return r && (r.updateMatrixWorld(!0), r.traverse((a) => {
    const i = a;
    if (!i.isMesh || !i.visible || !i.geometry || i.userData?.isIfcGridHelper || i.isBatchedMesh || (i.geometry.boundingBox || i.geometry.computeBoundingBox(), !i.geometry.boundingBox)) return;
    const o = i.geometry.boundingBox.clone().applyMatrix4(i.matrixWorld);
    o.isEmpty() || n.push({
      key: `fallback:${i.uuid}`,
      uuid: i.uuid,
      name: i.name || i.uuid,
      object: i,
      geometry: i.geometry,
      matrixWorld: i.matrixWorld.clone(),
      box: o
    });
  })), n;
}
function Go({
  sceneMgrRef: e,
  treeRoot: n,
  clashModelOptions: r,
  selectedUuids: a,
  setSelectedUuids: i,
  focusObjectsInView: o,
  t: h
}) {
  const [u, p] = V([]), [l, d] = V(!1), [f, _] = V(0), [m, b] = V(""), [x, s] = V(0), [g, N] = V([]), [y, P] = V([]), [Y, C] = V(0), [I, B] = V(0), [S, k] = V(0.05), [M, L] = V(!0), [W, $] = V(!1), [de, K] = V(!0), [O, q] = V(0), [F, T] = V("ALL"), [ue, A] = V("ALL"), ee = se(0), J = se(!1), R = se(/* @__PURE__ */ new Map()), H = Ee(() => {
    const j = /* @__PURE__ */ new Map();
    return r.forEach((ae) => j.set(ae.id, ae.name)), j;
  }, [r]), ne = U((j) => {
    let ae = j;
    for (; ae; ) {
      const D = ae.userData?.originalUuid;
      if (D) return String(D);
      ae = ae.parent;
    }
    return "";
  }, []), me = U((j, ae, D) => {
    const _e = ae.attributes.position;
    if (!_e) return null;
    const be = ae.index, oe = Math.floor(be ? be.count / 3 : _e.count / 3);
    return {
      uuid: j,
      geometry: ae,
      matrixWorld: D.clone(),
      triangleCount: oe
    };
  }, []), Q = U(() => {
    const j = e.current;
    if (!j) return [];
    const ae = R.current;
    ae.clear();
    const D = r.map((oe) => oe.id).filter(Boolean), _e = jo(n);
    let be = j.collectRenderableTargets();
    if (be.length === 0 && D.length > 0 && (be = j.collectRenderableTargets(D)), be.length === 0 && _e.length > 0) {
      const oe = /* @__PURE__ */ new Map(), we = 512;
      for (let Ne = 0; Ne < _e.length; Ne += we)
        j.collectRenderableTargets(_e.slice(Ne, Ne + we)).forEach((Ie) => {
          oe.set(Ie.key || Ie.uuid, Ie);
        });
      be = Array.from(oe.values());
    }
    return be.length === 0 && (be = Ho(j)), be.forEach((oe) => {
      if (!oe?.box || oe.box.isEmpty()) return;
      const we = j.getStructureNodes(oe.uuid) || [];
      if (we.length > 0 && we.every((ze) => ze.visible === !1)) return;
      let Ne = we[0]?.userData?.originalUuid ? String(we[0].userData.originalUuid) : ne(oe.object);
      !Ne && D.length === 1 && (Ne = D[0]);
      const Ie = {
        key: oe.key,
        uuid: oe.uuid,
        name: Uo(j, oe.uuid, oe.object, oe.name || oe.uuid),
        modelId: Ne,
        modelName: H.get(Ne) || Ne || oe.name || oe.uuid,
        box: oe.box.clone(),
        testBox: oe.box.clone(),
        obb: M ? Ro(oe.geometry, oe.matrixWorld) : null,
        meshInfo: me(oe.key, oe.geometry, oe.matrixWorld)
      };
      ae.set(Ie.key, Ie);
    }), Array.from(ae.values());
  }, [me, H, r, M, ne, e, n]), z = U((j, ae, D, _e) => {
    const be = [], oe = j.geometry.attributes.position;
    if (!oe) return be;
    const we = j.geometry.index, Ne = Math.floor(we ? we.count / 3 : oe.count / 3), Ie = Math.min(Ne, _e), ze = Ne > Ie ? Math.max(1, Math.floor(Ne / Ie)) : 1, Se = new E.Vector3(), Fe = new E.Vector3(), We = new E.Vector3(), je = new E.Vector3();
    for (let De = 0; De < Ne; De += ze) {
      const Ae = we ? we.getX(De * 3) : De * 3, rt = we ? we.getX(De * 3 + 1) : De * 3 + 1, Re = we ? we.getX(De * 3 + 2) : De * 3 + 2;
      if (Se.fromBufferAttribute(oe, Ae).applyMatrix4(j.matrixWorld), Fe.fromBufferAttribute(oe, rt).applyMatrix4(j.matrixWorld), We.fromBufferAttribute(oe, Re).applyMatrix4(j.matrixWorld), je.copy(Se).add(Fe).add(We).multiplyScalar(1 / 3), !!ae.containsPoint(je) && (be.push(je.clone()), be.length >= D))
        break;
    }
    return be;
  }, []), w = U((j, ae) => {
    const D = ae.geometry.attributes.position;
    if (!D) return !1;
    const _e = ae.geometry.index, be = Math.floor(_e ? _e.count / 3 : D.count / 3), we = Math.min(be, 12e3), Ne = be > we ? Math.max(1, Math.floor(be / we)) : 1, Ie = j.clone();
    Ie.x -= 1e-4;
    const ze = new E.Ray(Ie, new E.Vector3(1, 0, 0)), Se = new E.Vector3(), Fe = new E.Vector3(), We = new E.Vector3(), je = new E.Vector3();
    let De = 0;
    for (let Ae = 0; Ae < be; Ae += Ne) {
      const rt = _e ? _e.getX(Ae * 3) : Ae * 3, Re = _e ? _e.getX(Ae * 3 + 1) : Ae * 3 + 1, it = _e ? _e.getX(Ae * 3 + 2) : Ae * 3 + 2;
      Fe.fromBufferAttribute(D, rt).applyMatrix4(ae.matrixWorld), We.fromBufferAttribute(D, Re).applyMatrix4(ae.matrixWorld), je.fromBufferAttribute(D, it).applyMatrix4(ae.matrixWorld), !(!ze.intersectTriangle(Fe, We, je, !1, Se) || Se.x < Ie.x) && De++;
    }
    return De % 2 === 1;
  }, []), le = U((j, ae, D) => {
    if (!j.meshInfo || !ae.meshInfo || j.meshInfo.triangleCount <= 0 || ae.meshInfo.triangleCount <= 0) return !0;
    const _e = 3e4;
    if (j.meshInfo.triangleCount > _e || ae.meshInfo.triangleCount > _e) return !0;
    const be = z(j.meshInfo, D, 4, 6e3), oe = z(ae.meshInfo, D, 4, 6e3);
    return be.length === 0 || oe.length === 0 ? !1 : be.some((we) => w(we, ae.meshInfo)) || oe.some((we) => w(we, j.meshInfo));
  }, [z, w]), pe = U(async () => {
    if (!e.current || J.current) return;
    const j = ++ee.current, ae = performance.now();
    J.current = !0, d(!0), _(0), b(h("clash_collecting")), p([]), q(0);
    try {
      const D = Q();
      if (s(D.length), D.length < 2) {
        b(h("clash_insufficient_candidates"));
        return;
      }
      const _e = new Set(g), be = new Set(y), oe = _e.size > 0, we = be.size > 0, Ne = (ie, ye) => {
        const $e = r.length <= 1 && (!ie || !ye);
        return !de && ie && ye && ie === ye ? !1 : $e ? !0 : oe && we ? _e.has(ie) && be.has(ye) || _e.has(ye) && be.has(ie) : oe ? _e.has(ie) || _e.has(ye) : we ? be.has(ie) || be.has(ye) : !0;
      }, Ie = (ie) => !ie && r.length <= 1 ? !0 : oe && we ? _e.has(ie) || be.has(ie) : oe ? _e.has(ie) : we ? be.has(ie) : !0, ze = Math.max(0, S), Se = D.filter((ie) => !ie.box.isEmpty() && Ie(ie.modelId)).map((ie) => {
        const ye = ie.box.clone();
        return (Y > 0 || ze > 0) && ye.expandByScalar(Math.max(Y, ze)), {
          ...ie,
          testBox: ye
        };
      });
      if (Se.length < 2) {
        b(h("clash_no_results")), _(100);
        return;
      }
      Se.sort((ie, ye) => ie.testBox.min.x - ye.testBox.min.x), b(h("clash_running"));
      const Fe = 2e3, We = [], je = new E.Box3(), De = new E.Vector3(), Ae = Se.length;
      let rt = 0;
      for (let ie = 0; ie < Ae; ie++) {
        if (ee.current !== j) {
          b(h("clash_cancelled"));
          return;
        }
        const ye = Se[ie], $e = ye.testBox.max.x;
        for (let Be = ie + 1; Be < Ae; Be++) {
          const Oe = Se[Be];
          if (Oe.testBox.min.x > $e) break;
          if (!Ne(ye.modelId, Oe.modelId) || (rt++, !ye.testBox.intersectsBox(Oe.testBox))) continue;
          if (M && ye.obb && Oe.obb) {
            const Nt = ye.obb.clone(), ft = Oe.obb.clone();
            if (Y > 0 && (Nt.halfSize.addScalar(Y), ft.halfSize.addScalar(Y)), !Nt.intersectsOBB(ft, Number.EPSILON * 10)) continue;
          }
          je.copy(ye.box).intersect(Oe.box);
          const Ke = !je.isEmpty();
          let tt = 0;
          Ke && (je.getSize(De), tt = Math.max(0, De.x) * Math.max(0, De.y) * Math.max(0, De.z));
          const xt = Ke ? 0 : To(ye.box, Oe.box), Ct = Ke && tt >= I, pt = !Ke && ze > 0 && xt <= ze;
          if (!Ct && !pt || W && Ke && !le(ye, Oe, je)) continue;
          const mt = [ye.key, Oe.key].sort().join("::"), fe = Ct ? "hard" : "clearance", Dt = fe === "hard" ? tt > Math.max(0.5, I * 10) ? "high" : "medium" : xt <= Math.max(1e-3, ze * 0.25) ? "high" : "low";
          if (We.push({
            id: `clash_${fe}_${mt}`,
            pairKey: mt,
            groupKey: `${fe}::${ye.modelId || "unknown"}::${Oe.modelId || "unknown"}::${mt}`,
            ruleId: fe === "hard" ? "hard-clash-default" : "clearance-default",
            aUuid: ye.uuid,
            bUuid: Oe.uuid,
            aName: ye.name,
            bName: Oe.name,
            overlapVolume: tt,
            distance: xt,
            severity: Dt,
            type: fe,
            status: "new"
          }), We.length >= Fe) break;
        }
        if (We.length >= Fe) break;
        if ((ie + 1) % 50 === 0 || ie === Ae - 1) {
          const Be = 30 + (ie + 1) / Ae * 70;
          _(Be), q(rt), b(`${h("clash_running")} ${ie + 1}/${Ae}`), await new Promise((Oe) => window.setTimeout(Oe, 0));
        }
      }
      const Re = /* @__PURE__ */ new Map(), it = { high: 3, medium: 2, low: 1 };
      We.forEach((ie) => {
        const ye = Re.get(ie.pairKey);
        if (!ye)
          Re.set(ie.pairKey, ie);
        else {
          const $e = (ye.type === "hard" ? 1e3 : 0) + it[ye.severity], Be = (ie.type === "hard" ? 1e3 : 0) + it[ie.severity];
          (Be > $e || Be === $e && (ie.type === "hard" && ie.overlapVolume > ye.overlapVolume || ie.type === "clearance" && ie.distance < ye.distance)) && Re.set(ie.pairKey, ie);
        }
      });
      const ot = Array.from(Re.values()).sort((ie, ye) => ie.type !== ye.type ? ie.type === "hard" ? -1 : 1 : ie.type === "hard" ? ye.overlapVolume - ie.overlapVolume : ie.distance - ye.distance);
      p((ie) => {
        const ye = /* @__PURE__ */ new Map();
        return ie.forEach(($e) => ye.set($e.pairKey, $e.status)), ot.map(($e) => ({
          ...$e,
          status: ye.get($e.pairKey) || "new"
        }));
      }), q(rt), _(100), b(`${h("clash_results")}: ${ot.length}`), ot.length === 0 && e.current.clearLocateFocus();
    } finally {
      const D = performance.now() - ae, _e = 220;
      D < _e && await new Promise((be) => window.setTimeout(be, _e - D)), J.current = !1, d(!1);
    }
  }, [S, de, I, g, y, Y, M, W, Q, le, e, h]), G = U(() => {
    J.current && (ee.current++, b(h("clash_cancelling")));
  }, [h]), X = U(() => {
    ee.current++, J.current = !1, d(!1), _(0), b(""), s(0), q(0), T("ALL"), A("ALL"), p([]), e.current?.clearLocateFocus(), e.current?.highlightObjects(a);
  }, [e, a]), he = U((j) => {
    const ae = [j.aUuid, j.bUuid];
    o({
      uuids: ae,
      focusUuid: j.aUuid,
      highlightColors: {
        [j.aUuid]: "#ff4d4f",
        [j.bUuid]: "#1890ff"
      }
    });
  }, [o]), re = U((j, ae) => {
    p((D) => D.map((_e) => _e.id === j ? { ..._e, status: ae } : _e));
  }, []), te = U((j) => {
    p((ae) => ae.map((D) => {
      const _e = F === "ALL" || F === "NEW" && D.status === "new" || F === "CONFIRMED" && D.status === "confirmed" || F === "RESOLVED" && D.status === "resolved", be = ue === "ALL" || ue === "HARD" && D.type === "hard" || ue === "CLEARANCE" && D.type === "clearance";
      return _e && be ? { ...D, status: j } : D;
    }));
  }, [F, ue]), Ce = U(() => {
    if (u.length === 0) return;
    const j = (Se) => {
      const Fe = String(Se ?? "");
      return Fe.includes(",") || Fe.includes('"') || Fe.includes(`
`) ? `"${Fe.replace(/"/g, '""')}"` : Fe;
    }, D = [["pairKey", "type", "severity", "ruleId", "aUuid", "aName", "bUuid", "bName", "status", "overlapVolume", "distance"].join(",")];
    u.forEach((Se) => {
      D.push([
        j(Se.pairKey),
        j(Se.type),
        j(Se.severity),
        j(Se.ruleId),
        j(Se.aUuid),
        j(Se.aName),
        j(Se.bUuid),
        j(Se.bName),
        j(Se.status),
        j(Se.overlapVolume.toFixed(6)),
        j(Se.distance.toFixed(6))
      ].join(","));
    });
    const _e = "\uFEFF" + D.join(`
`), be = new Blob([_e], { type: "text/csv;charset=utf-8;" }), oe = URL.createObjectURL(be), we = /* @__PURE__ */ new Date(), Ne = (Se) => String(Se).padStart(2, "0"), Ie = `clash_report_${we.getFullYear()}${Ne(we.getMonth() + 1)}${Ne(we.getDate())}_${Ne(we.getHours())}${Ne(we.getMinutes())}${Ne(we.getSeconds())}.csv`, ze = document.createElement("a");
    ze.href = oe, ze.download = Ie, ze.click(), URL.revokeObjectURL(oe);
  }, [u]), ke = U(() => {
    ee.current++, J.current = !1, p([]), d(!1), _(0), b(""), s(0), q(0), T("ALL"), A("ALL");
  }, []), Ge = U(() => {
    const j = new Set(r.map((ae) => ae.id));
    N((ae) => ae.filter((D) => j.has(D))), P((ae) => ae.filter((D) => j.has(D)));
  }, [r]);
  return {
    clashResults: u,
    setClashResults: p,
    clashRunning: l,
    clashProgress: f,
    clashStatus: m,
    clashScannedCount: x,
    clashSetA: g,
    clashSetB: y,
    clashTolerance: Y,
    clashMinOverlapVolume: I,
    clashClearanceDistance: S,
    clashUseNarrowPhase: M,
    clashUseTrianglePhase: W,
    clashPruning: !0,
    clashIncludeSameModel: de,
    clashPairsScanned: O,
    clashResultFilter: F,
    clashTypeFilter: ue,
    setClashSetA: N,
    setClashSetB: P,
    setClashTolerance: C,
    setClashMinOverlapVolume: B,
    setClashClearanceDistance: k,
    setClashUseNarrowPhase: L,
    setClashUseTrianglePhase: $,
    setClashIncludeSameModel: K,
    setClashResultFilter: T,
    setClashTypeFilter: A,
    handleRunClashCheck: pe,
    handleCancelClashCheck: G,
    handleClearClashResults: X,
    handleFocusClashResult: he,
    handleUpdateClashResultStatus: re,
    handleMarkFilteredClashStatus: te,
    handleExportClashCsv: Ce,
    resetClashState: ke,
    applyClashModelOptionBounds: Ge
  };
}
function Wo(e, n) {
  const r = se(/* @__PURE__ */ new Set()), a = Ee(() => {
    const i = /* @__PURE__ */ new Map(), o = (u, p) => {
      if (!u) return;
      const l = i.get(u) || {
        total: 0,
        newCount: 0,
        confirmedCount: 0,
        resolvedCount: 0,
        worstStatus: "resolved"
      };
      l.total += 1, p === "new" ? l.newCount += 1 : p === "confirmed" ? l.confirmedCount += 1 : l.resolvedCount += 1, l.newCount > 0 ? l.worstStatus = "new" : l.confirmedCount > 0 ? l.worstStatus = "confirmed" : l.worstStatus = "resolved", i.set(u, l);
    };
    n.forEach((u) => {
      o(u.aUuid, u.status), o(u.bUuid, u.status);
    });
    const h = {};
    return i.forEach((u, p) => {
      h[p] = u;
    }), h;
  }, [n]);
  return ce(() => {
    if (!e.current) return;
    const i = e.current;
    r.current.forEach((u) => {
      const p = i.contentGroup.getObjectByProperty("uuid", u);
      p?.userData?.clash && delete p.userData.clash, (i.getStructureNodes(u) || []).forEach((d) => {
        d?.userData?.clash && delete d.userData.clash;
      });
    });
    const h = /* @__PURE__ */ new Set();
    Object.entries(a).forEach(([u, p]) => {
      h.add(u);
      const l = {
        total: p.total,
        new: p.newCount,
        confirmed: p.confirmedCount,
        resolved: p.resolvedCount,
        status: p.worstStatus
      }, d = i.contentGroup.getObjectByProperty("uuid", u);
      d && (d.userData || (d.userData = {}), d.userData.clash = l), (i.getStructureNodes(u) || []).forEach((_) => {
        _.userData || (_.userData = {}), _.userData.clash = l;
      });
    }), r.current = h;
  }, [a, e]), a;
}
function Ko({
  sceneMgrRef: e,
  setSelectedUuids: n,
  setSelectedProps: r,
  isolateLocate: a = !1,
  onIsolateLocate: i
}) {
  return {
    focusObjectsInView: U(({
      uuids: h,
      focusUuid: u,
      highlightColors: p,
      updateSelection: l = !0
    }) => {
      const d = e.current;
      if (!d) return !1;
      const f = Array.from(new Set((h || []).map((m) => String(m || "").trim()).filter(Boolean)));
      if (f.length === 0) return !1;
      const _ = u && f.includes(u) ? u : f[0];
      return a && (d.isolateObjectsForLocate(f), i?.(f)), d.focusHighlightObjects(f, {
        fitView: !0,
        focusUuid: _,
        highlightColors: p
      }), l && (n(f), r?.(null)), !0;
    }, [a, i, e, r, n])
  };
}
const Un = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"), rs = ({
  allowDragOpen: e = !0,
  hiddenMenus: n = [],
  libPath: r = "./libs",
  defaultLang: a,
  showStats: i,
  showOutline: o,
  showProperties: h,
  initialSettings: u,
  initialFiles: p,
  onSelect: l,
  onLoad: d,
  hideDeleteModel: f = !1,
  performancePreset: _ = "quality",
  chunkOptions: m
}) => {
  const b = fn.light, x = Ee(() => ({
    chunkReadCacheSize: m?.chunkReadCacheSize ?? 128,
    chunkPrefetchWindow: m?.chunkPrefetchWindow ?? 0,
    targetMinFps: m?.targetMinFps ?? 20,
    ghostMode: m?.ghostMode,
    loadProfile: m?.loadProfile ?? "max-speed",
    deferIfcProperties: m?.deferIfcProperties ?? !0,
    preferWorkerOctree: m?.preferWorkerOctree ?? !0,
    fastGeometrySanitize: m?.fastGeometrySanitize ?? !0
  }), [m]), [s, g] = st(
    "3dbrowser_lang",
    () => a || "zh",
    {
      serializer: (v) => v,
      parser: (v) => v === "zh" || v === "en" ? v : "zh"
    }
  ), N = se(a);
  ce(() => {
    a && a !== N.current && (g(a), N.current = a);
  }, [a, g]);
  const y = U((v) => Lt(s, v), [s]);
  ce(() => {
    const v = (xe) => {
      xe.preventDefault();
    }, Z = (xe) => {
      (xe.button === 3 || xe.button === 4) && (xe.preventDefault(), xe.stopPropagation());
    };
    return document.addEventListener("contextmenu", v, { capture: !0 }), document.addEventListener("gesturestart", v, { capture: !0 }), window.addEventListener("auxclick", v, { capture: !0 }), window.addEventListener("mousedown", Z, { capture: !0 }), () => {
      document.removeEventListener("contextmenu", v, { capture: !0 }), document.removeEventListener("gesturestart", v, { capture: !0 }), window.removeEventListener("auxclick", v, { capture: !0 }), window.removeEventListener("mousedown", Z, { capture: !0 });
    };
  }, []);
  const [P, Y] = V([]), {
    selectedUuids: C,
    selectedUuid: I,
    setSelectedUuids: B,
    clearSelection: S
  } = bo(), [k, M] = V(null), [L, W] = V(Lt(s, "ready")), [$, de] = V(!1), [K, O] = V(0), [q, F] = V({
    meshes: 0,
    faces: 0,
    memory: 0,
    textureMemory: 0,
    drawCalls: 0,
    chunksLoaded: 0,
    chunksTotal: 0,
    chunksQueued: 0,
    pixelRatio: 1
  }), [T, ue] = V({ loaded: 0, total: 0 }), [A, ee] = V(null), [J, R] = V(null), [H, ne] = V("solid"), [me, Q] = V(""), {
    activeTool: z,
    setActiveTool: w,
    explodeEnabled: le,
    setExplodeEnabled: pe,
    explodeStrength: G,
    setExplodeStrength: X,
    explodeMode: he,
    setExplodeMode: re,
    resetExplodeState: te,
    measureType: Ce,
    setMeasureType: ke,
    measureHistory: Ge,
    setMeasureHistory: j,
    highlightedMeasureId: ae,
    setHighlightedMeasureId: D,
    resetMeasurementState: _e,
    handleMeasureUpdate: be,
    clipEnabled: oe,
    setClipEnabled: we,
    clipValues: Ne,
    setClipValues: Ie,
    clipActive: ze,
    setClipActive: Se,
    clipHelperVisible: Fe,
    setClipHelperVisible: We,
    clipHelperOpacity: je,
    setClipHelperOpacity: De
  } = Bo({
    initialSettings: u,
    mgrInstance: A
  }), [Ae, rt] = st("3dbrowser_pickEnabled", !1, {
    serializer: (v) => String(v),
    parser: (v) => v === "true"
  }), [Re, it] = st("3dbrowser_showStats", i ?? !0, {
    serializer: (v) => String(v),
    parser: (v) => v === "true"
  }), [ot, ie] = st("3dbrowser_showOutline", o ?? !0, {
    serializer: (v) => String(v),
    parser: (v) => v === "true"
  }), [ye, $e] = st("3dbrowser_showProps", h ?? !0, {
    serializer: (v) => String(v),
    parser: (v) => v === "true"
  }), [Be, Oe] = st("3dbrowser_sceneSettings", () => {
    const v = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: b.canvasBg,
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
      locateIsolateMode: !1,
      backLightInt: 0.5,
      highlightColor: "#0c62a2",
      highlightShowBox: !1,
      clip: {
        helperVisible: u?.clip?.helperVisible ?? !1,
        helperOpacity: u?.clip?.helperOpacity ?? 0.12
      }
    }, Z = u ? { ...v, ...u } : v;
    return Z.bgColor === void 0 ? { ...Z, bgColor: b.canvasBg } : Z;
  });
  ce(() => {
    i !== void 0 && it(i);
  }, [i, it]);
  const [Ke, tt] = V({ isOpen: !1, title: "", message: "", action: () => {
  } }), [xt, Ct] = V(!1), pt = se(null), mt = se(null), fe = se(null), Dt = se(/* @__PURE__ */ new Map()), Nt = se(() => {
  }), { focusObjectsInView: ft } = Ko({
    sceneMgrRef: fe,
    setSelectedUuids: B,
    setSelectedProps: M,
    isolateLocate: Be.locateIsolateMode === !0,
    onIsolateLocate: (v) => Nt.current(v)
  }), {
    leftWidth: bn,
    rightWidth: vn,
    resizingLeft: Zn,
    resizingRight: er
  } = Do({
    propShowOutline: o,
    propShowProperties: h,
    setShowOutline: ie,
    setShowProps: $e
  });
  ce(() => {
    const v = fe.current;
    v && (v.setChunkOptions(x), v.updateSettings({
      ...Be,
      performanceMode: _,
      targetFps: x.targetMinFps ?? Be.targetFps
    }));
  }, [x, _, Be]);
  const tr = P.length > 0, At = Ee(() => {
    const v = [], Z = /* @__PURE__ */ new Set();
    return (P || []).forEach((xe) => {
      const Me = String(xe?.object?.userData?.originalUuid || xe?.uuid || "");
      !Me || Z.has(Me) || (Z.add(Me), v.push({ id: Me, name: String(xe?.name || Me) }));
    }), v;
  }, [P]), {
    clashResults: lt,
    clashRunning: nr,
    clashProgress: rr,
    clashStatus: ir,
    clashScannedCount: ar,
    clashSetA: or,
    clashSetB: sr,
    clashTolerance: lr,
    clashMinOverlapVolume: cr,
    clashClearanceDistance: ur,
    clashUseNarrowPhase: dr,
    clashUseTrianglePhase: hr,
    clashIncludeSameModel: pr,
    clashPairsScanned: mr,
    clashResultFilter: fr,
    clashTypeFilter: _r,
    setClashSetA: Ht,
    setClashSetB: Gt,
    setClashTolerance: gr,
    setClashMinOverlapVolume: yr,
    setClashClearanceDistance: br,
    setClashUseNarrowPhase: vr,
    setClashUseTrianglePhase: wr,
    setClashIncludeSameModel: xr,
    setClashResultFilter: Cr,
    setClashTypeFilter: Nr,
    handleRunClashCheck: Sr,
    handleCancelClashCheck: kr,
    handleClearClashResults: Wt,
    handleFocusClashResult: Mr,
    handleUpdateClashResultStatus: Lr,
    handleMarkFilteredClashStatus: Er,
    handleExportClashCsv: Ir,
    resetClashState: Dr,
    applyClashModelOptionBounds: wn
  } = Go({
    sceneMgrRef: fe,
    treeRoot: P,
    clashModelOptions: At,
    selectedUuids: C,
    setSelectedUuids: B,
    focusObjectsInView: ft,
    t: y
  }), xn = Wo(fe, lt), Cn = se(/* @__PURE__ */ new Set()), Nn = se("");
  ce(() => {
    Nn.current = me;
  }, [me]);
  const [Kt, Xt] = V({ isOpen: !1, title: "", message: "" }), [_t, Qe] = V(null), { onManagerChunkProgress: Sn } = no({
    fileSetIdRef: Nn,
    completedFileSetsRef: Cn,
    onProgress: ue,
    onCompleted: () => {
      Qe({ message: y("all_chunks_loaded"), type: "success" }), ue({ loaded: 0, total: 0 });
    }
  }), Ar = U((v, Z) => {
    Sn(v, Z);
  }, [Sn]);
  _o({
    mgrInstance: A,
    showStats: Re,
    setStats: F
  }), ce(() => {
    wn();
  }, [wn]);
  const Yt = se(() => {
  });
  ce(() => {
    L === Lt(s === "zh" ? "en" : "zh", "ready") && W(Lt(s, "ready"));
  }, [s]);
  const kn = (v) => v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : v >= 1e3 ? (v / 1e3).toFixed(1) + "K" : v.toString(), zr = (v) => v >= 1024 ? (v / 1024).toFixed(2) + " GB" : v.toFixed(1) + " MB";
  function Br(v) {
    const Z = {};
    return v.visibility && (Z.hiddenUuids = Array.from(zt), Z.isolatedUuids = Array.from(Bt)), v.selection && (Z.selectedUuids = [...C]), v.clip && (Z.clip = {
      enabled: oe,
      values: {
        x: [...Ne.x],
        y: [...Ne.y],
        z: [...Ne.z]
      },
      active: { ...ze },
      helperVisible: Fe,
      helperOpacity: je
    }), v.explode && (Z.explode = {
      enabled: le,
      strength: G,
      mode: he
    }), Z;
  }
  async function Fr(v) {
    const Z = fe.current;
    if (!(!Z || !v)) {
      if (Yt.current?.(), Z.clearLocateFocus(), v.clip && (we(v.clip.enabled), Ie(v.clip.values), Se(v.clip.active), We(v.clip.helperVisible), De(v.clip.helperOpacity)), v.explode && (pe(v.explode.enabled), X(v.explode.strength), re(v.explode.mode)), v.hiddenUuids !== void 0 || v.isolatedUuids !== void 0) {
        Z.setAllVisibility(!0);
        const xe = v.hiddenUuids || [], Me = v.isolatedUuids || [];
        Me.length > 0 ? (Z.isolateObjects(Me), St(/* @__PURE__ */ new Set()), kt(new Set(Me))) : (xe.forEach((Xe) => Z.setObjectVisibility(Xe, !1)), St(new Set(xe)), kt(/* @__PURE__ */ new Set())), nt();
      }
      if (v.selectedUuids !== void 0 && (B(v.selectedUuids), M(null), Z.highlightObjects(v.selectedUuids), v.selectedUuids.length === 1)) {
        const xe = Z.contentGroup.getObjectByProperty("uuid", v.selectedUuids[0]);
        xe && await Ft(xe);
      }
      queueMicrotask(() => {
        Z.invalidateRender?.({ needsCulling: !0 }), requestAnimationFrame(() => Z.invalidateRender?.({ needsCulling: !0 }));
      });
    }
  }
  const {
    viewpoints: Vr,
    handleSaveViewpoint: Pr,
    handleUpdateViewpointName: $r,
    handleLoadViewpoint: Or,
    handleOverwriteViewpoint: Tr,
    handleDeleteViewpoint: Rr
  } = Po({
    currentFileSetId: me,
    sceneMgrRef: fe,
    setToast: Qe,
    setConfirmState: tt,
    t: y,
    captureStateSnapshot: Br,
    restoreStateSnapshot: Fr
  });
  ce(() => {
    A && requestAnimationFrame(() => {
      A.resize();
    });
  }, [A, ot, ye, bn, vn]), ce(() => {
    if (_t) {
      const v = setTimeout(() => {
        Qe(null);
      }, 3e3);
      return () => clearTimeout(v);
    }
  }, [_t]);
  const nt = U(() => {
    if (!fe.current) return;
    const v = fe.current.structureRoot;
    if (!v) {
      Y([]);
      return;
    }
    const Z = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), Me = (Ue) => {
      const Ye = (Ue || []).slice();
      for (; Ye.length; ) {
        const Te = Ye.pop();
        if (Te && (typeof Te.uuid == "string" && (Z.set(Te.uuid, !!Te.expanded), xe.set(Te.uuid, Te.childrenLoaded !== !1)), Array.isArray(Te.children) && Te.children.length))
          for (const Mt of Te.children)
            Ye.push(Mt);
      }
    }, Xe = (Ue, Ye = 0, Te = !1, Mt = !1) => {
      const Jt = Ue.id, In = Array.isArray(Ue.children) ? Ue.children : [], Ci = In.length > 0, Dn = Mt || xe.get(Jt) === !0;
      return {
        uuid: Jt,
        name: Ue.name,
        type: Ue.type === "Mesh" ? "MESH" : "GROUP",
        depth: Ye,
        children: Dn ? In.map((Ni) => Xe(Ni, Ye + 1, !1, !1)) : [],
        expanded: Z.get(Jt) ?? !1,
        visible: Ue.visible !== !1,
        object: Ue,
        isFileNode: Te,
        hasChildren: Ci,
        childrenLoaded: Dn
      };
    };
    Y((Ue) => {
      Me(Ue);
      const Ye = [];
      return (v.children || []).forEach((Te) => {
        Te.name === "ImportedModels" || Te.name === "Tilesets" ? (Te.children || []).forEach((Mt) => {
          Ye.push(Xe(Mt, 0, !0, !0));
        }) : Ye.push(Xe(Te, 0, !0, !0));
      }), Ye;
    });
  }, []), {
    contextMenu: qt,
    hiddenUuids: zt,
    isolatedUuids: Bt,
    setHiddenUuids: St,
    setIsolatedUuids: kt,
    handleContextMenu: Ur,
    closeContextMenu: jr,
    handleHideSelected: Hr,
    handleShowAll: gt,
    handleToggleVisibility: Gr,
    handleHideObject: Wr,
    handleIsolateObject: Kr,
    handleIsolateSelection: Xr,
    handleUndoVisibility: Yr
  } = Vo({
    sceneMgrRef: fe,
    selectedUuids: C,
    setSelectedUuids: B,
    setSelectedProps: M,
    updateTree: nt,
    resetLocateState: () => Yt.current()
  });
  Nt.current = (v) => {
    if (!Be.locateIsolateMode) return;
    const Z = Array.from(new Set((v || []).map((xe) => String(xe || "").trim()).filter(Boolean)));
    Z.length !== 0 && (St((xe) => xe.size === 0 ? xe : /* @__PURE__ */ new Set()), kt((xe) => xe.size === Z.length && Z.every((Me) => xe.has(Me)) ? xe : new Set(Z)));
  };
  const qr = (v) => {
    if (!fe.current) return;
    const Z = fe.current.contentGroup.getObjectByProperty("uuid", v), xe = fe.current.getStructureNodes(v);
    if (Z || xe) {
      const Me = Z?.name || xe?.[0]?.name || "Item";
      tt({
        isOpen: !0,
        title: y("delete_item"),
        message: `${y("confirm_delete")} "${Me}"?`,
        action: async () => {
          de(!0), W(y("delete_item") + "...");
          try {
            await fe.current?.removeModel(v), B((Xe) => {
              const Ue = Xe.filter((Ye) => Ye !== v);
              return fe.current?.highlightObjects(Ue), Ue.length === 0 && M(null), Ue;
            }), nt(), W(y("ready")), Qe({ message: y("success"), type: "success" });
          } catch (Xe) {
            console.error("删除对象失败:", Xe), Qe({ message: y("failed") + ": " + (Xe instanceof Error ? Xe.message : String(Xe)), type: "error" });
          } finally {
            de(!1);
          }
        }
      });
    }
  }, Mn = () => {
    S(), M(null), fe.current?.highlightObjects([]), fe.current?.invalidateRender?.({ needsCulling: !0 });
  };
  ce(() => {
    if (!pt.current) return;
    const v = new Ei(pt.current, {
      performancePreset: _,
      chunkOptions: x
    });
    return fe.current = v, ee(v), d && d(v), v.updateSettings(Be), requestAnimationFrame(() => {
      v.resize();
    }), v.onChunkProgress = Ar, v.onMeasureUpdate = be, v.onStructureUpdate = () => {
      nt();
    }, () => {
      v.dispose();
    };
  }, []), ce(() => {
    if (!A || !p) return;
    (async () => {
      const Z = Array.isArray(p) ? p : [p];
      console.log("[ThreeViewer] loadInitial with items:", Z), await Qt(Z);
    })();
  }, [A, p]);
  const Qr = (v) => {
    const Z = {
      ...Be,
      ...v
    };
    Oe(Z), fe.current && fe.current.updateSettings(Z);
  }, {
    locatedUuid: Jr,
    locateResultUuids: Zr,
    resetLocateState: Ln,
    handleSelect: Ft,
    handleLocateObject: ei,
    handleLocateResultsChange: ti,
    handleClearLocate: ni
  } = ko({
    sceneMgrRef: fe,
    selectedUuids: C,
    setSelectedUuids: B,
    setSelectedProps: M,
    setHiddenUuids: St,
    setIsolatedUuids: kt,
    updateTree: nt,
    propOnSelect: l,
    ifcPropertyCacheRef: Dt,
    clashSummaryByUuid: xn,
    focusObjectsInView: ft,
    t: y,
    isDev: Un
  });
  Yt.current = Ln;
  const {
    searchConditions: ri,
    setSearchConditions: ii,
    searchResults: Vt,
    searching: ai,
    searchProgress: oi,
    searchStatus: si,
    propertyFieldOptions: li,
    handleRunPropertySearch: ci,
    handleApplySearchResultHighlight: ui,
    handleClearSearchResult: Pt,
    handleCancelSearch: di
  } = Oo({
    sceneMgrRef: fe,
    selectedUuids: C,
    setSelectedUuids: B,
    onSelectObject: Ft,
    focusObjectsInView: ft,
    t: y,
    setToast: Qe
  }), En = Ee(() => {
    const v = [];
    return Ce !== "none" && v.push({
      key: "measure",
      label: y("mode_measure"),
      onClear: () => {
        ke("none"), w("none"), fe.current?.clearMeasurementPreview();
      }
    }), oe && v.push({
      key: "clip",
      label: y("mode_clip"),
      onClear: () => {
        we(!1), w("none");
      }
    }), Vt.length > 0 && v.push({
      key: "search",
      label: `${y("mode_search")} ${Vt.length}`,
      onClear: Pt
    }), zt.size > 0 && v.push({
      key: "hidden",
      label: `${y("mode_hidden")} ${zt.size}`,
      onClear: gt,
      clearLabel: y("mode_restore_visibility") || y("mode_clear")
    }), Bt.size > 0 && v.push({
      key: "isolated",
      label: `${y("mode_isolated")} ${Bt.size}`,
      onClear: gt,
      clearLabel: y("mode_restore_visibility") || y("mode_clear")
    }), z === "boxSelect" && v.push({
      key: "boxSelect",
      label: y("mode_box_select"),
      onClear: () => w("none")
    }), lt.length > 0 && v.push({
      key: "clash",
      label: `${y("mode_clash")} ${lt.length}`,
      onClear: Wt
    }), v;
  }, [
    z,
    lt.length,
    oe,
    Wt,
    Pt,
    gt,
    zt.size,
    Bt.size,
    Ce,
    Vt.length,
    y
  ]), hi = U((v) => {
    if (!fe.current) return;
    const Z = Array.from(new Set(
      lt.filter((xe) => xe.status === v).flatMap((xe) => [xe.aUuid, xe.bUuid]).filter(Boolean)
    ));
    Z.length !== 0 && (fe.current.clearLocateFocus(), fe.current.isolateObjects(Z), St(/* @__PURE__ */ new Set()), kt(new Set(Z)), nt(), fe.current.fitViewToObjects(Z));
  }, [lt, nt]), { processFiles: Qt, loadItemsIntoScene: pi } = fo({
    managerRef: fe,
    sceneSettings: Be,
    libPath: r,
    t: y,
    setCurrentFileSetId: Q,
    setLoading: de,
    setStatus: W,
    setProgress: O,
    setToast: Qe,
    updateTree: nt
  });
  $o({
    allowDragOpen: e,
    mgrInstance: A,
    viewportRef: mt,
    t: y,
    processFiles: Qt,
    setToast: Qe,
    setErrorState: Xt
  });
  const {
    getDefaultExportFileName: mi,
    handleExport: fi,
    handleClear: _i,
    handleScreenshot: gi
  } = Mo({
    sceneMgrRef: fe,
    t: y,
    setLoading: de,
    setProgress: O,
    setStatus: W,
    setToast: Qe,
    setActiveTool: w,
    setConfirmState: tt,
    setSelectedUuids: B,
    setSelectedProps: M,
    setChunkProgress: ue,
    resetLocateState: Ln,
    clearSearchResult: Pt,
    resetClashState: Dr,
    resetMeasurementState: _e,
    resetExplodeState: te,
    updateTree: nt,
    ifcPropertyCacheRef: Dt,
    completedFileSetsRef: Cn
  }), {
    handleOpenFiles: yi,
    handleBatchConvert: bi,
    handleOpenUrl: vi,
    handleDragOver: wi,
    handleDrop: xi
  } = Io({
    sceneMgrRef: fe,
    t: y,
    processFiles: Qt,
    loadItemsIntoScene: pi,
    setLoading: de,
    setStatus: W,
    setProgress: O,
    setToast: Qe,
    setActiveTool: w,
    setSelectedUuids: B,
    setSelectedProps: M,
    resetMeasurementState: _e,
    updateTree: nt,
    isDev: Un
  });
  return Lo({
    sceneMgrRef: fe,
    canvasRef: pt,
    activeTool: z,
    setActiveTool: w,
    measureType: Ce,
    setMeasureType: ke,
    pickEnabled: Ae,
    selectedUuids: C,
    setSelectedUuids: B,
    setSelectedProps: M,
    setMousePos: R,
    setHighlightedMeasureId: D,
    handleSelect: Ft,
    handleContextMenu: Ur,
    handleUndoVisibility: Yr,
    clearSelectionState: Mn
  }), /* @__PURE__ */ t(to, { t: y, theme: b, children: /* @__PURE__ */ c(
    "div",
    {
      className: "ui-container ui-app-shell font-medium",
      onDragOver: wi,
      onDrop: xi,
      children: [
        /* @__PURE__ */ t(
          ma,
          {
            t: y,
            handleOpenFiles: yi,
            handleBatchConvert: bi,
            handleOpenUrl: vi,
            handleView: (v) => {
              fe.current?.setView(v);
            },
            handleClear: _i,
            openScreenshotPanel: () => w("screenshot"),
            handleDisplayModeChange: (v) => {
              fe.current && (ne(v), fe.current.contentGroup.traverse((Z) => {
                Z.isMesh && Z.material && (Array.isArray(Z.material) ? Z.material : [Z.material]).forEach((Me) => {
                  v === "transparent" ? (Me.wireframe = !1, Me.transparent = !0, Me.opacity = 0.5) : (Me.wireframe = !1, Me.transparent = !1, Me.opacity = 1);
                });
              }), fe.current.requestRender());
            },
            displayMode: H,
            pickEnabled: Ae,
            setPickEnabled: rt,
            activeTool: z,
            setActiveTool: w,
            showOutline: ot,
            setShowOutline: ie,
            showProps: ye,
            setShowProps: $e,
            showStats: Re,
            setShowStats: it,
            sceneMgr: fe.current,
            theme: b,
            hiddenMenus: n,
            onOpenAbout: () => Ct(!0),
            hasModels: tr
          }
        ),
        /* @__PURE__ */ c("div", { className: "ui-main-layout", children: [
          ot && /* @__PURE__ */ c("div", { className: "ui-sidebar ui-sidebar-left", style: { width: `${bn}px` }, children: [
            /* @__PURE__ */ c("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: y("interface_outline") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => ie(!1),
                  children: /* @__PURE__ */ t(ut, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(
              Ca,
              {
                t: y,
                treeRoot: P,
                setTreeRoot: Y,
                selectedUuid: I,
                locatedUuid: Jr,
                onSelect: (v, Z) => Ft(Z, null, !1, !0),
                onToggleVisibility: Gr,
                onDelete: (v) => {
                  const Z = v?.uuid || v?.id;
                  Z && qr(Z);
                },
                onHide: Wr,
                onIsolate: Kr,
                onShowAll: gt,
                onLocate: ei,
                onClearLocate: ni,
                onLocateResultsChange: ti,
                locateResultUuids: Zr,
                clashSummaryByUuid: xn
              }
            ) }),
            /* @__PURE__ */ t(
              "div",
              {
                className: "ui-sidebar-resize ui-sidebar-resize-left",
                onMouseDown: () => Zn.current = !0
              }
            )
          ] }),
          /* @__PURE__ */ c("div", { ref: mt, className: "ui-viewport-shell", style: { backgroundColor: b.canvasBg }, children: [
            /* @__PURE__ */ t("canvas", { ref: pt, className: "ui-viewport-canvas" }),
            /* @__PURE__ */ t(eo, { sceneMgr: A, theme: b, lang: s }),
            qt.visible && /* @__PURE__ */ t(
              yn,
              {
                x: qt.x,
                y: qt.y,
                items: [
                  {
                    label: y("hide_selected"),
                    onClick: Hr,
                    disabled: C.length === 0
                  },
                  {
                    label: y("isolate_selection"),
                    onClick: Xr,
                    disabled: C.length === 0
                  },
                  {
                    label: y("clear_selection"),
                    onClick: Mn,
                    disabled: C.length === 0
                  },
                  {
                    label: y("show_all"),
                    onClick: gt
                  }
                ],
                onClose: jr,
                theme: b
              }
            ),
            _t && /* @__PURE__ */ c("div", { className: "ui-toast", children: [
              /* @__PURE__ */ t("div", { className: `ui-toast-dot ${_t.type === "error" ? "ui-toast-dot-error" : _t.type === "success" ? "ui-toast-dot-success" : "ui-toast-dot-info"}` }),
              /* @__PURE__ */ t("span", { className: "ui-toast-message", children: _t.message }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-toast-close",
                  onClick: () => Qe(null),
                  children: /* @__PURE__ */ t(ut, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ t(ja, { t: y, loading: $, status: L, progress: K, theme: b }),
            z === "measure" && /* @__PURE__ */ t(
              Ea,
              {
                t: y,
                sceneMgr: fe.current,
                measureType: Ce,
                setMeasureType: ke,
                measureHistory: Ge,
                highlightedId: ae,
                onHighlight: (v) => {
                  D(v), fe.current?.highlightMeasurement(v), v && fe.current?.locateMeasurement(v);
                },
                onDelete: (v) => {
                  fe.current?.removeMeasurement(v), j((Z) => Z.filter((xe) => xe.id !== v)), ae === v && (D(null), fe.current?.highlightMeasurement(null));
                },
                onClear: () => {
                  fe.current?.clearAllMeasurements(), _e();
                },
                onClose: () => w("none"),
                theme: b
              }
            ),
            z === "clip" && /* @__PURE__ */ t(
              Ia,
              {
                t: y,
                sceneMgr: fe.current,
                onClose: () => w("none"),
                clipEnabled: oe,
                setClipEnabled: we,
                clipValues: Ne,
                setClipValues: Ie,
                clipActive: ze,
                setClipActive: Se,
                clipHelperVisible: Fe,
                setClipHelperVisible: We,
                clipHelperOpacity: je,
                setClipHelperOpacity: De,
                theme: b
              }
            ),
            z === "export" && /* @__PURE__ */ t(
              Da,
              {
                t: y,
                onClose: () => w("none"),
                onExport: fi,
                getDefaultFileName: mi,
                theme: b
              }
            ),
            z === "screenshot" && /* @__PURE__ */ t(
              Aa,
              {
                t: y,
                onClose: () => w("none"),
                onCapture: (v) => {
                  gi(v), w("none");
                },
                theme: b
              }
            ),
            z === "settings" && /* @__PURE__ */ t(
              Na,
              {
                t: y,
                onClose: () => w("none"),
                settings: Be,
                onUpdate: Qr,
                currentLang: s,
                setLang: g,
                showStats: Re,
                setShowStats: it,
                theme: b
              }
            ),
            z === "viewpoint" && /* @__PURE__ */ t(
              Ba,
              {
                t: y,
                viewpoints: Vr,
                onSave: Pr,
                onUpdateName: $r,
                onLoad: Or,
                onDelete: Rr,
                onOverwrite: Tr,
                onClose: () => w("none"),
                theme: b
              }
            ),
            z === "search" && /* @__PURE__ */ t(
              $a,
              {
                t: y,
                onClose: () => w("none"),
                conditions: ri,
                results: Vt,
                searching: ai,
                searchProgress: oi,
                searchStatus: si,
                propertyFieldOptions: li,
                onConditionsChange: ii,
                onSearch: () => void ci(),
                onCancelSearch: di,
                onApplyResultHighlight: ui,
                onClearResult: Pt,
                theme: b
              }
            ),
            z === "clash" && /* @__PURE__ */ t(
              Ua,
              {
                t: y,
                onClose: () => w("none"),
                running: nr,
                progress: rr,
                status: ir,
                scannedCount: ar,
                pairsScanned: mr,
                results: lt,
                resultFilter: fr,
                modelOptions: At,
                setA: or,
                setB: sr,
                tolerance: lr,
                minOverlapVolume: cr,
                clearanceDistance: ur,
                useNarrowPhase: dr,
                useTrianglePhase: hr,
                includeSameModel: pr,
                onSetAChange: Ht,
                onSetBChange: Gt,
                onToleranceChange: gr,
                onMinOverlapVolumeChange: yr,
                onClearanceDistanceChange: br,
                onUseNarrowPhaseChange: vr,
                onUseTrianglePhaseChange: wr,
                onIncludeSameModelChange: xr,
                onRun: () => void Sr(),
                onCancel: kr,
                onClear: Wt,
                onExportCsv: Ir,
                onIsolateByStatus: hi,
                onRestoreVisibility: gt,
                onResultFilterChange: Cr,
                typeFilter: _r,
                onTypeFilterChange: Nr,
                onUpdateResultStatus: Lr,
                onMarkFilteredStatus: Er,
                onSetASelectAll: () => Ht(At.map((v) => v.id)),
                onSetAClear: () => Ht([]),
                onSetBSelectAll: () => Gt(At.map((v) => v.id)),
                onSetBClear: () => Gt([]),
                onFocusResult: Mr,
                theme: b
              }
            ),
            z === "explode" && /* @__PURE__ */ t(
              Fa,
              {
                t: y,
                onClose: () => w("none"),
                enabled: le,
                strength: G,
                mode: he,
                onEnabledChange: pe,
                onStrengthChange: X,
                onModeChange: re,
                onReset: () => {
                  te(), fe.current?.resetExplode();
                },
                theme: b
              }
            )
          ] }),
          ye && /* @__PURE__ */ c("div", { className: "ui-sidebar ui-sidebar-right", style: { width: `${vn}px` }, children: [
            /* @__PURE__ */ c("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ t("span", { children: y("interface_props") }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => $e(!1),
                  children: /* @__PURE__ */ t(ut, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ t(Qa, { t: y, selectedProps: k, theme: b }) }),
            /* @__PURE__ */ t(
              "div",
              {
                onMouseDown: () => er.current = !0,
                className: "ui-sidebar-resize ui-sidebar-resize-right"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "ui-statusbar", children: [
          /* @__PURE__ */ c("div", { className: "ui-statusbar-left", children: [
            /* @__PURE__ */ t("span", { children: L }),
            $ && /* @__PURE__ */ c("span", { children: [
              K,
              "%"
            ] }),
            I && C.length > 1 && /* @__PURE__ */ c("span", { className: "ui-statusbar-meta", children: [
              y("selected_count"),
              ": ",
              C.length
            ] }),
            T.total > 0 && T.loaded < T.total && /* @__PURE__ */ c("div", { className: "ui-chunk-progress", children: [
              /* @__PURE__ */ c("span", { children: [
                y("chunk_loading"),
                ": ",
                T.loaded,
                "/",
                T.total
              ] }),
              /* @__PURE__ */ t("div", { className: "ui-progress-bar ui-progress-bar-compact", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "ui-progress-fill",
                  style: { width: `${T.loaded / T.total * 100}%` }
                }
              ) })
            ] }),
            En.length > 0 && /* @__PURE__ */ t("div", { className: "ui-mode-tray", children: En.map((v) => /* @__PURE__ */ c("div", { className: "ui-mode-pill", children: [
              /* @__PURE__ */ t("span", { children: v.label }),
              /* @__PURE__ */ t("button", { onClick: v.onClear, children: v.clearLabel || y("mode_clear") })
            ] }, v.key)) })
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-statusbar-right", children: [
            J && /* @__PURE__ */ c("div", { className: "ui-statusbar-coords", children: [
              J.x.toFixed(2),
              ", ",
              J.y.toFixed(2),
              ", ",
              J.z.toFixed(2)
            ] }),
            /* @__PURE__ */ c("div", { className: "ui-tips", children: [
              /* @__PURE__ */ t("span", { children: y("tips_rotate") }),
              /* @__PURE__ */ t("span", { children: y("tips_pan") }),
              /* @__PURE__ */ t("span", { children: y("tips_zoom") })
            ] }),
            Re && /* @__PURE__ */ c("div", { className: "ui-stats-group", children: [
              /* @__PURE__ */ c("div", { className: "ui-stats-item", title: y("stats_original_meshes"), children: [
                /* @__PURE__ */ t(jn, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: kn(q.meshes) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-stats-item", title: y("stats_triangles"), children: [
                /* @__PURE__ */ t(Qi, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: kn(q.faces) })
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-stats-item", children: [
                /* @__PURE__ */ t(Ki, { width: 14, height: 14 }),
                /* @__PURE__ */ t("span", { children: zr(q.memory) })
              ] }),
              q.chunksTotal > 0 && /* @__PURE__ */ c("div", { className: "ui-statusbar-metric", title: y("stats_chunks"), children: [
                "CH ",
                q.chunksLoaded,
                "/",
                q.chunksTotal
              ] }),
              /* @__PURE__ */ c("div", { className: "ui-statusbar-metric", title: y("stats_pixel_ratio"), children: [
                "DPR ",
                q.pixelRatio
              ] })
            ] }),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "ui-statusbar-tag ui-statusbar-tag-compact",
                onClick: () => g(s === "zh" ? "en" : "zh"),
                children: s === "zh" ? "EN" : "中文"
              }
            ),
            /* @__PURE__ */ t("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ t("div", { className: "ui-statusbar-tag ui-statusbar-tag-compact ui-statusbar-brand", children: /* @__PURE__ */ t("span", { className: "ui-statusbar-brand-label", children: "3D BROWSER" }) })
          ] })
        ] }),
        /* @__PURE__ */ t(
          Ja,
          {
            isOpen: Ke.isOpen,
            title: Ke.title,
            message: Ke.message,
            onConfirm: () => {
              Ke.action(), tt({ ...Ke, isOpen: !1 });
            },
            onCancel: () => tt({ ...Ke, isOpen: !1 }),
            t: y,
            theme: b
          }
        ),
        /* @__PURE__ */ t(
          Za,
          {
            isOpen: xt,
            onClose: () => Ct(!1),
            t: y,
            theme: b
          }
        ),
        Kt.isOpen && /* @__PURE__ */ t("div", { className: "ui-error-overlay", children: /* @__PURE__ */ c("div", { className: "ui-error-content ui-error-content-wide", children: [
          /* @__PURE__ */ c("div", { className: "ui-error-header ui-error-header-danger", children: [
            /* @__PURE__ */ t("span", { children: Kt.title }),
            /* @__PURE__ */ t(
              "div",
              {
                onClick: () => Xt((v) => ({ ...v, isOpen: !1 })),
                className: "ui-error-close",
                children: /* @__PURE__ */ t(ut, { width: 18, height: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ c("div", { className: "ui-error-body", children: [
            /* @__PURE__ */ t("div", { className: "ui-error-message", children: Kt.message }),
            /* @__PURE__ */ t("div", { className: "ui-error-actions", children: /* @__PURE__ */ t(
              "button",
              {
                className: "ui-btn ui-btn-primary ui-btn-modal-confirm",
                onClick: () => Xt((v) => ({ ...v, isOpen: !1 })),
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
  es as DEFAULT_FONT,
  Ei as SceneManager,
  rs as ThreeViewer,
  ts as colors,
  Lt as getTranslation,
  ho as loadModelFiles,
  ns as resolveThemeColors,
  fn as themes
};
