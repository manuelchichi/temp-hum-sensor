var express = require('express')
var fs = require('fs')
var app = express()
var bodyParser = require('body-parser');
var path = require('path')

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(path.resolve(__dirname + '/public')));

app.get('/',function(request,response) {
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/lectures',function(request,response) {
  const text = 'SELECT * FROM lectures ORDER BY time DESC'
  startDate = new Date(Date.parse(request.query.date1));
  endDate = new Date(Date.parse(request.query.date2));

  client.query(text, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      var resultLectures = res.rows.filter(function (lecture) {
        var date = new Date(lecture.time);
        return (date >= startDate && date <= endDate);
      });
      response.writeHead(200, { 'Content-Type': 'application/json'});
      response.end(JSON.stringify(resultLectures));
    }
  }) 
})

app.get('/lastlecture',function(request,response) {
  const text = 'SELECT * FROM lectures ORDER BY time DESC LIMIT 1'
  client.query(text, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json'});
      response.end(JSON.stringify(res.rows[0]));
    }
  }) 
})

app.post('/', function(request, response) {
  const text = 'INSERT INTO lectures(temperature, humidity,time) VALUES($1, $2, $3) RETURNING *'
  const values = [request.body.temperature, request.body.humidity,new Date()]
  client.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
  })

  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end('Successful lecture.')
})

const port = process.env.PORT || 3000;
app.listen(port)
console.log(`Listening at http://localhost:${port}`)

