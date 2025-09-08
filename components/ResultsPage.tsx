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

    const handleDownloadPDF = () => {
        if (result?.submissionData.responses.name) {
            downloadResultsAsPDF('results-content', `AI_Competency_Diagnosis_${result.submissionData.responses.name}`);
        }
    };
    
    if (isFetching) {
        return <div className="text-center p-10"><Spinner /></div>;
    }

    if (!result) {
        return <div className="text-center text-2xl font-bold p-10 bg-white rounded-lg shadow-md">진단 결과를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
             <div id="results-content" className="bg-white p-6 md:p-12 rounded-xl shadow-lg">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-800">{result.submissionData.responses.name}님의 AI 역량 진단 리포트</h1>
                    <p className="text-slate-600 mt-2">{new Date(result.submissionData.timestamp).toLocaleString('ko-KR')} 기준</p>
                </div>

                <div className="grid md:grid-cols-5 gap-8 items-center mb-10">
                    <div className="md:col-span-3 h-80 md:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
                                <Radar name={`${result.submissionData.responses.name}님`} dataKey="score" stroke="#1d4ed8" fill="#3b82f6" fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="md:col-span-2 text-center bg-slate-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">종합 역량 점수</h2>
                        <p className="text-6xl font-bold text-blue-600 mb-4">{result.overall.toFixed(1)} <span className="text-2xl text-slate-500">/ 5.0</span></p>
                        <div className="space-y-2 text-lg text-left inline-block">
                            <p><strong>🧠 이해:</strong> {result.scores.understanding}점</p>
                            <p><strong>🛠️ 활용:</strong> {result.scores.application}점</p>
                            <p><strong>🔍 비판적 사고:</strong> {result.scores.criticalThinking}점</p>
                        </div>
                    </div>
                </div>
                 
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">💡 영역별 해설</h2>
                    <div className="bg-slate-50 p-6 rounded-lg space-y-4 text-slate-700">
                        <p><strong>🧠 이해 (Understand): {result.scores.understanding}점</strong><br />AI의 기본 원리, 가능성과 한계에 대한 이해 수준을 의미합니다.</p>
                        <p><strong>🛠️ 활용 (Use): {result.scores.application}점</strong><br />업무 목적에 맞게 AI 도구를 능숙하고 효율적으로 사용하는 능력을 의미합니다.</p>
                        <p><strong>🔍 비판적 사고 (Critical Thinking): {result.scores.criticalThinking}점</strong><br />AI가 생성한 결과물의 신뢰성, 편향성, 윤리적 문제를 판단하는 능력을 의미합니다.</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">🤖 AI 생성 맞춤 분석 및 제언</h2>
                     {isLoading ? <Spinner /> : (
                        <div className="bg-blue-50 p-6 rounded-lg whitespace-pre-wrap text-blue-800 leading-relaxed border border-blue-200">
                            {result?.feedback}
                        </div>
                    )}
                </div>
            </div>
            <div className="text-center mt-8">
                <button 
                    onClick={handleDownloadPDF}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all shadow-md"
                >
                    📄 결과 PDF로 저장하기
                </button>
            </div>
        </div>
    );
};

export default ResultsPage;