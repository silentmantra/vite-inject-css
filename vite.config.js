import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';
import { globSync } from 'fast-glob';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        {
            load(id) {
                if (id.endsWith('.vue')) {
                    const source = fs.readFileSync(id).toString().replace(/inject-css:\s*"([^"]+)";/g, replace => {
                        const pattern = replace.match(/"([^"]+)/)[1];
                        return globSync(pattern, { absolute: true }).map(file => fs.readFileSync(file)).join(';');
                    });
                    return source;
                }
            }
        }
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
