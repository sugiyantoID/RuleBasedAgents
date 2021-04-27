var socket = io();
var roomPlayersNumb, mynumb, p2numb, p3numb,p4numb;
var myusername, p2username, p3username, p4username;
var pass = false;
var params = jQuery.deparam(window.location.search);
var timer;
var timeCount;
var zindex = 100;

// waktu player konek ke server / masuk room
socket.on('connect', function(){
    console.log('Player Connected to the Server');
    // ----------------------- EVENT 1. EMIT JOIN WAITING ROOM -----------------------
    socket.emit('joinWaitingRoom', params, function(message, numb){
        if(message === 'Room is Full'){
            alert(message);
            return window.location.href = '/';
        }
        else if(message === 'Username already taken'){
            alert(message);
            return window.location.href = '/';
        }
        else if(message === 'Must be the same mode'){
            alert(message);
            return window.location.href = '/';
        }
        else if(numb === 1){
            $("#bot-option").css("display", "block");
        }
    });
});

// bikin tampilan masing2 player di room
socket.on('updatePlayerList', function(players){
    console.log(players);
    jQuery('#player-room').empty();
    players.forEach(function(name){
        jQuery('#player-room').append(jQuery('<div></div>').addClass('w3-card w3-green')
        .append(jQuery('<h3></h3>').text(name)))
    });
});   

socket.on('gameStart', function(playersNumb, currentTurn, time){
    timeCount = time
    roomPlayersNumb = playersNumb;
    document.querySelector("link[href='/css/waiting.css']").href = "/css/game.css";
    $("div.waiting-div").css("display", "none");

    // var myturn = playersNumb.find(x => x.username === params.Username).numb; [ES6]
    // -----------------p1name------------------
    var myturn = playersNumb.find(function(x){
        if(x.username === params.Username){return x;}
    });
    jQuery(".myname").text(myturn.username);
    mynumb = myturn.numb;
    myusername = myturn.username;

    // -----------------p2name------------------
    var p2turn = playersNumb.find(function(x){
        var numb = (myturn.numb + 1) % 4;
        numb === 0 ? numb = 4 : numb;
        if(x.numb === numb){return x;}
    });
    jQuery(".p2name").text(p2turn.username);
    p2numb = p2turn.numb;
    p2username = p2turn.username;

    // -----------------p3name------------------
    var p3turn = playersNumb.find(function(x){
        var numb = (myturn.numb + 2) % 4;
        numb === 0 ? numb = 4 : numb;
        if(x.numb === numb){return x;}
    });
    jQuery(".p3name").text(p3turn.username);
    p3numb = p3turn.numb;
    p3username = p3turn.username;

    // -----------------p4name------------------
    var p4turn = playersNumb.find(function(x){
        var numb = (myturn.numb + 3) % 4;
        numb === 0 ? numb = 4 : numb;
        if(x.numb === numb){return x;}
    });
    jQuery(".p4name").text(p4turn.username)
    p4numb = p4turn.numb;
    p4username = p4turn.username;

    if(params.Username === currentTurn){
        $(".turn-sign").empty()
        $(".turn-sign").append(`<h1>Your Turn</h1>`)
        setTimeout(()=>{
            $(".btn-div").css("display", "block");
        }, 5000);
        $(".btn-pass").prop("disabled", true);
    }
    else{
        $(".turn-sign").empty()
        $(".turn-sign").append(`<h1>${currentTurn} Turn</h1>`)
    }

    jQuery(".high-score").text(myusername + " : 0" )
    jQuery(".second-score").text(p2username + " : 0" )
    jQuery(".third-score").text(p3username + " : 0" )
    jQuery(".fourth-score").text(p4username + " : 0" )

    
    emitInitHand();
    startCountdown()
    setTimeout(()=>{
        timerCountdown(currentTurn);
    }, 5000);
});

