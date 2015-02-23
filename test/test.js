var should = require('should');
var sinon = require('sinon');
var Miniflux = require('../');

describe('Miniflux', function() {
  var store;
  afterEach(function() {
    store.destroy();
  });
  it('has no default state', function() {
    store = Miniflux.Store();
    should(store).have.property('state');
    should(store.state).not.be.ok;
  });
  it('has no default handlers', function() {
    store = Miniflux.Store();
    should(store).have.property('handlers');
    should(store.handlers).eql({});
  });
  it('has no default callbacks', function() {
    store = Miniflux.Store();
    should(store).have.property('callbacks');
    should(store.callbacks.length).equal(0);
  });
  it('accepts and returns state', function() {
    store = Miniflux.Store({foo: 'bar'});
    should(store.state).be.ok;
    should(store.state.foo).equal('bar');
    should(store.currentState()).eql({foo: 'bar'});
  });
  it('stores handle actions and callbacks', function() {
    store = Miniflux.Store({foo: 'bar'});
    var fooHandler = sinon.spy();
    var callback = sinon.spy();
    store.registerHandler('fooAction', fooHandler);
    store.registerCallback(callback);
    Miniflux.Action('fooAction');
    should(fooHandler.called).be.true;
    should(callback.called).be.true;
  });
  it('callbacks and handlers are bound to the store context', function() {
    store = Miniflux.Store({foo: 'bar'});
    var fooHandler = function() {
      should(this).eql(store);
    };
    var callback = function() {
      should(this).eql(store);
    };
    store.registerHandler('fooAction', fooHandler);
    store.registerCallback(callback);
    Miniflux.Action('fooAction');
  });
  it('registerCallback is chainable', function() {
    store = Miniflux.Store({foo: 'bar'});
    var fooHandler1 = sinon.spy();
    var fooHandler2 = sinon.spy();
    store.registerHandler('fooAction1', fooHandler1)
      .registerHandler('fooAction2', fooHandler2);
    Miniflux.Action('fooAction1');
    Miniflux.Action('fooAction2');
    should(fooHandler1.called).be.true;
    should(fooHandler2.called).be.true;
  });
  it('emits a change event', function() {
    store = Miniflux.Store({foo: 'bar'});
    var eventListener = sinon.spy();
    store.on(Miniflux.change, eventListener)
    var fooHandler = sinon.spy();
    store.registerHandler('fooAction', fooHandler);
    Miniflux.Action('fooAction');
    should(eventListener.called).be.true;
  });
  it('can emit a custom change event', function() {
    store = Miniflux.Store({foo: 'bar'}, 'customChange');
    var eventListener = sinon.spy();
    store.on('customChange', eventListener)
    var fooHandler = sinon.spy();
    store.registerHandler('fooAction', fooHandler);
    Miniflux.Action('fooAction');
    should(eventListener.called).be.true;
  });
  it('doesn\'t emit if a handler returns false', function() {
    store = Miniflux.Store({foo: 'bar'}, 'customChange');
    var spy = sinon.spy();
    var eventListener = function() {
      spy();
      return false;
    };
    store.on('customChange', eventListener)
    var fooHandler = sinon.spy();
    store.registerHandler('fooAction', fooHandler);
    Miniflux.Action('fooAction');
    should(eventListener.called).not.be.true;
  });
  it('change events emitted only once', function() {
    store = Miniflux.Store({foo: 'bar'});
    var eventListener = sinon.spy();
    store.on(Miniflux.change, eventListener)
    var handler1 = sinon.spy();
    var handler2 = sinon.spy();
    var handler3 = sinon.spy();
    store.registerHandler('handled', [handler1, handler2, handler3])
    Miniflux.Action('handled');
    should(eventListener.called).be.true;
    should(eventListener.calledOnce).be.true;
  });
});
