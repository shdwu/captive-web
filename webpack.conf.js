'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const config = requrie('./build')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

if (process.env.NODE_ENV === 'development') {
    module.exports = merge(config.base, config.dev)
} else {
    module.exports = merge(config.base, config.prod)
}