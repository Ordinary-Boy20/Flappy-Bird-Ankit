// board
let board;
let boardWidth = 360; // ye no. isiliye liya gya hai kyunki bgImg isi dimension ka hai
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; // real bird width/height ratio = 408/220 = 17/12;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg; // var for bird img

let bird = { // bird object
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// build pipes in array
let pipeArray = [];
let pipeWidth = 64; // original Width height ratio = 384/3072 = 1/8;
let pipeHeight = 512;
let pipeX = 360; // ending point of canvas in X.
let pipeY = 0; // starting point of canvas in Y.

let topPipeImg;
let bottomPipeImg;

// physics in which pipe moves not bird
let velocityX = -3; // negative because pipes moving left
let velocityY = 0;  // bird jump speed
let gravity = 0.5; //
let gameOver = false;

let score = 0;
let final;
let gameStarted = false;

// on page loading.... har time

window.onload = function() {
    board = document.querySelector("#board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing the board

    // draw flappy bird
    // context.fillStyle = "pink";// color of the rectangle will be pink
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // load Image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // isme 5 hote hai ek image extra hota hai
    }

    // load pipes
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";
    
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottomPipe.png";


    requestAnimationFrame(update);
    // pipe lana hai har 1.5 sec me
    setInterval(placePipes, 2500); //every 1.5sec

    // If I tap key bird have velocity
    document.addEventListener("keydown", movebird);
    document.addEventListener("click", movebird2);

    // setInterval(obstacles,5000); // Removed as it does not affect gameplay

}

// build a update function
function update(){
    requestAnimationFrame(update);

    // start by space
    if(gameStarted === false){
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText("Start the game", 20, 45);
        return;
    }
    // after game over no frame
    if(gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height); // har bar new canvas ke 
    
    // bird 
    velocityY += gravity;
    //bird.y += velocityY; // we cannot define how high it goes
    bird.y = Math.max(bird.y + velocityY, 0); // not go top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // if bird fall down
    if(bird.y > board.height){
        gameOver = true;
    }

    // pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x +pipe.width){
            score +=0.5;
            pipe.passed = true;
        }

        // after game over no frame
        if(detectCollision(bird,pipe)){
            gameOver = true;
            context.fillStyle = "white";
            context.font = "45px sans-serif";
            
        }
    }

    // score
    // draw score
    context.fillStyle = "white";
    context.font = "25px sans-serif";
    context.fillText("Score: " + Math.floor(score), 10, 30);

    // if game over, show message and final score
    if (gameOver) {
        final = Math.floor(score);
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText("Game Over", board.width / 6, board.height / 2 - 20);
        context.font = "25px sans-serif";
        context.fillText("Final Score: " + final, board.width / 3, board.height / 2 + 20);
    }
}
    

// placepi pe function
function placePipes(){
    
    if (gameOver) {
        final = Math.floor(score);
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText("Game Over", board.width / 6, board.height / 2 - 20);
        context.font = "25px sans-serif";
        context.fillText("Final Score: " + final, board.width / 3, board.height / 2 + 20);
        context.font = "20px sans-serif";
        context.fillText("Press Space to Restart", 70, board.height / 2 + 60);
        return;
}


    // I want random size pipes
    let randomPipeY = pipeY - pipeHeight/4  - Math.random() * (pipeHeight/2);
    openingSpace = board.height/5;
    
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY, 
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);


    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function movebird(e) {
    if(e.code == "Space" || e.code == "ArrowUp") {

        if(gameStarted === false){
           startGame();
           return;
        }
        if(gameOver) {
            restartGameFuc();
            return;
        }
        //jump
        velocityY = -7;
    }
}

function movebird2() {
    //jump
    velocityY = -5;
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y ;
}


function startGame() {

    gameStarted = true;
    gameOver = false;
    score = 0;
    pipeArray = [];
    bird.y = boardHeight/2;
    velocityY = 0;
}

function restartGameFuc() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    pipeArray = [];
    bird.y = boardHeight/2;
    velocityY = 0;
}


