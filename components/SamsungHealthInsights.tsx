import React from 'react';
import { SamsungHealthIcon } from './icons';

interface SamsungHealthInsightsProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

const mockInsights = [
    {
        title: "어젯밤 수면 효율이 다소 낮았습니다.",
        text: "깊은 수면은 장내 미생물 균형과 뇌 기능 회복에 중요합니다. 오늘은 오후 카페인 섭취를 줄이고, 잠들기 1시간 전에는 스마트폰 사용을 자제해보세요.",
        color: "blue"
    },
    {
        title: "최근 스트레스 지수가 '높음'으로 측정되었습니다.",
        text: "지속적인 스트레스는 장 누수 증후군의 원인이 될 수 있습니다. 오늘 업무 중 5분간의 명상이나 심호흡을 통해 의식적으로 긴장을 완화하는 시간을 가져보세요.",
        color: "orange"
    }
];

const SamsungHealthInsights: React.FC<SamsungHealthInsightsProps> = ({ isVisible, setVisible }) => {
    return (
        <>
            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <SamsungHealthIcon className="w-8 h-8 flex-shrink-0 text-[#00B589]" />
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">삼성헬스 데이터 연동</h3>
                        <p className="mt-1 opacity-90 text-sm text-slate-600 dark:text-slate-300">더 정밀한 실시간 맞춤 분석을 받아보세요.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setVisible(!isVisible)}
                    className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-5 rounded-full transition-colors w-full sm:w-auto shadow-sm border border-slate-200 dark:border-slate-600"
                >
                    <span>{isVisible ? '인사이트 숨기기' : '데일리 인사이트 보기'}</span>
                </button>
            </div>
            {isVisible && (
                <div className="grid sm:grid-cols-2 gap-4">
                    {mockInsights.map((insight, index) => (
                         <div key={index} className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border-l-4 border-${insight.color}-500 shadow-md`}>
                            <h4 className={`font-bold text-lg text-${insight.color}-600 dark:text-${insight.color}-400`}>{insight.title}</h4>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">{insight.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default SamsungHealthInsights;
