const express = require("express");
const bodyparser = require('body-parser')
const app = express();
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
const stripe = require("stripe")("sk_test_51L9pO7CRx1dyi6eWNP90BGgE78I5K5WrsnpKnuKUTGgusJQ519bdktMXYTjF9ZZOut8iKqkQw1jiEgW0YTkYVTzE00S932Oxh1");
const cors = require('cors')

app.use(cors())

app.post('/checkout', async(req, res) => {
    try {
       
        token = req.body.token
        amount = req.body.amount
        description = req.body.description
        rcptMail= req.body.rcptMail
      const customer = stripe.customers
        .create({
          email: rcptMail,
          source: token.id
        })
        .then((customer) => {
        
          return stripe.charges.create({
            amount: amount *100,
            description: description,
            currency: "EUR",
            customer: customer.id,
          });
        })
        .then((charge) => {
         
            res.json({
              data:"success"
          })
        })
        .catch((err) => {
            console.log(err)
            res.json({
              data: "failure",
              error: err.decline_code 
            });
        });
      return true;
    } catch (error) {
      return false;
    }
})

app.listen(5000, () => {
    console.log("App is listening on Port 5000")
})