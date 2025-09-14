
import React from 'react';
import type { WorkflowData, WorkflowNode, WorkflowEdge, NodeType } from '../types';

// Helper to wrap text inside SVG text elements
const TextWrapper: React.FC<{ label: string; width: number; }> = ({ label, width }) => {
    const words = label.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + " " + word;
        // This is a rough estimation, not a perfect measurement.
        // A more accurate solution would use getComputedTextLength, but that's more complex.
        if (testLine.length > width / 7) { // Heuristic: avg char width is ~7px
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    const lineHeight = 16;
    const totalHeight = lines.length * lineHeight;
    const startY = -totalHeight / 2 + lineHeight / 2;

    return (
        <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-medium fill-current"
            style={{ pointerEvents: 'none' }}
        >
            {lines.map((line, index) => (
                <tspan key={index} x="0" y={startY + index * lineHeight}>
                    {line}
                </tspan>
            ))}
        </text>
    );
};


const Node: React.FC<{ node: WorkflowNode }> = ({ node }) => {
    const { x, y, width, height, type, label } = node;

    const shapeClasses: Record<NodeType, string> = {
        start: 'fill-green-100 stroke-green-500 text-green-800',
        end: 'fill-red-100 stroke-red-500 text-red-800',
        process: 'fill-blue-100 stroke-blue-500 text-blue-800',
        decision: 'fill-yellow-100 stroke-yellow-500 text-yellow-800',
    };

    const commonProps = {
        strokeWidth: 2,
        className: `${shapeClasses[type]} transition-all duration-300`
    };

    const renderShape = () => {
        switch (type) {
            case 'start':
            case 'end':
                return <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={height/2} {...commonProps} />;
            case 'process':
                return <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={8} {...commonProps} />;
            case 'decision':
                const path = `M 0 ${-height / 2} L ${width / 2} 0 L 0 ${height / 2} L ${-width / 2} 0 Z`;
                return <path d={path} {...commonProps} />;
        }
    };

    return (
        <g transform={`translate(${x}, ${y})`}>
            {renderShape()}
            <TextWrapper label={label} width={width - 20} />
        </g>
    );
};

const Edge: React.FC<{ edge: WorkflowEdge; nodes: WorkflowNode[] }> = ({ edge, nodes }) => {
    const sourceNode = nodes.find(n => n.id === edge.sourceId);
    const targetNode = nodes.find(n => n.id === edge.targetId);

    if (!sourceNode || !targetNode) return null;

    // Simple line for now. A more complex solution would find intersection points on node shapes.
    const sx = sourceNode.x;
    const sy = sourceNode.y;
    const tx = targetNode.x;
    const ty = targetNode.y;
    
    // Calculate mid-point for the label
    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;


    return (
        <g>
            <path
                d={`M${sx},${sy} L${tx},${ty}`}
                stroke="rgb(107 114 128)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
            {edge.label && (
                <text x={midX} y={midY - 8} textAnchor="middle" className="text-xs font-semibold fill-gray-700 bg-white" >
                    {edge.label}
                </text>
            )}
        </g>
    );
};

const WorkflowChart: React.FC<{ data: WorkflowData }> = ({ data }) => {
    const { nodes, edges, width, height } = data;

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <marker
                    id="arrowhead"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(107 114 128)" />
                </marker>
            </defs>
            <g>
                {edges.map(edge => (
                    <Edge key={edge.id} edge={edge} nodes={nodes} />
                ))}
            </g>
            <g>
                {nodes.map(node => (
                    <Node key={node.id} node={node} />
                ))}
            </g>
        </svg>
    );
};

export default WorkflowChart;
