const bcrypt = require('bcrypt');
//config-file with password
const bcryptConf = require('../config-files/bcryptConf');

//export bycrypt.genSalt
exports.genSalt = () => {
    return bcrypt.genSalt(bcryptConf.saltRounds);
}

//exort bycrypt.encrypt
exports.encrypt = async(string, salt) => {
    if (salt) return bcrypt.hash(string, salt)
    return bcrypt.hash(string, await this.genSalt());
}

//export bycrypt.compare
exports.compare = async(string, hash) =>  {
    return bcrypt.compare(string, hash);
}