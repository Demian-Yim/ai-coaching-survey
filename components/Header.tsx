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
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <NavLink to="/" className="text-xl md:text-2xl font-bold text-blue-600">
                    AI 실전 워크숍
                </NavLink>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <NavLink to="/" className={({ isActive }) => `text-slate-600 hover:text-blue-600 transition-colors ${isActive ? 'font-bold text-blue-600' : ''}`}>
                        홈
                    </NavLink>
                    {user?.submissionId && (
                         <NavLink to={`/results/${user.submissionId}`} className={({ isActive }) => `text-slate-600 hover:text-blue-600 transition-colors ${isActive ? 'font-bold text-blue-600' : ''}`}>
                            내 결과 보기
                        </NavLink>
                    )}
                    {isAdmin ? (
                        <>
                            <NavLink to="/dashboard" className={({ isActive }) => `text-slate-600 hover:text-blue-600 transition-colors ${isActive ? 'font-bold text-blue-600' : ''}`}>
                                대시보드
                            </NavLink>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-all">
                                로그아웃
                            </button>
                        </>
                    ) : (
                         <NavLink to="/login" className={({ isActive }) => `text-slate-600 hover:text-blue-600 transition-colors ${isActive ? 'font-bold text-blue-600' : ''}`}>
                                관리자
                            </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
