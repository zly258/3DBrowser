import React from "react";
export type SearchOperator = "equals" | "contains" | "notContains" | "startsWith" | "endsWith";
export type SearchConnector = "AND" | "OR";
export interface PropertySearchCondition {
    id: string;
    propertyName: string;
    operator: SearchOperator;
    value: string;
    connector?: SearchConnector;
}
export interface PropertySearchResultItem {
    uuid: string;
    name: string;
    type: string;
    modelId: string;
    source: string;
    matchedBy: string[];
}
interface SearchPanelProps {
    t: (key: string) => string;
    onClose: () => void;
    conditions: PropertySearchCondition[];
    results: PropertySearchResultItem[];
    searching: boolean;
    searchProgress: number;
    searchStatus: string;
    onConditionsChange: (next: PropertySearchCondition[]) => void;
    onSearch: () => void;
    onCancelSearch: () => void;
    onApplyResultHighlight: (uuid: string) => void;
    onClearResult: () => void;
    theme?: any;
}
export declare const SearchPanel: React.FC<SearchPanelProps>;
export {};
