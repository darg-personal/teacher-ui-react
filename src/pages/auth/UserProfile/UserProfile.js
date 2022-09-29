import React, { useEffect, useState } from 'react'
import axios from "axios";
// import utils from '../utils';
import { Navigate, useNavigate } from 'react-router-dom';
import './userProfile.css'
import utils from '../utils';
let Token = localStorage.getItem("token");
let loggedUser = JSON.parse(localStorage.getItem("user"));

function UserProfile() {
  let api = `${utils.getHost()}/profile/user/profile_update/${loggedUser.id}`;

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [userName, setUserName] = useState(loggedUser.username);
  const [aboutUser, setAboutUser] = useState(null)
  const [state, setState] = useState({
    file: '',
    imagePreviewUrl: null,
  })
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

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
        setImagePreviewUrl(data?.data?.image)
        setPhoneNumber(data?.data?.phone_number)
        setAboutUser(data?.data.about)
        setState({
          imagePreviewUrl: data?.data?.image
        });
      }).catch((data) => {
        console.log(data);
      })
  }, [])

  const handleSubmission = async () => {
    let formData = new FormData();
    if (isSelected) {
      let imageData = new FormData();
      imageData.append("file", selectedFile);
      await axios
        .post(`${utils.getHost()}/profile/upload`, imageData)
        .then((resp) => {
          console.log(resp);
          const file_url = resp?.data.file_url;
          formData.append('image', file_url);
          localStorage.setItem("loginUserImage", file_url);
        })
        .then(() => {
          alert('pic update')
          setState({ file: false });
        })
        .catch((resp) => {
          setState({ file: false });
          alert("connection is breaked");
        });
    }
    if (phoneNumber)
      formData.append('phone_number', phoneNumber);
    if (aboutUser) {
      formData.append('about', aboutUser);
    }

    console.log(formData.getAll);
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
      <label className="custom-file-upload  justify-content-center">
        <div className="img-wrap" >
          <img className="img-upload" src={src} />
        </div>
        <input id="photo-upload" accept="image/*" type="file" onChange={onChange} />
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
          <div className='upload-body-centered' >
            <div className="card-upload">
              <form >
                <h1 >Profile Card</h1>
                <ImgUpload onChange={photoUpload} src={state.imagePreviewUrl} />
                <div>
                  <span>Name :</span>
                  {false ?
                    <input className="input-text"
                      id="name"
                      type="text"
                      value={userName}
                      onChange={(e) => { setUserName(e.target.value) }}
                    /> :
                    <span> {userName}</span>
                  }
                </div>
                <div style={{ marginTop: '5%' }}>
                  <span >Number :</span>
                  <span>{phoneNumber}</span>
                </div>
                <div style={{ marginTop: '5%' }}>
                  <p style={{ marginTop: '5%' }}>About : {aboutUser}</p>
                </div>
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
