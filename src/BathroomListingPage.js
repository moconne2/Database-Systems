import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function BathroomListingPage() {
  const [bathrooms, setBathrooms] = useState([]);

  useEffect(() => {
    Axios.post("http://localhost:3001/BathroomList", {
      Email: localStorage.getItem("email"),
    }).then((resp) => {
      setBathrooms(resp.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>You have added the following bathrooms to your household:</p>
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>Bathroom #</th>
                <th>Type</th>
                <th>Primary</th>
              </tr>
            </thead>
            <tbody>
              {bathrooms.map((bathroom) => (
                <tr>
                  <td style={{ color: "white" }}>{bathroom.BathroomId}</td>
                  <td style={{ color: "white" }}>{bathroom.Type}</td>
                  <td style={{ color: "white" }}>
                    {bathroom.Primary === 1 && "Yes"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Link to="/AddBathroomPage">Add another bathroom</Link>
        <Link to="/AddAppliancePage">
          <Button className="reportsButton" variant="secondary" size="lg">
            Next
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default BathroomListingPage;
