import { defineConfig } from 'vite'
import { INJECT_PLUGIN as PhotographyInjectPlugin, UPLOAD_PLUGIN as PhotographyUploadPlugin } from './photography/plugins'
import { UPLOAD_PLUGIN as BlogsUploadPlugin, INJECT_PLUGIN as BlogsInjectPlugin } from './blogs/plugins'
import { INJECT_PLUGIN as IndexInjectPlugin } from './src/plugins'
import { RENDER_PLUGIN } from './resume/plugins'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		PhotographyUploadPlugin,
		BlogsUploadPlugin,
		{
			name: 'inject',
			async closeBundle() {
				await IndexInjectPlugin.closeBundle()
				await PhotographyInjectPlugin.closeBundle()
				await BlogsInjectPlugin.closeBundle()
				await RENDER_PLUGIN.closeBundle()
			}
		}
	],
	build: {
		rollupOptions: {
			input: {
				index: 'index.html',

				resume: 'resume/index.html',

				photography: 'photography/index.html',
				photography_upload: 'photography/upload/index.html',

				blogs: 'blogs/index.html',
				blogs_upload: 'blogs/upload/index.html',
				blogs_series: 'blogs/series/index.html',
				blogs_series_blog: 'blogs/series/blog/index.html',

				arcade: 'arcade/index.html',
			}
		},
	}
})