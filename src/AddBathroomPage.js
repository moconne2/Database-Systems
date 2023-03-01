import { Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function AddBathroomPage() {
  const navigate = useNavigate();
  const [bathroomType, setBathroomType] = useState("");
  const [primaryBathroom, setPrimaryBathroom] = useState(false);

  const [sinks, setSinks] = useState(0);
  const [commodes, setCommodes] = useState(0);
  const [bidets, setBidets] = useState(0);
  const [bathroomName, setBathroomName] = useState("");
  const [bathtubs, setBathtubs] = useState(0);
  const [showers, setShowers] = useState(0);
  const [tubShowers, setTubShowers] = useState(0);

  const checkBathroom = () => {
    if (!bathroomType) {
      alert("You must select a bathroom type");
    } else if (bathroomType === "Half" && !sinks && !commodes && !bidets) {
      alert("A half bathroom must have at least one sink, commode, or bidet");
    } else if (
      bathroomType === "Full" &&
      !bathtubs &&
      !showers &&
      !tubShowers
    ) {
      alert(
        "A full bathroom must have at least one bathtub, shower, or tub/shower"
      );
    } else if (bathroomType === "Half") {
      Axios.post("http://localhost:3001/Bathroom", {
        Email: localStorage.getItem("email"),
        Sinks: sinks,
        Commodes: commodes,
        Bidets: bidets,
        BathroomName: bathroomName,
        BathroomType: bathroomType,
      })
        .then(() => {
          navigate("/BathroomListingPage");
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
    } else if (bathroomType === "Full") {
      Axios.post("http://localhost:3001/Bathroom", {
        Email: localStorage.getItem("email"),
        Sinks: sinks,
        Commodes: commodes,
        Bidets: bidets,
        PrimaryBathroom: primaryBathroom,
        Bathtubs: bathtubs,
        Showers: showers,
        TubShowers: tubShowers,
        BathroomType: bathroomType,
      })
        .then(() => {
          navigate("/BathroomListingPage");
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
        <p>Please provide the details regarding the bathroom.</p>
        <div>
          Bathroom type:{" "}
          <input
            type="radio"
            value="Half"
            name="choice"
            onChange={(event) => setBathroomType("Half")}
          />{" "}
          Half{" "}
          <input
            type="radio"
            value="Full"
            name="choice"
            onChange={(event) => setBathroomType("Full")}
          />{" "}
          Full
        </div>
        {bathroomType && (
          <div className="mt-2">
            <hr className="solid"></hr>
            <span>
              Sinks:{" "}
              <input
                type="number"
                id="sinks"
                onChange={(event) => setSinks(event.target.value)}
              ></input>
            </span>
            <span>
              Commodes:{" "}
              <input
                type="number"
                id="commodes"
                onChange={(event) => setCommodes(event.target.value)}
              ></input>
            </span>
            <span>
              Bidets:{" "}
              <input
                type="number"
                id="bidets"
                onChange={(event) => setBidets(event.target.value)}
              ></input>
            </span>
          </div>
        )}

        {bathroomType === "Half" && (
          <div className="mt-3">
            Bathroom Name (optional):{" "}
            <input
              type="text"
              id="bathroomName"
              onChange={(event) => setBathroomName(event.target.value)}
            ></input>
          </div>
        )}
        {bathroomType === "Full" && (
          <div className="mt-3">
            <span>
              Bathtubs:{" "}
              <input
                type="number"
                id="bathtubs"
                onChange={(event) => setBathtubs(event.target.value)}
              ></input>
            </span>
            <span>
              Showers:{" "}
              <input
                type="number"
                id="showers"
                onChange={(event) => setShowers(event.target.value)}
              ></input>
            </span>
            <span>
              Tub/showers:{" "}
              <input
                type="number"
                id="tubShowers"
                onChange={(event) => setTubShowers(event.target.value)}
              ></input>
            </span>
            <div className="mt-2">
              <span>
                <input
                  type="checkbox"
                  id="primaryBathroom"
                  onChange={() => setPrimaryBathroom(!primaryBathroom)}
                />{" "}
                This bathroom is a primary bathroom
              </span>
            </div>
          </div>
        )}

        <Button
          className="reportsButton mt-3"
          variant="secondary"
          size="lg"
          onClick={checkBathroom}
        >
          Next
        </Button>
      </header>
    </div>
  );
}

export default AddBathroomPage;
