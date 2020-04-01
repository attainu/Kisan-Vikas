const {
    Router
} = require("express");
const router = Router();
const passport = require("passport");
const {
    addToCart,
    carts,
    removeFromCart
} = require("../controller/cartController");

router.get("/carts", passport.authenticate("jwt", {
    session: false
}), carts)
router.post("/addToCart/:id", passport.authenticate("jwt", {
    session: false
}), addToCart)
router.post("/removeFromCart/:id", passport.authenticate("jwt", {
    session: false
}), removeFromCart)

module.exports = router;