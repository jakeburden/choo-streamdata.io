var assert = require('nanoassert')
var streamdata = require('streamdata.io-events')

module.exports = choo_streamdata

var events = choo_streamdata.events = {
  OPENED: 'SSE:opened',
  OPEN: 'SSE:open',
  CLOSE: 'SSE:close',
  DATA: 'SSE:data',
  PATCH: 'SSE:patch',
  ERROR: 'SSE:error'
}

function choo_streamdata (url, key, headers) {
  assert(typeof url, 'string', 'choo-streamdata.io: url should be a string')
  assert(typeof key, 'string', 'choo-streamdata.io: key should be a string')
  if (headers) assert(Array.isArray(headers), 'true', 'choo-streamdata.io: headers should be an array')

  return function (state, emitter) {
    var SSE = streamdata(url, key, headers)

    SSE
      .on('opened', function () {
        emitter.emit(events.OPENED)
      })
      .on('data', function (data) {
        emitter.emit(events.DATA, data)
      })
      .on('patch', function (patch) {
        emitter.emit(events.PATCH, patch)
      })
      .on('error', function (err) {
        emitter.emit(events.ERROR, err)
      })

    emitter.on(events.OPEN, function () {
      SSE.emit('open')
    })

    emitter.on(events.CLOSE, function () {
      SSE.emit('close')
    })
  }
}