import { type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import type { SceneManager } from "../utils/scene-manager/SceneManager";
import type { PropertyGroups } from "../viewer/propertyIndex";
interface FocusInViewOptions {
    sceneMgrRef: MutableRefObject<SceneManager | null>;
    setSelectedUuids: Dispatch<SetStateAction<string[]>>;
    setSelectedProps?: Dispatch<SetStateAction<PropertyGroups | null>>;
}
interface FocusRequest {
    uuids: string[];
    focusUuid?: string | null;
    highlightColors?: Record<string, string>;
    updateSelection?: boolean;
}
export declare function useFocusInView({ sceneMgrRef, setSelectedUuids, setSelectedProps }: FocusInViewOptions): {
    focusObjectsInView: ({ uuids, focusUuid, highlightColors, updateSelection }: FocusRequest) => boolean;
};
export {};
