# Koa Riverpig

[![npm][npm-image]][npm-url] [![CircleCI][circle-image]][circle-url] [![Codecov][codecov-image]][codecov-url]

[npm-image]: https://img.shields.io/npm/v/koa-riverpig.svg?style=flat
[npm-url]: https://npmjs.org/package/koa-riverpig
[circle-image]: https://circleci.com/gh/justmoon/koa-riverpig.svg?style=shield
[circle-url]: https://circleci.com/gh/justmoon/koa-riverpig
[codecov-image]: https://codecov.io/gh/justmoon/koa-riverpig/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/justmoon/koa-riverpig

> Koa middleware for logging requests via [riverpig](https://github.com/justmoon/riverpig)

## Installation

``` sh
npm install --save koa-riverpig
```

## Usage
``` js
// ...

koaApp.use(require('koa-riverpig')({ logger: modules.log.create('koa') }))
```
