const http = require('http');
const data = JSON.stringify({ email: 'test@example.com', password: 'x' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};
const req = http.request(options, res => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', chunk => process.stdout.write(chunk));
});
req.on('error', err => {
  console.error('ERROR', err.message);
  process.exit(1);
});
req.write(data);
req.end();
