var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();
var weather = require('weather-js');
var querystring = require('querystring');
var hn = require("hacker-news-api");
var urban = require('urban');
var ba = require('beeradvocate-api');

/* Mongo DB
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
  if(!err) {
    console.log("Connected to MongoDB");
  }
});
*/


var botID = process.env.BOT_ID;

function respond(req, res, db) {
    let request = req.body

    /* Skip BasilBot Message */
    if(request.name == 'BasilBot'){
        console.log('BasilBot message -- Skipping...')
        res.writeHead(200);
        res.end();
        return;
    } else {
        console.log('Message => "' + request.text + ' - ' + request.name + '"')
    }
   
    /* Update Group and person messages */
    db.collection("people").updateOne({'name': 'Group'}, {$inc: { "message_total": 1 }}, function(err, res) {
        if (err) {
            console.log('Error incrementing group')
            res.writeHead(200);
            res.end();
            return;
        }
    });
    db.collection("people").updateOne({'groupme_user_id': request.user_id}, {$inc: { "message_total": 1 }}, function(err, res) {
        if (err) {
            console.log('Error incrementing person')
            res.writeHead(200);
            res.end();
            return;
        }
    });

    // // Find User
    // db.collection('people').findOne({'groupme_user_id': request.user_id}, function(err, item) {
    //     if (err) {
    //         console.log('Error retriving people')
    //         res.writeHead(200);
    //         res.end();
    //     }

    //     console.log(item)
    //     postMessage(JSON.stringify(item))
    // });

    /* Regex Commands */
    var botRegexFuckOff = /^\/fuckoff/i;
    var botRegexEightBall = /^\/8ball/i;
    var botRegexHelp = /^\/help/i;
    var botRegexCoin = /^\/coin/i;
    var botRegexOhFuckMe =/^\/ohfuckme/i;
    var botRegexRandom = /^\/random/i;
    var botRegexWeather = /^\/weather/i;
    var botRegexBeer = /^\/beer/i;
    var botRegexUrbanDictionary = /^\/urbandict/i;
    var botRegexHackerNewsTop = /^\/hntop/i;
    var botRegexOddsAre = /^\/odds/i;
    var botRegexStats = /^\/stats/i;

    /* Keyword */
    var botRegexRyder = /Ryder|McMinn/i;
    var botRegexRoyce = /Royce|Roy|Funk/i;
    var botRegexThomas = /Thomas|Kreuzman|Tommy/i;
    var botRegexMitch = /Mitch|Molchin/i;
    var botRegexMason = /Mason|Johnson/i;
    var botRegexMiguel = /Miguel|Thompson/i;
    var botRegexAustin = /Austin|Combs/i;
    var botRegexChel = /Chel/i;

    // Name Metions
    //Ryder
    if(request.text && botRegexRyder.test(request.text)) {
        res.writeHead(200);
        autoMention('17738651', 'RM');
        res.end();
        return;
    }
    //Mason
    if(request.text && botRegexMason.test(request.text)) {
        res.writeHead(200);
        autoMention('10896812', 'MJ');
        res.end();
        return;
    }
    //Royce
    if(request.text && botRegexRoyce.test(request.text)) {
        res.writeHead(200);
        autoMention('19585794', 'RF');
        res.end();
        return;
    }
    //Austin
    if(request.text && botRegexAustin.test(request.text)) {
        res.writeHead(200);
        autoMention('20932518', 'AC');
        res.end();
        return;
    }
    //Thomas
    if(request.text && botRegexThomas.test(request.text)) {
        res.writeHead(200);
        autoMention('17079486', 'TK');
        res.end();
        return;
    }
    //Mitch
    if(request.text && botRegexMitch.test(request.text)) {
        res.writeHead(200);
        autoMention('9493451', 'MM');
        res.end();
        return;
    }
    //Miguel
    if(request.text && botRegexMiguel.test(request.text)) {
        res.writeHead(200);
        autoMention('30310364', 'MT');
        res.end();
        return;
    }

    // Commands
    if(request.text && botRegexFuckOff.test(request.text)) {
        res.writeHead(200);
        postMessage(request.name + " requests that you 'fuck off' " + request.text.substring(9));
        res.end();
        return;
    }
    else if(request.text && botRegexBeer.test(request.text)) { // Beer
        res.writeHead(200);
        ba.beerSearch(request.text.substring(6), function(beers) {
            beers = JSON.parse(beers);
            beer_url = beers[0].beer_url;

            ba.beerPage(beer_url, function(beer) {
                beer = JSON.parse(beer)[0];

                console.log(beer);
                message = 'Beer Name: ' + beer.beer_name + '\n' + 'Brewery: ' + beer.brewery_name + '\n' + 'Rating: ' + beer.ba_score + '/5';
                postMessage(message);
            });
        });
        res.end();
        return;
    }
    else if(request.text && botRegexChel.test(request.text)) { // Chel
        res.writeHead(200);
        giphy.random('nhl', function(err, resGif) {
            postMessage(resGif.data.image_url);
        });
        res.end();
        return;
    }
    else if(request.text && botRegexEightBall.test(request.text)) { // EEight Ball
        res.writeHead(200);
        postMessage(eightBall());
        res.end();
        return;
    }
    else if(request.text && botRegexHelp.test(request.text)) {
        res.writeHead(200);
        postMessage(help());
        res.end();
        return;
    }
    else if(request.text && botRegexCoin.test(request.text)) {
        res.writeHead(200);
        postMessage(coin());
        res.end();
        return;
    }
    else if(request.text && botRegexOhFuckMe.test(request.text)) {
        res.writeHead(200);
        giphy.random('fuck me', function(err, resGif) {
            if(err) {
                postMessage("Error Retrieving Gif");
                return;
            }

            postMessage(resGif.data.image_url);
        });
        res.end();
    }
    else if(request.text && botRegexRandom.test(request.text)) {
        res.writeHead(200);
        // Random gif by tag using callback
        giphy.random(request.text.substring(8), function(err, resGif) {
            if(err) {
                postMessage("Error Retrieving Gif");
                return;
            }

            postMessage(resGif.data.image_url);
        });
        res.end();
    }
    else if(request.text && botRegexWeather.test(request.text)) {
        res.writeHead(200);
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
        res.end();
    }
    else if(request.text && botRegexUrbanDictionary.test(request.text)) {
        res.writeHead(200);
        var query = urban(request.text.substring(11));

        query.first(function(json) {
            postMessage(json.word +'\n\n' + json.definition + '\n\n' + json.example);
        });
        res.end();
    }
    else if(request.text && botRegexHackerNewsTop.test(request.text)) {
        res.writeHead(200);
        hn.author().story().show_hn().since("past_24h").top(function (error, data) {
            if (error) throw error;
            postMessage(data.hits[0].title + "\n\n" + data.hits[0].url);
        });
        res.end();
    }
    else if(request.text && botRegexOddsAre.test(request.text)) {
        res.writeHead(200);
        req_split = request.text.split(" ");
	postMessage(oddsAre(req_split[1], req_split[2]));
        res.end();
    }
    else if(request.text && botRegexStats.test(request.text)) {
        res.writeHead(200);

        let user;
        let group;
        // Find User
        db.collection('people').findOne({'groupme_user_id': request.user_id}, function(err, item) {
            if (err) {
                console.log('Error retriving people')
                res.writeHead(200);
                res.end();
            }
    
            user = item;
        });
        // Find Group
        db.collection('people').findOne({'groupme_user_id': request.user_id}, function(err, item) {
            if (err) {
                console.log('Error retriving people')
                res.writeHead(200);
                res.end();
            }
    
            group = item
        });

        postMessage(stats(user, group));
        res.end();
        return;
    }
    else {
        console.log("No Command");
        res.writeHead(200);
        res.end();
    }
}

