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
function update(name){

    if(currPlayer == 1){
        WhitePoints = prevW- 50;
        if(name && name[0]=='b') WhitePoints -= scores[name[1]];
    }else{
        BlackPoints = prevB -50 ;
        if(name && name[0]=='w')BlackPoints -= scores[name[1]];
    }
}


function undoLast(move){
    // move back the moved piece where it's source was

    if(undoCastle(move)){
        return ; // uncastled 
    }else{
        let dx= move.dx; let dy= move.dy;
        // clear this one
        ctx.clearRect(dx*SQ, dy*SQ, SQ, SQ);
        ctx.fillStyle= colors[board[dy][dx][0]];
        ctx.fillRect(dx*SQ, dy*SQ, SQ, SQ);
    
        // only redraw the image of piece at sx, sy
        let sx= move.sx; let sy= move.sy;
        ctx.drawImage(move.piece.piece.img, sx*SQ+15, sy*SQ+15, 50,50);
        
        board[sy][sx][1]= move.piece;
        board[sy][sx][1].x = sx; board[sy][sx][1].y= sy;
        let name= move.xpiece != null ? move.xpiece.piece.name: null ;
        update(name);
        // if any piece was captured redraw it 
        if(move.xpiece){
            // only here we need to repaint it whole 
            // there was a piece captured 
            dx= move.xpiece.x; dy= move.xpiece.y;
            board[dy][dx][1]= move.xpiece
            board[dy][dx][1].x = dx; board[dy][dx][1].y= dy;
            ctx.clearRect(dx*SQ, dy*SQ, SQ, SQ);
            ctx.fillStyle= colors[board[dy][dx][0]];
            ctx.fillRect(dx*SQ, dy*SQ, SQ, SQ);
            ctx.drawImage(move.xpiece.piece.img, dx*SQ+15, dy*SQ+15, 50,50);
    
        }
    }


}

function castleType(move){
    //
    let dx= move.dx; let dy= move.dy;
    let castle = true ; // o-o castle default
    if(dx < move.sx) castle = 0; // o-o-o castle 
    return castle;
}

function doUndoCastle(piece, xpiece, sx, dx, dy, esx, edx){
    // since dy is same 
    ctx.clearRect(esx*SQ, dy*SQ, SQ, SQ );
    ctx.clearRect(edx*SQ, dy*SQ, SQ, SQ );

    // recolor 
    ctx.fillStyle = colors[board[dy][esx][0]];
    ctx.fillRect(esx*SQ, dy*SQ, SQ, SQ);

    ctx.fillStyle = colors[board[dy][edx][0]];
    ctx.fillRect(edx*SQ, dy*SQ, SQ, SQ);

    // redraw Images
    ctx.drawImage(piece.piece.img, sx*SQ+15, dy*SQ+15, 50,50)
    ctx.drawImage(xpiece.piece.img, dx*SQ+15, dy*SQ+15, 50,50)

    board[dy][sx][1]= piece;
    board[dy][sx][1].canCastle = true;
    board[dy][sx][1].x= sx;
    board[dy][dx][1]= xpiece;
    board[dy][dx][1].canCastle= true;
    board[dy][dx][1].x= dx;
    board[dy][esx][1]= EMPTY;
    board[dy][edx][1]= EMPTY;

    
}

function undoCastle(move){

    // validate move is castle
    if(move.xpiece == null ) return false ; //can't be a castle
    if(move.piece.piece.name[1] == 'k' && move.xpiece.piece.name[1] =='r' && pList[currPlayer]== move.xpiece.piece.name[0]) {

    // o-o or o-o-o  type
    let dx= move.dx; let dy= move.dy; let sx= move.sx;
    let castletype = castleType(move);
    
        if(castletype){
            // o-o castle 
            // rook is at dx-1, dy has to go to dx+1, dy and king has to go to sx, sy 
            // clear rects dx,dy && dx-1,
            // make a function that takes these four squares and does the job
            doUndoCastle(move.piece, move.xpiece , sx, dx+1, dy, dx, dx-1 );
        }else{
            doUndoCastle(move.piece, move.xpiece , sx, dx-2, dy, dx, dx+1 );
        }
    }else return false ;

}