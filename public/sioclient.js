var socket = io();

socket.on('connect', function(){
    console.log('server connection');
});

socket.on('disconnect', function(){
    console.log('server disconnected');
});

socket.on('chat message', function(msg){
    //$('#messages').append($('<li>').text(msg));
    console.log(msg);
});