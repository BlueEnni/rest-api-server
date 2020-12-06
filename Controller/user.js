const { response } = require('express');
const db = require('../db/database');
const bcrypt = require("../bcrypt/bcrypt");
const jwt = require('../Controller/jwt')
const jwtConf = require('../config-files/jwt')

//req.body req.params = die werte der html parameter in der ulr z.B. https://bachus.it/login/:id --> wert von id req.query
exports.signup = async (req, res, next) => {
    try {
        const { username, password, email, firstName, lastName } = req.body
        console.log({username, password, email, firstName, lastName})
        const passwordHash = await bcrypt.encrypt(password);

        // checks

        const result = await db.query(`
    INSERT INTO users (username, firstName, lastName, email, password) 
    VALUES (?,?,?,?,?)
    `, [username, firstName, lastName, email, passwordHash]);

        res.status(201).send();
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }

}


exports.patchUser = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const {firstName, lastName, username, email, password} = req.body;

        const users = await db.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `, userId);

        if (users.length === 0) {
            const e = new Error('User nicht gefunden');
            e.statusCode = '404';
            return next(e);
        }

        let user = users[0];

        if (firstName) {
            user.firstName = firstName;
        }

        if (lastName) {
            user.lastName = lastName;
        }

        if (username) {
            user.username = username;
        }

        if (email) {
            user.email = email;
        }

        if (password) {
            user.password = bcrypt.encrypt(password);
        }

        await db.query(`
        UPDATE users
        SET firstName = ?, lastName = ?, username = ?, email = ?, password = ?
        `, [user.firstName, user.lastName, user.username, user.email, user.password])

        res.status(200).send()

    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}
exports.getUser = async (req, res, next) => {
    try {
        const {userId} = req.params;

        const users = await db.query(`
        SELECT id,firstName,lastName, username, email
        FROM users
        WHERE id = ?
        `, userId);

        if (users.length === 0) {
            const e = new Error('User nicht gefunden');
            e.statusCode = '404';
            return next(e);
        }

        const user = users[0];

        res.json(user);
    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}
exports.getAll = async (req, res, next) => {
    try {
        const users = await db.query(`
        SELECT id,firstName,lastName, username, email
        FROM users
        `);

        res.json(users);
    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}



exports.login = async (req, res, next) => {
    try {
        console.log('login');
        const {username, password} = req.body;

        /*
        alternativ:
        "matcht" username und passwort aus dem Objekt --> kürzer und übersichtlicher
        const {password, username} = req.body;
        */

        const users = await db.query(`
        SELECT *
        FROM users
        WHERE username = ?
        `, [username]);

        if (users.length === 0) {
            const e = new Error('Login ungültig');
            e.statusCode = 400;
            return next(e)
        }

        const user = users[0];

        if(user && await bcrypt.compare(password, user.password)) {

            const userPayload = {
                userId: user.id,
                email: user.email
            }

            const token = await jwt.encode( userPayload );

            return res.cookie('token', token, { maxAge: (Date.now() / 1000) + ( 60 * 60 * jwtConf.lifetimeInHours ) }).json( { token });
        }
    } catch(e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }


}
