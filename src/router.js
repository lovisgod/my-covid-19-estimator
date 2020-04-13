const express = require('express');
const { handleRequest, getLogs } = require('./helper');

const router = express.Router();
router.post('/on-covid-19/:type', handleRequest);
router.post('/on-covid-19', handleRequest);
router.get('/on-covid-19/logs', getLogs);

router.get('/', (req, res) => {
  try {
    console.log('this is working very well');
    res.status(200).send('Welcome home');
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
