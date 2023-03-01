import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function ExtraFridgeFreezerPage() {
  const [multipleFridgeFreezerCount, setMultipleFridgeFreezerCount] =
    useState(-1);
  const [topTenStateData, setTopTenStateData] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/report/HouseholdCount").then((resp) => {
      setMultipleFridgeFreezerCount(resp.data);
    });
    Axios.get(
      "http://localhost:3001/report/HouseholdPercentageWithMultiFreezerPerState"
    ).then((resp) => {
      setTopTenStateData(resp.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Extra Fridge/Freezer Report</p>
        <div>
          Household count with more than one fridge or freezer:{" "}
          {multipleFridgeFreezerCount >= 0 && multipleFridgeFreezerCount}
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <th>State</th>
                <th>Households with multiple fridge/freezers</th>
                <th>Percentage with chest freezers</th>
                <th>Percentage with upright freezers</th>
                <th>Percentage with something else</th>
              </tr>
            </thead>
            <tbody>
              {topTenStateData.map((stateData) => (
                <tr>
                  <td style={{ color: "white" }}>{stateData.State}</td>
                  <td style={{ color: "white" }}>{stateData.HouseholdCount}</td>
                  <td style={{ color: "white" }}>
                    {stateData.PercentageOfHouseholdWithMultipleChestFreezers}
                  </td>
                  <td style={{ color: "white" }}>
                    {stateData.PercentageOfHouseholdWithMultipleUprightFreezers}
                  </td>
                  <td style={{ color: "white" }}>
                    {stateData.PercentageOfHouseholdWithMultipleOtherFreezers}
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

export default ExtraFridgeFreezerPage;
