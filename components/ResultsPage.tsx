import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { generateDiagnosisFeedback } from '../services/geminiService';
import { downloadResultsAsPDF } from '../services/pdfService';
import { fetchSubmissionById } from '../services/dataService';
import type { DiagnosisResult } from '../types';
import Spinner from './common/Spinner';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

    const chartData = useMemo(() => {
        if (!result) return [];
        return [
            { subject: '이해', score: result.scores.understanding, fullMark: 5 },
            { subject: '활용', score: result.scores.application, fullMark: 5 },
            { subject: '비판적 사고', score: result.scores.criticalThinking, fullMark: 5 },
        ];
    }, [result]);

    const handleDownloadPDF = async () => {
        if (!result?.submissionData.responses.name || isDownloadingPdf) {
            return;
        }
        setIsDownloadingPdf(true);
        const rootEl = document.getElementById('results-content');
        const originalBg = document.body.style.backgroundColor;

        // Temporarily switch to a light theme for PDF export for better printing
        document.body.style.backgroundColor = '#ffffff';
        if (rootEl) rootEl.classList.add('pdf-light-theme');
        
        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            await downloadResultsAsPDF('results-content', `AI_Competency_Diagnosis_${result.submissionData.responses.name}`);
        } catch (error) {
            console.error("PDF Download failed", error);
        } finally {
            // Revert to dark theme
            if (rootEl) rootEl.classList.remove('pdf-light-theme');
            document.body.style.backgroundColor = originalBg;
            setIsDownloadingPdf(false);
        }
    };
    
    if (isFetching) {
        return <div className="text-center p-10"><Spinner /></div>;
    }

    if (!result) {
        return <div className="text-center text-2xl font-bold p-10 bg-slate-800/50 rounded-lg shadow-md border border-slate-700">진단 결과를 찾을 수 없습니다.</div>;
    }
    
    // A little hack to make PDF export background white and text dark
    const pdfStyles = `
        .pdf-light-theme, .pdf-light-theme > div {
            background-color: #ffffff !important;
            background-image: none !important;
            color: #1e293b !important;
        }
        .pdf-light-theme h1, .pdf-light-theme h2, .pdf-light-theme p, .pdf-light-theme strong, .pdf-light-theme span, .pdf-light-theme li {
             color: #1e293b !important;
        }
        .pdf-light-theme .recharts-text {
            fill: #1e293b !important;
        }
        .pdf-light-theme .pdf-score-card {
            background-color: #f1f5f9 !important;
        }
        .pdf-light-theme .text-cyan-400 { color: #0891b2 !important; }
        .pdf-light-theme .text-transparent { color: #1e293b !important; }
        .pdf-light-theme .pdf-feedback-card {
            background-color: #eff6ff !important;
            border-color: #93c5fd !important;
            color: #1e3a8a !important;
        }
         .pdf-light-theme .pdf-explanation-card {
            background-color: #f8fafc !important;
        }
    `;

    return (
        <div className="max-w-5xl mx-auto">
            <style>{pdfStyles}</style>
             <div id="results-content" className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 md:p-12 rounded-2xl shadow-2xl space-y-10">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">{result.submissionData.responses.name}님의 AI 역량 진단 리포트</h1>
                    <p className="text-slate-400 mt-2">{new Date(result.submissionData.timestamp).toLocaleString('ko-KR')} 기준</p>
                </div>

                <div className="grid md:grid-cols-5 gap-8 items-center">
                    <div className="md:col-span-3 h-80 md:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#475569" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} stroke="#475569" tick={{ fill: '#94a3b8' }} />
                                <Radar name={`${result.submissionData.responses.name}님`} dataKey="score" stroke="#22d3ee" fill="#06b6d4" fillOpacity={0.6} />
                                <Legend wrapperStyle={{ color: "#e2e8f0" }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="md:col-span-2 text-center bg-slate-800/50 p-6 rounded-lg border border-slate-700 pdf-score-card">
                        <h2 className="text-2xl font-bold text-slate-200 mb-3">종합 역량 점수</h2>
                        <p className="text-6xl font-bold text-cyan-400 mb-4">{result.overall.toFixed(1)} <span className="text-2xl text-slate-400">/ 5.0</span></p>
                        <div className="space-y-2 text-lg text-left inline-block text-slate-300">
                            <p><strong>🧠 이해:</strong> <span className="font-bold text-white">{result.scores.understanding}점</span></p>
                            <p><strong>🛠️ 활용:</strong> <span className="font-bold text-white">{result.scores.application}점</span></p>
                            <p><strong>🔍 비판적 사고:</strong> <span className="font-bold text-white">{result.scores.criticalThinking}점</span></p>
                        </div>
                    </div>
                </div>
                 
                <div className="pt-8 border-t border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">💡 영역별 해설</h2>
                    <div className="bg-slate-800/50 p-6 rounded-lg space-y-4 text-slate-300 border border-slate-700 pdf-explanation-card">
                        <p><strong>🧠 이해 (Understand): {result.scores.understanding}점</strong><br />AI의 기본 원리, 가능성과 한계에 대한 이해 수준을 의미합니다.</p>
                        <p><strong>🛠️ 활용 (Use): {result.scores.application}점</strong><br />업무 목적에 맞게 AI 도구를 능숙하고 효율적으로 사용하는 능력을 의미합니다.</p>
                        <p><strong>🔍 비판적 사고 (Critical Thinking): {result.scores.criticalThinking}점</strong><br />AI가 생성한 결과물의 신뢰성, 편향성, 윤리적 문제를 판단하는 능력을 의미합니다.</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">🤖 AI 생성 맞춤 분석 및 제언</h2>
                     {isLoading ? <Spinner /> : (
                        <div className="bg-blue-900/30 p-6 rounded-lg whitespace-pre-wrap text-base text-blue-200 leading-relaxed border border-blue-500/50 pdf-feedback-card">
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