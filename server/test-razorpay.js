const Razorpay = require('razorpay');
const rzp = new Razorpay({
  key_id: 'rzp_test_SQbbsEM3Dlfgi2',
  key_secret: 'n6saGAP0Sv2l2NLBwn3h8RUQ'
});

rzp.orders.create({
  amount: 100 * 100,
  currency: 'INR',
  receipt: 'test_receipt_' + Date.now()
}).then(order => {
  console.log('Order:', order);
}).catch(err => {
  console.error('Error:', err);
});
