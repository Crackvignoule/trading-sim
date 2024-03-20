const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api', apiRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});