function autoMention(user, origin) {
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
		"loci" : [[0, origin.length + 1]],
	    "type" : "mentions",
	    "user_ids" : [user]
	    }
	],
	"text" : "@" + origin
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
	"/odds {Odds} {Your Guess} - Plays Odds Are with Basil\n" +
        "/beer {beer} - Gets beer info and rating\n" +
        "/coin - Flips a coin heads or tails\n" +
        "/ohfuckme - Fucks you\n" +
        "/random {Keyword(s)} - displays random gif\n" +
        "/weather {City / Zip} - displays weather\n" +
        "/urbandict {word} - Gets Urban Dictionary Definition for word\n" +
        "/hntop - gets top Hacker New's story from past 24 hours\n" +
        "/help - Display this menu";
}

function oddsAre(odds, guess){
    basil_guess = Math.floor(Math.random() * odds) + 1;

    console.log("Guess: " + guess + ", Odds: " + odds); 

    var msg = "";
    
    // Bad Guess
    if(guess > odds){
	msg = "Your guess can't be higher than the odds";
    }

    if(basil_guess == guess){
	msg = "Odds: 1 to " + odds + "\n" +
	    "Your Guess: " + guess + "\n" +
	    "Basil's Guess: " + basil_guess + "\n\n" +
	    "Same Number. Gotta do it, Sucka.";
    } else {
	msg = "Odds: 1 to " + odds + "\n" +
	    "Your Guess: " + guess + "\n" +
	    "Basil's Guess: " + basil_guess + "\n\n" +
	    "Missed. Got off easy, punk.";
    }

    return msg;
}

function stats(user, group){
    total = (user.message_total / group.message_total * 100).toFixed(2)
    Math.floor(num * 100) / 100
    msg = user.name + "'s GroupMe Stats" + "\n" +
          "Groupme Talk Percentage: " + total 

    return msg      
}

exports.respond = respond;
