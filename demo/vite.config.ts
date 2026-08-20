/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// GitHub Pages(guksu.github.io/fe-skills/) 배포 경로 기준
export default defineConfig({
  base: '/fe-skills/',
  plugins: [react()],
  resolve: {
    alias: {
      // 정본(plugin/skills)의 예시 컴포넌트를 데모가 직접 import한다 — 복사본 금지 원칙
      '@skills': fileURLToPath(new URL('../plugin/skills', import.meta.url)),
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
