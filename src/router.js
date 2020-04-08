const express = require('express');
const { handleRequest, getLogs } = require('./helper');

const router = express.Router();
router.post('/on-covid-19/:type', handleRequest);
router.post('/on-covid-19', handleRequest);
router.get('/on-covid-19/logs', getLogs);

module.exports = router;
