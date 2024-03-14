// eslint-disable-next-line import/no-extraneous-dependencies
const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.apiKey);
logger.info(`Supabase connected on ${config.env} environment 🚀`);

module.exports = supabase;
