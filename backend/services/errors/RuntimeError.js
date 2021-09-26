class RuntimeError extends Error {
    constructor(message) {
        console.log(message);
        super(message);
        this.status = 500;
        this.name = "RuntimeError";
    }
}

class DocumentNotFounndError extends RuntimeError {
    constructor(message) {
        super(message);
        this.status = 404;
        this.name = "DocumentNotFounndError";
    }
}

module.exports = { RuntimeError, DocumentNotFounndError }