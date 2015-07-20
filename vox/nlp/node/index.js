var natural = require('natural')
var _ = require ('underscore')
var data = require('./dataset.json')
var d3 = require('d3')
var fs = require('fs');

var moment = require('moment');
moment().format();
  
var tokenizer = new natural.WordTokenizer();
var NGrams = natural.NGrams;
var stemmer = natural.PorterStemmer;

natural.PorterStemmer.attach();

data.forEach(function(row){
	row.tokens = tokenizer.tokenize(row.headline)
	row.bigrams = NGrams.bigrams(row.headline)
	row.trigrams = NGrams.trigrams(row.headline)
	row.token_stemmed = row.headline.tokenizeAndStem();
	row.datetime = moment((row.datecombined+' '+row.time), ["YYYY-M-DD hh:mm a", "YYYY-MM-DD hh:mm a","YYYY-M-D hh:mm a","YYYY-MM-D hh:mm a","YYYY-M-DD h:mm a", "YYYY-MM-DD h:mm a","YYYY-M-D h:mm a","YYYY-MM-D h:mm a"]);
	row.timestamp = row.datetime.format();
	row.day = row.datetime.day();
});



alltokens = _.chain(data)
			.pluck('tokens')
			.flatten()
			.unique()
			.map(function(obj){ return {'token': obj}})
			.value();

// // allbigrams = _.chain(data)
// // 			.pluck('bigrams')
// // 			.flatten(true)
// // 			.unique()
// // 			.map(function(obj){return {'bigrams': obj}})
// // 			.value();

// // alltrigrams = _.chain(data)
// // 			.pluck('trigrams')
// // 			.flatten(true)
// // 			.unique()
// // 			.value();

allstemmedtokens = _.chain(data)
			.pluck('token_stemmed')
			.flatten()
			.unique()
			.map(function(obj){ return {'token': obj}})
			.value();

alltokens.forEach(function(token){
	token.counter = getfrequency (token.token,'tokens')
	token.timestamps = gettimestamps (token.token,'tokens')
})

allstemmedtokens.forEach(function(token){
	token.counter = getfrequency (token.token,'token_stemmed');
	token.timestamps = gettimestamps (token.token,'token_stemmed')
})

// // allbigrams.forEach(function(check){
// // 	check.counter = getfrequency(check.bigrams,'bigrams')

// // })

function getfrequency(obj,type) {
	var counter = 0
	data.forEach(function(row){
		if (_.contains(row[type], obj)){
			counter++;
		}
	});
	return counter;
}

function gettimestamps(obj,type){
	var list = [];
	data.forEach(function(row){
		if (_.contains(row[type], obj)){
			list.push(row.timestamp);
		}
	});
	return list;
}

allstemmedtokens.sort(function(x, y){
   return d3.descending(x.counter, y.counter);
})

alltokens.sort(function(x, y){
   return d3.descending(x.counter, y.counter);
})

fs.writeFileSync('allstemmedtokens.json', JSON.stringify(allstemmedtokens));
fs.writeFileSync('alltokens.json', JSON.stringify(alltokens));

// var hillary = _.filter(data, function(row){ return _.contains(row.tokens, 'Hillary') });

// console.log('data length is' + data.length)

// // console.log (_.findWhere(alltokens, {token: "Hillary"}));
// // console.log (_.findWhere(alltokens, {token: "Clinton"}));
// // console.log (_.findWhere(alltokens, {token: "Obama"}));
// // console.log (_.findWhere(alltokens, {token: "Obamacare"}));
// // console.log (_.findWhere(alltokens, {token: "Cruz"}));
// console.log (hillary);