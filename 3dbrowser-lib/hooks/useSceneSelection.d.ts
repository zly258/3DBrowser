export declare function useSceneSelection(): {
    selectedUuids: string[];
    selectedUuid: string;
    setSelectedUuids: import("react").Dispatch<import("react").SetStateAction<string[]>>;
    clearSelection: () => void;
    setSingleSelection: (uuid: string) => void;
    toggleSelection: (uuid: string) => void;
};
