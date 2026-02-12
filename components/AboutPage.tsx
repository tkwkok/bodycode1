import React from 'react';
import { SparklesIcon, ShieldCheckIcon, UserIcon } from './icons';

// FIX: Refactored ValueCard to use an explicit props interface and React.FC
// to resolve a TypeScript error where the 'children' prop was not being correctly identified.
interface ValueCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, children }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
            <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full">
                {icon}
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h4>
        </div>
        <p className="mt-3 text-slate-600 dark:text-slate-300">{children}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-800 mt-6 space-y-10">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">바디코드(Body Code) 소개</h2>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    <strong>내 몸의 코드를 풀다: 데이터 기반 개인 맞춤 영양 설계</strong>
                </p>
            </div>
            
            <div>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    '바디코드'는 복잡하고 방대한 건강 데이터 속에서 당신의 몸이 보내는 신호를 정확히 해석하고, 최적의 건강 솔루션을 제공하기 위해 탄생한 개인 맞춤형 영양 분석 플랫폼입니다. 저희는 20년 경력의 베테랑 약사 및 금융 분석가의 깊이 있는 통찰력과 최첨단 AI 기술을 결합하여, 과학적 근거에 기반한 가장 정밀하고 신뢰도 높은 건강 가이드를 제공합니다.
                </p>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">우리의 미션</h3>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-8 rounded-2xl text-center">
                    <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                        "모든 사람이 자신의 건강 데이터를 쉽게 이해하고, 이를 바탕으로 현명한 건강 관리를 실천할 수 있도록 돕는 것. 넘쳐나는 건강 정보의 홍수 속에서 길을 잃지 않도록, '바디코드'는 당신만을 위한 전문적이고 객관적인 등대가 되어드리겠습니다."
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">핵심 가치</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <ValueCard icon={<SparklesIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />} title="전문성 (Expertise)">
                        모든 분석과 추천은 약학적 지식과 최신 연구 결과를 바탕으로 제공됩니다.
                    </ValueCard>
                    <ValueCard icon={<UserIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />} title="개인화 (Personalization)">
                        개인의 건강 데이터, 생활 습관을 종합적으로 고려한 1:1 맞춤 솔루션을 지향합니다.
                    </ValueCard>
                    <ValueCard icon={<ShieldCheckIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />} title="신뢰성 (Trust)">
                        데이터 보안을 최우선으로 하며, 투명하고 객관적인 정보만을 제공합니다.
                    </ValueCard>
                </div>
            </div>
            
            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">연락처</h3>
                <p className="text-center text-slate-600 dark:text-slate-400">
                    서비스 관련 문의나 비즈니스 제휴는 아래 이메일로 연락 주시기 바랍니다.
                    <br />
                    <a href="mailto:contact@bodycode.example.com" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                        contact@bodycode.example.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AboutPage;