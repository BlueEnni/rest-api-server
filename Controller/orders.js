const db = require("../db/database")


/**
 * Returns all Orders
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @return {any}
 */
exports.postOrder = async (req, res, next) => {
	const { rateId, userId, consumption, street, streetNumber, zipCode, city } = req.body;
	try {

		if (isNaN(Number(rateId)) || isNaN(Number(consumption)) || isNaN(Number(userId)) || !street || !streetNumber || !zipCode) return res.sendStatus(400);

		const connection = await db.getConnection()

		const addressResult = await connection.query(`
		INSERT INTO addresses
		(
			street
			, streetNumber
			, zipCode
			, city
			, userId
		) 
		VALUES (
			?,?,?,?,?
		)`,
			[ street, streetNumber, zipCode, city, userId ] // @todo add authentification to userId once authentication is added
		);

		const addressId = addressResult.insertId;

		const orderResult = await db.query(`
		INSERT INTO orders
		(
			userId
			, rateId
			, addressId
			, consumption
		)
		VALUES (?,?,?,?)`, [
			userId, // @todo authentification to userId once authentication is added
			rateId,
			addressId,
			consumption
		])

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
		SELECT *
		FROM orders
		` )

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
		SELECT *
		FROM orders
		WHERE id = ?`
			, orderId
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
	const { consumption: consumptionBody } = req.body
	console.log(req.body)
	try {
		const orders = await db.query(`
			SELECT *
			FROM orders
			WHERE id = ?`, orderId
		);

		const order = orders.pop()

		if (!order) return res.sendStatus(404);

		let { consumption } = order;

		if (`consumption` in req.body) {
			consumption = consumptionBody;
		}

		await db.query(`
			UPDATE orders
			SET consumption = ?
			WHERE id = ?
		`, [ consumption, orderId ]);


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

		const orderResult = await db.query(`
		UPDATE orders
		SET deletedAt = ?
		WHERE id = ?`, [ new Date(), orderId ]);

		if (orderResult.affectedRows === 0) return res.sendStatus(404);

		res.status(200).json({ order: orderId, message: "Bestellung wurde gelöscht!" });
	} catch (e) {
		next(e);
	}
}
