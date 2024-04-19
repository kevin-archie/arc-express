const _ = require('lodash');
const supabase = require('../config/supabase');

function _sanitizePayload(payload, resource) {
  const object = payload;

  object.resource = resource;
  return _.omitBy(object, _.isNil);
}

module.exports = class AuditLog {
  constructor(resource) {
    this.resource = resource;
    this.client = supabase;
  }

  async createEvent(payload) {
    const record = _sanitizePayload(payload, this.resource);

    try {
      return this.client.from('user_activities').insert(record).select();
    } catch (e) {
      throw new Error(e);
    }
  }
};
