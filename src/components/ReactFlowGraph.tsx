import {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { SetStateAction, useCallback, useState } from "react";

// Custom Node Component
const RequirementNode = ({ data }: { data: DataT }) => {
  return (
    <div
      className={`px-3 py-2 rounded-md border-2 text-center font-medium shadow-sm ${
        data.level === 1
          ? "bg-blue-100 border-l-blue-500 text-blue-800 border-l-8"
          : data.level === 2
          ? "bg-blue-200 border-l-blue-500 text-blue-800 border-l-8"
          : data.level === 3
          ? "bg-blue-300 border-l-blue-500 text-blue-800 border-l-8"
          : "bg-orange-100 border-orange-500 border-l-8 text-orange-800"
      }`}
    >
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">Level {data.level}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-gray-400 dark:bg-white"
      ></Handle>
      <Handle
        type="target"
        position={Position.Top}
        className="bg-gray-400 dark:bg-white"
      ></Handle>
    </div>
  );
};

const nodeTypes = {
  requirement: RequirementNode,
};

type DataT = {
  label: string;
  level: number;
};

type PositionT = {
  x: number;
  y: number;
};

type NodeT = {
  id: string;
  type: string;
  position: PositionT;
  data: DataT;
};

// Initial nodes
const initialNodes: NodeT[] = [
  // Level 1
  {
    id: "1.1",
    type: "requirement",
    position: { x: 300, y: 50 },
    data: { label: "Req 1.1", level: 1 },
  },
  {
    id: "1.2",
    type: "requirement",
    position: { x: 600, y: 50 },
    data: { label: "Req 1.2", level: 1 },
  },

  // Level 2
  {
    id: "2.1",
    type: "requirement",
    position: { x: 150, y: 200 },
    data: { label: "Req 2.1", level: 2 },
  },
  {
    id: "2.2",
    type: "requirement",
    position: { x: 450, y: 200 },
    data: { label: "Req 2.2", level: 2 },
  },
  {
    id: "2.3",
    type: "requirement",
    position: { x: 750, y: 200 },
    data: { label: "Req 2.3", level: 2 },
  },

  // Level 3
  {
    id: "3.1",
    type: "requirement",
    position: { x: 100, y: 375 },
    data: { label: "Req 3.1", level: 3 },
  },
  {
    id: "3.2",
    type: "requirement",
    position: { x: 250, y: 375 },
    data: { label: "Req 3.2", level: 3 },
  },
  {
    id: "3.3",
    type: "requirement",
    position: { x: 400, y: 375 },
    data: { label: "Req 3.3", level: 3 },
  },
  {
    id: "3.4",
    type: "requirement",
    position: { x: 550, y: 375 },
    data: { label: "Req 3.4", level: 3 },
  },
  {
    id: "3.5",
    type: "requirement",
    position: { x: 700, y: 375 },
    data: { label: "Req 3.5", level: 3 },
  },
  {
    id: "3.6",
    type: "requirement",
    position: { x: 850, y: 375 },
    data: { label: "Req 3.6", level: 3 },
  },
  {
    id: "3.7",
    type: "requirement",
    position: { x: 1000, y: 375 },
    data: { label: "Req 3.7", level: 3 },
  },
  {
    id: "3.8",
    type: "requirement",
    position: { x: 1150, y: 375 },
    data: { label: "Req 3.8", level: 3 },
  },

  // Level 4
  {
    id: "4.1",
    type: "requirement",
    position: { x: 50, y: 550 },
    data: { label: "Req 4.1", level: 4 },
  },
  {
    id: "4.2",
    type: "requirement",
    position: { x: 150, y: 550 },
    data: { label: "Req 4.2", level: 4 },
  },
  {
    id: "4.3",
    type: "requirement",
    position: { x: 250, y: 550 },
    data: { label: "Req 4.3", level: 4 },
  },
  {
    id: "4.4",
    type: "requirement",
    position: { x: 350, y: 550 },
    data: { label: "Req 4.4", level: 4 },
  },
  {
    id: "4.5",
    type: "requirement",
    position: { x: 450, y: 550 },
    data: { label: "Req 4.5", level: 4 },
  },
  {
    id: "4.6",
    type: "requirement",
    position: { x: 550, y: 550 },
    data: { label: "Req 4.6", level: 4 },
  },
  {
    id: "4.7",
    type: "requirement",
    position: { x: 650, y: 550 },
    data: { label: "Req 4.7", level: 4 },
  },
  {
    id: "4.8",
    type: "requirement",
    position: { x: 750, y: 550 },
    data: { label: "Req 4.8", level: 4 },
  },
  {
    id: "4.9",
    type: "requirement",
    position: { x: 850, y: 550 },
    data: { label: "Req 4.9", level: 4 },
  },
  {
    id: "4.10",
    type: "requirement",
    position: { x: 950, y: 550 },
    data: { label: "Req 4.10", level: 4 },
  },
  {
    id: "4.11",
    type: "requirement",
    position: { x: 1050, y: 550 },
    data: { label: "Req 4.11", level: 4 },
  },
  {
    id: "4.12",
    type: "requirement",
    position: { x: 1150, y: 550 },
    data: { label: "Req 4.12", level: 4 },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  // Level 1 to 2
  {
    id: "e11-21",
    source: "1.1",
    target: "2.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e11-22",
    source: "1.1",
    target: "2.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e12-22",
    source: "1.2",
    target: "2.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e12-23",
    source: "1.2",
    target: "2.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Level 2 to 3
  {
    id: "e21-31",
    source: "2.1",
    target: "3.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e21-32",
    source: "2.1",
    target: "3.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e22-33",
    source: "2.2",
    target: "3.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e22-34",
    source: "2.2",
    target: "3.4",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e23-35",
    source: "2.3",
    target: "3.5",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e23-36",
    source: "2.3",
    target: "3.6",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e21-37",
    source: "2.1",
    target: "3.7",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e23-38",
    source: "2.3",
    target: "3.8",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Level 3 to 4
  {
    id: "e31-41",
    source: "3.1",
    target: "4.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e31-42",
    source: "3.1",
    target: "4.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e32-43",
    source: "3.2",
    target: "4.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e32-44",
    source: "3.2",
    target: "4.4",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e33-45",
    source: "3.3",
    target: "4.5",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e33-46",
    source: "3.3",
    target: "4.6",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e34-47",
    source: "3.4",
    target: "4.7",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e34-48",
    source: "3.4",
    target: "4.8",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e35-49",
    source: "3.5",
    target: "4.9",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e35-410",
    source: "3.5",
    target: "4.10",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e36-411",
    source: "3.6",
    target: "4.11",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e36-412",
    source: "3.6",
    target: "4.12",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function ReactFlowGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(
    initialEdges.map((edge) => ({
      ...edge,
      sourceHandle: null,
      targetHandle: null,
    }))
  );
  const [selectedNode, setSelectedNode] = useState<NodeT | undefined>();

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: SetStateAction<NodeT | undefined>) => {
      setSelectedNode(node);
    },
    []
  );

  const closeDetails = () => {
    setSelectedNode(undefined);
  };

  return (
    <div style={{ height: 1000, width: 1200 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
      >
        <Background />
        <Controls />
        <MiniMap />

        {selectedNode && (
          <Panel
            position="top-right"
            className="bg-white p-4 rounded-lg shadow-lg w-64"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">Requirement Details</h3>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-100 p-3 rounded mb-3">
              <h4 className="font-semibold">{selectedNode.data.label}</h4>
              <p className="text-sm">Level: {selectedNode.data.level}</p>
              <p className="text-xs mt-1">
                {selectedNode.data.level === 1
                  ? "Top-level system requirement"
                  : selectedNode.data.level === 2
                  ? "Sub-system requirement"
                  : selectedNode.data.level === 3
                  ? "Component requirement"
                  : "Implementation requirement"}
              </p>
            </div>

            <div className="text-xs text-gray-500">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-red-100 border border-red-500 mr-2"></div>
                <span>Level 1 (System)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-green-100 border border-green-500 mr-2"></div>
                <span>Level 2 (Sub-system)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-500 mr-2"></div>
                <span>Level 3 (Component)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-100 border border-orange-500 mr-2"></div>
                <span>Level 4 (Implementation)</span>
              </div>
            </div>
          </Panel>
        )}

        <Panel
          position="bottom-left"
          className="bg-white p-3 rounded-lg shadow-md text-xs text-gray-600"
        >
          <p>• Drag nodes to reposition</p>
          <p>• Drag background to pan</p>
          <p>• Scroll to zoom</p>
          <p>• Click nodes for details</p>
        </Panel>
      </ReactFlow>
    </div>
  );
}
