var choo = require('choo')
var html = require('choo/html')
var devtools = require('choo-devtools')
var streamdata = require('../')

var url = 'https://www.reddit.com/r/random.json?obey_over18=true'
var key = 'ODRlZDNmYmUtMDAxZC00NWJmLTgwMzQtNTkzMWJiYjFhYjVj'

var app = choo()
app.use(devtools())
app.use(streamdata(url, key))
app.use(SSE)

app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <strong>random subreddit</strong>
      <p>${state.subreddit}</p>
    </body>
  `
}

function SSE (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    emitter.on('SSE:data', function (data) {
      console.log(data)
      state.subreddit = data.data.children[0].data.subreddit_name_prefixed
      emitter.emit('render')
    })
  })

  emitter.on('SSE:opened', function () {
    console.log('SSE opened')
  })

  emitter.on('SSE:error', function (err) {
    console.error(err)
  })

  emitter.on('SSE:patch', function () {})

  window.onunload = function () {
    emitter.emit('SSE:close')
  }
}