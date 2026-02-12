import React, { useState } from 'react';

interface ReminderSetterProps {
    supplements: string[];
}

type TimeOfDay = 'morning' | 'lunch' | 'evening';

const ReminderSetter: React.FC<ReminderSetterProps> = ({ supplements }) => {
    const [reminders, setReminders] = useState<{ [key: string]: TimeOfDay[] }>({});
    const [isSaved, setIsSaved] = useState(false);

    const handleToggle = (supplement: string, time: TimeOfDay) => {
        setIsSaved(false);
        setReminders(prev => {
            const currentTimes = prev[supplement] || [];
            if (currentTimes.includes(time)) {
                return { ...prev, [supplement]: currentTimes.filter(t => t !== time) };
            } else {
                return { ...prev, [supplement]: [...currentTimes, time] };
            }
        });
    };

    const handleSave = () => {
        // This is a mock save function
        console.log("Saving reminders:", reminders);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    };
    
    if(supplements.length === 0) {
        return <p className="text-slate-500 text-sm">추천된 영양제가 없습니다.</p>
    }

    return (
        <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
                추천된 영양제에 대한 복용 알림을 설정하여 꾸준한 건강 관리를 시작하세요.
            </p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {supplements.map(supplement => (
                    <div key={supplement} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 mb-2 sm:mb-0">{supplement}</span>
                        <div className="flex items-center gap-2">
                            {(['morning', 'lunch', 'evening'] as TimeOfDay[]).map(time => (
                                <button
                                    key={time}
                                    onClick={() => handleToggle(supplement, time)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                        reminders[supplement]?.includes(time)
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-teal-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {time === 'morning' ? '아침' : time === 'lunch' ? '점심' : '저녁'}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-4 flex items-center justify-end gap-4">
                {isSaved && <p className="text-sm text-emerald-600 dark:text-emerald-400">알림이 저장되었습니다!</p>}
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-teal-600 text-white font-bold rounded-full shadow-md hover:bg-teal-700 transition-colors"
                >
                    알림 저장
                </button>
            </div>
        </div>
    );
};

export default ReminderSetter;
