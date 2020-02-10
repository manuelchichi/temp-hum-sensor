var express = require('express')
var fs = require('fs')
var app = express()
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
  console.log('GET /')
  var html = `
    <html>
        <body>
            <form method="post" action="http://localhost:3000">Name: 
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
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end('thanks')
})

port = 3000
app.listen(port)
console.log(`Listening at http://localhost:${port}`)

