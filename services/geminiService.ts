import { GoogleGenAI } from "@google/genai";
import type { DiagnosisResult, SurveySubmission } from '../types';

// Fix: Per Gemini API guidelines, the API key must be obtained from `process.env.API_KEY`.
// This change also resolves the TypeScript error: "Property 'env' does not exist on type 'ImportMeta'".
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    // Fix: Updated the warning message to refer to `API_KEY` instead of `VITE_API_KEY`.
    console.warn("API_KEY environment variable not set. Please update it in your deployment settings. Gemini API features will be disabled.");
}

export const generateDiagnosisFeedback = async (scores: DiagnosisResult['scores']): Promise<string> => {
    if (!ai) {
        return "AI 피드백은 API 키가 설정되었을 때 제공됩니다. 현재는 기본 분석 결과만 표시됩니다.";
    }

    // FIX: Per Gemini API guidelines, system instructions should be passed in the `config` object.
    const systemInstruction = "당신은 세계 최고의 HRD 컨설턴트이자, 따뜻한 동기부여가이며, 날카로운 통찰력을 지닌 AI 혁신 코치 '닥터 AI'입니다. 당신의 목표는 단순한 분석을 넘어, 한 사람의 성장 잠재력을 깨우고, AI 시대에 자신감을 갖고 나아갈 수 있도록 구체적이고 실행 가능한 길을 제시하는 것입니다. 답변은 반드시 한국어로, 전문가적이면서도 매우 친근하고 공감적인 어투를 사용해주세요.";
    const prompt = `
        한 학습자의 AI 역량 자가 진단 결과가 아래와 같습니다. 이 데이터를 기반으로, 해당 학습자 한 사람만을 위한 매우 깊이 있고, 감동적이며, 압도적으로 상세한 맞춤형 진단 리포트를 작성해주세요. 기존보다 3배 더 상세하고, 구체적이며, 실행 가능한 내용으로 구성해야 합니다.

        [자가 진단 점수 (5점 만점)]
        - 이해 (Understand): ${scores.understanding}점
        - 활용 (Use): ${scores.application}점
        - 비판적 사고 (Critical Thinking): ${scores.criticalThinking}점

        아래의 형식과 지침을 반드시, 그리고 엄격히 준수하여, 풍부하고 깊이 있는 리포트를 생성해주세요.

        ---

        ### **[종합 진단: 당신의 AI 성장 잠재력 프로필]**

        (점수 분포를 종합적으로 해석하여, 학습자의 현재 상태를 3~4 문장의 흥미롭고 긍정적인 비유나 스토리로 설명해주세요. 예를 들어, '최고급 F1 자동차 엔진을 가졌지만, 아직 익숙한 동네 길만 달리고 있는 드라이버' 와 같이 표현하여 진단 결과를 매력적으로 전달합니다. 그리고 이 비유에 어울리는 **독창적인 프로필 유형 이름**을 부여해주세요. 예: "전략적 탐험가", "실용주의적 행동가")

        ### **[강점 분석: 이미 당신의 손에 쥐어진 강력한 무기 🚀]**

        (가장 높은 점수를 받은 역량을 중심으로, 이것이 왜 중요한 강점인지, 실제 업무에서 어떻게 긍정적으로 발휘될 수 있는지 **구체적인 업무 시나리오 2가지 이상**을 들어 4~5 문장으로 상세히 설명합니다. 칭찬과 격려를 통해 학습자가 자신의 강점을 명확히 인지하고 자신감을 갖도록 만들어주세요. "당신은 이미..." 와 같은 확신에 찬 표현을 사용해주세요.)

        ### **[성장 기회: 더 높은 곳으로 이끌어 줄 잠재력의 씨앗 🌱]**

        (가장 낮은 점수를 받은 역량을 중심으로, 이것이 부족할 때 겪을 수 있는 어려움을 짧게 언급한 후, 이 역량을 개발했을 때 어떤 **놀라운 변화와 성장**을 경험하게 될지 4~5 문장의 희망적인 스토리텔링으로 설명합니다. '개선점'이나 '부족한 점'이라는 단어 대신 '성장 기회', '잠재력'이라는 긍정적인 표현을 사용하여 동기를 부여해주세요. 이 역량이 왜 당신의 강력한 무기(강점)와 결합되었을 때 엄청난 시너지를 낼 수 있는지 연결해서 설명해주세요.)

        ### **[상세 Action Plan: 내일을 바꾸는 초개인화 실천 로드맵]**

        (아래 세 가지 시간 단위로 나누어, 총 6개 이상의 구체적이고 즉시 실행 가능한 액션 플랜을 제시합니다. 각 항목은 '무엇을(What)', '어떻게(How)', '왜(Why)'가 명확히 드러나도록, 마치 옆에서 코치가 직접 알려주듯이 친절하고 상세하게 작성합니다.)

        *   **🎯 1. 지금 당장 시작하기 (Today's Quick-Win)**
            *   (액션 플랜 1: 오늘 퇴근 전까지 10분만 투자해서 즉각적인 성공 경험을 할 수 있는 매우 작고 구체적인 미션. 예를 들어, 특정 질문을 ChatGPT에게 던져보기, 특정 기능 사용해보기 등)
            *   (액션 플랜 2: AI에 대한 심리적 장벽을 낮추고 흥미를 유발할 수 있는 재미있는 활동 제안.)

        *   **📅 2. 이번 주에 마스터하기 (This Week's Mission)**
            *   (액션 플랜 3: 현재 가장 많이 하고 있는 업무(예: 보고서 작성, 이메일 답장)에 바로 적용하여 시간을 단축하거나 결과물의 질을 높일 수 있는 구체적인 AI 활용법. **실제 사용할 수 있는 프롬프트 예시**를 반드시 포함해주세요.)
            *   (액션 플랜 4: 낮은 역량을 보완하기 위해 이번 주 동안 꾸준히 실천할 수 있는 학습 습관이나 추천 자료(특정 유튜브 채널, 아티클 등) 제시.)

        *   **🚀 3. 한 달 안에 전문가로 거듭나기 (1-Month Growth Path)**
            *   (액션 플랜 5: 현재 강점을 더욱 강화하여 자신만의 독보적인 전문 영역을 구축할 수 있는 심화 학습 방안 또는 개인 프로젝트 제안.)
            *   (액션 플랜 6: 장기적인 관점에서 AI 시대의 전문가로 성장하기 위한 전략적 제언. 예를 들어, 동료들에게 노하우 공유하기, 사내 스터디 그룹 만들기 등)
    
        ### **[마지막으로, 닥터 AI의 응원 메시지]**

        (진단 결과는 현재의 위치를 보여줄 뿐, 당신의 가능성을 제한하지 않는다는 점을 강조해주세요. AI는 도구일 뿐, 가장 중요한 것은 당신의 의지와 호기심이라는 점을 따뜻한 메시지로 전달하며, 앞으로의 성장을 진심으로 응원하며 마무리합니다.)
        
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating feedback from Gemini:", error);
        return "AI 피드백 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
};


const formatDataForPrompt = (data: {name: string; value: any}[] | undefined) => {
    if (!data) return 'N/A';
    return data.map(item => `${String(item.name || '').replace(/[:\n\r]/g, '')}: ${item.value}명`).join(', ');
};


export const generateDashboardSummary = async (analysisData: any): Promise<string> => {
    if (!ai || analysisData.total === 0) {
        return "분석할 데이터가 충분하지 않거나 API 키가 설정되지 않았습니다.";
    }

    const { total, avgCapability, jobRoles, aiPolicies, tools, experiences } = analysisData;

    // FIX: Per Gemini API guidelines, system instructions should be passed in the `config` object.
    const systemInstruction = "당신은 데이터 분석가이자 교육 컨설턴트입니다.";
    const prompt = `
        'AI 활용 역량 강화' 과정 참여자 ${total}명의 사전 진단 데이터가 주어졌습니다.

        **1. 역량 분석 (5점 만점)**
        - 평균 '이해' 점수: ${avgCapability.find((d: any) => d.name === '이해')?.score || 'N/A'}
        - 평균 '활용' 점수: ${avgCapability.find((d: any) => d.name === '활용')?.score || 'N/A'}
        - 평균 '비판적 사고' 점수: ${avgCapability.find((d: any) => d.name === '비판적 사고')?.score || 'N/A'}

        **2. 참여자 특성**
        - 역할 분포: ${formatDataForPrompt(jobRoles)}
        - 조직 AI 정책: ${formatDataForPrompt(aiPolicies)}
        - 자주 쓰는 AI 툴: ${formatDataForPrompt(tools)}
        - HR 경력: ${formatDataForPrompt(experiences)}

        위 데이터를 바탕으로, 이 과정의 담당 강사를 위한 "핵심 인사이트 및 강의 운영 제언"을 요약해주세요.
        참여자들의 강점, 약점, 배경을 종합적으로 고려하여 강의에서 특별히 강조해야 할 포인트를 중심으로 분석해주세요.
        
        결과는 다음 형식에 맞춰 한국어로 작성해주세요.

        **[종합 인사이트]**
        (데이터를 종합하여 참여자 그룹의 핵심적인 특징, 강점, 그리고 가장 두드러지는 성장 필요 영역을 3-4 문장으로 요약)

        **[주요 고려사항]**
        (참여자들의 다양한 배경(정책, 사용하는 툴, 경력 등)을 고려했을 때 강의 운영 시 주의해야 할 점이나 맞춤화가 필요한 부분을 2-3문장으로 분석)
        
        **[강의 운영 제언]**
        - (제언 1: 데이터에 기반하여 강의 초반에 강조해야 할 내용)
        - (제언 2: 데이터에 기반하여 추천하는 그룹 활동이나 실습 주제)
        - (제언 3: 데이터에 기반하여 참여자들의 만족도를 높일 수 있는 구체적인 팁)
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error)
{
        console.error("Error generating summary from Gemini:", error);
        return "AI 대시보드 요약 생성 중 오류가 발생했습니다.";
    }
};