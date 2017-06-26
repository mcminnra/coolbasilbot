var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();
var weather = require('weather-js');
var querystring = require('querystring');
var hn = require("hacker-news-api")

var botID = process.env.BOT_ID;

function respond() {
    var request = JSON.parse(this.req.chunks[0]);

    /* Regex Commands */
    var botRegexCoolGuy = /^\/cool guy$/;
    var botRegexDonald = /Donald|Trump/i;
    var botRegexFuckOff = /^\/fuckoff/i;
    var botRegexChel = /Chel/i;
    var botRegexEightBall = /^\/8ball/i;
    var botRegexHelp = /^\/help/i;
    var botRegexCoin = /^\/coin/i;
    var botRegexOhFuckMe =/^\/ohfuckme/i;
    var botRegexRandom = /^\/random/i;
    var botRegexWeather = /^\/weather/i;
    var botRegexWikipedia = /^\/define/i;
    var botRegexUrbanDictionary = /^\/urbandict/i;
    var botRegexBasil = /Basil/i;
    var botRegexHackerNewsTop = /^\/hntop/i;


    if(request.text && botRegexCoolGuy.test(request.text)) {
        this.res.writeHead(200);
        postMessage(cool());
        this.res.end();
    }
    else if(request.text && botRegexDonald.test(request.text)) {
        this.res.writeHead(200);
        giphy.random("Donald Trump", function(err, resGif) {
            if(err) {
                postMessage("Error Retrieving Gif");
                return;
            }

            postMessage(resGif.data.image_url);
            postMessage("|___|___|___|___|___|___|___|\n     BUILD THAT WALL!!!\n|___|___|___|___|___|___|___|");
        });
        this.res.end();
    }
    else if(request.text && botRegexFuckOff.test(request.text)) {
        this.res.writeHead(200);
        postMessage(request.name + " requests that you 'fuck off' " + request.text.substring(9));
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
    else if(request.text && botRegexWikipedia.test(request.text)) {
        this.res.writeHead(200);
        postMessage(wikipedia(request.text.substring(8)));
        this.res.end();
    }
    else if(request.text && botRegexUrbanDictionary.test(request.text)) {
        this.res.writeHead(200);
        postMessage(urbanDictionary(request.text.substring(11)));
        this.res.end();
    }
    else if(request.text && botRegexBasil.test(request.text)) {
        this.res.writeHead(200);
        giphy.random("porn", function(err, resGif) {
            if(err) {
                postMessage("Error Retrieving Gif");
                return;
            }

            postMessage(resGif.data.image_url);
            postMessage("Did you mean 'Porn'?");
        });
        this.res.end();
    }
    else if(request.text && botRegexHackerNewsTop.test(request.text)) {
        this.res.writeHead(200);
        hn.author().story().show_hn().top(function (error, data) {
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
        "/define {Keyword} - Gets wikipedia synopsys for keyword\n" +
        "/urbandict {word} - Gets Urban Dictionary Definition for word\n" +
        "/help - Display this menu";
}

function wikipedia(lookup){
    var options = {
        host :  'en.wikipedia.org',
        path : '/w/api.php?format=json&action=query&prop=extracts&redirect=1&exintro=&explaintext=&titles=' + querystring.escape(lookup),
        method : 'GET'
    };

    //making the https get call
    var getReq = HTTPS.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
            console.log( JSON.parse(data) );
            data = JSON.parse(data);
            var item_id = Object.keys(data.query.pages)[0];
            var page = data.query.pages[item_id];
            if(page.extract){
                postMessage(page.title + "\n\n" + page.extract);
            } else {
                postMessage("Unable to find '" + lookup + "' Wikipedia Extract");
            }
        });
    });

    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    });
}

function urbanDictionary(lookup){
    var options = {
        host :  'api.urbandictionary.com',
        path : '/v0/define?term=' + querystring.escape(lookup),
        method : 'GET'
    };

    //making the https get call
    var getReq = HTTPS.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
            console.log( JSON.parse(data) );
            data = JSON.parse(data);
            var udword = data.list[0];
            if(data.result_type == "exact"){
                postMessage(udword.word + "\n\nDefinition:\n" + udword.definition + "\n\nUsage:\n" + udword.example);
            } else {
                postMessage("Unable to find '" + lookup + "' Urban Dictionary Term");
            }
        });
    });

    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    });
}

exports.respond = respond;