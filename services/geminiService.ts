import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // 1. Try Vite environment variable (import.meta.env)
  // 2. Fallback to process.env (if defined)
  // 3. Return undefined if neither exists
  let apiKey: string | undefined;

  try {
    // @ts-ignore
    if (import.meta && import.meta.env) {
       // @ts-ignore
       apiKey = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore import.meta errors
  }

  if (!apiKey) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      // Ignore process errors
    }
  }

  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const enhanceText = async (currentText: string, tone: 'formal' | 'friendly' | 'promotional'): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    console.warn("AI 기능 사용 불가: API Key가 설정되지 않았습니다.");
    return currentText;
  }

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