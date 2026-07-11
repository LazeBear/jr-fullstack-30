require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('./middleware/cors.middleware');
const movieRouter = require('./routes/movie.routes');
const logger = require('./utils/logger');
const morganMiddleware = require('./middleware/morgan.middleware');
const rateLimiter = require('./middleware/rateLimit.middleware');
const openapiSpecification = require('./utils/swagger');
const connectDB = require('./utils/db');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(morganMiddleware);
app.use(rateLimiter);
app.use(express.json());
app.use(cors);

app.use('/v1/movies', movieRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

connectDB();
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
