import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { MdHouse } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");

  const login = () => {
    if (account === "") {
      alert("Please make sure all fields are filled in");
    } else
      Axios.post("http://localhost:3001/LoginPage", { Email: account })
        .then(() => {
          localStorage.setItem("email", account);
          navigate("/AddPostalCodePage");
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.error);
        });
  };

  return (
    <div className="App">
      <header className="App-header">
        <MdHouse size={100} />
        <p>Enter your household email:</p>
        <div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Email"
                onChange={(e) => setAccount(e.target.value)}
              />
            </Form.Group>

            <Button variant="secondary" onClick={login}>
              Submit
            </Button>
          </Form>
        </div>
      </header>
    </div>
  );
}

export default LoginPage;
