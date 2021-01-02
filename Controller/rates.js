const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const path = require('path')
const db = require('../db/database')





//@todo rename csv importfile to data.csv before usage
//import der Datei in die Datenbank
exports.importcsv = async (req, res) => {
  const filepath = path.dirname(__dirname);
  const connection = await db.getConnection();
  await connection.query('UPDATE rates SET deactivatedAt = ? WHERE 1=1', new Date());
  console.log(filepath);
  console.log(filepath +'../upload/data.csv');
    //upload in app.js (multer - upload.single)
  fs.createReadStream(req.file.path)
  .pipe(csv({
    separator: ';'
  }))
  .on('data', (data) => {
    const dataArray = Object.values(data);
    const formattedData = [
      dataArray[0],
      dataArray[1],
      Number(dataArray[2].replace(',', '.')),
      Number(dataArray[3].replace(',', '.'))
    ]
    connection.query('INSERT INTO rates (tarifName, plz, fixkosten, variableKosten) VALUES (?, ?, ?, ?)', formattedData);

    results.push(formattedData);


  })
  .on('end', () => {
    console.log(results);
    res.json(results);
    
  });
}