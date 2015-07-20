var request = require('request');
var chalk = require('chalk');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('underscore');
var queue = require('queue-async');

var i;

_.rateLimit = function(func, rate, async) {
  var queue = [];
  var timeOutRef = false;
  var currentlyEmptyingQueue = false;
  
  var emptyQueue = function() {
    if (queue.length) {
      currentlyEmptyingQueue = true;
      _.delay(function() {
        if (async) {
          _.defer(function() { queue.shift().call(); });
        } else {
          queue.shift().call();
        }
        emptyQueue();
      }, rate);
    } else {
      currentlyEmptyingQueue = false;
    }
  };
  
  return function() {
    var args = _.map(arguments, function(e) { return e; }); // get arguments into an array
    queue.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
    if (!currentlyEmptyingQueue) { emptyQueue(); }
  };
};

var scrape_limited = _.rateLimit(scrape, 2000)

url = 'https://www.propublica.org/archive/P'
var data = [];
var urlsscraped = [];

for (i=0; i<=6060; i=i+20){
  scrape_limited (url+i+'/');
};

function scrape (usingurl){

request(usingurl, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      console.log(chalk.cyan('requesting... '), chalk.yellow(usingurl))
      var $ = cheerio.load(body);
      var $all_stories = $('.compact-list-item');

      $all_stories.each(function(index, story){
        
        var obj = {};

          var $headline = $(story).find('h2 a')
          var $adate = $(story).find('.byline')
          var $author = $(story).find('.byline a')
          var link = $headline.attr('href')
          obj.headline = $headline.text();
          obj.adate=$adate.text();
          obj.author=$author.text();
          obj.content = $(story).text();
          obj.link = link;
        
        data.push(obj);      
        
      });

            // When we're all done, write the file
      fs.writeFileSync('data.json', JSON.stringify(data));
      fs.writeFileSync('urlsscraped.json', JSON.stringify(urlsscraped));

    } else {
      console.log(chalk.red('There was an error'), error, response);
    };

    urlsscraped.push(usingurl);
  })
}