const db = require("../db/database")


/**
 * Returns all Orders
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @return {any}
 */
exports.postOrder = async (req, res, next) => {
	const { firstName, lastName, street, streetNumber, zipCode, city, rateId, consumption, agent } = req.body;
	try {

		if (isNaN(Number(rateId)) || isNaN(Number(consumption)) || isNaN(Number(zipCode)) || !firstName || !lastName || !street || !streetNumber || !city || !agent) return res.sendStatus(400);

		const connection = await db.getConnection()

		const personResult = await connection.query(`
		INSERT INTO persons
		(
			firstName
			, lastName
		) 
		VALUES (
			?,?
		)`,
			[ firstName, lastName ] // @todo add authentification to userId once authentication is added
		);

		const personId = personResult.insertId;

		const addressResult = await connection.query(`
		INSERT INTO addresses
		(
			street
			, streetNumber
			, zipCode
			, city
			, personId
		) 
		VALUES (
			?,?,?,?,?
		)`,
			[ street, streetNumber, zipCode, city, personId ]
		);


		const orderResult = await db.query(`
		INSERT INTO orders
		(
			personId
			, rateId
			, consumption
			, agent
		)
		VALUES (?,?,?,?)`, [
			personId,
			rateId,
			consumption,
			agent
		]);

		connection.release()

		res.status(201).json({ id: orderResult.insertId, message: 'Bestellung wurde angelegt!' });

	} catch (e) {
		next(e);
	}
}

/**
 * Returns all Orders
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @return {any}
 */
exports.getAllOrders = async (req, res, next) => {
	try {
		const orders = await db.query(`
		SELECT o.id, o.rateId, o.consumption, o.agent, p.firstName, p.lastName, a.street, a.streetNumber, a.zipCode, a.city
		FROM orders as o
		inner JOIN persons as p
		ON p.id = o.personId
		inner JOIN addresses as a
		ON a.personId = p.id
		WHERE o.deletedAt IS null
		;` )

		res.json(orders);
	} catch (e) {
		next(e);
	}
}


/**
 * Returns all Orders
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @return {any}
 */
exports.getOrderDetails = async (req, res, next) => {
	const orderId = req.params.orderId;

	try {
		if (isNaN(Number(orderId))) return res.sendStatus(400);

		const orders = await db.query(`
		SELECT o.id, o.rateId, o.consumption, o.agent, p.firstName, p.lastName, a.street, a.streetNumber, a.zipCode, a.city
		FROM orders as o
		inner JOIN persons as p
		ON p.id = o.personId
		inner JOIN addresses as a
		ON a.personId = p.id
		WHERE o.deletedAt IS null
		AND o.id = ?
		;`	, orderId
		);
		const order = orders.pop();

		if (!order) return res.sendStatus(404);

		res.json(order);

	} catch (e) {
		next(e);
	}
}


/**
 * Patches one order
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @return {any}
 */
exports.patchOrder = async (req, res, next) => {
	const orderId = req.params.orderId;
	const { firstName: firstNameBody, lastName: lastNameBody, street: streetBody, streetNumber: streetNumberBody, zipCode: zipCodeBody, city: cityBody, rateId: rateIdBody, consumption: consumptionBody, agent: agentBody } = req.body
	console.log(req.body)
	try {
		const orders = await db.query(`
		SELECT o.id, o.personId, o.rateId, o.consumption, o.agent, p.firstName, p.lastName, a.street, a.streetNumber, a.zipCode, a.city
		FROM orders as o
		JOIN persons as p
		ON p.id = o.id
		JOIN addresses as a
		ON a.id = p.id
		WHERE o.deletedAt IS null
		AND o.id = ?
		;`, orderId);

		const order = orders.pop();

		if (!order) return res.sendStatus(404);

		let { firstName, lastName, street, streetNumber, zipCode, city, rateId, consumption, agent, personId } = order;

		if (`firstName` in req.body) {
			firstName = firstNameBody;
		}

		if (`lastName` in req.body) {
			lastName = lastNameBody;
		}

		if (`street` in req.body) {
			street = streetBody;
		}

		if (`streetNumber` in req.body) {
			streetNumber = streetNumberBody;
		}

		if (`zipCode` in req.body) {
			zipCode = zipCodeBody;
		}

		if (`city` in req.body) {
			city = cityBody;
		}

		if (`rateId` in req.body) {
			rateId = rateIdBody;
		}

		if (`consumption` in req.body) {
			consumption = consumptionBody;
		}

		if (`agent` in req.body) {
			agent = agentBody;
		}

		await db.query(`
			UPDATE persons
			SET firstName = ?, lastName = ?
			WHERE id = ?
		`, [ firstName, lastName, personId ]);

		await db.query(`
			UPDATE orders
			SET consumption = ?, rateId = ?, consumption = ?, agent = ?
			WHERE personId = ?
		`, [ consumption, rateId, consumption, agent, personId ]);

		await db.query(`
			UPDATE addresses
			SET street = ?, streetNumber = ?, zipCode = ?, city = ?
			WHERE personId = ?
		`, [ street, streetNumber, zipCode, city, personId ]);


		res.status(200).send("Bestelldaten wurden geändert!");
	} catch (e) {
		next(e)
	}
}


/**
 * Patches one order
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @return {any}
 */
exports.deleteOrder = async (req, res, next) => {
	const { orderId } = req.params;

	try {

		const orderResults = await db.query(`
				SELECT o.id, o.deletedAt
				FROM orders as o
				WHERE o.deletedAt IS null
				AND o.id = ?
				;`, orderId);

		orderResult = orderResults.shift();

		if (!orderResult) {
			const err = new Error('Bestellung existiert nicht!');
			err.statusCode = 404;
			return next(err);
		}

		const orderResultUpdate = await db.query(`
		UPDATE orders
		SET deletedAt = ?
		WHERE id = ?`, [ new Date(), orderId ]);

		if (orderResultUpdate.affectedRows === 0) return res.sendStatus(404);

		res.status(200).json({ order: orderId, message: "Bestellung wurde gelöscht!" });
	} catch (e) {
		next(e);
	}
}
