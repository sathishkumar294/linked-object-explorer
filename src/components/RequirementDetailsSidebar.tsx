import React from "react";
import "./RequirementDetailsSidebar.css";

type Level = 1 | 2 | 3 | 4;

type DataT = {
    label: string;
    level: number;
    description?: string;
    status?: string;
    priority?: string;
    owner?: string;
    linkedItems?: string[];
};

type NodeT = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: DataT;
};

type Theme = "light" | "dark";

interface Props {
    node: NodeT | undefined;
    open: boolean;
    onClose: () => void;
    theme: Theme;
}

const levelMeta: Record<
    Level,
    { label: string; color: string; darkColor: string; icon: string }
> = {
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

function getStatusBadge(status: string, dark: boolean) {
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
    const s = map[status] || map["Draft"];
    return s;
}

function getPriorityBadge(priority: string, dark: boolean) {
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

const RequirementDetailsSidebar: React.FC<Props> = ({
    node,
    open,
    onClose,
    theme,
}) => {
    const dark = theme === "dark";
    const data = node?.data;
    const level = (data?.level ?? 1) as Level;
    const meta = levelMeta[level] || levelMeta[1];
    const accentColor = dark ? meta.darkColor : meta.color;

    const status = data?.status ?? "Active";
    const priority = data?.priority ?? "Medium";
    const owner = data?.owner ?? "Unassigned";
    const description =
        data?.description ??
        `This requirement describes the ${data?.label ?? "selected item"} and its functional boundaries within the ${meta.label} layer. It ensures traceability across all linked sub-requirements and implementation items.`;
    const linkedItems = data?.linkedItems ?? [];

    const statusStyle = getStatusBadge(status, dark);
    const priorityStyle = getPriorityBadge(priority, dark);

    const sidebarBg = dark ? "#18181b" : "#ffffff";
    const borderColor = dark ? "#27272a" : "#e5e7eb";
    const textPrimary = dark ? "#f4f4f5" : "#111827";
    const textSecondary = dark ? "#a1a1aa" : "#6b7280";
    const cardBg = dark ? "#27272a" : "#f9fafb";
    const dividerColor = dark ? "#3f3f46" : "#e5e7eb";

    return (
        <>
            {/* Backdrop */}
            <div
                className={`req-sidebar-backdrop${open ? " req-sidebar-backdrop--visible" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                className={`req-sidebar${open ? " req-sidebar--open" : ""}`}
                style={{
                    background: sidebarBg,
                    borderLeft: `1px solid ${borderColor}`,
                    color: textPrimary,
                }}
                role="complementary"
                aria-label="Requirement details"
            >
                {/* Header */}
                <div
                    className="req-sidebar__header"
                    style={{
                        borderBottom: `1px solid ${borderColor}`,
                        borderLeft: `4px solid ${accentColor}`,
                    }}
                >
                    <div className="req-sidebar__header-top">
                        <div className="req-sidebar__header-badge" style={{ color: accentColor }}>
                            <span className="req-sidebar__level-icon">{meta.icon}</span>
                            <span
                                className="req-sidebar__level-label"
                                style={{ color: accentColor }}
                            >
                                Level {level} · {meta.label}
                            </span>
                        </div>
                        <button
                            className="req-sidebar__close-btn"
                            onClick={onClose}
                            aria-label="Close sidebar"
                            style={{ color: textSecondary }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 5L5 15M5 5l10 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <h2 className="req-sidebar__title" style={{ color: textPrimary }}>
                        {data?.label ?? "No requirement selected"}
                    </h2>
                    {node && (
                        <span className="req-sidebar__id" style={{ color: textSecondary }}>
                            ID: {node.id}
                        </span>
                    )}
                </div>

                {/* Body */}
                {node ? (
                    <div className="req-sidebar__body">
                        {/* Status + Priority row */}
                        <div className="req-sidebar__badges-row">
                            <span
                                className="req-sidebar__badge"
                                style={{
                                    background: statusStyle.bg,
                                    color: statusStyle.text,
                                }}
                            >
                                <span
                                    className="req-sidebar__badge-dot"
                                    style={{ background: statusStyle.dot }}
                                />
                                {status}
                            </span>
                            <span
                                className="req-sidebar__badge"
                                style={{
                                    background: priorityStyle.bg,
                                    color: priorityStyle.text,
                                }}
                            >
                                {priority === "High" ? "⬆" : priority === "Low" ? "⬇" : "➡"}{" "}
                                {priority} Priority
                            </span>
                        </div>

                        {/* Description */}
                        <section className="req-sidebar__section">
                            <h3
                                className="req-sidebar__section-title"
                                style={{ color: textSecondary }}
                            >
                                Description
                            </h3>
                            <p
                                className="req-sidebar__description"
                                style={{ background: cardBg, color: textPrimary }}
                            >
                                {description}
                            </p>
                        </section>

                        <div
                            className="req-sidebar__divider"
                            style={{ background: dividerColor }}
                        />

                        {/* Details grid */}
                        <section className="req-sidebar__section">
                            <h3
                                className="req-sidebar__section-title"
                                style={{ color: textSecondary }}
                            >
                                Details
                            </h3>
                            <div
                                className="req-sidebar__details-grid"
                                style={{ background: cardBg }}
                            >
                                <div className="req-sidebar__detail-row">
                                    <span
                                        className="req-sidebar__detail-key"
                                        style={{ color: textSecondary }}
                                    >
                                        Owner
                                    </span>
                                    <span
                                        className="req-sidebar__detail-value"
                                        style={{ color: textPrimary }}
                                    >
                                        {owner}
                                    </span>
                                </div>
                                <div
                                    className="req-sidebar__detail-divider"
                                    style={{ background: dividerColor }}
                                />
                                <div className="req-sidebar__detail-row">
                                    <span
                                        className="req-sidebar__detail-key"
                                        style={{ color: textSecondary }}
                                    >
                                        Level
                                    </span>
                                    <span
                                        className="req-sidebar__detail-value"
                                        style={{ color: accentColor }}
                                    >
                                        {meta.icon} {meta.label}
                                    </span>
                                </div>
                                <div
                                    className="req-sidebar__detail-divider"
                                    style={{ background: dividerColor }}
                                />
                                <div className="req-sidebar__detail-row">
                                    <span
                                        className="req-sidebar__detail-key"
                                        style={{ color: textSecondary }}
                                    >
                                        Node ID
                                    </span>
                                    <span
                                        className="req-sidebar__detail-value req-sidebar__detail-mono"
                                        style={{ color: textPrimary }}
                                    >
                                        {node.id}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <div
                            className="req-sidebar__divider"
                            style={{ background: dividerColor }}
                        />

                        {/* Linked items */}
                        <section className="req-sidebar__section">
                            <h3
                                className="req-sidebar__section-title"
                                style={{ color: textSecondary }}
                            >
                                Linked Requirements
                            </h3>
                            {linkedItems.length > 0 ? (
                                <ul className="req-sidebar__linked-list">
                                    {linkedItems.map((item) => (
                                        <li
                                            key={item}
                                            className="req-sidebar__linked-item"
                                            style={{
                                                background: cardBg,
                                                borderLeft: `3px solid ${accentColor}`,
                                                color: textPrimary,
                                            }}
                                        >
                                            <span style={{ color: accentColor }}>↗</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p
                                    className="req-sidebar__empty"
                                    style={{ color: textSecondary }}
                                >
                                    No linked requirements found.
                                </p>
                            )}
                        </section>
                    </div>
                ) : (
                    <div className="req-sidebar__empty-state">
                        <div className="req-sidebar__empty-icon">🔍</div>
                        <p style={{ color: textSecondary }}>
                            Click on a requirement node to view its details here.
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default RequirementDetailsSidebar;
