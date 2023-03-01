const express = require("express");
var app = express();
//Configuring express server
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));

const db = require("./config/db");

//Creating GET Router to fetch Top 25 Popular Manufacturersdetails from the MySQL Database
app.get("/Top25PopularManufacturers", (req, res) => {
  db.query(
    `SELECT ManufacturerName, COUNT(*) AS ApplianceCount 
        FROM Appliances GROUP BY ManufacturerName 
        ORDER BY ApplianceCount DESC 
        LIMIT 25;`,
    (err, result, fields) => {
      if (err) throw err;
      return res.json(result);
    }
  );
});

//Creating GET Router to fetch count of Appliances per Manufacturer Name
app.get("/ManufacturerApplianceType/:id", (req, res) => {
  console.log(req.params.id);
  db.query(
    `SELECT ApplianceType, COUNT(*) AS ApplianceCount 
        FROM Appliances WHERE ManufacturerName = ? 
        GROUP BY ApplianceType;`,
    [req.params.id],
    (err, result, fields) => {
      if (err) throw err;
      return res.json(result);
    }
  );
});

//Router to GET specific ManufacturerName Or ModelName
app.get("/ManufacturerModelSearch/:id", (req, res) => {
  console.log(req.params.id);
  db.query(
    `SELECT DISTINCT ManufacturerName, ModelName
            FROM Appliances 
            WHERE (ManufacturerName LIKE CONCAT('%', ?, '%') OR ModelName LIKE CONCAT('%', ?, '%')) AND (ModelName IS NOT NULL)
            ORDER BY ManufacturerName ASC, ModelName ASC`,
    [req.params.id, req.params.id],
    (err, result, fields) => {
      if (err) throw err;
      return res.json(result);
    }
  );
});

//Creating GET Router to fetch Average TV Display By State from the MySQL Database
app.get("/AverageTvDisplaySizeByState", (req, res) => {
  db.query(
    `SELECT pc.State, ROUND(AVG(tv.DisplaySize),2) AS AvgDisplaySize
        FROM TV as tv
        LEFT JOIN Household AS h
        ON tv.Email = h.Email
        LEFT JOIN PostalCode AS pc 
        ON h.PostalCode = pc.PostalCode 
        GROUP BY pc.State 
        ORDER BY pc.State ASC`,
    (err, result, fields) => {
      if (err) throw err;
      return res.json(result);
    }
  );
});

