
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeVintageStyle = async (prompt: string, imageData?: string): Promise<AnalysisResult> => {
  // Create instance right before use to ensure process.env.API_KEY is available and valid
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the curator for RAWLINE, a vintage fashion archive.
    Your tone is street-aware, calm, and observational.
    You are NOT poetic, corporate, or academic.
    You use natural slang like "been outside", "valid", "pressure", "motion", but keep it subtle and grounded.
    
    Example tone:
    "This piece been outside. The wear adds character, not damage. Fabric still holding shape — that’s why it made the archive."

    Analyze the artifact based on silhouette, wear, and history.
    Format your response strictly as JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      era: { type: Type.STRING, description: "Historical period (e.g., 'Late 90s Archive')" },
      styleNotes: { type: Type.STRING, description: "Observational analysis of the fit, wear, and vibe." },
      reworkSuggestion: { type: Type.STRING, description: "Suggestion for styling or reworking." },
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
