import React from 'react';

interface AdditionalInfoFormProps {
    stress: string;
    setStress: (value: string) => void;
    sleep: string;
    setSleep: (value: string) => void;
    bowel: string;
    setBowel: (value: string) => void;
    healthNotes: string;
    setHealthNotes: (value: string) => void;
}

const RadioGroup: React.FC<{
    label: string;
    name: string;
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
}> = ({ label, name, options, selectedValue, onChange }) => {
    return (
        <div>
            <label className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <label key={option} className={`cursor-pointer px-4 py-2 text-sm rounded-full border transition-colors
                        ${selectedValue === option
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-teal-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={selectedValue === option}
                            onChange={(e) => onChange(e.target.value)}
                            className="sr-only"
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    )
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = (props) => {
    const { stress, setStress, sleep, setSleep, bowel, setBowel, healthNotes, setHealthNotes } = props;

    return (
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50">
             <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-6">
                추가 정보 입력 (더 정확한 분석을 위해)
            </h3>
            <div className="space-y-6">
                <RadioGroup
                    label="최근 스트레스 지수는 어떤가요?"
                    name="stress"
                    options={['낮음', '보통', '높음']}
                    selectedValue={stress}
                    onChange={setStress}
                />
                <RadioGroup
                    label="수면의 질은 어떤가요?"
                    name="sleep"
                    options={['좋음', '보통', '나쁨']}
                    selectedValue={sleep}
                    onChange={setSleep}
                />
                <RadioGroup
                    label="배변 활동은 규칙적인가요?"
                    name="bowel"
                    options={['규칙적', '불규칙적']}
                    selectedValue={bowel}
                    onChange={setBowel}
                />
                <div>
                    <label htmlFor="health-notes" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        기타 건강 정보 (최근 건강검진 결과, 염증 수치 등)
                    </label>
                    <textarea
                        id="health-notes"
                        rows={4}
                        value={healthNotes}
                        onChange={(e) => setHealthNotes(e.target.value)}
                        placeholder="예) 혈액검사 결과 중성지방 수치가 높게 나왔습니다. 최근 CRP(염증 수치)가 1.5였습니다."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdditionalInfoForm;