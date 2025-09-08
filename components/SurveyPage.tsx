import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { SURVEY_QUESTIONS } from '../constants';
import Spinner from './common/Spinner';

const SurveyPage: React.FC = () => {
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { submitSurvey } = useAppContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            const currentValues = formData[name] || [];
            const newValues = checkbox.checked
                ? [...currentValues, value]
                : currentValues.filter((v: string) => v !== value);
            setFormData(prev => ({ ...prev, [name]: newValues }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRadioChange = (name: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name) newErrors.name = '이름을 입력해주세요.';
        if (!formData.company) newErrors.company = '회사를 입력해주세요.';
        if (!formData.position) newErrors.position = '직책을 입력해주세요.';
        if (!formData.laptop_type) newErrors.laptop_type = '노트북 정보를 입력해주세요.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const newSubmissionId = await submitSurvey(formData);
            navigate(`/results/${newSubmissionId}`);
        } catch (error) {
            console.error("Submission failed:", error);
            alert(`제출에 실패했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-2">AI 활용 역량 사전 진단</h1>
            <p className="text-center text-slate-600 mb-8">맞춤형 코칭 설계를 위해 여러분의 소중한 의견을 들려주세요.</p>
            
            <form onSubmit={handleSubmit} className="space-y-10">
                {SURVEY_QUESTIONS.map(section => (
                    <div key={section.id} className="p-6 border border-slate-200 rounded-lg bg-slate-50/50">
                        <h2 className="text-2xl font-semibold mb-1 text-blue-700">{section.title}</h2>
                        {section.description && <p className="text-slate-500 mb-6">{section.description}</p>}
                        
                        <div className="space-y-6">
                            {section.questions.map(q => (
                                <div key={q.id} className="bg-white p-4 rounded-md shadow-sm border border-slate-100">
                                    <label htmlFor={q.id} className="block text-lg font-medium text-slate-800 mb-2">{q.label} {q.required && <span className="text-red-500">*</span>}</label>
                                    {q.description && <p className="text-sm text-slate-500 mb-3">{q.description}</p>}
                                    
                                    {q.type === 'multi-text' && q.fields && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {q.fields.map(field => (
                                                 <div key={field.id}>
                                                    <input
                                                        type="text"
                                                        id={field.id}
                                                        name={field.id}
                                                        placeholder={field.placeholder}
                                                        onChange={handleInputChange}
                                                        required={q.required}
                                                        className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                    />
                                                     {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
                                                 </div>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'text' && (
                                        <>
                                            <input
                                                type="text"
                                                id={q.id}
                                                name={q.id}
                                                onChange={handleInputChange}
                                                placeholder={q.placeholder}
                                                required={q.required}
                                                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors[q.id] && <p className="text-red-500 text-sm mt-1">{errors[q.id]}</p>}
                                        </>
                                    )}

                                    {q.type === 'textarea' && (
                                        <textarea
                                            id={q.id}
                                            name={q.id}
                                            rows={5}
                                            placeholder={q.placeholder}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                    
                                    {(q.type === 'radio' || q.type === 'checkbox') && (
                                        <div className="space-y-2">
                                            {q.options?.map(opt => (
                                                 <label key={opt.value} className="flex items-center p-3 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors">
                                                    <input
                                                        type={q.type}
                                                        name={q.id}
                                                        value={opt.value}
                                                        onChange={handleInputChange}
                                                        className={`h-5 w-5 ${q.type === 'radio' ? 'rounded-full' : 'rounded'} text-blue-600 focus:ring-blue-500 border-slate-300 mr-3`}
                                                    />
                                                    <span>{opt.label}</span>
                                                    {opt.hasTextInput && (
                                                        <input type="text" className="ml-2 p-1 border-b flex-grow" placeholder="직접 입력" name={`${q.id}_other_text`} onChange={handleInputChange} />
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'rating' && (
                                        <div className="flex justify-around items-center bg-slate-50 p-4 rounded-md">
                                            {q.options?.map(val => (
                                                <label key={val} className="flex flex-col items-center space-y-1 cursor-pointer p-2 rounded-md hover:bg-blue-100">
                                                    <span className={`font-semibold ${formData[q.id] === val ? 'text-blue-600' : 'text-slate-600'}`}>{val}점</span>
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        value={val}
                                                        checked={formData[q.id] === val}
                                                        onChange={() => handleRadioChange(q.id, val as number)}
                                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                                                        required
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100 flex justify-center items-center">
                    {isSubmitting ? <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div> 제출 중...</> : '🚀 설문 제출 및 결과 확인'}
                </button>
            </form>
        </div>
    );
};

export default SurveyPage;