const giphy = require('giphy-api')(process.env.GIPHY_KEY);

/*
    Keywords
*/
async function chelKeyword() {
    await giphy.random('nhl', function (err, resGif) {
        if (err) console.log(err);
        giphy_url = resGif.data.image_url
        return giphy_url;
    });
}

module.exports = {
    chelKeyword
}
