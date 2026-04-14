import React from "react";
interface PaginationControlsProps {
    prevTitle: string;
    nextTitle: string;
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    rightContent?: React.ReactNode;
}
export declare const PaginationControls: React.FC<PaginationControlsProps>;
export {};
