var express = require('express'),
    machineGame = require('./game.js'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.get('/jqTateti', function(request, response) {
  response.sendfile('jqTateti.html');
});

app.post('/ajax', function(request, response) {
  console.info('AJAX request received - request.body:', request.body);
  var celd = machineGame(request.body);
  response.send({  "machineCeld": celd  });
});

app.listen(3000);
