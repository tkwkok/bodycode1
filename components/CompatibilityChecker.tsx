import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import { fileToBase64 } from '../utils/fileUtils';
import { checkCompatibility } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { LinkIcon, SparklesIcon } from './icons';

interface CompatibilityResult {
    score: number;
    explanation: string;
}

const CompatibilityChecker: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentSupplements, setCurrentSupplements] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CompatibilityResult | null>(null);

    const handleImageChange = useCallback((file: File) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setResult(null);
    }, []);
    
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    const handleCheck = async () => {
        if (!imageFile) {
            setError('궁합을 확인할 영양제 이미지를 업로드해주세요.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const base64Data = await fileToBase64(imageFile);
            const res = await checkCompatibility(
                { data: base64Data, mimeType: imageFile.type },
                currentSupplements
            );
            if (res) {
                setResult(res);
            } else {
                setError('성분 궁합 분석에 실패했습니다. 이미지나 입력값을 확인하고 다시 시도해주세요.');
            }
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800 mt-6">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3">
                    <LinkIcon className="w-8 h-8 text-teal-500" />
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">실시간 성분 궁합 분석</h2>
                </div>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    구매하려는 영양제, 지금 먹는 것과 괜찮을까? AI가 사진 한 장으로 분석해드려요.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="current-supplements" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        현재 복용 중인 영양제
                    </label>
                    <textarea
                        id="current-supplements"
                        rows={3}
                        value={currentSupplements}
                        onChange={(e) => setCurrentSupplements(e.target.value)}
                        placeholder="예) 종합비타민(브랜드명), 오메가3, 유산균 100억"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        새로 추가할 영양제 이미지
                    </label>
                    <ImageUploader onImageUpload={handleImageChange} previewUrl={previewUrl} />
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleCheck}
                    disabled={!imageFile || isLoading}
                    className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                >
                    {isLoading ? (
                        <><LoadingSpinner /><span>분석 중...</span></>
                    ) : (
                        <><SparklesIcon className="w-6 h-6 mr-2" /><span>궁합 분석하기</span></>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p className="font-bold">오류</p>
                    <p>{error}</p>
                </div>
            )}
            
            {result && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50">
                    <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">궁합 분석 결과</h3>
                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p className="text-lg text-slate-600 dark:text-slate-300">궁합 점수</p>
                        <p className={`text-7xl font-bold my-2 ${getScoreColor(result.score)}`}>{result.score}<span className="text-3xl text-slate-400">점</span></p>
                        <p className="mt-4 text-left text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <strong className="text-slate-800 dark:text-white">AI 약사의 분석:</strong> {result.explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompatibilityChecker;