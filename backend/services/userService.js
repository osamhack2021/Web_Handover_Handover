const crypto = require('crypto');
const User = require('../models/User.js');

const { RuntimeError } = require('./errors/RuntimeError.js');
const { BusinessError, AuthError, NotFoundError } = require('./errors/BusinessError.js');

function encode(rowPassword) {
  return crypto.createHmac('sha256', 'secret12341234')
    .update(rowPassword)
    .digest('hex');
}

module.exports = {

  async find(params, projection = {}) {
    const result = await User
      .find(params, projection)
      .catch((err) => {
        throw new RuntimeError(err.message);
      });

    if (result === null) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

    return result;
  },

  async findOne(params, projection = {}) {
    const result = await User
      .findOne(params, projection)
      .catch((err) => {
        throw new RuntimeError(err.message);
      });

    if (result === null) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

    return result;
  },

  async save(params) {
    params.password = encode(params.password);

    const result = await User
      .create(params)
      .catch((err) => {
        if (err.code === 11000) {
          throw new BusinessError('serviceNumber overlap');
        }
        throw new RuntimeError(err.message);
      });

    result._id = '';
    result.password = '';

    return result;
  },

  async update(id, params) {
    if (params.password) {
      params.password = encode(params.password);
    }

    const result = await User
      .updateByid(id, params)
      .catch((err) => {
        throw new RuntimeError(err.message);
      });

    result._id = '';
    result.password = '';

    return result;
  },

  async delete(params) {
    const result = await User
      .deleteByid(params.id)
      .catch((err) => {
        throw new RuntimeError(err.message);
      });

    return true;
  },

  async checkExist(params) {
    const user = await User
      .findOneByServiceNumber(params.serviceNumber)
      .catch((err) => {	throw new RuntimeError(err.message); });

    return { exist: user !== null };
  },

};
