/**
 *
 * Copyright 2015 Randal L Kamradt Sr.
 *
 * Memory Storage. Makes a shallow copy of all objects stored and returned
 * @module meta-data/mem-storage
 */
/**
 * A memory store API.
 * @param  {Object} model    The model description
 * @return {Object}          The API Object
 */
module.exports = function(model) {
  return {
    '_model': model,
    '_key': model.getKey(),
    '_data': [],
    '_clone': function(obj) {
      var ret = {};
      for(var propName in obj) {
        ret[propName] = obj[propName];
      }
      return ret;
    },
    /**
     * load an array of data into a store
     * @param  {Array}   data    The data to load
     * @param  {Function} done The callback when done
     */
    'load': function(data, done) {
      for(var i = 0; i < data.length; i++) {
        this._data.push(this._clone(data[i]));
      }
      done();
    },
    /**
     * add an item to the store
     * @param  {Object}   data    The item to store
     * @param  {Function} done The callback when done
     */
    'add': function(data, done) {
      this._data.push(this._clone(data));
      var ret = this._data.length;
      done(null, ret);
    },
    /**
     * update an item in the store
     * @param  {Object}   data    The item to update
     * @param  {Function} done The callback when done
     */
    'update': function(data, done) {
      if(!this._key) {
        done('no key found for metadata');
        return;
      }
      var key = data[this._key.getName()];
      var ix = -1;
      for(var i = 0; i < this._data.length; i++) {
        if(this._data[i][this._key.getName()] === key) {
          ix = i;
          break;
        }
      }
      if(ix === -1) {
        this._data.push(this._clone(data));
      } else {
        this._data[ix] = this._clone(data);
      }
      done(null);
    },
    /**
     * return the entire store as an Array
     * @param  {Function} done The callback when done
     */
    'findAll': function(done) {
      var ret = this._data.concat([]); // make a shallow copy
      for(var i = 0; i < ret.length; i++) {
        ret[i] = this._clone(ret[i]);
      }
      done(null, ret);
    },
    /**
     * return an item by id
     * @param  {String}   key  The key value
     * @param  {Function} done The callback when done
     */
    'find': function(key, done) {
      if(!this._key) {
        done('no key found for metadata');
        return;
      }
      var ret = null; // if not found return null
      for(var i = 0; i < this._data.length; i++) {
        if(this._data[i][this._key.getName()] === key) {
          ret = this._clone(this._data[i]);
          break;
        }
      }
      done(null, ret);
    },
    /**
     * Remove an item by key
     * @param  {String}   key  The key value
     * @param  {Function} done The callback when done
     */
    'remove': function(key, done) {
      if(!this._key) {
        done('no key found for metadata');
        return;
      }
      var ret = null; // if not found, do nothing and return null
      for(var i = 0; i < this._data.length; i++) {
        if(this._data[i][this._key.getName()] === key) {
          ret = this._data.splice(i, 1)[0];
          break;
        }
      }
      done(null, ret);
    }
  };
};
