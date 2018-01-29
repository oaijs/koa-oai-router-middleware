const _ = require('lodash');
const assert = require('assert');
const compose = require('koa-compose');
const path = require('path');
const Router = require('koa-oai-router');

const { Plugin } = Router;

function loadHandler({ file, handler }, middlewareArgs) {
  if (!file || !handler) throw new Error('invalid file and handler setted.');

  let middlewareDir = '';
  if (_.isString(middlewareArgs)) {
    middlewareDir = middlewareArgs;
  } else if (_.isPlainObject(middlewareArgs)) {
    middlewareDir = middlewareArgs.middlewareDir || middlewareArgs.dir || middlewareArgs.middleware;
  } else {
    throw Error('middlewareArgs must be string or object');
  }

  const modulePath = path.resolve(middlewareDir, file);
  const module = require(modulePath);

  assert(module, 'middleware file not exists!');
  assert(_.isFunction(module[handler]), `module [${modulePath}] has no function [${handler}]!`);

  return module[handler];
}

/**
 * Load middleware(s) of the endpoint and mount to router.
 *
  ```yaml
  paths:
    /pets/{id}:
      get:
       x-oai-middleware:
          - file: user
            handler: isLogined
          - file: store
            handler: getPetById
  ```
 * x-oai-middleware is the field to watch. the value is an array, we will mount to router
 * with the sort. file is the handler's relative path of the options middlewareDir. handler
 * is an exported koa middleware to handle you business.
 *
 * @param {string} endpoint, the matched api endpoint
 * @param {string} field, filed name
 * @param {object} fieldValue, data of the field in api doc
 * @param {string} operation, operation of the matched  api endpoint
 * @param {object} operationValue, data of the whole endpoint of with the operation
 * @returns {function} koa middleware
 */
function middlewareWrapper(middlewareOpts, middlewareArgs) {
  const {
    endpoint,
    field,
    fieldValue,
    operation,
    operationValue,
  } = middlewareOpts;

  const handlers = [];
  _.each(fieldValue, (data) => {
    handlers.push(loadHandler(data, middlewareArgs));
  });

  return compose(handlers);
}

/**
 * Middleware loader
 * @param {object|string} args
 * args {string} load from args
 * args {object} load from args.middlewareDir or args.dir or args.middleware
 */
module.exports = (args) => {
  return new Plugin({
    name: 'middleware',
    field: ['x-oai-middleware', 'x-middleware', 'x-oai-controller', 'x-controller'],
    middlewareWrapper,
    middlewareArgs: args,
  });
};