socket.on("afterThrow", function(currentTurn, topfield, cardLength){
    zindex ++;
    clearTimeout(timer)
    //jQuery('.img-card-field').remove();
    timerCountdown(currentTurn);
    if (cardLength !== 0){
        // emitInitHand();
        
        $(".btn-div").css("display", "none");
        var prevPno = roomPlayersNumb.find(function(x){
            return x.username === topfield.username;
        }).numb;
        emitHand(prevPno)
        
        showField(prevPno, topfield); // tampilin field
        
        if(params.Username === currentTurn ){
            setTimeout(function(){$(".btn-div").css("display", "block");},1000)
            $(".btn-pass").prop("disabled", false);
            $(".turn-sign").empty()
            $(".turn-sign").append(`<h1>Your Turn</h1>`)
            timer = setTimeout(()=>{
                passButton();
            }, timeCount)
        }
        else{
            $(".turn-sign").empty()
            $(".turn-sign").append(`<h1>${currentTurn}'s Turn</h1>`)
        }
    }
    else{
        jQuery('.player-bot img').remove();
        jQuery('.player-left img').remove();
        jQuery('.player-right img').remove();
        jQuery('.player-top img').remove();
        var prevPno = roomPlayersNumb.find(function(x){
            return x.username === topfield.username;
        }).numb;
        showField(prevPno, topfield);
    }
})

socket.on("afterPass", function(currentTurn, prevPno, passCount){
    clearTimeout(timer)
    $(".btn-div").css("display", "none");
    showPass(prevPno);
    timerCountdown(currentTurn);
    if(passCount === 3){
        pass = false;
        $(".btn-pass").prop("disabled", true);
        $(".pass-sign").empty();
        $(".turn-sign").empty()
        if(params.Username === currentTurn){
            setTimeout(function(){$(".btn-div").css("display", "block");},1000)
            $(".turn-sign").append(`<h1>Your Turn</h1>`)
            timer = setTimeout(()=>{
                socket.emit("cdControlTurn", params)
            }, timeCount)
        }
        else{
            $(".turn-sign").append(`<h1>${currentTurn}'s Turn</h1>`)
        }
    }

    else{
        if(params.Username === currentTurn){
            setTimeout(function(){$(".btn-div").css("display", "block");},1000)
            $(".btn-pass").prop("disabled", false);
            $(".turn-sign").empty()
            $(".turn-sign").append(`<h1>Your Turn</h1>`)
            timer = setTimeout(()=>{passButton();}, timeCount)
        }
        else{
            $(".turn-sign").empty()
            $(".turn-sign").append(`<h1>${currentTurn}'s Turn</h1>`)
        }
    }
})

socket.on("newGame", function(pScore, currentTurn, pWin, gameno){
    $(".btn-div").css("display", "none");
    jQuery('.player-bot img').remove();
    jQuery('.player-left img').remove();
    jQuery('.player-right img').remove();
    jQuery('.player-top img').remove();
    jQuery('.img-card-field').remove();
    $(".pass-sign").empty();
    $(".player-timer").empty();
    $(".p2-timer").empty();
    $(".p3-timer").empty();
    $(".p4-timer").empty();

    if(params.Username === currentTurn){
        $(".turn-sign").empty()
        $(".turn-sign").append(`<h1>Your Turn</h1>`)
    }
    else{
        $(".turn-sign").empty()
        $(".turn-sign").append(`<h1>${currentTurn}'s Turn</h1>`)
    }

    var playerScore = pScore.sort(function(a, b) {
        return b[1] - a[1];
    });

    var playerWin = pWin.sort(function(a, b) {
        return b[1] - a[1];
    });

    jQuery("#button-score").click()
    jQuery(".game-number").text("Game Number " + gameno)

    jQuery(".high-score").text(playerScore[0][0] + " : " + playerScore[0][1])
    jQuery(".second-score").text(playerScore[1][0] + " : " + playerScore[1][1])
    jQuery(".third-score").text(playerScore[2][0] + " : " + playerScore[2][1])
    jQuery(".fourth-score").text(playerScore[3][0] + " : " + playerScore[3][1])
    
    jQuery(".high-win").text(playerWin[0][0] + " : " + playerWin[0][1])
    jQuery(".second-win").text(playerWin[1][0] + " : " + playerWin[1][1])
    jQuery(".third-win").text(playerWin[2][0] + " : " + playerWin[2][1])
    jQuery(".fourth-win").text(playerWin[3][0] + " : " + playerWin[3][1])
    
    setTimeout(()=>{
        jQuery("#close-score").click()
    }, 5000);

    emitInitHand()
    startCountdown()
    setTimeout(()=>{
        timerCountdown(currentTurn);
    }, 5000);
})

