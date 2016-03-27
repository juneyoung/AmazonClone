var router = require('express').Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

function paginate(req, res, next){
	var perPage = 9;
		var page = req.params.page;

		//mongoose pagination
		//skip 에서 한 페이지 빼야 정상아냐?
		Product.find()
		.skip(page * perPage)
		.limit(perPage)
		.populate('category')
		.exec(function(err, products){
			if(err) return next(err);	
			//count 는 해당 모델의 총 수량을 가져옴 
			Product.count().exec(function(err, count){
				if(err) return next(err);
				res.render('main/product-main', {
					products : products
					, pages : count / perPage
				});
			});
		});
}

Product.createMapping(function(err, mapping){
	if(err){
		console.log('Error create Mapping');
		console.error(err);	
	} else {
		console.log('Mapping created');
		console.log(mapping);
	}

});

//Bridge between eleastic replica set and Product database
//엘라스틱 서치가 모든 데이타 셋을 레플리케이트(복제)함.

var stream = Product.synchronize();
var count = 0;

//총 데이타 카운팅
stream.on('data', function(){
	count++;
});

//동기화가 종료되었을 때 총합을 출력
stream.on('close', function(){
	console.log('Indexed ' + count + ' documents.');
});

//에러 발생시 에러 출력 
stream.on('error', function(err){
	console.error(err);
});


//Increase and decrease amount of items in cart
router.get('/cart', function(req, res, next){
	Cart.findOne({owner : req.user._id})
	.populate('items.item')
	.exec(function(err, foundCart){
		if(err) return next(err);
		res.render('main/cart', {
			foundCart : foundCart
			, message : req.flash('remove')
		});
	});
});



//Cart router
router.post('/product/:product_id', function(req, res, next){
	Cart.findOne({owner : req.user._id}, function(err, cart){
		cart.items.push({
			item: req.body.product_id
			, price : parseFloat(req.body.priceValue)
			, quantity : parseInt(req.body.quantity)
		});
		//Total price - toFixed handles under dot
		cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

		cart.save(function(err){
			if(err) return next(err);
			return res.redirect('/cart');
		});
	});
});

router.post('/remove', function(req, res, next){
	Cart.findOne({ owner : req.user._id }, function(err, foundCart){
		if(err) return next(err);

		//
		foundCart.items.pull(String(req.body.item));

		foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
		foundCart.save(function(err, found){
			if(err) return next(err);
			req.flash('remove', 'Successfully removed');
			res.redirect('/cart');
		});
	});
});



router.get('/', function(req, res, next){
	//res.json('Hello, node!');

	if (req.user) {
		paginate(req, res, next);
	} else {
		res.render('main/home');
	}
});

router.get('/page/:page', function(req, res, next){
	paginate(req, res, next);
});


router.get('/about', function(req, res){
	res.render('main/about');
});


router.post('/search', function(req, res, next){
	res.redirect('/search?q=' + req.body.q);
});

router.get('/search', function(req, res, next){
	if(req.query.q){
		Product.search({
			query_string : {query :  req.query.q}
		}, function(err, results){
			if (err) return next(err);
			var data = results.hits.hits.map(function(hit){
				return hit;
			});

			res.render('main/search-result', {
				query : req.query.q
				, data : data
			});
		});
	}
})


//: means path parameter
// populate is only abled when id is Schema.Types.ObjectId(mongoose), it access data with given ID
router.get('/products/:id', function(req, res, next){
	Product.find({category : req.params.id})
	.populate('category')
	.exec(function(err, products){
		if(err) return next(err);
		res.render('main/category', {
			products : products
		});
	})
});


router.get('/product/:id', function(req, res, next){
	Product.findById({_id : req.params.id }, function(err, product){
		if(err) return next(err);
		res.render('main/product', {
			product : product
		});
	});
});

module.exports = router;