const crypto = require("crypto");
module.exports = (razorpayOrderId, razorpayPaymentId) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac("sha256",secret);
    const data = `${razorpayOrderId}|${razorpayPaymentId}`;
    hmac.update(data);
    const hash = hmac.digest("hex");
    return hash;
};