socket.on("gameOver", function(){
    $(".btn-div").css("display", "none");
})
socket.on("playerDisconnected", function(name){
    window.location.href = `/?disconnected=${name}`
})
// ------------------ Tampilin Tangan ------------------------
function emitInitHand(){
    socket.emit('initHand',params, function(hand){
        // ------------------------------------------------------ player1 table ------------------------------------------------------
        for(i=0; i<hand.myhand.length; i++){
            if(i === 0){
                jQuery('.player-bot').append(jQuery(`<img id="F${hand.myhand[i]}NON" onClick="getId(this, this.id)" 
                                                        src="/cards_img/${hand.myhand[i]}.png" >`));
            }
            if(i>0){
                jQuery('.player-bot').append(jQuery(`<img id="L${hand.myhand[i]}NON" onClick="getId(this, this.id)" class ="hor-margin" 
                                                        src="/cards_img/${hand.myhand[i]}.png" >`));
            }
        }
        // munculin tombol kalo jalan pertama sama buang kartu kalo waktu abis pertama kali

        if(hand.myhand[0] === hand.lowestCard){
            setTimeout(()=>{
                $(".btn-div").css("display", "block");
            }, 5000);
            $(".btn-pass").prop("disabled", true);
            timer = setTimeout(()=>{
                socket.emit("throwCard", params, [hand.lowestCard], function(err){
                    if(err){
                        alert(err);
                        return false;
                    }
                    return true;
                })
            }, timeCount + 5000)
        }
        
        // ------------------------------------------------------ player2 table ------------------------------------------------------
        for(i=0; i<hand.p2hand; i++){
            if(i === hand.p2hand){
                jQuery('.player-left').append(jQuery(`<img class="rotate90" src="cards_img/card-back.jpg" >`))
            }
            if(i<hand.p2hand){
                jQuery('.player-left').append(jQuery(`<img class="rotate90 ver-margin" src="cards_img/card-back.jpg" >`))
            }
        }

        // ------------------------------------------------------ player3 table ------------------------------------------------------
        for(i=0; i<hand.p3hand; i++){
            if(i === 0){
                jQuery('.player-top').append(jQuery(`<img src="cards_img/card-back.jpg" >`));
                
            }
            if(i>0){
                jQuery('.player-top').append(jQuery(`<img class ="hor-margin" src="cards_img/card-back.jpg" >`));
            }
        }

        // ------------------------------------------------------ player4 table ------------------------------------------------------
        for(i=0; i<hand.p4hand; i++){
            if(i === hand.p4hand){
                jQuery('.player-right').append(jQuery(`<img class="rotate90" src="cards_img/card-back.jpg" >`))
            }
            if(i<hand.p4hand){
                jQuery('.player-right').append(jQuery(`<img class="rotate90 ver-margin" src="cards_img/card-back.jpg" >`))
            }
        }
    });
}

