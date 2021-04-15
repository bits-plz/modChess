// This is just to create a moves object 
// this object has the initial coordinate of the piece, the final coordinate, piece captured and the piece itself
// so that when we want to jump back or ahead till #moves done we can go
class Move{
    constructor(piece, sx, sy, dx, dy, xpiece){
        this.piece= piece;
        this.sx= sx;
        this.sy =sy;
        this.dx= dx;
        this.dy= dy;
        if(xpiece != null) this.xpiece= xpiece; // it may happen that we didn't capture any piece
    }
}

function undoLast(move){
    // move back the moved piece where it's source was
    let dx= move.dx; let dy= move.dy;
    // decolor this one
    ctx.clearRect(dx*SQ, dy*SQ, SQ, SQ);
    ctx.fillStyle= colors[board[dy][dx][0]];
    ctx.fillRect(dx*SQ, dy*SQ, SQ, SQ);

    // only redraw the image of piece at sx, sy
    let sx= move.sx; let sy= move.sy;
    ctx.drawImage(move.piece.piece.img, sx*SQ+15, sy*SQ+15, 50,50);
    
    board[sy][sx][1]= move.piece;
    board[sy][sx][1].x = sx; board[sy][sx][1]= sy;
    // if any piece was captured redraw it 
    if(move.xpiece){
        // only here we need to repaint it whole 
        dx= move.xpiece.x; dy= move.xpiece.y;
        board[dy][dx][1]= move.xpiece
        board[dy][dx][1].x = dx; board[dy][dx][1].y= dy;
        ctx.clearRect(dx*SQ, dy*SQ, SQ, SQ);
        ctx.fillStyle= colors[board[dy][dx][0]];
        ctx.fillRect(dx*SQ, dy*SQ, SQ, SQ);
        ctx.drawImage(move.xpiece.piece.img, dx*SQ+15, dy*SQ+15, 50,50);
        let piece= move.xpiece.piece.name[1];
        // subtract the points gained by capturing the piece
        if(currPlayer == 1 ){
            WhitePoints -= scores[piece];
        }else{
            BlackPoints -= scores[piece];
        }

    }

}