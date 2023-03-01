import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function AddPhoneNumberPage() {
  const navigate = useNavigate();
  const [enterPhoneNumber, setEnterPhoneNumber] = useState(false);
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneType, setPhoneType] = useState("");

  const checkPhoneNumber = () => {
    if (
      enterPhoneNumber &&
      (areaCode === "" || phoneNumber === "" || phoneType === "")
    ) {
      alert("Please make sure all fields are filled in");
    } else if (
      enterPhoneNumber &&
      (areaCode.length !== 3 || phoneNumber.length !== 7)
    ) {
      alert("Please make sure phone number is correct length");
    } else if (enterPhoneNumber) {
      Axios.post("http://localhost:3001/PhoneNumber", {
        areaCode: areaCode,
        Number: phoneNumber,
      })
        .then(() => {
          localStorage.setItem("areaCode", areaCode);
          localStorage.setItem("phoneNumber", phoneNumber);
          localStorage.setItem("phoneType", phoneType);
          navigate("/AddHouseholdDetailsPage");
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    } else {
      navigate("/AddHouseholdDetailsPage");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Would you like to enter a phone number?</p>
        <div>
          <input
            type="radio"
            value="Yes"
            name="choice"
            onClick={() => setEnterPhoneNumber(true)}
          />{" "}
          Yes{" "}
          <input
            type="radio"
            value="No"
            name="choice"
            onClick={() => setEnterPhoneNumber(false)}
          />{" "}
          No
        </div>

        {enterPhoneNumber && (
          <div className="mt-2">
            <hr class="solid"></hr>
            <div className="mb-3">Please enter your phone number below:</div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Enter Area Code"
                  onChange={(e) => setAreaCode(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  placeholder="Enter Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <div
                className="mt-4"
                onChange={(e) => setPhoneType(e.target.value)}
              >
                Phone type:{" "}
                <select name="phoneTypes" id="phoneTypes">
                  <option value="">Select</option>
                  <option value="home">Home</option>
                  <option value="mobile">Mobile</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </Form>
          </div>
        )}

        <Button
          className="reportsButton mt-5"
          variant="secondary"
          size="lg"
          onClick={checkPhoneNumber}
        >
          Next
        </Button>
      </header>
    </div>
  );
}

export default AddPhoneNumberPage;
