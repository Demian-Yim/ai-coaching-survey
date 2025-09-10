import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import StatCard from './common/StatCard';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { generateDashboardSummary } from '../services/geminiService';
import { fetchAllSubmissions } from '../services/dataService';
import Spinner from './common/Spinner';
import { SURVEY_QUESTIONS } from '../constants';

const COLORS = ['#00A9FF', '#00E0C7', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ffc658'];

const ChartDescription: React.FC<{ analysis: string; checkpoint: string }> = ({ analysis, checkpoint }) => (
    <div className="text-left text-slate-400 mt-4 text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <p><strong className="text-cyan-400">[분석]</strong> {analysis}</p>
        <p className="mt-2"><strong className="text-amber-400">[Check Point]</strong> {checkpoint}</p>
    </div>
);


const DashboardPage: React.FC = () => {
    const { submissions, setSubmissions, deleteSubmission, clearAllSubmissions } = useAppContext();
    const [summary, setSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (submissions.length > 0) {
                setIsLoadingData(false);
                return;
            }
            setIsLoadingData(true);
            try {
                const rawData = await fetchAllSubmissions();
                const formattedSubmissions = rawData.map(d => ({
                    userId: d.id,
                    timestamp: d.timestamp,
                    responses: d
                }));
                setSubmissions(formattedSubmissions);
            } catch (error) {
                console.error("Failed to fetch submissions for dashboard", error);
                alert("대시보드 데이터를 불러오는데 실패했습니다.");
            } finally {
                setIsLoadingData(false);
            }
        };
        loadData();
    }, []);

    const analysisData = useMemo(() => {
        if (submissions.length === 0) return null;

        const getOptionsMap = (questionId: string) => {
            const question = SURVEY_QUESTIONS.flatMap(s => [...s.questions]).find(q => q.id === questionId);
            if (!question || !('options' in question) || !question.options) {
                return {};
            }
        
            const { options } = question;
        
            if (options.length > 0 && typeof options[0] === 'object' && options[0] !== null) {
                return (options as ReadonlyArray<{ value: string; label: string }>).reduce((acc: Record<string, string>, opt) => {
                    acc[opt.value] = opt.label;
                    return acc;
                }, {});
            }
        
            return {};
        };

        const createCounts = (key: string) => {
            const labels = getOptionsMap(key);
            return submissions.reduce((acc, sub) => {
                const value = sub.responses[key];
                if (value) {
                    const name = labels[value] || value;
                    acc[name] = (acc[name] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>);
        };
        
        const createMultiCounts = (key: string) => {
            const labels = getOptionsMap(key);
            return submissions.reduce((acc, sub) => {
                const values = sub.responses[key];
                if (Array.isArray(values)) {
                    values.forEach(value => {
                        const name = labels[value] || value;
                        acc[name] = (acc[name] || 0) + 1;
                    });
                } else if (values) {
                     const name = labels[values] || values;
                     acc[name] = (acc[name] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>);
        };

        const formatChartData = (counts: Record<string, number>) => 
            Object.entries(counts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);
        
        const capabilityScores = submissions.reduce((acc, sub) => {
            acc.understanding += Number(sub.responses.understanding) || 0;
            acc.application += Number(sub.responses.application) || 0;
            acc.criticalThinking += Number(sub.responses.criticalThinking) || 0;
            return acc;
        }, { understanding: 0, application: 0, criticalThinking: 0 });

        const total = submissions.length;

        const fullAnalysis = {
            total,
            avgCapability: [
                { name: '이해', score: parseFloat((capabilityScores.understanding / total).toFixed(1)) },
                { name: '활용', score: parseFloat((capabilityScores.application / total).toFixed(1)) },
                { name: '비판적 사고', score: parseFloat((capabilityScores.criticalThinking / total).toFixed(1)) },
            ],
            positions: formatChartData(createCounts('role')),
            companySizes: formatChartData(createCounts('company_size')),
            aiPolicies: formatChartData(createCounts('ai_policy')),
            allowedTools: formatChartData(createMultiCounts('allowed_tools')),
            firstUseTimes: formatChartData(createCounts('first_use')),
            tools: formatChartData(createMultiCounts('frequently_used')),
            experiences: formatChartData(createCounts('experience')),
            usageFrequencies: formatChartData(createCounts('usage_frequency')),
            expectations: formatChartData(createMultiCounts('expectations')),
            personalConcerns: formatChartData(createMultiCounts('personal_concerns')),
        };
        
        const summaryPayload = {
            total: fullAnalysis.total,
            avgCapability: fullAnalysis.avgCapability,
            positions: fullAnalysis.positions,
            aiPolicies: fullAnalysis.aiPolicies,
            tools: fullAnalysis.tools.slice(0, 5),
            experiences: fullAnalysis.experiences,
        };

        return { ...fullAnalysis, summaryPayload };

    }, [submissions]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (analysisData?.summaryPayload) {
                setIsLoadingSummary(true);
                try {
                    const result = await generateDashboardSummary(analysisData.summaryPayload);
                    setSummary(result);
                } catch (e) {
                    setSummary("AI 인사이트 생성에 실패했습니다.");
                } finally {
                    setIsLoadingSummary(false);
                }
            }
        };
        fetchSummary();
    }, [analysisData]);

    const handleDelete = async (id: string) => {
        if (window.confirm('정말로 이 참여자의 데이터를 삭제하시겠습니까?')) {
            await deleteSubmission(id);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('경고: 모든 참여자 데이터를 영구적으로 삭제합니다. 계속하시겠습니까?')) {
            await clearAllSubmissions();
        }
    };

    const exportToCSV = () => {
        if (submissions.length === 0) {
            alert('내보낼 데이터가 없습니다.');
            return;
        }

        const allQuestions = SURVEY_QUESTIONS.flatMap(s => [...s.questions]);
        const questionMap = new Map();
        allQuestions.forEach(q => {
            if (q.type === 'multi-text' && q.fields) {
                q.fields.forEach(f => questionMap.set(f.id, { ...f, label: f.placeholder || f.id }));
            } else {
                questionMap.set(q.id, q);
            }
        });

        const optionsLabelMap: Record<string, Record<string, string>> = {};
        allQuestions.forEach(q => {
             if ('options' in q && q.options && typeof q.options[0] === 'object') {
                const typedOptions = q.options as ReadonlyArray<{ value: string; label: string }>;
                optionsLabelMap[q.id] = Object.fromEntries(typedOptions.map(opt => [opt.value, opt.label]));
             }
        });

        const columnKeys = SURVEY_QUESTIONS.flatMap(s => s.questions.flatMap(q => q.type === 'multi-text' ? (q.fields?.map(f => f.id) || []) : [q.id]));
        const headers = columnKeys.map(key => questionMap.get(key)?.label || key);

        const rows = submissions.map(sub => {
            return columnKeys.map(key => {
                const val = sub.responses[key];
                let displayValue = '';
                
                if (Array.isArray(val)) {
                    displayValue = val.map(v => optionsLabelMap[key]?.[v] || v).join('; ');
                } else if (optionsLabelMap[key] && val) {
                    displayValue = optionsLabelMap[key][val] || val;
                } else if (val) {
                    displayValue = String(val);
                }
                
                const escaped = displayValue.replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.setAttribute("href", url);
        link.setAttribute("download", `ai_course_submissions_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (isLoadingData) {
        return <div className="text-center p-10"><Spinner /></div>;
    }

    if (!analysisData) {
        return <div className="text-center p-10 bg-slate-800/50 rounded-lg shadow-md border border-slate-700">아직 제출된 진단 결과가 없습니다.</div>;
    }
    
    const chartTooltipProps = {
        contentStyle: { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', fontSize: '14px' },
        wrapperStyle: { zIndex: 1000 }
    };
    const chartAxisProps = {
        tick: { fill: '#cbd5e1', fontSize: 14 },
        stroke: '#475569'
    };
    const chartGridProps = {
        stroke: '#334155'
    };

    const freeTextQuestions = SURVEY_QUESTIONS.find(s => s.id === 'part6')?.questions || [];

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">관리자 대시보드</h1>
                <div className="flex space-x-2">
                    <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all border-2 border-green-400">CSV 내보내기</button>
                    <button onClick={handleClearAll} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all border-2 border-red-400">전체 삭제</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="총 참여자" value={analysisData.total.toString()} />
                <StatCard title="평균 '활용' 점수" value={analysisData.avgCapability[1].score.toFixed(1)} />
                <StatCard title="평균 '종합' 점수" value={((analysisData.avgCapability[0].score + analysisData.avgCapability[1].score + analysisData.avgCapability[2].score)/3).toFixed(1)} />
            </div>

            <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700">
                 <h2 className="text-3xl font-bold mb-4 text-cyan-300">🤖 AI 생성 인사이트</h2>
                 {isLoadingSummary ? <Spinner/> : (
                    <div className="bg-blue-900/30 p-6 rounded-lg whitespace-pre-wrap text-lg leading-relaxed text-blue-200 border border-blue-500/50">
                        {summary}
                    </div>
                 )}
            </div>

            <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-3xl font-bold mb-8 text-center text-slate-200">📊 세부 문항별 분석</h2>
                <div className="grid lg:grid-cols-2 gap-x-16 gap-y-12">
                     <div className="flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-300">역량별 평균 점수</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={analysisData.avgCapability} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid {...chartGridProps} />
                                <XAxis dataKey="name" {...chartAxisProps} />
                                <YAxis domain={[0, 5]} {...chartAxisProps}/>
                                <Tooltip {...chartTooltipProps}/>
                                <Legend wrapperStyle={{ color: "#e2e8f0", fontSize: '14px' }} />
                                <Bar dataKey="score" fill="#00A9FF" name="평균 점수" />
                            </BarChart>
                        </ResponsiveContainer>
                        <ChartDescription 
                            analysis="참여자들의 AI 역량을 세 가지 핵심 영역으로 나누어 평균 점수를 보여줍니다. '활용' 점수가 상대적으로 높은지, '비판적 사고'가 부족한지 등을 파악하여 강의의 강약 조절에 참고할 수 있습니다."
                            checkpoint="특정 역량 점수가 평균 2.5점 이하라면, 해당 부분에 대한 기초 개념 설명과 실습 시간을 더 할애할 필요가 있습니다."
                        />
                    </div>
                     <div className="flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-300">HR 경력 분포</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={analysisData.experiences} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid {...chartGridProps} />
                                <XAxis dataKey="name" {...chartAxisProps} />
                                <YAxis {...chartAxisProps} />
                                <Tooltip {...chartTooltipProps}/>
                                <Bar dataKey="value" fill="#00E0C7" name="응답 수" />
                            </BarChart>
                        </ResponsiveContainer>
                        <ChartDescription 
                             analysis="참여자들의 직무 경력 분포를 보여줍니다. 주니어와 시니어 비중을 통해 참여자 그룹의 경험 수준을 파악하고, 맞춤형 콘텐츠를 준비하는 데 활용할 수 있습니다."
                             checkpoint="시니어(10년 이상) 비중이 높다면, AI를 활용한 기존 업무 방식의 '혁신'과 '전략' 관점의 내용을, 주니어 비중이 높다면 '업무 자동화'와 '생산성 향상'에 초점을 맞추는 것이 효과적입니다."
                        />
                    </div>
                     <div className="flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-300">주요 역할 및 직무</h3>
                         <ResponsiveContainer width="100%" height={350}>
                             <PieChart>
                                <Pie data={analysisData.positions} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}>
                                    {analysisData.positions.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTooltipProps} />
                                <Legend wrapperStyle={{ color: "#e2e8f0", fontSize: '14px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <ChartDescription
                            analysis="참여자들의 직무 분포를 시각화하여 어떤 역할의 참여자가 많은지 한눈에 파악할 수 있습니다. 이는 강의 중 사용할 예시와 사례를 선정하는 데 중요한 기준이 됩니다."
                            checkpoint="특정 직무 그룹(예: '현업 리더/팀장')이 다수를 차지할 경우, 해당 직무와 직접적으로 관련된 'AI를 활용한 팀원 코칭 및 성과관리' 등 별도 세션을 구성하면 만족도를 높일 수 있습니다."
                        />
                    </div>
                     <div className="flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-300">소속 조직 규모</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={analysisData.companySizes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}>
                                    {analysisData.companySizes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS.slice(2)[index % COLORS.slice(2).length]} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTooltipProps} />
                                <Legend wrapperStyle={{ color: "#e2e8f0", fontSize: '14px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <ChartDescription
                             analysis="참여자들이 속한 조직의 규모를 통해 이들이 마주한 AI 도입 환경(자원, 정책, 문화 등)을 유추할 수 있습니다."
                             checkpoint="대기업 참여자가 많다면 정보 보안, 내부 규정, IT 부서와의 협업 등을 강조하고, 스타트업 참여자가 많다면 비용 효율적인 무료 AI 툴 활용법과 빠른 실행 전략을 다루는 것이 좋습니다."
                        />
                    </div>
                     <div className="flex flex-col lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-300">조직 AI 정책 분포</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={analysisData.aiPolicies} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid {...chartGridProps} />
                                <XAxis type="number" {...chartAxisProps} />
                                <YAxis type="category" dataKey="name" width={350} tick={{ ...chartAxisProps.tick, textAnchor: 'end' }} interval={0} />
                                <Tooltip {...chartTooltipProps}/>
                                <Bar dataKey="value" fill="#a4de6c" name="응답 수" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                         <ChartDescription
                             analysis="조직 내 AI 사용 정책의 성숙도를 보여줍니다. 참여자들이 AI를 활용하는 데 있어 제약이 많은 환경인지, 아니면 자유로운 환경인지를 가늠할 수 있습니다."
                             checkpoint="'정책 없음'이나 '사용 금지' 응답이 많을 경우, '가이드라인이 없을 때 안전하게 AI를 사용하는 방법', '보안 우려 없이 AI를 활용하는 노하우' 등의 콘텐츠를 반드시 포함해야 합니다."
                         />
                    </div>
                     <div className="flex flex-col lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-300">교육 기대사항</h3>
                         <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={analysisData.expectations} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                 <CartesianGrid {...chartGridProps} />
                                <XAxis type="number" {...chartAxisProps} />
                                <YAxis type="category" dataKey="name" width={380} tick={{ ...chartAxisProps.tick, textAnchor: 'end' }} interval={0}/>
                                <Tooltip {...chartTooltipProps}/>
                                <Bar dataKey="value" fill="#FF8042" name="응답 수" barSize={20}/>
                            </BarChart>
                        </ResponsiveContainer>
                         <ChartDescription
                             analysis="참여자들이 이번 교육을 통해 가장 얻고 싶어하는 내용을 직접적으로 보여주는 가장 중요한 데이터입니다. 강의 콘텐츠의 우선순위를 결정하는 핵심 기준이 됩니다."
                             checkpoint="가장 많이 선택된 상위 2-3개 항목은 강의의 핵심 내용으로 구성하고, 강의 시작 시 '여러분께서 가장 기대해주신 이 부분을 중점적으로 다루겠다'고 언급하며 기대감을 높이는 것이 좋습니다."
                         />
                    </div>
                 </div>
            </div>
            
            <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-3xl font-bold mb-8 text-center text-slate-200">📝 서술형 응답 모아보기</h2>
                <div className="space-y-10">
                    {freeTextQuestions.map(question => {
                        const responses = submissions.filter(sub => sub.responses[question.id]);
                        if (responses.length === 0) return null;

                        return (
                            <div key={question.id}>
                                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">{question.label}</h3>
                                <div className="space-y-6">
                                    {responses.map(sub => (
                                        <div key={sub.userId} className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                                            <p className="text-slate-200 whitespace-pre-wrap text-lg leading-relaxed">{sub.responses[question.id]}</p>
                                            <p className="text-right text-base text-cyan-400 mt-3">- {sub.responses.name} 님</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-3xl font-bold mb-6 text-slate-200">👥 참여자별 제출 현황</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="p-4 text-slate-300">이름</th>
                                <th className="p-4 text-slate-300">회사</th>
                                <th className="p-4 text-slate-300">직책</th>
                                <th className="p-4 text-slate-300">제출일시</th>
                                <th className="p-4 text-center text-slate-300">작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(sub => (
                                <tr key={sub.userId} className="border-b border-slate-700 hover:bg-slate-700/50 text-slate-300">
                                    <td className="p-4 text-white font-semibold">{sub.responses.name}</td>
                                    <td className="p-4">{sub.responses.company}</td>
                                    <td className="p-4">{sub.responses.position}</td>
                                    <td className="p-4">{new Date(sub.timestamp).toLocaleString('ko-KR')}</td>
                                    <td className="p-4 text-center space-x-4">
                                        <Link to={`/results/${sub.userId}`} className="text-cyan-400 hover:underline">보기</Link>
                                        <button onClick={() => handleDelete(sub.userId)} className="text-red-400 hover:underline">삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;