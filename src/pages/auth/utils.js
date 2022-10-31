let localStorageGroup = { group: {}, user: {} };
localStorage.setItem("localStorageGroup", JSON.stringify(localStorageGroup));
function getHost() {
  var HOST = "";
  if (window.location.origin.includes("localhost")) {
    HOST = "http://localhost:8000";
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
    HOST = "http://18.117.227.68:8041"
  }
  HOST = "http://192.168.1.30:8000"

  return HOST;
}

function getServer() {
  var SERVER = "";
  if (window.location.origin.includes("localhost")) {
    SERVER = "http://localhost:8040/";
  } else {
    //SERVER = "http://18.117.227.68:8041";
    SERVER = "https://api.dreampotential.org";
  }
  return SERVER;
}

function getWebsocketHost() {
  var WEBSOCKET_HOST = "";
  if (window.location.origin.includes("localhost")) {
    WEBSOCKET_HOST = "ws://localhost:8000";
  } else {
    //WEBSOCKET_HOST = "wss://api.dreampotential.org";
    WEBSOCKET_HOST = 'ws://18.117.227.68:8040';
  }
  WEBSOCKET_HOST = 'ws://192.168.1.30:8000';

  return WEBSOCKET_HOST;
}

export default { getHost, getServer, getWebsocketHost };
