// Register a game object factory for a given class
// using either Class.factoryFunction() or generating a factory function
export default function createFactory (factoryName, Class) {
  const factoryFunction = Class.factoryFunction || genericFactoryFunction(Class)
  Phaser.GameObjects.GameObjectFactory.register(factoryName, factoryFunction)
}

// Returns a generic factory function for the given class
function genericFactoryFunction (Class) {
  return function (x, y, ...options) {
    return this.scene.add.existing(new Class(this.scene, x, y, ...options))
  }
}
