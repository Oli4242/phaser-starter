(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BehaviorPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var BehaviorSystem = require('behavior-system');
var NULL = undefined;

var Plugin = {

  VERSION: '1.1.0',

  init: function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this._system = new BehaviorSystem();
    this._filter = config.filter;
  },
  enable: function (gameObject) {
    var filter = this._filter;
    var enabled = false;

    if (filter !== NULL) {
      if (filter(gameObject) === true) {
        enabled = this._system.enable(gameObject);
      }
    } else {
      enabled = this._system.enable(gameObject);
    }

    if (enabled === true && gameObject.events !== NULL && gameObject.events.onDestroy !== NULL) {
      gameObject.events.onDestroy.add(this._onDestroyCallback, this._system);
    }

    return enabled;
  },
  disable: function (gameObject) {
    var removeListener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var disabled = this._system.disable(gameObject);
    if (disabled === true && removeListener === true) {
      if (gameObject.events !== NULL && gameObject.events.onDestroy !== NULL) {
        gameObject.events.onDestroy.remove(this._onDestroyCallback, this._system);
      }
    }
    return disabled;
  },
  preUpdate: function () {
    this._system.globalProcessAll('preUpdate', this.game, this.game.time.physicsElapsed);
  },
  update: function () {
    this._system.globalProcessAll('update', this.game, this.game.time.physicsElapsed);
    this._system.globalProcessAll('postUpdate', this.game, this.game.time.physicsElapsed);
  },
  render: function () {
    this._system.globalProcessAll('preRender', this.game);
    this._system.globalProcessAll('render', this.game);
  },
  postRender: function () {
    this._system.globalProcessAll('postRender', this.game);
  },
  _onDestroyCallback: function (gameObject) {
    this.disable(gameObject, false);
  }
};

if (window.Phaser) window.Phaser.Plugin.Behavior = Plugin;

module.exports = Plugin;
},{"behavior-system":3}],2:[function(require,module,exports){
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NULL = undefined; // never use "null"
var extend = require('./helper/extend');
var removeByIndex = require('./helper/remove-by-index');

function BehaviorContainer(gameObject, parent) {
  this.gameObject = gameObject;

  // store instances
  this._behaviorList = [];

  // use the 'key' to store the index of the instances
  this._behaviorMap = {};

  // store paused instances
  this._pausedBehaviors = {};

  this.parent = parent;
}

BehaviorContainer.prototype = {

  constructor: BehaviorContainer,

  index: NULL, // array index on system (defined by the system)

  set: function (key, behavior, options) {
    if (key.length === 0 || this.has(key)) return false;

    var ref = Object.create(behavior);
    if (behavior.options !== NULL) {
      ref.options = extend(extend({}, behavior.options), options);
    } else {
      ref.options = extend({}, options);
    }
    ref.options.$key = key;
    this._behaviorMap[key] = this._behaviorList.push(ref) - 1;

    if (ref.create !== NULL) this.process(key, 'create'

    // returns the key of newly created behavior instance
    );return key;
  },
  remove: function (key) {
    if (!this.has(key)) return false;

    var index = this._behaviorMap[key]; // array index of the key
    var list = this._behaviorList;
    var len = list.length;
    var ref = list[index];
    var last = list[list.length - 1];

    // call method 'destroy' before
    if (ref.destroy !== NULL) this.process(key, 'destroy');

    this._behaviorMap[key] = NULL;
    if (len !== 1 && index + 1 !== len) {
      this._behaviorMap[last.options.$key] = index;
    }
    removeByIndex(this._behaviorList, index

    // remove from paused list if necessary
    );this._pausedBehaviors[key] = NULL;

    return true;
  },
  removeAll: function () {
    var list = this._behaviorList;
    var len = list.length;

    if (len === 0) return;

    for (i = len - 1; i !== -1; --i) {
      this.remove(list[i].options.$key);
    }
  },
  has: function (key) {
    return this._behaviorMap[key] !== NULL;
  },
  pause: function (key) {
    if (this.has(key) && !this.isPaused(key)) {
      // process `paused` before pause the instance
      this.process(key, 'paused');
      this._pausedBehaviors[key] = true;
      return true;
    }
    return false;
  },
  pauseAll: function () {
    var list = this._behaviorList;
    var len = list.length;

    if (len === 0) return;

    for (var _i = 0; _i < len; ++_i) {
      this.pause(list[_i].options.$key);
    }
  },
  resume: function (key) {
    if (this.has(key) && this.isPaused(key)) {
      this._pausedBehaviors[key] = NULL;
      // process `resumed` after resume the instance
      this.process(key, 'resumed');
      return true;
    }
    return false;
  },
  resumeAll: function () {
    var list = this._behaviorList;
    var len = list.length;

    if (len === 0) return;

    for (var _i2 = 0; _i2 < len; ++_i2) {
      this.resume(list[_i2].options.$key);
    }
  },
  isPaused: function (key) {
    return this._pausedBehaviors[key] !== NULL;
  },
  process: function (key, methodName) {
    if (!this.has(key) || this.isPaused(key)) return;

    var index = this._behaviorMap[key];
    var ref = this._behaviorList[index];
    var method = ref[methodName];
    var gameObject = this.gameObject;
    var options = ref.options;
    var result = NULL;

    if (method !== NULL) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      switch (args.length) {
        case 0:
          result = method(gameObject, options);
          break;
        case 1:
          result = method(gameObject, options, args[0]);
          break;
        case 2:
          result = method(gameObject, options, args[0], args[1]);
          break;
        case 3:
          result = method(gameObject, options, args[0], args[1], args[2]);
          break;
        default:
          result = method.apply(NULL, [gameObject, options].concat(_toConsumableArray(args)));
          break;
      }
    }

    return result;
  },
  processAll: function (methodName) {
    var list = this._behaviorList;
    var len = list.length;

    if (len === 0) return;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    for (var _i3 = 0; _i3 < len; ++_i3) {
      this.process.apply(this, [list[_i3].options.$key, methodName].concat(_toConsumableArray(args)));
    }
  }
};

module.exports = BehaviorContainer;
},{"./helper/extend":4,"./helper/remove-by-index":5}],3:[function(require,module,exports){
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NULL = undefined; // never use "null"
var BehaviorContainer = require('./behavior-container');
var removeByIndex = require('./helper/remove-by-index');

function BehaviorSystem() {
  this._children = [];
}

BehaviorSystem.prototype = {

  constructor: BehaviorSystem,

  enable: function (gameObject) {
    if (gameObject.behaviors === NULL) {
      gameObject.behaviors = new BehaviorContainer(gameObject, this);
      gameObject.behaviors.index = this._children.push(gameObject.behaviors) - 1;
      return true;
    }
    return false;
  },
  disable: function (gameObject) {
    if (gameObject.behaviors !== NULL && gameObject.behaviors.parent === this) {
      gameObject.behaviors.removeAll();
      removeByIndex(this._children, gameObject.behaviors.index);
      gameObject.behaviors = NULL;
      return true;
    }
    return false;
  },
  globalProcessAll: function (methodName) {
    var list = this._children;
    var len = list.length;

    if (len === 0) return;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < len; i++) {
      var _list$i;

      (_list$i = list[i]).processAll.apply(_list$i, [methodName].concat(_toConsumableArray(args)));
    }
  }
};

module.exports = BehaviorSystem;
},{"./behavior-container":2,"./helper/remove-by-index":5}],4:[function(require,module,exports){
function extend(dest, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key];
    }
  }
  return dest;
}

module.exports = extend;
},{}],5:[function(require,module,exports){
// remove the element at 'index' and put the last element of array in the 'index' (if array.length > 1)
function removeByIndex(array, index) {
  var size = array.length;
  if (size === 0 || index >= size || index < 0) return;else if (size === 1 || index + 1 === size) return array.pop();

  var value = array[index];
  array[index] = array.pop();

  return value;
}

module.exports = removeByIndex;
},{}]},{},[1])(1)
});