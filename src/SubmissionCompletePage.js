import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function SubmissionCompletePage() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Submission complete!</p>
        <p>Thank you for providing your information to Hemkraft!</p>

        <Link to="/HomePage">Return to the main menu</Link>
      </header>
    </div>
  );
}

export default SubmissionCompletePage;
