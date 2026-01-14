
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeVintageStyle = async (prompt: string, imageData?: string): Promise<AnalysisResult> => {
  // Create instance right before use to ensure process.env.API_KEY is available and valid
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the head curator for RAWLINE, an industrial vintage archive. 
    Your tone is ultra-minimalist, technical, and analytical. 
    You identify artifacts based on their architectural silhouette, hardware quality, and industrial provenance.
    Avoid marketing fluff. Provide only technical observations and archival grade.
    Format your response strictly as JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      era: { type: Type.STRING, description: "Historical period (e.g., '1998 Archive Series')" },
      styleNotes: { type: Type.STRING, description: "Technical analysis of construction and morphological features." },
      reworkSuggestion: { type: Type.STRING, description: "Technical directive for modern archival adaptation." },
      rawlineScore: { type: Type.NUMBER, description: "Archival suitability score (0-100)." }
    },
    required: ["era", "styleNotes", "reworkSuggestion", "rawlineScore"]
  };

  const contents: any[] = [{ text: prompt }];
  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData.split(',')[1] || imageData
      }
    });
  }

  try {
    const result = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
};
