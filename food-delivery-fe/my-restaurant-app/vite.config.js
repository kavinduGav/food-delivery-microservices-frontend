import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  server:{
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ✅ backend is container name
    //   changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})


