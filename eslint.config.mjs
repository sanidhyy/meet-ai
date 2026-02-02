import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const tailwindPlugin = require('eslint-plugin-tailwindcss');
const tailwindFlatRecommended = tailwindPlugin.configs['flat/recommended'];

const eslintConfig = defineConfig([
	globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'migrations/**']),
	...nextVitals,
	...nextTypescript,
	...tailwindFlatRecommended,
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
	{
		rules: {
			'@next/next/no-img-element': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			camelcase: ['error', { properties: 'always' }],
			'no-alert': 'error',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-arrow-callback': 'warn',
			'prettier/prettier': [
				'warn',
				{
					endOfLine: 'auto',
				},
			],
			'react-hooks/incompatible-library': 'off',
			'react-hooks/set-state-in-effect': 'off',
			'sort-keys': 'warn',
			'sort-vars': 'warn',
			'tailwindcss/classnames-order': 'off',
			'tailwindcss/no-custom-classname': 'warn',
		},
		settings: {
			tailwindcss: {
				callees: ['cva', 'classnames', 'classNames', 'clsx', 'cn', 'cns', 'cx'],
				config: `${__dirname}/src/app/globals.css`,
			},
		},
	},
]);

export default eslintConfig;
