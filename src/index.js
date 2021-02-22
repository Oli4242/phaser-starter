import Phaser from 'phaser/src/phaser-arcade-physics'

import Loading from './scenes/loading'
import Play from './scenes/play'

import createFactory from './utils/create_factory'
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

createFactory('player', Player)
createFactory('score', Score)

new Phaser.Game(config) // eslint-disable-line no-new

/**
 * @author    Oli4242
 * @license   {@link https://opensource.org/licenses/0BSD|0BSD}
 * @see       {@link https://github.com/Oli4242/phaser-starter}
 */
