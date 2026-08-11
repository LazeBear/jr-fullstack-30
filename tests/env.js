const path = require('path');

require('dotenv').config({
  quiet: true,
  path: path.join(__dirname, '..', '.env.test'),
});
