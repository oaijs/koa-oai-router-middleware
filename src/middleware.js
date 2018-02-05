const _ = require('lodash');
const assert = require('assert');
const compose = require('koa-compose');
const path = require('path');
const Router = require('koa-oai-router');
const debug = require('debug')('koa-oai-router:middleware');

const { Plugin } = Router;

class MiddlewarePlugin extends Plugin {
  constructor(args) {
    super(args);

    this.args = args;
    this.pluginName = 'middleware';
    this.field = ['x-oai-middleware', 'x-middleware', 'x-oai-controller', 'x-controller'];
  }

  async handler(docOpts) {
    const {
      endpoint,
      field,
      fieldValue,
      operation,
      operationValue,
    } = docOpts;

    const handlers = [];
    _.each(fieldValue, (data) => {
      handlers.push(this.loadHandler(data));
    });

    return compose(handlers);
  }

  loadHandler({ file, handler }) {
    if (!file || !handler) throw new Error('invalid file and handler setted.');

    const { args } = this;
    let middlewareDir = '';

    if (_.isString(args)) {
      middlewareDir = args;
    } else if (_.isPlainObject(args)) {
      middlewareDir = args.middlewareDir || args.dir || args.middleware;
    } else {
      throw Error(`args must be string or object, not ${typeof args}`);
    }

    const modulePath = path.resolve(middlewareDir, file);
    const module = require(modulePath);

    debug('load from:', modulePath);
    debug('middleware:', handler);

    assert(module, 'middleware file not exists!');
    assert(_.isFunction(module[handler]), `module [${modulePath}] has no function [${handler}]!`);

    return module[handler];
  }
}

module.exports = MiddlewarePlugin;
