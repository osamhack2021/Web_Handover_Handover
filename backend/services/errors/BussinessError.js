class BussinessError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = "BussinessError";
    }
}

module.exports = BussinessError;