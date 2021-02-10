export default class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'bomb')

    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.setBounce(1)
    this.setCollideWorldBounds(true)
    this.setVelocity(Phaser.Math.Between(-200, 200), 20)
    this.allowGravity = false
    this.cursors = scene.input.keyboard.createCursorKeys()
    this.dead = false
  }
}
