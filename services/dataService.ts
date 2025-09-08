import type { SurveySubmission } from '../types';

// TODO: Replace with your actual Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx4pDzmlK1Spv-zZzOnEG-DNY7aH3R7S4RbOIRCKyok0gBqDCRbwTPezm23aKISTFxm/exec';

const handleFetch = async <T,>(url: string, options?: RequestInit): Promise<T> => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.result !== 'success') {
            throw new Error(result.message || 'API request failed');
        }
        return result.data as T;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};


export const fetchAllSubmissions = (): Promise<any[]> => {
    return handleFetch<any[]>(`${WEB_APP_URL}?action=read`);
};

export const fetchSubmissionById = (id: string): Promise<any> => {
    return handleFetch<any>(`${WEB_APP_URL}?action=readById&id=${id}`);
};

export const postSurveySubmission = async (formData: any): Promise<{ id: string }> => {
     try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors', 
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.result === 'success' && result.id) {
            return { id: result.id };
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        throw error;
    }
};

export const deleteSubmissionById = async (id: string): Promise<{ message: string }> => {
    // This is a mock implementation. In a real scenario, this would make a DELETE request.
    console.log(`Simulating delete for submission ID: ${id}`);
    // For real implementation:
    // return handleFetch<{ message: string }>(`${WEB_APP_URL}?action=deleteById&id=${id}`, { method: 'POST' }); // Using POST for GAS compatibility
     return Promise.resolve({ message: `Successfully deleted submission ${id}` });
};

export const deleteAllSubmissions = async (): Promise<{ message: string }> => {
    // This is a mock implementation.
    console.log('Simulating delete for all submissions.');
    // For real implementation:
    // return handleFetch<{ message: string }>(`${WEB_APP_URL}?action=deleteAll`, { method: 'POST' }); // Using POST for GAS compatibility
    return Promise.resolve({ message: 'All submissions successfully deleted' });
};
