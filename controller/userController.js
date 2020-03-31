const User = require("../models/User");
const { verify } = require("jsonwebtoken")
const transporter = require("../utils/generateEmail")
// const passport = require("passport")
module.exports =   {
    async confirmEmail(req, res) {
        const { token } = req.params;
        try {
           // finding the user with the help of token 
           const user = await User.findOne({
               where:{
                   token
               }
           });
           if(!user) {
               return res.status(401).send('invalid crendentials')
           }
           req.user = user.dataValues;
           const secretKey = `${user.getDataValue("email")}-${new Date(user.getDataValue("creatAt")).getTime()}`;
           const payload = await verify(token,secretKey);
           console.log(payload);
           if(payload) {
               await User.update({
                   isConfirmed:true,
                   token:""
               });
               req.user = undefined;
               return res.send("token find successfully")
           }
        } catch (err) {
            console.log(err);
            if(err.name === "TokenExpiredError") {
                return res.send("confirmEmail",{
                    errorMessage:true
                });
            }
            console.log(err.message);
        }
    },

    async resetPassword (req, res) {
        const {resetToken } = req.params;
        try {
            //finding the user with the help of token
            const user = await User.findOne({where:{
                resetToken
            }});
            if (!user) {
                return res.send("forgot password");
            }
            const secretKey = 
            `${user.getDataValue("email")} - ${new Date(user.getDataValue("createdAt")).getTime()}`;
            const payload = await verify(resetToken,secretKey);
            if(payload) {
                return res.send("resetPassword",{
                    email:user.getDataValue("email")
                });
        }
            
        } catch(err) {
            console.log(err);
            if(err.name === "TokenEpiredError") {
                return res.send("forgot password")
            }
            res.status(500).send("server error")
        }
        
    },
    async register(req, res) {
        try {
            const user = await User.create({
                ...req.body,
                isThirdPartyUser: false
            });
             await user.generateToken("confirm");
             res.status(200).send("user registered successfully.check your email")
            
                
        } catch (err) {
            console.log(err);
            if (err.name === "SequelizeValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },

    async login (req,res) {
        const{ email,password } = req.body;
        if(!email || !password)
        return res.status(400).send("incorrect crendentials");
        try {
            const user = await User.findByEmailAndPassword(email, password);
            if (user.dataValues.isConfirmed) {
                return res.send("incorrect crendentials");
            }
            return res.status(403).send("you havent confirmed your account.please check your mail")

            // await user.generateToken();
            // return res.json({
            //     token:"JWT" + user.token
            // });
        } catch(err) {
            console.log(err.message)
            res.send("invalide crendentials")
        }
        
        
        },
        
    

    async changePassword(req, res) {
        const {
          email,
          oldPassword,
          newPassword
        } = req.body;
        if (!email || !oldPassword || !newPassword)
          return res.status(400).send("Bad request");
        try {
          const user = await User.findByEmailAndPassword(
            email,
            oldPassword
          );
          if (!user) {
            return res.status(401).send("Incorrect credentials");
          }
          await user.update({
            password: newPassword
          });
          return res.send(user);
        } catch (err) {
          console.log(err.message);
          res.send("invalid credential");
        }
    },

    async deactivateAccount(req, res) {
        const {
          email,
          
        } = req.body;
        if (!email)
          return res.status(400).send("email is required");
        try {
            await User.destroy({
                where: {
                  email
                }
              });
              return res.send("User Deactivated suucessfully");
            } catch (err) {
              console.log(err.message);
              res.status(500).send("Server Error");
          
          }
          
        },

        async regenerateToken(req, res) {
            await req.user.generateConfirmToken();
            res.status(202).send("confirmation email resent.please check your inbox")
        },

        async forgotPassword(req, res){
            const { email } = req.body;
            if(!email) return
            res.status(400).send("email is required")
            try {
                const user = await User.findOne({where:{
                    email
                }
            });
            if(!user) {
                return res.status(400).send("there is no user presen.kindly register")
            }
            await user.generateToken("reset");
            res.send("email sent successfully.check your inbox")
            } catch (err) {
                res.status(500).send(err.message);
            }
        },

        async resetPassword (req, res) {
            const { password, email} = req.body;
            try {
                await User.update({
                    password,resetToken:""
                }, {where:{email},individualHooks:true});
                return res.send("incorrect crendentials")
            } catch(err) {
                console.log(err);
                res.status(500).send(err.message)
            }
        },
    
    

    
    

    async showUserData(req,res) {
        res.json({ user: req.user });
    },

    async fetchUserFromGoogle(req, res){
        const user = req.user;
         await user.generateToken();
        console.log(user.token)
        //send token as cookies
        res.cookie("token",user.token, {
            expires: new Date(Date.now() + 1000 * 60 *60 * 12),
            httpOnly: true,
            sameSite: "none"
        });
        //redirect to client route(http://localhost:1234)

        res.redirect("http://localhost:1234/#dashboard");
    }, 

    async fetchUserFromFacebook (req, res)  {
        const user = req.user;
         await user.generateToken();
        console.log(user.token)
        //send cookie token
        res.cookie("token",user.token, {
            expires:new Date(Date.now() + 1000 * 60 * 60 * 12),
            httpOnly: true,
            sameSite: "none"
        });
    //redirect to client(http:localhost:1234)
    res.redirect("http://localhost:1234/#dashboard");
    }
}
