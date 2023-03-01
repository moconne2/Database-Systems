import "./App.css";
import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdHouse } from "react-icons/md";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <MdHouse size={100} />
        <p>Welcome to Hemkraft!</p>
        <p>Please choose what you'd like to do: </p>
        <div>
          <span>
            <Link to="/LoginPage">
              <Button className="buttonStyle" variant="secondary" size="lg">
                Enter household
              </Button>
            </Link>
          </span>
          <span>
            <Link to="/ReportsPage">
              <Button className="buttonStyle" variant="secondary" size="lg">
                View reports
              </Button>
            </Link>
          </span>
        </div>
        <hr />
        <div style={{ fontSize: "medium" }}>
          Built by CS6340 Fall 2022 Team 093
        </div>
      </header>
    </div>
  );
};

export default HomePage;
