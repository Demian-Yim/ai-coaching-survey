
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const LoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (login(password)) {
            navigate('/dashboard');
        } else {
            setError('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl text-center">
                <h1 className="text-2xl font-bold mb-6 text-slate-200">관리자 로그인</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            className="w-full p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-white"
                        />
                    </div>
                    {error && <p className="text-red-400">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-500 transition"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;