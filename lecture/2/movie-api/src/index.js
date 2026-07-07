const express = require('express');
const cors = require('./middleware/cors.middleware');
const movieRouter = require('./routes/movie.routes');

const app = express();
app.use(express.json());
app.use(cors);

app.use('/v1/movies', movieRouter);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
