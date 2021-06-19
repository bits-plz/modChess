// given the text file that has data about which piece is where as well as the empty ones compressed in bottom to up fashion
// when it is written that a3-b4 E, that means that 
// a3 - a8,, b1- b4 is empty and no pieces are there
// when written a3BK that means black king is at a3 and so on 

/////////////////STANDARD CHESS BOARD

// a8 b8 c8 d8 e8 f8 g8 h8
// a7 b7 c7 d7 e7 f7 g7 h7
// a6 b6 c6 d6 e6 f6 g6 h6
// a5 b5 c5 d5 e5 f5 g5 h5
// a4 b4 c4 d4 e4 f4 g4 h4
// a3 b3 c3 d3 e3 f3 g3 h3
// a2 b2 c2 d2 e2 f2 g2 h2
// a1 b1 c1 d1 e1 f1 g1 h1

// REMEMBER WE FILLING from bottom to up
// fill in the board
//animation loop
const colors ={0:'#fff', 1: '#000'};
//const colors={0:"#ffb366",1:"#663500"};
const pieces = []
const type = ['p', 'k', 'q', 'r', 'b', 'n']
// we need not worry about the number of a particular piece being two because after loading the sheet, the board doesn't care anyways

for (let i = 0; i < type.length; ++i) {
    pieces.push('w' + type[i]); pieces.push('b' + type[i]);
}

let pieceMap = {}
for (let q = 0; q < pieces.length; ++q) pieceMap[pieces[q].toUpperCase().toString()] = pieces[q];
pieceMap["EE"] = EMPTY; // symbolises the empty square


// now we begin scanning the board

// a1-a8 , b1-b8 .. and so on
// a1-a8 means that we have x cordinate as xcord['a'], and ycord[1]
let xcords = {}
for(let i=0; i< 8; ++i) xcords[String.fromCharCode(97+i)] = i;
let ycords ={}
for(let i=1; i<=8; i++) ycords[i] = 8-i;
let mboard = []

for (let i = 0; i < 8; ++i) {
    mboard[i] = [];
    for (let j = 0; j < 8; ++j) {
        mboard[i][j] = EMPTY;
    }
}
let cColor= 1;
for(let j=0; j<8;++j){
    cColor= (cColor==1)?0:1;
    for(let i=0; i<8;++i){
        cColor= (cColor==1)?0:1;
        mboard[i][j]=[cColor, EMPTY];
    }
}
// since the text will be coming we have to only scan it 
// and put that on board, it may come with only two pieces but that's fine

// but what is not fine is that
// we get a word as a1, it means nothing unless it is written a1E, that means it is empty
// or a1-a4 , it should be a1-a4EE

// one correct representation can be
// "a1WR,a2WP,a3-a6EE,a7BP,a8BR,b1WN,2bWP,b3-b6EE,b7BP,a8BN, c1WB,c2WP,c3-c6EE,c7BP,c8BB,d1WQ,d2WP,d3-d6EE,d7BP,d8BQ,e1WK,e2WP,e3-e6EE,e7BP,e8BK,e1WB,f2WP,f3-f6EE,f7BP,f8BB,g1WN,g2WP,g3-g6EE,g7BP,g8BN,h1WR,h2WP,h3-h6EE,h7BP,h8BR" ,, which infact is the standard board config

let standardConfig = "a1WR,a2WP,a3-a6EE,a7BP,a8BR,b1WN,b2WP,b3-b6EE,b7BP,b8BN,c1WB,c2WP,c3-c6EE,c7BP,c8BB,d1WQ,d2WP,d3-d6EE,d7BP,d8BQ,e1WK,e2WP,e3-e6EE,e7BP,e8BK,f1WB,f2WP,f3-f6EE,f7BP,f8BB,g1WN,g2WP,g3-g6EE,g7BP,g8BN,h1WR,h2WP,h3-h6EE,h7BP,h8BR";

standardConfig = standardConfig.split(',');
for(let u=0; u<standardConfig.length ;u++) standardConfig[u]= standardConfig[u].trim();
// it may happen someone gave a range a3-a5EE then a4BP , that's completely fine

for(let e= 0; e<standardConfig.length ; ++e){
    let conf= standardConfig[e];
    let xStart= xcords[conf[0]]; // conf[]
    let yStart= ycords[parseInt(conf[1])];
    if(conf[2]=='-'){
        let xEnd= xcords[conf[3]];
        let yEnd= ycords[parseInt(conf[4])];
        let piece= conf.substr(5,2);
        for(let x1= xStart; x1<=xEnd ;++x1){
            for(let y1= yStart; y1<=yEnd ;++y1){
                mboard[y1][x1][1]= (piece == "EE" ) ? EMPTY : new Piece(new Sprite(pieceMap[piece]) , x1 , y1);
                if(piece != "EE"){
                    if(piece[0] == 'W'){
                        piece = mboard[y1][x1][1];
                        whitePieces.push(new moddedPiece(piece.piece.name, x1, y1));
                    }else{
                        piece = mboard[y1][x1][1];
                        blackPieces.push(new moddedPiece(piece.piece.name, x1, y1));
                    }
                }
            }
        }

    }else{
        let piece= conf.substr(2,2);
        mboard[yStart][xStart][1]= (piece=="EE")? EMPTY : new Piece(new Sprite(pieceMap[piece])  , xStart, yStart);
        if(piece != "EE"){
            if(piece[0] == 'W'){
                piece = mboard[yStart][xStart][1];
                whitePieces.push(new moddedPiece(piece.piece.name,  xStart, yStart));
            }else{
                piece = mboard[yStart][xStart][1];
                blackPieces.push(new moddedPiece(piece.piece.name, xStart , yStart));
            }
        }
    }
}
let wbMap = {0: blackPieces, 1: whitePieces}; 