
// トランプデッキを作成する関数
function createDeck() {
    const suits = ['s', 'h', 'd', 'c']; // スート
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']; // ランク
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(`${suit}${rank}`);
        }
    }
    return deck;
};

// シャッフルする関数
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // カードを交換
    }
    return deck;
};

//カードを引いて画像表示させる関数
function drawCard(deck, imgPosition) {
    if (deck.length === 0) {
        return 'デッキが空です';
    }
    drawCardNum = deck.pop(); // デッキから1枚引く
    $(imgPosition).attr("src", imgCard(drawCardNum, cardURL));
    return drawCardNum;
};

//カード画像のURLを表示する関数
let currentCard = "";
let cardURL = "img/omote.png";
function imgCard(currentCard, cardURL) {
    cardURL = "img/" + currentCard + ".png"
    return cardURL;
};

//チップ画像を表示する関数
function tipImg1(){
    tip1URL = "img/" + selectBet + ".png"
    $(".tip1").attr("src", tip1URL);
};

//チップ画像2枚目を表示する関数
function tipImg2(){
    tip2URL = "img/" + selectBet + ".png"
    $(".tip2").attr("src", tip2URL);
};

//掛け金をかけたときの効果音を再生する関数
function playCharin() {
    const audio2 = $("#charin")[0];
    audio2.play();
};

//持ち金以上の掛け金をかけた時の効果音を再生する関数
function playBu() {
    const audio3 = $("#bu-")[0];
    audio3.play();
};

//数字を調整する関数(トランプの値を数字のみにし、11〜13は10に、1は場合によって11か1に調整)
function adjustNum(card, oldSum) {
    let cardNum = Number(card.replace(/[^0-9^]/g, ""));
    if (cardNum > 11) {
        cardNum = 10;
    } else if (cardNum == 1 && oldSum < 11) {
        cardNum = 11;
    };
    return cardNum
};

//リスタート関数
function restartGame(){
    $("#dealer_1, #dealer_2, #dealer_3, #dealer_4, #dealer_5,#you_1, #you_2, #you_3, #you_4, #you_5").attr("src","img/omote.png");
    dealerScore=0, youScore = 0, dealer1=0, dealer2=0, dealer3=0, dealer4=0, dealer5=0, dealerNum1=0, dealerNum2=0,dealerNum3=0, dealerNum4=0, dealerNum5=0, you1=0, you2=0, you3=0, you4=0, you5=0, youNum1=0, youNum2=0, youNum3=0, youNum4=0, youNum5=0;
    $("#message").css("opacity","0");
    $("#message").html("");
    $("#score").html("");
    $("#dealer_2_2").css("display", "block");
    $("#dealer_score").html("");
    $(".tip1").attr("src", "img/toumei.png");
    $(".tip2").attr("src", "img/toumei.png");
};

//ゲーム終了後の、データ引き継ぎorリセット処理
function finishGame(){
    let oldCredit = Number($("#credit").text());
    localStorage.clear();
    
    if (oldCredit == 0) {
        overGame();
    } else {
        continueGame();
    }};
    
//ゲームオーバー関数
function overGame(){
    $("#message").css("opacity","1");
    $("#message").html("GAME OVER...");
    setTimeout(() => {location.reload();}, 2000) //2秒後にリロード;
};

//コンティニュー関数
function continueGame(){
    let key = 1;
    let oldCredit = Number($("#credit").text());
    localStorage.setItem(key, oldCredit);
    setTimeout(restartGame, 2000); //2秒後にリスタート
};

//ゲームに勝ったときの関数
function winGame(message){
    $("#dealer_2_2").css("display", "none");
    $("#dealer_score").html(dealerScore);
    $("#message").css("opacity","1");
    $("#message").html(message);
    $("#credit").text(Number(credit) + Number(selectBet)*2);
    $("#bet").text(0);
    tipImg2();
    const audio3 = $("#win")[0];
    audio3.play();
    finishGame();
    };

//ゲームに負けたときの関数
function loseGame(message){
    $("#dealer_2_2").css("display", "none");
    $("#dealer_score").html(dealerScore);
    $("#message").css("opacity","1");
    $("#message").html(message);
    $("#bet").text(0);
    $(".tip1").attr("src", "img/toumei.png");
    const audio4 = $("#lose")[0];
    audio4.play();
    finishGame();
    };

