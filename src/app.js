const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.send('Surplus Driver App Backend is running!');
});

module.exports = app;
