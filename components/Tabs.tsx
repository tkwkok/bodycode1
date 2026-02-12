import React from 'react';
import { BeakerIcon, InfoIcon, ShieldIcon, PencilSquareIcon, LinkIcon } from './icons';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}> = ({ label, isActive, onClick, icon: Icon }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200
                ${isActive
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex justify-center items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner gap-1 sm:gap-2 flex-wrap">
            <TabButton
                label="분석"
                isActive={activeTab === 'analysis'}
                onClick={() => setActiveTab('analysis')}
                icon={BeakerIcon}
            />
            <TabButton
                label="성분 궁합"
                isActive={activeTab === 'compatibility'}
                onClick={() => setActiveTab('compatibility')}
                icon={LinkIcon}
            />
            <TabButton
                label="1:1 상담"
                isActive={activeTab === 'consultation'}
                onClick={() => setActiveTab('consultation')}
                icon={PencilSquareIcon}
            />
            <TabButton
                label="소개"
                isActive={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
                icon={InfoIcon}
            />
            <TabButton
                label="개인정보"
                isActive={activeTab === 'privacy'}
                onClick={() => setActiveTab('privacy')}
                icon={ShieldIcon}
            />
        </div>
    );
};

export default Tabs;