import React from 'react';

const PremiumFeature: React.FC<{children: React.ReactNode}> = ({children}) => (
    <li className="flex items-start">
        <svg className="flex-shrink-0 w-6 h-6 text-teal-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span className="ml-3 text-slate-700 dark:text-slate-300">{children}</span>
    </li>
);

const ConsultationPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-800 mt-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">프리미엄 1:1 맞춤 관리 서비스</h2>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    AI 분석을 넘어, 전문 약사가 당신의 건강 데이터를 직접 분석하고 지속적으로 관리하는 프리미엄 멤버십을 경험해보세요.
                </p>
            </div>

            <div className="mt-10 max-w-lg mx-auto bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white">서비스 포함 내역</h3>
                <ul className="mt-6 space-y-4">
                   <PremiumFeature>전문 약사의 <strong>지속적인 복약 관리 및 월간 리포트</strong></PremiumFeature>
                   <PremiumFeature>복용 중인 <strong>모든 의약품과 영양제의 상호작용</strong> 정밀 분석</PremiumFeature>
                   <PremiumFeature>삼성헬스 등 라이프로그 데이터 기반 <strong>생활습관 밀착 코칭</strong></PremiumFeature>
                   <PremiumFeature>서비스 기간 내 <strong>메신저를 통한 상시 Q&A</strong></PremiumFeature>
                </ul>
                <div className="mt-8 text-center">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">월 29,900원</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">(VAT 포함)</p>
                </div>
            </div>
            
            <form 
                action="https://formspree.io/f/xykdkrbj" 
                method="POST" 
                className="mt-10 max-w-lg mx-auto space-y-6"
            >
                <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white">프리미엄 서비스 신청하기</h3>
                <div>
                    <label htmlFor="name" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        성함
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        placeholder="홍길동"
                    />
                </div>
                <div>
                    <label htmlFor="contact" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        연락처 (이메일 또는 전화번호)
                    </label>
                    <input
                        type="text"
                        name="contact"
                        id="contact"
                        required
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        placeholder="신청 확인 및 상담 진행을 위해 필요합니다."
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        주요 건강 고민
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="가장 개선하고 싶은 건강 문제, 현재 겪고 있는 증상, 복용 중인 약물 등을 알려주세요."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                </div>
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-teal-700 disabled:bg-slate-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                    >
                        프리미엄 서비스 신청서 제출
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultationPage;