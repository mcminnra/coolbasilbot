var HTTPS = require('https');
var request = require('request');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();
var weather = require('weather-js');
var querystring = require('querystring');
var hn = require("hacker-news-api");
var urban = require('urban');

var botID = process.env.BOT_ID;

function respond(req, res, db) {
    let request = req.body

    /* Skip BasilBot Message */
    if(request.name == '🌿'){
        console.log('BasilBot message -- Skipping...')
        res.writeHead(200);
        res.end();
        return;
    } else {
        console.log('Message => "' + request.text + ' - ' + request.name + ' (' + request.user_id + ')"')
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
    var botRegexOddsAre = /^\/odds/i;
    var botRegexStats = /^\/stats/i;
    var botRegexBeer = /^\/beer/i;
    var botRegexBeerStatus = /^\/statusbeer/i;
    var botRegexBeerReset = /^\/resetbeer/i;
    var botRegexLeaderboard = /^\/leaderboard/i;

    /* Keyword */
    var botRegexRyder = /Ryder|McMinn/i;
    var botRegexRoyce = /Royce|Roy|Funk/i;
    var botRegexThomas = /Thomas|Kreuzman|Tommy/i;
    var botRegexMitch = /Mitch|Molchin/i;
    var botRegexMason = /Mason|Johnson/i;
    var botRegexMiguel = /Miguel|Thompson/i;
    var botRegexAustin = /Austin|Combs/i;
    var botRegexRichmond = /Samuel|Richmond/i;
    var botRegexChel = /Chel/i;

    // Name Metions
    //Ryder
    if(request.text && botRegexRyder.test(request.text)) {
        res.writeHead(200);
        autoMention('17738651', 'RM');
        res.end();
    }
    //Mason
    if(request.text && botRegexMason.test(request.text)) {
        res.writeHead(200);
        autoMention('10896812', 'MJ');
        res.end();
    }
    //Royce
    if(request.text && botRegexRoyce.test(request.text)) {
        res.writeHead(200);
        autoMention('19585794', 'RF');
        res.end();
    }
    //Austin
    if(request.text && botRegexAustin.test(request.text)) {
        res.writeHead(200);
        autoMention('20932518', 'AC');
        res.end();
    }
    //Thomas
    if(request.text && botRegexThomas.test(request.text)) {
        res.writeHead(200);
        autoMention('17079486', 'TK');
        res.end();
    }
    //Mitch
    if(request.text && botRegexMitch.test(request.text)) {
        res.writeHead(200);
        autoMention('9493451', 'MM');
        res.end();
    }
    //Miguel
    if(request.text && botRegexMiguel.test(request.text)) {
        res.writeHead(200);
        autoMention('30310364', 'MT');
        res.end();
    }
    //Richmond
    if(request.text && botRegexRichmond.test(request.text)) {
        res.writeHead(200);
        autoMention('4022094', 'SR');
        res.end();
    }

    // Commands
    if(request.text && botRegexFuckOff.test(request.text)) {
        res.writeHead(200);
        postMessage(request.name + " requests that you 'fuck off' " + request.text.substring(9));
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
        Promise.all([getUser(request.user_id, db), getGroup(db)]).then(userGroup =>{
            let user = userGroup[0]
            let group = userGroup[1]

            return stats(user, group)
        }).then(msg => {
            return postMessage(msg)
        }).catch(err => {
            console.log(err)
        });
        res.end();
        return;
    }
    else if(request.text && botRegexBeer.test(request.text)) {
        res.writeHead(200);
        getUser(request.user_id, db).then(user => {
            let delta_time = Number((new Date).getTime()/(1000*60*60) - user.beer_time).toFixed(3)

            if(user.beer_count == 0){
                resetBeerTimeAndIncBeer(user.groupme_user_id, db).then(user => {
                    return beer(user.value)
                }).then(msg => {
                    return postMessage(msg)
                }).catch(err => {
                    console.log(err)
                })
            } else if(delta_time > 24){
                return postMessage(beer(user, "IT'S BEEN 24 HOURS SINCE YOUR LAST BEER. YOU NEED TO RESET BEFORE YOU CAN ADD ANOTHER!"))
            } else {
                updateBeer(user.groupme_user_id, db).then(user => {
                    return beer(user.value)
                }).then(msg => {
                    return postMessage(msg)
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            consolelog(err);
        });
        res.end();
        return;
    } 
    else if(request.text && botRegexBeerStatus.test(request.text)) {
        res.writeHead(200);
        getUser(request.user_id, db).then(user => {
            return beer(user)
        }).then(msg => {
            return postMessage(msg)
        }).catch(err => {
            console.log(err)
        })
        res.end();
        return;
    }
    else if(request.text && botRegexBeerReset.test(request.text)) {
        res.writeHead(200);
        resetBeer(request.user_id, db).then(user => {
            return beer(user.value)
        }).then(msg => {
            return postMessage(msg)
        }).catch(err => {
            console.log(err)
        })
        res.end();
        return;
    }
    else if(request.text && botRegexLeaderboard.test(request.text)) {
        res.writeHead(200);
        Promise.all([getUsers(db), getGroup(db)]).then(userGroup =>{
            let users = userGroup[0]
            let group = userGroup[1]

            // Get longest name length
            let longest_name_len = -1
            for (i=0; i<users.length; i++) {
                if(users[i].name.length > longest_name_len){
                    longest_name_len = users[i].name.length
                }
            }

            /*
             * Messages
             */
            users.sort((a, b) => b.message_total - a.message_total);
            msg = "Messages Leaderboard:\n"
            for (i=0; i<users.length; i++) {
                let total = String(Number(Number(users[i].message_total) / Number(group.message_total) * 100).toFixed(2))
                let name_diff = Number(longest_name_len - users[i].name.length)
                if(i == 0){
                    msg = msg + "🥇 " + users[i].name + " ".repeat(name_diff) + " " + users[i].message_total + " (" + total + '%)\n'
                } else if(i == 1){
                    msg = msg + "🥈 " + users[i].name + " ".repeat(name_diff) + " " + users[i].message_total + " (" + total + '%)\n'
                } else if(i == 2) {
                    msg = msg + "🥉 " + users[i].name + " ".repeat(name_diff) + " " + users[i].message_total + " (" + total + '%)\n'
                } else {
                    msg = msg + users[i].name + " ".repeat(name_diff+2) + " " + users[i].message_total + " (" + total + '%)\n' 
                }
            }
            msg = msg + "\n"

            /*
             * Beers
             */
            users.sort((a, b) => b.beer_total - a.beer_total);
            msg = msg + "Beers Leaderboard:\n"
            for (i=0; i<users.length; i++) {

                if(i == 0){
                    msg = msg + "🥇 " + users[i].name + " " + users[i].beer_total + '\n'
                } else if(i == 1){
                    msg = msg + "🥈 " + users[i].name + " " + users[i].beer_total + '\n'
                } else if(i == 2) {
                    msg = msg + "🥉 " + users[i].name + " " + users[i].beer_total + '\n'
                } else {
                    msg = msg + users[i].name + " " + users[i].beer_total + '\n' 
                }
            }

            postMessage(msg)
        }).catch(err => {
            console.log(err)
        });
        res.end();
        return;
    }
    else {
        console.log("No Command");
        res.writeHead(200);
        res.end();
    }
}

/* Message Functions */
function postMessage(msg){
    let body = {
        "bot_id" : botID,
        "text" : msg
    };
    let options = {
        uri: 'https://api.groupme.com/v3/bots/post',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (err, res) {
        if (err) console.log(err)
        if (res) console.log(res.body)
        return;
    });
}

function autoMention(user, origin) {

    let body = {
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

    let options = {
        uri: 'https://api.groupme.com/v3/bots/post',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log('mentioning ' + user + ' to ' + botID);
    
    request(options, function (err, res) {
        if (err) console.log(err)
        if (res) console.log(res.body)
        return;
    });
}

/* Database Functions */
async function getUsers(db){
    try{
        var users = await db.collection('people').find({'name': { $ne: 'Group'}}).toArray()

        return users
    } catch(err) {
        console.log(err)
    }
}

async function getUser(user_id, db){
    try{
        var user = await db.collection('people').findOne({'groupme_user_id': user_id})

        return user
    } catch(err) {
        console.log(err)
    }
}

async function getGroup(db){
    try{
        var group = await db.collection('people').findOne({'name': 'Group'})

        return group
    } catch(err) {
        console.log(err)
    }
}

async function updateBeer(user_id, db){
    try{
        var user = await db.collection("people").findOneAndUpdate({'groupme_user_id': user_id}, {$inc: { "beer_count": 1 }}, {returnOriginal:false})
        user = await db.collection("people").findOneAndUpdate({'groupme_user_id': user_id}, {$inc: { "beer_total": 1 }}, {returnOriginal:false})

        return user
    } catch(err) {
        console.log(err)
    }
}

async function resetBeer(user_id, db){
    try{
        var user = await db.collection("people").findOneAndUpdate({'groupme_user_id': user_id}, {$set: { "beer_count": 0 }}, {returnOriginal:false})

        return user
    } catch(err) {
        console.log(err)
    }
}

async function resetBeerTimeAndIncBeer(user_id, db){
    try{
        var hours_epoch = (new Date).getTime()/(1000*60*60)-.25;
        var user = await db.collection("people").findOneAndUpdate({'groupme_user_id': user_id}, {$set: { "beer_time": hours_epoch, "beer_count": 1}}, {returnOriginal:false})
        user = await db.collection("people").findOneAndUpdate({'groupme_user_id': user_id}, {$inc: { "beer_total": 1 }}, {returnOriginal:false})

        return user
    } catch(err) {
        console.log(err)
    }
}

/* Command Functions */
function stats(user, group){
    total = String(Number(Number(user.message_total) / Number(group.message_total) * 100).toFixed(2))
    msg = user.name + "'s GroupMe Stats:" + "\n\n" +
        "Total Number of Messages Sent: " + user.message_total + "\n" +
        "Groupme Message Percentage: " + total + "%";

    return msg;
}

function beer(user, optional_message){
    let SD = user.beer_count  // 12 ounces
    let Wt = 95.2544
    let MR = 0.015
    let DP = Number((new Date).getTime()/(1000*60*60) - user.beer_time).toFixed(3)

    let bac = (((0.806 * SD * 1.2)/(0.58 * Wt)) - .015 * DP)
    let msg = ""

    // Print Optional Message
    if(optional_message){
        msg = msg + optional_message +"\n\n"
    }

    if(bac < 0){
        bac = 0
    }
    if(DP > 24){
        DP = "NEEDS RESET"
    }
    if(SD == 0){
        DP = "ADD A BEER TO CALCULATE BAC"
    }

    msg = msg + 'Total Beers Drank: ' + user.beer_total + '\n' +
          'Current Beers Drank: ' + user.beer_count + '\n' +
          'BAC: ' + bac.toFixed(3) + "\n\n" +
          'Been Drinking for ' + DP + ' Hours'

    if(DP >= 24){
        msg = msg + '\n\nIts been over 24 hours since you\'ve have a drink. You might want to reset your current beers with /resetbeer'
    }

    return msg
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
        "/stats - See your groupme stats\n" +
        "/fuckoff {Person} - Tell that person to fuck off\n" +
        "/8ball {Question} - Ask an 8ball question\n" +
	    "/odds {Odds} {Your Guess} - Plays Odds Are with Basil\n" +
        "/beer - Adds a beer and calculates BAC\n" +
        "/statusbeer - Gets your current beer count and BAC\n" +
        "/resetbeer - Resets your current beer count to 0\n" +
        "/leaderboard - Check the current leaderboard\n" +
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

/* Utility Functions */
function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

exports.respond = respond;
