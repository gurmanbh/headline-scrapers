var request = require('request');
var chalk = require('chalk');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('underscore');
var queue = require('queue-async');

var i;

url = 'https://www.vox.com/news/'
var data = [];

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

var scrape_limited = _.rateLimit(scrape, 30)

for (i=1; i<=408; i++){
  scrape_limited(url+i);
};

function scrape (usingurl){

request(usingurl, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      console.log(chalk.cyan('requesting... '), chalk.yellow(usingurl))
      var $ = cheerio.load(body);
      var $all_stories = $('.m-block');

      $all_stories.each(function(index, story){
        
        var obj = {};

        if ($(story).hasClass('feature')) {

          var $headline = $(story).find('h3 a')
          var $adate = $(story).find('.m-block__body__byline')
          var $author = $(story).find('.m-block__body__byline a')
          var link = $headline.attr('href')
          obj.type = 'feature';
          obj.headline = $headline.text();
          obj.adate=$adate.text();
          obj.author=$author.text();
          obj.link = link;
        }

        if ($(story).hasClass('article')){

          var $headline = $(story).find('h3 a')
          var $adate = $(story).find('.m-block__body__byline')
          var $author = $(story).find('.m-block__body__byline a')
          var $content = $(story).find('.m-block__body__blurb');
          var link = $headline.attr('href')
          obj.type = 'story';
          obj.headline = $headline.text();
          obj.adate=$adate.text();
          obj.author=$author.text();
          obj.content = $content.text();
          obj.link = link;
        }

        if ($(story).hasClass('stream')){

          var $headline = $(story).find('h3 a')
          var $adate = $(story).find('.m-block__body__byline')
          var $author = $(story).find('.m-block__body__byline a')
          var link = $headline.attr('href')
          obj.type = 'stream';
          obj.headline = $headline.text();
          obj.adate=$adate.text();
          obj.author=$author.text();
          obj.link = link;
        }
        
        data.push(obj);
        
      });

            // When we're all done, write the file
      fs.writeFileSync('dataJuly10.json', JSON.stringify(data));

    } else {
      console.log(chalk.red('There was an error'), error, response);
    }
  })
}