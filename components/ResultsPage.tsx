import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { generateDiagnosisFeedback } from '../services/geminiService';
import { downloadResultsAsPDF } from '../services/pdfService';
import { fetchSubmissionById } from '../services/dataService';
import type { DiagnosisResult } from '../types';
import Spinner from './common/Spinner';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

// --- Qualitative Analysis Data ---

const LEVELS = [
    { name: '😊 탐험가 (Explorer)', range: [1.0, 2.5], description: 'AI의 광활한 세계를 이제 막 탐험하기 시작한 단계입니다.\n호기심을 가지고 AI 도구들을 하나씩 접하며 가능성을 발견하는 시기입니다.' },
    { name: '🙌 활용자 (Practitioner)', range: [2.6, 3.5], description: 'AI를 자신의 업무에 실제로 적용하며 효율성을 높이는 단계입니다.\n다양한 도구를 시도하고, 더 나은 결과물을 만들기 위해 노력합니다.' },
    { name: '🌟 전문가 (Specialist)', range: [3.6, 4.2], description: 'AI를 창의적이고 깊이 있게 활용하여 뛰어난 결과물을 만들어내는 전문가입니다.\n팀 내에서 AI 활용을 선도하며 복잡한 문제를 해결합니다.' },
    { name: '🚀 혁신가 (Innovator)', range: [4.3, 5.0], description: 'AI를 통해 기존에 없던 새로운 가치를 창출하고, 조직의 변화를 이끄는 혁신가입니다.\nAI를 활용한 미래 전략을 수립하고 방향을 제시합니다.' },
];

const COMPETENCY_DETAILS = {
  understanding: {
    title: '🧠 이해 (Understand)',
    description: 'AI의 기본 원리, 최신 기술 동향, 비즈니스 적용 가능성을 파악하고, 기술적 한계(환각) 및 잠재적 리스크를 명확히 이해하는 능력입니다.',
    levels: [
      { score: [1, 2], text: 'AI 관련 용어가 아직 낯설고, 기술의 작동 방식보다는 결과물에만 집중하는 경향이 있습니다.' },
      { score: [3], text: '주요 AI 기술(LLM, 이미지 생성 등)의 차이점을 인지하고, AI의 한계점(환각)을 고려하며 활용하기 시작합니다.' },
      { score: [4, 5], text: '새로운 AI 기술 동향을 주도적으로 학습하고, 이를 자신의 업무에 어떻게 적용할지 구체적인 아이디어를 제시할 수 있습니다.' },
    ]
  },
  application: {
    title: '🛠️ 활용 (Use)',
    description: '자신의 업무 목적에 가장 적합한 AI 도구를 선정하고, 효과적인 프롬프트를 작성하여 기대 이상의 결과물을 생성하며 워크플로우를 자동화하는 능력입니다.',
    levels: [
      { score: [1, 2], text: '가이드나 예시를 따라 간단한 명령어를 입력하는 수준이며, 원하는 결과물을 얻기까지 여러 번의 시도가 필요합니다.' },
      { score: [3], text: '명확한 목적을 가지고 AI에게 역할을 부여(페르소나)하고, 구체적인 맥락을 제공하여 원하는 결과물을 만들 수 있습니다.' },
      { score: [4, 5], text: '여러 AI 도구를 조합하여 복잡한 과업을 해결하고, 반복 업무를 자동화하는 자신만의 워크플로우를 구축할 수 있습니다.' },
    ]
  },
  criticalThinking: {
    title: '🔍 비판적 사고 (Critical Thinking)',
    description: 'AI 생성물의 사실관계, 논리적 오류, 숨겨진 편향성을 검토하고, 교차 검증을 통해 정보의 신뢰도를 판단하며 최종 책임을 가지고 활용하는 능력입니다.',
    levels: [
      { score: [1, 2], text: 'AI가 생성한 결과물을 대부분 그대로 수용하며, 사실관계 확인이나 비판적 검토 과정이 부족한 편입니다.' },
      { score: [3], text: 'AI 결과물에 오류가 있을 수 있음을 인지하고, 중요한 정보는 출처를 확인하거나 추가 검증을 시도합니다.' },
      { score: [4, 5], text: 'AI 생성물의 숨겨진 편향이나 윤리적 문제를 발견하고 이를 수정할 수 있으며, 결과물에 대한 최종적인 책임을 집니다.' },
    ]
  },
};


