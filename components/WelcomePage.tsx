import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in-up space-y-12">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">🚀 찐 HRD 실무자가 알려주는 AI 실전 워크숍</h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6">6시간 실습 심화 과정 · 소수정예 7명 · 현업 실무자 전용</p>
                
                <div className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-full mb-8 text-sm md:text-base">
                    📅 8월 22일 (금) 오전 10시 ~ 저녁 5시 | 강남역 도보 3분 세미나룸
                </div>
            </div>
             <div className="max-w-4xl mx-auto">
                 <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
                    <video className="w-full h-full object-cover" controls autoPlay loop muted playsInline>
                        <source src="https://videos.openai.com/vg-assets/assets%2Ftask_01k33677v5ex69ddqemrt5g521%2Ftask_01k33677v5ex69ddqemrt5g521_genid_26b7d746-6d94-4583-b3f6-a1d927c9d17b_25_08_20_07_31_084148%2Fvideos%2F00000_610771425%2Fsource.mp4?st=2025-08-21T05%3A20%3A20Z&se=2025-08-27T06%3A20%3A20Z&sks=b&skt=2025-08-21T05%3A20%3A20Z&ske=2025-08-27T06%3A20%3A20Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=%2F9dyLm9iULBX6vPINdvYUdktFS1FkiCA9iHcRbbdls4%3D&az=oaivgprodscus" type="video/mp4" />
                        브라우저에서 영상을 지원하지 않습니다.
                    </video>
                 </div>
            </div>

            {/* Instructor Introduction Section */}
            <div className="max-w-2xl mx-auto text-center bg-slate-50 p-8 rounded-2xl">
                <div 
                    className="relative w-48 h-48 mx-auto mb-6 p-2 bg-gradient-to-tr from-yellow-300 via-red-400 to-blue-500 rounded-full"
                >
                    <div 
                        className="w-full h-full bg-center bg-cover rounded-full"
                        style={{ backgroundImage: `url('https://raw.githubusercontent.com/Demian-Yim/hrd_club/Hompage/Round_Demian_2020.png')` }}
                    ></div>
                </div>
                <h2 className="text-3xl font-bold mb-4">👋 반갑습니다!</h2>
                <p className="text-xl text-gray-800 mb-4"><strong>데미안 임정훈</strong>입니다.</p>
                <p className="text-lg text-gray-600 leading-relaxed">
                    AI를 활용하며 겪은 진짜 이야기를 나누고 싶어,<br />
                    이 자리에 참여하게 되었습니다.<br />
                    실무에서 정말 써먹을 수 있는 AI 활용법과 현업 이슈 해결을,<br />
                    함께 고민하고 나누고 싶습니다. 🚀
                </p>
            </div>


            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-slate-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">과정 소개</h2>
                    <p className="text-gray-600 leading-relaxed">
                        단순한 AI 도구 사용법을 넘어, <span className="font-bold text-blue-600">내 일의 흐름</span>을 바꾸는 실습 중심의 코칭입니다.
                        AI 200% 활용을 위한 PC 기본 세팅부터 나만의 AI 맞춤 설정, 실무 문서 작성, 음성/영상 모드 활용, 그리고 간단한 앱/웹 서비스 제작까지, 실제 업무에 바로 적용 가능한 내용으로 구성되었습니다.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">코칭 특징</h2>
                     <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>7명 소수 정예 맞춤형 코칭</li>
                        <li>실무 중심의 프로젝트 기반 학습</li>
                        <li>Before & After가 보장되는 성과</li>
                        <li>참여자 간 네트워킹 및 경험 공유</li>
                    </ul>
                </div>
            </div>
            
            <div className="text-center mt-12">
                <Link 
                    to="/survey"
                    className="bg-blue-600 text-white font-bold text-lg px-12 py-4 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                    사전 역량 진단 시작하기
                </Link>
                <p className="mt-4 text-sm text-gray-500">
                    맞춤형 코칭을 위해 여러분의 현재 AI 활용 수준을 알려주세요! (약 5-8분 소요)
                </p>
            </div>
        </div>
    );
};

export default WelcomePage;