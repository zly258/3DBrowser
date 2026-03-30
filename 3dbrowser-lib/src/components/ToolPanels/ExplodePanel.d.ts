import React from "react";
import { TFunc } from "../../theme/Locales";
type ExplodeMode = "radial" | "horizontal" | "vertical";
interface ExplodePanelProps {
    t: TFunc;
    onClose: () => void;
    enabled: boolean;
    strength: number;
    mode: ExplodeMode;
    onEnabledChange: (value: boolean) => void;
    onStrengthChange: (value: number) => void;
    onModeChange: (value: ExplodeMode) => void;
    onReset: () => void;
    theme?: any;
}
export declare const ExplodePanel: React.FC<ExplodePanelProps>;
export {};