const PROFILES = {
    '균형형': { description: '모든 영역에서 고른 역량을 보유한 안정적인 유형입니다.', suggestion: '가장 흥미를 느끼는 특정 영역을 선택하여 깊이 파고들어 자신만의 전문 분야로 만들어보세요.' },
    '실행형': { description: '생각보다 행동이 앞서는 강력한 실행가 유형입니다. 새로운 AI 도구를 즉시 업무에 적용하는 데 능숙합니다.', suggestion: 'AI의 원리와 한계를 이해하고, 결과물을 비판적으로 검토하는 습관을 더하면 AI 활용의 완성도를 높일 수 있습니다.' },
    '이론형': { description: 'AI 기술에 대한 깊은 이해를 갖춘 전략가 유형입니다. 기술의 원리와 가능성을 명확히 파악하고 있습니다.', suggestion: '이론적 지식을 실제 업무에 적극적으로 적용하는 연습을 통해, 아이디어를 현실로 만드는 능력을 강화해보세요.' },
    '탐구형': { description: '신중하고 깊이 있게 탐구하는 학자 유형입니다. AI 결과물의 신뢰도와 윤리적 측면을 중요하게 생각합니다.', suggestion: '다양한 AI 도구를 더 과감하게 실험하고 활용하며, 빠른 실행을 통해 아이디어를 검증하는 경험을 쌓아보세요.' },
};

