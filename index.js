var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

function errorIf(condition, message) {
  if (condition) {
    throw new Error(message);
  }
}

var Store = function(state, changeEvent) {
  var store = assign({}, EventEmitter.prototype, {
    handlers: {},
    callbacks: [],
    state: state,
    changeEvent: changeEvent || CHANGE_EVENT,
    registerHandler: function(name, method) {
      errorIf(!method, 'Handlers must have a function');
      errorIf(this.handlers[name], 'Handler already defined on this store for ' + name);
      this.handlers[name] = typeof method === 'function' ? [method] : method;
      return this;
    },
    registerCallback: function(method) {
      errorIf(!method, 'Callbacks must have a function');
      this.callbacks.push(method);
      return this;
    },
    currentState: function() {
      return this.state;
    },
    emitChange: function() {
      this.emit(this.changeEvent);
    },
    destroy: function() {
      Miniflux._stores = Miniflux._stores.splice(1, storeIndex);
    }
  });
  var storeIndex = Miniflux._stores.push(store);
  return store;
};

var Action = function(action) {
  var args = Array.prototype.slice.call(arguments, 1);
  var handled = false;
  Miniflux._stores.forEach(function(store) {
    if (store.handlers[action]) {
      var shouldEmit = true;
      handled = true;
      store.handlers[action].forEach(function(h) {
        shouldEmit = shouldEmit !== false ? h.apply(store, args) : false;
      });
      store.callbacks.forEach(function(cb) {
        shouldEmit = shouldEmit !== false ? cb.apply(store) : false;
      });
      if (shouldEmit !== false) {
        store.emitChange();
      }
    }
  });
  errorIf(!handled, 'Nothing handled this action: ' + action);
};

var Miniflux = {
  change: CHANGE_EVENT,
  Store: Store,
  Action: Action,
  _stores: []
};

module.exports = Miniflux;
