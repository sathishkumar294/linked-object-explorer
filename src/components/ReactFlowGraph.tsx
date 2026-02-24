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
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  applyNodeChanges,
} from "@xyflow/react";

import React, { SetStateAction, useCallback, useState, useMemo } from "react";
import RequirementDetailsSidebar from "./RequirementDetailsSidebar";
import { useStore } from "@xyflow/react";
import type { DataT, NodeT, ValidationMethod } from "./sidebar/types";

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
          // Extend first and last bands to appear infinite vertically
          const rectTop = level === 1 ? -500000 : top;
          const rectBottom = level === bands.length ? 500000 : bottom;

          return (
            <g key={level}>
              <rect
                x={-500000}
                y={rectTop}
                width={1000000}
                height={Math.max(0, rectBottom - rectTop)}
                fill={bandColor}
                stroke="none"
              />
              {level < bands.length && (
                <line
                  x1={-500000}
                  x2={500000}
                  y1={bottom}
                  y2={bottom}
                  stroke={lineColor}
                  strokeDasharray="8 4"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}
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
      bg: "bg-white border-l-8 border-blue-500 text-blue-800",
      minimap: "#bae6fd",
      legend: "bg-white border border-blue-500",
    },
    2: {
      bg: "bg-white border-l-8 border-green-500 text-green-800",
      minimap: "#7dd3fc",
      legend: "bg-white border border-green-500",
    },
    3: {
      bg: "bg-white border-l-8 border-blue-400 text-blue-800",
      minimap: "#38bdf8",
      legend: "bg-white border border-blue-400",
    },
    4: {
      bg: "bg-white border-l-8 border-orange-500 text-orange-800",
      minimap: "#fdba74",
      legend: "bg-white border border-orange-500",
    },
    handle: "bg-gray-400",
  },
  dark: {
    1: {
      bg: "bg-white border-l-8 border-blue-400 text-blue-900",
      minimap: "#1e40af",
      legend: "bg-white border border-blue-400",
    },
    2: {
      bg: "bg-white border-l-8 border-green-400 text-green-900",
      minimap: "#1e3a8a",
      legend: "bg-white border border-green-400",
    },
    3: {
      bg: "bg-white border-l-8 border-blue-300 text-blue-900",
      minimap: "#1e293b",
      legend: "bg-white border border-blue-300",
    },
    4: {
      bg: "bg-white border-l-8 border-orange-400 text-orange-900",
      minimap: "#7c2d12",
      legend: "bg-white border border-orange-400",
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




function ReactFlowGraphInner() {
  const { setCenter } = useReactFlow();
  const [nodes, setNodes] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [validations, setValidations] = useState<ValidationMethod[]>([]);
  const originalNodesRef = React.useRef<NodeT[]>([]);

  // Fetch requirements and validations from API
  React.useEffect(() => {
    Promise.all([
      fetch('/api/requirements').then(r => r.json()),
      fetch('/api/validations').then(r => r.json())
    ])
      .then(([reqData, valData]) => {
        setValidations(valData);
        const data = reqData;
        const bands = getLevelBands();
        const levelCounts: Record<number, number> = {};

        const mappedNodes: NodeT[] = (data.requirements || []).map((req: any) => {
          const l = req.level || 1;
          const count = levelCounts[l] || 0;
          levelCounts[l] = count + 1;

          return {
            id: req.businessId,
            type: 'requirement',
            position: { x: count * 350 + 150, y: (bands[l] ? bands[l].center : 0) - 30 },
            data: {
              label: req.businessId,
              title: req.title,
              level: l,
              description: req.statement,
              rationale: req.rationale,
              status: req.status,
              priority: req.priority,
              owner: req.owner,
              meansOfValidation: req.meansOfValidation,
            }
          };
        });

        const mappedEdges: Edge[] = (data.edges || []).map((edge: any) => ({
          ...edge,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
          sourceHandle: null,
          targetHandle: null,
        }));

        originalNodesRef.current = mappedNodes;
        setNodes(mappedNodes);
        setEdges(mappedEdges);
      })
      .catch((err) => console.error('Failed to fetch data:', err));
  }, [setNodes, setEdges]);

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
      originalNodesRef.current.map((node) => {
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
  const [selectedNode, setSelectedNode] = useState<NodeT | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      setSidebarOpen(true);
    },
    []
  );

  // Navigate to a node: pan/zoom the canvas and select it in the sidebar
  const handleNavigateToNode = useCallback(
    (nodeId: string) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      // Estimate node dimensions for centering
      const nodeWidth = 180;
      const nodeHeight = 60;
      const x = targetNode.position.x + nodeWidth / 2;
      const y = targetNode.position.y + nodeHeight / 2;

      setCenter(x, y, { zoom: 1.5, duration: 600 });

      // Update sidebar to show the navigated node
      setSelectedNode(targetNode);
      setSidebarOpen(true);
    },
    [nodes, setCenter]
  );

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleInfoSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* Info button fixed top-right */}
      <button
        className="req-info-btn"
        onClick={toggleInfoSidebar}
        title={sidebarOpen ? "Close details" : "Open requirement details"}
        aria-label="Toggle requirement details sidebar"
        style={{
          background: theme === "dark" ? "#27272a" : "#ffffff",
          color: theme === "dark" ? "#a1a1aa" : "#374151",
          border: theme === "dark" ? "1.5px solid #3f3f46" : "1.5px solid #d1d5db",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.8" />
          <rect x="9.1" y="8.5" width="1.8" height="6" rx="0.9" fill="currentColor" />
          <circle cx="10" cy="5.8" r="1.1" fill="currentColor" />
        </svg>
      </button>

      {/* Requirement details sidebar */}
      <RequirementDetailsSidebar
        node={selectedNode}
        open={sidebarOpen}
        onClose={closeSidebar}
        theme={theme}
        edges={edges}
        nodes={nodes}
        validations={validations}
        onNavigateToNode={handleNavigateToNode}
      />

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
                  className={`flex items-center mb-1${level === 4 ? " mb-0" : ""
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

// Wrap with ReactFlowProvider so useReactFlow hook works
export default function ReactFlowGraph() {
  return (
    <ReactFlowProvider>
      <ReactFlowGraphInner />
    </ReactFlowProvider>
  );
}
