import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  NodeChange,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  applyNodeChanges,
} from "@xyflow/react";

import React, { SetStateAction, useCallback, useState, useMemo } from "react";
import { useStore } from "@xyflow/react";

// Dynamically calculate level bands based on viewport height
function getLevelBands(): Record<
  number,
  { top: number; bottom: number; center: number }
> {
  const vh = window.innerHeight || 800;
  const levels = 4;
  const bandHeight = vh / levels;
  const bands: Record<number, { top: number; bottom: number; center: number }> =
    {};
  for (let i = 1; i <= levels; i++) {
    const top = (i - 1) * bandHeight;
    const bottom = i * bandHeight;
    const center = top + bandHeight / 2;
    bands[i] = { top, bottom, center };
  }
  return bands;
}

let LEVEL_BANDS = getLevelBands();
window.addEventListener("resize", () => {
  LEVEL_BANDS = getLevelBands();
});

// Overlay that renders level bands in graph coordinates, so they pan/zoom with the graph
const LevelBandsOverlay: React.FC<{ theme: "light" | "dark" }> = ({
  theme,
}) => {
  // Get transform and dimensions from React Flow store
  const [x, y, zoom, width, height] = useStore((s) => [
    s.transform[0],
    s.transform[1],
    s.transform[2],
    s.width,
    s.height,
  ]);
  const bands = [1, 2, 3, 4];
  const bandColor = theme === "dark" ? "#1725540F" : "#BFDBFE1A";
  const lineColor = theme === "dark" ? "#374151" : "#93C5FD";
  const gridColor = theme === "dark" ? "#1e293b" : "#bae6fd";

  // The overlay SVG is rendered in graph coordinates, so we invert the transform
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: width,
        height: height,
        zIndex: 0,
        pointerEvents: "none",
      }}
      width={width}
      height={height}
    >
      <g transform={`scale(${zoom}) translate(${x / zoom},${y / zoom})`}>
        {bands.map((level) => {
          const { top, bottom } = LEVEL_BANDS[level];
          return (
            <g key={level}>
              <rect
                x={0}
                y={top}
                width={2000}
                height={bottom - top}
                fill={bandColor}
                stroke="none"
              />
              <line
                x1={0}
                x2={2000}
                y1={bottom}
                y2={bottom}
                stroke={lineColor}
                strokeDasharray="8 4"
                strokeWidth={2}
              />
            </g>
          );
        })}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={100 + i * 100}
            y1={0}
            x2={600 + i * 60}
            y2={height}
            stroke={gridColor}
            strokeWidth={1}
            opacity={0.25}
          />
        ))}
      </g>
    </svg>
  );
};

// Centralized color map for all node, minimap, and legend color assignments
type Level = 1 | 2 | 3 | 4;
type Theme = "light" | "dark";
type NodeColorConfig = {
  [key in Level]: { bg: string; minimap: string; legend: string };
} & { handle: string };
const nodeColorMap: Record<Theme, NodeColorConfig> = {
  light: {
    1: {
      bg: "bg-blue-100 border-l-blue-500 text-blue-800 border-l-8",
      minimap: "#bae6fd",
      legend: "bg-blue-100 border border-blue-500",
    },
    2: {
      bg: "bg-blue-200 border-l-blue-500 text-blue-800 border-l-8",
      minimap: "#7dd3fc",
      legend: "bg-green-100 border border-green-500",
    },
    3: {
      bg: "bg-blue-300 border-l-blue-500 text-blue-800 border-l-8",
      minimap: "#38bdf8",
      legend: "bg-blue-100 border border-blue-500",
    },
    4: {
      bg: "bg-orange-100 border-orange-500 border-l-8 text-orange-800",
      minimap: "#fdba74",
      legend: "bg-orange-100 border border-orange-500",
    },
    handle: "bg-gray-400",
  },
  dark: {
    1: {
      bg: "bg-blue-900 border-l-blue-400 text-blue-100 border-l-8",
      minimap: "#1e40af",
      legend: "bg-blue-900 border border-blue-400",
    },
    2: {
      bg: "bg-blue-800 border-l-blue-400 text-blue-100 border-l-8",
      minimap: "#1e3a8a",
      legend: "bg-blue-800 border border-blue-400",
    },
    3: {
      bg: "bg-blue-700 border-l-blue-400 text-blue-100 border-l-8",
      minimap: "#1e293b",
      legend: "bg-blue-700 border border-blue-400",
    },
    4: {
      bg: "bg-orange-900 border-orange-400 border-l-8 text-orange-100",
      minimap: "#7c2d12",
      legend: "bg-orange-900 border border-orange-400",
    },
    handle: "bg-gray-200",
  },
};

