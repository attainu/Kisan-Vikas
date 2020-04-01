const sequelize = require("../db");
const {
    Sequelize,
    Model
} = require("sequelize");
const User = require("../models/User");
const orderSchema = {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    order_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    order_value: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    razorpay_payment_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    razorpay_order_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    razorpay_signature: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isPending: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
};

class Order extends Model {}
Order.init(orderSchema, {
    sequelize,
    tableName: "orders"
});
module.exports = Order;