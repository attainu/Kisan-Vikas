const {
    Router
} = require("express");
const router = Router();
const passport = require("passport");
const {
    addReview,
    reviews,
    editReview
} = require("../controller/reviewController");

router.get("/reviews/:id", passport.authenticate("jwt", {
    session: false
}), reviews)
router.post("/addReview/:id", passport.authenticate("jwt", {
    session: false
}), addReview)
router.post("/editReview/:id", passport.authenticate("jwt", {
    session: false
}), editReview)

module.exports = router;