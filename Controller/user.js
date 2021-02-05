const { response } = require('express');
const moment = require('moment');
const db = require('../db/database');
const bcrypt = require("../bcrypt/bcrypt");
const jwt = require('../Controller/jwt')
const jwtConf = require('../config-files/jwt');
const e = require('express');

//req.body req.params = die werte der html parameter in der ulr z.B. https://bachus.it/login/:id --> wert von id req.query
/**
 * singnes new users up
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next
 * @returns {any}
 */
exports.signup = async (req, res, next) => {
    try {
        const { username, password, email, firstName, lastName } = req.body
        console.log({ username, password, email, firstName, lastName })
        const passwordHash = await bcrypt.encrypt(password);

        // checks


        const personResult = await db.query(`
    INSERT INTO persons (firstName, lastName) 
    VALUES (?,?)
    `, [ firstName, lastName ]);

        personId = personResult.insertId;

        const userResult = await db.query(`
    INSERT INTO users (username, email, password, personId) 
    VALUES (?,?,?,?)
    `, [ username, email, passwordHash, personId ]);

        res.status(201).send("User erfolgreich registriert!");
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Username oder E-Mail bereits registriert!", error: e });
    }

}

/**
 * patches a single user
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next
 * @returns {any} 
 */
exports.patchUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, username, email, password } = req.body;

        const users = await db.query(`
        SELECT u.id, p.id as pId, p.firstName, p.lastName, u.username, u.email, u.password
        FROM users as u
        inner JOIN persons as p
        ON p.id = u.personId
        WHERE u.deletedAt IS null
        AND p.deletedAt IS null
        AND u.personId IS NOT null
        AND u.id = ?
        `, userId);

        if (users.length === 0) {
            const e = new Error('User nicht gefunden');
            e.statusCode = '404';
            return next(e);
        }

        let user = users[ 0 ];

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
            user.password = await bcrypt.encrypt(password);
        }

        await db.query(` 
        UPDATE users
        SET username = ?, email = ?, password = ?
        WHERE personId = ?;
        `, [ user.username, user.email, user.password, user.pId ]
        );

        await db.query(` 
        UPDATE persons
        SET firstName = ?, lastName = ?
        WHERE id = ?;
        `, [ user.firstName, user.lastName, user.pId ]
        );

        res.status(200).send("Userdaten wurden geändert!")

    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}
/**
 * gets attribute values for the id mentioned in the url
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next
 * @returns {any} 
 */
exports.getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const users = await db.query(`
        SELECT u.id, p.firstName, p.lastName, u.username, u.email
        FROM users as u
        inner JOIN persons as p
        ON p.id = u.personId
        WHERE u.deletedAt IS null
        AND p.deletedAt IS null
        AND u.personId IS NOT null
        AND u.id = ?
        ;`, userId);

        if (users.length === 0) {
            const e = new Error('User nicht gefunden');
            e.statusCode = '404';
            return next(e);
        }

        const user = users[ 0 ];

        res.json(user);
    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}
/**
 * gets all id,firstName,lastName,username and email from users
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e,Response} res 
 * @param {e.NextFunction} next
 * @returns {any}
 */
exports.getAll = async (req, res, next) => {
    try {
        const users = await db.query(`
        SELECT u.id, p.firstName, p.lastName, u.username, u.email
        FROM users as u
        inner JOIN persons as p
        ON p.id = u.personId
        WHERE u.deletedAt IS null
        AND p.deletedAt IS null
        AND u.personId IS NOT null
        ;`);

        res.json(users);
    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}


/**
 * deletes User
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next
 * @returns {any}
 */
exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const dbCon = await db.getConnection();
        const userPersonResult = await dbCon.query(`
        SELECT *
        FROM users as u
        inner JOIN persons as p
        ON p.id = u.personId
        WHERE u.id = ?
        AND u.deletedAt IS null;
        `, userId);

        const person = userPersonResult.shift();

        if (!person) {
            const err = new Error('User existiert nicht!');
            err.statusCode = 404;
            return next(err);
        }

        const personId = person.personId;

        const deleteUserRes = await dbCon.query(`
        UPDATE users
        SET deletedAt = ?
        WHERE id = ?;
        `, [ new Date(), userId ]);

        const deletePersonRes = await dbCon.query(`
        UPDATE persons
        SET deletedAt = ?
        WHERE id = ?;
        `, [ new Date(), personId ]);

        res.status(200).send("User wurde gelöscht!");
    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }
}

/**
 * login with username and password
 * @function
 * @async
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next
 * @returns {any}
 */
exports.login = async (req, res, next) => {
    try {
        console.log('login');
        const { username, password } = req.body;

        const users = await db.query(`
        SELECT *
        FROM users
        WHERE username = ?
        `, [ username ]);

        if (users.length === 0) {
            const e = new Error('Login ungültig');
            e.statusCode = 400;
            return next(e)
        }

        const user = users[ 0 ];

        if (user && await bcrypt.compare(password, user.password)) {

            if (user.deletedAt) {
                const deletedAt = new Date(user.deletedAt);
                const deletedAtFormatted = moment(deletedAt).format('YYYY-MM-DD')

                const e = new Error(`User gelöscht am ${deletedAtFormatted}`);
                e.statusCode = 400;
                return next(e)
            }

            const userPayload = {
                userId: user.id,
                email: user.email
            }

            const token = await jwt.encode(userPayload);

            return res.cookie('token', token, { maxAge: (Date.now() / 1000) + (60 * 60 * jwtConf.lifetimeInHours) }).json({ token });
        }
    } catch (e) {
        console.log(e);
        e.statusCode = 500;
        return next(e)
    }


}
