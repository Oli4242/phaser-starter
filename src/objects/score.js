export default class Score extends Phaser.GameObjects.Text {
  constructor (scene, x, y) {
    super(scene, x, y, 'Score: 0', { fontSize: '32px', fill: '#00' })
    this.score = 0
  }

  addScore (value) {
    this.score += value
    this.setText('Score: ' + this.score)
  }
}
