import React from "react";
import "./RequirementDetailsSidebar.css";

import type { Level, EdgeT, NodeT, Theme, ValidationMethod } from "./sidebar/types";
import { levelMeta, getAccentColor, getThemeColors } from "./sidebar/sidebarConstants";
import SidebarHeader from "./sidebar/SidebarHeader";
import BadgesRow from "./sidebar/BadgesRow";
import DetailsGrid from "./sidebar/DetailsGrid";
import LinkedRequirementsList from "./sidebar/LinkedRequirementsList";

interface Props {
    node: NodeT | undefined;
    open: boolean;
    onClose: () => void;
    theme: Theme;
    edges: EdgeT[];
    nodes: NodeT[];
    validations: ValidationMethod[];
    onNavigateToNode: (nodeId: string) => void;
}

const RequirementDetailsSidebar: React.FC<Props> = ({
    node,
    open,
    onClose,
    theme,
    edges,
    nodes,
    validations,
    onNavigateToNode,
}) => {
    const dark = theme === "dark";
    const data = node?.data;
    const level = (data?.level ?? 1) as Level;
    const meta = levelMeta[level] || levelMeta[1];
    const accentColor = getAccentColor(level, theme);

    const status = data?.status ?? "Active";
    const priority = data?.priority ?? "Medium";
    const owner = data?.owner ?? "Unassigned";
    const rationale = data?.rationale;
    const meansOfValidation = data?.meansOfValidation;
    const description =
        data?.description ??
        `This requirement describes the ${data?.label ?? "selected item"} and its functional boundaries within the ${meta.label} layer. It ensures traceability across all linked sub-requirements and implementation items.`;

    // Derive parent and child requirements from edges
    const parentIds = node
        ? edges.filter((e) => e.source === node.id).map((e) => e.target)
        : [];
    const childIds = node
        ? edges.filter((e) => e.target === node.id).map((e) => e.source)
        : [];

    const nodeMap = React.useMemo(() => {
        const map: Record<string, NodeT> = {};
        nodes.forEach((n) => {
            map[n.id] = n;
        });
        return map;
    }, [nodes]);

    const parentNodes = parentIds.map((id) => nodeMap[id]).filter(Boolean);
    const childNodes = childIds.map((id) => nodeMap[id]).filter(Boolean);

    const colors = getThemeColors(theme);

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
                    background: colors.sidebarBg,
                    borderLeft: `1px solid ${colors.borderColor}`,
                    color: colors.textPrimary,
                }}
                role="complementary"
                aria-label="Requirement details"
            >
                <SidebarHeader
                    node={node}
                    level={level}
                    meta={meta}
                    accentColor={accentColor}
                    borderColor={colors.borderColor}
                    textPrimary={colors.textPrimary}
                    textSecondary={colors.textSecondary}
                    onClose={onClose}
                />

                {/* Body */}
                {node ? (
                    <div className="req-sidebar__body">
                        <BadgesRow status={status} priority={priority} dark={dark} />

                        {/* Description */}
                        <section className="req-sidebar__section">
                            <h3
                                className="req-sidebar__section-title"
                                style={{ color: colors.textSecondary }}
                            >
                                Description
                            </h3>
                            <p
                                className="req-sidebar__description"
                                style={{
                                    background: colors.cardBg,
                                    color: colors.textPrimary,
                                }}
                            >
                                {description}
                            </p>
                        </section>

                        {rationale && (
                            <>
                                <div
                                    className="req-sidebar__divider"
                                    style={{ background: colors.dividerColor }}
                                />
                                <section className="req-sidebar__section">
                                    <h3
                                        className="req-sidebar__section-title"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        Rationale
                                    </h3>
                                    <p
                                        className="req-sidebar__description"
                                        style={{
                                            background: colors.cardBg,
                                            color: colors.textPrimary,
                                        }}
                                    >
                                        {rationale}
                                    </p>
                                </section>
                            </>
                        )}

                        <div
                            className="req-sidebar__divider"
                            style={{ background: colors.dividerColor }}
                        />

                        <DetailsGrid
                            owner={owner}
                            meansOfValidation={meansOfValidation}
                            validationsMap={validations}
                            meta={meta}
                            nodeId={node.id}
                            accentColor={accentColor}
                            textPrimary={colors.textPrimary}
                            textSecondary={colors.textSecondary}
                            cardBg={colors.cardBg}
                            dividerColor={colors.dividerColor}
                        />

                        <div
                            className="req-sidebar__divider"
                            style={{ background: colors.dividerColor }}
                        />

                        <LinkedRequirementsList
                            title="Parent Requirements"
                            titleIcon="⬆"
                            linkedNodes={parentNodes}
                            emptyMessage="No parent requirements."
                            theme={theme}
                            cardBg={colors.cardBg}
                            textPrimary={colors.textPrimary}
                            textSecondary={colors.textSecondary}
                            onNavigateToNode={onNavigateToNode}
                        />

                        <div
                            className="req-sidebar__divider"
                            style={{ background: colors.dividerColor }}
                        />

                        <LinkedRequirementsList
                            title="Child Requirements"
                            titleIcon="⬇"
                            linkedNodes={childNodes}
                            emptyMessage="No child requirements."
                            theme={theme}
                            cardBg={colors.cardBg}
                            textPrimary={colors.textPrimary}
                            textSecondary={colors.textSecondary}
                            onNavigateToNode={onNavigateToNode}
                        />
                    </div>
                ) : (
                    <div className="req-sidebar__empty-state">
                        <div className="req-sidebar__empty-icon">🔍</div>
                        <p style={{ color: colors.textSecondary }}>
                            Click on a requirement node to view its details here.
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default RequirementDetailsSidebar;