//ゲームに引き分けのときの関数
function drawGame(message){
    $("#dealer_2_2").css("display", "none");
    $("#dealer_score").html(dealerScore);
    $("#message").css("opacity","1");
    $("#message").html(message);
    $("#credit").text(Number(credit) + Number(selectBet));
    $("#bet").text(0);
    finishGame();
    };

//サレンダーのときの関数
function surrenderGame(){
    $("#dealer_2_2").css("display", "none");
    $("#dealer_score").html(dealerScore);
    $("#message").css("opacity","1");
    $("#message").html("You pay "+Number(selectBet) / 2+"＄");
    $("#credit").text(Number(credit) + Number(selectBet)/2);
    $("#bet").text(0);
    const audio4 = $("#lose")[0];
    audio4.play();
    finishGame();
    };

//プレイヤーのスコアが21点になったときの処理
function ruleScore21() {
    if (dealerScore == 21) {
        drawGame("BLACK JUCK! DRAW...");
    } else {
        winGame("BLACK JACK!!!YOU WIN!!!");
    };
};

//画面表示
$(".dealer_t,#dealer_2_2,.you_t").fadeIn(1000);

//bgm
$(document).ready(function () {
    var audio = $('#bgm')[0]; // audio要素を取得
    var isPlaying = false;
    
    // デフォルトの音量を小さく設定
    audio.volume = 0.2;
    
    $('#playButton').click(function () {
        if (isPlaying) {
            audio.pause(); // 音楽を一時停止
            audio.currentTime = 0; // 再生位置を最初に戻す
            $(this).text('♪ MUSIC ON'); // ボタンのテキストを「再生」に変更
        } else {
            audio.play(); // 音楽を再生
            $(this).text('♪ MUSIC OFF'); // ボタンのテキストを「停止」に変更
        }
        isPlaying = !isPlaying; // フラグを反転
    });
});
    
//掛け金とクレジットを設定
const betAmounts = [1, 5, 10, 50, 100, 500];
const firstcredit = 30;

//掛け金を動的に表示
$("#credit_area").append('<div id="credit">' + firstcredit + '</div>');
let credit = Number($("#credit").text());

//ボタンを動的に生成して追加
betAmounts.forEach(function (bet) {
    $("#bet_btns").append('<button class="start" value="' + bet + '">' + bet + '$</button>');
});

// デッキを作成してシャッフル
let deck = createDeck();
deck = shuffleDeck(deck);

//グローバル変数を宣言
let dealerScore = 0;
let youScore = 0;
let selectBet;
let dealer1, dealer2, dealer3, dealer4, dealer5;
let dealerNum1, dealerNum2, dealerNum3, dealerNum4, dealerNum5;
let you1 = 0, you2 = 0, you3 = 0, you4 = 0, you5 = 0;
let youNum1, youNum2, youNum3, youNum4, youNum5;

//掛け金をクリックしたときのスタート処理
$(".start").on("click", function () {
    selectBet = Number($(this).val());
    credit = Number($("#credit").text());
    tipImg1();
    if (selectBet > credit) {
        playBu();
        return
    } else if (selectBet <= credit) {
        playCharin();
        $("#bet").text(selectBet);
        $("#credit").text(credit - selectBet);
        credit = Number($("#credit").text());
        dealer1 = drawCard(deck, "#dealer_1");
        dealer2 = drawCard(deck, "#dealer_2");
        you1 = drawCard(deck, "#you_1");
        you2 = drawCard(deck, "#you_2");
        
        dealerNum1 = Number(adjustNum(dealer1, 0));
        dealerNum2 = Number(adjustNum(dealer2, dealerNum1));
        youNum1 = Number(adjustNum(you1, 0));
        youNum2 = Number(adjustNum(you2, youNum1));
        dealerScore = dealerNum1 + dealerNum2;
        youScore = youNum1 + youNum2;
        $("#score").html(youScore);

        if (youScore == 21) {
        ruleScore21();
        };
    };
});

