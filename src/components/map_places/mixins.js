import React, { useEffect, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import axios  from "axios";

let newcoordinates = [];

function Map() {
  const [show, setShow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const handleActiveMarker = (newcoordinates) => {
    if (newcoordinates === activeMarker) {
      return;
    }
    setActiveMarker(newcoordinates);
  };
  const getCoordinates = async() =>{
    try{
      let coordinates = await axios.get("http://127.0.0.1:8000/sfapp2/api/places")
      coordinates = coordinates.data
      console.log(coordinates,'coordinates from res');
        let len = coordinates.length
      for(let i=0;i<len;i++)
      {
        let position = {'lat':coordinates[i]['latitude'], 'lng':coordinates[i]['longitude']}
        newcoordinates.push({id:coordinates[i]['id'] , name:coordinates[i]['username'],position:position});
      }
      console.log(newcoordinates,'newcoordinates from res');
    } catch (error){
      console.log(error)
    }
  };
  useEffect(()=>{
    getCoordinates().then(()=>{setShow(true)})

  },[])

  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    newcoordinates.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };
let icon={
  // url:'/home/zec/python_ptoject/teacher-ui-react/src/components/map_places/images/marker.png',
  url: 'https://cf-st.sc-cdn.net/aps/snap_bitmoji/aHR0cHM6Ly9pbWFnZXMuYml0bW9qaS5jb20vM2QvYXZhdGFyLzM5ODEwMzM1MS0zODY2OTgxOTJfNC1zNS12MS53ZWJw._FMpng',
     anchor: new window.google.maps.Point(17, 46),
         scaledSize: new window.google.maps.Size(62, 62) 
     }

     return (
      <GoogleMap
      center={{'lat':22.7373799,'lng':75.8875692}}
      zoom={12}
      onLoad={handleOnLoad}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
      >
      {show?(
      newcoordinates.map(({ id, name, position }) => (
        <Marker
        key={id}
        position={position}
        onClick={() => handleActiveMarker(id)}
        icon = {icon}
        >
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{name}</div>
              </InfoWindow>
              ) : null}
              </Marker>
      ))):
      null
    }
    </GoogleMap>
 );
}

export default Map;