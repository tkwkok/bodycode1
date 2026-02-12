import React, { useState, useReducer, useEffect } from 'react';
import { BellIcon, SparklesIcon } from './icons.jsx';

const times = ['아침', '점심', '저녁'];

const initialState = {
    reminders: {},
    completion: {},
    points: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_REMINDER': {
            const currentTimes = state.reminders[action.supplement] || [];
            const newTimes = currentTimes.includes(action.time)
                ? currentTimes.filter(t => t !== action.time)
                : [...currentTimes, action.time];
            return { ...state, reminders: { ...state.reminders, [action.supplement]: newTimes } };
        }
        case 'TOGGLE_COMPLETION': {
            const isCompleted = state.completion[action.supplement]?.[action.time] || false;
            const newPoints = state.points + (isCompleted ? -10 : 10);
            return {
                ...state,
                points: Math.max(0, newPoints),
                completion: {
                    ...state.completion,
                    [action.supplement]: {
                        ...state.completion[action.supplement],
                        [action.time]: !isCompleted,
                    },
                },
            };
        }
        case 'RESET_COMPLETION':
            return { ...state, completion: {} }; // Resets for the new day
        default:
            return state;
    }
}

const GamifiedReminder = ({ supplements }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { reminders, completion, points } = state;

    useEffect(() => {
        // You can add logic here to reset completion daily
        const interval = setInterval(() => {
            // This is a simple daily reset, a more robust solution would use a server timestamp
            dispatch({ type: 'RESET_COMPLETION' });
        }, 24 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const totalDoses = supplements.reduce((acc, s) => acc + (reminders[s]?.length || 0), 0);
    const completedDoses = supplements.reduce((acc, s) =>
        acc + Object.values(completion[s] || {}).filter(Boolean).length, 0);
    
    const progress = totalDoses > 0 ? (completedDoses / totalDoses) * 100 : 0;

    if (supplements.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-900/70 shadow-lg rounded-2xl border-t-4 border-purple-500 overflow-hidden">
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-full bg-purple-100 dark:bg-purple-900/50">
                        <BellIcon className="w-7 h-7 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">오늘의 복약 챌린지</h2>
                </div>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                    영양제를 꾸준히 챙겨먹고 포인트를 모아보세요!
                </p>

                <div className="mt-6 space-y-4">
                    {supplements.map(supplement => (
                        <div key={supplement} className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-lg">
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{supplement}</p>
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                                {times.map(time => {
                                    const isCompleted = completion[supplement]?.[time] || false;
                                    
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => dispatch({ type: 'TOGGLE_COMPLETION', supplement, time })}
                                            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5
                                                ${isCompleted
                                                    ? 'bg-teal-600 text-white border-teal-600 shadow'
                                                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-teal-50 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-full border-2 ${isCompleted ? 'bg-white border-white' : 'border-slate-400' } flex items-center justify-center`}>
                                                {isCompleted && <svg className="w-2.5 h-2.5 text-teal-600" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>}
                                            </div>
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">장내 유익균 캐릭터 성장도</span>
                        <div className="flex items-center gap-1.5">
                            <SparklesIcon className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{points}P</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-teal-500 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                        획득한 포인트는 1:1 상담 시 사용할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GamifiedReminder;