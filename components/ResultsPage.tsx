import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { generateDiagnosisFeedback } from '../services/geminiService';
import { downloadResultsAsPDF } from '../services/pdfService';
import { fetchSubmissionById } from '../services/dataService';
import type { DiagnosisResult } from '../types';
import Spinner from './common/Spinner';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Qualitative Analysis Data ---

const LEVELS = [
    { name: '😊 탐험가', range: [1.0, 2.5], description: 'AI의 세계를 탐험하기 시작한 단계입니다.\n기본 개념을 익히고 간단한 AI 도구 사용법을 배우는 시기입니다.' },
    { name: '🙌 활용자', range: [2.6, 3.5], description: 'AI를 일상과 업무에 활용하고 있습니다.\n다양한 도구를 시도하고 결과를 검증하는 습관을 기르면 좋습니다.' },
    { name: '🌟 전문가', range: [3.6, 4.2], description: 'AI를 창의적으로 활용하는 전문가입니다.\n팀 내 AI 활용을 선도하고 복잡한 문제 해결에 AI를 적용합니다.' },
    { name: '🚀 혁신가', range: [4.3, 5.0], description: 'AI로 새로운 가치를 창출하는 혁신가입니다.\n조직의 AI 전환을 주도하고 미래 전략을 수립합니다.' },
];

const PROFILES = {
    '균형형': { description: '모든 영역에서 고른 점수 분포', suggestion: '가장 관심 있는 영역을 선택해 심화 발전' },
    '실행형': { description: '활용 능력은 높으나 이론/윤리 부족', suggestion: '이론적 배경과 윤리적 고려사항 보강' },
    '이론형': { description: '개념 이해는 높으나 실제 활용 부족', suggestion: '실습과 프로젝트 기반 학습 권장' },
    '미래형': { description: '성장/적응력 높으나 현 활용 부족', suggestion: '현재 활용 가능한 도구 집중 실습' },
};

const GROWTH_SUGGESTIONS = {
    '😊 탐험가': [
        '**온라인 강의나 도서**를 통해 AI 기초 원리를 학습하고, 매일 10분씩 ChatGPT와 대화하며 AI와 친해져보세요.',
        '**스터디 그룹이나 사내 커뮤니티**에 참여하여 동료들과 AI 활용 팁을 공유하고 함께 성장하는 학습 파트너를 찾아보세요.',
        '본 교육과정에서 제공되는 **맞춤형 AI 코칭**을 통해 궁금증을 해결하고, 개인화된 학습 경로를 설계받는 것을 추천합니다.'
    ],
    '🙌 활용자': [
        '자신의 직무에 특화된 **‘나만의 프롬프트 라이브러리’**를 구축하고, 동료들과 공유하며 고도화시켜보세요.',
        '이미지 생성, 데이터 분석 등 특정 목적의 AI 툴을 1~2개 정해 깊이 있게 학습하는 **심화 과정**에 참여해보세요.',
        '**전문가 코칭**을 통해 현재 업무 프로세스를 AI로 혁신하는 개인 프로젝트를 진행하며 실질적인 성공 사례를 만들어보세요.'
    ],
    '🌟 전문가': [
        '팀 내 **‘AI 활용 사례 공유회’**를 정기적으로 주최하고, 구성원들을 돕는 **‘AI 챔피언’** 역할을 수행하며 리더십을 발휘하세요.',
        '외부 전문가 커뮤니티나 컨퍼런스에 참여하여 최신 트렌드를 학습하고, 이를 조직에 내재화하는 방안을 모색하세요.',
        '**리더십 코칭**을 통해 팀의 AI 도입 전략을 수립하고, 조직 내에서 자신의 영향력을 확대하는 방법을 학습할 수 있습니다.'
    ],
    '🚀 혁신가': [
        '조직의 비전과 연계된 **‘AI Transformation 로드맵’**을 수립하고, 경영진을 설득하여 전사적인 지원을 확보하세요.',
        'AI를 활용한 신규 비즈니스 모델을 기획하고 **PoC(Proof of Concept) 프로젝트**를 리딩하며 아이디어를 현실로 만드세요.',
        '최고 수준의 **전문가 코칭 및 컨설팅**을 통해 기술적 통찰력을 비즈니스 전략으로 전환하고 조직 전체의 변화를 이끌어보세요.'
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
    if (criticalThinking === maxScore && criticalThinking - application > 1.0) return '미래형';
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
    
    const pdfStyles = `
        .pdf-light-theme, .pdf-light-theme > div {
            background-color: #ffffff !important;
            background-image: none !important;
            color: #1e293b !important;
            border-color: #e2e8f0 !important;
        }
        .pdf-light-theme h1, .pdf-light-theme h2, .pdf-light-theme p, .pdf-light-theme strong, .pdf-light-theme span, .pdf-light-theme li {
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
        .pdf-light-theme .recharts-wrapper .recharts-surface {
            background-color: transparent !important;
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
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 text-center">🏆 당신의 AI 활용 수준</h2>
                    <div className="bg-slate-800/50 p-8 rounded-lg text-center border border-slate-700 pdf-explanation-card">
                        <p className="text-4xl font-bold text-cyan-400 mb-4">{qualitativeData.level.name}</p>
                        <p className="text-slate-300 text-lg whitespace-pre-line leading-relaxed">{qualitativeData.level.description}</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-8 text-center">📈 영역별 역량 프로필</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center pdf-explanation-card bg-slate-800/50 p-8 rounded-lg border border-slate-700">
                         <div className="w-full h-full flex items-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                    <XAxis type="number" domain={[0, 5]} hide />
                                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#e2e8f0', fontSize: 16 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'rgba(30, 41, 59, 0.5)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                                    <Bar dataKey="score" barSize={30} radius={[0, 10, 10, 0]}>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center md:text-left bg-slate-900/50 p-6 rounded-lg">
                            <p className="text-xl text-slate-400">프로필 유형</p>
                            <p className="text-3xl font-bold text-white mt-1">{qualitativeData.profile.name}</p>
                            <p className="mt-4 text-slate-300"><strong>특징:</strong> {qualitativeData.profile.description}</p>
                            <p className="mt-2 text-cyan-300"><strong>발전 제안:</strong> {qualitativeData.profile.suggestion}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 text-center">🌱 다음 단계를 위한 맞춤형 성장 제안</h2>
                    <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 pdf-explanation-card">
                        <ul className="space-y-4 list-disc list-inside text-slate-300 text-lg">
                            {qualitativeData.suggestions.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 text-center">🤖 AI 생성 맞춤 분석 및 제언</h2>
                     {isLoading ? <Spinner /> : (
                        <div className="bg-blue-900/30 p-8 rounded-lg whitespace-pre-wrap text-base text-blue-200 leading-relaxed border border-blue-500/50 pdf-feedback-card">
                            {result?.feedback}
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