import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";

function ManufacturerDrilldownReportPage() {
  const [manufacturerData, setManufacturerData] = useState([]);
  const selectedManufacturer = localStorage.getItem("selectedManufacturer");

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/report/ManufacturerApplianceType/${localStorage.getItem(
        "selectedManufacturer"
      )}`
    ).then((resp) => {
      setManufacturerData(resp.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{selectedManufacturer}</p>
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>Appliance Type</th>
                <th>Appliance Count</th>
              </tr>
            </thead>
            <tbody>
              {manufacturerData.map((data) => (
                <tr>
                  <td style={{ color: "white" }}>{data.ApplianceType}</td>
                  <td style={{ color: "white" }}>{data.ApplianceCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Link to="/Top25PopularManufacturersPage">
          <Button className="reportsButton" variant="secondary" size="lg">
            Go Back
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default ManufacturerDrilldownReportPage;
