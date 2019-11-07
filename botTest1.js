console.log("Bots be like...");

var Twit = require('twit');

var config = require('./config');

var T = new Twit(config);

var fs = require('fs');

var params;

//This function gets the tweets based on our key phrase 'Ok boomer'
T.get('search/tweets', { q: 'Ok boomer', count: 10 }, function(err, data, response) {
  console.log(data)
})

//This function replies to mentions of our account with "ok boomer"
var stream = T.stream('statuses/filter', {track: ['@okboomer_bot']});
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
    
    var name = tweet.user.screen_name;
    
    var nameID = tweet.id_str;
    
    var reply = "@" + name + " " + "ok boomer";
    
    var params = {
        status: reply,
        in_reply_to_status_id: nameID
    };
    T.post('statuses/update', params, function(err, data, response) {
        if (err !== undefined) {
        } else {
            console.log('Tweeted: ' + params.status);
        }
    })
};

//This function retweets tweets with the key phrase "ok boomer"
function retweet(err,data,response){
    console.log(data)
}

T.get('search/tweets', { q: 'ok boomer', count: 1},function(err,data,response) {
    var retweetId = data.statuses[0].id_str;
    T.post('statuses/retweet/' + retweetId, 
           { }, function (error, data, response)
    {console.log('Success!')})
})

retweet();
setInterval(retweet, 1000*60*60);

//This function likes tweets with the key phrase "ok boomer"
T.get('search/tweets', {q: 'ok boomer', count: 5 },
function (err, data, response) {
    var likeID = data.statuses[0].id_str;
    T.post('favorites/create', {id: likeID},
    function(err,data,response){console.log("liked a post")});
    console.log(data);
});

var b64content = fs.readFileSync('./images/okboomer.jpg', {encoding: 'base64'})

//This function tweets out an Ok boomer meme
function tweetEvent(tweet) {
    
    var name = tweet.user.screen_name;
    
    var nameID = tweet.id_str;
    
    var reply = T.post('media/upload', {media_data: b64content}, function (err, data, response) {
    var mediaIdStr = data.media_id_string
    var altText = "Ok boomer"
    var meta_params = {media_id: mediaIdStr, alt_text: {text: altText}}
    
    T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
            var params = {status: 'Ok boomer', media_ids: [mediaIdStr] }
            T.post('statuses/update', params, function(err, data, response) {
                console.log(data)
            })
        }
    })
})};