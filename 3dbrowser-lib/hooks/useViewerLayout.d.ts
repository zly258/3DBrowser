interface UseViewerLayoutOptions {
    propShowOutline?: boolean;
    propShowProperties?: boolean;
    setShowOutline: (value: boolean) => void;
    setShowProps: (value: boolean) => void;
}
export declare function useViewerLayout(options: UseViewerLayoutOptions): {
    leftWidth: number;
    rightWidth: number;
    resizingLeft: import("react").RefObject<boolean>;
    resizingRight: import("react").RefObject<boolean>;
};
export {};