// Custom Node Component with theme support
const RequirementNode = ({ data, theme }: { data: DataT; theme: Theme }) => {
  const themeColors = nodeColorMap[theme] || nodeColorMap.light;
  const level = data.level as Level;
  return (
    <div
      className={`px-3 py-2 rounded-md border-2 text-center font-medium shadow-sm ${themeColors[level].bg}`}
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

// Initial nodes, centered vertically in their level
const initialNodes: NodeT[] = [
  // Level 1
  {
    id: "1.1",
    type: "requirement",
    position: { x: 300, y: 0 },
    data: { label: "Req 1.1", level: 1 },
  },
  {
    id: "1.2",
    type: "requirement",
    position: { x: 600, y: 0 },
    data: { label: "Req 1.2", level: 1 },
  },
  // Level 2
  {
    id: "2.1",
    type: "requirement",
    position: { x: 150, y: 0 },
    data: { label: "Req 2.1", level: 2 },
  },
  {
    id: "2.2",
    type: "requirement",
    position: { x: 450, y: 0 },
    data: { label: "Req 2.2", level: 2 },
  },
  {
    id: "2.3",
    type: "requirement",
    position: { x: 750, y: 0 },
    data: { label: "Req 2.3", level: 2 },
  },
  // Level 3
  {
    id: "3.1",
    type: "requirement",
    position: { x: 100, y: 0 },
    data: { label: "Req 3.1", level: 3 },
  },
  {
    id: "3.2",
    type: "requirement",
    position: { x: 250, y: 0 },
    data: { label: "Req 3.2", level: 3 },
  },
  {
    id: "3.3",
    type: "requirement",
    position: { x: 400, y: 0 },
    data: { label: "Req 3.3", level: 3 },
  },
  {
    id: "3.4",
    type: "requirement",
    position: { x: 550, y: 0 },
    data: { label: "Req 3.4", level: 3 },
  },
  {
    id: "3.5",
    type: "requirement",
    position: { x: 700, y: 0 },
    data: { label: "Req 3.5", level: 3 },
  },
  {
    id: "3.6",
    type: "requirement",
    position: { x: 850, y: 0 },
    data: { label: "Req 3.6", level: 3 },
  },
  {
    id: "3.7",
    type: "requirement",
    position: { x: 1000, y: 0 },
    data: { label: "Req 3.7", level: 3 },
  },
  {
    id: "3.8",
    type: "requirement",
    position: { x: 1150, y: 0 },
    data: { label: "Req 3.8", level: 3 },
  },
  // Level 4
  {
    id: "4.1",
    type: "requirement",
    position: { x: 50, y: 0 },
    data: { label: "Req 4.1", level: 4 },
  },
  {
    id: "4.2",
    type: "requirement",
    position: { x: 150, y: 0 },
    data: { label: "Req 4.2", level: 4 },
  },
  {
    id: "4.3",
    type: "requirement",
    position: { x: 250, y: 0 },
    data: { label: "Req 4.3", level: 4 },
  },
  {
    id: "4.4",
    type: "requirement",
    position: { x: 350, y: 0 },
    data: { label: "Req 4.4", level: 4 },
  },
  {
    id: "4.5",
    type: "requirement",
    position: { x: 450, y: 0 },
    data: { label: "Req 4.5", level: 4 },
  },
  {
    id: "4.6",
    type: "requirement",
    position: { x: 550, y: 0 },
    data: { label: "Req 4.6", level: 4 },
  },
  {
    id: "4.7",
    type: "requirement",
    position: { x: 650, y: 0 },
    data: { label: "Req 4.7", level: 4 },
  },
  {
    id: "4.8",
    type: "requirement",
    position: { x: 750, y: 0 },
    data: { label: "Req 4.8", level: 4 },
  },
  {
    id: "4.9",
    type: "requirement",
    position: { x: 850, y: 0 },
    data: { label: "Req 4.9", level: 4 },
  },
  {
    id: "4.10",
    type: "requirement",
    position: { x: 950, y: 0 },
    data: { label: "Req 4.10", level: 4 },
  },
  {
    id: "4.11",
    type: "requirement",
    position: { x: 1050, y: 0 },
    data: { label: "Req 4.11", level: 4 },
  },
  {
    id: "4.12",
    type: "requirement",
    position: { x: 1150, y: 0 },
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
  const [nodes, setNodes] = useNodesState(initialNodes);
  // Restrict node movement vertically within its level band, and center nodes on mount
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds) as NodeT[];
        // Only update the node(s) that are being dragged/moved
        return updated.map((node) => {
          // Find if this node is being dragged (has a 'position' change in changes)
          const change = changes.find(
            (c) => c.type === "position" && c.id === node.id
          );
          if (!change) return node; // Not being moved, skip

          const level = (node.data as DataT).level;
          const band = LEVEL_BANDS[level];
          if (!band) return { ...node, type: node.type || "requirement" };

          const nodeHeight = 60;
          const minY = band.top + 10;
          const maxY = band.bottom - nodeHeight;
          const y = node.position.y;

          // Clamp only if out of bounds
          if (y < minY || y > maxY) {
            return {
              ...node,
              type: node.type || "requirement",
              position: {
                ...node.position,
                y: Math.max(minY, Math.min(y, maxY)),
              },
            };
          }
          return node;
        });
      });
    },
    [setNodes]
  );

  // Center nodes vertically in their level on mount and when window resizes
  React.useEffect(() => {
    const bands = getLevelBands();
    setNodes((nds) =>
      nds.map((node) => {
        const band = bands[node.data.level];
        if (!band) return { ...node, type: node.type || "requirement" };
        return {
          ...node,
          type: node.type || "requirement",
          position: {
            ...node.position,
            y: band.center - 30, // 30 = half node height
          },
        };
      })
    );
    // Update LEVEL_BANDS reference
    LEVEL_BANDS = bands;
  }, [setNodes]);

  // Reset nodes to initial positions and recenter in bands
  const handleReset = useCallback(() => {
    const bands = getLevelBands();
    setNodes(
      initialNodes.map((node) => {
        const band = bands[node.data.level];
        if (!band) return { ...node, type: node.type || "requirement" };
        return {
          ...node,
          type: node.type || "requirement",
          position: {
            ...node.position,
            y: band.center - 30,
          },
        };
      })
    );
    LEVEL_BANDS = bands;
  }, [setNodes]);
  const [edges, , onEdgesChange] = useEdgesState(
    initialEdges.map((edge) => ({
      ...edge,
      sourceHandle: null,
      targetHandle: null,
    }))
  );
  const [selectedNode, setSelectedNode] = useState<NodeT | undefined>();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Memoize nodeTypes to avoid React Flow warning
  const nodeTypes = useMemo(
    () => ({
      requirement: (props: { data: DataT }) => (
        <RequirementNode {...props} theme={theme} />
      ),
    }),
    [theme]
  );

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
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
      >
        {/* Level bands overlay that pans/zooms with the graph */}
        <LevelBandsOverlay theme={theme} />
        <Background
          color={theme === "dark" ? "#22223b" : "#ccc"}
          variant={BackgroundVariant.Dots}
        />
        <Controls>
          <ControlButton onClick={handleReset} title="Reset view">
            ⟳
          </ControlButton>
          <ControlButton
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </ControlButton>
        </Controls>
        <MiniMap
          nodeColor={(n) => {
            const level = n.data.level as Level;
            return nodeColorMap[theme][level].minimap || "#888";
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
            {[1, 2, 3, 4].map((levelNum) => {
              const level = levelNum as Level;
              return (
                <div
                  className={`flex items-center mb-1${
                    level === 4 ? " mb-0" : ""
                  }`}
                  key={level}
                >
                  <div
                    className={`w-3 h-3 mr-2 ${nodeColorMap[theme][level].legend}`}
                  ></div>
                  <span>
                    {level === 1 && "Level 1 (System)"}
                    {level === 2 && "Level 2 (Sub-system)"}
                    {level === 3 && "Level 3 (Component)"}
                    {level === 4 && "Level 4 (Implementation)"}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
