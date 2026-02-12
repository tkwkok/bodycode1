import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-800 mt-6 prose prose-lg dark:prose-invert max-w-none">
            <h2>바디코드(Body Code) 소개</h2>
            <p>
                <strong>내 몸의 코드를 풀다: 데이터 기반 개인 맞춤 영양 설계</strong>
            </p>
            <p>
                '바디코드'는 복잡하고 방대한 건강 데이터 속에서 당신의 몸이 보내는 신호를 정확히 해석하고,
                최적의 건강 솔루션을 제공하기 위해 탄생한 개인 맞춤형 영양 분석 플랫폼입니다.
                저희는 20년 경력의 베테랑 약사 및 금융 분석가의 깊이 있는 통찰력과 최첨단 AI 기술을 결합하여,
                과학적 근거에 기반한 가장 정밀하고 신뢰도 높은 건강 가이드를 제공합니다.
            </p>
            <h3>우리의 미션</h3>
            <p>
                저희의 미션은 모든 사람이 자신의 건강 데이터를 쉽게 이해하고, 이를 바탕으로 현명한 건강 관리를
                실천할 수 있도록 돕는 것입니다. 넘쳐나는 건강 정보의 홍수 속에서 길을 잃지 않도록,
                '바디코드'는 당신만을 위한 전문적이고 객관적인 등대가 되어드리겠습니다.
            </p>
            <h3>핵심 가치</h3>
            <ul>
                <li><strong>전문성 (Expertise):</strong> 모든 분석과 추천은 약학적 지식과 최신 연구 결과를 바탕으로 제공됩니다.</li>
                <li><strong>개인화 (Personalization):</strong> 개인의 건강 데이터, 생활 습관을 종합적으로 고려한 1:1 맞춤 솔루션을 지향합니다.</li>
                <li><strong>신뢰성 (Trust):</strong> 데이터 보안을 최우선으로 하며, 투명하고 객관적인 정보만을 제공합니다.</li>
            </ul>
            <h3>연락처</h3>
            <p>
                서비스 관련 문의나 비즈니스 제휴는 아래 이메일로 연락 주시기 바랍니다.
                <br />
                - 이메일: contact@bodycode.example.com
            </p>
        </div>
    );
};

export default AboutPage;
