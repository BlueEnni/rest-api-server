/**
 * Rates Helper
 * @module /helper/rates
 */

/**
 * @function
 * @param {Rate} rate
 * @param {Number} consumption
 */
exports.getPriceForRate = function ( rate, consumption ) {
	const {fixkosten, variableKosten} = rate
	return fixkosten + variableKosten * consumption
}
