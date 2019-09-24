const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { NODE_ENV = 'production' } = process.env;


module.exports = {
    entry: './start.ts',
    externals: [ nodeExternals() ],
    mode: 'development',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'start.js'
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}