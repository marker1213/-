import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WorldEntity } from '../types';

interface WorldVisualizationProps {
  entities: WorldEntity[];
}

export const WorldVisualization: React.FC<WorldVisualizationProps> = ({ entities }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || entities.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background", "transparent");

    // Mock links based on IDs for visual connectedness
    const links = entities.slice(1).map((e, i) => ({
      source: entities[0].id,
      target: e.id,
      value: 1
    }));

    const nodes = entities.map(e => ({ ...e }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "rgba(139, 92, 246, 0.2)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.resonance / 10)
      .attr("fill", "#000")
      .attr("stroke", (d: any) => d.resonance > 80 ? "#8b5cf6" : "#ffffff")
      .call(drag(simulation) as any);

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("x", 12)
      .attr("y", 3)
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      
      labels
        .attr("x", (d: any) => d.x + 10)
        .attr("y", (d: any) => d.y + 3);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [entities]);

  return (
    <svg ref={svgRef} className="w-full h-full" />
  );
};