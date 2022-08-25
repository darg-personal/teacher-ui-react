import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './contact.css';
import axios from 'axios';
import { useEffect } from 'react';
import utils from '../../pages/auth/utils';
function Contact() {
const [group, setGroup] = useState([]);
useEffect(()=>{

  // axios.get('http://192.168.1.37:9000/s3_uploader/listgroup/')
  axios.get(`${utils.getHost()}/s3_uploader/listgroup/`)

  .then(response => {
      console.log("===----------====",response.data[0].Channel.name)
      const groups = response.data;
      // console.log(typeof groups);
      const prevGroup = [];

      for(let i=0; i < groups.length; i++){
        // console.log(groups[i].Channel);
        const receivedObj = groups[i].Channel;
        // console.log(receivedObj.name);
        prevGroup.push(receivedObj.name)
      }
    setGroup(prevGroup)
    
  }).catch((error) => {
    console.log('Not good man ');
})
},[]);
// console.log('------------------',group);


  return (
    <>
<div className="sidebar">
  <Link className="active" to="/chatroom/class8">
    <img
      src="https://www.w3schools.com/howto/img_avatar.png"
      alt="Avatar"
      className="avatar"
    />
    class8
  </Link>
</div>

</>
  )
}

export default Contact