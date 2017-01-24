var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();
var weather = require('weather-js');

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


    if(request.text && botRegexCoolGuy.test(request.text)) {
        this.res.writeHead(200);
        postMessage(cool());
        this.res.end();
    }
    else if(request.text && botRegexDonald.test(request.text)) {
        this.res.writeHead(200);
        giphy.random("Donald Trump", function(err, resGif) {
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
            if(err) postMessage("Error Retrieving Gif");

            postMessage(resGif.data.image_url);
        });
        this.res.end();
    }
    else if(request.text && botRegexRandom.test(request.text)) {
        this.res.writeHead(200);
        // Random gif by tag using callback
        giphy.random(request.text.substring(8), function(err, resGif) {
            if(err) postMessage("Error Retrieving Gif");

            postMessage(resGif.data.image_url);
        });
        this.res.end();
    }
    else if(request.text && botRegexWeather.test(request.text)) {
        this.res.writeHead(200);
        weather.find({search: request.text.substring(9), degreeType: 'F'}, function(err, result) {
            if(err) postMessage("Error Retrieving Weather");

            postMessage(
                '--Weather for ' + location.name + ' (' + location.zipcode + ')--\n +' +
                current.skytext + '\n' +
                'Current Temp: ' + current.temperature + 'F (Feels Like ' + current.feelslike + 'F)\n' +
                'Humidity: ' + current.humidity + '\n' +
                'Wind: ' + current.winddisplay + '\n\n' +
                'Today\'s Forecast:\n' +
                forecast[0].skytextday +
                'High: '+ forecast[0].high + ' \n' +
                'Low: '+ forecast[0].low + ' \n' +
                'Precipitation: '+ forecast[0].precip + ' \n'
                );
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
        "/help - Display this menu";
}

exports.respond = respond;