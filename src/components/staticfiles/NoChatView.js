import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ChatImageShow } from '../ChatRoom/templates/MainChat/Chat';

export function MyDropzone() {
  const [state, setState] = useState([]);
  const [tempUrl, setTempUrl] = useState("")
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader

        console.log(binaryStr)
        let t = {
          file: file[0],
          filePreviewUrl: reader.result,
        }
        setTempUrl(reader.result)
        state.push(t)
      }
      reader.readAsDataURL(file)
    })
    console.log(state);
  }, [])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [], },
  })

  return (
    <div>
      {/* <CancelSharpIcon
        style={{ flex: 1, marginLeft: "90%", position: "relative" }}
        onClick={() => {
          setState({
            file: null,
            filePreviewUrl: null,
          });
          setIsSelected(false);
        }}
        color="primary"
        fontSize="large"
      /> */}
      <div style={{
        borderRadius: "5px",
        backgroundColor: 'red'
      }}>
        <ChatImageShow filePreviewUrl={tempUrl} />
        <div style={{
          justifyContent: "center",
          height: "30vh",
          padding: '5px 10px',
          borderRadius: "5px",
          backgroundColor: 'blue'
        }}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select filesdd</p>
          </div>

          <div style={{ }}>
            {state.map((resp, i) => {
              return (
                <img key={i} src={resp.filePreviewUrl}
                  onClick={(data) => setTempUrl(data.currentTarget.currentSrc)}
                  height={'150px'}
                  width={'150px'} />)
            })}
            <p>Add</p>
          </div>
        </div>

      </div>
    </div>
  )
}