class BussinessError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = "BussinessError";
    }
}

class AuthError extends BussinessError {
    constructor(message) {
        this.status = 401;
        this.name = "AuthError";
    }
}

module.exports = { BussinessError, AuthError };