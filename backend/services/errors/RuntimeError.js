class RuntimeError extends Error {
    constructor(message) {
        super(message);
        this.status = 500;
        this.name = "RuntimeError";
    }
}

module.exports = { RuntimeError }