var Orientation = require('react-native').NativeModules.Orientation;
var DeviceEventEmitter = require('react-native').DeviceEventEmitter;

var listeners = {};
var orientationDidChangeEvent = 'orientationDidChange';
var specificOrientationDidChangeEvent = 'specificOrientationDidChange';

var id = 0;
var META = '__listener_id';

function getKey(listener) {
  if (!listener.hasOwnProperty(META)) {
    if (!Object.isExtensible(listener)) {
      return 'F';
    }

    Object.defineProperty(listener, META, {
      value: 'L' + ++id,
    });
  }

  return listener[META];
}

module.exports = {
  getOrientation(cb) {
    Orientation.getOrientation((error, orientation) => {
      cb(error, orientation);
    });
  },

  getSpecificOrientation(cb) {
    Orientation.getSpecificOrientation((error, orientation) => {
      cb(error, orientation);
    });
  },

  lockToPortrait() {
    this._isLocked = true;
    Orientation.lockToPortrait();
  },

  lockToLandscape() {
    // this._isLocked = true; // Not actually true, since here we allow both landscape orientations
    Orientation.lockToLandscape();
  },

  lockToLandscapeRight() {
    this._isLocked = true;
    Orientation.lockToLandscapeRight();
  },

  lockToLandscapeLeft() {
    this._isLocked = true;
    Orientation.lockToLandscapeLeft();
  },

  lockToPortraitUpsideDown() {
    this._isLocked = true;
    Orientation.lockToPortraitUpsideDown();
  },

  unlockAllOrientations() {
    this._isLocked = false;
    Orientation.unlockAllOrientations();
  },

  addOrientationListener(cb) {
    var key = getKey(cb);
    listeners[key] = DeviceEventEmitter.addListener(
      orientationDidChangeEvent,
      body => {
        if (!this._isLocked) cb(body.orientation);
      }
    );
  },

  removeOrientationListener(cb) {
    var key = getKey(cb);

    if (!listeners[key]) {
      return;
    }

    listeners[key].remove();
    listeners[key] = null;
  },

  addSpecificOrientationListener(cb) {
    var key = getKey(cb);

    listeners[key] = DeviceEventEmitter.addListener(
      specificOrientationDidChangeEvent,
      body => {
        cb(body.specificOrientation);
      }
    );
  },

  removeSpecificOrientationListener(cb) {
    var key = getKey(cb);

    if (!listeners[key]) {
      return;
    }

    listeners[key].remove();
    listeners[key] = null;
  },

  getInitialOrientation() {
    return Orientation.initialOrientation;
  },
};
