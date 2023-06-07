'use strict';
const express = require('express');
const path = require('path');
const cors = require('cors');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const PDFParser = require('pdf-parse');
const axios = require('axios');
const router = express.Router();
app.use(bodyParser.json());
app.use(cors())
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.post('/extract-pdf',async (req, res) => {
  console.log("runing")
  const { url } = req.body;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    const pdfBuffer = Buffer.from(response.data, 'binary');

    const data = await PDFParser(pdfBuffer);

    res.send(data.text);
  } catch (error) {
    res.status(500).send(error.message);
  }
})
  


app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
