class ControllerError extends Error {
    constructor(message) {
        super(message);
        this.name = "ControllerError";
    }
}

module.exports = ControllerError;