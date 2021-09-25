class RuntimeError extends Error {
    constructor(message) {
        console.log(message);
        super(message);
        this.status = 500;
        this.name = "RuntimeError";
    }
}

module.exports = { RuntimeError }