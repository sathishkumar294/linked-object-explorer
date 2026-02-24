import React from "react";
import type { LevelMeta } from "./types";

interface DetailsGridProps {
    owner: string;
    meta: LevelMeta;
    nodeId: string;
    accentColor: string;
    textPrimary: string;
    textSecondary: string;
    cardBg: string;
    dividerColor: string;
}

const DetailsGrid: React.FC<DetailsGridProps> = ({
    owner,
    meta,
    nodeId,
    accentColor,
    textPrimary,
    textSecondary,
    cardBg,
    dividerColor,
}) => {
    return (
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
                        {nodeId}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default DetailsGrid;
