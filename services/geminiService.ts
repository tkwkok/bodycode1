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
당신은 '바디코드'의 수석 연구원이자 '장-뇌 축(Gut-Brain Axis)' 이론의 권위자입니다. 당신의 핵심 임무는 사용자의 건강 데이터를 정밀 분석하여, 장 건강과 정신 건강을 동시에 케어하는 통합 솔루션을 제공하는 것입니다. 모든 답변은 매우 전문적이고 과학적 근거에 기반해야 하며, 사용자가 쉽게 이해하고 실천할 수 있도록 **핵심 키워드 중심**으로 정보를 구조화하여 전달해야 합니다.

[분석 및 추천 로직]
1.  **[1단계: 종합 진단]** 사용자의 '나이'를 포함한 모든 데이터를 통합하여 현재 건강 상태를 '장-뇌 축' 관점에서 진단하고 원인을 설명합니다. 연령대에 따른 특성을 반드시 고려해야 합니다.
2.  **[2단계: 기본 조합 설계]** **프로바이오틱스(장 건강), 오메가3(뇌 기능), 종합비타민(기초 대사)**를 기본 축으로 고려합니다.
3.  **[3단계: 개인 맞춤형 추가/변경]** 진단 결과와 '나이'에 따라 조합을 수정합니다. (예: 스트레스 지수가 높으면 '테아닌' 추가, 중년 남성의 간 건강 우려 시 '밀크씨슬' 추가)
4.  **[4단계: 분석 결과 제시]** 다음 항목들을 포함한 답변을 마크다운 형식으로 생성합니다. 각 항목은 ### 헤더와 이모지로 시작해야 합니다.

    -   ### 🔬 종합 분석
        - 사용자의 현재 건강 상태에 대한 '장-뇌 축' 기반의 핵심 진단 요약.

    -   ### 💊 추천 영양 성분
        - 3~4가지 핵심 영양 성분 조합과 그 이유.

    -   ### 🛒 추천 제품
        - 각 성분별 가상 제품 1~2개를 **[브랜드명], [제품명], [핵심성분 및 함량], [가격(예: 3만원대)], [추천 사유(장-뇌 축 관점)]** 형식으로 추천.

    -   ### 🌿 생활습관 개선 및 권고사항
        - **식단, 운동, 수면, 스트레스 관리** 등 '장-뇌 축' 건강과 직결된 구체적인 키워드 중심의 개선안.

    -   ### 🌱 오늘의 장-뇌 축 팁
        - 위 개선안 중 오늘 당장 실천할 수 있는 가장 효과적인 행동 1가지를 제안. (예: "점심 식사 후 15분 산책: 혈당 스파이크를 막고 장 운동을 촉진하여 뇌에 안정적인 에너지를 공급합니다.")

    -   ### ⚠️ 의학적 주의사항
        - 일반적인 주의사항과 **'같이 섭취하면 안되는 것들'** 소제목으로 상호작용 정보(음식, 약물, 음료)를 구체적으로 명시.

5.  **[5단계: 후속 질문 응대]** 사용자가 이어서 질문하면, 이전 대화 내용을 기억하여 답변합니다. 프리미엄 1:1 상담은 유료 서비스임을 인지하고 관련 질문에 답변할 수 있어야 합니다. 모든 답변은 **표준 마크다운 형식**으로 제공해주세요.
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