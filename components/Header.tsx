import React from 'react';
import { LogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="flex items-center justify-center gap-3">
        <LogoIcon className="w-10 h-10 text-teal-500" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">
            바디코드 (Body Code)
          </span>
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        내 몸의 코드를 풀다: 데이터 기반 개인 맞춤 영양 설계
      </p>
    </header>
  );
};

export default Header;