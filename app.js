let express = require('express');
let pug = require('pug');

let app = express();
app.set('view engine', 'pug');
app.set('views', 'views');

let router = require('./router')();
app.use(router);

app.listen(3000, () => console.log('listen 3000 port'));
