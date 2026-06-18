import * as THREE from "three";
/**
 * 将模型原始颜色映射为更适合工业 BIM 浏览的显示颜色。
 * 保留专业色彩区分，但压低大红、亮黄、品红等高饱和色，避免模型画面过于花哨。
 */
export declare function toIndustrialDisplayColor(input: THREE.ColorRepresentation | THREE.Color): THREE.Color;
export declare function toIndustrialDisplayHex(input: THREE.ColorRepresentation | THREE.Color | number): number;
export declare function applyIndustrialMaterialStyle(material: THREE.Material | null | undefined): void;
export declare function applyIndustrialMaterials(materialOrMaterials: THREE.Material | THREE.Material[] | null | undefined): void;
export declare function createIndustrialSharedMaterial(): THREE.MeshStandardMaterial;
export declare function applyIndustrialRendererSettings(renderer: THREE.WebGLRenderer, bgColor: string, exposure?: number): void;
export declare function applyIndustrialObjectStyle(object: THREE.Object3D): void;
