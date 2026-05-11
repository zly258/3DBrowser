import React from "react";
interface MenuItemProps {
    label: string;
    children: (close: () => void) => React.ReactNode;
    enabled?: boolean;
    className?: string;
}
export declare const ClassicMenuItem: React.FC<MenuItemProps>;
interface SubItemProps {
    label: string;
    onClick: () => void;
    enabled?: boolean;
    checked?: boolean;
    icon?: React.ReactNode;
    className?: string;
}
export declare const ClassicSubItem: React.FC<SubItemProps>;
export {};
