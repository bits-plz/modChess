/**
 * Pawn promotion
 */

let choices =['q', 'n', 'b' ,'r']

function promotePawn(pawn){
    // a pawn can only promote once 
    // so it doesn't make sense that we have one more field
    // also it has been checked that king is not in check

    // for testing purposes promote only to queen

    let pieceToGen = "";
    if(currPlayer==1){
        pieceToGen+='w'
    }else{
        pieceToGen+='b'
    }

    pieceToGen+='q'
    // the piece already has coordinates 

    let genPiece = new Piece(new Sprite(pieceToGen), pawn.x, pawn.y)
    
    // generated piece need to be put on the board

    board[pawn.y][pawn.x][1] = genPiece; // assign it before and it will be updated
    modClearRect(pawn.x, pawn.y)
    


}