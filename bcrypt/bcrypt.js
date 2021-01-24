const bcrypt = require('bcrypt');
const bcryptConf = require('../config-files/bcryptConf');

/**
 * generates salt
 * @returns {string}
 */
exports.genSalt = () => {
    return bcrypt.genSalt(bcryptConf.saltRounds);
}


/**
 * encrypts a given string with a salt
 * @param {string} string 
 * @param {string} salt 
 * @returns {string}
 */
exports.encrypt = async (string, salt) => {
    if (salt) return await bcrypt.hash(string, salt)
    return bcrypt.hash(string, await this.genSalt());
}

/**
 * compares string with hash
 * @param {string} string 
 * @param {string} hash 
 * @returns {boolean}
 */
exports.compare = async (string, hash) => {
    return bcrypt.compare(string, hash);
}
