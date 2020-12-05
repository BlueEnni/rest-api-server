const mysql = require('mysql');
const {
  resolve
} = require('path');
//zum prüfen ob das file der db da ist wird das filesystem packet benötigt
const fs = require('fs').promises;
let connection = null;


exports.query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'stromanbieter'
    })
    con.query(sql, binding, (err, result, fields) => {
      if (err) return reject(err);
      return resolve(result);
    })
  })
};



(async () => {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  connection.connect();

  // mit use verweise ich auf die DB die verwendet wird
  connection.query("CREATE DATABASE IF NOT EXISTS stromanbieter;");
  connection.query("USE stromanbieter;");

  //tabellen anlegen

  //schreiben der Promises in eine Tabelle
  const fistPromises = [];
  fistPromises.push(
    this.query(`CREATE TABLE IF NOT EXISTS stromanbieter (
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(60),
    title VARCHAR(255),
    year INTEGER
    CHECK(LENGTH(NAME) >= 10),
    PRIMARY KEY (id)
    );`)
  );

  fistPromises.push(
    this.query(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER AUTO_INCREMENT,
      name VARCHAR(40),
      lastname VARCHAR(40),
      password VARCHAR(62)
      CHECK(LENGTH(NAME) >= 10),
      PRIMARY KEY (id)
      );`)
  );

  /*
  await this.query(`CREATE TABLE IF NOT EXISTS stromanbieter (
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(60),
    title VARCHAR(255),
    year INTEGER
    CHECK(LENGTH(NAME) >= 10),
    PRIMARY KEY (id)
    );`);

   await this.query(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER AUTO_INCREMENT,
      name VARCHAR(40),
      lastname VARCHAR(40),
      password VARCHAR(62)
      CHECK(LENGTH(NAME) >= 10),
      PRIMARY KEY (id)
      );`);
    */



  await Promise.all(fistPromises);

  //this bezieht sich auf exports das query exports object = exports.query
  //ich benötige await, wenn ich der Reihe nach die Tabellen erstellen will
  await this.query(`CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER AUTO_INCREMENT,
    street VARCHAR(60),
    streetNumber VARCHAR(255),
    zipCode INTEGER,
    city VARCHAR(255),
    userId INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) 
    REFERENCES users(id)
    ON DELETE CASCADE
    );`);
})();

//db verbindung aufbauen
const provideDatabase = exports.provideDatabase = async function provideDatabase() {



  return new Promise((resolve, reject) => {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'stromanbieter'

    });

    resolve(connection);
    /*connection.connect((err)=>{
      if (err){
        return reject(err);
      }
      resolve(connection);
    });*/
  })
  /*
    connection.connect();
    
    // mit use verweise ich auf die DB die verwendet wird
    connection.query("CREATE DATABASE IF NOT EXISTS stromanbieter;");
    connection.query("USE stromanbieter;");

    //tabellen anlegen
    connection.query(`CREATE TABLE IF NOT EXISTS stromanbieter (
      id INTEGER AUTO_INCREMENT,
      name VARCHAR(60),
      title VARCHAR(255),
      year INTEGER
      CHECK(LENGTH(NAME) >= 10),
      PRIMARY KEY (id)
      );`);


    return connection;
  */
}





exports.connection = connection;