const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../src/app');

test('GET /api/status returns a successful response', async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/status`);

    assert.equal(response.status, 200);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
