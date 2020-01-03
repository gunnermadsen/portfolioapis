const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


module.exports = {
    entry: ['webpack/hot/poll?100', './start.ts'],
    watch: true,
    target: 'node',
    devtool: 'source-maps',
    mode: 'development',
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    node: {
        __dirname: true,
        __filename: true
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
                // options: {
                //     transpileOnly: true
                // }
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [
            new TsconfigPathsPlugin({ configFile: './tsconfig.json' })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin()
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
    },
    optimization: {
        namedModules: true,
        minimize: false
    }
};