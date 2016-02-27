//Callback 안에서도 aync 이슈가 발생할 수 있나?
/*
가령,
1. 사용자를 검색하고
2. 결과를 받은 콜백에서 업데이트나 인서트를 하는데

최상위 브레킷이 종료되지 않았는데, 하위 브레킷이 실행될 수 있나?

*/

var async = require('async');

//async.waterfall([func1, func2, func3 ...])
//다음 func 의 파라미터를 찾을 때, name 으로 찾나?
//만약 아니라면 callback(a, b) 의 파라미터가 역으로 바뀌어야 하지 않나?
//아직 이해 못함.
async.waterfall([
	function(callback){
		Category.find(err, function(err, category){
			if(err) return next(err);
			callback(null, category);
		});
	}

	, function(category, callback) {
		Product.findOne({category : category_id}, function(err, productSingle){
			if(err) return next(err);
			callback(null, productSingle);
		});
	}

	, function(productSingle, callback) {
		Product.findById({_id : productSingle._id}, function(err, product){
			if(err) return next(err);
			res.render('/');
			res.redirect('');
			...
		});
	}

]);