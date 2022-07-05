import "../App.css";
import { Col, Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import BasicModal from "../components/BasicModal/BasicModal";
import CallModal from "../components/CallModal/CallModal";
function Call() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [number, setNumber] = useState(null);
  const [name, setName] = useState(null);
  const [activeNumbers, setActiveNumbers] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const user_token = window.location.search.substring(1).split("=")[1];
      setToken(window.location.search.substring(1).split("=")[1]);
      try {
        let parsedData = JSON.parse(localStorage.getItem("data"));
        if (!parsedData) {
          const { data } = await axios(
            "http://localhost:8040/voip/api_voip/getlead",
            {
              headers: { Authorization: `${user_token}` },
            }
          );

          var replace = NaN;
          var re = new RegExp(replace, "g");
          parsedData = JSON.parse(
            JSON.stringify(JSON.parse(data.replace(re, '""')))
          );
          setData(parsedData);
          localStorage.setItem("data", JSON.stringify(parsedData));
        }

        const res = await axios("http://localhost:8040/voip/api_voip/active", {
          headers: { Authorization: `${user_token}` },
        });

        setActiveNumbers(res.data.active);

        setData(parsedData);
        console.log(parsedData);
        // console.log(parsedData);
        const headers = Object.keys(parsedData[0][0]);
        setHeaders(headers);
        const column = [];

        // Make table resizable
        headers.forEach((element) => {
          if (["id", "logo", "website"].includes(element)) return;
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
              with: "auto",
            },
          });
        });
        const actionFormatter = (_, row) => {
          return (
            <>
              {/* Change Background Color of row */}

              <div>
                <i
                  className="fa-solid fa-phone actionIcons"
                  onClick={(e) => {
                    setBasicModal(true);
                    setNumber(row.phone);
                    setName(row.name);
                  }}
                ></i>
                <i className="fa-solid fa-message actionIcons"></i>
              </div>
            </>
          );
        };
        column.push({
          dataField: "Actions",
          text: "Actions".toLocaleUpperCase(),
          formatter: actionFormatter,
          sort: true,
          headerStyle: {
            backgroundColor: "#3c3c3c",
            color: "white",
            fontWeight: "bold",
          },
          style: {
            with: "25vh",
            verticalAlign: "middle",
            textAlign: "center",
          },
        });
        setColumns(column);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    };
    fetchLeads();
  }, []);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Container className="App" fluid>
      <ToastContainer />
      {!loading ? (
        <>
          <BasicModal
            isModalOpen={basicModal}
            handleModal={() => {
              setBasicModal(false);
            }}
            body={
              <CallModal
                title="Call Member"
                number={number}
                name={name}
                activeNumbers={activeNumbers}
              />
            }
          />
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
            <Row>
              <Col>
                <form>
                  <Row>
                    {headers.map((element) => {
                      if (["id", "logo"].includes(element)) return;
                      return (
                        <Col lg="6" md="12" sm="12">
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
                        </Col>
                      );
                    })}
                    <div className="form-label d-flex justify-content-end">
                      <button className="submit-button">Submit</button>
                    </div>
                  </Row>
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
              <BootstrapTable
                keyField="dataField"
                data={data[0]}
                columns={columns}
                striped
                classes="table-responsive"
                pagination={paginationFactory()}
              />
            </Col>
          </Row>
        </>
      ) : (
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            width: "100%",
            height: "100%",
            "z-index": "9999",
          }}
        >
          <ThreeDots />
        </div>
      )}
    </Container>
  );
}

export default Call;
