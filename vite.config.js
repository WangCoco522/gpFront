import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// 用来解析路径的函数
function resolve(dir) {
  return path.join(__dirname, dir);
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src'),
      'scss_vars': resolve('src/styles/vars.scss')
    }
  }
});



