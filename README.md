# Koa-OAI-Router-Middleware

[license-img]: http://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT

[node-image]: https://img.shields.io/badge/node.js-v6.0.0-blue.svg
[node-url]: http://nodejs.org/download/

[npm-img]: https://img.shields.io/npm/v/koa-oai-router-middleware.svg
[npm-url]: https://npmjs.org/package/koa-oai-router-middleware

[travis-img]: https://travis-ci.org/oaijs/koa-oai-router-middleware.svg
[travis-url]: https://travis-ci.org/oaijs/koa-oai-router-middleware

[coveralls-img]: https://coveralls.io/repos/github/oaijs/koa-oai-router-middleware/badge.svg
[coveralls-url]: https://coveralls.io/github/oaijs/koa-oai-router-middleware

[downloads-image]: https://img.shields.io/npm/dm/koa-oai-router-middleware.svg
[downloads-url]: https://npmjs.org/package/koa-oai-router-middleware

[david-img]: https://img.shields.io/david/oaijs/koa-oai-router-middleware.svg
[david-url]: https://david-dm.org/oaijs/koa-oai-router-middleware

[router]: https://github.com/BiteBit/koa-oai-router

[![License][license-img]][license-url]
[![Node Version][node-image]][node-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

Middleware loader plugin [koa-oai-router][router]

# Installation
```bash
npm i koa-oai-router-middleware --save
```

# Info
|field|type|info|
|---|---|---|
|plugin class|`string`|`MiddlewarePlugin`|
|plugin name|`string`|`middleware`|
|evoked fields|`string`\|[`string`]| `x-oai-middleware`, `x-middleware`, `x-oai-controller`, `x-controller`|
|evoked fileds value|`[{file,handler}]`|`file` is relative file path of middleware , `handler` is name of middleware exported|
|options|`string`\|`object`| if options is `string`, effect same as object contains `dir`, `middlewareDir` and `middleware`.|

# Usage
In this example, we will load middlewares from `./controllers` directory and recognize the value of `x-oai-middleware` then bind them to a api.

```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const MiddlewarePlugin = require('koa-oai-router-middleware');

const app = new Koa();
const router = new Router({
  apiDoc: './api',
  options: {
    middleware: './controllers',
    // OR
    MiddlewarePlugin: './controllers',
  },
});

router.mount(MiddlewarePlugin);

app.use(bodyParser());
app.use(router.routes());
```

```yaml
# ./api/paths/pets.yaml

/pets:
  get:
    description: "Returns all pets from the system that the user has access to"
    x-oai-middleware:
      - file: pets
        handler: get
    parameters:
      - name: "tags"
        in: "query"
        description: "tags to filter by"
        required: false
        type: "array"
        items:
          type: "string"
        collectionFormat: "csv"
      - name: "limit"
        in: "query"
        description: "maximum number of results to return"
        required: false
        type: "integer"
        format: "int32"
    responses:
      "200":
        description: "pet response"
        schema:
          type: "array"
          items:
            $ref: "#/definitions/Pet"
```
