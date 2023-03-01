import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { MdHouse } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function AddPostalCodePage() {
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState("");

  const checkPostalCode = () => {
    if (postalCode === "") {
      alert("Please make sure all fields are filled in");
    } else {
      localStorage.setItem("postalCode", postalCode);
      Axios.post("http://localhost:3001/PostalCode", {
        PostalCode: postalCode,
      })
        .then(() => {
          navigate("/PostalCodeConfirmationPage");
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <MdHouse size={100} />
        <p>Please enter your five digit postal code:</p>
        <div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Enter postal code"
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Form.Group>

            <Button variant="secondary" onClick={checkPostalCode}>
              Submit
            </Button>
          </Form>
        </div>
      </header>
    </div>
  );
}

export default AddPostalCodePage;
