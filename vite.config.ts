import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        // This one is for your Gemini key
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        
        // ADD THIS LINE for your JSearch key
        'process.env.JSEARCH_API_KEY': JSON.stringify(env.JSEARCH_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // If deploying to GitHub pages, make sure this 'base' property is set correctly
      base: '/Intelligent-Job-Discovery-System/',
    };
});