//Creating GET Router to fetch TV Display type, MaxResolution and Averate DisplaySize for a specific state MySQL Database
app.get("/TvDisplayTypeMaxResAvgDisplayState/:id", (req, res) => {
  db.query(
    `SELECT tv.DisplayType, 
            MAX(tv.Resolution) AS MaxResolution, 
            ROUND(AVG(tv.DisplaySize),2) AS AvgDisplaySize
        FROM TV as tv
        LEFT JOIN Household AS h 
        ON tv.Email = h.Email
        LEFT JOIN PostalCode AS pc 
        ON h.PostalCode = pc.PostalCode
        WHERE pc.State = ? 
        GROUP BY DisplayType
        ORDER BY AvgDisplaySize DESC`,
    [req.params.id],
    (err, result, fields) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

// Creating GET Router to fetch the Count of Households with more Multiple freezer/fridge
app.get("/ExtraFridgeHouseholdCount", function (req, res) {
  db.query(
    `SELECT COUNT(*) AS HouseholdCount
        FROM(
            SELECT Email, COUNT(*) AS "RefrigeratorOrFreezerCount" FROM
            RefrigeratorOrFreezer 
            GROUP BY Email 
            HAVING COUNT(*) > 1) sub`,
    [req.params.id],
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
});

// Creating GET Router to fetch Top 10 State by Count of Household with Multiple freezers/fridges including Percentage of Households with Multiple freezer by State with more than 1 freezer/fridge
app.get("/HouseholdPercentageWithMultiFreezerPerState", function (req, res) {
  db.query(
    `SELECT tf.State, tf.HouseholdCount, CEILING(cf.HouseholdCount_with_multiple_Chestfreezers/tf.HouseholdCount * 100) AS PercentageOfHouseholdWithMultipleChestFreezers,
    CEILING(uf.HouseholdCount_with_multiple_Uprightfreezers/tf.HouseholdCount * 100) AS PercentageOfHouseholdWithMultipleUprightFreezers,
    CEILING(ff.HouseholdCount_with_multiple_otherfreezers/tf.HouseholdCount * 100) AS PercentageOfHouseholdWithMultipleOtherFreezers
    FROM ( SELECT State, COUNT(Email) AS HouseholdCount FROM ( SELECT State, Email FROM postalcode p
        JOIN household h ON h.PostalCode=p.PostalCode  WHERE Email IN ( SELECT r.Email FROM  ( SELECT Email, COUNT(*) AS "RefrigeratorOrFreezerCount" FROM RefrigeratorOrFreezer
        GROUP BY Email HAVING COUNT(*) > 1 ) r )) l GROUP BY State ) tf
    LEFT JOIN (SELECT State, HouseholdCount_with_multiple_Chestfreezers FROM
        ( SELECT State, COUNT(Email) AS HouseholdCount_with_multiple_Chestfreezers FROM ( SELECT State, Email FROM postalcode p
            JOIN household h ON h.PostalCode=p.PostalCode WHERE Email 
                IN (SELECT r.Email FROM ( SELECT Email, COUNT(*) AS "RefrigeratorOrFreezerCount" FROM RefrigeratorOrFreezer 
                    WHERE Type="chest freezer" GROUP BY Email HAVING COUNT(*) > 1 ) r )) l GROUP BY State )c ) cf ON cf.State=tf.State
    JOIN (SELECT State, HouseholdCount_with_multiple_Uprightfreezers FROM
            ( SELECT State, COUNT(Email) AS HouseholdCount_with_multiple_Uprightfreezers FROM ( SELECT State, Email FROM postalcode p
                JOIN household h ON h.PostalCode=p.PostalCode WHERE Email 
                    IN (SELECT r.Email FROM ( SELECT Email, COUNT(*) AS "RefrigeratorOrFreezerCount" FROM RefrigeratorOrFreezer 
                        WHERE Type="upright freezer" GROUP BY Email HAVING COUNT(*) > 1 ) r )) l GROUP BY State )c ) uf ON uf.State=tf.State
    LEFT JOIN (SELECT State, HouseholdCount_with_multiple_otherfreezers FROM
            ( SELECT State, COUNT(Email) AS HouseholdCount_with_multiple_otherfreezers FROM ( SELECT State, Email FROM postalcode p
                JOIN household h ON h.PostalCode=p.PostalCode WHERE Email 
                    IN (SELECT r.Email FROM ( SELECT Email, COUNT(*) AS "RefrigeratorOrFreezerCount" FROM RefrigeratorOrFreezer 
                        WHERE Type NOT IN("upright freezer", "chest freezer")  GROUP BY Email HAVING COUNT(*) > 1 ) r )) l GROUP BY State )c ) ff ON ff.State=tf.State
        GROUP BY STATE ORDER BY HouseholdCount DESC LIMIT 10;`,
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
});

// Creating GET Router to fetch Laundry center report displaying washer load type and Dryer heat source. Can Add  MaxHeatSourceCount, MaxLoadingTypeCount
app.get("/StateLaundryReport", function (req, res) {
  db.query(
    `SELECT HeatSource.State, CommonHeatSource, CommonLoadingType
            FROM ( SELECT mhs.State, HeatSource AS CommonHeatSource, MaxHeatSourceCount
            FROM (SELECT State, Max(HeatSourceCount) AS MaxHeatSourceCount
            FROM ( SELECT State, HeatSource, COUNT(HeatSource) AS HeatSourceCount
                    FROM ( SELECT State, Email, h.PostalCode FROM household h JOIN postalcode p ON p.PostalCode=h.PostalCode ) hp
                    LEFT JOIN ( SELECT Email, HeatSource  FROM Dryer ) d  ON d.Email = hp.Email
                    WHERE HeatSource IS NOT NULL
                    GROUP BY State, HeatSource ORDER BY State ) l GROUP BY State ) mhs
            INNER JOIN( SELECT State, HeatSource, COUNT(HeatSource) AS HeatSourceCount
                    FROM ( SELECT State, Email, h.PostalCode FROM household h JOIN postalcode p ON p.PostalCode=h.PostalCode ) hp
                    LEFT JOIN ( SELECT Email, HeatSource  FROM Dryer ) d  ON d.Email = hp.Email
                    WHERE HeatSource IS NOT NULL
                    GROUP BY State, HeatSource ORDER BY State ) hs ON hs.State=mhs.State AND hs.HeatSourceCount=mhs.MaxHeatSourceCount ) heatSource
            JOIN ( SELECT lc.State, lt.LoadingType AS CommonLoadingType, MaxLoadingTypeCount
            FROM ( SELECT State, max(LoadingTypeCount) AS MaxLoadingTypeCount
            FROM ( SELECT State, LoadingType , COUNT(LoadingType) AS LoadingTypeCount
                    FROM ( SELECT State, Email, h.PostalCode FROM household h JOIN postalcode p ON p.PostalCode=h.PostalCode ) hp
                    LEFT JOIN ( SELECT Email, LoadingType FROM Washer ) w ON w.Email = hp.Email
                    WHERE LoadingType IS NOT NULL
                    GROUP BY State, LoadingType ORDER BY State ) c
                    GROUP BY State ) lc
            LEFT JOIN ( SELECT State, LoadingType , COUNT(LoadingType) AS LoadingTypeCount
                    FROM ( SELECT State, Email, h.PostalCode FROM household h JOIN postalcode p ON p.PostalCode=h.PostalCode ) hp
                    LEFT JOIN ( SELECT Email, LoadingType FROM Washer ) w ON w.Email = hp.Email
                    WHERE LoadingType IS NOT NULL
                    GROUP BY State, LoadingType ORDER BY State ) lt ON lt.State=lc.State AND lt.LoadingTypeCount=lc.MaxLoadingTypeCount ) LoadType ON LoadType.State = HeatSource.State`,
    function (error, results, fields) {
      if (error) throw error;
      return res.json(results);
    }
  );
});

// Creating GET Router to fetch Household Count by State where household has washer but not Dryer
app.get("/HouseholdCountWithoutDryer", function (req, res) {
  db.query(
    `WITH cte AS (
            SELECT p.State, w.Email
            FROM Washer AS w
            LEFT JOIN Household AS h
            ON w.Email = h.Email
            LEFT JOIN PostalCode p
            ON h.PostalCode = p.PostalCode
        )
        SELECT State, COUNT(Email) AS HouseholdCount
        FROM cte
        WHERE cte.Email NOT IN (SELECT Email FROM Dryer)
        GROUP BY State
        ORDER BY COUNT(Email) DESC`,
    function (error, results, fields) {
      if (error) throw error;
      return res.json(results);
    }
  );
});

/**
 * Creating GET Router to fetch Bathroom statistics
 * */
app.get("/BathroomStatistics/All", (req, res) => {
  db.query(
    `SELECT MIN(ba.BathroomCount) AS MinimumCountAllBathroom, 
            ROUND(AVG(ba.BathroomCount), 1) AS AverageCountOfAllBathrooms, 
            MAX(ba.BathroomCount ) AS MaximumCountOfAllBathrooms
	    FROM (
            SELECT Email, COUNT(*) AS BathroomCount 
            FROM Bathroom 
            GROUP BY Email) ba;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Full", (req, res) => {
  db.query(
    `SELECT MIN(bf.BathroomCount) AS MinimumCountOfFull, 
            ROUND(AVG(bf.BathroomCount), 1) AS AverageCountOfFull, 
            MAX(bf.BathroomCount) AS MaximumCountOfFull
        FROM (
            SELECT Email, COUNT(*) AS BathroomCount 
            FROM Bathroom 
            WHERE BathroomType='Full' 
            GROUP BY Email) bf;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Half", (req, res) => {
  db.query(
    `SELECT MIN(bh.BathroomCount) AS MinimumCountOfHalf, 
            ROUND(AVG(bh.BathroomCount), 1) AS AverageCountOfHalf, 
            MAX(bh.BathroomCount ) AS MaximumCountOfHalf
            FROM (
                SELECT Email, COUNT(*) AS BathroomCount 
                FROM Bathroom 
                WHERE BathroomType='Half' 
                GROUP BY Email) bh;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Commode", (req, res) => {
  db.query(
    `SELECT MIN(bp.CommodesCount ) AS MinimumCountOfCommodes, 
            ROUND(AVG(bp.CommodesCount ), 1) AS AverageCountOfCommodes, 
            MAX(bp.CommodesCount ) AS MaximumCountOfCommodes
            FROM (
                SELECT Email, SUM(Commodes) AS CommodesCount 
                FROM Bathroom 
                GROUP BY Email) bp;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Sink", (req, res) => {
  db.query(
    `SELECT MIN(s.SinkCount) AS MinimumCountOfSinks, 
            ROUND(AVG(s.SinkCount), 1) AS AverageCountOfSinks, 
            MAX(s.SinkCount) AS MaximumCountOfSinks
            FROM (
                SELECT Email, SUM(Sinks) AS SinkCount 
                FROM Bathroom 
                GROUP BY Email ) s;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Bidet", (req, res) => {
  db.query(
    `SELECT MIN(bp.bidetsCount) AS MinimumBidetsCount, 
            ROUND(AVG(bp.bidetsCount), 1) AS AverageBidetsCount, 
            MAX(bp.bidetsCount ) AS MaximumBidetsCount
            FROM ( 
                SELECT Email, SUM(Bidets ) 
                AS bidetsCount 
                FROM Bathroom GROUP BY Email ) bp;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Bathtub", (req, res) => {
  db.query(
    `SELECT MIN(bp.bathtubCount) AS MinimumBathtubCount, 
            ROUND(AVG(bp.bathtubCount), 1) AS AverageBathtubCount, 
            MAX(bp.bathtubCount ) AS MaximumBathtubCount
            FROM ( 
                SELECT Email, SUM(Bathtubs) AS bathtubCount 
                FROM Bathroom 
                GROUP BY Email ) bp;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/Shower", (req, res) => {
  db.query(
    `SELECT MIN(bp.showersCounts) AS MinimumShowerCount, 
            ROUND(AVG(bp.showersCounts), 1) AS AverageShowerCount, 
            MAX(bp.showersCounts) AS MaximumShowerCount
            FROM (
                SELECT Email, SUM(Showers ) AS showersCounts 
                FROM Bathroom 
                GROUP BY Email) bp;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/TubShower", (req, res) => {
  db.query(
    `SELECT MIN(ts.tub_showersCounts) AS MinimumTubShowerCount, 
            ROUND(AVG(ts.tub_showersCounts), 1) AS AverageTubShowerCount, 
            MAX(ts.tub_showersCounts ) AS MaximumTubShowerCount
            FROM (
                SELECT Email, SUM(\`Tub/Showers\`) AS "tub_showersCounts" 
                FROM Bathroom 
                GROUP BY Email ) ts;`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/StateWithMostBidets", (req, res) => {
  db.query(
    `SELECT State, SUM(Bidets) as StateTotalBidetCount
        FROM Bathroom as b
        LEFT JOIN HouseHold AS h
        ON b.Email = h.Email
        LEFT JOIN PostalCode AS pc
        ON pc.PostalCode = h.PostalCode
        GROUP BY State
        ORDER BY SUM(Bidets) DESC
        LIMIT 1`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/PostalCodeWithMostBidets", (req, res) => {
  db.query(
    `SELECT PostalCode, SUM(Bidets) as PostalCodeTotalBidetCount
        FROM Bathroom as b
        LEFT JOIN HouseHold AS h
        ON b.Email = h.Email
        GROUP BY PostalCode
        ORDER BY SUM(Bidets) DESC
        LIMIT 1`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

app.get("/BathroomStatistics/HouseholdWithOnlyOneBathroom", (req, res) => {
  db.query(
    `SELECT COUNT(Email) AS CountOfHouseholdWithOnlyPrimaryBathroom
        FROM Bathroom 
        WHERE PrimaryBathroom=1 AND Email NOT IN (
            SELECT Email 
            FROM( 
                SELECT DISTINCT Email
                FROM Bathroom 
                WHERE PrimaryBathroom !=1 
                ) u 
        )`,
    (err, result) => {
      if (err) throw err;
      return res.json(result[0]);
    }
  );
});

let validatePostalCode = async function (postalCode) {
  const query = `SELECT COUNT(*) cnt FROM PostalCode WHERE PostalCode = ?`;
  const result = await new Promise((resolve, reject) => {
    db.query(query, [postalCode], (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
  return result[0].cnt === 0 ? false : true;
};

app.post("/HouseholdAverageByRadius", async (req, res) => {
  const postalCodeExist = await validatePostalCode(req.body.postalCode);
  console.log(postalCodeExist);
  if (!postalCodeExist) {
    res.status(400).send({ message: "Postal code does not exist" });
  }
  db.query(
    `WITH center_coordinates AS (
            SELECT Longitude, Latitude
            FROM PostalCode
            WHERE PostalCode = ?
        ), 
        postal_codes_in_range AS (
            SELECT PostalCode
            FROM PostalCode
            WHERE
            3958.75 * 2 * atan2(
            SQRT(
            POWER((radians(Latitude) - (SELECT radians(Latitude) FROM
            center_coordinates)) / 2, 2)
            + cos((SELECT radians(Latitude) FROM center_coordinates))
            * cos(radians(Latitude))
            * POWER((radians(Longitude) - (SELECT radians(Longitude)
            FROM center_coordinates)) / 2, 2)),
            SQRT(
            1 - POWER((radians(Latitude) - (SELECT radians(Latitude)
            FROM center_coordinates)) / 2, 2)
            + cos((SELECT radians(Latitude) FROM center_coordinates))
            * cos(radians(Latitude))
            * POWER((radians(Longitude) - (SELECT radians(Longitude)
            FROM center_coordinates)) / 2, 2))
            ) <= ?
        ),
        household_averages AS (
            SELECT
            PostalCode,
            round(AVG(number_of_bedrooms), 1) as avg_bedrooms_per_household,
            round(AVG(number_of_occupants), 0) as avg_occupants_per_household
            FROM(
                SELECT h.Email, p.PostalCode,
                SUM(Bedrooms) as number_of_bedrooms,
                SUM(Occupants) as number_of_occupants
                FROM PostalCode as p
                JOIN Household as h
                ON p.PostalCode= h.PostalCode
                GROUP BY p.PostalCode, Email)
            AS household_info
            GROUP BY PostalCode
        ),
        household_bathnum_averages AS (
            SELECT 
            PostalCode, 
            ROUND(AVG(Bathrooms), 1) AS avg_bathroom_per_household
            FROM(
                SELECT PostalCode, b.Email, COUNT(*) AS Bathrooms
                FROM Bathroom b 
                LEFT JOIN Household h 
                ON h.Email = b.Email 
                GROUP BY PostalCode, b.Email) ba
            GROUP BY PostalCode 
        ),
        commode_ratio as (
            SELECT
                PostalCode,
                CASE WHEN Commodes = 0 THEN CONCAT('0:', ROUND(Occupants, 2)) ELSE CONCAT('1:', ROUND(Occupants/Commodes, 2)) END AS commode_ratio
            FROM (
                SELECT
                PostalCode,
                SUM(Commodes) as Commodes,
                SUM(Occupants) as Occupants
                FROM Bathroom as b
                LEFT JOIN Household as h
                ON b.Email = h.Email
                GROUP BY PostalCode
            ) sub
        ),
        average_appliance_counts as (
            SELECT PostalCode, round(AVG(appliance_count), 1) AS average_number_of_appliances
            FROM(
                SELECT PostalCode, a.Email, COUNT(*) as appliance_count
                FROM Appliances as a
                JOIN Household as h
                ON a.Email = h.Email
                GROUP BY PostalCode, a.Email
            ) AS appliance_counts
            GROUP BY PostalCode 
        ), 
        total_heat_source_count as (
            SELECT PostalCode, HeatSource, SUM(HeatSourseCount) AS TotalHeatSourceCount
            FROM (
                SELECT PostalCode, HeatSource, COUNT(HeatSource) AS HeatSourseCount 
                    FROM Dryer AS d
                    JOIN Household AS h
                    ON d.Email = h.Email
                    GROUP BY PostalCode, HeatSource
                UNION
                SELECT PostalCode, OvenHeatSource AS HeatSource, COUNT(OvenHeatSource) AS HeatSourseCount 
                    FROM Cooker as c
                    JOIN Household AS h
                    ON c.Email = h.Email
                    GROUP BY PostalCode, OvenHeatSource 
                UNION 
                SELECT PostalCode, CooktopHeatSource AS HeatSource, COUNT(CooktopHeatSource) AS HeatSourseCount 
                    FROM Cooker as c
                    JOIN Household AS h
                    ON c.Email = h.Email
                    GROUP BY PostalCode, CooktopHeatSource 
                ) s
            GROUP BY PostalCode, HeatSource
        ), heat_source_rank as (
            select PostalCode, HeatSource, RANK() OVER (PARTITION BY PostalCode ORDER BY TotalHeatSourceCount DESC) as MostCommonHeatSource
            from total_heat_source_count
        ), most_common_heat_source as (
            select PostalCode, HeatSource AS most_common_heat_source
            from heat_source_rank
            where MostCommonHeatSource = 1
        )
        SELECT 
            pcir.PostalCode,
            avg_bedrooms_per_household, 
            avg_occupants_per_household,
            avg_bathroom_per_household,
            commode_ratio,
            average_number_of_appliances,
            most_common_heat_source
        FROM postal_codes_in_range AS pcir
        LEFT JOIN household_averages AS ha
        ON pcir.PostalCode = ha.PostalCode
        LEFT JOIN household_bathnum_averages hba 
        ON pcir.PostalCode = hba.PostalCode
        LEFT JOIN commode_ratio AS cr
        ON pcir.PostalCode = cr.PostalCode
        LEFT JOIN average_appliance_counts AS aac 
        ON pcir.PostalCode = aac.PostalCode
        LEFT JOIN most_common_heat_source AS mchs
        ON pcir.PostalCode = mchs.PostalCode;
        `,
    [req.body.postalCode, req.body.radius],
    (err, result) => {
      if (err) throw err;
      return res.json(result);
    }
  );
});

module.exports = app;
