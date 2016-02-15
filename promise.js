"use strict";

const PENDING = 0, FULFILLED = 1, REJECTED = 2;

class Promise {
  constructor(fn) {
    this.state = PENDING;

    this.fulfillmentHandlers = [];
    this.rejectionHandlers = [];

    const fulfill = value => {
      this.state = FULFILLED;
      this.value = value;
      this.fulfillmentHandlers.forEach(handler => handler(this.value));
    };

    const reject = value => {
      this.state = REJECTED;
      this.value = value;
          this.rejectionHandlers.forEach(handler => handler(this.value));
    };

    const resolve = valueOrPromise => {
      if (!Promise.isPromise(valueOrPromise)) {
        return fulfill(valueOrPromise);
      }
      return valueOrPromise.then(resolve, reject);
    };

    fn(resolve, reject);
  }

  done(onFulfilled, onRejected) {
    if (this.state === PENDING) {
      this.fulfillmentHandlers.push(onFulfilled);
      this.rejectionHandlers.push(onRejected);
    } else {
      if (this.state === FULFILLED &&
          typeof onFulfilled === "function") {
        setTimeout(() => onFulfilled(this.value));
      }
      if (this.state === REJECTED &&
          typeof onRejected === "function") {
        setTimeout(() => onRejected(this.value));
      }
    }
  }

  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      const handleFulfillment = value => {
        if (typeof onFulfilled !== "function") {
          return resolve(value);
        }

        try {
          return resolve(onFulfilled(value));
        } catch (ex) {
          return reject(ex);
        }
      };

      const handleRejection = value => {
        if (typeof onRejected !== "function") {
          return reject(value);
        }

        try {
          return resolve(onRejected(value));
        } catch (ex) {
          return reject(ex);
        }
      };

      return this.done(handleFulfillment, handleRejection);
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

Promise.isPromise = maybePromise => (
  maybePromise && typeof maybePromise.then === "function"
);
Promise.resolve = value => new Promise(resolve => resolve(value));
Promise.reject = value => new Promise((resolve, reject) => reject(value));

module.exports = Promise;
