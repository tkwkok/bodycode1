import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite'
import react from '@vitejs/react-devtools' // 또는 @vitejs/plugin-react

export default defineConfig({
  plugins: [react()],
  base: '/', // 이 부분을 './' 가 아닌 '/' 로 설정해 보세요.
})

export default defineConfig({
  base: './',  // 이 부분이 있는지 확인하고, 없다면 추가해 보세요.
  // ... 나머지 설정
})
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
