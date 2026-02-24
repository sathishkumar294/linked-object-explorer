export type Level = 1 | 2 | 3 | 4;

export type DataT = {
    label: string;
    level: number;
    description?: string;
    status?: string;
    priority?: string;
    owner?: string;
    linkedItems?: string[];
};

export type EdgeT = {
    id: string;
    source: string;
    target: string;
    [key: string]: unknown;
};

export type NodeT = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: DataT;
};

export type Theme = "light" | "dark";

/** Resolved theme colors for the sidebar, derived from the current theme */
export interface ThemeColors {
    sidebarBg: string;
    borderColor: string;
    textPrimary: string;
    textSecondary: string;
    cardBg: string;
    dividerColor: string;
}

export interface LevelMeta {
    label: string;
    color: string;
    darkColor: string;
    icon: string;
}
