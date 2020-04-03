const Product = require("../models/product");
// const fileupload = require("express-fileupload");

module.exports = {
    async createProduct(req, res) {
        try {
            const product = await Product.create({
                ...req.body
            });
            res.status(200).json(product);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async getProducts(req, res) {
        try {
            const product = await Product.findAll({});
            res.status(200).json(product);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async productDetails(req, res) {
        try {
            const id = req.params.id
            const product = await Product.findOne({
                where: {
                    id
                }
            });
            
            res.status(200).send({
                product
            });
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async searchProducts(req, res) {
        try {
            const category = req.params.category
            const product = await Product.findAll({
                where: {
                    category
                }
            });
            res.status(200).json(product);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    }
};