export declare function cx(...items: Array<string | false | null | undefined>): string;
export declare function clamp(value: number, min: number, max: number): number;
export declare function valueToPercent(value: number, min: number, max: number): number;
export declare function roundByStep(value: number, step: number): number;
export declare function normalizeNumber(value: number, min: number, max: number, step?: number): number;
export declare function getValueFromClientX(clientX: number, rect: DOMRect, min: number, max: number, step?: number): number;
