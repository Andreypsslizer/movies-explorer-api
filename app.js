require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const corsRequest = require('./middlewares/cors');
const { PORT_CFG, DB_CFG } = require('./utils/configuration');

const app = express();
app.use(express.json());

mongoose
  .connect(DB_CFG)
  .then(() => console.dir('DB OK'))
  .catch((error) => console.dir(error));

app.use(requestLogger);
app.use(corsRequest);
app.use(helmet());
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT_CFG, () => {
  console.log('App listening on port');
});
