module.exports = (api) => {
    // transpile down to commonjs for test only
    const cjs = api.env('test')

    const plugins = ['@babel/plugin-syntax-top-level-await']
    if (cjs) {
        plugins.push('babel-plugin-transform-import-meta')
    }

    return {
        presets: [
            [
                '@babel/env', {
                targets: { node: true },
                modules: cjs ? 'commonjs' : false
            }
            ],
            '@babel/typescript'
        ],
        plugins: plugins,
        sourceMaps: true
    }
}