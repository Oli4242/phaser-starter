import Collectable from '../behaviors/collectable'

function addCow(game, x, y) {
  const cow = game.add.sprite(x, y, 'cow')

  game.physics.arcade.enable(cow)
  game.plugins.behavior.enable(cow)

  cow.behaviors.set('collectable', Collectable, {
    onCollection: () => cow.kill()
  })

  return cow
}

export default addCow
