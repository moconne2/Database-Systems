import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function AverageTVDisplaySizePage() {
  const [states, setDisplaySize] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/report/AverageTvDisplaySizeByState").then(
      (resp) => {
        setDisplaySize(resp.data);
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Average TV Display Size</p>
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>State</th>
                <th>Average Display Size</th>
                <th>Drilldown Report</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr>
                  <td style={{ color: "white" }}>{state.State}</td>
                  <td style={{ color: "white" }}>{state.AvgDisplaySize}</td>
                  <td style={{ color: "white" }}>
                    <Link
                      to="/TvStateDrilldownReportPage"
                      onClick={() =>
                        localStorage.setItem("selectedState", state.State)
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

export default AverageTVDisplaySizePage;
