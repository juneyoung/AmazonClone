var mongoose = require('mongoose');
//ElaticSearch 를 사용하여 기본 모델에 Product.search/craeteMapping 와 같은 방식으로 검색을 할 수 있게 함.
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	category : {type : Schema.Types.ObjectId, ref : 'Category'}
	, name : String
	, price : Number
	, image : String
});

//Set Elastic Search
ProductSchema.plugin(mongoosastic, {
	hosts : [
		'localhost:9200'
	]
});

module.exports = mongoose.model('Product', ProductSchema);