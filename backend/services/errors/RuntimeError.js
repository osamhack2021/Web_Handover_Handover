class RuntimeError extends Error {
    constructor(message) {
        super(message);
        this.status = 500;
        this.name = "RuntimeError";
    }
}

class InvalidParameterError extends RuntimeError {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = "InvalidParameterError"
    }
}

class DocumentNotFounndError extends RuntimeError {
    constructor(message) {
        super(message);
        this.status = 404;
        this.name = "DocumentNotFounndError";
    }
}

class NotFoundError extends RuntimeError {
    constructor(message) {
        super(message);
        this.status = 404;
        this.name = "NotFounndError";
    }
}

module.exports = { RuntimeError, InvalidParameterError, DocumentNotFounndError, NotFoundError };