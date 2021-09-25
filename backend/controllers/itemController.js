const itemService = require('../services/itemService.js');

const { ForbiddenError } = require('../services/errors/BussinessError');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

const isAdmin = (group, serviceNumber) => {
    let adminServiceNumbers = group.admins.map(admin => admin.serviceNumber);
    if(adminServiceNumbers.indexOf(serviceNumber) < 0) {
        return false;
    }
    return true;
}

module.exports = {

    // GET
    search: async (req, res) => {
        
    },

    // POST
    create: async (req, res) => {
        
    },

    // PUT
    update: async (req, res) => {
        
    },

    // DELETE
    delete: async (req, res) => {

    },

    
};