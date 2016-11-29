// this lets us require files with JSX/ES6 in them
require('babel-core/register')

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

const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'development'

var config = getConfig({
  isDev: isDev,
  in: join(src, 'app.js'),
  out: dest,
  clearBeforeBuild: true
})

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

// Having hmre present in the .babelrc will break with the `babel-core/register` above
// have to wait until that is done and then add it here via the loader query
const babelrc = JSON.parse(fs.readFileSync('./.babelrc'))
babelrc.env = {development: {presets: ['react-hmre']}}
config.module.loaders[0].query = babelrc

module.exports = config
