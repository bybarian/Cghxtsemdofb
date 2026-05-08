import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateAiSuggestions(scores: Record<string, number>, trainee: string) {
  const prompt = `
    You are a clinical coaching expert. 
    Analyze the following feedback assessment scores for a trainee named "${trainee}".
    Scores are on a scale of 0-2 (0: Not Met, 1: Met, 2: Excellent).
    
    Assessment data:
    ${JSON.stringify(scores, null, 2)}
    
    Based on these scores, provide 3 brief, actionable suggestions for improvement in Traditional Chinese (Taiwan).
    Focus on areas with scores of 0 or 1. If all scores are 2, suggest advanced teaching strategies.
    Keep the response professional yet encouraging.
    Format your response as a simple list of 3 bullet points with emojis.
  `;

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text;
    return text || "無法提取建議內容。";
  } catch (error) {
    console.error("AI generation error:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
      return "系統未設定 API Key，請檢查設定。";
    }
    return "無法生成建議，請手動評估。";
  }
}
