const sequelize = require("../db");
const {
    Sequelize,
    Model
} = require("sequelize");
const User = require("../models/User");

const addressSchema = {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    flatNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    road: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    pincode: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    landmark: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}

class Address extends Model {}
Address.init(addressSchema, {
    sequelize,
    tableName: "address"
});
module.exports = Address;