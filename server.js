var express = require('express');

var app = express();
app.use(express.static(__dirname + '/'));

app.get('*', function(req, res) {
	var options = { root: __dirname };
    res.sendFile('./index.html',options);
});

var port = "3000";
app.listen(port);
console.log("Squares Login Application: Listening to Port: " + port);