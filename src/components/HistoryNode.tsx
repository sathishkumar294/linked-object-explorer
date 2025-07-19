import React from "react";

interface HistoryNodeProps {
  node: {
    id: string;
    name: string;
    x?: number;
    y?: number;
  };
}

const HistoryNode: React.FC<HistoryNodeProps> = ({ node }) => {
  return (
    <circle className="history-node" r={8} fill="lightcoral">
      {node.name}
    </circle>
  );
};

export default HistoryNode;
