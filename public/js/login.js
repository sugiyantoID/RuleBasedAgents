var socket = io();
var params = jQuery.deparam(window.location.search);

// validasi waktu mau masuk room.

function inputCheck() {
    var username = document.getElementById("inputUsername").value;
    var roomname = document.getElementById("inputRoom").value;
    var roommode = document.getElementById("inputMode").value;
    var url = '/game.html?Username='+username+'&Room='+roomname+'&Mode='+roommode
    if (typeof username === "string" && typeof roomname === "string" && username.trim().length > 0 && roomname.trim().length >0 ) {
        // event 1. emit Join - waktu player masuk room
        socket.emit('playerLogin', roomname, username, roommode, function(err){
            if(err){
                alert(err);
                window.location.href = '/';
            }
            window.location.href = url;
        });
    }
    else{
        alert('username and password must be filled');
        window.location.href = '/';
    }
}

socket.on('connect', function(){
    var name = params.disconnected;
    if (name){
        setTimeout(function(){
            alert(name + " has disconnected");
            window.location.href = '/';
        }, 1000)
    }
})
