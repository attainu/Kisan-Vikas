const {
    Router
} = require("express");
const router = Router();
const passport = require("passport");
const {
    addAddress,
    address,
    editAddress,
    removeAddress
} = require("../controller/addressController");

router.get("/address", passport.authenticate("jwt", {
    session: false
}), address)
router.post("/addAddress", passport.authenticate("jwt", {
    session: false
}), addAddress)
router.post("/editAddress/:id", passport.authenticate("jwt", {
    session: false
}), editAddress)
router.post("/removeAddress/:id", passport.authenticate("jwt", {
    session: false
}), removeAddress)

module.exports = router;