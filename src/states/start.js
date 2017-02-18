import addUfo from '../entities/ufo'
import addCow from '../entities/cow'

class Start {
  constructor(game) {
    this.game = game
  }

  create() {
    this.ufo = addUfo(this.game, 300, 200)
    this.cows = this.game.add.physicsGroup()

    for (let i = 0; i < 10; i += 1) {
      this.cows.add(addCow(
        this.game,
        Math.random() * 800,
        Math.random() * 600
      ))
    }

    this.game.add.existing(this.ufo)
  }

  update() {
    this.game.physics.arcade.overlap(this.ufo, this.cows)
  }
}

export default Start
