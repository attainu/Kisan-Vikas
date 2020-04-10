const Product = require("../models/product");
const Review = require("../models/review");
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
            const review = await Review.findAll({
                where: {
                    productId: id
                }
            });

            
            res.status(200).send({
                product,
                review
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
    },

    async uploadPhoto(req, res, next){
        // console.log(req.files);
        const file = req.files.photo;
        file.mv('./uploads/' + file.name, function(err){
            if (err) //res.send("err")
                throw err;
            // next();

            });
        
        res.send({
            success:true,
            message:"file upload"
        });
    }
};