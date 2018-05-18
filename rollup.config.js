import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

export default {
    input: './src/index.js',
    external: ['react', 'react-dom'],
    output: [
        {
            file: './lib/index.js',
            format: 'umd',
            name: 'ReactMarkdown',
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
        },
        {
            file: './docs/index.js',
            format: 'iife',
            name: 'ReactMarkdown',
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            }
        },
    ],
    plugins: [
        resolve({
            customResolveOptions: { moduleDirectory: 'node_modules' }
        }),
        uglify(),
    ]
};
