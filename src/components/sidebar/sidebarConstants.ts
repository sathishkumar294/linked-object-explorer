import type { Level, LevelMeta, Theme, ThemeColors } from "./types";

export const levelMeta: Record<Level, LevelMeta> = {
    1: {
        label: "System",
        color: "#3b82f6",
        darkColor: "#60a5fa",
        icon: "🏗️",
    },
    2: {
        label: "Sub-system",
        color: "#22c55e",
        darkColor: "#4ade80",
        icon: "🔧",
    },
    3: {
        label: "Component",
        color: "#38bdf8",
        darkColor: "#7dd3fc",
        icon: "⚙️",
    },
    4: {
        label: "Implementation",
        color: "#f97316",
        darkColor: "#fb923c",
        icon: "💻",
    },
};

export function getAccentColor(level: Level, theme: Theme): string {
    const meta = levelMeta[level] || levelMeta[1];
    return theme === "dark" ? meta.darkColor : meta.color;
}

export function getThemeColors(theme: Theme): ThemeColors {
    const dark = theme === "dark";
    return {
        sidebarBg: dark ? "#18181b" : "#ffffff",
        borderColor: dark ? "#27272a" : "#e5e7eb",
        textPrimary: dark ? "#f4f4f5" : "#111827",
        textSecondary: dark ? "#a1a1aa" : "#6b7280",
        cardBg: dark ? "#27272a" : "#f9fafb",
        dividerColor: dark ? "#3f3f46" : "#e5e7eb",
    };
}

export function getStatusBadge(
    status: string,
    dark: boolean
): { bg: string; text: string; dot: string } {
    const map: Record<string, { bg: string; text: string; dot: string }> = {
        Active: {
            bg: dark ? "#14532d" : "#dcfce7",
            text: dark ? "#4ade80" : "#15803d",
            dot: "#22c55e",
        },
        Draft: {
            bg: dark ? "#1e3a5f" : "#dbeafe",
            text: dark ? "#60a5fa" : "#1d4ed8",
            dot: "#3b82f6",
        },
        Review: {
            bg: dark ? "#451a03" : "#fef3c7",
            text: dark ? "#fbbf24" : "#92400e",
            dot: "#f59e0b",
        },
        Deprecated: {
            bg: dark ? "#3b1f1f" : "#fee2e2",
            text: dark ? "#f87171" : "#b91c1c",
            dot: "#ef4444",
        },
    };
    return map[status] || map["Draft"];
}

export function getPriorityBadge(
    priority: string,
    dark: boolean
): { bg: string; text: string } {
    const map: Record<string, { bg: string; text: string }> = {
        High: {
            bg: dark ? "#3b1f1f" : "#fee2e2",
            text: dark ? "#f87171" : "#b91c1c",
        },
        Medium: {
            bg: dark ? "#451a03" : "#fef3c7",
            text: dark ? "#fbbf24" : "#92400e",
        },
        Low: {
            bg: dark ? "#1e3a5f" : "#dbeafe",
            text: dark ? "#60a5fa" : "#1d4ed8",
        },
    };
    return map[priority] || map["Medium"];
}
