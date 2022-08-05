import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import "./Chat.css";
import "./List.css";
import MicRecorder from "mic-recorder-to-mp3";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function List() {
  const [recording, setRecording] = useState({
    isRecording: false,
    blobURL: "",
    isBlocked: false,
  });
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function fetchData() {
      // const user_token = window.location.search.substring(1).split("=")[1];
      const { data } = await axios(
        "https://api.dreampotential.org/admin_backend/api_admin/get_members",
        {
          headers: {
            Authorization:
              "Token 8dee6465d2fa76540dacdc18a787e3e06b99c1ce73a7e6a2c127a7c88d4f2797",
          },
        }
      );
      setMembers(data);
    }
    fetchData();

    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setRecording({ ...recording, isBlocked: false });
      },
      () => {
        console.log("Permission Denied");
        setRecording({ ...recording, isBlocked: true });
      }
    );
  }, []);
  const getMessage = async (id) => {
    var bodyFormData = new FormData();
    bodyFormData.set("to_number", id);
    const { data } = await axios.post(
      "https://api.dreampotential.org/voip/api_voip/list_sms",
      bodyFormData,
      {
        headers: {
          Authorization:
            "Token 8dee6465d2fa76540dacdc18a787e3e06b99c1ce73a7e6a2c127a7c88d4f2797",
        },
        contentType: "multipart/form-data",
      }
    );
    setMessages(data.messages);
  };
  const nameFormatter = (cell, row) => {
    return (
      <>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => getMessage(row.phone)}
        >
          {cell}
        </span>
      </>
    );
  };
  const columns = [
    {
      dataField: "name",
      text: "Name",
      filter: textFilter(),
      sort: true,
      formatter: nameFormatter,
    },
    {
      dataField: "phone",
      text: "Phone",
      filter: textFilter(),
      sort: true,
    },
  ];
  const start = () => {
    if (recording.isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setRecording({ ...recording, isRecording: true });
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setRecording({ ...recording, blobURL, isRecording: false });
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <Col lg={5}>
        <Row className="top">
          <Col>
            <h3>Messages</h3>
          </Col>
          <Col>
            <Button>Send SMS</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable
              keyField="id"
              data={members}
              columns={columns}
              striped
              hover
              condensed
              pagination={paginationFactory()}
              filter={filterFactory()}
            />
          </Col>
        </Row>
      </Col>
      <Col lg={7}>
        {messages.map((element) => (
          <div className="sender">{element.body}</div>
        ))}
      </Col>
      <button onClick={() => start()} disabled={recording.isRecording}>
        Record
      </button>
      <button onClick={() => stop()} disabled={!recording.isRecording}>
        Stop
      </button>
      <audio src={recording.blobURL} controls="controls" />
    </>
  );
}

export default List;
