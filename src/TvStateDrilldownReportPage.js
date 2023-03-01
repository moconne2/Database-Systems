import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";

function TvStateDrilldownReportPage() {
  const [tvData, setTvData] = useState([]);
  const selectedState = localStorage.getItem("selectedState");

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/report/TvDisplayTypeMaxResAvgDisplayState/${selectedState}`
    ).then((resp) => {
      setTvData(resp.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{selectedState}</p>
        <div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>Display Type</th>
                <th>Max Resolution</th>
                <th>Average Display Size</th>
              </tr>
            </thead>
            <tbody>
              {tvData.map((tv) => (
                <tr>
                  <td style={{ color: "white" }}>{tv.DisplayType}</td>
                  <td style={{ color: "white" }}>{tv.MaxResolution}</td>
                  <td style={{ color: "white" }}>{tv.AvgDisplaySize}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Link to="/AverageTVDisplaySizePage">
          <Button className="reportsButton" variant="secondary" size="lg">
            Go Back
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default TvStateDrilldownReportPage;
