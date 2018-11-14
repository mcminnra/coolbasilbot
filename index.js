const express = require('express')
const bodyParser = require('body-parser')

const bot = require('./bot.js');

function ping() {
  this.res.writeHead(200);
  this.res.end("Cool Basil Bot");
}

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log(req)
  bot.respond(req)
});

app.get('/', (req, res) => {
  ping()
})

port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log('Server running on Port ' + port)
})