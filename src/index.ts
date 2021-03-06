/**
 * Module dependencies.
 */

import numeral = require('numeral')

/**
 * Expose logger.
 */

module.exports = dev

/**
 * Color map.
 */

const colors = {
  5: 31,
  4: 33,
  3: 36,
  2: 32,
  1: 32
}

/**
 * Development logger.
 */

function dev (opts: any) {
  opts = opts || {}
  const logger = opts.logger || require('riverpig')('koa')

  /**
   * Log helper.
   */
  function log (ctx: any, start: any, len: number | null, err: any, event?: any) {
    // get the status code of the response
    const status = err
      ? (err.status || 500)
      : (ctx.status || 404)

    // set the color of the status code
    const s = status / 100 | 0
    const c = colors[s]

    // get the human readable response length
    let length: string
    if ([204, 205, 304].indexOf(status) !== -1) {
      length = ''
    } else if (null == len) {
      length = '-'
    } else {
      length = numeral(len).format('0[.]0b')
    }

    const upstream = err ? '\x1B[31mxxx'
      : event === 'close' ? '\x1B[33m-x-'
      : '\x1B[90m-->'

    logger.info(
      upstream + ' \x1B[;1m%s\x1B[0;90m %s \x1B[' + c + 'm%s\x1B[90m %s %s\x1B[0m',
      ctx.method,
      ctx.originalUrl,
      status,
      time(start),
      length
    )
  }

  return async function logMiddleware (ctx: any, next: Function) {
    // request
    const start = Date.now()

    if (ctx.res) {
      logger.info('\x1B[90m<-- \x1B[;1m%s\x1B[0;90m %s\x1B[0m', ctx.method, ctx.url)
    } else {
      // Request has no response, e.g. koa-websocket
      logger.info('\x1B[90m<-| \x1B[;1m%s\x1B[0;90m %s\x1B[0m', ctx.method, ctx.url)
    }

    try {
      await next()
    } catch (err) {
      // log uncaught downstream errors
      log(ctx, start, null, err)
      throw err
    }

    // log when the response is finished or closed,
    // whichever happens first.
    const res = ctx.res

    if (!res) return

    const done = (event: any) => {
      res.removeListener('finish', onfinish)
      res.removeListener('close', onclose)
      log(ctx, start, ctx.length, null, event)
    }

    const onfinish = done.bind(null, 'finish')
    const onclose = done.bind(null, 'close')

    res.once('finish', onfinish)
    res.once('close', onclose)
  }
}

/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

function time (start: number) {
  const delta = Date.now() - start
  return delta < 10000
    ? numeral(delta).format('0,0') + 'ms'
    : numeral(Math.round(delta / 1000)).format('0,0') + 's'
}
