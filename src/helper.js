const DataStore = require('nedb');
const xml = require('xml');
const estimator = require('./estimator');

const logs = [];

const db = new DataStore({ filename: '../logs', autoload: true, timestampData: false });
db.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
  if (err) {
    console.log(err);
  }
});

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const handleRequest = (req, res) => {
  const data = req.body;
  const result = estimator(data);
  if (req.params.type === 'json') {
    res.format({ json: () => (res.send(result)) });
  } else if (req.params.type === 'xml') {
    res.set('Content-Type', 'text/xml');
    const stxml = [{ data: `${JSON.stringify(result)}` }];
    res.send(xml(stxml));
  } else if (!req.params.type) {
    res.format({ json: () => (res.send(result)) });
  }
  const start = process.hrtime();
  if (res.headersSent) {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const log = (`${new Date()
      .toISOString()}\t\t${req.originalUrl}\t\tdone in ${durationInMilliseconds
      .toLocaleString()} ms\n`);
    console.log(log);
    logs.push(log);
  }
};

const getLogs = (req, res) => {
  const start = process.hrtime();
  res.status(200).send(logs.toString().split(',').join(''));
  if (res.headersSent) {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const log = (`${new Date()
      .toISOString()}\t\t${req.originalUrl}\t\tdone in ${durationInMilliseconds
      .toLocaleString()} ms\n`);
    console.log(log);
    logs.push(log);
    console.log(logs);
  }
};

module.exports = {
  getDurationInMilliseconds,
  db,
  handleRequest,
  getLogs
};
