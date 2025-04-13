
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("hostel_db", "root", "Sneha123@", {
  host: "127.0.0.1",  // Change from "::1" to "127.0.0.1"
  dialect: "mysql",
  port: 3306
});

sequelize.authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch(err => console.log("❌ Error: " + err.message));

module.exports = sequelize;