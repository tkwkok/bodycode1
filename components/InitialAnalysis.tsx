import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MicroscopeIcon, PillIcon, ShieldCheckIcon, CartIcon, LeafIcon, BrainIcon, ScaleIcon } from './icons';
import GamifiedReminder from './GamifiedReminder';
import SamsungHealthInsights from './SamsungHealthInsights';

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
  yellow: { border: 'border-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-600', darkBg: 'dark:bg-yellow-900/50' },
};


const sectionConfig: { [key: string]: { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: keyof typeof colorClasses } } = {
    '종합 분석': { icon: MicroscopeIcon, color: 'teal' },
    '추천 영양 성분': { icon: PillIcon, color: 'blue' },
    '성분 조절 및 약물 상호작용 주의사항': { icon: ScaleIcon, color: 'yellow'},
    '추천 제품': { icon: CartIcon, color: 'emerald' },
    '생활습관 개선 및 권고사항': { icon: LeafIcon, color: 'orange' },
    '의학적 주의사항': { icon: ShieldCheckIcon, color: 'red' },
};

const SectionCard: React.FC<{title: string, content: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, color: keyof typeof colorClasses}> = ({title, content, icon: Icon, color}) => {
    const classes = colorClasses[color];
    return (
        <div className={`bg-white dark:bg-slate-900/70 shadow-lg rounded-2xl border-t-4 ${classes.border} overflow-hidden`}>
            <div className={`p-6 md:p-8`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-full ${classes.bg} ${classes.darkBg}`}>
                        <Icon className={`w-7 h-7 ${classes.text}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
                </div>
                <article className="mt-5 pl-1 prose prose-md dark:prose-invert max-w-none">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>{typeof content === 'string' ? content : ''}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
};


const InitialAnalysis: React.FC<InitialAnalysisProps> = ({ text }) => {
    const [showHealthInsights, setShowHealthInsights] = useState(false);

    const parsedSections = useMemo(() => {
        try {
            if (!text || typeof text !== 'string' || text.trim() === '') {
                return { sections: {}, supplements: [], tip: null, hasContent: false };
            }

            const sectionsMap: { [key: string]: string } = {};
            let tipOfTheDay: string | null = null;
            
            let currentTitle: string | null = null;
            let currentContent: string[] = [];
            const knownTitles = [...Object.keys(sectionConfig), '오늘의 장-뇌 축 팁'];

            const commitSection = () => {
                if (currentTitle) {
                    const content = currentContent.join('\n').trim();
                    if (currentTitle === '오늘의 장-뇌 축 팁') {
                        tipOfTheDay = content;
                    } else {
                        sectionsMap[currentTitle] = content;
                    }
                }
                currentTitle = null;
                currentContent = [];
            };

            text.split('\n').forEach(line => {
                if (line.startsWith('###')) {
                    commitSection();
                    
                    const potentialTitle = line.replace(/^###\s*(?:🔬|💊|⚖️|🛒|🌿|🌱|⚠️)?\s*/, '').trim();
                    const matchedTitle = knownTitles.find(t => potentialTitle.includes(t));
                    
                    if (matchedTitle) {
                        currentTitle = matchedTitle;
                    }
                } else if (currentTitle) {
                    currentContent.push(line);
                }
            });

            commitSection(); // Commit the very last section

            const recommendedSupplementsText = sectionsMap['추천 영양 성분'] || '';
            const supplements = recommendedSupplementsText.split('\n').filter(line => line.trim().startsWith('- **')).map(line => line.substring(4).split(':**')[0].trim());

            const hasContent = Object.keys(sectionsMap).length > 0 || !!tipOfTheDay;
            return { sections: sectionsMap, supplements, tip: tipOfTheDay, hasContent };
        } catch (error) {
            console.error("Error parsing analysis content:", error);
            // Fallback state in case of parsing error, ensures the component doesn't crash.
            return { sections: {}, supplements: [], tip: null, hasContent: false };
        }
    }, [text]);


    if (!text || text.trim() === '') {
        return (
            <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 md:p-8 flex items-center justify-center h-48 border border-slate-200 dark:border-slate-800 mt-6">
                <p className="text-slate-500">분석 결과를 기다리는 중...</p>
            </div>
        );
    }
    
    const { sections, supplements, tip, hasContent } = parsedSections;

    if (!hasContent) {
        return (
             <div className="bg-white dark:bg-slate-900/70 shadow-lg rounded-2xl p-6 md:p-8 mt-6 border border-slate-200 dark:border-slate-700">
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">분석 결과</h3>
                 <p className="mt-4 text-slate-600 dark:text-slate-300">AI가 분석 결과를 생성했지만, 예상치 못한 형식으로 제공되어 내용을 자동으로 분류할 수 없었습니다. 아래는 AI가 보낸 원본 텍스트입니다:</p>
                 <article className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-md whitespace-pre-wrap font-mono text-sm prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{typeof text === 'string' ? text : ''}</ReactMarkdown>
                 </article>
            </div>
        )
    }

    return (
        <div className="space-y-6 mt-6">
            <SamsungHealthInsights isVisible={showHealthInsights} setVisible={setShowHealthInsights} />
            
            {tip && (
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <BrainIcon className="w-10 h-10 flex-shrink-0 opacity-80" />
                    <div>
                        <h3 className="text-xl font-bold">오늘의 장-뇌 축 팁!</h3>
                        <p className="mt-1 opacity-90"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: React.Fragment }}>{typeof tip === 'string' ? tip : ''}</ReactMarkdown></p>
                    </div>
                </div>
            )}

            {Object.entries(sections).map(([title, content]) => {
                const config = sectionConfig[title];
                if (!config || typeof content !== 'string') return null;

                return <SectionCard key={title} title={title} content={content} icon={config.icon} color={config.color} />;
            })}
             
            <GamifiedReminder supplements={supplements} />
        </div>
    );
};

export default InitialAnalysis;