let localStorageGroup = { group: {}, user: {} };
localStorage.setItem("localStorageGroup", JSON.stringify(localStorageGroup));
function getHost() {
  var HOST = "";
  if (window.location.origin.includes("localhost")) {
    HOST = "http://localhost:8040";
    console.log(HOST);
  }
  else if (window.location.origin.includes("teacher-v2.dreampotential.org/")) {
    HOST = "https://api.dreampotential.org";
    console.log(HOST);
  }
  else if (window.location.origin.includes("teacher-v2.alt-r.world")) {
    HOST = "https://python-base-api.alt-r.world";
    console.log(HOST);
  } else {
    //HOST = "https://api.dreampotential.org";
    HOST = "http://app.realtorstat.com:8041"
  }

  return HOST;
}

function getServer() {
  var SERVER = "";
  if (window.location.origin.includes("localhost")) {
    SERVER = "http://localhost:8040/";
  } else {
    //SERVER = "http://18.117.227.68:8041";
    SERVER = "https://app.realtorstat.com:8041";
  }
  return SERVER;
}

function getWebsocketHost() {
  var WEBSOCKET_HOST = "";
  if (window.location.origin.includes("localhost")) {
    WEBSOCKET_HOST = "ws://localhost:8040";
  } else {
    //WEBSOCKET_HOST = "wss://api.dreampotential.org";
    WEBSOCKET_HOST = 'ws://app.realtorstat.com:8040';
  }

  return WEBSOCKET_HOST;
}

export default { getHost, getServer, getWebsocketHost };
