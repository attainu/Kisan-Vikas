const {
    Router
} = require("express");
const passport = require("passport");
const router = Router();
const {
    createProduct,
    // uploadPhoto,
    productDetails,
    searchProducts
} = require("../controller/productController");


router.post('/addproduct', passport.authenticate("jwt", {
    session: false
}),createProduct);
// router.post("/upload",uploadPhoto);
router.get("/products/:id", productDetails)
router.get("/search/:category", searchProducts)



module.exports = router;