// Graph.tsx
import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";

const Graph: React.FC<GraphProps> = ({ objects }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = new DataSet(
      objects.map((o) => ({ id: o.id, label: o.name }))
    );

    const edges = new DataSet(
      objects
        .map((o) =>
          o.links.map((l, index) => ({
            id: `${o.id}-${l}-${index}`, // Unique ID for each edge
            from: o.id,
            to: l,
          }))
        )
        .reduce((arr, i) => [...arr, ...i], [])
    );

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: "dot",
        color: {
          border: "#3498db",
          background: "#ecf0f1",
          highlight: {
            border: "#6eadd7ff",
            background: "#6eadd7ff",
          },
        },
        font: {
          color: "#333", // Dark text for readability
        },
      },
      edges: {
        arrows: "to",
        color: {
          color: "#6eadd7ff",
          highlight: "#6eadd7ff",
        },
        font: {
          color: "#333", // Dark text for readability
        },
      },
      layout: {
        hierarchical: {
          direction: "DU", // Top-down direction
          sortMethod: "directed",
        },
      },
    };

    const network = new Network(containerRef.current, data, options);

    return () => network.destroy();
  }, [objects]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "500px",
        border: "1px solid #ccc",
        backgroundColor: "#f0f8ff",
      }}
    />
  );
};

export default Graph;
