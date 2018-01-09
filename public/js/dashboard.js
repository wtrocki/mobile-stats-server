
/**
 * Create a title section for each metric section. Metric cards should be
 * appended inside the created <div>.
 *
 * @param {String} sectionName The title of the section
 * @param {*} parentElement The element to append this section into
 */
function createStatSection(sectionName, parentElement) {
  var sectionDiv = document.createElement('div');
  sectionDiv.id = sectionName;
  sectionDiv.className = 'row row-cards-pf';

  var sectionTitle = document.createElement('h2');
  sectionTitle.appendChild(document.createTextNode(sectionName));
  

  sectionDiv.appendChild(sectionTitle);

  parentElement.appendChild(sectionDiv);
}

/**
 * Update the value of a metric.
 *
 * @param {Object} statOptions
 * @param {String} statOptions.idPrefix Value to prefix when getting an element
 * @param {String} statOptions.title The title of the element to update
 * @param {String} statOptions.value The new value of the element
 */
function updateStatCard(statOptions) {
  var cardValueElem = document.getElementById(statOptions.idPrefix + statOptions.title + '-value');
  cardValueElem.innerText = statOptions.value;
}

/**
 * Get stats from the stats endpoint in the server.
 *
 * @param {Function} cb Callback
 */
function retrieveStats(cb) {
  fetch('/sys/info/stats')
    .then(res => res.json())
    .then(function(json) {
      cb(json);
    })
    .catch(err => console.error(err));
}

/**
 * For each stat add or update element in page.
 *
 * @param {Object} statsResponse
 * @param {Object[]} statsResponse.metrics Metrics from Server
 */
function onStatsResponse(statsResponse) {
  for (var metricGroup in statsResponse) {

    var statValue = statsResponse[metricGroup];
    if (typeof statsResponse[metricGroup] === 'string') {
      statValue = statsResponse[metricGroup];
    }

    if (!document.getElementById(metricGroup)) {
      createStatSection(metricGroup+ " : " + statValue, document.getElementById('stats-container'));
    }

    // if (document.getElementById(metricGroup)) {
    //   //updateStatCard(cardConfig);
    // } else {
    //   createStatCard(cardConfig, document.getElementById(metricGroup));
    // }
  }
}

$(document).ready(function() {
  // Do an initial get so the page has values fast, then poll.
  retrieveStats(onStatsResponse);
  //setInterval(retrieveStats.bind(null, onStatsResponse), 5000);
});
