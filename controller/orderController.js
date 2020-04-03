const Orders = require("../models/order");
const User = require("../models/User");
const generateEmail = require("../utils/generateEmail");
const instance = require("../utils/razorpay");
const createSignature = require("../utils/createSignature");
const transactions = require("../transactions.json")
// console.log(transactions)
const { v4: uuid } = require("uuid");
// const cors = require("cors")
const fs = require("fs-extra");

module.exports = {
  async order(req, res) {
    const { user, amountInPaise, currency} = req.body;
    
      
      const transactionId = uuid();
      const orderOptions = {
        currency,
        amount: amountInPaise,
        receipt: transactionId,
        payment_capture: 0
      };
      try {

      
    //   console.log(orderOptions)
      const order = await instance.orders.create(orderOptions);
      console.log(order);
      const transaction = {
        _id: transactionId,
        user,
        order_value: `${amountInPaise / 100} INR`,
        razorpay_order_id: order.id,
        razorpay_payment_id: null,
        razorpay_signature: null,
        isPending: true
      };
      transactions.push(transaction);
      const transactionsJSON = JSON.stringify(transactions);
      await fs.writeFile("./transactions.json",transactionsJSON);
      
      
      res.status(201).json({
        statusCode: 201,
        orderId: order.id,
        amount: transaction.order_value,
        name: user.name,
    
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({statusCode:500,message:"server error"});
    }
},

  

  async verify(req, res) {
    const {
      amount,
      currency,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    // console.log(amount)
    try {
    //   const amountInRupees = amount / 100;
      const createdSignature = createSignature(
        razorpay_order_id,
        razorpay_payment_id
      );
      // console.log(createdSignature)
      if (createdSignature !== razorpay_signature) 
      {
        await sendMail(
          email,
          "fail",
          amount,
          razorpay_payment_id,
          razorpay_order_id
        );
        return res.status(401).send({
          statusCode:401,
          message:"invalid payment request"
        });
      }
      const captureResponse = await instance.payments.capture(
        //   amountInRupees,
          razorpay_payment_id,
          amount,
          currency
        );
  
      const transaction = await Orders.findOne({
        where:{
          order_id
        }
      });
      if (!transaction) {
        return res.status(401).send({
          statusCode: 401,
          message: "Invalid payment request"
        });
      }
      
      await transaction.update({
        razorpay_payment_id:razorpay_payment_id,
        razorpay_signature:razorpay_signature,
        isPending:false,
        razorpay_order_id:razorpay_order_id
      });

      await sendMail(
        email,
        "success",
        amount,
        razorpay_payment_id,
        razorpay_order_id
      );
      console.log("mail send successfully");
      res.status(201).send({
        transaction,
        captureResponse
      });
      
    } catch (err) {
      if(err.name === "ValidationError")
      res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err)
    }
}
};