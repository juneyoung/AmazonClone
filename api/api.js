/*
router 설정
async, faker 라이브러리 설치, 임포트
Category, Product 모델 임포트 

get 으로 받아서 name 으로 카테고리 검색 + 해당 카테고리 중 30 개의 프로덕트를 faker.commerce 를 사용해서 등록 => json 으로 success 라는 결과값을 페이지로 전송 

* router 에서 /:name 으로 받으면 path 를 파라미터로 받을 수 있음.

*/

var router = require('express').Router();
var async = require('async');
var faker = require('faker');

var Category = require('../models/category');
var Product = require('../models/product');


router.post('/search', function(req, res, next){
	console.log(req.body.search_term);
	Product.search({
		query_string : { 
			query : req.body.search_term 
		}
	}, function(err, results){
		if(err) next(err);
		return res.json(results);
	});
});


router.get('/:name', function(req, res, next){

	//req.body.name 과 req.params.name 이랑 뭐가 다르지?
	async.waterfall([
		function(callback){
			Category.findOne({name : req.params.name}, function(err, category){
				if(err) return next(err);
				callback(null, category);
			})
		}

		, function(category, callback) {

			for(var i = 0; i < 30; i ++){
				var product = new Product();

				product.category = category._id;
				product.name = faker.commerce.productName();
				product.price = faker.commerce.price();
				product.image = faker.image.image();

				product.save();
			}
		}

	]);

	res.json({message : 'success'});
});

module.exports = router;