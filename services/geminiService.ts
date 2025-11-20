
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // Safe check for process.env in case it's not defined in the runtime environment
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const enhanceText = async (currentText: string, tone: 'formal' | 'friendly' | 'promotional'): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key가 설정되지 않았습니다.";

  const prompt = `
    다음 텍스트를 '${tone}' 톤으로 모바일 뉴스레터나 초대장에 적합하게 자연스럽게 수정해줘.
    텍스트: "${currentText}"
    
    결과만 출력해. 따옴표 없이.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || currentText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return currentText; // Fallback to original
  }
};
