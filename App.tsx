
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import SurveyPage from './components/SurveyPage';
import ResultsPage from './components/ResultsPage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAdmin } = useAppContext();
    return isAdmin ? children : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/survey" element={<SurveyPage />} />
                    <Route path="/results/:userId" element={<ResultsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </main>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AppProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </AppProvider>
    );
};

export default App;
