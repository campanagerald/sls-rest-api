const middy = require('middy');
const { cors, jsonBodyParser, doNotWaitForEmptyEventLoop, httpEventNormalizer } = require('middy/middlewares');

module.exports = handler => middy(handler)
  .use(cors())
  .use(jsonBodyParser())
  .use(httpEventNormalizer())
  .use(doNotWaitForEmptyEventLoop())