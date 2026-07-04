const express = require('express');
const app = express();

function m1(req, res, next) {
  console.log('m1', req.method, req.url);
  next();
}
function m2(req, res, next) {
  console.log('m2');
  next();
}
function m3(req, res, next) {
  console.log('m3');
  next();
}
function mErr(req, res, next) {
  console.log('mErr');
  next(new Error('boom'));
}
function sendOk(req, res) {
  console.log('sendOk');
  res.status(201).json({ ok: true });
}
// error middleware
function m6(err, req, res, next) {
  console.log('m6(error):', err.message);
  res.status(500).json({ error: err.message });
}

app.use(express.json());
app.use(m1);
app.use('/v1', m2);

app.get('/v1/tasks', m3, (req, res, next) => {
  console.log('tasks handler no response');
  next();
});
app.get('/v1/tasks/:id', m3, sendOk);

app.get('/v1/search', (req, res) => {
  console.log('search q=', req.query.q);
  res.json({ q: req.query.q || null });
});

app.post('/v1/echo', (req, res) => {
  console.log('echo body keys=', Object.keys(req.body || {}));
  res.json({ body: req.body });
});

app.get('/v1/error-sync', mErr);

app.get('/v1/error-async', async (req, res, next) => {
  console.log('error-async start');
  try {
    await Promise.reject(new Error('async oops'));
  } catch (e) {
    next(e);
  }
});

app.use(m6);

app.listen(3000, () => console.log('listen on 3000'));

/**
 * > 1. `GET /v1`
> 2. `GET /v1/tasks`
> 3. `GET /v1/tasks/123`
> 4. `GET /v1/search?q=hello`
> 5. `POST /v1/echo`（body: `{"a":1}`，Content-Type: application/json）
> 6. `GET /v1/error-sync`
> 7. `GET /v1/error-async`
> 8. `GET /v1/unknown/path`
 */
