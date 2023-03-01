import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function PostalCodeConfirmationPage() {
  const postalCode = localStorage.getItem("postalCode");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    Axios.post("http://localhost:3001/PostalCode", {
      PostalCode: postalCode,
    })
      .then((resp) => {
        setCity(resp.data.City);
        setState(resp.data.State);
      })
      .catch(function (error) {
        console.log(error.response.data);
        alert(error.response.data.error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>You entered the following postal code:</p>
        <b>{postalCode}</b>
        <p>{`${city}, ${state}`}</p>
        <p>Is this correct?</p>

        <Link to="/AddPhoneNumberPage">
          <Button className="reportsButton" variant="secondary" size="lg">
            Yes
          </Button>
        </Link>
        <Link to="/AddPostalCodePage">
          <Button className="reportsButton" variant="secondary" size="lg">
            No
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default PostalCodeConfirmationPage;
