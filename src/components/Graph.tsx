import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Node from "./Node";
import Link from "./Link";
import HistoryNode from "./HistoryNode";

const Graph: React.FC<GraphProps> = ({ objects }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [historyNodes, setHistoryNodes] = useState<ObjectData[]>([]);
  const [historyLinks, setHistoryLinks] = useState<LinkData[]>([]);
  const [simulationNodes, setSimulationNodes] = useState<ObjectData[]>(
    objects.map((obj) => ({
      ...obj,
      x: Math.random() * 800,
      y: Math.random() * 600,
    }))
  );

  useEffect(() => {
    const newLinks: LinkData[] = [];
    objects.forEach((obj) => {
      obj.links.forEach((linkId) => {
        newLinks.push({ source: obj.id, target: linkId });
      });
    });
    setLinks(newLinks);
  }, [objects]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const g = svg.append("g");

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => (d as ObjectData).id)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.on("tick", () => {
      d3.selectAll<SVGCircleElement, ObjectData>(".node")
        .attr("cx", (d) => d?.x || 0)
        .attr("cy", (d) => d?.y || 0);
      d3.selectAll<SVGLineElement, LinkData>(".link")
        .attr("x1", (d) => (d?.source as ObjectData)?.x || 0)
        .attr("y1", (d) => (d?.source as ObjectData)?.y || 0)
        .attr("x2", (d) => (d?.target as ObjectData)?.x || 0)
        .attr("y2", (d) => (d?.target as ObjectData)?.y || 0);
      d3.selectAll<SVGTextElement, ObjectData>(".label")
        .attr("x", (d) => (d?.x || 0) + 12)
        .attr("y", (d) => (d?.y || 0) + 5);
      d3.selectAll<SVGCircleElement, ObjectData>(".history-node")
        .attr("cx", (d) => d?.x || 0)
        .attr("cy", (d) => d?.y || 0);
      d3.selectAll<SVGLineElement, LinkData>(".history-link")
        .attr("x1", (d) => (d?.source as ObjectData)?.x || 0)
        .attr("y1", (d) => (d?.source as ObjectData)?.y || 0)
        .attr("x2", (d) => (d?.target as ObjectData)?.x || 0)
        .attr("y2", (d) => (d?.target as ObjectData)?.y || 0);
    });

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    d3.selectAll<SVGCircleElement, ObjectData>(".node").call(
      d3
        .drag<SVGCircleElement, ObjectData>()
        .on("start", dragstarted(simulation))
        .on("drag", dragged)
        .on("end", dragended(simulation))
    );

    d3.selectAll<SVGCircleElement, ObjectData>(".history-node").call(
      d3
        .drag<SVGCircleElement, ObjectData>()
        .on("start", dragstarted(simulation))
        .on("drag", dragged)
        .on("end", dragended(simulation))
    );

    function dragstarted(simulation: d3.Simulation<ObjectData, undefined>) {
      return (
        event: d3.D3DragEvent<SVGCircleElement, ObjectData, ObjectData>,
        d: ObjectData | null
      ) => {
        if (!d) return;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      };
    }

    function dragged(
      event: d3.D3DragEvent<SVGCircleElement, ObjectData, ObjectData>,
      d: ObjectData | null
    ) {
      if (!d) return;
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(simulation: d3.Simulation<ObjectData, undefined>) {
      return (
        event: d3.D3DragEvent<SVGCircleElement, ObjectData, ObjectData>,
        d: ObjectData | null
      ) => {
        if (!d) return;
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      };
    }

    d3.selectAll<SVGCircleElement, ObjectData>(".node").on(
      "click",
      (event: MouseEvent, d: ObjectData) => {
        if (event.ctrlKey) {
          setHistoryNodes([]);
          setHistoryLinks([]);
          const newHistoryNodes: ObjectData[] = [];
          const newHistoryLinks: LinkData[] = [];
          d.history.forEach((version, index) => {
            const historyNode: ObjectData = {
              id: `${d.id}-history-${index}`,
              name: version,
              x: d.x! + index * 20,
              y: d.y! + 50,
            };
            newHistoryNodes.push(historyNode);
            if (index > 0) {
              newHistoryLinks.push({
                source: `${d.id}-history-${index}`,
                target: `${d.id}-history-${index - 1}`,
              });
            } else {
              newHistoryLinks.push({
                source: `${d.id}-history-0`,
                target: d.id,
              });
            }
          });
          setHistoryNodes(newHistoryNodes);
          setHistoryLinks(newHistoryLinks);
          setSimulationNodes([...objects, ...newHistoryNodes]);
        } else {
          const linkedNodes = objects.filter(
            (obj) =>
              (d && d.links.includes(obj.id)) ||
              (d && obj.links.includes(d.id)) ||
              (d && obj.id === d.id)
          );
          d3.selectAll<SVGCircleElement, ObjectData>(".node").attr(
            "fill",
            (nodeData) =>
              linkedNodes.includes(nodeData) ? "green" : "steelblue"
          );
          d3.selectAll<SVGLineElement, LinkData>(".link").attr(
            "stroke",
            (linkData) =>
              linkedNodes.includes(linkData.source) &&
              linkedNodes.includes(linkData.target)
                ? "green"
                : "#999"
          );
          setHistoryNodes([]);
          setHistoryLinks([]);
          setSimulationNodes(
            objects.map((obj) => ({
              ...obj,
              x: Math.random() * 800,
              y: Math.random() * 600,
            }))
          );
        }
      }
    );
  }, [objects, links, simulationNodes]);

  return (
    <svg ref={svgRef}>
      {links.map((link, index) => (
        <Link
          key={`${(link.source as ObjectData)?.id || `source-${index}`}-${
            (link.target as ObjectData)?.id || `target-${index}`
          }`}
          link={link}
        />
      ))}
      {objects.map((node) => (
        <Node key={node.id} node={node} />
      ))}
      {historyNodes.map((historyNode) => (
        <HistoryNode key={historyNode.id} node={historyNode} />
      ))}
      {historyLinks.map((link, index) => (
        <Link
          key={`${
            (link.source as ObjectData)?.id || `history-source-${index}`
          }-${(link.target as ObjectData)?.id || `history-target-${index}`}`}
          link={link}
          isHistory={true}
        />
      ))}
    </svg>
  );
};

export default Graph;
