import 'babel-polyfill/dist/polyfill.min.js'
import Boot from './states/boot'
import Start from './states/start'

const conf = {
  width: 800,
  height: 600,
  renderer: Phaser.AUTO,
  parent: 'game',
  state: null,
  transparent: false,
  antialias: true,
  physicsConfig: null
}

const game = new Phaser.Game(
  conf.width,
  conf.height,
  conf.renderer,
  conf.parent,
  conf.state,
  conf.transparent,
  conf.antialias
)

game.state.add('boot', Boot)
game.state.add('start', Start)

game.state.start('boot')
