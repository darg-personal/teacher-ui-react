import React, { useEffect, useState } from 'react'
import axios from "axios";
// import utils from '../utils';
import { Navigate, useNavigate } from 'react-router-dom';
import './userProfile.css'
import utils from '../utils';
let Token = localStorage.getItem("token");

function UserProfile() {
  let api = `${utils.getHost()}/profile/user/profile_update/`;

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [userName, setUserName] = useState('');

  const [state, setState] = useState({
    image: '',
    imagePreviewUrl: 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true',
  })

  useEffect(() => {
    axios
      .get(
        api,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((data) => {
        console.log(data.data);
        setState({
          imagePreviewUrl: data.data?.image
        });
        setPhoneNumber(data.data?.phone_number)
      }).catch((data) => {
        console.log(data, "----");
      })
  }, [])

  const handleSubmission = () => {
    let formData = new FormData();

    if (isSelected)
      formData.append('image', selectedFile);
    if (phoneNumber)
      formData.append('phone_number', phoneNumber);

    axios.patch(
      api,
      formData,
      {
        headers: { Authorization: ` Bearer ${Token}` },
      }
    )
      .then((data) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const ImgUpload = ({ onChange, src }) =>
    <div>
      <label className="custom-file-upload">
        <div className="img-wrap" >
          <img className="img-upload" src={src} />
        </div>
        <input id="photo-upload" type="file" onChange={onChange} />
      </label>
    </div>

  const photoUpload = event => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    reader.onloadend = () => {
      setState({
        image: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file);
  }

  return (
    <>
      {
        Token ? (
          <div className='upload-body-centered'>
            <div className="card-upload">
              <form >
                <h1 >Profile Card</h1>
                <ImgUpload onChange={photoUpload} src={state.imagePreviewUrl} />
                <p>Name :</p>
                <input className="input-text"
                  id="name"
                  type="text"
                  value={userName}
                  onChange={(e) => { setUserName(e.target.value) }}
                />
                <p style={{ marginTop: '5%' }}>Number :</p>
                {/* <input className="input-text"
                id="number"
                type="text"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value) }}
              /> */}
                <p>{phoneNumber}</p>
                {isSelected ?
                  <p type="click" className="button-upload" onClick={(data) => {
                    handleSubmission()
                  }}>Save </p>
                  :
                  <p type="click" className="button-upload" onClick={(data) => {
                    navigate('/dashboard')
                  }} style={{ background: '#dbd94c' }}>GoBack </p>
                }
              </form>
            </div>

          </div>
        ) : (
          <Navigate replace to="/login" />
        )
      }
    </>

  )
}

export default UserProfile
