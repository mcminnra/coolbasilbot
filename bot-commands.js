const giphy = require('giphy-api')(process.env.GIPHY_KEY);

/*
    Keywords
*/
function chelKeyword() {
    giphy.random('nhl', function (err, resGif) {
        if (err) console.log(err);
        console.log(resGif.data.image_url);
        return resGif.data.image_url;
    });
}

module.exports = {
    chelKeyword
}
