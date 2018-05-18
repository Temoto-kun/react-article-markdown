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
            },
        },
    ],
};
