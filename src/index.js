import Phaser from 'phaser/src/phaser-arcade-physics'

import Loading from './scenes/loading'
import Play from './scenes/play'

import factoryFor from './utils/factory_for'
import Player from './objects/player'
import Score from './objects/score'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '222',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 300 }
    }
  },
  scene: [Loading, Play]
}

factoryFor(
  Player,
  Score
)

new Phaser.Game(config) // eslint-disable-line no-new
