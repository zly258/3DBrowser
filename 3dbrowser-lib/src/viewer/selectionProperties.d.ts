export type PropertyGroups = Record<string, Record<string, string>>;
interface BuildSelectedPropertyGroupsArgs {
    basicLabel: string;
    geoLabel: string;
    basicProps: Record<string, string>;
    geoProps: Record<string, string>;
    ifcProps?: PropertyGroups | null;
    nbimProps?: Record<string, string> | null;
    nbimLabel?: string;
}
export declare function buildSelectedPropertyGroups({ basicLabel, geoLabel, basicProps, geoProps, ifcProps, nbimProps, nbimLabel }: BuildSelectedPropertyGroupsArgs): PropertyGroups;
export {};
