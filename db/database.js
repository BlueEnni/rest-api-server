const mysql = require('mysql');

const pool = exports.pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME
});

/**
 * send query
 * @function
 * @async
 * @param {string} query
 * @param {any|Array<any>} bindings
 * @returns {Promise<Array<Object>>}
 */
const query = exports.query = async (query, bindings) => {
  return new Promise((resolve, reject) => {

    const startDate = new Date();

    pool.query(query, bindings, (error, results, fields) => {

      const endDate = new Date();
      console.log(`executed query: ${endDate.getTime() - startDate.getTime()}ms`)

      if (error) reject(error);
      resolve(results);
    })

  })
}

/**
 *
 * @type {function(): Promise<{query: Function, release: Function}>}
 */
const getConnection = exports.getConnection = async () => {
  return new Promise((resolve, reject) => {

    pool.getConnection((err, connection) => {
      if (err) reject(err)
      resolve({
        /**
         * Query Function
         * @function
         * @async
         * @param {string} query
         * @param {object} bindings
         * @return {Promise}
         */
        query: (query, bindings) => {

          const startDate = new Date();

          return new Promise((resolve1, reject1) => {
            connection.query(query, bindings, (error, results, fields) => {

              const endDate = new Date();

              console.log(`executed query: ${query} ${endDate.getTime() - startDate.getTime()}ms`)

              if (error) reject1(error);
              resolve1(results);
            })
          })
        },
        /**
         * Release Connection back to pool
         * @function
         * @async
         * @return {Promise}
         */
        release: () => {
          return new Promise((resolve, reject) => {
            if (err) reject(err);
            console.log("MySQL pool released: threadId " + connection.threadId);
            resolve(connection.release());
          })
        }
      })
    });
  })
}

/**
 * creates Tables
 * @function
 * @async
 */
exports.createTables = async () => {
  const createTablePromises = [];
  const dbConnection = await getConnection();

  createTablePromises.push(
    dbConnection.query(`
      CREATE TABLE IF NOT EXISTS rates (
      id INTEGER AUTO_INCREMENT,
      tarifName VARCHAR(255),
      plz VARCHAR(5),
      fixkosten FLOAT NOT NULL,
      variableKosten FLOAT NOT NULL,
      deactivatedAt DATETIME
      CHECK(LENGTH(plz) = 5 AND LENGTH(tarifName) > 0),
      PRIMARY KEY (id)
    );` )
  )

  createTablePromises.push(
    dbConnection.query(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER AUTO_INCREMENT,
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        username VARCHAR(50),
        email VARCHAR(50),
        password VARCHAR(62), 
        deletedAt DATETIME
        CHECK(LENGTH(firstName) >= 2),
        CHECK(LENGTH(lastName) >= 2),
        PRIMARY KEY (id));
      `)
  );


  await Promise.all(createTablePromises);

  await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS addresses (
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
      );` );

  await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS orders (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
      
      , userId INTEGER
      , rateId INTEGER
      , addressId INTEGER
      , consumption INTEGER
      , agent VARCHAR(60)
      , deletedAt DATETIME
      
      , FOREIGN KEY (addressId) REFERENCES addresses(id)
      , FOREIGN KEY (rateId) REFERENCES rates(id)
      , FOREIGN KEY (userId) REFERENCES users(id)
      );` );

  dbConnection.release();
}

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('connection', function (connection) {
  connection.query('SET SESSION auto_increment_increment=1')
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});
