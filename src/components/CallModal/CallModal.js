import { Modal, Row, Col } from "react-bootstrap";
import "./CallModal.css";
import { useState } from "react";
import axios from "axios";

function CallModal({ title, number, name, activeNumbers }) {
  const [source_number, setSourceNumber] = useState(null);
  const [dest_number] = useState(number);
  const [your_number, setYourNumber] = useState(null);
  const [code, setCode] = useState(number.split(" ")[0]);
  const call = async () => {
    const formData = {
      source_number: source_number,
      dest_number: dest_number,
      your_number: code + your_number,
    };
    await axios.post(
      "http://localhost:8040/voip/api_voip/join_conference/",
      formData
    );
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="details">
            <div className="detail">
              <bold>
                <strong>Number : </strong>
              </bold>
              {number}
            </div>
            <div className="detail">
              <bold>
                <strong>Name : </strong>
              </bold>
              {name}
            </div>
          </Col>
          <Row>
            <Col>
              Select Source Number
              <select
                className="select"
                onChange={(e) => setSourceNumber(e.target.value)}
              >
                <option selected disabled className="option">
                  Select
                </option>

                {activeNumbers.map((number) => (
                  <option value={number} className="option">
                    {number}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
          <Row style={{ marginTop: "0.5vh" }}>
            <Col>
              Your Number
              <Row>
                <Col lg={3} md={3} sm={12}>
                  <input
                    className="input"
                    defaultValue={
                      number.split(" ").length < 2 ? null : number.split(" ")[0]
                    }
                    type="text"
                    placeholder=" +Code"
                    onChange={(e) => setCode(e.target.value)}
                  />
                </Col>
                <Col lg={9} md={9} sm={12}>
                  <input
                    className="input"
                    placeholder=" Enter Phone Number"
                    type="number"
                    onChange={(e) => setYourNumber(e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <button className="call-button" onClick={() => call()}>
                Call
              </button>
            </Col>
          </Row>
        </Row>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </>
  );
}

export default CallModal;
