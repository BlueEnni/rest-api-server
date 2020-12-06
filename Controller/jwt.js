const jwt = require('jsonwebtoken');
const jwtConf = require('../config-files/jwt')


exports.encode = (payload) => {
	return new Promise((resolve, reject) => {

		// Math.floor => runden
		console.log(payload)

		const payloadWithMetaData = {
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * jwtConf.lifetimeInHours),
			...payload
		}

		console.log(payloadWithMetaData)

		jwt.sign(payloadWithMetaData, jwtConf.jwtKey, { algorithm: jwtConf.algorithm }, (err, token) => {
			if (err) {
				reject( err )
			}
			else resolve(token)
		})

	})
}

exports.decode = (token) => {
	return new Promise((resolve, reject) => {

		jwt.verify(token, jwtConf.jwtKey, (err, payload) => {
			if (err) reject(err)
			else resolve(payload)
		})

	})
}
