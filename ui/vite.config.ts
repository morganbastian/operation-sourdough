import react from '@vitejs/plugin-react-swc';
import { defineConfig as defineVitestConfig } from 'vitest/config'; 


export default defineVitestConfig({
  plugins: [react()],
  test: {
    
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTest.ts' 
  },
});