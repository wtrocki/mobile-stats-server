const fs = require('fs');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const promClient = require('prom-client');

const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 10000 });

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

var stats = {};

app.get('/', function(req, res) {
  res.redirect(301, '/dashboard.html');
});

function getOrMakeGauge(name, help) {
  if (typeof promClient.register.getSingleMetric(name) !== "undefined") {
    return promClient.register.getSingleMetric(name);
  }
  var h = new promClient.Gauge({
    name: name,
    help: help
  });

  promClient.register.registerMetric(h);
  return h;
}

app.get("/counter", function(req, res) {
  if (req.query.key && req.query.value) {
    var label = req.query.key + "_" + req.query.value;
    if (!stats[label]) {
      stats[label] = 0;
    }
    stats[label] = stats[label] + 1;
    var counter = getOrMakeGauge(label,
      "Tracks Mobile SDK versions");
    counter.inc(1, new Date());
    res.json(stats);
  } else {
    res.json({ status: "MISSING KEY OR VALUE" });
  }
});

app.get('/metrics', function(req, res) {
  res.set('Content-Type', promClient.register.contentType);
  return res.end(promClient.register.metrics());
});

app.get('/sys/info/ping', function(req, res) {
  res.send('"OK"');
});

app.get('/sys/info/stats', function(req, res) {
  res.json(stats);
});



var port = process.env.SERVER_PORT || 3000;
app.listen(port, function() {
  console.log(`\nServer listening on port ${port}!`);
});

