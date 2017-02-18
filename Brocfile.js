/*
  What it does:
  build/           ← static/
  build/assets/    ← assets/ without assets/src/
  build/phaser.js  ← engine/*.min.js concatenated
  build/plugins.js ← engine/plugins/* concatenated and uglified
  build/game.js    ← src/ browser-babel-ugly-ified
*/
const Merge    = require('broccoli-merge-trees')
const Watchify = require('broccoli-watchify')
const Concat   = require('broccoli-concat')
const Funnel   = require('broccoli-funnel')
const Uglify   = require('broccoli-uglify-sourcemap')

const { log:Log, debug:Debug } = require('broccoli-stew')

// Replace false by true to force Production mode:
const productionMode = process.argv.indexOf('build') >= 0 || false

let staticFiles = 'static'

let assets = new Funnel('assets', {
  exclude: ['src/**', '**/.keep'],
  destDir: 'assets'
})

let phaser = new Concat('engine/phaser', {
  headerFiles: ['pixi.min.js'],
  inputFiles: ['**/*.min.js'],
  outputFile: 'phaser.js'
})

let plugins = new Funnel('engine/plugins', {
  exclude: productionMode ? ['phaser-inspector.js'] : []
})

plugins = new Concat(plugins, {
  outputFile: 'plugins.js'
})

plugins = new Uglify(plugins, {
  mangle: false
})

let game = new Watchify('src', {
  browserify: {
    entries: ['main.js'],
    debug: !productionMode
  },
  outputFile: 'game.js',
  init(bundle) {
    bundle.transform('babelify', { presets: ['es2015', 'es2016'] })
    if (productionMode) bundle.transform('uglifyify', { global: true })
  }
})

module.exports = new Merge([staticFiles, assets, phaser, plugins, game])
