'use strict';

/**
 * adjusted-ledger service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::adjusted-ledger.adjusted-ledger');
