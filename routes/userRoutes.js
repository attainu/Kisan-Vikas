const { Router } = require("express");
const passport = require("passport");
const User = require("../models/User");
const { 
    register, 
    login ,
    logout,
    changePassword,
    forgotPassword,
    resetPassword123,
    confirmEmail,
    deactivateAccount,
    showUserData,
    fetchUserFromGoogle,
    fetchUserFromFacebook} = require("../controller/userController");
const router = Router();
router.post("/register",register);
router.get("/confirm/:token",confirmEmail)

router.post("/login", login );
router.post("/logout",logout)

router.post("/changePassword", changePassword);
router.get("/reset/:token",resetPassword123)
// (req,res) => {
    // console.log(req.params)
    // console.log(req.body)
// });
router.post("/forgotPassword",
 forgotPassword);
// router.post("/resetPassword",
//  resetPassword);
//  router.get("/resetPassword/:",passport.authenticate("jwt",{session:false}),
//  resetPassword);

router.post("/deactivateAccount", deactivateAccount);


router.get("/profile",passport.authenticate("jwt", { session: false}),
    showUserData
);
router.get("/google",passport.authenticate("google",{ session:false,
    scope: ["profile","email"]
})
);

router.get("/google/redirect",passport.authenticate("google", {
    session: false,
    failureRedirect:
    "http://localhost:1234/#login"
}),
fetchUserFromGoogle
);

router.get("/facebook", passport.authenticate("facebook", {
    session: false,
    scope: ["email"]
})
);

router.get("/facebook/redirect", passport.authenticate("facebook", {
    session: false,
    failureRedirect:
    "http://localhost:1234/#login"
}),
    fetchUserFromFacebook
);

module.exports = router;