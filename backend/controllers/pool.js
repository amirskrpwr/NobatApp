const Pool = require("pg").Pool;

exports.Pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "api",
    password: "amirihossein",
    port: 5432,
});
