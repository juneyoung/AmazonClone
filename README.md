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
- `adding stripe payment` and got an error below.
```
POST /payment 302 50.269 ms - 60
{ profile: 
   { name: 'juneyoung',
     picture: 'https://gravatar.com/avatar/117d6d886c127a6aa79a4200df2d46d2?s=200&d=retro' },
  history: [],
  __v: 0,
  email: 'juneyoung@hanmail.net',
  password: '$2a$10$4ng5bnaMb9nvsmam125xWe6Fsfk0ePxZpSU8lq6NvYVfREibdXxSC',
  _id: 56f2af4f2424a8621e4d32cf }
GET /profile 200 66.869 ms - 3082
Unhandled rejection Error: Invalid integer: NaN
    at Error._Error (/Users/juneyoungoh/Documents/node_amazon/sample/node_modules/stripe/lib/Error.js:12:17)
    at Error.Constructor (/Users/juneyoungoh/Documents/node_amazon/sample/node_modules/stripe/lib/utils.js:105:13)
    at Error.Constructor (/Users/juneyoungoh/Documents/node_amazon/sample/node_modules/stripe/lib/utils.js:105:13)
    at Function.StripeError.generate (/Users/juneyoungoh/Documents/node_amazon/sample/node_modules/stripe/lib/Error.js:56:14)
    at IncomingMessage.<anonymous> (/Users/juneyoungoh/Documents/node_amazon/sample/node_modules/stripe/lib/StripeResource.js:138:39)
    at emitNone (events.js:85:20)
    at IncomingMessage.emit (events.js:179:7)
    at endReadableNT (_stream_readable.js:913:12)
    at _combinedTickCallback (node.js:377:13)
    at process._tickCallback (node.js:401:11)
```
-> revealed as simple mis-typo, fixed `stipe.charges` to `stripe.charges`
- adding `spiner.js` put it into `stripeResponseHandler(status, response)` in `custom.js`
