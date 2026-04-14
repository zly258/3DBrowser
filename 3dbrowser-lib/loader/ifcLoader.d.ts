import * as THREE from "three";
import { ProgressCallback, TFunc } from "../theme/locales";
export declare const loadIFC: (input: string | File | ArrayBuffer, onProgress: ProgressCallback, t: TFunc, libPath?: string, settings?: Record<string, unknown>) => Promise<THREE.Group>;
