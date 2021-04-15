// here in we give scores to the players as the game proceeds
// for now it is without undo operation as this is easier so it can be implemented fastly
// this will be running on server and players don't have access to it.

const gameWin = 1000;
const qCapture = 500;
const bCapture = 100;
const nCapture = 50;
const rCapture = 120;
const pCapture = 2;

let scores ={'q':qCapture , 'b': bCapture , 'n': nCapture, 'r': rCapture , 'p':pCapture};

function scoreEm(capturedPiece){
    if(capturedPiece) {
        let piece = capturedPiece.piece.name[1];
        currPlayer==1 ? WhitePoints+=scores[piece]: BlackPoints+=scores[piece];
    }
}

let BlackPoints = 0;
let WhitePoints = 0;

let black = document.getElementById('la');
let white = document.getElementById('ra')

black.innerHTML = BlackPoints;
white.innerHTML = WhitePoints;

let c = document.getElementById('chess')
black.style.left = `205px`;
white.style.right = `205px`

let prevB= BlackPoints;
let prevW= WhitePoints;

setInterval(()=>{
    if(prevB != BlackPoints){
        console.log('called');
        black.innerHTML = BlackPoints;
        prevB = BlackPoints;
    }
    if(prevW != WhitePoints){
        console.log('called');
        white.innerHTML = WhitePoints;
        prevW = WhitePoints;
    }
}, 15);
