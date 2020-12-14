const envConfig = require("../../" + process.env.CONFIG);
process.env = { ...process.env, ...envConfig };
