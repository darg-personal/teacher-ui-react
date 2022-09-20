let localStorageGroup ={'group':{}, 'user': {}}
localStorage.setItem("localStorageGroup", JSON.stringify(localStorageGroup));
function getHost() {

    var HOST = '';  
    if (window.location.origin.includes("localhost")) { 
        // HOST = 'http://localhost:8000';
        HOST = 'http://192.168.29.187:8000';
        // HOST = 'http://192.168.1.30:8000';
        console.log(HOST);
      }
      else {
      // HOST = 'http://192.168.29.147:8000';
      // HOST = 'http://192.168.1.30:8000';
      HOST = 'https://api.dreampotential.org'; 
    }
    return HOST
    
  }
  
  function getServer()
  {
    var SERVER = '';
    if (window.location.origin.includes("localhost")) {
        SERVER = 'http://localhost:8040/';
      }
      else {
        SERVER = 'https://api.dreampotential.org';
      }     
    return SERVER
  }
  
  function getWebsocketHost()
  {
    var WEBSOCKET_HOST = '';
    if (window.location.origin.includes("localhost")) {
        // WEBSOCKET_HOST = 'ws://localhost:8000';
        WEBSOCKET_HOST = 'ws://192.168.29.187:8000';
        
        
      }
      else{
        WEBSOCKET_HOST = 'wss://api.dreampotential.org';
        // WEBSOCKET_HOST = 'ws://18.117.227.68:8041';
      }
    return  WEBSOCKET_HOST
  }
  
  export default {getHost, getServer, getWebsocketHost}
  
  