import React from "react";
import type { Level, LevelMeta, NodeT } from "./types";

interface SidebarHeaderProps {
    node: NodeT | undefined;
    level: Level;
    meta: LevelMeta;
    accentColor: string;
    borderColor: string;
    textPrimary: string;
    textSecondary: string;
    onClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
    node,
    level,
    meta,
    accentColor,
    borderColor,
    textPrimary,
    textSecondary,
    onClose,
}) => {
    return (
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
                {node?.data?.label ?? "No requirement selected"}
            </h2>
            {node && (
                <span className="req-sidebar__id" style={{ color: textSecondary }}>
                    ID: {node.id}
                </span>
            )}
        </div>
    );
};

export default SidebarHeader;