function emitHand(prevPno){
    socket.emit('initHand',params, function(hand){
        // ------------------------------------------------------ player1 table ------------------------------------------------------
        if(prevPno == mynumb){
            jQuery('.player-bot img').remove();
            for(i=0; i<hand.myhand.length; i++){
                if(i === 0){
                    jQuery('.player-bot').append(jQuery(`<img id="F${hand.myhand[i]}NON" onClick="getId(this, this.id)" 
                                                            src="/cards_img/${hand.myhand[i]}.png" >`));
                }
                if(i>0){
                    jQuery('.player-bot').append(jQuery(`<img id="L${hand.myhand[i]}NON" onClick="getId(this, this.id)" class ="hor-margin" 
                                                            src="/cards_img/${hand.myhand[i]}.png" >`));
                }
            }
        }
        
        // ------------------------------------------------------ player2 table ------------------------------------------------------
        if(prevPno == p2numb){
            jQuery('.player-left img').remove();
            for(i=0; i<hand.p2hand; i++){
                if(i === hand.p2hand){
                    jQuery('.player-left').append(jQuery(`<img class="rotate90" src="cards_img/card-back.jpg" >`))
                }
                if(i<hand.p2hand){
                    jQuery('.player-left').append(jQuery(`<img class="rotate90 ver-margin" src="cards_img/card-back.jpg" >`))
                }
            }
        }

        // ------------------------------------------------------ player3 table ------------------------------------------------------
        if(prevPno == p3numb){
            jQuery('.player-top img').remove();            
            for(i=0; i<hand.p3hand; i++){
                if(i === 0){
                    jQuery('.player-top').append(jQuery(`<img src="cards_img/card-back.jpg" >`));
                    
                }
                if(i>0){
                    jQuery('.player-top').append(jQuery(`<img class ="hor-margin" src="cards_img/card-back.jpg" >`));
                }
            }
        }

        // ------------------------------------------------------ player4 table ------------------------------------------------------
        if(prevPno === p4numb){
            jQuery('.player-right img').remove();
            for(i=0; i<hand.p4hand; i++){
                if(i === hand.p4hand){
                    jQuery('.player-right').append(jQuery(`<img class="rotate90" src="cards_img/card-back.jpg" >`))
                }
                if(i<hand.p4hand){
                    jQuery('.player-right').append(jQuery(`<img class="rotate90 ver-margin" src="cards_img/card-back.jpg" >`))
                }
            }
        }
    });
}
function showField(prevPno, topfield){
    if (prevPno === p2numb){
        jQuery('.field-left').empty();
        jQuery('.field-left').css({"z-index": zindex});

        greyCardFieldBot();
        greyCardFieldLeft();
        greyCardFieldRight();
        greyCardFieldTop();

        for(var i=0; i<topfield.card.length; i++){
            if(i === 0){
                jQuery('.field-left').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="img-card-field img-card-field-left" id="${topfield.card[i]}" height="140">`)
                )
            }
            if(i>0){
                jQuery('.field-left').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="hor-margin img-card-field img-card-field-left" id="${topfield.card[i]}" height="140">`)
                )
            }
        }

    }

    if (prevPno === p3numb){
        jQuery('.field-top').empty();
        jQuery('.field-top').css({"z-index": zindex});

        greyCardFieldBot();
        greyCardFieldLeft();
        greyCardFieldRight();
        greyCardFieldTop();

        for(var i=0; i<topfield.card.length; i++){
            if(i === 0){
                jQuery('.field-top').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="img-card-field img-card-field-top" id="${topfield.card[i]}"  height="140">`)
                )
            }
            if(i>0){
                jQuery('.field-top').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="hor-margin img-card-field img-card-field-top" id="${topfield.card[i]}" height="140">`)
                )
            }
        }
    }

    if (prevPno === p4numb){
        jQuery('.field-right').empty();
        jQuery('.field-right').css({"z-index": zindex});

        greyCardFieldBot();
        greyCardFieldLeft();
        greyCardFieldRight();
        greyCardFieldTop();

        for(var i=0; i<topfield.card.length; i++){
            if(i === 0){
                jQuery('.field-right').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="img-card-field img-card-field-right" id="${topfield.card[i]}" height="140">`)
                )
            }
            if(i>0){
                jQuery('.field-right').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="hor-margin img-card-field img-card-field-right" id="${topfield.card[i]}" height="140">`)
                )
            }
        }
    }

    if (prevPno === mynumb){
        jQuery('.field-bot').empty();
        jQuery('.field-bot').css({"z-index": zindex});

        greyCardFieldBot();
        greyCardFieldLeft();
        greyCardFieldRight();
        greyCardFieldTop();

        for(var i=0; i<topfield.card.length; i++){
            if(i === 0){
                jQuery('.field-bot').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="img-card-field img-card-field-bot" id="${topfield.card[i]}" height="140">`)
                )
            }
            if(i>0){
                jQuery('.field-bot').append(
                    jQuery(`<img src="./cards_img/${topfield.card[i]}.png" class="hor-margin img-card-field img-card-field-bot" id="${topfield.card[i]}" height="140">`)
                )
            }
        }
    }
}

function greyCardFieldTop(){
    if(jQuery('.img-card-field-top')[0]){
        var prevCardLists = [];

        $('.field-top > img').each(function(){
            prevCardLists.push($(this).attr('id'))
        });

        jQuery('.field-top').empty();
        jQuery('.field-top').css({"z-index": zindex-1});
        for(var j=0; j<prevCardLists.length; j++){
            if(j === 0){
                jQuery('.field-top').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="img-card-field" height="140">`)
                )
            }
            if(j>0){
                jQuery('.field-top').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="hor-margin img-card-field" height="140">`)
                )
            }
        }
    }
}

function greyCardFieldBot(){
    if(jQuery('.img-card-field-bot')[0]){
        var prevCardLists = [];

        $('.field-bot > img').each(function(){
            prevCardLists.push($(this).attr('id'))
        });

        jQuery('.field-bot').empty();
        jQuery('.field-bot').css({"z-index": zindex-1});
        for(var j=0; j<prevCardLists.length; j++){
            if(j === 0){
                jQuery('.field-bot').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="img-card-field" height="140">`)
                )
            }
            if(j>0){
                jQuery('.field-bot').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="hor-margin img-card-field" height="140">`)
                )
            }
        }
    }
}

function greyCardFieldLeft(){
    if(jQuery('.img-card-field-left')[0]){
        var prevCardLists = [];

        $('.field-left > img').each(function(){
            prevCardLists.push($(this).attr('id'))
        });

        jQuery('.field-left').empty();
        jQuery('.field-left').css({"z-index": zindex-1});
        for(var j=0; j<prevCardLists.length; j++){
            if(j === 0){
                jQuery('.field-left').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="img-card-field" height="140">`)
                )
            }
            if(j > 0){
                jQuery('.field-left').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="hor-margin img-card-field" height="140">`)
                )
            }
        }
    }
}

function greyCardFieldRight(){
    if(jQuery('.img-card-field-right')[0]){
        var prevCardLists = [];

        $('.field-right > img').each(function(){
            prevCardLists.push($(this).attr('id'))
        });

        jQuery('.field-right').empty();
        jQuery('.field-right').css({"z-index": zindex-1});
        for(var j=0; j<prevCardLists.length; j++){
            if(j===0){
                jQuery('.field-right').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="img-card-field" height="140">`)
                )
            }
            if(j>0){
                jQuery('.field-right').append(
                    jQuery(`<img src="./cards_img/cards_dark/${prevCardLists[j]}.png" class="hor-margin img-card-field" height="140">`)
                )
            }
        }
    }
}