const GROWTH_SUGGESTIONS = {
    '😊 탐험가 (Explorer)': [
        {
            icon: '🎯',
            title: '오늘 바로 실천할 작은 성공',
            content: '**오늘 작성한 이메일이나 보고서 한 단락을 ChatGPT에게 주고, "이 글을 더 정중하고 프로페셔널한 톤으로 바꿔줘"라고 요청해보세요.** AI가 내 업무를 실제로 도와줄 수 있다는 작은 성공 경험이 가장 중요합니다.'
        },
        {
            icon: '📚',
            title: '이번 주, AI와 친해지기',
            content: '**유튜브 채널 \'EO\'나 \'일잘러 장피엠\'에서 AI 관련 영상 2개를 시청하고, 가장 인상 깊었던 내용을 동료와 공유해보세요.** 최신 트렌드를 재미있게 접하며 AI에 대한 막연한 두려움을 호기심으로 바꿀 수 있습니다.'
        },
        {
            icon: '🚀',
            title: '한 달 후, 자신감 찾기',
            content: '**본 교육과정에서 배운 프롬프트 작성법 중 1가지를 정해, 한 달간 5번 이상 업무에 적용하고 그 결과를 기록해보세요.** 작은 습관이 쌓여 AI를 자유자재로 활용하는 자신을 발견하게 될 것입니다.'
        },
    ],
    '🙌 활용자 (Practitioner)': [
         {
            icon: '🎯',
            title: '오늘 바로 실천할 효율 개선',
            content: '**가장 반복적으로 하는 단순 업무(예: 데이터 정리, 자료 검색)를 하나 정하고, "이 작업을 자동화할 수 있는 AI 도구나 방법을 추천해줘"라고 AI에게 물어보세요.** AI를 단순 조수가 아닌, 워크플로우 개선 파트너로 활용하는 첫걸음입니다.'
        },
        {
            icon: '📚',
            title: '이번 주, 나만의 무기 만들기',
            content: '**자신의 직무에 특화된 ‘나만의 프롬프트 5종 세트’를 만들어보세요. (예: 주간보고 초안 작성용, 아이디어 발상용 등) 동료들과 공유하며 서로의 프롬프트를 발전시켜보는 것도 좋습니다.**'
        },
        {
            icon: '🚀',
            title: '한 달 후, 결과물 업그레이드',
            content: '**이미지 생성(Midjourney, DALL-E)이나 데이터 분석(ChatGPT Advanced Data Analysis) 등 특정 목적의 AI 툴 1개를 정해 깊이 있게 학습하고, 실제 업무 결과물(보고서, 발표자료)의 질을 한 단계 높여보세요.**'
        },
    ],
    '🌟 전문가 (Specialist)': [
        {
            icon: '🎯',
            title: '오늘 바로 영향력 발휘하기',
            content: '**팀 동료 중 한 명에게 최근 발견한 유용한 AI 활용 팁 하나를 공유하거나, 동료의 업무 문제를 AI로 함께 해결해주는 ‘10분 AI 페어코칭’을 진행해보세요.** 지식 나눔을 통해 팀 내 영향력을 키울 수 있습니다.'
        },
        {
            icon: '📚',
            title: '이번 주, AI 챔피언 되기',
            content: '**팀 내 ‘AI 활용 사례 공유회’를 정기적으로 주최하거나, 사내 메신저에 AI 활용 팁을 공유하는 채널을 만들어 구성원들을 돕는 ‘AI 챔피언’ 역할을 시작해보세요.**'
        },
        {
            icon: '🚀',
            title: '한 달 후, 전문가로 인정받기',
            content: '**현재 팀이 겪고 있는 가장 큰 문제점을 AI로 해결하는 개인 프로젝트를 기획하고 실행하여 실질적인 성공 사례를 만들어보세요. 이 과정을 통해 문제 해결 능력을 증명하고 전문가로 인정받을 수 있습니다.**'
        },
    ],
    '🚀 혁신가 (Innovator)': [
         {
            icon: '🎯',
            title: '오늘 바로 미래 그리기',
            content: '**팀장이나 경영진에게 "우리 조직의 비전과 연계하여, AI를 통해 3년 후 우리 팀의 업무 방식이 어떻게 바뀔 수 있을까요?"라는 주제로 대화를 시작해보세요.** 기술적 통찰력을 비즈니스 전략과 연결하는 첫걸음입니다.'
        },
        {
            icon: '📚',
            title: '이번 주, 변화의 씨앗 심기',
            content: '**AI를 활용한 새로운 비즈니스 모델이나 프로세스 개선 아이디어를 구체화하여 1페이지 제안서로 작성하고, 관련 부서 동료들과 아이디어를 발전시켜보세요.** 작은 아이디어를 현실로 만드는 구체적인 행동이 중요합니다.'
        },
        {
            icon: '🚀',
            title: '한 달 후, 변화를 주도하기',
            content: '**구체화된 아이디어를 바탕으로 소규모 PoC(Proof of Concept) 프로젝트를 리딩하여 아이디어의 실현 가능성을 증명하세요. 성공적인 PoC는 전사적인 지원을 이끌어내는 가장 강력한 무기가 됩니다.**'
        },
    ],
};

// --- Helper Functions ---

const getUserLevel = (score: number) => {
    return LEVELS.find(l => score >= l.range[0] && score <= l.range[1]) || LEVELS[0];
};

const getUserProfile = (scores: { understanding: number; application: number; criticalThinking: number; }) => {
    const { understanding, application, criticalThinking } = scores;
    const scoreValues = Object.values(scores);
    const maxScore = Math.max(...scoreValues);
    const minScore = Math.min(...scoreValues);
    const diff = maxScore - minScore;

    if (diff <= 1.0) return '균형형';
    if (application === maxScore && application - minScore > 1.0) return '실행형';
    if (understanding === maxScore && understanding - application > 1.0) return '이론형';
    if (criticalThinking === maxScore && criticalThinking - application > 1.0) return '탐구형';
    return '균형형'; // Default case
};


const ResultsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);


    useEffect(() => {
        const getResultData = async () => {
            if (!userId) {
                setIsFetching(false);
                return;
            }

            try {
                setIsFetching(true);
                const submissionData = await fetchSubmissionById(userId);
                
                const scores = {
                    understanding: Number(submissionData.understanding) || 0,
                    application: Number(submissionData.application) || 0,
                    criticalThinking: Number(submissionData.criticalThinking) || 0,
                };
                const overall = (scores.understanding + scores.application + scores.criticalThinking) / 3;

                setIsLoading(true); // Loading feedback
                const feedback = await generateDiagnosisFeedback(scores);
                setIsLoading(false);

                setResult({ 
                    scores, 
                    overall, 
                    feedback, 
                    submissionData: { userId, timestamp: submissionData.timestamp, responses: submissionData }
                });

            } catch (error) {
                console.error("Failed to fetch result data", error);
                setResult(null);
            } finally {
                setIsFetching(false);
            }
        };

        getResultData();
    }, [userId]);
    
    const qualitativeData = useMemo(() => {
        if (!result) return null;
        
        const level = getUserLevel(result.overall);
        const profileKey = getUserProfile(result.scores);
        const profile = PROFILES[profileKey as keyof typeof PROFILES];
        const suggestions = GROWTH_SUGGESTIONS[level.name as keyof typeof GROWTH_SUGGESTIONS];
        
        return { level, profile: { name: profileKey, ...profile }, suggestions };
    }, [result]);

     const chartData = useMemo(() => {
        if (!result) return [];
        return [
            { name: '이해', score: result.scores.understanding, fill: '#00A9FF' },
            { name: '활용', score: result.scores.application, fill: '#00E0C7' },
            { name: '비판적 사고', score: result.scores.criticalThinking, fill: '#FFBB28' },
        ];
    }, [result]);


    const handleDownloadPDF = async () => {
        if (!result?.submissionData.responses.name || isDownloadingPdf) {
            return;
        }
        setIsDownloadingPdf(true);
        const rootEl = document.getElementById('results-content');
        const originalBg = document.body.style.backgroundColor;

        document.body.style.backgroundColor = '#ffffff';
        if (rootEl) rootEl.classList.add('pdf-light-theme');
        
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            await downloadResultsAsPDF('results-content', `AI_Competency_Diagnosis_${result.submissionData.responses.name}`);
        } catch (error) {
            console.error("PDF Download failed", error);
        } finally {
            if (rootEl) rootEl.classList.remove('pdf-light-theme');
            document.body.style.backgroundColor = originalBg;
            setIsDownloadingPdf(false);
        }
    };
    
    if (isFetching) {
        return <div className="text-center p-10"><Spinner /></div>;
    }

    if (!result || !qualitativeData) {
        return <div className="text-center text-2xl font-bold p-10 bg-slate-800/50 rounded-lg shadow-md border border-slate-700">진단 결과를 찾을 수 없습니다.</div>;
    }
    
    const renderCustomizedLabel = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text x={x + width - 15} y={y + 18} fill="white" textAnchor="end" dominantBaseline="middle" className="font-bold text-lg">
                {value.toFixed(1)}
            </text>
        );
    };

    const pdfStyles = `
        .pdf-light-theme, .pdf-light-theme > div {
            background-color: #ffffff !important;
            background-image: none !important;
            color: #1e293b !important;
            border-color: #e2e8f0 !important;
        }
        .pdf-light-theme h1, .pdf-light-theme h2, .pdf-light-theme h3, .pdf-light-theme h4, .pdf-light-theme p, .pdf-light-theme strong, .pdf-light-theme span, .pdf-light-theme li {
             color: #1e293b !important;
        }
        .pdf-light-theme .text-cyan-400 { color: #0891b2 !important; }
        .pdf-light-theme .text-cyan-300 { color: #06b6d4 !important; }
        .pdf-light-theme .text-transparent { color: #1e293b !important; }
        .pdf-light-theme .pdf-feedback-card {
            background-color: #eff6ff !important;
            border-color: #93c5fd !important;
            color: #1e3a8a !important;
        }
         .pdf-light-theme .pdf-explanation-card {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
        }
        .pdf-light-theme .recharts-wrapper .recharts-surface, .pdf-light-theme .recharts-label-list {
            background-color: transparent !important;
            fill: #1e293b !important;
        }
        .pdf-light-theme .recharts-text, .pdf-light-theme .recharts-cartesian-axis-tick-value {
             fill: #1e293b !important;
        }
    `;

    return (
        <div className="max-w-5xl mx-auto">
            <style>{pdfStyles}</style>
             <div id="results-content" className="space-y-10">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-12 rounded-2xl shadow-2xl text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">{result.submissionData.responses.name}님의 AI 역량 진단 리포트</h1>
                    <p className="text-slate-400 mt-2">{new Date(result.submissionData.timestamp).toLocaleString('ko-KR')} 기준</p>
                </div>
                
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 text-center">👑 당신의 AI 성장 레벨</h2>
                    <div className="bg-slate-800/50 p-8 rounded-lg text-center border border-slate-700 pdf-explanation-card">
                        <p className="text-4xl font-bold text-cyan-400 mb-4">{qualitativeData.level.name}</p>
                        <p className="text-slate-300 text-lg whitespace-pre-line leading-relaxed">{qualitativeData.level.description}</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-8 text-center">📊 나의 AI 역량 상세 프로필</h2>
                    <div className="grid md:grid-cols-5 gap-8 items-center">
                         <div className="md:col-span-3 w-full h-full flex items-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                    <XAxis type="number" domain={[0, 5]} hide />
                                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#e2e8f0', fontSize: 16 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'rgba(30, 41, 59, 0.5)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                                    <Bar dataKey="score" barSize={30} radius={[0, 10, 10, 0]}>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        <LabelList dataKey="score" content={renderCustomizedLabel} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="md:col-span-2 text-center md:text-left bg-slate-800/50 p-6 rounded-lg border border-slate-700 pdf-explanation-card">
                            <p className="text-lg text-slate-400">프로필 유형</p>
                            <p className="text-3xl font-bold text-white mt-1">{qualitativeData.profile.name}</p>
                            <p className="mt-4 text-slate-300 text-sm"><strong>특징:</strong> {qualitativeData.profile.description}</p>
                            <p className="mt-2 text-cyan-300 text-sm"><strong>발전 제안:</strong> {qualitativeData.profile.suggestion}</p>
                        </div>
                    </div>
                     <div className="mt-8 space-y-4">
                        {(Object.keys(COMPETENCY_DETAILS) as Array<keyof typeof COMPETENCY_DETAILS>).map(key => {
                            const details = COMPETENCY_DETAILS[key];
                            const score = result.scores[key];
                            const levelText = details.levels.find(l => l.score.includes(Math.round(score)))?.text;
                            return (
                                <div key={key} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 pdf-explanation-card">
                                    <h4 className="font-bold text-lg text-white">{details.title} - <span className="text-cyan-300">{score.toFixed(1)}점</span></h4>
                                    <p className="text-slate-300 mt-1 text-sm">{details.description}</p>
                                    {levelText && <p className="text-slate-400 mt-2 text-sm border-t border-slate-700 pt-2">현재 수준: {levelText}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-8 text-center">💡 바로 실행하는 맞춤 성장 플랜</h2>
                    <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 pdf-explanation-card">
                         <div className="space-y-8">
                            {qualitativeData.suggestions.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="text-3xl mt-1">{item.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-xl text-slate-200">{item.title}</h4>
                                        <p className="text-slate-300 mt-1 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 text-center">🧑‍🔬 닥터 AI의 초개인화 분석 리포트</h2>
                     {isLoading ? <Spinner /> : (
                        <div className="bg-blue-900/30 p-8 rounded-lg whitespace-pre-wrap text-base text-blue-200 leading-relaxed border border-blue-500/50 pdf-feedback-card" dangerouslySetInnerHTML={{ __html: result?.feedback.replace(/###\s/g, '<h3 class="text-2xl font-bold text-cyan-300 mt-6 mb-3">').replace(/-\s\*\*/g, '- **') || '' }}>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-center mt-8">
                <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloadingPdf}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-500 transition-all shadow-lg border-2 border-green-400 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                    {isDownloadingPdf ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            PDF 생성 중...
                        </>
                    ) : (
                       '📄 결과 PDF로 저장하기'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResultsPage;