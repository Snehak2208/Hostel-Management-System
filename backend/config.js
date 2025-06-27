const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // database name: hms
  process.env.DB_USER,       // username: root
  process.env.DB_PASSWORD,   // password: (blank, if root has no password)
  {
    host: process.env.DB_HOST || "127.0.0.1",  // you can use localhost or 127.0.0.1
    dialect: "mysql",
    port: process.env.DB_PORT || 3306
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch(err => console.log("❌ Error: " + err.message));

module.exports = sequelize;
