const envConfig = require("../../" + (process.env.CONFIG || 'config.js'));
process.env = { ...process.env, ...envConfig };
