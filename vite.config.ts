import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [],
	build: {
		rollupOptions: {
			input: {
				index: 'index.html',

				resume: 'resume/index.html',
			}
		},
	}
})