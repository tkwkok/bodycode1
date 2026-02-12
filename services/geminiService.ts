import { GoogleGenAI, Type, Chat } from "@google/genai";

export const createChat = (): Chat | null => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.error("API_KEY environment variable is not set");
    return null;
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const systemInstruction = `
[페르소나 및 지침]
당신은 '바디코드'의 수석 연구원이자 '장-뇌 축(Gut-Brain Axis)' 이론의 권위자, 그리고 임상 약물 상호작용 전문가입니다. 당신의 핵심 임무는 사용자의 모든 건강 데이터를 통합 분석하여, 안전하고 효과적인 개인 맞춤형 건강 솔루션을 제공하는 것입니다. 모든 답변은 매우 전문적이고 과학적 근거에 기반해야 하며, 사용자가 쉽게 이해하고 실천할 수 있도록 **핵심 키워드 중심**으로 정보를 구조화하여 전달해야 합니다.

[분석 및 추천 로직]
1.  **[1단계: 종합 진단]** 사용자의 '나이', '보유 질환', '복용 의약품/영양제' 등 모든 데이터를 통합하여 현재 건강 상태를 '장-뇌 축' 관점에서 진단합니다.
2.  **[2단계: 기본 조합 설계]** **프로바이오틱스, 오메가3, 종합비타민**을 기본 축으로 고려합니다.
3.  **[3단계: 약물 상호작용 및 중복 분석 (DNI & Deprescribing)]**
    -   **드러그 머거 분석:** 사용자가 '복용 중인 의약품'을 분석하여, 해당 약물이 고갈시킬 수 있는 특정 영양소가 있는지 확인합니다. (예: "고혈압약(티아지드계)은 칼륨과 마그네슘을 고갈시킬 수 있으므로, 해당 성분 보충을 권장합니다.")
    -   **질환 고려:** 사용자의 '보유 질환'을 고려하여 추천에서 제외하거나 주의해야 할 성분이 있는지 판단합니다. (예: "신장 질환이 있으므로 고용량 칼슘 및 마그네슘 섭취는 피해야 합니다.")
    -   **중복/과잉 분석:** 추천할 영양 성분과 '복용 중인 다른 영양제'를 비교하여, 성분이 중복되거나 일일 권장 상한량을 초과할 위험이 있는지 분석합니다. (예: "이미 비타민D를 4000IU 섭취 중이시므로, 종합비타민은 비타민D가 제외된 제품을 선택하는 것이 좋습니다.")
4.  **[4단계: 개인 맞춤형 최종 조합]** 1, 2, 3단계 분석 결과를 종합하여 최종 영양 성분 조합을 결정합니다.
5.  **[5단계: 분석 결과 제시]** 다음 항목들을 포함한 답변을 마크다운 형식으로 생성합니다. 각 항목은 ### 헤더와 이모지로 시작해야 합니다.

    -   ### 🔬 종합 분석
    -   ### 💊 추천 영양 성분
    -   ### ⚖️ 성분 조절 및 약물 상호작용 주의사항 
        - 3단계에서 분석한 DNI, 질환 고려, Deprescribing 결과를 바탕으로, "이 성분은 추가하세요", "이 성분은 빼세요", "이 약과는 2시간 간격을 두세요" 와 같은 명확하고 구체적인 가이드를 제공합니다.
    -   ### 🛒 추천 제품
    -   ### 🌿 생활습관 개선 및 권고사항
    -   ### 🌱 오늘의 장-뇌 축 팁
    -   ### ⚠️ 의학적 주의사항

6.  **[6단계: 후속 질문 응대]** 사용자가 이어서 질문하면, 이전 대화 내용을 기억하여 답변합니다. 프리미엄 1:1 상담은 유료 서비스임을 인지하고 관련 질문에 답변할 수 있어야 합니다. 모든 답변은 **표준 마크다운 형식**으로 제공해주세요.
`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
};


export const validateHealthDocument = async (base64Data: string, mimeType: string): Promise<boolean> => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("API_KEY environment variable is not set");
        return false;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const imagePart = { inlineData: { mimeType, data: base64Data } };
    const textPart = { text: `이 이미지가 인바디 결과지, 건강검진 결과표, 또는 유사한 의료 데이터 문서인지 판단해주세요. "YES" 또는 "NO"로만 대답해주세요.` };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [textPart, imagePart] },
        });
        const resultText = response.text?.trim().toUpperCase();
        return resultText === 'YES';
    } catch (error) {
        console.error("Error validating image:", error);
        return false; // Fail safe, assume invalid on error
    }
};

export const checkCompatibility = async (
    newSupplementImage: { data: string; mimeType: string },
    currentSupplements: string
): Promise<{ score: number; explanation: string } | null> => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("API_KEY environment variable is not set");
        return null;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const imagePart = { inlineData: newSupplementImage };
    const textPart = {
        text: `
[분석 요청]
1. 이미지 속 영양제 제품의 핵심 성분 1~3가지를 분석해줘.
2. 현재 복용 중인 영양제 목록은 다음과 같아: "${currentSupplements || '없음'}"
3. 위 두 정보를 바탕으로, 새로 추가할 영양제와의 '성분 궁합 점수'를 0점에서 100점 사이로 매겨줘.
4. 점수에 대한 구체적인 이유를 '궁합 분석'이라는 이름으로 설명해줘. (예: 시너지 효과, 흡수 방해, 성분 중복 등)
5. 반드시 아래의 JSON 형식으로만 답변해줘. 다른 설명은 절대 추가하지 마.

{
  "score": <점수 (숫자)>,
  "explanation": "<궁합 분석 결과 (한글 문자열)>"
}
`,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
            }
        });
        const jsonString = response.text;
        if (jsonString) {
            // Sometimes the model returns the JSON wrapped in ```json ... ```
            const cleanedJsonString = jsonString.replace(/^```json\s*/, '').replace(/```$/, '');
            return JSON.parse(cleanedJsonString);
        }
        return null;
    } catch (error) {
        console.error("Error checking compatibility:", error);
        return null;
    }
};