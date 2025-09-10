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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        if (!formData.laptop_model) newErrors.laptop_model = '노트북 기종을 입력해주세요.';
        
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
        <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">AI 활용 역량 사전 진단</h1>
            <p className="text-center text-slate-400 mb-8">맞춤형 코칭 설계를 위해 여러분의 소중한 의견을 들려주세요.</p>
            
            <form onSubmit={handleSubmit} className="space-y-10">
                {SURVEY_QUESTIONS.map(section => (
                    <div key={section.id} className="p-6 border border-slate-700 rounded-lg bg-slate-800/50">
                        <h2 className="text-2xl font-semibold mb-1 text-cyan-400">{section.title}</h2>
                        {'description' in section && section.description && <p className="text-slate-400 mb-6 whitespace-pre-line">{section.description}</p>}
                        
                        <div className="space-y-6">
                            {section.questions.map(q => (
                                <div key={q.id} className="bg-slate-900/70 p-4 rounded-md shadow-sm border border-slate-800">
                                    <label htmlFor={q.id} className="block text-lg font-medium text-slate-200 mb-2">{q.label} {q.required && <span className="text-red-500">*</span>}</label>
                                    {q.description && <p className="text-sm text-slate-400 mb-3">{q.description}</p>}
                                    
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
                                                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 text-white"
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
                                                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 text-white"
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
                                            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 text-white"
                                        />
                                    )}

                                    {q.type === 'select' && (
                                        <div className="relative">
                                            <select
                                                id={q.id}
                                                name={q.id}
                                                onChange={handleInputChange}
                                                value={formData[q.id] || ''}
                                                required={q.required}
                                                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 text-white appearance-none pr-10"
                                            >
                                                <option value="" disabled>-- 선택해주세요 --</option>
                                                {q.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {(q.type === 'radio' || q.type === 'checkbox') && (
                                        <div className="space-y-2">
                                            {q.options?.map(opt => {
                                                const isChecked = q.type === 'checkbox' 
                                                    ? (formData[q.id] || []).includes(opt.value)
                                                    : formData[q.id] === opt.value;
                                                
                                                return (
                                                    <label key={opt.value} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${isChecked ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'}`}>
                                                        <input
                                                            type={q.type}
                                                            name={q.id}
                                                            value={opt.value}
                                                            checked={isChecked}
                                                            onChange={handleInputChange}
                                                            className="sr-only" // Hide original input
                                                        />
                                                        <div className={`w-5 h-5 mr-3 flex-shrink-0 border-2 rounded-full flex items-center justify-center ${isChecked ? 'border-cyan-400' : 'border-slate-500'}`}>
                                                          {isChecked && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>}
                                                        </div>
                                                        <span className={`${isChecked ? 'text-cyan-300' : 'text-slate-300'}`}>{opt.label}</span>
                                                        {opt.hasTextInput && (
                                                            <input type="text" className="ml-2 p-1 border-b bg-transparent border-slate-500 focus:border-cyan-400 flex-grow text-white outline-none" placeholder="직접 입력" name={`${q.id}_other_text`} onChange={handleInputChange} />
                                                        )}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {q.type === 'rating' && (
                                        <div className="flex justify-around items-center bg-slate-800/50 p-4 rounded-md">
                                            {q.options?.map(val => (
                                                <label key={val} className={`flex flex-col items-center space-y-2 cursor-pointer p-2 rounded-md transition-all ${formData[q.id] === val ? 'bg-cyan-500/20' : 'hover:bg-slate-700/50'}`}>
                                                    <span className={`font-semibold text-lg ${formData[q.id] === val ? 'text-cyan-300' : 'text-slate-400'}`}>{val}점</span>
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        value={val}
                                                        checked={formData[q.id] === val}
                                                        onChange={() => handleRadioChange(q.id, val as number)}
                                                        className="sr-only"
                                                        required
                                                    />
                                                     <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${formData[q.id] === val ? 'border-cyan-400' : 'border-slate-600'}`}>
                                                        {formData[q.id] === val && <div className="w-3 h-3 rounded-full bg-cyan-400"></div>}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:scale-100 flex justify-center items-center neon-glow border-2 border-cyan-300">
                    {isSubmitting ? <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900 mr-3"></div> 제출 중...</> : '🚀 분석 시작하기'}
                </button>
            </form>
        </div>
    );
};

export default SurveyPage;