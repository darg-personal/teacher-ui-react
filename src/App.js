import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useEffect, useState } from "react";
function App() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
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
  return (
    <Container className="App" fluid>
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
