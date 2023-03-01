import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

function BathroomStatisticsPage() {
  const [bathroomDataAll, setBathroomDataAll] = useState({});
  const [bathroomDataFull, setBathroomDataFull] = useState({});
  const [bathroomDataHalf, setBathroomDataHalf] = useState({});
  const [commodeData, setCommodeData] = useState({});
  const [sinkData, setSinkData] = useState({});
  const [bidetData, setBidetData] = useState({});
  const [bathtubData, setBathtubData] = useState({});
  const [showerData, setShowerData] = useState({});
  const [tubShowerData, setTubShowerData] = useState({});
  const [stateWithMostBidetsData, setStateWithMostBidetsData] = useState({});
  const [postalCodeWithMostBidetsData, setPostalCodeWithMostBidetsData] =
    useState({});
  const [
    householdWithOnlyOneBathroomData,
    setHouseholdWithOnlyOneBathroomData,
  ] = useState({});

  useEffect(() => {
    Axios.get("http://localhost:3001/report/BathroomStatistics/All").then(
      (resp) => {
        setBathroomDataAll(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Full").then(
      (resp) => {
        setBathroomDataFull(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Half").then(
      (resp) => {
        setBathroomDataHalf(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Commode").then(
      (resp) => {
        setCommodeData(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Sink").then(
      (resp) => {
        setSinkData(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Bidet").then(
      (resp) => {
        setBidetData(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Bathtub").then(
      (resp) => {
        setBathtubData(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/Shower").then(
      (resp) => {
        setShowerData(resp.data);
      }
    );
    Axios.get("http://localhost:3001/report/BathroomStatistics/TubShower").then(
      (resp) => {
        setTubShowerData(resp.data);
      }
    );
    Axios.get(
      "http://localhost:3001/report/BathroomStatistics/StateWithMostBidets"
    ).then((resp) => {
      setStateWithMostBidetsData(resp.data);
    });
    Axios.get(
      "http://localhost:3001/report/BathroomStatistics/PostalCodeWithMostBidets"
    ).then((resp) => {
      setPostalCodeWithMostBidetsData(resp.data);
    });
    Axios.get(
      "http://localhost:3001/report/BathroomStatistics/HouseholdWithOnlyOneBathroom"
    ).then((resp) => {
      setHouseholdWithOnlyOneBathroomData(resp.data);
    });
  }, {});

  return (
    <div className="App">
      <header className="App-header">
        <p>Bathroom Statistics</p>
        <div className="mt-3">
          <p>
            Min Count of All Bathrooms per Household:{" "}
            {bathroomDataAll.MinimumCountAllBathroom}
          </p>
          <p>
            Avg Count of All Bathrooms per Household:{" "}
            {bathroomDataAll.AverageCountOfAllBathrooms}
          </p>
          <p>
            Max Count of All Bathrooms per Household:{" "}
            {bathroomDataAll.MaximumCountOfAllBathrooms}
          </p>
          <hr />
          <p>
            Min Count of Half Bathrooms per Household:{" "}
            {bathroomDataHalf.MinimumCountOfHalf}
          </p>
          <p>
            Avg Count of Half Bathrooms per Household:{" "}
            {bathroomDataHalf.AverageCountOfHalf}
          </p>
          <p>
            Max Count of Half Bathrooms per Household:{" "}
            {bathroomDataHalf.MaximumCountOfHalf}
          </p>
          <hr />
          <p>
            Min Count of Full Bathrooms per Household:{" "}
            {bathroomDataFull.MinimumCountOfFull}
          </p>
          <p>
            Avg Count of Full Bathrooms per Household:{" "}
            {bathroomDataFull.AverageCountOfFull}
          </p>
          <p>
            Max Count of Full Bathrooms per Household:{" "}
            {bathroomDataFull.MaximumCountOfFull}
          </p>
          <hr />
          <p>
            Min Count of Commodes per Household:{" "}
            {commodeData.MinimumCountOfCommodes}
          </p>
          <p>
            Avg Count of Commodes per Household:{" "}
            {commodeData.AverageCountOfCommodes}
          </p>
          <p>
            Max Count of Commodes per Household:{" "}
            {commodeData.MaximumCountOfCommodes}
          </p>
          <hr />
          <p>
            Min Count of Sinks per Household: {sinkData.MinimumCountOfSinks}
          </p>
          <p>
            Avg Count of Sinks per Household: {sinkData.AverageCountOfSinks}
          </p>
          <p>
            Max Count of Sinks per Household: {sinkData.MaximumCountOfSinks}
          </p>
          <hr />
          <p>
            Min Count of Bidets per Household: {bidetData.MinimumBidetsCount}
          </p>
          <p>
            Avg Count of Bidets per Household: {bidetData.AverageBidetsCount}
          </p>
          <p>
            Max Count of Bidets per Household: {bidetData.MaximumBidetsCount}
          </p>
          <hr />
          <p>
            Min Count of Bathtubs per Household:{" "}
            {bathtubData.MinimumBathtubCount}
          </p>
          <p>
            Avg Count of Bathtubs per Household:{" "}
            {bathtubData.AverageBathtubCount}
          </p>
          <p>
            Max Count of Bathtubs per Household:{" "}
            {bathtubData.MaximumBathtubCount}
          </p>
          <hr />
          <p>
            Min Count of Showers per Household: {showerData.MinimumShowerCount}
          </p>
          <p>
            Avg Count of Showers per Household: {showerData.AverageShowerCount}
          </p>
          <p>
            Max Count of Showers per Household: {showerData.MaximumShowerCount}
          </p>
          <hr />
          <p>
            Min Count of Tub/Showers per Household:{" "}
            {tubShowerData.MinimumTubShowerCount}
          </p>
          <p>
            Avg Count of Tub/Showers per Household:{" "}
            {tubShowerData.AverageTubShowerCount}
          </p>
          <p>
            Max Count of Tub/Showers per Household:{" "}
            {tubShowerData.MaximumTubShowerCount}
          </p>
          <hr />
          <p>State with most Bidets: {stateWithMostBidetsData.State}</p>
          <p>
            Number of Bidets in State:{" "}
            {stateWithMostBidetsData.StateTotalBidetCount}
          </p>
          <hr />
          <p>
            Postal Code with Most Bidets:{" "}
            {postalCodeWithMostBidetsData.PostalCode}
          </p>
          <p>
            Number of Bidets in Postal Code:{" "}
            {postalCodeWithMostBidetsData.PostalCodeTotalBidetCount}
          </p>
          <hr />
          <p>
            Count of Households with only a Single Primary Bathroom:{" "}
            {
              householdWithOnlyOneBathroomData.CountOfHouseholdWithOnlyPrimaryBathroom
            }
          </p>
        </div>

        <Link to="/">
          <Button className="reportsButton" variant="secondary" size="lg">
            Go Back
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default BathroomStatisticsPage;
