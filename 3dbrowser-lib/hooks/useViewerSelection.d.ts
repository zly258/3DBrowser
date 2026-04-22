import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import * as THREE from "three";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { PropertyGroupInput, PropertyGroups } from "../viewer/propertyIndex";
import { type ClashSummaryRecord } from "../viewer/selectionDetails";
interface UseViewerSelectionOptions {
    sceneMgrRef: MutableRefObject<SceneManager | null>;
    selectedUuids: string[];
    setSelectedUuids: Dispatch<SetStateAction<string[]>>;
    setSelectedProps: Dispatch<SetStateAction<PropertyGroups | null>>;
    setHiddenUuids: Dispatch<SetStateAction<Set<string>>>;
    setIsolatedUuids: Dispatch<SetStateAction<Set<string>>>;
    updateTree: () => void;
    propOnSelect?: (uuid: string, object: any) => void;
    ifcPropertyCacheRef: RefObject<Map<string, Record<string, PropertyGroupInput>>>;
    clashSummaryByUuid: Record<string, ClashSummaryRecord>;
    focusObjectsInView: (options: {
        uuids: string[];
        focusUuid?: string | null;
        highlightColors?: Record<string, string>;
        updateSelection?: boolean;
    }) => boolean;
    t: (key: string) => string;
    isDev?: boolean;
}
export declare function useViewerSelection({ sceneMgrRef, selectedUuids, setSelectedUuids, setSelectedProps, setHiddenUuids, setIsolatedUuids, updateTree, propOnSelect, ifcPropertyCacheRef, clashSummaryByUuid, focusObjectsInView, t, isDev }: UseViewerSelectionOptions): {
    locatedUuid: string;
    locateResultUuids: string[];
    resetLocateState: () => void;
    handleSelect: (obj: any, _intersect?: THREE.Intersection | null, isMultiSelect?: boolean, skipHighlight?: boolean) => Promise<void>;
    handleLocateObject: (obj: any) => boolean;
    handleLocateResultsChange: (uuids: string[]) => void;
    handleClearLocate: () => void;
};
export {};
