import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/send-wacrm-welcome' && req.method === 'POST') {
              try {
                const handler = (await import('./api/send-wacrm-welcome.js')).default;
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', async () => {
                  try {
                    (req as any).body = body ? JSON.parse(body) : {};
                  } catch {
                    (req as any).body = {};
                  }
                  (res as any).json = (data: any) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  };
                  (res as any).status = (code: number) => {
                    res.statusCode = code;
                    return res;
                  };
                  await handler(req as any, res as any);
                });
                return;
              } catch (err: any) {
                console.error("Vite API dev error:", err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }
            next();
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/firebase/')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) {
              return 'vendor-motion';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
