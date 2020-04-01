const {
    Router
} = require("express");
const passport = require("passport");
const router = Router();
const {
    createProduct,
    productDetails,
    searchProducts
} = require("../controller/productController");


router.post('/addproduct', passport.authenticate("jwt", {
    session: false
}),createProduct);

router.get("/products/:id", productDetails)
router.get("/search/:category", searchProducts)



module.exports = router;