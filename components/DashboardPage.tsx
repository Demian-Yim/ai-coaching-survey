import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import StatCard from './common/StatCard';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateDashboardSummary } from '../services/geminiService';
import { fetchAllSubmissions } from '../services/dataService';
import Spinner from './common/Spinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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
        
        const capabilityScores = submissions.reduce((acc, sub) => {
            acc.understanding += Number(sub.responses.understanding) || 0;
            acc.application += Number(sub.responses.application) || 0;
            acc.criticalThinking += Number(sub.responses.criticalThinking) || 0;
            return acc;
        }, { understanding: 0, application: 0, criticalThinking: 0 });

        const total = submissions.length;
        
        const createCounts = (key: string, labels: Record<string, string>) => submissions.reduce((acc, sub) => {
            const value = sub.responses[key] || 'N/A';
            const name = labels[value] || value;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const aiPolicyLabels = { 'formal_guideline': '명문화 가이드라인', 'security_policy': '보안 정책 포함', 'informal_guideline': '비공식 가이드라인', 'verbal_guidance': '구두 주의', 'no_policy': '정책 없음', 'prohibited': '전면 금지', 'unknown': '모름' };
        const toolLabels = { 'chatgpt': 'ChatGPT', 'claude': 'Claude', 'gemini': 'Gemini', 'copilot': 'Copilot', 'wrtn': '뤼튼', 'notion_ai': 'Notion AI', 'perplexity': 'Perplexity', 'none': '없음' };
        const experienceLabels = { 'under_1': '1년 미만', '1_3': '1-3년', '3_5': '3-5년', '5_10': '5-10년', '10_15': '10-15년', 'over_15': '15년 이상' };

        return {
            total,
            avgCapability: [
                { name: '이해', score: parseFloat((capabilityScores.understanding / total).toFixed(1)) },
                { name: '활용', score: parseFloat((capabilityScores.application / total).toFixed(1)) },
                { name: '비판적 사고', score: parseFloat((capabilityScores.criticalThinking / total).toFixed(1)) },
            ],
            positions: Object.entries(createCounts('role', {'hrd_manager': 'HRD팀장', 'hrd_staff': 'HRD실무자', 'other': '기타'})).map(([name, value]) => ({ name, value })),
            aiPolicies: Object.entries(createCounts('ai_policy', aiPolicyLabels)).map(([name, value]) => ({ name, value })),
            tools: Object.entries(createCounts('frequently_used', toolLabels)).map(([name, value]) => ({ name, value })),
            experiences: Object.entries(createCounts('experience', experienceLabels)).map(([name, value]) => ({ name, value })),
        };
    }, [submissions]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (analysisData) {
                setIsLoadingSummary(true);
                try {
                    const result = await generateDashboardSummary(analysisData);
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
        if (submissions.length === 0) return;
        const headers = Object.keys(submissions[0].responses).join(',');
        const rows = submissions.map(sub => {
            return Object.values(sub.responses).map(val => {
                const escaped = (''+val).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',');
        });
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "survey_submissions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoadingData) {
        return <div className="text-center p-10"><Spinner /></div>;
    }

    if (!analysisData) {
        return <div className="text-center p-10 bg-white rounded-lg shadow-md">아직 제출된 진단 결과가 없습니다.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">관리자 대시보드</h1>
                <div className="flex space-x-2">
                    <button onClick={exportToCSV} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">CSV 내보내기</button>
                    <button onClick={handleClearAll} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">전체 삭제</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="총 참여자" value={analysisData.total.toString()} />
                <StatCard title="평균 '활용' 점수" value={analysisData.avgCapability[1].score.toFixed(1)} />
                <StatCard title="평균 '종합' 점수" value={((analysisData.avgCapability[0].score + analysisData.avgCapability[1].score + analysisData.avgCapability[2].score)/3).toFixed(1)} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                 <h2 className="text-xl font-bold mb-4">AI 생성 인사이트</h2>
                 {isLoadingSummary ? <Spinner/> : (
                    <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap text-sm text-blue-800 border border-blue-200">
                        {summary}
                    </div>
                 )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">역량별 평균 점수</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analysisData.avgCapability} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 5]}/>
                            <Tooltip wrapperStyle={{ zIndex: 1000 }}/>
                            <Legend />
                            <Bar dataKey="score" fill="#3b82f6" name="평균 점수" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">조직 AI 정책 분포</h2>
                    <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                            <Pie data={analysisData.aiPolicies} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {analysisData.aiPolicies.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperStyle={{ zIndex: 1000 }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">참여자별 제출 현황</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3">이름</th>
                                <th className="p-3">회사</th>
                                <th className="p-3">직책</th>
                                <th className="p-3">제출일시</th>
                                <th className="p-3 text-center">작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(sub => (
                                <tr key={sub.userId} className="border-b hover:bg-slate-50">
                                    <td className="p-3">{sub.responses.name}</td>
                                    <td className="p-3">{sub.responses.company}</td>
                                    <td className="p-3">{sub.responses.position}</td>
                                    <td className="p-3">{new Date(sub.timestamp).toLocaleString('ko-KR')}</td>
                                    <td className="p-3 text-center space-x-2">
                                        <Link to={`/results/${sub.userId}`} className="text-blue-500 hover:underline">보기</Link>
                                        <button onClick={() => handleDelete(sub.userId)} className="text-red-500 hover:underline">삭제</button>
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