import { type PropertyGroupInput, type PropertyGroups } from "./propertyIndex";
interface BuildSelectedPropertyGroupsArgs {
    basicLabel: string;
    geoLabel: string;
    basicProps: Record<string, string>;
    geoProps: Record<string, string>;
    ifcProps?: Record<string, PropertyGroupInput> | null;
    nbimProps?: PropertyGroupInput | null;
    nbimLabel?: string;
}
export declare function buildSelectedPropertyGroups({ basicLabel, geoLabel, basicProps, geoProps, ifcProps, nbimProps, nbimLabel }: BuildSelectedPropertyGroupsArgs): PropertyGroups;
export {};
