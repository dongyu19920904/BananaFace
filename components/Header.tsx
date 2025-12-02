
import React from 'react';
import type { Lang } from '../types';

interface HeaderProps {
  lang: Lang;
}

const subtitles = {
  en: 'Professional AI Medical Illustrator. Create textbook-quality anatomical diagrams in seconds.',
  zh: '专业 AI 医学插画师。秒级生成教科书级解剖图谱。'
}

export const Header: React.FC<HeaderProps> = ({ lang }) => {
  return (
    <header className="text-left">
      <h1 className="text-4xl sm:text-5xl font-light text-gray-800 dark:text-gray-100">
        🧬 MediSketch｜医学绘影
      </h1>
      <p className="mt-2 text-base font-light text-gray-500 dark:text-gray-400">
        {subtitles[lang]}
      </p>
    </header>
  );
};
