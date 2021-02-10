// Register a game object factory for every class given
export default function registerFactoryFor (...classes) {
  classes.forEach(Class => {
    const factoryName = Class.name[0].toLowerCase() + Class.name.slice(1)
    const factoryFunction = Class.factoryFunction || genericFactoryFunction(Class)
    Phaser.GameObjects.GameObjectFactory.register(factoryName, factoryFunction)
  })
}

// Returns a generic factory function for the given class
function genericFactoryFunction (Class) {
  return function (x, y) {
    return this.scene.add.existing(new Class(this.scene, x, y))
  }
}
