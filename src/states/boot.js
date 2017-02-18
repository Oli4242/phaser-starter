class Boot {
  constructor(game) {
    this.game = game
  }

  preload() {
    this.game.load.spritesheet('ufo', 'assets/ufo.png', 96, 56, 3, 0, 1)
    this.game.load.image('cow', 'assets/cow.png')
  }

  create() {
    this.loadPlugins()
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.state.start('start')
  }

  // TODO: something cleaner like a Game class that would handle that
  loadPlugins() {
    const plugins = this.game.plugins

    if (Phaser.Plugin.Behavior)
      plugins.behavior = plugins.add(Phaser.Plugin.Behavior)

    if (Phaser.Plugin.Inspector)
      plugins.inspector = plugins.add(Phaser.Plugin.Inspector)
  }
}

export default Boot
