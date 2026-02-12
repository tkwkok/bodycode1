import React from 'react';

const ConsultationPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-800 mt-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">1:1 맞춤 상담 신청</h2>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    전문 약사에게 직접 건강 상담을 받고, 당신만을 위한 심층 분석 리포트를 받아보세요.
                </p>
            </div>
            
            <form 
                action="https://formspree.io/f/xykdkrbj" 
                method="POST" 
                className="mt-10 max-w-lg mx-auto space-y-6"
            >
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
                        placeholder="example@email.com / 010-1234-5678"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                        문의 내용
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        placeholder="현재 겪고 있는 건강 문제, 복용 중인 약물, 생활 습관 등 상담받고 싶은 내용을 자세히 적어주세요."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                </div>
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-teal-700 disabled:bg-slate-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                    >
                        상담 신청서 제출하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultationPage;