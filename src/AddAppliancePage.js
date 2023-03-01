import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function AddAppliancePage() {
  const navigate = useNavigate();
  const [applianceType, setApplianceType] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturerName, setManufacturerName] = useState("");
  const [modelName, setModelName] = useState("");
  const [fridgeType, setFridgeType] = useState("");
  const [washerType, setWasherType] = useState("");
  const [dryerHeatSource, setDryerHeatSource] = useState("");
  const [oven, setOven] = useState(false);
  const [ovenType, setOvenType] = useState("");
  const [cooktop, setCooktop] = useState(false);
  const [cooktopHeatSource, setCooktopHeatSource] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [displaySize, setDisplaySize] = useState("");
  const [maxResolution, setMaxResolution] = useState("");
  const [gasSelected, setGasSelected] = useState(false);
  const [electricSelected, setElectricSelected] = useState(false);
  const [microwaveSelected, setMicrowaveSelected] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:3001/ManufacturerList")
      .then((resp) => {
        setManufacturers(resp.data);
      })
      .catch(function (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
      });
  }, []);

  useEffect(() => {
    if (applianceType !== "Cooker") {
      setOven(false);
      setCooktop(false);
    }
  }, [applianceType]);

  const cookerTypeCheck = () => {
    if (oven && cooktop) {
      return "Both";
    } else if (oven) {
      return "Oven";
    } else if (cooktop) {
      return "Cooktop";
    }
  };

  const getFormattedOvenHeatSource = () => {
    if (gasSelected && electricSelected && microwaveSelected) {
      return "electric;gas;microwave";
    } else if (gasSelected && electricSelected) {
      return "electric;gas";
    } else if (gasSelected && microwaveSelected) {
      return "gas;microwave";
    } else if (electricSelected && microwaveSelected) {
      return "electric;microwave";
    } else if (gasSelected) {
      return "gas";
    } else if (electricSelected) {
      return "electric";
    } else if (microwaveSelected) {
      return "microwave";
    }
  };

  const checkAppliance = () => {
    if (!applianceType || !manufacturerName) {
      alert("You must select an appliance type and manufacturer");
    } else if (applianceType === "RefrigeratorOrFreezer" && !fridgeType) {
      alert("You must select a type for the Refrigerator/Freezer");
    } else if (applianceType === "Cooker" && !oven && !cooktop) {
      alert("A Cooker must have either an Oven or a Cooktop");
    } else if (
      applianceType === "Cooker" &&
      oven &&
      ((!gasSelected && !electricSelected && !microwaveSelected) || !ovenType)
    ) {
      alert("You must select an oven heat source and oven type");
    } else if (applianceType === "Cooker" && cooktop && !cooktopHeatSource) {
      alert("You must select a cooktop heat source");
    } else if (applianceType === "Washer" && !washerType) {
      alert("You must select a washer type");
    } else if (applianceType === "Dryer" && !dryerHeatSource) {
      alert("You must select a dryer heat source");
    } else if (
      applianceType === "TV" &&
      (!displayType || !displaySize || !maxResolution)
    ) {
      alert(
        "You must select the TV display type, display size, and resolution"
      );
    } else {
      Axios.post("http://localhost:3001/Appliances", {
        Email: localStorage.getItem("email"),
        ApplianceType: applianceType,
        ManufacturerName: manufacturerName,
        ModelName: modelName,
        Type: applianceType === "RefrigeratorOrFreezer" && fridgeType,
        CookerType: applianceType === "Cooker" && cookerTypeCheck(),
        OvenHeatSource:
          applianceType === "Cooker" && oven && getFormattedOvenHeatSource(),
        OvenType: applianceType === "Cooker" && oven && ovenType,
        CooktopHeatSource:
          applianceType === "Cooker" && cooktop && cooktopHeatSource,
        LoadingType: applianceType === "Washer" && washerType,
        HeatSource: applianceType === "Dryer" && dryerHeatSource,
        DisplayType: applianceType === "TV" && displayType,
        DisplaySize: applianceType === "TV" && displaySize,
        Resolution: applianceType === "TV" && maxResolution,
      })
        .then(() => {
          navigate("/ApplianceListingPage");
        })
        .catch(function (error) {
          console.log(error.response.data);
          alert(error.response.data.message);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Please provide the details for the appliance.</p>

        <div
          className="mb-3"
          onChange={(event) => setApplianceType(event.target.value)}
        >
          Appliance type:{" "}
          <select name="applianceTypes" id="applianceTypes">
            <option value="">Select</option>
            <option value="RefrigeratorOrFreezer">Refrigerator/Freezer</option>
            <option value="Cooker">Cooker</option>
            <option value="Washer">Washer</option>
            <option value="Dryer">Dryer</option>
            <option value="TV">TV</option>
          </select>
        </div>
        <div
          className="mb-3"
          onChange={(event) => setManufacturerName(event.target.value)}
        >
          Manufacturer:{" "}
          <select name="manufacturer" id="manufacturer">
            <option value="">Select</option>
            {manufacturers.map((manufacturer) => (
              <option value={manufacturer.Name}>{manufacturer.Name}</option>
            ))}
          </select>
        </div>
        <div>
          Model name:{" "}
          <input type="text" onChange={(e) => setModelName(e.target.value)} />
        </div>

        <div className="mt-2">
          <hr class="solid"></hr>
          {applianceType === "RefrigeratorOrFreezer" && (
            <span>
              Type:{" "}
              <select
                name="fridgeFreezerTypes"
                id="fridgeFreezerTypes"
                onChange={(event) => setFridgeType(event.target.value)}
              >
                <option value="">Select</option>
                <option value="bottomFreezer">Bottom freezer</option>
                <option value="frenchDoor">French door</option>
                <option value="sideBySide">Side-by-side</option>
                <option value="topFreezer">Top frezer</option>
                <option value="chestFreezer">Chest freezer</option>
                <option value="uprightFreezer">Upright freezer</option>
              </select>
            </span>
          )}
          {applianceType === "Cooker" && (
            <div>
              <div>
                <span className="mb-3">
                  <input
                    type="checkbox"
                    id="oven"
                    onChange={() => setOven(!oven)}
                  />{" "}
                  Oven
                </span>

                {oven && (
                  <div className="m">
                    <div>
                      Heat source(s):
                      <div>
                        <input
                          type="checkbox"
                          onClick={() => setGasSelected(!gasSelected)}
                        />{" "}
                        <label for="Gas"> Gas </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          onClick={() => setElectricSelected(!electricSelected)}
                        />{" "}
                        <label for="Electric"> Electric</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          onClick={() =>
                            setMicrowaveSelected(!microwaveSelected)
                          }
                        />{" "}
                        <label for="Microwave"> Microwave</label>
                      </div>
                    </div>
                    <div className="mt-2">
                      Oven type:{" "}
                      <select
                        name="ovenTypes"
                        id="ovenTypes"
                        onChange={(event) => setOvenType(event.target.value)}
                      >
                        Oven type <option value="">Select</option>
                        <option value="Convection">Convection</option>
                        <option value="Conventional">Conventional</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <hr class="solid"></hr>
              <div>
                <span>
                  <input
                    type="checkbox"
                    id="cooktop"
                    onChange={() => {
                      setCooktop(!cooktop);
                    }}
                  />{" "}
                  Cooktop
                </span>

                {cooktop && (
                  <div className="mb-3">
                    <span>
                      Heat source:{" "}
                      <select
                        name="cooktopHeatSources"
                        id="cooktopHeatSources"
                        onChange={(event) =>
                          setCooktopHeatSource(event.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Gas">Gas</option>
                        <option value="Electric">Electric</option>
                        <option value="Radiant Electric">
                          Radiant electric
                        </option>
                        <option value="Induction">Induction</option>
                      </select>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {applianceType === "Washer" && (
            <span>
              Washer type:{" "}
              <select
                name="washerTypes"
                id="washerTypes"
                onChange={(event) => setWasherType(event.target.value)}
              >
                <option value="">Select</option>
                <option value="Top">Top</option>
                <option value="Front">Front</option>
              </select>
            </span>
          )}
          {applianceType === "Dryer" && (
            <span>
              Heat source:{" "}
              <select
                name="dryerHeatSources"
                id="dryerHeatSources"
                onChange={(event) => setDryerHeatSource(event.target.value)}
              >
                <option value="">Select</option>
                <option value="Gas">Gas</option>
                <option value="Electric">Electric</option>
                <option value="None">None</option>
              </select>
            </span>
          )}
          {applianceType === "TV" && (
            <>
              <span>
                Display type:{" "}
                <select
                  name="displayTypes"
                  id="displayTypes"
                  onChange={(event) => setDisplayType(event.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Tube">Tube</option>
                  <option value="DLP">DLP</option>
                  <option value="Plasma">Plasma</option>
                  <option value="LCD">LCD</option>
                  <option value="LED">LED</option>
                </select>
              </span>
              <span>
                Display size (inches):{" "}
                <input
                  type="text"
                  id="displaySize"
                  onChange={(e) => setDisplaySize(e.target.value)}
                ></input>
              </span>
              <span>
                Maximum resolution:{" "}
                <select
                  name="resolutions"
                  id="resolutions"
                  onChange={(event) => setMaxResolution(event.target.value)}
                >
                  <option value="">Select</option>
                  <option value="480i">480i</option>
                  <option value="576i">576i</option>
                  <option value="720p">720p</option>
                  <option value="1080i">1080i</option>
                  <option value="1080p">1080p</option>
                  <option value="1440p">1440p</option>
                  <option value="2160p">2160p (4K)</option>
                  <option value="4320p">4320p (8K)</option>
                </select>
              </span>
            </>
          )}
        </div>

        <Button
          className="reportsButton mt-5"
          variant="secondary"
          size="lg"
          onClick={checkAppliance}
        >
          Next
        </Button>
      </header>
    </div>
  );
}

export default AddAppliancePage;
