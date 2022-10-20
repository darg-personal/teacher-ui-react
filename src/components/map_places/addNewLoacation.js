import React, { useState } from 'react';
import axios from 'axios';


const AddNewLoacation = () => {

    const [image, setImage] = useState(null)
    const [username, setUsername] = useState(null)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)


    const addNewLocation = async () => {
        let formField = new FormData()
        formField.append('username',username)
        formField.append('latitude',latitude)
        formField.append('longitude',longitude)
        console.log(formField)

        if(image !== null) {
          formField.append('image', image)
        }

        await axios({
          method: 'post',
          url:'http://127.0.0.1:8000/sfapp2/api/place/create/',
          data: formField
        }).then(response=>{
          console.log(response.data);
        })
    }
   
    return (
        <div className="container">
            <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add A location</h2>
        

        <div className="form-group">
        <label>Image</label>
             <input type="file" className="form-control" onChange={(e)=>setImage(e.target.files[0])}/>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Name"
              name="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
         
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Latitude"
              name="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Logitude"
              name="lontitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={addNewLocation}>Add Student</button>
       
      </div>
    </div>
        </div>
    );
};

export default AddNewLoacation;