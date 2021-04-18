// this will generate all moves from the current board position for the currPlayer 
// That's the gist
// but how to proceed and how to generate the moves

// we somehow need to store all current Pieces for white and black in an array
// then stalemate logic is very easy that is valid moves list is empty but king is not in check but all of it's
// surrounding are


let blackPieces =[]
let whitePieces =[]

class validMove{
    constructor(piece, dx, dy){
        this.piece= piece; this.dx= dx; this.dy= dy; // we just need this info 
    }
}
let moveList=[];

function addTovalidMoves(king, x, y, piece){
    // if on doing this move the king is in check then we can't do this move
    // also there is one more case that when king is in check you can't castel that's the rul
    if(bounds(x, y)){
        if(!inCheck(king, x, y, board[piece.y][piece.x][1])){
            moveList.push(new validMove(piece, x, y));
        } 
    }
}

// intially it will get populated in modBoard.js

function bounds(x, y){
    return (x>=0 && x<COL && y>=0 && y<ROW);
}

let allMoveCall = false;

let staleMate = -1 ;
let gameOver  =  1;
let notover   =  2;

function allMoves(){
    allMoveCall= true;
    if(moveList.length > 0 )moveList.splice(0, moveList.length); // remove all the moves to save more space allocation
    // get all moves from this point on
    // if there are no valid moves for the king then it is a stalemate that is it is not in check but still 
    // can't move to other squares ,that is all surrounding squares are in attack
    // so move list is emp
    // in checkmate there are no moves which can prevent the check 
    let king= Klist[currPlayer];
    let e= wbMap[currPlayer];
    let isStaleMate= true;
    for(let i=0 ; i<e.length ;++i){
        // grab each piece and do see it's valid moves
         // local var
        let piece= e[i].name[1];
        let px= e[i].x; 
        let py= e[i].y;
        if(piece =='p'){
            // if double is enabled 
            // it is one + one double , else only single
            // or it can attack on the diagonal upto one increment 
            let p =0;

            if(currPlayer == 1){
                p = 1;
            }else p =-1;
            if(e[i].firstMove == 0) addTovalidMoves(king, px, py-2*p, e[i]);
            addTovalidMoves(king, px, py-1, e[i]);
            if(px+1<COL && board[py-p][px+1][1] != EMPTY && !board[py][px][1].isSameType(px+1, py-p)) addTovalidMoves(king, px+1, py-p, e[i]);
            if(px-1>=0 && board[py-p][px-1][1] != EMPTY && !board[py][px][1].isSameType(px-1, py-p))(king, px-1, py-p, e[i]);

        }else{
            // diagonals 
            if(piece =='q' || piece =='b'){
                // diag 1 below
                for(let dx =1, dy=1; dx< COL-px && dy<ROW- py; dx++, dy++){
                    if(board[py+dy][px+dx][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px+dx, py+dy)) break ;
                        addTovalidMoves(king, px+dx, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px+dx, py+dy , e[i]);
                }
                // diag 1 above
                for(let dx =-1, dy=-1; dx>= -px && dy>= -py; dx--, dy--){
                    if(board[py+dy][px+dx][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px+dx, py+dy)) break ;
                        addTovalidMoves(king, px+dx, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px+dx, py+dy , e[i]);
                }
                // diag 2 above
                for(let dx =1, dy=-1; dx< COL-px && dy>= -py; dx++, dy--){
                    if(board[py+dy][px+dx][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px+dx, py+dy)) break ;
                        addTovalidMoves(king, px+dx, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px+dx, py+dy , e[i]);
                }
                // diag 2 below
                for(let dx =-1, dy=1; dx>= -px && dy<ROW- py; dx--, dy++){
                    if(board[py+dy][px+dx][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px+dx, py+dy)) break ;
                        addTovalidMoves(king, px+dx, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px+dx, py+dy , e[i]);
                }
            }
            // straight col sweep row sweep
            if(piece =='q' || piece =='r'){
                // all the squares up down left right until a piece obstructs
                // check right
                for(let dx= 1; dx< COL-px ; dx++){
                    if(board[py][px+dx][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px+dx, py)) break ;
                        addTovalidMoves(king, px+dx, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px+dx , py , e[i]);
                }
                //check left
                for(let dx= -1; dx>=-px ; dx--){
                    if(board[py][px+dx][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px+dx, py)) break ;
                        addTovalidMoves(king, px+dx, py , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px+dx , py , e[i]);
                }
                // check down
                for(let dy= 1; dy< ROW-py ; dy++){
                    if(board[py+dy][px][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px,py+dy)) break ;
                        addTovalidMoves(king, px, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px , py+dy , e[i]);
                }
                //check up
                for(let dy= -1; dy>=-py ; dy--){
                    if(board[py+dy][px][1] !=EMPTY ) {
                        if(board[py][px][1].isSameType(px, py+dy)) break ;
                        addTovalidMoves(king, px, py+dy , e[i]); // last piece it can attack
                        break;
                    }
                    addTovalidMoves(king, px , py+dy , e[i]);
                }
            }
            // good ol' knight moves
            if(piece =='n'){
                for(let j=0; j< nxMoves.length ; ++j){
                    let x1= px+ nxMoves[j]; 
                    let y1= py+ nyMoves[j];
                    if(bounds(x1, y1) && board[py][px][1].isSameType(x1, y1)) continue ;
                    addTovalidMoves(king, x1, y1, e[i]);
                }
            }
            if(piece =='k'){
                let cnt=0;
                for(let i=0; i<xDirs.length; ++i){
                    let x1= px+ xDirs[i];
                    let y1= py+ yDirs[i];
                    if(bounds(x1, y1)){
                        if(inCheck(king, x1, y1, e[i])){
                            cnt++;
                        }else {
                            if(board[y1][x1][1] == EMPTY) continue ;
                            moveList.push(new validMove(e[i], x1, y1));
                        }
                    }
                }
                if(cnt== xDirs.length ) isStaleMate = true ; // no valid moves 
            }
        }

    }

    console.log(moveList);


    allMoveCall= false; // reset the allMove call to start recording capturedPieces

    if(isStaleMate && moves.length==0) return staleMate;
    if(moves.length ==0) return win;
    return notover;

}

