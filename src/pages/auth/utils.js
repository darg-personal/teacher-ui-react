let localStorageGroup = { group: {}, user: {} };
localStorage.setItem("localStorageGroup", JSON.stringify(localStorageGroup));
function getHost() {
  var HOST = "";
  if (window.location.origin.includes("localhost")) {
    HOST = "http://localhost:8000";

    console.log(HOST,"************************CURRENT DOMAIN********************");
  } else {
    HOST = "http://18.117.227.68:8041"
    // HOST = "https://api.dreampotential.org";
    console.log(HOST,"************************CURRENT DOMAIN********************");
  }
  return HOST;
}

function getServer() {
  var SERVER = "";
  if (window.location.origin.includes("localhost")) {
    SERVER = "http://localhost:8040/";
  } else {
    SERVER = "https://18.117.227.68:8041";
    // SERVER = "https://api.dreampotential.org";
  }
  return SERVER;
}

function getWebsocketHost() {
  var WEBSOCKET_HOST = "";
  if (window.location.origin.includes("localhost")) {
    WEBSOCKET_HOST = "ws://localhost:8000";
  } else {
    // WEBSOCKET_HOST = "wss://api.dreampotential.org";
    WEBSOCKET_HOST = 'ws://18.117.227.68:8041';
  }
  return WEBSOCKET_HOST;
}

export default { getHost, getServer, getWebsocketHost };
