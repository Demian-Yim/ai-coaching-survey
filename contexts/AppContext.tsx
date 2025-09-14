import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, SurveySubmission, AppContextType } from '../types';
import { postSurveySubmission, deleteSubmissionById, deleteAllSubmissions } from '../services/dataService';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        return sessionStorage.getItem('isAdmin') === 'true';
    });
    const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    };

    const login = (password: string): boolean => {
        if (password === 'inamoment') {
            setIsAdmin(true);
            sessionStorage.setItem('isAdmin', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        sessionStorage.removeItem('isAdmin');
    };

    const submitSurvey = async (formData: any): Promise<string> => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: formData.name,
            company: formData.company,
            position: formData.position,
        };

        const result = await postSurveySubmission(formData);
        const submissionId = result.id;
        
        const finalUser: User = { ...newUser, id: submissionId, submissionId: submissionId };
        setUser(finalUser);
        
        return submissionId;
    };
    
    const findSubmission = (userId: string): SurveySubmission | undefined => {
        return submissions.find(s => s.userId === userId);
    };

    const deleteSubmission = async (id: string) => {
        try {
            await deleteSubmissionById(id);
            setSubmissions(prev => prev.filter(sub => sub.userId !== id));
        } catch (error) {
            console.error("Failed to delete submission:", error);
            alert(`삭제에 실패했습니다. 잠시 후 다시 시도해주세요.`);
        }
    };

    const deleteSelectedSubmissions = async (ids: Set<string>) => {
        if (ids.size === 0) return;
        try {
            const deletePromises = Array.from(ids).map(id => deleteSubmissionById(id));
            await Promise.all(deletePromises);
            setSubmissions(prev => prev.filter(sub => !ids.has(sub.userId)));
        } catch (error) {
            console.error("Failed to delete selected submissions:", error);
            alert(`선택된 항목 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.`);
        }
    };

    const clearAllSubmissions = async () => {
        try {
            await deleteAllSubmissions();
            setSubmissions([]);
        } catch (error) {
            console.error("Failed to clear all submissions:", error);
            alert(`전체 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.`);
        }
    };

    const value = { user, setUser, isAdmin, login, logout, submissions, setSubmissions, submitSurvey, findSubmission, deleteSubmission, deleteSelectedSubmissions, clearAllSubmissions };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};