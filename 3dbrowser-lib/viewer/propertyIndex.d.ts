export interface PropertyEntry {
    id: string;
    group: string;
    key: string;
    value: string;
    path: string;
    source?: string;
    rawKey?: string;
    normalizedGroup: string;
    normalizedKey: string;
    normalizedPath: string;
    normalizedValue: string;
}
export interface PropertyListItemInput {
    key: string;
    value: unknown;
    id?: string;
    rawKey?: string;
    source?: string;
}
export interface PropertyGroup {
    name: string;
    items: PropertyEntry[];
}
export type PropertyGroups = PropertyGroup[];
export type PropertyGroupInput = Record<string, unknown> | PropertyListItemInput[];
export declare function normalizePropertyToken(value: unknown): string;
export declare function stringifyPropertyValue(value: unknown): string;
export declare function createPropertyEntries(groupName: string, input: PropertyGroupInput, fallbackSource?: string): PropertyEntry[];
export declare function buildPropertyGroupsFromRecord(groups: Record<string, PropertyGroupInput> | null | undefined, fallbackSource?: string): PropertyGroups;
export declare function flattenPropertyGroups(groups: PropertyGroups | null | undefined): PropertyEntry[];
export declare function filterPropertyGroups(groups: PropertyGroups, query: string): PropertyGroups;
export declare function serializePropertyGroups(groups: PropertyGroups): string;
