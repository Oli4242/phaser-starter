import Sky from '../assets/sky.png'
import Ground from '../assets/platform.png'
import Star from '../assets/star.png'
import Bomb from '../assets/bomb.png'
import Dude from '../assets/dude.png'

export default class Boot extends Phaser.Scene {
  constructor () { super('Loading') }

  preload () {
    this.loadingBar()
    this.load.image('sky', Sky)
    this.load.image('ground', Ground)
    this.load.image('star', Star)
    this.load.image('bomb', Bomb)
    this.load.spritesheet('dude', Dude, { frameWidth: 32, frameHeight: 48 })
  }

  create () {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.start('Play')
  }

  loadingBar () {
    const { width, height } = this.cameras.main
    const thickness = 2
    const top = height / 2 - thickness / 2

    const message = this.add.text(0, top, 'Loading...').setOrigin(0, 1)

    this.tweens.add({
      targets: message,
      alpha: 0,
      duration: 750,
      yoyo: true,
      loop: -1
    })

    const progress = this.add.graphics()

    this.load.on('progress', function (value) {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, top, width * value, thickness)
    })
  }
}
