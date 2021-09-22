const RuntimeError = require('./RuntimeError.js');

class DocumentNotFounndError extends RuntimeError {
    constructor(message) {
        super(message);
        this.status = super.status;
        this.name = "DocumentNotFounndError";
    }
}

module.exports = DocumentNotFounndError;