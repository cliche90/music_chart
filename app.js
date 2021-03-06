let express = require('express');
let pug = require('pug');
let port = 3001;
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'pug');
app.set('views', 'views');
app.locals.pretty = true;

let router = require('./router')();
app.use(router);

app.listen(port, () => console.log(`listen on ${port} port`));
