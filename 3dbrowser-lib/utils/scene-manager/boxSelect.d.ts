interface BoxSelectState {
    active: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    rectElement: HTMLDivElement | null;
}
interface BoxSelectResult {
    state: BoxSelectState;
}
export declare function createInitialBoxSelectState(): BoxSelectState;
export declare function applyStartBoxSelect(prevState: BoxSelectState, clientX: number, clientY: number): BoxSelectResult;
export declare function applyUpdateBoxSelect(prevState: BoxSelectState, clientX: number, clientY: number): BoxSelectResult;
export declare function applyCancelBoxSelect(prevState: BoxSelectState): BoxSelectResult;
export declare function applyEndBoxSelect(prevState: BoxSelectState, canvas: HTMLCanvasElement, selectByScreenRect: (x1: number, y1: number, x2: number, y2: number) => string[]): {
    state: BoxSelectState;
    selected: string[];
};
export {};
