# AmazonClone
Lectured on Udemy from 16


https://www.udemy.com/build-an-amazon-clone-nodejs-stripe-elasticsearch


### What I have learned
- Need MongoDB and elasticSearch to able to run this project.
- It will print an error if you use node version under 4, when using moongoosastic
- Can update node.js version via `nvm`, however when command have to drop `v`, i.e. `nvm install 5.7.1`.
- It will not running if you have several function with same signiture in `{router}.js` file.
- ejs : importing layout with `<% layout('layout') -%>`. do not drop `-`.
- mongoose supports pagination like `{ModelObject}.skip(page*perPage).limit(perPage).populate('{MongooseObjectName}').exec(function(err, {models}){ /* Do something ... */ })`
- get total count via mongoose like `{ModelObject}.count().exec(function(err, count){/* Do something ... */})`
- Differences among `request.body`, `request.param`, `request.query`.
~~~~
:: Answer from Arash
1. req.body is for the body of html like forms, input field and so on. It is used to get data from input field.
2. req.param is for URL, for example http://aaa.com/:name
 if you want to access :name, then simply use req.param.name, req.param is used when you want to go to a single item page.
 like aaa.com/jack , or aaa.com/john
3. req.query is mainly for search. if you go to google, and try to type in something, and then take a look at the URL.
~~~~
- basic setting VO by mongoose(which I always forgot)
```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
	owner : {type : Schema.Types.ObjectId , ref : 'User'}
	, total : {type : Number, default : 0}
	, items : [{
		item : {type : Schema.Types.ObjectId, ref : 'Product'}
		, quantity : {type : Number, default : 0}
		, price : {type : Number, default : 1}
	}]
});

module.exports = mongoose.model('Cart', CartSchema);
```
- `async.waterfall` receives array of anonymous functions. The first parameter is always callback.
- `express-flash` library for messaging to router. 
- `module.exports` can return anonymous function.


#### 2016.04
- people already provide decent UIs in "http://bootsnipp.com/"
- handling annoying node version control in OSX `nvm alias default 5.7.1`, make certain version as a default value.
