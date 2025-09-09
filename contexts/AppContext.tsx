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
        await deleteSubmissionById(id);
        setSubmissions(prev => prev.filter(sub => sub.userId !== id));
    };

    const clearAllSubmissions = async () => {
        await deleteAllSubmissions();
        setSubmissions([]);
    };

    const value = { user, setUser, isAdmin, login, logout, submissions, setSubmissions, submitSurvey, findSubmission, deleteSubmission, clearAllSubmissions };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};