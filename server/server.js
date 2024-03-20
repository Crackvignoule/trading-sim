const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());

app.use('/api', apiRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
