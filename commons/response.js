module.exports = (statusCode, body, headers) => {
  return {
    statusCode: statusCode || 500,
    body: typeof body == 'string' ? body : JSON.stringify(body),
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  }
}