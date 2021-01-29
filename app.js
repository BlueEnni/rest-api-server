require('dotenv').config()
const express = require("express");
const db = require("./db/database");
const bycrypt = require("./bcrypt/bcrypt");
const user = require("./Controller/user");
const rates = require("./Controller/rates")
const orders = require("./Controller/orders")
const multer = require('multer');

/**
 * path module
 * @const
 * @type {path.PlatformPath | path}
 */
const path = require("path")

const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');


const storage = multer({
    dest: './upload/'
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


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


app.all('/?*', (req, res, next) => {
    res.sendFile(path.join(__dirname, "uploads", "private", "404.html"))
})


/**
 * sends error - if a server error occurs (default function)
 */
app.use((err, req, res, next) => {

    const response = {
        message: err.message || 'Es ist ein Fehler aufgetreten',
        status: Number(err.statusCode) || 500,
    }

    if (process.env.ENVRIONMENT === 'dev') {
        response.error = err.stack.split('\n    ');
    }

    res
        .status(response.status)
        .send(response);
});

/**
 * creates a webserver on port 3000
 */
app.listen(3000, async () => {
    try {
        console.log("app starting ...")
        await db.createTables();
        console.log("app listening: http://localhost:3000")
    } catch (e) {
        console.error("app could not start")
        throw (e);
    }

});
