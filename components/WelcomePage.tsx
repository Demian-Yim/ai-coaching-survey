
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
    const imageUrl = "https://raw.githubusercontent.com/Demian-Yim/db/Hompage/%ED%94%84%EB%A1%9C%ED%95%84_%EB%8D%B0%EB%AF%B8%EC%95%88.png";
    const videoUrl = "https://raw.githubusercontent.com/Demian-Yim/db/Hompage/A_bright_refreshing_202508211752_r800k.mp4";

    return (
        <div className="space-y-12 md:space-y-16 py-8">
            {/* Hero Section */}
            <div className="text-center bg-slate-900/70 backdrop-blur-sm border border-cyan-500/30 p-8 md:p-12 rounded-2xl shadow-2xl max-w-5xl mx-auto">
                <h2 className="text-3xl font-semibold text-cyan-400 mb-4">&lt;9/15 (월) AI 코칭&gt;</h2>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 leading-tight mb-6">
                    “내 일”을 바꾸는<br />AI 200% 활용법
                </h1>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 text-slate-300 text-xl">
                    <span className="flex items-center"><span className="mr-2 text-xl">📅</span> 2025년 9월 15일(월) 10:00 - 17:00</span>
                    <span className="flex items-center"><span className="mr-2 text-xl">📍</span> 구루피플스 강의장</span>
                </div>
            </div>

            {/* Video Section */}
            <div className="max-w-4xl mx-auto text-center">
                 <div className="bg-slate-900/70 backdrop-blur-sm border border-cyan-500/30 p-2 rounded-2xl shadow-2xl">
                    <video 
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full rounded-xl"
                    >
                        Your browser does not support the video tag.
                    </video>
                 </div>
            </div>

            {/* Instructor Intro Section */}
            <div className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-sm border border-cyan-500/30 p-10 rounded-2xl shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12">
                    {/* Image Section */}
                    <div className="flex-shrink-0">
                        <div className="relative inline-block">
                            <div className="p-1.5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 neon-glow">
                                 <img src={imageUrl} alt="데미안 임정훈 강사" className="w-48 h-48 rounded-full object-cover" />
                            </div>
                        </div>
                    </div>
            
                    {/* Text Section */}
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
                            <span role="img" aria-label="waving hand">👋</span> 반갑습니다!
                        </h2>
                        <p className="text-slate-300 text-2xl md:text-3xl mb-4 font-semibold">데미안 임정훈 코치 입니다.</p>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
                            실무에서 정말 바로 써먹을 수 있는 AI 활용법과 <br/>
                            현업 이슈 해결해 나아가는 진짜 이야기를 <br/>
                            함께 나누려고 합니다. <br/>
                            고맙습니다~ <span role="img" aria-label="rocket">🚀</span>
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Call to Action */}
            <div className="max-w-4xl mx-auto text-center bg-slate-800/60 backdrop-blur-sm border border-cyan-500/30 p-10 rounded-2xl shadow-xl">
                 <h2 className="text-3xl font-bold text-slate-100 mb-4">최적의 학습 경험을 위해, 먼저 진단해주세요!</h2>
                 <p className="text-slate-400 mb-8 text-xl">맞춤형 코칭을 위해 여러분의 현재 AI 활용 수준을 알려주세요! (약 5-8분 소요)</p>
                 <Link to="/survey" className="inline-block bg-cyan-500 text-slate-900 font-bold py-4 px-10 rounded-lg text-xl hover:bg-cyan-400 transition-all transform hover:scale-105 shadow-lg neon-glow border-2 border-cyan-300">
                    사전 역량 진단 시작하기
                </Link>
            </div>

            <footer className="mt-16 py-8 border-t border-slate-700/50 text-slate-400 text-center">
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Demian 임정훈
                </p>
                <p className="text-sm mt-2">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default WelcomePage;
