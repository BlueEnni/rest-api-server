const mysql = require( 'mysql' );

const pool = exports.pool = mysql.createPool( {
  connectionLimit: 5,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME
} );


const query = exports.query = async ( query, bindings ) => {
  return new Promise( ( resolve, reject ) => {

    const startDate = new Date();

    pool.query( query, bindings, ( error, results, fields ) => {

      const endDate = new Date();
      console.log(`executed query: ${ endDate.getTime() - startDate.getTime()}ms`)

      if (error) reject( error );
      resolve( results );
    } )

  } )
}

const getConnection = exports.getConnection = async () => {
  return new Promise( ( resolve, reject ) => {

    pool.getConnection( ( err, connection ) => {
      if (err) reject( err )
      resolve( {
        query: ( query, bindings ) => {

          const startDate = new Date();

          return new Promise( ( resolve1, reject1 ) => {
            connection.query( query, bindings, ( error, results, fields ) => {

              const endDate = new Date();

              console.log(`executed query: ${query} ${ endDate.getTime() - startDate.getTime()}ms`)

              if (error) reject1( error );
              resolve1( results );
            } )
          } )
        },
        release: () => {
          return new Promise( ( resolve, reject ) => {
            if (err) reject( err );
            console.log( "MySQL pool released: threadId " + connection.threadId );
            resolve( connection.release() );
          } )
        }
      } )
    } );
  } )
}

exports.createTables = async () => {
  const createTablePromises = [];
  const dbConnection = await getConnection();

  createTablePromises.push(
      dbConnection.query( `
        CREATE TABLE IF NOT EXISTS stromanbieter (
        id INTEGER AUTO_INCREMENT,
        name VARCHAR(60),
        title VARCHAR(255),
        year INTEGER
        CHECK(LENGTH(NAME) >= 10),
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

  // wait for unrelated tables to be created
  await Promise.all( createTablePromises );

  await dbConnection.query( `
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
