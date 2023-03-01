import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function LaundryCenterPage() {
  const [laundryData, setLaundryData] = useState([]);
  const [noDryerData, setNoDryerData] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/report/StateLaundryReport").then(
      (resp) => {
        setLaundryData(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/HouseholdCountWithoutDryer").then(
      (resp) => {
        setNoDryerData(resp.data);
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Laundry Center Report</p>
        Most common washer type and heat source:
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>State</th>
                <th>Washer Type</th>
                <th>Heat Source</th>
              </tr>
            </thead>
            <tbody>
              {laundryData.map((data) => (
                <tr>
                  <td style={{ color: "white" }}>{data.State}</td>
                  <td style={{ color: "white" }}>{data.CommonLoadingType}</td>
                  <td style={{ color: "white" }}>{data.CommonHeatSource}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        Households with washing machine but no dryer:
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>State</th>
                <th>Household Count</th>
              </tr>
            </thead>
            <tbody>
              {noDryerData.map((data) => (
                <tr>
                  <td style={{ color: "white" }}>{data.State}</td>
                  <td style={{ color: "white" }}>{data.HouseholdCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Link to="/">
          <Button className="reportsButton" variant="secondary" size="lg">
            Go Back
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default LaundryCenterPage;
