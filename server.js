var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var dl = require('delivery');

server.listen(80);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  
});
/*
app.get('/:file', function (req, res) {
  //res.sendFile(__dirname + '/index.html');
  
  console.log("params: " + req.params.file);
  res.sendFile(__dirname + '/' + req.params.file);
});
*/
app.get('/img/:file', function (req, res) {
    res.sendFile(__dirname + '/img/' + req.params.file);
});
app.get('/:file', function (req, res) {
  //res.sendFile(__dirname + '/index.html');
  
  console.log("params: " + req.params.file);
  res.sendFile(__dirname + '/' + req.params.file);
});

app.get('/build/:file', function (req, res) {
  console.log("params: " + req.params.file);
  res.sendFile(__dirname + '/build/' + req.params.file);
});


io.on('connection', function (socket) {

  // variable to hold first key
  var keysMatch;

  var delivery = dl.listen(socket);
  delivery.on('delivery.connect', function(delivery){
      socket.on('codeEvent', function (data) {
        //console.log(data);
        // check if other key is here
        if (keysMatch != null){
            if (keysMatch == data.key){
                console.log('keys match: ' + data.key);
                delivery.send({
                    name: 'happy.png',
                    path: './img/happy.png'
                });
                keysMatch = null;
            }
            else{
                console.log('unmatched key: ' + data.key);
                keysMatch = null;
            }

        }
        else{
            keysMatch = data.key
            console.log("first key: " + data.key);
        }
      });
    
    socket.on('newData', function(data){
        delivery.send({
            name: 'happy.png',
            path: './img/happy.png'
        });
    });

    delivery.on('send.success', function(file){
        console.log("file sent to client");
    });

    socket.on('redirect', function(data){

        console.log('redirect' + data.key);
        if (data.key == 2)
            socket.emit('windowRedirect', { key : "https://facebook.com" });
    });

  });
  /*
  // setting up listeners
  socket.on('codeEvent', function (data) {
    console.log(data);
    // check if other key is here
    if (keysMatch != null){
        if (keysMatch == data.key){
            console.log('keys match: ' + data.key);
            keysMatch = null;
        }

    }
    else{
        keysMatch = data.key
        console.log("first key: " + data.key);
    }
  });
  */
  socket.on('my other event', function (data) {
    console.log(data);
  });

  //socket.on('newData', function (data) {
  //  console.log(data);
  //    //socket.emit('news', { hello: 'world and stuff' });
  //});

});

