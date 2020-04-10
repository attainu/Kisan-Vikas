const sequelize = require("../db");
const User = require("../models/User")
const {
    Sequelize,
    Model
} = require("sequelize");

const productSchema = {
    UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
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
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    }
    
};


class Product extends Model {}
Product.init(productSchema, {
    sequelize,
    tableName: "products"
});



module.exports = Product;