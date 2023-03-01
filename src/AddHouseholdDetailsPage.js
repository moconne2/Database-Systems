import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function AddHouseholdDetailsPage() {
  const navigate = useNavigate();
  const [squareFootage, setSquareFootage] = useState(-1);

  const checkHouseholdDetails = () => {
    const houseType = document.getElementById("homeTypes").value;
    const occupants = document.getElementById("occupants").value;
    const bedrooms = document.getElementById("bedrooms").value;

    if (squareFootage == "" || occupants === "" || bedrooms === "") {
      alert("Please make sure all fields are filled in");
    } else
      Axios.post("http://localhost:3001/HouseholdInfo", {
        Email: localStorage.getItem("email"),
        HouseholdType: houseType,
        PostalCode: localStorage.getItem("postalCode"),
        SquareFeet: squareFootage,
        Occupants: occupants,
        Bedrooms: bedrooms,
      })
        .then(() => {
          Axios.post("http://localhost:3001/PhoneNumberUpsert", {
            Email: localStorage.getItem("email"),
            AreaCode: localStorage.getItem("areaCode"),
            Number: localStorage.getItem("phoneNumber"),
            NumberType: localStorage.getItem("phoneType"),
          })
            .then(() => {
              navigate("/AddBathroomPage");
            })
            .catch(function (error) {
              console.log(error.response.data);
              alert(error.response.data.message);
            });
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.sqlMessage);
        });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Please enter the following details for your household.</p>
        <div className="mt-2">
          <span>
            Home type:{" "}
            <select name="homeTypes" id="homeTypes">
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="townhome">Townhome</option>
              <option value="condominium">Condominium</option>
              <option value="mobileHome">Mobile Home</option>
            </select>
          </span>
          <Form>
            <Form.Group className="mt-3 mb-3">
              <Form.Control
                placeholder="Enter square footage"
                onChange={(e) => setSquareFootage(e.target.value)}
              />
            </Form.Group>
          </Form>
          <span>
            Occupants: <input id="occupants" type="number"></input>
          </span>
        </div>
        <div className="mt-3">
          <span>
            Bedrooms: <input id="bedrooms" type="number"></input>
          </span>
        </div>

        <Button
          className="reportsButton mt-3"
          variant="secondary"
          size="lg"
          onClick={checkHouseholdDetails}
        >
          Next
        </Button>
      </header>
    </div>
  );
}

export default AddHouseholdDetailsPage;
