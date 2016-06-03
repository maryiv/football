/**
 * Set data schema
 *
 */

'use strict';

const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('./schema.json');

module.exports = getBabelRelayPlugin(schema.data);
