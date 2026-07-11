const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/utils/swagger/*.yaml'],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = openapiSpecification;
