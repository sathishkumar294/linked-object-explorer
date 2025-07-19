import React from "react";

interface NodeProps {
  node: {
    id: string;
    name: string;
    x?: number;
    y?: number;
  };
}

const Node: React.FC<NodeProps> = ({ node }) => {
  return (
    <g>
      <circle className="node" r={10} fill="steelblue" />
      <text className="label" x={12} y={5}>
        {node.name}
      </text>
    </g>
  );
};

export default Node;
