/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// GitHub Pages(guksu.github.io/suta/) 배포 경로 기준
// CI는 저장소 이름으로 VITE_BASE를 만들어 넘긴다 — 저장소 이름을 바꿔도 다음 배포부터 경로가 따라간다
export default defineConfig({
  base: process.env.VITE_BASE ?? '/suta/',
  plugins: [react()],
  resolve: {
    alias: {
      // 정본(plugins/ui/skills)의 예시 컴포넌트를 데모가 직접 import한다 — 복사본 금지 원칙
      '@skills': fileURLToPath(new URL('../plugins/ui/skills', import.meta.url)),
    },
  },
  server: {
    fs: {
      // 데모 루트 밖의 plugin/ 디렉토리 접근 허용
      allow: ['..'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
  },
})
