import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function ManufacturerModelSearchPage() {
  const [searchString, setSearchString] = useState("");
  const [manufacturerModels, setManufacturerModels] = useState([]);

  const search = () => {
    if (!searchString) {
      alert("You must enter a search string");
    } else {
      Axios.get(
        `http://localhost:3001/report/ManufacturerModelSearch/${searchString}`
      ).then((resp) => {
        setManufacturerModels(resp.data);
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Manufacturer/Model Search</p>
        <input
          type="text"
          placeholder="Enter search string"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <Button
          className="reportsButton"
          variant="secondary"
          size="sm"
          onClick={search}
        >
          Search
        </Button>
        {manufacturerModels.length > 0 && (
          <div className="mt-5">
            <Table bordered style={{ color: "white" }}>
              <thead>
                <tr>
                  <th>Manufacturer Name</th>
                  <th>Model Name</th>
                </tr>
              </thead>
              <tbody>
                {manufacturerModels.map((manufacturerModel) => (
                  <tr>
                    <td
                      style={{
                        color: "white",
                        backgroundColor:
                          manufacturerModel.ManufacturerName.toLowerCase().includes(
                            searchString
                          ) && "green",
                      }}
                    >
                      {manufacturerModel.ManufacturerName}
                    </td>
                    <td
                      style={{
                        color: "white",
                        backgroundColor:
                          manufacturerModel.ModelName.toLowerCase().includes(
                            searchString
                          ) && "green",
                      }}
                    >
                      {manufacturerModel.ModelName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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

export default ManufacturerModelSearchPage;
