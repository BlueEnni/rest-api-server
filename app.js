const express = require("express");
const db = require("./db/database");
const bycrypt = require("./bcrypt/bcrypt");
//export von objectmember als constanten const {login, register} = require("./Controller/user");
//export von objectmembern als array const [val1, val2] = [1, 2, 3];
const user = require("./Controller/user");
//conection encryption

// access policy (restrict access origins) allows all routes /customization of access
const cors = require('cors')

db.provideDatabase();
const app = express();

//for (body) json transcoding
const bodyParser = require('body-parser');

//custom
// allow all cors
app.use(cors());
// parse json body of req
app.use(bodyParser.json());


//default
app.use(express.static("public"));

//custom routes
app.post("/login", user.login);

/*app.get([
    "/"

], async (req, res, next) => {
    try {
        //const con = await db.provideDatabase();
        /*console.log(con.query(`SELECT *
        FROM stromanbieter`)

        res.json(await db.query(`SELECT *
        FROM stromanbieter`))
    } catch (e) {
        next(e)
    }
});
*/

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});

app.listen(
    3000,
    () => {
        console.log("app.listening")
    }

);