import Controllable from '../behaviors/controllable'

function addUfo(game, x, y) {
  const ufo = game.add.sprite(x, y, 'ufo', 0)
  ufo.animations.add('fly').play(10, true)

  game.physics.arcade.enable(ufo)
  game.plugins.behavior.enable(ufo)

  ufo.behaviors.set('controls', Controllable, { speed: 8 })

  return ufo
}

export default addUfo
