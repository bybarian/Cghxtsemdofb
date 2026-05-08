import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features might not work.");
      // We don't throw heroically here to avoid crashing the whole app, 
      // but the actual call will fail later.
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
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
      model: "gemini-3-flash-preview", // Using recommended model for text tasks
      contents: prompt,
    });
    
    return response.text || "無法提取建議內容。";
  } catch (error: any) {
    console.error("AI generation error:", error);
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key")) {
      return "API Key 無效或未設定，請聯繫管理員。";
    }
    return "系統目前無法產出 AI 建議，請先依據評分結果進行手動回饋。";
  }
}

export async function analyzeMilestoneTranscript(transcript: string, criteria: any[]) {
  const prompt = `
    請依據以下引導師的回饋教學逐字稿，執行以下任務：
    1. 評估其在四個 Milestone 範疇的等級（Level 1-5）。
    2. 針對每個範疇提供具體的改進建議（如何達到更高一級的表現）。
    
    Milestone 範疇與基準：
    ${criteria.map((c, i) => `${i+1}. ${c.category}:
    ${c.levels.map((l: any, li: number) => `   Level ${li+1}: ${l}`).join('\n')}`).join('\n')}

    逐字稿內容：
    ${transcript}

    請輸出 JSON 格式的結果，格式必須如下：
    {
      "levels": {
        "0": 1-5,
        "1": 1-5,
        "2": 1-5,
        "3": 1-5
      },
      "suggestions": "【關鍵觀察】: ... \\n\\n【晉級指引】: ...",
      "reasoning": "評估理由說明"
    }
  `;

  try {
    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    const text = result.text || '';
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || '{}';
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Milestone AI Error:", err);
    throw err;
  }
}

export async function analyzeFeedbackTranscript(transcript: string, evalData: any[]) {
  const prompt = `
    請根據以下臨床引導師的回饋教學逐字稿，執行以下兩項任務：
    1. 針對回饋評核表的項目進行評分 (0-2分)。
    2. 針對整體回饋表現提供具體的改良建議。
    
    評分標準：
    2 分：完全達成 (Excellent)
    1 分：部分達成 (Satisfactory)
    0 分：未達成 (Needs Improvement)

    評核項目清單：
    ${evalData.flatMap(cat => cat.items.map((item: any) => `- ${item.id}: ${item.label} (${item.behavior})`)).join('\n')}

    逐字稿內容：
    ${transcript}

    請僅輸出 JSON 格式的結果：
    {
      "scores": {
        "pre1": 0-2,
        ... 其他項目
      },
      "suggestions": "具體改良建議",
      "reasoning": "理由"
    }
  `;

  try {
    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    const text = result.text || '';
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || '{}';
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Feedback AI Error:", err);
    throw err;
  }
}
