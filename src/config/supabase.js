// eslint-disable-next-line import/no-extraneous-dependencies
const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

let supabase = null;

function connectToSupabase() {
  return new Promise((resolve, reject) => {
    if (!supabase) {
      try {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);
        // eslint-disable-next-line no-console
        logger.info(`Supabase connected on ${process.env.NODE_ENV} environment 🚀`);
        resolve(supabase); // Resolve the promise with the Supabase client
      } catch (error) {
        reject(error); // Reject the promise if there's an error
      }
    } else {
      resolve(supabase); // If already initialized, resolve with the existing client
    }
  });
}

module.exports = { connectToSupabase };
