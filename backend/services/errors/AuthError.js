const BussinessError = require('./BussinessError.js');

class AuthError extends BussinessError {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }
}

module.exports = AuthError;