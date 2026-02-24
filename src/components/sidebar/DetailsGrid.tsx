import React from "react";
import type { LevelMeta, ValidationMethod } from "./types";
interface DetailsGridProps {
    owner: string;
    meansOfValidation?: string[];
    validationsMap: ValidationMethod[];
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
    meansOfValidation,
    validationsMap,
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
                {meansOfValidation && meansOfValidation.length > 0 && (
                    <>
                        <div
                            className="req-sidebar__detail-divider"
                            style={{ background: dividerColor }}
                        />
                        <div className="req-sidebar__detail-row">
                            <span
                                className="req-sidebar__detail-key"
                                style={{ color: textSecondary }}
                            >
                                Validation
                            </span>
                            <span
                                className="req-sidebar__detail-value"
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                            >
                                {meansOfValidation.map((v: string) => {
                                    const validationConfig = validationsMap.find((val: ValidationMethod) => val.id === v);
                                    const label = validationConfig?.label || v.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                                    const bgColor = validationConfig?.color || textSecondary;

                                    return (
                                        <span
                                            key={v}
                                            style={{
                                                backgroundColor: bgColor,
                                                color: '#ffffff',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default DetailsGrid;
