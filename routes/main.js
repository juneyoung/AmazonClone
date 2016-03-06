var router = require('express').Router();
var Product = require('../models/product');

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

router.get('/', function(req, res){
	//res.json('Hello, node!');
	res.render('main/home');
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