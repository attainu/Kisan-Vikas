const sequelize = require("../db");
const {
    hash,
    compare
} = require("bcryptjs");
const {
    Sequelize,
    Model
} = require("sequelize");
const {
    sign
} = require("jsonwebtoken");
const sendMail = require("../utils/generateEmail")
const userSchema = {
    name: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    password: {
        type: Sequelize.STRING,
        allowNull: function () {
            return this.isThirdPartyUser;
        }

    },
    isThirdPartyUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    token: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
    },
    resetToken: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
    }


};
class User extends Model {
    static async findByEmailAndPassword(email, password) {
        try {
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) throw new Error("Incorrect credentials");
            const isMatched = await compare(password, user.password);
            if (!isMatched) throw new Error("Incorrect credentials");
            return user;
        } catch (err) {
            throw err;
        }
    }

    async generateToken(mode) {

        // const secretKey = process.env.TOKEN_SECRET;
        const secretKey = `${this.getDataValue("email")} - ${new Date(this.getDataValue("createdAt")).getTime()}`;
        // console.log(secretKey);
        const token = await sign({
            id: this.getDataValue("id")
        },
            secretKey, {
            expiresIn: (1000 * 60 * 60 * 60).toString()
        }
        );
        if (mode === "confirm") {
            this.setDataValue("token", token);
        } else if (mode === "reset") {
            this.setDataValue("resetToken", token);
        }
        await this.save();
        await sendMail(mode, this.getDataValue("email"), token)
    }


}

User.init(userSchema, {
    sequelize,
    tableName: "users"
});


User.beforeCreate(async user => {
    if (user.password == null) {
        user.password = null;
    } else {
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
    }
});
User.sync()
User.beforeUpdate(async user => {
    if (user.changed("password")) {
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
    }
});

module.exports = User;
