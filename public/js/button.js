function playButton(){
    clearTimeout(timer)
    var params = jQuery.deparam(window.location.search);
    var selectedCards= document.getElementsByClassName("SEL");
    var cardLists = []
    
    for(var i=0; i<selectedCards.length; i++){
        var cardname = selectedCards[i].id.substring(1,selectedCards[i].id.length - 3)
        cardLists.push(cardname)
    }
    console.log(params);
    socket.emit("throwCard", params, cardLists, function(err){
        if(err){
            alert(err);
            return false;
        }
        return true;
    })
}

function passButton(){
    var params = jQuery.deparam(window.location.search);
    socket.emit("passTurn", params)
    pass = true;
}

function botStart(){
    var params = jQuery.deparam(window.location.search);
    // var boturl = document.getElementById("boturl").value;
    // if (boturl) {
    //     return socket.emit("botStart", params, boturl, undefined)
    // }

    var choosebot = document.getElementById("choosebot").value;
    if (choosebot){
        return socket.emit("botStart", params, undefined, choosebot)
    }
}