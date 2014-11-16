var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

var Store = function(state) {
  var store = assign({}, EventEmitter.prototype, {
    handlers: {},
    callbacks: [],
    state: state,
    registerHandler: function(name, method) {
      if (!method) {
        throw new Error('Handlers must have a function');
      }
      if (this.handlers[name]) {
        throw new Error('Handler already defined on this store for ' + name);
      }
      this.handlers[name] = typeof method === 'function' ? [method] : method;
      return this;
    },
    registerCallback: function(method) {
      if (!method) {
        throw new Error('Callbacks must have a function');
      }
      this.callbacks.push(method);
      return this;
    },
    currentState: function() {
      return this.state;
    },
    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },
    destroy: function() {
      Influx._stores = Influx._stores.splice(1, storeIndex);
    }
  });
  var storeIndex = Influx._stores.push(store);
  return store;
};

var Action = function(action) {
  var args = Array.prototype.slice.call(arguments, 1);
  var handled = false;
  Influx._stores.forEach(function(store) {
    if (store.handlers[action]) {
      handled = true;
      store.handlers[action].forEach(function(h) { h.apply(store, args); });
      store.callbacks.forEach(function(cb) { cb(); });
      store.emitChange();
    }
  });
  if (!handled) {
    throw new Error('Nothing handled this action: ' + action);
  }
};

var Influx = {
  change: CHANGE_EVENT,
  Store: Store,
  Action: Action,
  _stores: []
};

module.exports = Influx;
