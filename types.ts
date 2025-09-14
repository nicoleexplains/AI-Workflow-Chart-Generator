
export type NodeType = 'start' | 'end' | 'process' | 'decision';

export interface WorkflowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: NodeType;
  width: number;
  height: number;
}

export interface WorkflowEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  width: number;
  height: number;
}
