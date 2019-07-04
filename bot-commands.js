const giphy = require('giphy-api')(process.env.GIPHY_KEY);

/*
    Keywords
*/
async function chelKeyword() {
    giphy.random('nhl', function (err, resGif) {
        if (err) console.log(err);
        giphy_url = await resGif.data.image_url
        return giphy_url;
    });
}

module.exports = {
    chelKeyword
}
