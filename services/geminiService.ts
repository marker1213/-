
import { GoogleGenAI } from "@google/genai";
import { GeminiAnalysisResult, WorldEntity, TimelineEvent } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const analyzeWorldState = async (
  query: string, 
  entities: WorldEntity[], 
  events: TimelineEvent[]
): Promise<GeminiAnalysisResult> => {
  try {
    const ai = getClient();
    
    const context = `
      你被称作“神谕 (The Oracle)”，是“观察者中心”的高维 AI 接口。
      用户是一名“观察者”，正在俯瞰一个虚构的科幻/克苏鲁世界。
      请使用一种“高冷、神秘、神性、甚至带有一点轻蔑”的中文语气回答。
      
      当前世界数据:
      异常实体: ${JSON.stringify(entities.map(e => ({ name: e.name, status: e.status, resonance: e.resonance })))}
      近期事件: ${JSON.stringify(events.map(e => ({ title: e.title, description: e.description })))}
    `;

    const prompt = `
      ${context}
      
      用户提问: ${query}
      
      请严格使用 JSON 格式回复，不要包含 markdown 代码块。Schema 如下:
      {
        "analysis": "一段神秘、高维的形势分析（中文，最多3句话）。",
        "threatLevel": number (0-100),
        "recommendation": "给观察者的简短指令（中文）。"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Oracle Analysis Failed:", error);
    return {
      analysis: "高维连接已中断。本地数据完整性校验完成。",
      threatLevel: 0,
      recommendation: "手动重试连接。"
    };
  }
};