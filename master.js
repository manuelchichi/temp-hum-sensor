var express = require('express')
var fs = require('fs')
var app = express()
var bodyParser = require('body-parser');

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
  console.log('GET /')
  var html = `
    <html>
        <body>
            <form method="post" action="https://temp-hum-sensor.herokuapp.com">Name: 
                <input type="text" name="name" />
                <input type="submit" value="Submit" />
            </form>
        </body>
    </html>`
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(html)
})

app.post('/', function(request, response) {
  console.log('POST /')
  console.dir(request.body)

  const text = 'INSERT INTO lectures(temperature, humidity,time) VALUES($1, $2, to_timestamp($3)) RETURNING *'
  const values = [request.body.temperature, request.body.humidity,Date.now()]
  // callback
  client.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
  })

  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end('thanks')
})

const port = process.env.PORT || 3000;
app.listen(port)
console.log(`Listening at http://localhost:${port}`)

