const Sequelize = require("sequelize");
const {
  POSTGRES_URI,
  POSTGRES_PASSWORD
} = process.env;

const sequelize = new Sequelize(
  POSTGRES_URI.replace("<password>", POSTGRES_PASSWORD),{logging:false}
);

sequelize.sync();

sequelize
  .authenticate()
  .then(() => console.log("database connected successfully "))
  .catch(err => console.log(`Error: ${err.message}`));

module.exports = sequelize;