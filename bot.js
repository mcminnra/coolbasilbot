var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();
var weather = require('weather-js');
var querystring = require('querystring');
var hn = require("hacker-news-api");
var urban = require('urban');

var botID = process.env.BOT_ID;

function respond() {
    var request = JSON.parse(this.req.chunks[0]);

    console.log(this.req.chunks[0]);

    /* Regex Commands */
    var botRegexFuckOff = /^\/fuckoff/i;
    var botRegexEightBall = /^\/8ball/i;
    var botRegexHelp = /^\/help/i;
    var botRegexCoin = /^\/coin/i;
    var botRegexOhFuckMe =/^\/ohfuckme/i;
    var botRegexRandom = /^\/random/i;
    var botRegexWeather = /^\/weather/i;
    var botRegexUrbanDictionary = /^\/urbandict/i;
    var botRegexHackerNewsTop = /^\/hntop/i;

    /* Keyword */
    var botRegexRyder = /Ryder/i;
    var botRegexChel = /Chel/i;

    
    if(request.text && botRegexFuckOff.test(request.text)) {
        this.res.writeHead(200);
        postMessage(request.name + " requests that you 'fuck off' " + request.text.substring(9));
        this.res.end();
    }
    // Name Metions
    //Ryder
    else if(request.text && botRegexRyder.test(request.text)) {
        this.res.writeHead(200);
        autoMention('17738651') // Ryder's user_id
        this.res.end();
    }
    else if(request.text && botRegexChel.test(request.text)) {
        this.res.writeHead(200);
        giphy.random('nhl', function(err, resGif) {
            postMessage(resGif.data.image_url);
        });
        this.res.end();
    }
    else if(request.text && botRegexEightBall.test(request.text)) {
        this.res.writeHead(200);
        postMessage(eightBall());
        this.res.end();
    }
    else if(request.text && botRegexHelp.test(request.text)) {
        this.res.writeHead(200);
        postMessage(help());
        this.res.end();
    }
    else if(request.text && botRegexCoin.test(request.text)) {
        this.res.writeHead(200);
        postMessage(coin());
        this.res.end();
    }
    else if(request.text && botRegexOhFuckMe.test(request.text)) {
        this.res.writeHead(200);
        giphy.random('fuck me', function(err, resGif) {
            if(err) {
                postMessage("Error Retrieving Gif");
                return;
            }

            postMessage(resGif.data.image_url);
        });
        this.res.end();
    }
    else if(request.text && botRegexRandom.test(request.text)) {
        this.res.writeHead(200);
        // Random gif by tag using callback
        giphy.random(request.text.substring(8), function(err, resGif) {
            if(err) {
                postMessage("Error Retrieving Gif");
                return;
            }

            postMessage(resGif.data.image_url);
        });
        this.res.end();
    }
    else if(request.text && botRegexWeather.test(request.text)) {
        this.res.writeHead(200);
        weather.find({search: request.text.substring(9), degreeType: 'F'}, function(err, res) {
            if(err) {
                postMessage("Error Retrieving Weather");
                return;
            }

            res = res[0]; // Only One Object

            postMessage(
                'Weather for ' + res.location.name + '\n' +
                res.current.skytext + '\n' +
                'Current Temp: ' + res.current.temperature + 'F \n  (Feels Like ' + res.current.feelslike + 'F)\n' +
                'Humidity: ' + res.current.humidity + '\n' +
                'Wind: ' + res.current.winddisplay + '\n\n' +
                'Today\'s Forecast:\n' +
                res.forecast[0].skytextday + '\n' +
                'High: '+ res.forecast[0].high + ' \n' +
                'Low: '+ res.forecast[0].low + ' \n' +
                'Precipitation: ' + res.forecast[0].precip + ' \n'
                );
        });
        this.res.end();
    }
    else if(request.text && botRegexUrbanDictionary.test(request.text)) {
        this.res.writeHead(200);
        var query = urban(request.text.substring(11));

        query.first(function(json) {
            postMessage(json.word +'\n\n' + json.definition + '\n\n' + json.example);
        });
        this.res.end();
    }
    else if(request.text && botRegexHackerNewsTop.test(request.text)) {
        this.res.writeHead(200);
        hn.author().story().show_hn().since("past_24h").top(function (error, data) {
            if (error) throw error;
            postMessage(data.hits[0].title + "\n\n" + data.hits[0].url);
        });
        this.res.end();
    }
    else {
        console.log("No Command");
        this.res.writeHead(200);
        this.res.end();
    }
}

function autoMention(user) {
    var botResponse, options, body, botReq;

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };
    
    body = {
        "bot_id" : botID,
        "attachments" : [
	    {
	    "loci" : [[0, user.length + 1]],
	    "type" : "mentions",
	    "user_ids" : [user]
	    }
	],
	"text" : "@" + user
    };

    console.log('mentioning ' + user + ' to ' + botID);
    console.log(body);

    botReq = HTTPS.request(options, function(res) {
        if(res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function(err) {
        console.log('error posting message '  + JSON.stringify(err));
    });
    botReq.on('timeout', function(err) {
        console.log('timeout posting message '  + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

function postMessage(message) {
    var botResponse, options, body, botReq;

    botResponse = message;

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id" : botID,
        "text" : botResponse
    };

    console.log('sending ' + botResponse + ' to ' + botID);

    botReq = HTTPS.request(options, function(res) {
        if(res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function(err) {
        console.log('error posting message '  + JSON.stringify(err));
    });
    botReq.on('timeout', function(err) {
        console.log('timeout posting message '  + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

function eightBall() {
    var outcomes = [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes, definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most Likely",
        "Outlook Good",
        "Yes",
        "Signs point to yes",
        "Reply hazy try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful"
    ];

    return outcomes[Math.floor(Math.random() * outcomes.length)];
}

function coin() {
    var options = [
        "HEADS",
        "TAILS"
    ];

    return options[Math.floor(Math.random() * options.length)]
}
function help(){
    return "Help Menu\n\n" +
        "Commands:\n" +
        "/fuckoff {Person} - Tell that person to fuck off\n" +
        "/8ball {Question} - Ask an 8ball question\n" +
        "/coin - Flips a coin heads or tails\n" +
        "/ohfuckme - Fucks you\n" +
        "/random {Keyword(s)} - displays random gif\n" +
        "/weather {City / Zip} - displays weather\n" +
        "/urbandict {word} - Gets Urban Dictionary Definition for word\n" +
        "/hntop - gets top Hacker New's story from past 24 hours\n" +
        "/help - Display this menu";
}

exports.respond = respond;
