const Collectable = {
  options: { onCollection: null },

  create(object, options) {
    const body = object.body

    if (!body.onOverlap)
      body.onOverlap = new Phaser.Signal()

    if (options.onCollection)
      body.onOverlap.add(options.onCollection)
  }
}

export default Collectable
