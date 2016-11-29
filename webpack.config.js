// this lets us require files with JSX/ES6 in them
require('babel-core/register')

const NODE_ENV = process.env.NODE_ENV
const dotenv = require('dotenv')

const webpack = require('webpack')
const fs = require('fs');
const path = require('path'),
      join = path.join,
      resolve = path.resolve

const getConfig = require('hjs-webpack')

const root = resolve(__dirname)
const src = join(root, 'src')
const modules = join(root, 'node_modules')
const dest = join(root, 'dist')

const isDev = NODE_ENV === 'development'
const isTest = NODE_ENV === 'test'

// getConfig setup

var config = getConfig({
  isDev: isDev,
  in: join(src, 'app.js'),
  out: dest,
  clearBeforeBuild: true
})

// External setup

if (isTest) {
  config.externals = {
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true
  }

  config.plugins = config.plugins.filter(p => {
    const name = p.constructor.toString()
    const fnName = name.match(/^function (.*)\((.*\))/)
    const idx = ['DedupePlugin', 'UglifyJsPlugin'].indexOf(fnName[1])
    return idx < 0
  })
}

//

config.resolve.root = [src, modules]
config.resolve.alias = {
  'css': join(src, 'styles'),
  'containers': join(src, 'containers'),
  'components': join(src, 'components'),
  'utils': join(src, 'utils')
}

// Css loading setup

config.postcss = [].concat([
  require('precss')({}),
  require('autoprefixer')({}),
  require('cssnano')({})
])

const cssModulesNames = `${isDev ? '[path][name]__[local]__' : ''}[hash:base64:5]`

const matchCssLoaders = /(^|!)(css-loader)($|!)/

const findLoader = (loaders, match) => {
  const found = loaders.filter(l => l && l.loader && l.loader.match(match))
  return found ? found[0] : null
}

// existing css loader
const cssloader = findLoader(config.module.loaders, matchCssLoaders)

const newCssLoader = Object.assign({}, cssloader, {
  test: /\.module\.css$/,
  include: [src],
  loader: cssloader.loader
    .replace(matchCssLoaders,
    `$1$2?modules&localIdentName=${cssModulesNames}$3`)
})
config.module.loaders.push(newCssLoader)
cssloader.test = new RegExp(`[^module]${cssloader.test.source}`)
cssloader.loader = newCssLoader.loader

config.module.loaders.push({
  test: /\.css$/,
  include: [modules],
  loader: 'style!css'
})

// ENV variables

const dotEnvVars = dotenv.config()
const environmentEnv = dotenv.config({
  path: join(root, 'config', `${NODE_ENV}.config.js`),
  silent: true
})
const envVariables = Object.assign({}, dotEnvVars, environmentEnv)

const defines = Object.keys(envVariables).reduce((memo, key) => {
  const val = JSON.stringify(envVariables[key])
  memo[`__${key.toUpperCase()}__`] = val
  return memo
}, {
  __NODE_ENV__: JSON.stringify(NODE_ENV)
})

config.plugins = [
  new webpack.DefinePlugin(defines)
].concat(config.plugins)

// Having hmre present in the .babelrc will break with the `babel-core/register` above
// have to wait until that is done and then add it here via the loader query
const babelrc = JSON.parse(fs.readFileSync('./.babelrc'))
babelrc.env = {development: {presets: ['react-hmre']}}
config.module.loaders[0].query = babelrc

module.exports = config
