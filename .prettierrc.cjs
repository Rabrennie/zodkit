/**
 * @type {import('prettier').Config}
 */
module.exports = {
    useTabs: false,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    plugins: [require('prettier-plugin-svelte')],
    pluginSearchDirs: ['.'],
    overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
};
