const express = require('express');
const app = express();

// global middleware
// body-parser
app.use(express.json());

// packet
/**
 * route param
 * /users/:userId
 *
 * query param -> GET
 * /?key=value
 *
 * body
 *
 *
 * headers
 */

// not method
// app.function
app.use('/test/:testId/:name', (req, res) => {
  const { testId, testid, name } = req.params;
  const body = req.body;
  const query = req.query;
  // testid => undefined
  res.json({ testId, testid, name, query, body });
});

app.use('/', (req, res, next) => {
  res.json('root');
  next();
});

// request - response

// global middleware
app.use((req, res) => {
  console.log(1);
  res.json('global');
});

// app.use('/123',()=>{
//   xxxx
// })

// .method(pathname, route handler)
app.get('/', (req, res) => {
  res.json([]);
  // res.send()
});

app.get('/123', (req, res) => {
  res.json([1, 2, 3]);
  // res.send()
});

app.post('/', (req, res) => {
  res.json([1, 3, 3]);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// middleware
// middleware chain (functions call in sequencial)
// error middleware
// error middleware chain

// m1, m2, m3
// (req, res, next)
// res.json(); next()
// res.json()
// next(error);

// error middleware
// function m6(err, req, res, next) {
//   console.log('m6(error):', err.message);
//   // res.status(500).json({ error: err.message });
//   next(err);
// }
// // m6, m7
// function m7(err, req, res, next) {
//   console.log('m6(error):', err.message);
//   res.status(500).json({ error: err.message });
// }

// function m7(e, request, response, next) {
//   console.log('m6(error):', err.message);
//   res.status(500).json({ error: err.message });
// }
