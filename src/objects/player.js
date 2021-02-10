export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'dude')

    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.setCollideWorldBounds(true)

    scene.sys.events.on('update', this.update, this)
    this.cursors = scene.input.keyboard.createCursorKeys()
    this.dead = false
  }

  update () {
    if (this.dead) {
      this.scene.sys.events.off('update', this.update)
      return
    }

    if (this.cursors.left.isDown) {
      this.setVelocityX(-160)
      this.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(160)
      this.anims.play('right', true)
    } else {
      this.setVelocityX(0)
      this.anims.play('turn')
    }

    if (this.cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-330)
    }
  }

  die () {
    this.dead = true
    this.setTint(0xff0000)
    this.anims.play('turn')
  }
}
