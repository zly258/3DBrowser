import { type MutableRefObject } from "react";
import { SceneManager } from "../utils/scene-manager/SceneManager";
export type SearchOperator = "equals" | "contains" | "notContains" | "startsWith" | "endsWith";
export type SearchConnector = "AND" | "OR";
export type PropertySearchCondition = {
    id: string;
    propertyName: string;
    operator: SearchOperator;
    value: string;
    connector?: SearchConnector;
};
export type PropertySearchResultItem = {
    uuid: string;
    name: string;
    type: string;
    modelId: string;
    source: string;
    matchedBy: string[];
};
interface UsePropertySearchParams {
    sceneMgrRef: MutableRefObject<SceneManager | null>;
    selectedUuids: string[];
    setSelectedUuids: (next: string[]) => void;
    onSelectObject: (obj: any) => Promise<void> | void;
    focusObjectsInView: (options: {
        uuids: string[];
        focusUuid?: string | null;
        highlightColors?: Record<string, string>;
        updateSelection?: boolean;
    }) => boolean;
    t: (key: string) => string;
    setToast: (payload: {
        message: string;
        type: "info" | "success" | "error";
    }) => void;
}
export declare function usePropertySearch({ sceneMgrRef, selectedUuids, setSelectedUuids, onSelectObject, focusObjectsInView, t, setToast }: UsePropertySearchParams): {
    searchConditions: PropertySearchCondition[];
    setSearchConditions: import("react").Dispatch<import("react").SetStateAction<PropertySearchCondition[]>>;
    searchResults: PropertySearchResultItem[];
    searching: boolean;
    searchProgress: number;
    searchStatus: string;
    handleRunPropertySearch: () => Promise<void>;
    handleApplySearchResultHighlight: (uuid: string) => void;
    handleClearSearchResult: () => void;
    handleCancelSearch: () => void;
};
export {};
