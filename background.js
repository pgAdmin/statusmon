function getStatusPath(serviceConfig) {
  var suffix = serviceConfig.type == "statuspage" ? "/api/v2/summary.json" : "/api/v1/components";
  return serviceConfig.url + suffix;
};

function checkStatus() {
  var github = {
    name: "GitHub",
    type: "statuspage",
    url: "https://www.githubstatus.com"
  }

  // TODO: Add configuration for multiple services
  // TODO: Wait for all Status responses before updating incident count
  let incidents = [];

  const statusPath = getStatusPath(github);
  fetch(statusPath)
    .then(
      function(response) {
        // Examine the text in the response
        response.json().then(function(data) {
          incidents.push(data.incidents);
          chrome.action.setBadgeText({ text: incidents.length.toString() });
        });
      }
    );
};


////////////////////////////////////////////////////////////////////////////////////
//////                                                                        //////
//////                Trigger management and event lifecycle                  //////
//////                    DO NOT CHANGE BELOW THIS LINE                       //////
//////                                                                        //////
////////////////////////////////////////////////////////////////////////////////////

// event: called when extension is installed or updated or Chrome is updated
function onInstalled() {
  chrome.alarms.create('checkStatus', { when: Date.now() + 60000, periodInMinutes: 1 });
}

// event: called when Chrome first starts
function onStartup() {
  chrome.alarms.create('checkStatus', { when: Date.now() + 60000, periodInMinutes: 1 });
}

// event: alarm raised
function onAlarm(alarm) {
  checkStatus();
}

// listen for extension install or update
chrome.runtime.onInstalled.addListener(onInstalled);

// listen for Chrome starting
chrome.runtime.onStartup.addListener(onStartup);

// listen for alarms
chrome.alarms.onAlarm.addListener(onAlarm);
