
import { GoogleGenAI, Type } from "@google/genai";
import type { WorkflowData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
    type: Type.OBJECT,
    properties: {
        width: { type: Type.NUMBER, description: "The total width of the canvas, fixed at 1200." },
        height: { type: Type.NUMBER, description: "The total height of the canvas, fixed at 800." },
        nodes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the node." },
                    label: { type: Type.STRING, description: "Text to display in the node. Keep it concise." },
                    x: { type: Type.NUMBER, description: "The x-coordinate of the node's center." },
                    y: { type: Type.NUMBER, description: "The y-coordinate of the node's center." },
                    type: { type: Type.STRING, description: "Type of the node: 'start', 'end', 'process', or 'decision'." },
                    width: { type: Type.NUMBER, description: "Width of the node." },
                    height: { type: Type.NUMBER, description: "Height of the node." },
                },
                required: ["id", "label", "x", "y", "type", "width", "height"],
            },
        },
        edges: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique identifier for the edge."},
                    sourceId: { type: Type.STRING, description: "The id of the source node." },
                    targetId: { type: Type.STRING, description: "The id of the target node." },
                    label: { type: Type.STRING, description: "Optional label for the edge (e.g., 'Yes'/'No' for decisions)." },
                },
                required: ["id", "sourceId", "targetId"],
            },
        },
    },
    required: ["width", "height", "nodes", "edges"],
};


export const generateWorkflow = async (description: string): Promise<WorkflowData> => {
    const prompt = `
    You are an expert at creating workflow chart data for project management. 
    Based on the following description, generate a JSON object representing the workflow.
    The coordinate system is a canvas of 1200x800. Position the nodes for a clear, top-to-bottom or left-to-right flowchart.
    Ensure nodes do not overlap. Provide appropriate widths and heights for each node based on its label length. 
    For 'decision' nodes, make them diamond-shaped by setting width and height to be equal (e.g., width: 150, height: 150).
    For 'start' and 'end' nodes, use a smaller height (e.g., height: 50).
    For 'process' nodes, use a standard height (e.g., height: 70).
    The entire output must be a single valid JSON object that strictly adheres to the provided schema.

    Workflow Description:
    "${description}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            },
        });
        
        const jsonString = response.text;
        const parsedData: WorkflowData = JSON.parse(jsonString);

        // Basic validation
        if (!parsedData.nodes || !parsedData.edges) {
            throw new Error("Invalid data structure received from API.");
        }
        
        return parsedData;

    } catch (error) {
        console.error("Error generating workflow with Gemini:", error);
        throw new Error("Failed to parse workflow data from AI response.");
    }
};
