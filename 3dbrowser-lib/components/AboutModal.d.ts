import React from "react";
import { TFunc } from "../theme/locales";
interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: TFunc;
    theme: any;
}
export declare const AboutModal: React.FC<AboutModalProps>;
export {};
