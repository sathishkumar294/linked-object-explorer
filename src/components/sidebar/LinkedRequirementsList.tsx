import React from "react";
import type { Level, NodeT, Theme } from "./types";
import { levelMeta } from "./sidebarConstants";

interface LinkedRequirementsListProps {
    title: string;
    titleIcon: string;
    linkedNodes: NodeT[];
    emptyMessage: string;
    theme: Theme;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    onNavigateToNode: (nodeId: string) => void;
}

const LinkedRequirementsList: React.FC<LinkedRequirementsListProps> = ({
    title,
    titleIcon,
    linkedNodes,
    emptyMessage,
    theme,
    cardBg,
    textPrimary,
    textSecondary,
    onNavigateToNode,
}) => {
    const dark = theme === "dark";

    return (
        <section className="req-sidebar__section">
            <h3
                className="req-sidebar__section-title"
                style={{ color: textSecondary }}
            >
                <span style={{ marginRight: 6 }}>{titleIcon}</span> {title}
            </h3>
            {linkedNodes.length > 0 ? (
                <ul className="req-sidebar__linked-list">
                    {linkedNodes.map((linkedNode) => {
                        const nodeLevel = (linkedNode.data.level ?? 1) as Level;
                        const nodeMeta = levelMeta[nodeLevel] || levelMeta[1];
                        const nodeColor = dark ? nodeMeta.darkColor : nodeMeta.color;
                        return (
                            <li
                                key={linkedNode.id}
                                className="req-sidebar__linked-item req-sidebar__linked-item--clickable"
                                style={{
                                    background: cardBg,
                                    borderLeft: `3px solid ${nodeColor}`,
                                    color: textPrimary,
                                }}
                                onClick={() => onNavigateToNode(linkedNode.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onNavigateToNode(linkedNode.id);
                                    }
                                }}
                            >
                                <span
                                    className="req-sidebar__linked-icon"
                                    style={{ color: nodeColor }}
                                >
                                    {nodeMeta.icon}
                                </span>
                                <span className="req-sidebar__linked-label">
                                    {linkedNode.data.label}
                                </span>
                                <span
                                    className="req-sidebar__linked-level"
                                    style={{ color: nodeColor }}
                                >
                                    L{nodeLevel}
                                </span>
                                <span
                                    className="req-sidebar__linked-arrow"
                                    style={{ color: textSecondary }}
                                >
                                    →
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="req-sidebar__empty" style={{ color: textSecondary }}>
                    {emptyMessage}
                </p>
            )}
        </section>
    );
};

export default LinkedRequirementsList;
