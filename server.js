// initial requires
var express = require('express');
var bodyParser = require('body-parser');

// setup the express app
var app = express();

// use body-parser to help express handle requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// set up handlebars for express
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir: 'app/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/app/views');

// load the static files
var staticContentFolder = __dirname + '/app/public';
app.use(express.static(staticContentFolder));


// require passport.js
require("./app/config/passport.js")(app)

// express sitemap app
var sitemap = require('express-sitemap');
var map = sitemap({
    generate: app
});

app.get('/sitemap.xml', function(req, res) { // send XML map
    map.XMLtoWeb(res);
}).get('/robots.txt', function(req, res) { // send TXT map
    map.TXTtoWeb(res);
});

// require the api and html paths
require("./app/routes/jeremiahRoutes.js")(app)
require("./app/routes/apiRoutes.js")(app)
require("./app/routes/htmlRoutes.js")(app)

// require all of the database connections
require("./app/models/db_relations.js")(app)


// start the server
var PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log('Find the magic at port: ' + PORT);
});