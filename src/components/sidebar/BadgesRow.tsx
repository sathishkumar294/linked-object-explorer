import React from "react";
import { getStatusBadge, getPriorityBadge } from "./sidebarConstants";

interface BadgesRowProps {
    status: string;
    priority: string;
    dark: boolean;
}

const BadgesRow: React.FC<BadgesRowProps> = ({ status, priority, dark }) => {
    const statusStyle = getStatusBadge(status, dark);
    const priorityStyle = getPriorityBadge(priority, dark);

    return (
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
    );
};

export default BadgesRow;
