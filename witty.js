var restclient = require('node-restclient');
var Twit = require('twit');
var app = require('express').createServer();

app.get('/', function(req, res){
    res.send('Hello world.');
});
app.listen(3000);


// twitter app info
var T = new Twit({
  consumer_key:         'DLPWrxClUBkrkIehxtuew', 
  consumer_secret:      'G81mzNZf3nq13ONV6lMgMeFmJZWoSnFOVcVb7ElYzv8',
  access_token:         '2276606983-M0kJ85NkVaqnrReZegimAezLWkLzUsLfSaYWsDa',
  access_token_secret:  'uaKCI54C3I2xo4YI4hZZsL7hHskjsNbLkIaXRvSpkgTF0'
});

var statement =   "";

// Wordnik API info
var getNounsURL = "http://api.wordnik.com/v4/words.json/randomWords?" +
                  "minCorpusCount=1000&minDictionaryCount=10&" +
                  "excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&" +
                  "hasDictionaryDef=true&includePartOfSpeech=noun&limit=2&maxLength=12&" +
                  "api_key=fbf1963c205cb0fd3c007018a4106fbdfefc34f2ac581a165";



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
