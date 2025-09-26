/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
	endOfLine: 'auto',
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'',
		'<THIRD_PARTY_MODULES>',
		'',
		'^types$',
		'',
		'@/modules/(.*)$',
		'',
		'^@/(.*)$',
		'',
		'^[./]',
		'',
		'^(?!.*[.]css$)[./].*$',
		'.css$',
		'',
	],
	importOrderCaseSensitive: true,
	importOrderTypeScriptVersion: '5.7.2',
	jsxSingleQuote: true,
	plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
	printWidth: 120,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	tailwindFunctions: ['clsx', 'cva'],
	trailingComma: 'es5',
	useTabs: true,
};

export default config;
