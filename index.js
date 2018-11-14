const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const bot = require('./bot.js');

let db;

function ping() {
  this.res.writeHead(200);
  this.res.end("Cool Basil Bot");
}

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  bot.respond(req, res, db)
});

app.get('/', (req, res) => {
  ping()
})

port = Number(process.env.PORT || 5000);

MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  if (err) return console.log(err)
  else if (!err) console.log('Connected to database')

  db = client.db('heroku_n9z3q6pd') // located on mLab

  app.listen(port, () => {
    console.log('Server running on port ' + port)
  })
})


