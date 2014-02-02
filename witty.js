var restclient = require('node-restclient');
var Twit = require('twit');
var express = require("express");
var app = express();

app.get('/', function(req, res){
    res.send('Hello world.');
});
app.listen(3000);


// twitter app info
var T = new Twit({
  consumer_key:         'Null', 
  consumer_secret:      'Null',
  access_token:         'Null',
  access_token_secret:  'Null'
});

var statement =   "";

// Wordnik API info
var getNounsURL = "Null";



// generate a wittgenstein-esque tweet
function makeWitty() {
  statement = "";
  restclient.get(getNounsURL,
  function(data) {

        output = "The limits of my" + " " + data[0].word + " " + "mean the limits of my" + " " + data[1].word + ".";
        statement = output;
        console.log(statement);
        T.post('statuses/update', { status: statement}, function(err, reply) {
          console.log("error: " + err);
          console.log("reply: " + reply);
        });
      }    
    ,"json");
  }    
 

function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('harvested some RTs'); 
  });
}

// every 30 minutes, make and tweet a message
// wrapped in a try/catch in case Twitter is unresponsive, don't really care about error
// handling. it just won't tweet.
setInterval(function() {
  try {
    makeWitty();
  }
 catch (e) {
    console.log(e);
  }
},1800000);

// every 5 hours, check for people who have RTed a tweet, and favorite that tweet
setInterval(function() {
  try {
    favRTs();
  }
 catch (e) {
    console.log(e);
  }
},60000*60*5);


// Created with code provided by Darius Kazemi - http://tinysubversions.com/
