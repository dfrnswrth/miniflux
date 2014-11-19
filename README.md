miniflux
========

[![Build Status](https://travis-ci.org/dfrnswrth/miniflux.svg?branch=master)](https://travis-ci.org/dfrnswrth/miniflux)

**A Small Boilerplate-Free Flux(ish) Library for React Apps**

Overview
--------

`npm install --save miniflux`

Examples below assume browserify. `dist/` contains standalone builds if that's what you need.

Create a store with some initial state, and register any action handlers and callbacks.

```js
var Flux = require('miniflux');

var initialState = {foo: 'bar'};
var MyStore = Flux.Store(initialState)
  .registerHandler('myAction', handleAction)
  .registerHandler('anotherAction', [foo, bar, baz])
  .registerCallback(aCallback);

function handleAction() {
  // called when miniflux dispatches `myAction`
  // `this` is the instance of miniflux.Store
}

function aCallback() {
  // called after the store handles any action
  // before `miniflux.change` is emitted.
}
```

Then interact with the store in your React components:

```js
var Flux = require('miniflux');
var MyStore = require('./path/to/mystore');

var MyComponent = React.createClass({
  componentDidMount: function() {
    MyStore.on(Flux.change, this._changeListener);
  },
  anEventHandler: function() {
    Flux.Action('myAction');
  },
  _changeListener: function() {
    this.replaceState(MyStore.currentState());
  }
  // ...
});
```

API
---

### `miniflux.Store()`
Returns a store instance.
##### `#registerHandler(name, method)`
`name`: *string* name of action to handle    
`method`: *function of array of functions* that handle the action. Context is bound to the store instance being handled.

##### `#registerCallback(method)`
`method`: *function* called before each change event is emitted. Bound to the store context.

*note*: Action handlers and callbacks may be associated with multiple stores.

##### `#destroy()`
Removes the store from the miniflux registry.

### `miniflux.Action(action)`
Checks all stores for handlers assigned to `action`. If `action` is handled by a store, that stores callbacks (if any) are called, followed by the store emitting the `miniflux.change` event. Throws an error is nothing handles `action`.

LICENSE
-------
MIT
