class BussinessError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = "BussinessError";
    }
}

class AuthError extends BussinessError {
    constructor(message) {
        super(message);
        this.status = 401;
        this.name = "AuthError";
    }
}

class ForbiddenError extends BussinessError {
    constructor(message) {
        super(message);
        this.status = 403;
        this.name = "ForbiddenError";
    }
}

module.exports = { BussinessError, AuthError, ForbiddenError };