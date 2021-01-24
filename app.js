// As early as possible in your application, require and configure dotenv.
require('dotenv').config()
const express = require("express");
const db = require("./db/database");
const bycrypt = require("./bcrypt/bcrypt");
//export von objectmember als constanten const {login, register} = require("./Controller/user");
//export von objectmembern als array const [val1, val2] = [1, 2, 3];
const user = require("./Controller/user");
const rates = require("./Controller/rates")
const orders = require("./Controller/orders")
//fileupload
const multer = require('multer');

/**
 * path module
 * @const
 * @type {path.PlatformPath | path}
 */
const path = require("path")

//conection encryption
// access policy (restrict access origins) allows all routes /customization of access
const cors = require('cors')
const app = express();
//for (body) json transcoding
const bodyParser = require('body-parser');


//storage
const storage = multer({
    dest: './upload/'
  });


//custom
// allow all cors
app.use(cors());
// parse json body of req
app.use(bodyParser.json());


//default
app.use(express.static("public"));

//custom routes
app.post("/login", user.login);
app.post("/signup", user.signup);


app.get("/users", user.getAll);
app.get("/users/:userId", user.getUser);
app.patch("/users/:userId", user.patchUser);
app.delete("/users/:userId", user.deleteUser);
// @todo
// app.get("/users/:userId/orders");



app.get("/rates", rates.getAllRates)
app.get("/rates/:id", rates.getRateDetails)
app.patch("/rates/:id", rates.patchRate)
app.delete("/rates/:id", rates.deleteRate)

app.get("/orders", orders.getAllOrders)
app.get("/orders/:orderId", orders.getOrderDetails)
app.post("/orders", orders.postOrder)
app.patch("/orders/:orderId", orders.patchOrder)
app.delete("/orders/:orderId", orders.deleteOrder)


app.post("/ratesupload", storage.single('csv'), rates.importcsv);


app.all('/?*', (req,res ,next) => {
    res.sendFile(path.join(__dirname, "uploads", "private", "404.html"))
})

app.use((err, req, res, next) => {

    const response = {
        message: err.message || 'Es ist ein Fehler aufgetreten',
        status: Number(err.statusCode) || 500,
    }

    if (process.env.ENVRIONMENT === 'dev') {
        response.error = err.stack.split('\n    ');
    }

    res
        .status( response.status )
        .send(response);
});

app.listen( 3000, async () => {
    try {
        console.log("app starting ...")
        await db.createTables();
        console.log("app listening: http://localhost:3000")
    } catch (e) {
        console.error("app could not start")
        throw(e);
    }

});
