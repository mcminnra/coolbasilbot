const giphy = require('giphy-api')(process.env.GIPHY_KEY);

function chelKeyword() {
    giphy.random('nhl', function (err, resGif) {
        if (err) console.log(err);
        return(resGif.data.image_url);
    });
}

module.exports = {
    chelKeyword
}
