var Cart = require('../models/cart');

module.exports = function(req, res, next){
	// This total count means sum of all items quantity
	var total = 0;
	if(req.user){
		Cart.findOne({ user : req.body._id }, function(err, cart){
			if(cart){
				for(var i = 0;  i < cart.items.length; i++) {
					total += cart.items[i].quantity;
				}
				//Where this local variable from? --> see server.js
				res.locals.cart = total;
			} else {
				res.locals.cart = 0;
			}
			next();
		});
	} else {
		next();
	}
}