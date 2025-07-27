import {
  Background,
  BackgroundVariant,
  ControlButton,
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

import React, { SetStateAction, useCallback, useState } from "react";

// Custom Node Component with theme support
const RequirementNode = ({
  data,
  theme,
}: {
  data: DataT;
  theme: "light" | "dark";
}) => {
  // Color classes for light and dark themes
  const colorMap: {
    [key in "light" | "dark"]: { [key: number]: string } & { handle: string };
  } = {
    light: {
      1: "bg-blue-100 border-l-blue-500 text-blue-800 border-l-8",
      2: "bg-blue-200 border-l-blue-500 text-blue-800 border-l-8",
      3: "bg-blue-300 border-l-blue-500 text-blue-800 border-l-8",
      4: "bg-orange-100 border-orange-500 border-l-8 text-orange-800",
      handle: "bg-gray-400",
    },
    dark: {
      1: "bg-blue-900 border-l-blue-400 text-blue-100 border-l-8",
      2: "bg-blue-800 border-l-blue-400 text-blue-100 border-l-8",
      3: "bg-blue-700 border-l-blue-400 text-blue-100 border-l-8",
      4: "bg-orange-900 border-orange-400 border-l-8 text-orange-100",
      handle: "bg-gray-200",
    },
  };
  const themeColors = colorMap[theme] || colorMap.light;
  return (
    <div
      className={`px-3 py-2 rounded-md border-2 text-center font-medium shadow-sm ${
        themeColors[data.level]
      }`}
    >
      <div className="font-bold">{data.label}</div>
      <div className="text-xs">Level {data.level}</div>
      <Handle
        type="source"
        position={Position.Top}
        className={themeColors.handle}
      ></Handle>
      <Handle
        type="target"
        position={Position.Bottom}
        className={themeColors.handle}
      ></Handle>
    </div>
  );
};

// NodeTypes with theme support
const getNodeTypes = (theme: "light" | "dark") => ({
  requirement: (props: { data: DataT }) => (
    <RequirementNode {...props} theme={theme} />
  ),
});

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

// Initial edges (source is lower-level, target is higher-level)
const initialEdges: Edge[] = [
  // Level 2 satisfies Level 1
  {
    id: "e21-11",
    source: "2.1",
    target: "1.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e22-11",
    source: "2.2",
    target: "1.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e22-12",
    source: "2.2",
    target: "1.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e23-12",
    source: "2.3",
    target: "1.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Level 3 satisfies Level 2
  {
    id: "e31-21",
    source: "3.1",
    target: "2.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e32-21",
    source: "3.2",
    target: "2.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e33-22",
    source: "3.3",
    target: "2.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e34-22",
    source: "3.4",
    target: "2.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e35-23",
    source: "3.5",
    target: "2.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e36-23",
    source: "3.6",
    target: "2.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e37-21",
    source: "3.7",
    target: "2.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e38-23",
    source: "3.8",
    target: "2.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Level 4 satisfies Level 3
  {
    id: "e41-31",
    source: "4.1",
    target: "3.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e42-31",
    source: "4.2",
    target: "3.1",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e43-32",
    source: "4.3",
    target: "3.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e44-32",
    source: "4.4",
    target: "3.2",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e45-33",
    source: "4.5",
    target: "3.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e46-33",
    source: "4.6",
    target: "3.3",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e47-34",
    source: "4.7",
    target: "3.4",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e48-34",
    source: "4.8",
    target: "3.4",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e49-35",
    source: "4.9",
    target: "3.5",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e410-35",
    source: "4.10",
    target: "3.5",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e411-36",
    source: "4.11",
    target: "3.6",
    label: "satisfy",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e412-36",
    source: "4.12",
    target: "3.6",
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Set body background for theme
  React.useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#18181b" : "#fff";
  }, [theme]);

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
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={getNodeTypes(theme)}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
      >
        <Background
          color={theme === "dark" ? "#22223b" : "#ccc"}
          variant={BackgroundVariant.Dots}
        />
        <Controls>
          <ControlButton
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </ControlButton>
        </Controls>
        <MiniMap
          nodeColor={(n) => {
            if (theme === "dark") {
              if (n.data.level === 1) return "#1e40af";
              if (n.data.level === 2) return "#1e3a8a";
              if (n.data.level === 3) return "#1e293b";
              if (n.data.level === 4) return "#7c2d12";
            } else {
              if (n.data.level === 1) return "#bae6fd";
              if (n.data.level === 2) return "#7dd3fc";
              if (n.data.level === 3) return "#38bdf8";
              if (n.data.level === 4) return "#fdba74";
            }
            return "#888";
          }}
        />

        {selectedNode && (
          <Panel
            position="top-right"
            className={
              theme === "dark"
                ? "bg-gray-900 text-white p-4 rounded-lg shadow-lg w-64"
                : "bg-white p-4 rounded-lg shadow-lg w-64"
            }
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">Requirement Details</h3>
              <button
                onClick={closeDetails}
                className={
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200 text-2xl leading-none"
                    : "text-gray-500 hover:text-gray-700 text-2xl leading-none"
                }
              >
                ×
              </button>
            </div>

            <div
              className={
                theme === "dark"
                  ? "bg-gray-800 p-3 rounded mb-3"
                  : "bg-gray-100 p-3 rounded mb-3"
              }
            >
              <h4 className="font-semibold">{selectedNode.data.label}</h4>
              <p className="text-sm">Level: {selectedNode.data.level}</p>
            </div>
          </Panel>
        )}

        <Panel
          position="bottom-center"
          className={
            theme === "dark"
              ? "bg-gray-900 p-3 rounded-lg shadow-md text-xs text-gray-300"
              : "bg-white p-3 rounded-lg shadow-md text-xs text-gray-600"
          }
        >
          <div
            className={
              theme === "dark"
                ? "text-xs text-gray-400"
                : "text-xs text-gray-500"
            }
          >
            <div className="flex items-center mb-1">
              <div
                className={
                  theme === "dark"
                    ? "w-3 h-3 bg-blue-900 border border-blue-400 mr-2"
                    : "w-3 h-3 bg-red-100 border border-red-500 mr-2"
                }
              ></div>
              <span>Level 1 (System)</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className={
                  theme === "dark"
                    ? "w-3 h-3 bg-blue-800 border border-blue-400 mr-2"
                    : "w-3 h-3 bg-green-100 border border-green-500 mr-2"
                }
              ></div>
              <span>Level 2 (Sub-system)</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className={
                  theme === "dark"
                    ? "w-3 h-3 bg-blue-700 border border-blue-400 mr-2"
                    : "w-3 h-3 bg-blue-100 border border-blue-500 mr-2"
                }
              ></div>
              <span>Level 3 (Component)</span>
            </div>
            <div className="flex items-center">
              <div
                className={
                  theme === "dark"
                    ? "w-3 h-3 bg-orange-900 border border-orange-400 mr-2"
                    : "w-3 h-3 bg-orange-100 border border-orange-500 mr-2"
                }
              ></div>
              <span>Level 4 (Implementation)</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
