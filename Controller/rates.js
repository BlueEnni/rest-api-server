const csv = require('csv-parser');
const e = require('express');
const fs = require('fs')
const results = [];
const path = require('path')
const db = require('../db/database')

/**
 * Rate with all properties.
 * @typedef {{id: Number, tarifName: string, plz: string, fixkosten: Number, variableKosten: Number, deactivatedAt: Date }} Rate
 */


/**
 * Patches one rates.
 * @function
 * @async
 * @param req {e.Request}
 * @param res {e.Response}
 * @param next {e.NextFunction}
 * @returns {any}
 */
exports.patchRate = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const err = new Error("Id muss eine Zahl sein");
      err.statusCode = 400;
      return next(err)
    }

    const rates = await db.query(`
      SELECT id, tarifName, plz, fixkosten, variableKosten
      FROM rates
      WHERE deactivatedAt IS NULL
      AND id = ?
    `, id);

    if (rates.length === 0) {
      err.sendStatus(404)
    }

    const { tarifName, plz, fixkosten, variableKosten } = req.body;

    /**
     * Rate to be edited
     * @type {Rate}
     */
    let rate = rates.shift();

    if ("tarifName" in req.body) rate.tarifName = tarifName;
    if ("plz" in req.body) rate.plz = plz;
    if ("fixkosten" in req.body) rate.fixkosten = fixkosten;
    if ("variableKosten" in req.body) rate.variableKosten = variableKosten;

    await db.query(`
    UPDATE rates
    SET tarifName = ?
    , plz = ?
    , fixkosten = ?
    , variableKosten = ?
    WHERE id = ?
    AND deactivatedAt IS NULL
    `, [ rate.tarifName, rate.plz, rate.fixkosten, rate.variableKosten, rate.id ]);

    res.status(200).send("Rate wurde geändert!");

  } catch (e) {
    next(new Error())
  }
}

/**
 * Deletes one rates.
 * @function
 * @async
 * @param req {e.Request}
 * @param res {e.Response}
 * @param next {e.NextFunction}
 * @returns {any}
 */
exports.deleteRate = async (req, res, next) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      const err = new Error("Id muss eine Zahl sein");
      err.statusCode = 400;
      return next(err)
    }

    const result = await db.query(`
    UPDATE rates
    SET deactivatedAt = ?
    WHERE id = ?
    AND deactivatedAt IS NULL
    `, [ new Date(), id ]);

    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }

    res.status(200).send("Rate wurde gelöscht!");

  } catch (e) {
    const err = new Error()
    err.statusCode = 500;
    next(err)
  }
}

/**
 * Returns one rates.
 * @function
 * @async
 * @param req {e.Request}
 * @param res {e.Response}
 * @param next {e.NextFunction}
 * @returns {any}
 */
exports.getRateDetails = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const err = new Error("Id muss eine Zahl sein");
      err.statusCode = 400;
      return next(err)
    }

    const rates = await db.query(`
      SELECT id, tarifName, plz, fixkosten, variableKosten
      FROM rates
      WHERE deactivatedAt IS NULL
      AND id = ?
    `, id);

    if (rates.length === 0) {
      res.sendStatus(404)
    }

    const rate = rates.shift();

    res.json(rate);
  } catch (e) {
    const err = new Error()
    err.statusCode = 500;
    next(err)
  }
}

/**
 * Returns one rates.
 * @function
 * @async
 * @param req {e.Request}
 * @param res {e.Response}
 * @param next {e.NextFunction}
 * @returns {any}
 */
exports.getRateByEnergyAmountAndPlz = async (req, res, next) => {
  try {
    const amount = Number(req.query.amount);
    const plz = Number(req.query.plz);

    if (isNaN(plz)) {
      const err = new Error("PLZ muss eine Zahl sein");
      err.statusCode = 400;
      return next(err)
    }

    if (isNaN(amount)) {
      const err = new Error("Strommenge muss eine Zahl sein");
      err.statusCode = 400;
      return next(err)
    }

    const rates = await db.query(`
      SELECT id, tarifName, plz, (fixkosten + variableKosten*?) as price
      FROM rates
      WHERE deactivatedAt IS NULL
      AND plz = ?
      ORDER BY price;
    `, [ amount, plz ]);

    res.status(200).json(rates);
  } catch (e) {
    const err = new Error()
    err.statusCode = 500;
    next(err)
  }
}

/**
 * Returns all active rates.
 * @function
 * @async
 * @param req {e.Request}
 * @param res {e.Response}
 * @param next {e.NextFunction}
 * @returns {any}
 */
exports.getAllRates = async (req, res, next) => {
  try {
    const rates = await db.query(`
    SELECT id, tarifName, plz, fixkosten, variableKosten
    FROM rates
    WHERE deactivatedAt IS NULL
    `)
    res.json(rates)
  } catch (e) {
    const err = new Error()
    err.statusCode = 500;
    next(err)
  }
}


//@todo rename csv importfile to data.csv before usage
/**
 * imports csv file
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Array}
 */
exports.importcsv = async (req, res) => {
  const filepath = path.dirname(__dirname);
  const connection = await db.getConnection();
  await connection.query('UPDATE rates SET deactivatedAt = ? WHERE 1=1', new Date());
  console.log(filepath);
  console.log(filepath + '../upload/data.csv');
  fs.createReadStream(req.file.path)
    .pipe(csv({
      separator: ';'
    }))
    .on('data', (data) => {
      const dataArray = Object.values(data);
      const formattedData = [
        dataArray[ 0 ],
        dataArray[ 1 ],
        Number(dataArray[ 2 ].replace(',', '.')),
        Number(dataArray[ 3 ].replace(',', '.'))
      ]
      connection.query('INSERT INTO rates (tarifName, plz, fixkosten, variableKosten) VALUES (?, ?, ?, ?)', formattedData);

      results.push(formattedData);


    })
    .on('end', () => {
      console.log(results);
      res.json(results);

    });
}
