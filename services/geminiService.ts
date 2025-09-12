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

    const prompt = `
        당신은 전문 HRD 컨설턴트이자 AI 활용 전문가입니다. 
        한 학습자가 AI 역량에 대해 자가 진단을 실시했으며, 결과는 다음과 같습니다.

        - 이해 (Understand): ${scores.understanding}/5 점
        - 활용 (Use): ${scores.application}/5 점
        - 비판적 사고 (Critical Thinking): ${scores.criticalThinking}/5 점

        이 점수를 바탕으로, 이 학습자에게 맞춤형으로 강점, 개선점, 그리고 구체적인 성장 액션 플랜을 제시해주세요.
        결과는 다음 형식에 맞춰 한국어로 작성해주세요.

        **[강점 분석]**
        (긍정적이고 격려하는 톤으로 현재 강점을 2-3 문장으로 요약)

        **[개선점 및 성장 기회]**
        (성장이 필요한 영역을 부드럽게 지적하고, 이것이 왜 중요한지 2-3 문장으로 설명)

        **[Action Plan 추천]**
        - (액션 플랜 1: 구체적이고 실천 가능한 방안 제시)
        - (액션 플랜 2: 구체적이고 실천 가능한 방안 제시)
        - (액션 플랜 3: 구체적이고 실천 가능한 방안 제시)
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating feedback from Gemini:", error);
        return "AI 피드백 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
};


export const generateDashboardSummary = async (analysisData: any): Promise<string> => {
    if (!ai || analysisData.total === 0) {
        return "분석할 데이터가 충분하지 않거나 API 키가 설정되지 않았습니다.";
    }

    const { total, avgCapability, jobRoles, aiPolicies, tools, experiences } = analysisData;

    const prompt = `
        당신은 데이터 분석가이자 교육 컨설턴트입니다. 
        'AI 활용 역량 강화' 과정 참여자 ${total}명의 사전 진단 데이터가 주어졌습니다.

        **1. 역량 분석 (5점 만점)**
        - 평균 '이해' 점수: ${avgCapability.find((d: any) => d.name === '이해')?.score || 'N/A'}
        - 평균 '활용' 점수: ${avgCapability.find((d: any) => d.name === '활용')?.score || 'N/A'}
        - 평균 '비판적 사고' 점수: ${avgCapability.find((d: any) => d.name === '비판적 사고')?.score || 'N/A'}

        **2. 참여자 특성**
        - 역할 분포: ${jobRoles.map((p: any) => `${p.name}: ${p.value}명`).join(', ')}
        - 조직 AI 정책: ${aiPolicies.map((p: any) => `${p.name}: ${p.value}명`).join(', ')}
        - 자주 쓰는 AI 툴: ${tools.map((t: any) => `${t.name}: ${t.value}명`).join(', ')}
        - HR 경력: ${experiences.map((e: any) => `${e.name}: ${e.value}명`).join(', ')}

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
        });
        return response.text;
    } catch (error)
{
        console.error("Error generating summary from Gemini:", error);
        return "AI 대시보드 요약 생성 중 오류가 발생했습니다.";
    }
};