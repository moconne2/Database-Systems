const express = require("express");
const report = require("./report.js");
const db = require("./config/db");
const cors = require("cors");

const app = express();
app.use("/report", report);
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Route for entering email
app.post("/LoginPage", (req, res) => {
  const email = req.body.Email;
  db.query(
    "SELECT COUNT(*) AS cnt FROM Household WHERE Email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      if (result[0].cnt > 0) {
        const err = "Email " + email + " already exists";
        return res.status(400).send({ statusCode: 400, error: err });
      } else {
        return res.json({ statusCode: 200 });
      }
    }
  );
});

// Route to postal code
app.post("/PostalCode", (req, res) => {
  const postalCode = req.body.PostalCode;

  db.query(
    "SELECT PostalCode, City, State FROM PostalCode WHERE PostalCode = ?;",
    [postalCode],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.json(err);
      }
      const len = result.length;
      if (len === 1) {
        return res.json(result[0]);
      } else if (len === 0) {
        const err = "Postal code " + postalCode + " does not exist";
        console.error(err);
        return res.status(400).send({ statusCode: 400, error: err });
      }
    }
  );
});

// Route to phone number
app.post("/PhoneNumber", (req, res) => {
  const query = `SELECT AreaCode, Number, NumberType FROM PhoneNumber WHERE
        AreaCode = ? AND Number = ?;`;
  const areaCode = req.body.areaCode;
  const number = req.body.Number;
  db.query(query, [areaCode, number], (err, result) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }
    const len = result.length;
    if (len === 1) {
      const err = "Phone number " + areaCode + "-" + number + " already exists";
      console.error(err);
      return res.status(400).send({ statusCode: 400, error: err });
    } else if (len === 0) {
      return res.json({ statusCode: 200 });
    }
  });
});

// Route to inject phone number
app.post("/PhoneNumberUpsert", (req, res) => {
  const query = `INSERT INTO PhoneNumber(Email, AreaCode, Number, NumberType)
    VALUES(?, ?, ?, ?)`;
  db.query(
    query,
    [req.body.Email, req.body.AreaCode, req.body.Number, req.body.NumberType],
    (err, result) => {
      if (err) throw err;
      res.status(200).json();
    }
  );
});

// Route to household info
app.post("/HouseholdInfo", (req, res) => {
  const query = `INSERT INTO Household(Email, HouseholdType, PostalCode, 
        SquareFeet, Occupants, Bedrooms)
        VALUES(?, ?, ?, ?, ?, ?);`;
  const email = req.body.Email;
  const houseType = req.body.HouseholdType;
  const postalCode = req.body.PostalCode;
  const sqFt = req.body.SquareFeet;
  const occupants = req.body.Occupants;
  const bedrooms = req.body.Bedrooms;

  db.query(
    query,
    [email, houseType, postalCode, sqFt, occupants, bedrooms],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).send({ statusCode: 400, error: err.sqlMessage });
      }
      return res.json({ statusCode: 200 });
    }
  );
});

let getMaxBathId = async function (email) {
  const query = `SELECT COUNT(*) cnt FROM Bathroom WHERE Email = ?`;
  const result = await new Promise((resolve, reject) =>
    db.query(query, [email], (err, result) => {
      err ? reject(err) : resolve(result);
    })
  );
  return result[0].cnt;
};

let primaryBathCnt = async function (email) {
  const query = `SELECT COUNT(*) cnt FROM Bathroom 
        WHERE Email = ? AND PrimaryBathroom = 1`;
  const result = await new Promise((resolve, reject) =>
    db.query(query, [email], (err, result) => {
      err ? reject(err) : resolve(result);
    })
  );
  return result[0].cnt;
};

