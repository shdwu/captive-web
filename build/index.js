const baseWebpackConfig = require('./webpack.base.conf')
const devWebpackConfig = require('./webpack.dev.conf')
const prodWebpackConfig = require('./webpack.prod.conf')

module.exports = {
    base: baseWebpackConfig,
    dev: devWebpackConfig,
    prod: prodWebpackConfig
}