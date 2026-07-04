// http
// CJS common js, ESM
// import export
// require, module.exports =
// require('./a');
const http = require('http');

// callback function
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  if (req.url === '/') {
    res.end('<h1>Home</h1>');
    return;
  } else if (req.url === '/about') {
    res.end('<h1>ABout</h1>');
    return;
  }

  res.end('hello world!!!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// package, library, module
// built-in, external -> npm install
