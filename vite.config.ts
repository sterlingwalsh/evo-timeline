import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import swc from 'unplugin-swc';

// https://vite.dev/config/
export default defineConfig({
	esbuild: {
		target: 'es2023',
	},
	plugins: [
		react({
			parserConfig(id: string) {
				if (id.endsWith('.ts') || id.endsWith('.tsx')) return { syntax: 'typescript', tsx: false, decorators: true };
			},
		}),
		swc.vite({
			jsc: {
				parser: {
					syntax: 'typescript',
					decorators: true,
				},
				transform: {
					decoratorMetadata: true,
					decoratorVersion: '2022-03',
					react: {
						runtime: 'automatic',
					},
				},
			},
		}),
	],
});
