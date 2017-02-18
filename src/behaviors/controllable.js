const Controllable = {
  options: {
    left:  Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    up:    Phaser.KeyCode.UP,
    down:  Phaser.KeyCode.DOWN,
    speed: 1
  },

  create(object, options) {
    this.updateKeys(object.game, options)
    this.motion = new Phaser.Point()
  },

  update(object, options) {
    this.motion.setTo(0, 0)

    if (this.left.isDown) this.motion.x = -options.speed
    if (this.right.isDown) this.motion.x = options.speed
    if (this.up.isDown) this.motion.y = -options.speed
    if (this.down.isDown) this.motion.y = options.speed

    object.x += this.motion.x
    object.y += this.motion.y
  },

  updateKeys(game, options = this.options) {
    const keyboard = game.input.keyboard

    this.left  = keyboard.addKey(options.left)
    this.right = keyboard.addKey(options.right)
    this.up    = keyboard.addKey(options.up)
    this.down  = keyboard.addKey(options.down)
  }
}

export default Controllable
