import Bomb from '../objects/bomb'
import Star from '../objects/star'

export default class Play extends Phaser.Scene {
  constructor () { super('Play') }

  create () {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)

    const platforms = this.physics.add.staticGroup()
    platforms.create(400, 568, 'ground').setScale(2).refreshBody()
    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    this.player = this.add.player(100, 450)

    this.stars = this.add.group({
      classType: Star,
      key: Star,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    })

    this.bombs = this.add.group({ classType: Bomb, key: Bomb })

    this.score = this.add.score(16, 16)

    this.physics.add.collider(this.player, platforms)
    this.physics.add.collider(this.stars, platforms)
    this.physics.add.collider(this.bombs, platforms)
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this)
  }

  collectStar (player, star) {
    star.collect()
    this.score.addScore(10)

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(child => child.reset())

      const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
      this.bombs.create(x, 16)
    }
  }

  hitBomb (player, bomb) {
    this.physics.pause()
    player.die()
  }
}
