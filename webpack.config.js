const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const outputPath = path.resolve(__dirname, 'dist');

const tsLoaderRules = [
    {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
    }
];

const extensions = [
    '.tsx',
    '.ts',
    '.js'
];

module.exports = [
    {
        name: 'webext',
        mode: mode,
        entry: {
            'background': `./src/chrome/background.ts`,
            'content/ui/editsubject': `./src/chrome/content/ui/editsubject.ts`,
            'content/ui/options': './src/chrome/content/ui/options.ts',
        },
        experiments: {
            syncWebAssembly: true,
            topLevelAwait: true
        },
        output: {
            path: path.join(outputPath, 'chrome'),
            library: 'findnowui',
            libraryExport: 'default'
            //filename: `${entry}.js`,
        },
        module: {
            rules: [
                ...tsLoaderRules
            ]
        },
        resolve: {
            extensions
        },
        optimization: {
            minimize: false
        }
    },
    {
        name: 'experiment',
        mode,
        entry: './src/chrome/api/findnow/implementation.ts',
        output: {
            filename: 'implementation.js',
            path: path.join(outputPath, 'chrome', 'api', 'findnow'),
            library: 'findnow',
            libraryExport: 'default'
        },
        module: {
            rules: [
                ...tsLoaderRules
            ]
        },
        resolve: {
            extensions
        },
        optimization:{
            minimize: false
        }
    }
];