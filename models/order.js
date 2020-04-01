// const sequelize = require("../db");
// const {
//     Sequelize,
//     Model
// } = require("sequelize");
// const User = require("../models/User");

// const addressSchema = {
//     userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//             model: User,
//             key: 'id'
//         }
//     },
//     flatNo: {
//         type: Sequelize.STRING,
//         allowNull: true,
//     },
//     road: {
//         type: Sequelize.STRING,
//         allowNull: true,
//     },
    
// }

// class Order extends Model {}
// Order.init(addressSchema, {
//     sequelize,
//     tableName: "orders"
// });
// module.exports = Order;