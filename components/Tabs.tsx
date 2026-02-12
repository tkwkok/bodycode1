import React from 'react';
import { BeakerIcon, InfoIcon, ShieldIcon, PencilSquareIcon } from './icons';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactElement;
}> = ({ label, isActive, onClick, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200
                ${isActive
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
        >
            {React.cloneElement<React.SVGProps<SVGSVGElement>>(icon, { className: 'w-5 h-5' })}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex justify-center items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner gap-1 sm:gap-2">
            <TabButton
                label="분석"
                isActive={activeTab === 'analysis'}
                onClick={() => setActiveTab('analysis')}
                icon={<BeakerIcon />}
            />
            <TabButton
                label="1:1 상담 신청"
                isActive={activeTab === 'consultation'}
                onClick={() => setActiveTab('consultation')}
                icon={<PencilSquareIcon />}
            />
            <TabButton
                label="바디코드 소개"
                isActive={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
                icon={<InfoIcon />}
            />
            <TabButton
                label="개인정보처리방침"
                isActive={activeTab === 'privacy'}
                onClick={() => setActiveTab('privacy')}
                icon={<ShieldIcon />}
            />
        </div>
    );
};

export default Tabs;