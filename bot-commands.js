export function chelKeyword() {
    giphy.random('nhl', function (err, resGif) {
        if (err) console.log(err);
        return(resGif.data.image_url);
    });
}

export default {
    chelKeyword
}
