const sequelize = require("../db");
const {
    Sequelize,
    Model
} = require("sequelize");
const User = require("../models/User");
const Product = require("../models/product");
const cartSchema = {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    totalPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}

class Cart extends Model {}
Cart.init(cartSchema, {
    sequelize,
    tableName: "carts"
});
module.exports = Cart;