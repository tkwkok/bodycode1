import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // 환경 변수(API_KEY 등)를 로드합니다.
    const env = loadEnv(mode, process.cwd(), '');

    return {
      // 1. 배포 경로 설정: Netlify에서는 '/'가 가장 안정적입니다.
      base: '/', 

      server: {
        port: 3000,
        host: '0.0.0.0',
      },

      plugins: [react()],

      // 2. API 키 설정: 코드 내에서 process.env로 접근 가능하게 합니다.
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      resolve: {
        alias: {
          // 3. 경로 별칭 설정: @를 통해 현재 폴더에 접근합니다.
          '@': path.resolve(__dirname, './src'), 
        }
      },

      // 4. 빌드 최적화: MIME 타입 오류 방지를 위한 설정
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});
