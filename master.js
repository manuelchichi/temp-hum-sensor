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

  var html = `
    <html>
        <body>
            <form method="post" action="https://temp-hum-sensor.herokuapp.com/lectures"> 
                Start Date:<input type="date" name="date1" />
                End Date:<input type="date" name="date2" />
                <input type="submit" value="Submit" />
            </form>
        </body>
    </html>`

  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(html)
})

app.get('/lectures',function(request,response) {
  const text = 'SELECT * FROM lectures'
  startDate = new Date(Date.parse(request.query.date1))
  endDate = new Date(Date.parse(request.query.date2));

  client.query(text, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      result = res.rows[0]
      console.log(res.rows[0])
    }
  })

  console.log(result)

  var resultProductData = result.rows[0].filter(function (a) {
    var hitDates = a.time || {};
      hitDates = Object.keys(hitDates);
      hitDateMatchExists = hitDates.some(function(dateStr) {
        var date = new Date(dateStr);
          return date >= startDate && date <= endDate
       });
     return hitDateMatchExists;
   });

  console.log(resultProductData);

  response.writeHead(200, {'Content-Type': 'application/json'})
  response.end(resultProductData)

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

