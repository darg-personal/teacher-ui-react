import useGeoLocation from "./useGeoLocation";
import './mixins.scss'
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, InfoWindow, Marker,DirectionsService,DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";
import utils from "../../pages/auth/utils";
// import {withGoogleMap,withScriptjs,DirectionsRenderer,} from 'react-google-maps';
// import AddNewLoacation from './addNewLoacation'


let newcoordinates = [];
const center = { lat: 22.7373799, lng: 75.8875692 };

function Map() {
  
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [show, setShow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showDirection, setShowDirection ] = useState(false);
  const [position, setPosition] = useState(null);
  const [name, setName] = useState(null);
  const [drawDirection, setDrawDirection] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const currentlocation = useGeoLocation();
  const [ccurrentlocation, setccurrentlocation] = useState("")
  // const [direction, setDirection] = useState({})  
  let currentPosition = currentlocation.coordinates

    async function calculateRoute(position) {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: {lat: 22.7373799, lng: 75.8875692},
        destination: position,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    }
    // function drawDirection(){
    //   setShowDirection(true);

    // }
    // useEffect(()=>{
    //   calculateRoute();
    // },[]);
  
    function clearRoute() {
      // setDirectionsResponse(null);
      // setDistance("");
      // setDuration("");
      // originRef.current.value = "";
      // destiantionRef.current.value = "";
    }

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  
  // For Form 
  function handleSubmit(e){
    e.preventDefault();
    // console.log("ITEM:", this.state.activeItem);

    var csrftoken = getCookie("csrftoken");

    var url =  `${utils.getHost()}/sfapp2/api/place/create/`;

    // if (this.state.editing == true) {
    //   url = `http://127.0.0.1:8000/sfapp2/api/place-update/${this.state.activeItem.id}/`;
    //   this.setState({
    //     editing: false,
    //   });
    // }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      // body: JSON.stringify(state.activeItem),
    })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  }

  function currentLocation(state) {
  }    

  const handleActiveMarker = (id,position,name) => {
    // if (id === activeMarker) {

    //   return;
    // }
    setActiveMarker(id);
    setPosition(position);
    setName(name);
    setShowPopup(true);
    setShowDirection(false);
    calculateRoute(position);
  };
  const getCoordinates = async () => {
    try {
      let coordinates = await axios.get(
        `${utils.getHost()}/sfapp2/api/places`
      );
      coordinates = coordinates.data;
      let len = coordinates.length;

      for (let i = 0; i < len; i++) {
        let position = {
          lat: coordinates[i]["latitude"], 
          lng: coordinates[i]["longitude"],
        };  
        newcoordinates.push({
          id: coordinates[i]["id"],
          name: coordinates[i]["username"]["username"],
          position: position,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCoordinates().then(() => {
      setShow(true);
    });
  }, []);

  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    newcoordinates.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };
  let icon = {
    // url:'/home/zec/python_ptoject/teacher-ui-react/src/components/map_places/images/marker.png',
    url: "https://cf-st.sc-cdn.net/aps/snap_bitmoji/aHR0cHM6Ly9pbWFnZXMuYml0bW9qaS5jb20vM2QvYXZhdGFyLzM5ODEwMzM1MS0zODY2OTgxOTJfNC1zNS12MS53ZWJw._FMpng",
    anchor: new window.google.maps.Point(17, 46),
    scaledSize: new window.google.maps.Size(62, 62),
  };

  return (<div> 

    
    <GoogleMap
      center={{lat: 22.7373799, lng: 75.8875692}}
      zoom={13}
      onLoad={handleOnLoad}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
    >
 {showPopup ? 
     <>
     <div className="background" />
     <div className="outer-div">
       <div className="inner-div">
         <div className="front">
           <div className="front__bkg-photo" />
           <div className="front__face-photo" />
           <div className="front__text">
             <h3 className="front__text-header">{name}</h3>
             <p className="front__text-para">
               {/* <i className="fas fa-map-marker-alt front-icons" /> */}
               <i className="fa-solid fa-road" />
               Distance : {distance}
             </p>
             <p className="front__text-para">
               {/* <i className="fas fa-map-marker-alt front-icons" /> */}
               <i className="fas fa-clock-o"></i>
               Duration : {duration}
             </p>
             <span className="front__text-hover" onClick={()=>{setShowDirection(true);setShowPopup(false)}}><i className="fa-solid fa-route"></i> &nbsp;Get Directions</span>&nbsp;&nbsp;
             <span className="front__text-hover" onClick={()=>{setShowPopup(false)}}>Go Back</span>
             <span className="front__text-hover-chat" >Chat</span>
           </div>
         </div>
       </div>
     </div>

   </> 
   : null 
}

      {show
        ? newcoordinates.map(({ id, name, position }) => (
            <Marker
              key={id}
              position={position}
              onClick={() => handleActiveMarker(id,position,name)}
              icon={icon}
              >
              {/* {activeMarker === id ? (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div >{position.lat}</div>
                </InfoWindow>
              ) : null} */}
            </Marker>
          ))
          
        : null}
                  {showDirection? (
            <DirectionsRenderer directions={directionsResponse} />
          ):null}
          {
            showDirection ? 

          <div style={{ position: 'fixed',bottom: '0px',right: '0px' }}>
            <button onClick={()=>{setShowDirection(false)}}
             style={{
             backgroundColor: '#4CAF50', /* Green */
             border: 'none',
             color: 'white',
             padding: '15px 32px',
             textAlign: 'center',
             textDecoration: 'none',
             display: 'inline-block',
             fontSize: '16px'}}
             ><i className="fa-solid fa-xmark">&nbsp;&nbsp;</i>Clear Route</button>
          </div>
          :
          null
          }

    </GoogleMap>

    {/* <AddNewLoacation></AddNewLoacation> */}
    </div>);
}

export default Map;
