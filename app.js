let express = require('express');
let pug = require('pug');

let app = express();
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'pug');
app.set('views', 'views');
app.locals.pretty = true;

let router = require('./router')();
app.use(router);

app.listen(3001, () => console.log('listen 300111 port'));
