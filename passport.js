const passport = require("passport");
const {
  Strategy: JWTStrategy,
  ExtractJwt
} = require("passport-jwt");
const {
  Strategy: GoogleStrategy
} = require("passport-google-oauth20");
const {
  Strategy: FacebookStrategy
} = require("passport-facebook");
const User = require("./models/User");
const cookieParser = require("cookie-parser");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  TOKEN_SECRET
} = process.env;

// done cb types of forms
//------------------------
// done(null, user) -- Positive form (req.user);
// done(null, false, customErrorMessage) -- Negative form (400) Client gave wrong details
// done(err) -- Negative form Server Error (500)
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    req => req.cookies.token
  ]),
  secretOrKey:TOKEN_SECRET
};

passport.use(
  new JWTStrategy(jwtOptions, async ({
    id
  }, done) => {
    try {
      const user = await User.findOne({
        where: {
          id
        }
      });
      if (!user)
        return done(null, false, {
          message: "Incorrect Credentials"
        });
      done(null, user);
    } catch (err) {
      if (err.name === "Error") {
        res.send(err);
      }
    }
  })
);
// Passport Google Strategy
const googleOptions = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:3000/google/redirect`
};

passport.use(
  new GoogleStrategy(googleOptions, async (_, _1, googleProfile, done) => {
    try {
      const {
        _json: {
          email,
          name
        }
      } = googleProfile;
      // Ask whether the user is present or not.
      let user = await User.findOne({
        where: {
          email
        }
      });
      if (!user)
        user = await User.create({
          email,
          name,
          isThirdPartyUser: true
        });
      return done(null, user);
    } catch (err) {
      if (err.name === "Error") {
        return done(err);
      }
    }
  })
);

const facebookOptions = {
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: `http://localhost:3000/facebook/redirect`,
  profileFields: ["id", "email", "name"]
};

passport.use(
  new FacebookStrategy(
    facebookOptions,
    async (_, _1, facebookProfile, done) => {
      try {
          console.log(facebookProfile)
        const {
          _json: {
            email,
            first_name,
            last_name
          }
        } = facebookProfile;
        // Ask whether the user is present or not.
        let user = await User.findOne({
          where: {
            email
          }
        });
        if (!user)
          user = await User.create({
            email,
            name: `${first_name} ${last_name}`,
            isThirdPartyUser: true
          });
        return done(null, user);
      } catch (err) {
        console.log(err);
        if (err.name === "Error") {
          return done(err);
        }
      }
    }
  )
);
