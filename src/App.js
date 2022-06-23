import "./App.css";
import { Col, Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";
function App() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [headers, setHeaders] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const user_token = window.location.search.substring(1).split("=")[1];
      setToken(window.location.search.substring(1).split("=")[1]);
      try {
        const { data } = await axios(
          "http://localhost:8040/voip/api_voip/getlead",
          {
            headers: { Authorization: `${user_token}` },
          }
        );
        var replace = NaN;
        var re = new RegExp(replace, "g");
        const parsedData = JSON.parse(
          JSON.stringify(JSON.parse(data.replace(re, '""')))
        );
        setData(parsedData);
        console.log(parsedData);
        const headers = Object.keys(parsedData[0][0]);
        setHeaders(headers);
        const column = [];

        // Make table resizable
        headers.forEach((element) => {
          if (["id", "logo"].includes(element)) return;
          column.push({
            dataField: element,
            text: element.toLocaleUpperCase(),
            sort: true,
            headerStyle: {
              backgroundColor: "#3c3c3c",
              color: "white",
              fontWeight: "bold",
            },
            style: {
              with: "25vh",
            },
          });
        });
        setColumns(column);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLeads();
  }, []);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <Container className="App" fluid>
      <Modal
        dialogClassName="my-modal"
        className="modal"
        show={show}
        onHide={handleClose}
      >
        <Row className="modal-header align-items-center">
          <Col className="d-flex justify-content-between">
            <span className="modal-title">Add New Lead</span>
            <span className="cross" onClick={handleClose}>
              &times;
            </span>
          </Col>
        </Row>
        <Row></Row>
        <Row>
          <Col>
            <form>
              {headers.map((element) => {
                if (["id", "logo"].includes(element)) return;
                return (
                  <div className="form-group">
                    <label className="form-label">
                      {capitalizeFirstLetter(element)}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id={element}
                      placeholder={capitalizeFirstLetter(element)}
                    />
                  </div>
                );
              })}
              <div className="form-label d-flex justify-content-end">
                <button className="submit-button">Submit</button>
              </div>
            </form>
          </Col>
        </Row>
      </Modal>
      <Row>
        <Col>
          <header className="d-flex justify-content-end">
            <button className="import-button" onClick={handleShow}>
              Import
            </button>
            <button className="import-button" onClick={handleShow}>
              Add
            </button>
          </header>
        </Col>
      </Row>
      <Row className="lg-12">
        <Col className="lg-12">
          {!loading ? (
            <BootstrapTable
              keyField="dataField"
              data={data[0]}
              columns={columns}
              striped
              classes="table-responsive"
              pagination={paginationFactory()}
            />
          ) : (
            <h1>loading...</h1>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
