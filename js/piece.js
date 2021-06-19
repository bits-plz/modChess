/**
 * Pieces
 */
class Piece{
    constructor(sprite, x, y){
        if(sprite.name.endsWith('p')) {
            this.firstMove=0;
            this.doubleMove=0;
        }
        if(sprite.name.endsWith('k') || sprite.name.endsWith('r')) this.canCastle= true;
        this.piece = sprite;
        this.x=x;
        this.y=y;
        this.draw= function(){
            this.piece.img.addEventListener('load', ()=>{
                ctx.drawImage(board[y][x][1].piece.img, x*SQ+12.5 , y*SQ+12.5, 50,50);
            });
        };
        this.isSameType= function(x,y){
            let this_name_start= this.piece.name[0];
            if(board[y][x][1] != EMPTY) {
                if(board[y][x][1].piece.name[0]== this_name_start) return true;
            }
            return false;
        }

        this.bounds= function(x,y){
            return (x>=0 && y>=0 && x<SQ/10 && y<SQ/10);
        }
        this.isBlocked= function(x, y){

            if(board[y][x][1] != EMPTY){
                if(board[y][x][1].piece.name.startsWith(this.piece.name[0])) return true;
            }

            // if already present is of same type
            // if piece is r,p,k,q types
            let pieceType= this.piece.name[1]; 

            if(pieceType =='p' || pieceType =='q' || pieceType =='r' || pieceType =='k'){
                if(y== this.y){ 
                    //same row that is same this.y
                    if(x> this.x){
                        // check right
                        for(let xx= this.x+1 ; xx<x && xx<COL; x++){
                            if(board[y][xx][1] != EMPTY) return true;
                        }
                    }else if(x< this.x) {
                        //check left
                        for(let xx= this.x-1 ; xx>x && xx>=0 ; xx-- ){
                            if(board[y][xx][1] != EMPTY) return true;
                        }
                    }
                }
                
                //same this.x 
                if(this.x== x){
                  if(y > this.y){
                      //check down
                      for(let yy= this.y +1; yy <y && yy<ROW ; yy++){
                        if(board[yy][x][1] != EMPTY) return true;
                      }
                  }else{
                    // check up
                    for(let yy=this.y - 1; yy>y && yy>=0 ;yy--){
                        if(board[yy][x][1] != EMPTY) return true;
                    }
                  }
                }
            }
        
            
            //check the diagonals if piece is q, b, k type

            if(pieceType=='q' || pieceType=='b'){
                // there can be four diagonals from one point 
                // we need to check only the one that is the deciding diagonal i.e where we want to move
                //yy is row, xx is col
                // although now i know that the king and pawn will never be blocked 
                if(this.x < x && this.y <y){
                    // se
                    for(let xx = this.x +1 ,yy =this.y +1 ; xx<x && yy<y ; xx ++ , yy++){
                        if(board[yy][xx][1] != EMPTY) return true;
                    }
                }else if(this.x> x && this.y <y){
                    // sw
                    for(let xx = this.x -1 , yy =this.y +1 ;xx>x && yy<y ; xx -- , yy++){
                        if(board[yy][xx][1] != EMPTY) return true;
                    }
                }else if(this.x< x && this.y> y){
                    //ne
                    for(let xx = this.x +1 , yy =this.y -1 ; xx<x && yy>y ; xx++ , yy--){
                        if(board[yy][xx][1] != EMPTY) return true;
                    }
                }else if(this.x >x && this.y > y){
                    //nw
                    for(let xx = this.x -1 , yy =this.y -1 ;xx>x && yy>y ; xx -- , yy--){
                        if(board[yy][xx][1] != EMPTY) return true;
                    }
                }
            }


            // check for knight

            if(pieceType =='n'){
                // no one blocks the knight, it moves where it wants to unless the piece present is samecolor
            }
            return false;
        }
        this.canMove = function(x,y){
            if(this.piece.name.endsWith('p')){
                return pawnMove(this, y, x);
            }else if(this.piece.name.endsWith('q')){
                return (x== this.x || y== this.y || y-x == this.y- this.x || y+x == this.x+ this.y);
            }else if(this.piece.name.endsWith('b')){
                return (this.x- this.y == x-y || this.x+ this.y == x+y);
            }else if(this.piece.name.endsWith('r')){
                return (x== this.x || y== this.y) ;
            }else if(this.piece.name.endsWith('n')){
                if(Math.abs(x-this.x) == 2) return Math.abs(y-this.y) ==1;
                else if(Math.abs(this.x -x) ==1 ) return Math.abs(y-this.y)==2;
            }else if(this.piece.name.endsWith('k')){
                return Math.abs(x-this.x)==1 || Math.abs(y-this.y)==1;
            }

        }

        this.move= function(x,y,color){
            if(this.bounds(x,y) && !inCheck(Klist[currPlayer], x, y, selectedPiece) ){
                if(this.canMove(x, y)){
                    if(!this.isBlocked(x, y) ){
                        if(this.firstMove==0) this.firstMove++; 
                        ctx.clearRect(this.x*SQ,this.y*SQ,SQ,SQ); // 
                        ctx.fillStyle= colors[board[this.y][this.x][0]];
                        ctx.fillRect(this.x*SQ,this.y*SQ, SQ, SQ);
                        ctx.fillStyle= color;
                        
                        ctx.clearRect(x*SQ, y*SQ, SQ, SQ);
                        ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
                        ctx.drawImage(this.piece.img, x*SQ+15, y*SQ+15, 50,50);
                        
                        board[this.y][this.x][1]=EMPTY;
                        this.x=x; 
                        this.y=y;
                        board[y][x][1]=this;
                        if(board[y][x][1].piece.name == 'wk'){
                            wKing= this;
                        }else if(board[y][x][1].piece.name == 'bk'){
                            bKing= this;
                        }
                        if(selectedPiece.piece.name.endsWith('k') || selectedPiece.piece.name.endsWith('r')) this.canCastle= false; // can't castle if done already
                        return true;
                    }
                }else if(enPassant(x, y)){
                    if(this.firstMove==0) this.firstMove++; 
                    ctx.clearRect(this.x*SQ,this.y*SQ,SQ,SQ); // 
                    ctx.fillStyle= colors[board[this.y][this.x][0]];
                    ctx.fillRect(this.x*SQ,this.y*SQ, SQ, SQ);
                    
                    if(currPlayer == 1){
                        ctx.fillStyle = colors[board[y+1][x][0]];
                        ctx.clearRect(x*SQ, (y+1)*SQ, SQ, SQ);
                        ctx.fillRect(x*SQ, (y+1)*SQ, SQ, SQ);
                    }else{
                        ctx.fillStyle = colors[board[y-1][x][0]];
                        ctx.clearRect(x*SQ, (y-1)*SQ, SQ, SQ);
                        ctx.fillRect(x*SQ, (y-1)*SQ, SQ, SQ);
                    }

                    ctx.fillStyle= color;
                    ctx.clearRect(x*SQ, y*SQ, SQ, SQ);
                    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
                    ctx.drawImage(this.piece.img, x*SQ+15, y*SQ+15, 50,50);
                    
                    board[this.y][this.x][1]=EMPTY;
                    this.x=x; 
                    this.y=y;
                    board[y][x][1]=this;
                    if(board[y][x][1].piece.name == 'wk'){
                        wKing= this;
                    }else if(board[y][x][1].piece.name == 'bk'){
                        bKing= this;
                    }
                    return true;    
                }else if(castelling(x, y)) return true;
                }else {
                    console.log('cant move');
            }
            return false;
        }
    }
}

class moddedPiece{
    constructor(name, x, y){
        if(name.endsWith('p')) {
            this.firstMove=0;
            this.doubleMove=0;
        }
        if(name.endsWith('k') || name.endsWith('r')) this.canCastle= true;
        this.name = name;
        this.x=x;
        this.y=y;
    }
}