function showPass(prevPno){
    if (prevPno === p2numb){
        jQuery('.player-left .pass-sign').append(
            jQuery("<center><h3> PASS </h3></center>")
        )
    }

    if (prevPno === p3numb){
        jQuery('.player-top .pass-sign').append(
            jQuery("<center><h3> PASS </h3></center>")
        )
    }

    if (prevPno === p4numb){
        jQuery('.player-right .pass-sign').append(
            jQuery("<center><h3> PASS </h3></center>")
        )
    }

    if (prevPno === mynumb){
        jQuery('.player-bot .pass-sign').append(
            jQuery("<center><h3> PASS </h3></center>")
        )
    }

}

function timerCountdown(currentTurn){
    $(".player-timer").empty();
    $(".p2-timer").empty();
    $(".p3-timer").empty();
    $(".p4-timer").empty();

    var startTime = 20 - (timeCount/1000);
    if(myusername === currentTurn) $(".player-timer").append(`<video autoplay playsinline> <source src="./img/timer.mp4#t=${startTime},20" type="video/mp4"> </video>`)
    if(p2username === currentTurn) $(".p2-timer").append(`<video autoplay playsinline> <source src="./img/timer.mp4#t=${startTime},20" type="video/mp4"> </video>`)
    if(p3username === currentTurn) $(".p3-timer").append(`<video autoplay playsinline> <source src="./img/timer.mp4#t=${startTime},20" type="video/mp4"> </video>`)
    if(p4username === currentTurn) $(".p4-timer").append(`<video autoplay playsinline> <source src="./img/timer.mp4#t=${startTime},20" type="video/mp4"> </video>`)
}
socket.on('disconnect', function(){
    console.log('disconnect from server');
});

function startCountdown(){
    $(".start-timer").append(`<video autoplay playsinline> <source src="./img/timer_5.mp4" type="video/mp4"> </video>`)
    setTimeout(()=>{
        $(".start-timer").empty();
    }, 5000);
}