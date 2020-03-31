const Address = require("../models/Address");

module.exports = {
    async addAddress(req, res) {
        try {
            const id = req.user.id
            const body = {
                ...req.body,
                userId: id
            };
            const address = await Address.create({
                ...body
            });
            res.status(200).send({
                massage: "Address added successfullly",
                address
            });
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err);
        }
    },

    async editAddress(req, res) {
        try {
            const id = req.params.id
            const userId = req.user.id
            const address = await Address.findOne({
                where: {
                    id
                }
            });
            if (!address) {
                return res.status(401).send("please add address first");
            }
            await address.update({
                ...req.body
            });
            res.send("address updated sucessfully");
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },

    async address(req, res) {
        try {
            const userId = req.user.id
            const address = await Address.findAll({
                where: {
                    userId
                }
            });
            res.status(200).json(address);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async removeAddress(req, res) {
        try {
            const id = req.params.id
            await Address.destroy({
                where: {
                    id
                }
            });
            res.send("address deleted suceessfully");
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    }
}