// Route to bathroom
app.post("/Bathroom", async (req, res) => {
  // check how many bathrooms are associated with the current email
  // and assign bathroom id
  const email = req.body.Email;
  const bathroomId = await getMaxBathId(email);
  console.log("current bathroomId is ", bathroomId);

  // check if there is already a primary bathroom; if there is, then the curr
  // selection cannot be a primary bath;
  const sinks = req.body.Sinks;
  const commodes = req.body.Commodes;
  const bidets = req.body.Bidets;
  const primaryBath = req.body.PrimaryBathroom;

  if (primaryBath === true) {
    const primaryCnt = await primaryBathCnt(email);
    if (primaryCnt >= 1) {
      let err = "primary bathroom already exists";
      console.error(err);
      return res.status(400).send({ statusCode: 400, error: err });
    }
  }
  // If current selection is half bath,
  // then make sure it has at least one bath, commode and bidet.
  const bathroomType = req.body.BathroomType;
  if (bathroomType === "Half") {
    if (sinks + commodes + bidets < 1) {
      let err = "There must be at least one sink, bidet, or commode";
      console.error(err);
      return res.status(400).send({ statusCode: 400, error: err });
    }
  }
  // Optional BathroomName for half bath
  const bathroomName = req.body.BathroomName;
  // upsert bathroom to db
  const bathtubs = req.body.Bathtubs;
  const showers = req.body.Showers;
  const tubShowers = req.body.TubShowers;

  // If current selection is half bath,
  // then make sure it has at least one bath, commode and bidet.
  if (bathroomType === "Full") {
    if (bathtubs + showers + tubShowers < 1) {
      let err = "There must be at least one bathtub, shower, or tub/shower";
      console.error(err);
      return res.status(400).send({ statusCode: 400, error: err });
    }
  }
  const query = `INSERT INTO Bathroom(Email, BathroomID, BathroomType, Sinks, 
        Commodes, Bidets, Bathtubs, Showers, \`Tub/Showers\`, PrimaryBathroom, BathroomName) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  db.query(
    query,
    [
      email,
      bathroomId + 1,
      bathroomType,
      sinks,
      commodes,
      bidets,
      bathtubs,
      showers,
      tubShowers,
      primaryBath,
      bathroomName,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.json(err);
      }
      return res.json(result);
    }
  );
});

app.post("/BathroomList", (req, res) => {
  const query = `SELECT BathroomID as "BathroomId", BathroomType as "Type", PrimaryBathroom as "Primary"
        FROM Bathroom WHERE Email = ?`;
  db.query(query, [req.body.Email], (err, result) => {
    if (err) {
      console.error(err);
      res.json(err);
    }
    console.log(result);
    return res.json(result);
  });
});

let getMaxAppId = async function (email) {
  const query = `SELECT COUNT(*) cnt FROM Appliances WHERE Email = ?`;
  const result = await new Promise((resolve, reject) =>
    db.query(query, [email], (err, result) => {
      err ? reject(err) : resolve(result);
    })
  );
  return result[0].cnt;
};

// Route to manufacturer list
app.get("/ManufacturerList", (req, res) => {
  db.query(`SELECT * FROM Manufacturer`, (err, result) => {
    if (err) throw err;
    return res.json(result);
  });
});

// Route to check manufacturer + model name combo
app.post("/ManufacturerModelCombo", (req, res) => {
  if (req.body.ModelName) {
    db.query(
      `SELECT COUNT(*) cnt FROM Appliances WHERE ManufacturerName = ? AND ModelName = ?;`,
      [req.body.ManufacturerName, req.body.ModelName],
      (err, result) => {
        if (err) throw err;
        if (result[0].cnt === 0) {
          return res.status(400).json({
            message: "Manufacturer and model combination does not exist",
          });
        }
        return res.status(200).json({});
      }
    );
  } else {
    return res.status(200).json({});
  }
});

// Route to appliances
app.post("/Appliances", async (req, res) => {
  // check how many appliances are associated with the current email
  // and assign appliance id
  const email = req.body.Email;
  const applianceId = await getMaxAppId(email);
  console.log("current ApplianceId is ", applianceId);

  // Appliance Types: RefrigeratorOrFreezer, Cooker, Washer, Dryer, and TV
  const applianceType = req.body.ApplianceType;
  const manufacturerName = req.body.ManufacturerName;
  const modelName = req.body.ModelName;

  const query = `INSERT INTO Appliances(Email, ApplianceID, ApplianceType, 
            ManufacturerName, ModelName) 
            VALUES (?, ?, ?, ?, ?);`;
  db.query(
    query,
    [email, applianceId + 1, applianceType, manufacturerName, modelName],
    (err, result) => {
      if (err) {
        console.error(err);
        res.json(err);
      }
      return res.json(result);
    }
  );

  if (applianceType == "RefrigeratorOrFreezer") {
    // RefrigeratorOrFreezer Types: Bottom freezer refrigerator, French door refrigerator,
    //side-by-side refrigerator, top freezer refrigerator, chest freezer, or upright freezer.
    const type = req.body.Type;
    const query = `INSERT INTO RefrigeratorOrFreezer(Email, ApplianceID, Type) 
                VALUES (?, ?, ?);`;

    db.query(query, [email, applianceId + 1, type]);
  }
  if (applianceType == "Cooker") {
    // Cooker Types: Oven, Cooktop, or Cooktop and Oven
    const cookerType = req.body.CookerType;
    if (cookerType == "Oven") {
      // Oven Heat Source Types: gas, electric and/or microwave (have to look at approach
      // for adding multiple heat source types and how to store it)
      const ovenHeatSource = req.body.OvenHeatSource;
      // Oven Types: Convention or Conventional
      const ovenType = req.body.OvenType;
      const query = `INSERT INTO Cooker(Email, ApplianceID, CookerType, 
                            OvenHeatSource, OvenType) 
                            VALUES (?, ?, ?, ?, ?);`;

      db.query(query, [
        email,
        applianceId + 1,
        cookerType,
        ovenHeatSource,
        ovenType,
      ]);
    }
    if (cookerType == "Cooktop") {
      // Cooktop Heat Source Types: gas, electric, randiant electric, or induction
      const cooktopHeatSource = req.body.CooktopHeatSource;
      const query = `INSERT INTO Cooker(Email, ApplianceID, CookerType, 
                            CooktopHeatSource) 
                            VALUES (?, ?, ?, ?);`;

      db.query(query, [email, applianceId + 1, cookerType, cooktopHeatSource]);
    }
    if (cookerType == "Both") {
      // Oven Heat Source Types: gas, electric and/or microwave (have to look at approach
      // for adding multiple heat source types and how to store it)
      const ovenHeatSource = req.body.OvenHeatSource;
      // Oven Types: Convention or Conventional
      const ovenType = req.body.OvenType;
      // Cooktop Heat Source Types: gas, electric, randiant electric, or induction
      const cooktopHeatSource = req.body.CooktopHeatSource;
      const query = `INSERT INTO Cooker(Email, ApplianceID, CookerType, 
                        OvenHeatSource, OvenType, CooktopHeatSource) 
                        VALUES (?, ?, ?, ?, ?, ?);`;

      db.query(query, [
        email,
        applianceId + 1,
        cookerType,
        ovenHeatSource,
        ovenType,
        cooktopHeatSource,
      ]);
    }
  }
  if (applianceType == "Washer") {
    // Washer Loading Types: Front or Top.
    const loadingType = req.body.LoadingType;
    const query = `INSERT INTO Washer(Email, ApplianceID, LoadingType) 
                VALUES (?, ?, ?);`;

    db.query(query, [email, applianceId + 1, loadingType]);
  }
  if (applianceType == "Dryer") {
    // Dryer Heat Source: gas, electric or none.
    const heatSource = req.body.HeatSource;
    const query = `INSERT INTO Dryer(Email, ApplianceID, HeatSource) 
                VALUES (?, ?, ?);`;

    db.query(query, [email, applianceId + 1, heatSource]);
  }
  if (applianceType == "TV") {
    // Display Type: tube, DLP, plasma ,LCD, or LED.
    const displayType = req.body.DisplayType;
    // Display Size in fractional inches (to the tenth of an inch)
    const displaySize = req.body.DisplaySize;
    // Max Resolution: 480i, 576i, 720p, 1080i, 1080p, 1440p, 2160p (4k), or 4320p (8k)
    const resolution = req.body.Resolution;
    const query = `INSERT INTO TV(Email, ApplianceID, DisplayType, DisplaySize, Resolution) 
                VALUES (?, ?, ?, ?, ?);`;

    db.query(query, [
      email,
      applianceId + 1,
      displayType,
      displaySize,
      resolution,
    ]);
  }
});

app.post("/ApplianceList", (req, res) => {
  query = `SELECT ApplianceID as "ApplianceID", ApplianceType as "Type", ManufacturerName as "Manufacturer", ModelName as "Model"
        FROM Appliances WHERE Email = ?;`;
  db.query(query, [req.body.Email], (err, result) => {
    if (err) {
      console.error(err);
      res.json(err);
    }
    return res.json(result);
  });
});

const port = 3001;
app.listen(port, () => {
  console.log("Server is listening " + port);
});
