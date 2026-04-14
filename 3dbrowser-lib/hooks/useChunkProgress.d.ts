import type { RefObject } from "react";
interface ChunkProgressValue {
    loaded: number;
    total: number;
}
interface ChunkProgressHookOptions {
    fileSetIdRef: RefObject<string>;
    completedFileSetsRef: RefObject<Set<string>>;
    onProgress: (next: ChunkProgressValue | ((prev: ChunkProgressValue) => ChunkProgressValue)) => void;
    onCompleted: () => void;
}
export declare function useChunkProgress({ fileSetIdRef, completedFileSetsRef, onProgress, onCompleted }: ChunkProgressHookOptions): {
    onManagerChunkProgress: (loaded: number, total: number) => void;
};
export {};
