const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.dir('DB OK'))
  .catch((error) => console.dir(error));

app.listen(3000, () => {
  console.log('App listening on port');
});
