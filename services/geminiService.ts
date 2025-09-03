

import { GoogleGenAI } from "@google/genai";
import type { Phase, DbStep } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function formatRoadmapForPrompt(roadmapData: Phase[]): string {
  return roadmapData.map(phase => {
    const tasks = phase.tasks.map(task => `  - [${task.completed ? 'x' : ' '}] ${task.isSubtask ? '  ' : ''}${task.name}`).join('\n');
    return `### Phase ${phase.id}: ${phase.title} (Status: ${phase.status})\n${tasks}`;
  }).join('\n\n');
}

function formatDbPlanForPrompt(dbPlanData: DbStep[]): string {
    return dbPlanData.map(step => {
        const tasks = step.tasks.map(task => `  - ${task}`).join('\n');
        return `### Step ${step.id}: ${step.title}\n${tasks}`;
    }).join('\n\n');
}

export const analyzeProjectData = async (roadmapData: Phase[], dbPlanData: DbStep[]): Promise<string> => {
  // Fix: Updated model name to a recommended, non-preview model.
  const model = "gemini-2.5-flash";
  
  const formattedRoadmap = formatRoadmapForPrompt(roadmapData);
  const formattedDbPlan = formatDbPlanForPrompt(dbPlanData);

  const prompt = `
    You are an expert senior project manager and system architect. Your role is to analyze the following project data and provide a concise, insightful executive summary.

    **Project Roadmap:**
    ---
    ${formattedRoadmap}
    ---

    **Database Implementation Plan:**
    ---
    ${formattedDbPlan}
    ---

    Based on the provided data, please provide the following:
    1.  **Executive Summary:** A brief overview of the project's current status, what's completed, and what the immediate focus is.
    2.  **Potential Risks & Bottlenecks:** Identify 2-3 potential risks based on the upcoming work. For example, dependencies between tasks, complexity of AI integration, or security implementation challenges.
    3.  **Strategic Recommendations:** Suggest one or two strategic actions to ensure smooth progress into the next phases.

    Keep your analysis professional, concise, and actionable. Format your response using markdown with headings for each section (e.g., "## Executive Summary"). Do not use single # for headings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate analysis from AI. See console for details.");
  }
};
