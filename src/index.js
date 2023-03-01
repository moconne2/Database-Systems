import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ReportsPage from "./ReportsPage";
import LoginPage from "./LoginPage";
import AddPostalCodePage from "./AddPostalCodePage";
import PostalCodeConfirmationPage from "./PostalCodeConfirmationPage";
import AddPhoneNumberPage from "./AddPhoneNumberPage";
import AddHouseholdDetailsPage from "./AddHouseholdDetailsPage";
import AddBathroomPage from "./AddBathroomPage";
import AddAppliancePage from "./AddAppliancePage";
import Top25PopularManufacturersPage from "./Top25PopularManufacturersPage";
import ManufacturerDrilldownReportPage from "./ManufacturerDrilldownReportPage";
import AverageTVDisplaySizePage from "./AverageTVDisplaySizePage";
import TvStateDrilldownReportPage from "./TvStateDrilldownReportPage";
import ManufacturerModelSearchPage from "./ManufacturerModelSearchPage";
import ExtraFridgeFreezerPage from "./ExtraFridgeFreezerPage";
import LaundryCenterPage from "./LaundryCenterPage";
import BathroomStatisticsPage from "./BathroomStatisticsPage";
import HouseholdAveragesPage from "./HouseholdAveragesPage";
import BathroomListingPage from "./BathroomListingPage";
import ApplianceListingPage from "./ApplianceListingPage";
import SubmissionCompletePage from "./SubmissionCompletePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/ReportsPage" element={<ReportsPage />} />
        <Route path="/AddPostalCodePage" element={<AddPostalCodePage />} />
        <Route
          path="/PostalCodeConfirmationPage"
          element={<PostalCodeConfirmationPage />}
        />

        <Route path="/AddPhoneNumberPage" element={<AddPhoneNumberPage />} />
        <Route
          path="/AddHouseholdDetailsPage"
          element={<AddHouseholdDetailsPage />}
        />
        <Route path="/AddBathroomPage" element={<AddBathroomPage />} />
        <Route path="/BathroomListingPage" element={<BathroomListingPage />} />
        <Route path="/AddAppliancePage" element={<AddAppliancePage />} />
        <Route
          path="/ApplianceListingPage"
          element={<ApplianceListingPage />}
        />
        <Route
          path="/SubmissionCompletePage"
          element={<SubmissionCompletePage />}
        />

        <Route
          path="/Top25PopularManufacturersPage"
          element={<Top25PopularManufacturersPage />}
        />
        <Route
          path="/ManufacturerDrilldownReportPage"
          element={<ManufacturerDrilldownReportPage />}
        />
        <Route
          path="/ManufacturerModelSearchPage"
          element={<ManufacturerModelSearchPage />}
        />
        <Route
          path="/AverageTVDisplaySizePage"
          element={<AverageTVDisplaySizePage />}
        />
        <Route
          path="/TvStateDrilldownReportPage"
          element={<TvStateDrilldownReportPage />}
        />
        <Route
          path="/ExtraFridgeFreezerPage"
          element={<ExtraFridgeFreezerPage />}
        />
        <Route path="/LaundryCenterPage" element={<LaundryCenterPage />} />
        <Route
          path="/BathroomStatisticsPage"
          element={<BathroomStatisticsPage />}
        />

        <Route
          path="/HouseholdAveragesPage"
          element={<HouseholdAveragesPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
