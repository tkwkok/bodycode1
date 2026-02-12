import React from 'react';
import { MicroscopeIcon, PillIcon, ShieldCheckIcon, CartIcon, BellIcon, LeafIcon, SamsungHealthIcon } from './icons';
import ReminderSetter from './ReminderSetter';

interface InitialAnalysisProps {
    text: string | null;
}

const colorClasses = {
  teal: { border: 'border-teal-500', bg: 'bg-teal-100', text: 'text-teal-600', darkBg: 'dark:bg-teal-900/50' },
  blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600', darkBg: 'dark:bg-blue-900/50' },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-600', darkBg: 'dark:bg-emerald-900/50' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-600', darkBg: 'dark:bg-orange-900/50' },
  red: { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-600', darkBg: 'dark:bg-red-900/50' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-600', darkBg: 'dark:bg-purple-900/50' },
};


const sectionConfig: { [key: string]: { icon: React.ReactElement; color: keyof typeof colorClasses } } = {
    '종합 분석': { icon: <MicroscopeIcon />, color: 'teal' },
    '추천 영양 성분': { icon: <PillIcon />, color: 'blue' },
    '추천 제품': { icon: <CartIcon />, color: 'emerald' },
    '생활습관 개선 및 권고사항': { icon: <LeafIcon />, color: 'orange' },
    '의학적 주의사항': { icon: <ShieldCheckIcon />, color: 'red' },
};
const reminderConfig = { icon: <BellIcon />, color: 'purple' as keyof typeof colorClasses };


const ProductCard: React.FC<{ productInfo: string; color: string; }> = ({ productInfo, color }) => {
    const brandMatch = productInfo.match(/\[(.*?)\]/);
    const nameMatch = productInfo.match(/\] (.*?)\,/);
    const detailsMatch = productInfo.match(/\, (.*)/);

    if (!brandMatch || !nameMatch || !detailsMatch) return <p>{productInfo}</p>;
    
    const brand = brandMatch[1];
    const name = nameMatch[1];
    const details = detailsMatch[1];

    const classes = colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald;

    return (
        <div className={`p-4 border dark:border-slate-700 rounded-lg not-prose bg-slate-50/50 dark:bg-slate-800/20 border-l-4 ${classes.border}`}>
            <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">{brand}</p>
            <p className="font-bold text-md text-slate-800 dark:text-slate-200">{name}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{details}</p>
        </div>
    );
};

const KeywordItem: React.FC<{ keyword: string; description: string }> = ({ keyword, description }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
        <span className="inline-block bg-slate-200 dark:bg-slate-700 rounded-md px-3 py-1 text-sm font-bold text-slate-800 dark:text-slate-200 flex-shrink-0 whitespace-nowrap">
            {keyword}
        </span>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mt-1 sm:mt-0">{description}</p>
    </div>
);


const renderContent = (content: string, title: string) => {
    const config = sectionConfig[title];
    if (title.includes('추천 제품')) {
        const products = content.split('\n').filter(line => line.trim().startsWith('- '));
        return (
            <div className="space-y-3">
                {products.map((prod, idx) => (
                    <ProductCard key={idx} productInfo={prod.substring(2)} color={config.color} />
                ))}
            </div>
        );
    }

    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    const elements = lines.map((line, index) => {
        if (line.trim().startsWith("'**") && line.trim().endsWith("**'")) {
            return <strong key={index} className="block mt-4 mb-1 text-md text-slate-800 dark:text-slate-200">{line.replace(/'/g, '').replace(/\*\*/g, '')}</strong>;
        }
        if (line.trim().startsWith('- **')) {
            const parts = line.trim().substring(2).split(':**');
            const keyword = parts[0].replace(/\*\*/g, '').trim();
            const description = parts.slice(1).join(':').trim();
            return <KeywordItem key={index} keyword={keyword} description={description} />;
        }
        if (line.trim().startsWith('- ')) {
            return <li key={index} className="list-disc list-inside text-base">{line.trim().substring(2)}</li>;
        }
        return <p key={index} className="text-base leading-relaxed">{line}</p>;
    });
    
    return <div className="space-y-4">{elements}</div>;
};


const InitialAnalysis: React.FC<InitialAnalysisProps> = ({ text }) => {
    if (!text) {
        return (
            <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 md:p-8 flex items-center justify-center h-48 border border-slate-200 dark:border-slate-800 mt-6">
                <p className="text-slate-500">분석 결과를 기다리는 중...</p>
            </div>
        );
    }

    const sections = text.split('### ').filter(s => s.trim() !== '');
    const recommendedSupplementsText = sections.find(s => s.includes('추천 영양 성분')) || '';
    const supplements = recommendedSupplementsText.split('\n').filter(line => line.trim().startsWith('- **')).map(line => line.substring(4).split(':**')[0].trim());

    return (
        <div className="space-y-6 mt-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <SamsungHealthIcon className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold">더 정밀한 분석을 원시나요?</h3>
                        <p className="mt-1 opacity-90 text-sm">삼성 헬스 데이터를 연동하고 더 정확한 맞춤 분석을 받아보세요.</p>
                    </div>
                </div>
                <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-colors w-full sm:w-auto">
                    <span>연동하기</span>
                </button>
            </div>

            {sections.map((section, index) => {
                const lines = section.split('\n');
                const titleWithEmoji = lines[0].trim();
                const title = titleWithEmoji.substring(titleWithEmoji.indexOf(' ')).trim();
                const content = lines.slice(1).join('\n').trim();
                const config = sectionConfig[title];
                
                if(!config) return null;
                const classes = colorClasses[config.color];

                return (
                    <div key={index} className={`bg-white dark:bg-slate-900/70 shadow-lg rounded-2xl border-t-4 ${classes.border} overflow-hidden`}>
                        <div className={`p-6 md:p-8`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-full ${classes.bg} ${classes.darkBg}`}>
                                    {React.cloneElement(config.icon, { className: `w-7 h-7 ${classes.text}` })}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
                            </div>
                            <div className="mt-5 pl-1 prose prose-md dark:prose-invert max-w-none">
                                {renderContent(content, title)}
                            </div>
                        </div>
                    </div>
                );
            })}
             <div className={`bg-white dark:bg-slate-900/70 shadow-lg rounded-2xl border-t-4 ${colorClasses.purple.border} overflow-hidden`}>
                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4">
                         <div className={`p-2.5 rounded-full ${colorClasses.purple.bg} ${colorClasses.purple.darkBg}`}>
                            {React.cloneElement(reminderConfig.icon, { className: `w-7 h-7 ${colorClasses.purple.text}` })}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">복약 알림 설정</h2>
                    </div>
                    <div className="mt-4">
                        <ReminderSetter supplements={supplements} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialAnalysis;