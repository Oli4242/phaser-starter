(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BehaviorPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global Phaser */
'use strict'

var BehaviorSystem = require('behavior-system')

var plugin = function (game, parent) {
  Phaser.Plugin.call(this, game, parent)
  this._system = new BehaviorSystem()
}

plugin.prototype = Object.create(Phaser.Plugin)

plugin.prototype.enable = function (gameObject) {
  this._system.enable(gameObject)
}

plugin.prototype.disable = function (gameObject) {
  this._system.disable(gameObject)
}

plugin.prototype.preUpdate = function () {
  this._system.processAll('preUpdate')
}

plugin.prototype.update = function () {
  this._system.processAll('update')
}

plugin.prototype.render = function () {
  this._system.processAll('render')
}

plugin.prototype.postRender = function () {
  this._system.processAll('postRender')
}

if (window.Phaser) window.Phaser.Plugin.Behavior = plugin

module.exports = plugin

},{"behavior-system":3}],2:[function(require,module,exports){
var NULL // never use "null"
var extend = require('./helper/extend')
var Recycler = require('./helper/recycler')

function BehaviorContainer (gameObject) {
  this._constructor(gameObject)
}

BehaviorContainer.prototype = {

  _constructor: function (gameObject) {
    this.gameObject = gameObject
    this._behaviorList = new Recycler() // store instances
    this._behaviorMap = {} // store indexes
    return this
  },

  set: function (key, behavior, options) {
    if (this.has(key)) throw new Error('"' + key + '" already in use')
    else if (behavior === NULL) throw new Error('invalid behavior')

    var ref = Object.create(behavior)
    var defaults = extend({}, behavior.options)

    ref.options = extend(defaults, options)
    ref.options.$key = key

    this._behaviorMap[key] = this._behaviorList.getNextIndex()
    this._behaviorList.push(ref)

    if (ref.create !== NULL) ref.create(this.gameObject, ref.options)

    return ref
  },

  remove: function (key) {
    var index = this._behaviorMap[key]
    if (index >= 0) {
      var ref = this._behaviorList.iterable[index]
      if (ref.destroy !== NULL) ref.destroy(this.gameObject, ref.options)
      this._behaviorMap[key] = NULL
      this._behaviorList.remove(index)
    }
  },

  has: function (key) {
    return this._behaviorMap[key] !== NULL
  },

  get: function (key) {
    var index = this._behaviorMap[key]
    return index >= 0 ? this._behaviorList.iterable[index] : NULL
  },

  process: function (methodName) {
    var i = 0
    var list = this._behaviorList.iterable
    var len = list.length
    for (; i < len; i++) {
      var ref = list[i]
      if (ref !== NULL && typeof ref[methodName] === 'function') {
        ref[methodName](this.gameObject, ref.options)
      }
    }
    return this
  }

}

module.exports = BehaviorContainer

},{"./helper/extend":4,"./helper/recycler":5}],3:[function(require,module,exports){
var NULL // never use "null"
var BehaviorContainer = require('./behavior-container')
var Recycler = require('./helper/recycler')

function BehaviorSystem () {
  this._constructor()
}

BehaviorSystem.prototype = {

  _constructor: function () {
    this._children = new Recycler()
    return this
  },

  enable: function (gameObject) {
    if (gameObject.behaviors === NULL) {
      var container = new BehaviorContainer(gameObject)
      var index = this._children.getNextIndex()
      container.id = index
      this._children.push(container)
      gameObject.behaviors = container
    }
    return gameObject
  },

  disable: function (gameObject) {
    if (gameObject.behaviors !== NULL) {
      this._children.remove(gameObject.behaviors.id)
      gameObject.behaviors = NULL
    }
    return gameObject
  },

  processAll: function (methodName) {
    var i = 0
    var list = this._children.iterable
    var len = list.length
    for (; i < len; i++) {
      var child = list[i]
      if (child !== NULL) child.process(methodName)
    }
  }
}

module.exports = BehaviorSystem

},{"./behavior-container":2,"./helper/recycler":5}],4:[function(require,module,exports){
function extend (dest, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key]
    }
  }
  return dest
}

module.exports = extend

},{}],5:[function(require,module,exports){
var NULL // never use "null"

/*
 * Used to track avaliable empry spaces in an array
*/
function Recycler (arr) {
  this._constructor(arr)
}

Recycler.prototype = {

  _constructor: function (arr) {
    this.iterable = Array.isArray(arr) ? arr.slice() : []
    this._recycledIndexes = []
    return this
  },

  push: function (value) {
    if (value === NULL) return new TypeError('undefined value')
    this._set(value)
    return this.iterable.length
  },

  remove: function (index) {
    if (index === NULL || index >= this.iterable.length || index < 0) throw new Error('invalid index')
    var value

    if (index === (this.iterable.length - 1)) {
      value = this.pop()
    } else {
      value = this.iterable[index]
      this.iterable[index] = NULL
      this._recycleIndex(index)
    }

    return value
  },

  pop: function () {
    return this.iterable.pop()
  },

  getNextIndex: function () {
    var recycled = this._recycledIndexes
    var len = recycled.length
    return len > 0 ? recycled[len - 1] : this.iterable.length
  },

  _set: function (value) {
    var index = this._recycledIndexes.pop()
    if (index === NULL) index = this.iterable.length
    this.iterable[index] = value
  },

  _recycleIndex: function (index) {
    this._recycledIndexes.push(index)
  }
}

module.exports = Recycler

},{}]},{},[1])(1)
});