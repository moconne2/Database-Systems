import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function Top25PopularManufacturersPage() {
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/report/Top25PopularManufacturers").then(
      (resp) => {
        setManufacturers(resp.data);
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Top 25 Manufacturers</p>
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>Manufacturer Name</th>
                <th>Appliance Count</th>
                <th>Drilldown Report</th>
              </tr>
            </thead>
            <tbody>
              {manufacturers.map((manufacturer) => (
                <tr>
                  <td style={{ color: "white" }}>
                    {manufacturer.ManufacturerName}
                  </td>
                  <td style={{ color: "white" }}>
                    {manufacturer.ApplianceCount}
                  </td>
                  <td style={{ color: "white" }}>
                    <Link
                      to="/ManufacturerDrilldownReportPage"
                      onClick={() =>
                        localStorage.setItem(
                          "selectedManufacturer",
                          manufacturer.ManufacturerName
                        )
                      }
                    >
                      Link
                    </Link>
                  </td>
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

export default Top25PopularManufacturersPage;
