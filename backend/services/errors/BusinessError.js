class BusinessError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = "BussinessError";
    }
}

class AuthError extends BusinessError {
    constructor(message) {
        this.status = 401;
        this.name = "AuthError";
    }
}

module.exports = { BusinessError, AuthError };