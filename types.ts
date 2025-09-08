import { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  company: string;
  position: string;
  submissionId?: string; // Optional submission ID
}

export interface SurveySubmission {
  userId: string;
  timestamp: string;
  responses: {
    [key: string]: any;
  };
}

export interface DiagnosisResult {
  scores: {
    understanding: number;
    application: number;
    criticalThinking: number;
  };
  overall: number;
  feedback: string;
  submissionData: SurveySubmission;
}

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  submissions: SurveySubmission[];
  setSubmissions: (submissions: SurveySubmission[]) => void;
  submitSurvey: (formData: any) => Promise<string>;
  findSubmission: (userId: string) => SurveySubmission | undefined;
  deleteSubmission: (id: string) => Promise<void>;
  clearAllSubmissions: () => Promise<void>;
}
