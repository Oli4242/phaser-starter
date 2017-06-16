const Controllable = {
  options: {
    left:  Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    up:    Phaser.KeyCode.UP,
    down:  Phaser.KeyCode.DOWN,
    speed: 200
  },

  create(object, options) {
    const keyboard = object.game.input.keyboard
    options._keys = {
      left:  keyboard.addKey(options.left),
      right: keyboard.addKey(options.right),
      up:    keyboard.addKey(options.up),
      down:  keyboard.addKey(options.down)
    }
  },

  update(object, options) {
    const keys     = options._keys
    const velocity = object.body.velocity

    velocity.setTo(0)

    if (keys.left.isDown)  velocity.x = -options.speed
    if (keys.right.isDown) velocity.x = options.speed
    if (keys.up.isDown)    velocity.y = -options.speed
    if (keys.down.isDown)  velocity.y = options.speed
  }
}

export default Controllable
