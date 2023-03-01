import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function ApplianceListingPage() {
  const [appliances, setAppliances] = useState([]);

  useEffect(() => {
    Axios.post("http://localhost:3001/ApplianceList", {
      Email: localStorage.getItem("email"),
    }).then((resp) => {
      setAppliances(resp.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>You have added the following appliances to your household:</p>
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>Appliance #</th>
                <th>Type</th>
                <th>Manufacturer</th>
                <th>Model</th>
              </tr>
            </thead>
            <tbody>
              {appliances.map((appliance) => (
                <tr>
                  <td style={{ color: "white" }}>{appliance.ApplianceID}</td>
                  <td style={{ color: "white" }}>{appliance.Type}</td>
                  <td style={{ color: "white" }}>{appliance.Manufacturer}</td>
                  <td style={{ color: "white" }}>{appliance.Model}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Link to="/AddAppliancePage">Add another appliance</Link>
        <Link to="/SubmissionCompletePage">
          <Button className="reportsButton" variant="secondary" size="lg">
            Next
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default ApplianceListingPage;
