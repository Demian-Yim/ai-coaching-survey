
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Header: React.FC = () => {
    const { user, isAdmin, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-slate-900/50 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-slate-700/50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <NavLink to="/" className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all">
                    “내 일”을 바꾸는 AI 200% 활용법
                </NavLink>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <NavLink to="/" className={({ isActive }) => `text-slate-300 hover:text-cyan-400 transition-colors px-2 py-1 ${isActive ? 'font-bold text-cyan-400' : ''}`}>
                        홈
                    </NavLink>
                    {user?.submissionId && (
                         <NavLink to={`/results/${user.submissionId}`} className={({ isActive }) => `text-slate-300 hover:text-cyan-400 transition-colors px-2 py-1 ${isActive ? 'font-bold text-cyan-400' : ''}`}>
                            내 결과 보기
                        </NavLink>
                    )}
                    {isAdmin ? (
                        <>
                            <NavLink to="/dashboard" className={({ isActive }) => `text-slate-300 hover:text-cyan-400 transition-colors px-2 py-1 ${isActive ? 'font-bold text-cyan-400' : ''}`}>
                                대시보드
                            </NavLink>
                            <button onClick={handleLogout} className="bg-red-500/80 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-all shadow-md">
                                로그아웃
                            </button>
                        </>
                    ) : (
                         <NavLink to="/login" className={({ isActive }) => `text-slate-300 hover:text-cyan-400 transition-colors px-2 py-1 ${isActive ? 'font-bold text-cyan-400' : ''}`}>
                                관리자
                            </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;