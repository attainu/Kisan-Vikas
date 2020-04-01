const { Router } = require("express");
const router = Router();
const passport = require("passport");
const { order, verify } = require("../controller/orderController");

router.post(
  "/orders",
  passport.authenticate("jwt", {
    session: false
  }),
  order
);
router.post("/verify", verify);

module.exports = router;