//hit操作
$("#hit").click(function () {
    const audio5 = $("#card")[0];
    audio5.play();
        if (you3 == 0) {
            you3 = drawCard(deck,"#you_3");
            youNum3 = Number(adjustNum(you3,youScore));
            youScore = youScore + youNum3;
            $("#score").html(youScore);
            
            if (youScore == 21) {
                ruleScore21();
            } else if (youScore >= 22) {
                loseGame("BUSTED!!!YOU LOSE...");
            }
        } else if (you4 == 0) {
            you4 = drawCard(deck,"#you_4");
            youNum4 = Number(adjustNum(you4,youScore));
            youScore = youScore + youNum4;
            $("#score").html(youScore);
            
            if (youScore == 21) {
                ruleScore21();
            } else if (youScore >= 22) {
                loseGame("BUSTED!!!YOU LOSE...");
            }
        } else if (you5 == 0) {
            you5 = drawCard(deck,"#you_5");
            youNum5 = Number(adjustNum(you5,youScore));
            youScore = youScore + youNum5;
            $("#score").html(youScore);

            if (youScore == 21) {
                ruleScore21();
            } else if (youScore >= 22) {
                loseGame("BUSTED!!!YOU LOSE...");
            }
        }
    });

//Stand操作
$("#stand").on("click", function () {
    const audio5 = $("#card")[0];
    audio5.play();
    if (dealerScore == 21) {
        loseGame("SORRY...YOU LOSE...");
    } else if (dealerScore < 21 && dealerScore >= 17) {
        if (dealerScore < youScore) {
            winGame("CONGRATULAYIONS!YOU WIN!");
        } else if (dealerScore > youScore) {
            loseGame("SORRY...YOU LOSE...");
        } else {
            drawGame("DRAW! LET'S TRAY AGAIN!");
        }
    } else if (dealerScore < 17) {
        dealer3 = drawCard(deck,"#dealer_3");
        dealerNum3 = Number(adjustNum(dealer3,dealerScore));
        dealerScore = dealerScore + dealerNum3;
        $("#dealer_score").html(dealerScore);

        if (dealerScore > 21) {
            winGame("CONGRATULAYIONS!YOU WIN!");
        } else if (dealerScore == 21) {
            loseGame("SORRY...YOU LOSE...");
        } else if (dealerScore < 21 && dealerScore >= 17) {
            if (dealerScore < youScore) {
                winGame("CONGRATULAYIONS!YOU WIN!");
            } else if (dealerScore > youScore) {
                loseGame("SORRY...YOU LOSE...");
            } else {
                drawGame("DRAW! LET'S TRAY AGAIN!");
            }
        } else if (dealerScore < 17) {
            dealer4 = drawCard(deck,"#dealer_4");
            dealerNum4 = Number(adjustNum(dealer4,dealerScore));
            dealerScore = dealerScore + dealerNum4;
            $("#dealer_score").html(dealerScore);

            if (dealerScore > 21) {
                winGame("CONGRATULAYIONS!YOU WIN!");
            } else if (dealerScore == 21) {
                loseGame("SORRY...YOU LOSE...");
            }else if (dealerScore < 21 && dealerScore >= 17) {
                if (dealerScore < youScore) {
                    winGame("CONGRATULAYIONS!YOU WIN!");
                } else if (dealerScore > youScore) {
                    loseGame("SORRY...YOU LOSE...");
                } else {
                    drawGame("DRAW! LET'S TRAY AGAIN!");
                }
            }else if(dealerScore < 17){
                dealer5 = drawCard(deck,"#dealer_5");
                dealerNum5 = Number(adjustNum(dealer5,dealerScore));
                dealerScore = dealerScore + dealerNum5;
                $("#dealer_score").html(dealerScore);
                if (dealerScore > 21) {
                    winGame("CONGRATULAYIONS!YOU WIN!");
                } else if (dealerScore == 21) {
                    loseGame("SORRY...YOU LOSE...");
                }else if (dealerScore < 21 && dealerScore >= 17) {
                    if (dealerScore < youScore) {
                        winGame("CONGRATULAYIONS!YOU WIN!");
                    } else if (dealerScore > youScore) {
                        loseGame("SORRY...YOU LOSE...");
                    } else {
                        drawGame("DRAW! LET'S TRAY AGAIN!");
                    }
                }else if(dealerScore < 17){
                    drawGame("SORRY,DRAW...LET'S TRAY AGAIN!");
                }
                
            }
        }

    }
});

//Sullender操作
$("#surrender").on("click", function () {
    const audio5 = $("#card")[0];
    audio5.play();
    surrenderGame();
});

//データ引き継ぎ
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const oldCredit = localStorage.getItem(key);
    $("#credit").text(oldCredit);
}

//リセットボタン
$(".reset").on("click", function () {
    localStorage.clear();
    location.reload();
})