export default class Star extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'star')
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
  }

  collect () {
    this.disableBody(true, true)
  }

  reset () {
    this.enableBody(true, this.x, 0, true, true)
  }
}
