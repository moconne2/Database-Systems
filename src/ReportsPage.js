import "./App.css";
import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function OrdersPage() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Please choose which report you would like to review: </p>
        <div>
          <span>
            <Link to="/Top25PopularManufacturersPage">
              <Button className="reportsButton" variant="secondary" size="lg">
                Top 25 popular manufacturers
              </Button>
            </Link>
          </span>
          <span>
            <Link to="/ManufacturerModelSearchPage">
              <Button className="reportsButton" variant="secondary" size="lg">
                Manufacturer/model search
              </Button>
            </Link>
          </span>
        </div>
        <div>
          <span>
            <Link to="/AverageTVDisplaySizePage">
              <Button className="reportsButton" variant="secondary" size="lg">
                Average TV display size by state
              </Button>
            </Link>
          </span>
          <span>
            <Link to="/ExtraFridgeFreezerPage">
              <Button className="reportsButton" variant="secondary" size="lg">
                Extra fridge/freezer report
              </Button>
            </Link>
          </span>
        </div>

        <div>
          <span>
            <Link to="/LaundryCenterPage">
              <Button className="reportsButton" variant="secondary" size="lg">
                Laundry center report
              </Button>
            </Link>
          </span>
          <span>
            <Link to="/BathroomStatisticsPage">
              <Button className="reportsButton" variant="secondary" size="lg">
                Bathroom statistics report
              </Button>
            </Link>
          </span>
        </div>
        <span>
          <Link to="/HouseholdAveragesPage">
            <Button className="reportsButton" variant="secondary" size="lg">
              Household averages by radius
            </Button>
          </Link>
        </span>

        <div style={{ marginTop: "20px", fontSize: "large" }}>
          <Link to="/">
            <Button className="buttonStyle" variant="secondary" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default OrdersPage;
