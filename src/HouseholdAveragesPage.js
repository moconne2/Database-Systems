import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";

function HouseholdAveragesPage() {
  const [postalCode, setPostalCode] = useState("");
  const [searchRadius, setSearchRadius] = useState("");
  const [householdData, setHouseholdData] = useState([]);

  const search = () => {
    if (!postalCode || !searchRadius) {
      alert("You must enter a postal code and search radius");
    } else if (postalCode.length !== 5) {
      alert("Postal code length is invalid");
    } else {
      Axios.post("http://localhost:3001/report/HouseholdAverageByRadius", {
        postalCode: postalCode,
        radius: searchRadius,
      })
        .then((resp) => {
          setHouseholdData(resp.data);
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.message);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Household Averages</p>
        <input
          type="text"
          placeholder="Enter postal code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <span
          className="mt-3"
          onChange={(e) => setSearchRadius(e.target.value)}
        >
          Search Radius:{" "}
          <select name="searchRadiusSelect" id="searchRadiusSelect">
            <option value="">Select</option>
            <option value="0">0</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
          </select>
        </span>
        <Button
          className="reportsButton"
          variant="secondary"
          size="sm"
          onClick={search}
        >
          Search
        </Button>
        <hr />
        {householdData.length > 0 && (
          <Table bordered style={{ color: "white" }} className="mt-3">
            <thead>
              <tr>
                <th>Postal Code</th>
                <th>Avg # of Appliances</th>
                <th>Avg Bathrooms Per Household</th>
                <th>Avg Bedrooms Per Household</th>
                <th>Avg Occupants Per Household</th>
                <th>Commode Ratio</th>
                <th>Most Common Heat Source</th>
              </tr>
            </thead>
            <tbody>
              {householdData.map((data) => (
                <tr>
                  <td style={{ color: "white" }}>{data.PostalCode}</td>
                  <td style={{ color: "white" }}>
                    {data.average_number_of_appliances}
                  </td>
                  <td style={{ color: "white" }}>
                    {data.avg_bathroom_per_household}
                  </td>
                  <td style={{ color: "white" }}>
                    {data.avg_bedrooms_per_household}
                  </td>
                  <td style={{ color: "white" }}>
                    {data.avg_occupants_per_household}
                  </td>
                  <td style={{ color: "white" }}>{data.commode_ratio}</td>
                  <td style={{ color: "white" }}>
                    {data.most_common_heat_source}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Link to="/" className="mt-3">
          <Button className="reportsButton" variant="secondary" size="lg">
            Go Back
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default HouseholdAveragesPage;
