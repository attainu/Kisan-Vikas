const nodemailer = require("nodemailer");
const { YAHOO_EMAIL, YAHOO_PASSWORD } = process.env;

const transportOptions = {
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    debug:true,
    auth: {
        user:YAHOO_EMAIL,
        pass:YAHOO_PASSWORD
    }
};
const mailTransport = nodemailer.createTransport(transportOptions);
const sendMailToUser = async (mode,email,token) => {
    const domainName = process.env.DOMAIN_NAME || `http://localhost:3000`;
    console.log("i am getting called", mode);
    let html = null;
    if(mode === "confirm")
    html = `
        <h1>Welcome to my application</h1>
        <p>thanks for creating an account.click
        <a href= ${domainName}/confirm/${token}>here</a> to confirm your account or copy paste
        ${domainName}/confirm/${token} to your browser</p>
        `;
        else if(mode === "reset")
        html = `<h1> hi there</h1>
            <p>you are recently requested fora change in password.click
            <a href=${domainName}/reset/${token}>here</a>
            to reset your password or copy paste${domainName}/reset/${token} to your browser.
            if you didnt initiate the request.kindly ignore.thanks</p>
        `;

try {
    await mailTransport
        .sendMail({
            from:YAHOO_EMAIL,
            to:email,
            subject:
            mode === "confirm"?"confirm your email":"Reset your password",html
        });
        
} catch (err){
    console.log(err);
    throw err;
}
}
// mailTransport.verify()
// .then(res => console.log(res))
// .catch(err => console.log(err));

// mailTransport
// .sendMail({
//     from:"chaitalimaske56@yahoo.com",
//     to:"ssbarde@gmail.com",
//     text:"check email"
// }).then(res => console.res(res))

module.exports = sendMailToUser;
