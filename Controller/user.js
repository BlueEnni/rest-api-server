const { response } = require('express');
const db = require('../db/database');
const bcrypt = require("../bcrypt/bcrypt");

//req.body req.params = die werte der html parameter in der ulr z.B. https://bachus.it/login/:id --> wert von id req.query
exports.login = async (req, res, next) => {
    try {
        console.log('login');
        const password = req.body.password;
        const username = req.body.username;
        /*
        alternativ:
        "matcht" username und passwort aus dem Objekt --> kürzer und übersichtlicher
        const {password, username} = req.body;
        */

        const userDB = []
        userDB.push(...await db.query(`
        SELECT *
        FROM users
        WHERE lastname = ?
        `, [username]));
    
        const user = userDB[0];
        if(user && (await bcrypt.compare(password,user.password) || user.password == password)){
            
            return res.send('success!');
        }
    } catch(e) {
        console.log(e);
    } finally{
        return res.status(400).send('Login ungültig');
    }

    
}