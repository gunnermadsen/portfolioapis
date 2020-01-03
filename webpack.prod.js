const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    target: 'node',
    devtool: false,
    mode: 'production',
    optimization: {
        namedModules: true,
        minimize: false
    }
})