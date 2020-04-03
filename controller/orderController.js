const Orders = require("../models/order");
const User = require("../models/User");
const generateEmail = require("../utils/generateEmail");
const instance = require("../utils/razorpay");
const createSignature = require("../utils/createSignature");
const transactions = require("../transaction")
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
      const transactionJSON = JSON.stringify(transaction);
      await fs.writeFile("./transaction.json",transactionJSON);
      
      
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
      if (createdSignature !== razorpay_signature) {
        return res.status(401).send({statusCode:401,message:"invalid payment request"});
      }
      const captureResponse = await instance.payments.capture(
        //   amountInRupees,
          razorpay_payment_id,
          amount,
          currency
        );
    //     return res.status(401).send({
    //       statusCode: 401,
    //       message: "Invalid payment request"
    //     });
    //   }
      const captureResponses = await instance.payments.capture(
        razorpay_payment_id,
        amount,
        currency
      );
      const transaction = transactions.find( t => t.razorpay_order_id === razorpay_order_id);
      if (!transaction) {
        return res.status(401).send({
          statusCode: 401,
          message: "Invalid payment request"
        });
      }
      transaction.razorpay_payment_id = razorpay_payment_id;
      transaction.razorpay_signature = razorpay_signature;
      transaction.isPending = false;
      const transactionJSON = JSON.stringify(transactions);
      await fs.writeFile("./transactions.json", transactionsJSON);
      console.log(captureResponse);
      res.json(transaction);
      
      
    } catch (err) {
      res.statusCode(500).send({ statusCode:500, message:"server error"})
    }
}
}