'use strict'

//canvas setup

const canvas= document.createElement('canvas');
canvas.id='chess'
canvas.style.zIndex=1;
document.body.appendChild(canvas);
const ctx= canvas.getContext('2d');
ctx.imageSmoothingEnabled= true;
canvas.width=640;
canvas.height=640;
canvas.style.padding=0;
canvas.style.margin=0;




const SQ=80;
const ROW=8;
const COL=8;
//divide the board into 8x8 and color each cell alternate
// coloring the chess cells


function drawSquare(x,y,color){
    ctx.fillStyle= color;
    ctx.fillRect(x*SQ,y*SQ, SQ, SQ);
}

let board=mboard;

for(let i=0; i<8; i++){
    for(let j=0; j<8;++j) drawSquare(j, i, colors[board[j][i][0]]);
}

let nyMoves =[-2,-2,1, 1,2, 2,-1,-1];
let nxMoves =[-1, 1,2,-2,1,-1,-2, 2];


let xDirs = [1, 1,  1,  0, 0, -1, -1, -1]
let yDirs = [-1, 1, 0, -1, 1, -1,  1,  0]

function restoreStatus(piece, x, y, opiece, ret, kx, ky){
    
    board[piece.y][piece.x][1]= piece;
    if(opiece!= null){
        board[opiece.y][opiece.x][1]= opiece;
    }else{
        board[y][x][1]= EMPTY;
    }

    if(piece.piece.name.endsWith('k')){
        board[ky][kx][1].x =kx; board[ky][kx][1].y= ky;
    }
    return ret;
}


function inCheck(king, x, y, xpiece){
    let this_king= king;
    if(selectedPiece== EMPTY) return false;
    // if after doing this move is King in check then we can't do this move

    ///check the current col, current row, diagonal 1, 2 and for knights see if the piece is 
    // attacking
    // rook, queen will attack the rows and cols
    // col both up and down
    
    // check down
    
    let p= xpiece;
    let opiece= null;
    if(board[y][x][1] != EMPTY) opiece= board[y][x][1];
    board[y][x][1]= xpiece;
    let kx= this_king.x; let ky= this_king.y;
    if(xpiece.piece.name.endsWith('k')) {
        this_king= xpiece;
        this_king.x =x; this_king.y =y;
    }
    board[p.y][p.x][1]= EMPTY;

    if(xpiece.piece.name.endsWith('k')) this_king= xpiece;
    
    // check for king in 8 surrounding points
    for(let i=0; i< xDirs.length; ++i){
        let x1= this_king.x + xDirs[i]; let y1= this_king.y + xDirs[i];
        if(y1>=0 && y1<ROW && x1>=0 && x1<COL){
            let piece= board[y1][x1][1];
            if(piece != EMPTY){
                if(!this_king.isSameType(x, y) && piece.piece.name.endsWith('k')) return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
        }

    }


    for(let y1= this_king.y + 1 ; y1< ROW ; y1++){
        if(board[y1][this_king.x][1] != EMPTY){
            // check if this piece is of other type
            if(!this_king.isSameType(this_king.x, y1)) {
                let piece= board[y1][this_king.x][1].piece.name[1];
                if(piece=='r' || piece =='q') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break;
        }
    }
    // check up

    for(let y1= this_king.y -1; y1>=0 ; y1--){
        if(board[y1][this_king.x][1] != EMPTY) {
            if(!this_king.isSameType(this_king.x, y1)) {
                let piece= board[y1][this_king.x][1].piece.name[1];
                if(piece=='r' || piece =='q') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }
    }

    // check right

    for(let x1= this_king.x+1 ; x1< COL ; x1++){
        if(board[this_king.y][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, this_king.y)) {
                let piece= board[this_king.y][x1][1].piece.name[1];
                if(piece=='r' || piece =='q') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }   
    }

    // check left
    for(let x1= this_king.x-1 ; x1>=0 ; x1--){
        if(board[this_king.y][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, this_king.y)) {
                let piece= board[this_king.y][x1][1].piece.name[1];
                
                if(piece =='r' || piece =='q') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }   
    }

    // pawn, queen, bishop will threaten the diagonals
    // check diag1 below
    // know piece type too
    for(let x1= this_king.x+1 , y1= this_king.y+1 ; x1<COL && y1<ROW ; x1++, y1++){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                
                if(piece =='p' && this_king.piece.name.startsWith('b') && x1== this_king.x+1 && y1== this_king.y+1)
                  return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
                if(piece =='q' || piece =='b') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }  
    }

    // check diag1 above

    for(let x1= this_king.x+1 , y1= this_king.y-1 ; x1<COL && y1>0 ; x1++, y1--){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                
                if(piece =='p' && this_king.piece.name.startsWith('w') && x1== this_king.x+1 && y1== this_king.y-1) 
                 return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
                if(piece =='q' || piece =='b') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }  
    }

    // check diag2 above

    for(let x1= this_king.x-1 , y1= this_king.y-1 ; x1>0 && y1>0 ; x1--, y1--){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                
                if(piece =='p' && this_king.piece.name.startsWith('w') && x1== this_king.x-1 && y1== this_king.y-1) 
                 return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
                if(piece =='q' || piece =='b') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }  
    }
    
    //check diag2 below

    for(let x1= this_king.x-1 , y1= this_king.y+1 ; x1>0 && y1<ROW ; x1--, y1++){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                 
                if(piece =='p' && this_king.piece.name.startsWith('b') && x1== this_king.x-1 && y1== this_king.y+1)
                  return restoreStatus(xpiece, x, y, opiece, true, kx, ky);
                if(piece =='q' || piece =='b') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
            }
            else break; // sameType elem is breaking the file
        }  
    }

    
    //knight check is simpler just check if any present in nMoves
    for(let i =0; i< nxMoves.length ;++i){
        let x1= this_king.x+nxMoves[i] ;
        let y1= this_king.y+nyMoves[i];
        if(x1>=0 && x1<COL && y1>=0 && y1<ROW){
            if(board[y1][x1][1] != EMPTY){
                if(!this_king.isSameType(x1, y1)){
                    let piece= board[y1][x1][1].piece.name[1];
                    if(piece =='n') return restoreStatus(xpiece,x, y, opiece, true, kx, ky);
                }
            }
        }
        // have to check all possible no file breaking here
    }
    return restoreStatus(xpiece, x, y,opiece, false, kx, ky);
}

function softCheck(this_king){
    // you can't castle if you are in check , this function doesn't need x, y, xpiece 

    for(let y1= this_king.y + 1 ; y1< ROW ; y1++){
        if(board[y1][this_king.x][1] != EMPTY){
            // check if this piece is of other type
            if(!this_king.isSameType(this_king.x, y1)) {
                let piece= board[y1][this_king.x][1].piece.name[1];
                if(piece == 'k' && y1==this_king.y+1) return true;
                if(piece=='r' || piece =='q') return true;
            }
            else break;
        }
    }
    // check up

    for(let y1= this_king.y -1; y1>=0 ; y1--){
        if(board[y1][this_king.x][1] != EMPTY) {
            if(!this_king.isSameType(this_king.x, y1)) {
                
                let piece= board[y1][this_king.x][1].piece.name[1];
                if(piece == 'k' && y1==this_king.y-1) return true;
                if(piece=='r' || piece =='q') return true;
            }
            else break; // sameType elem is breaking the file
        }
    }

    // check right

    for(let x1= this_king.x+1 ; x1< COL ; x1++){
        if(board[this_king.y][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, this_king.y)) {
                let piece= board[this_king.y][x1][1].piece.name[1];
                if(piece == 'k' && x1==this_king.x+1) return true; 
                if(piece=='r' || piece =='q') return true;
            }
            else break; // sameType elem is breaking the file
        }   
    }

    // check left
    for(let x1= this_king.x-1 ; x1>=0 ; x1--){
        if(board[this_king.y][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, this_king.y)) {
                let piece= board[this_king.y][x1][1].piece.name[1];
                if(piece == 'k' && x1==this_king.x-1) return true;
                if(piece=='r' || piece =='q') return true;
            }
            else break; // sameType elem is breaking the file
        }   
    }

    // pawn, queen, bishop will threaten the diagonals
    // check diag1 below
    // know piece type too
    for(let x1= this_king.x+1 , y1= this_king.y+1 ; x1<COL && y1<ROW ; x1++, y1++){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                if(piece == 'k' && y1==this_king.y+1 && x1== this_king.x+1) return true;
                if(piece =='p' && this_king.piece.name.startsWith('b') && x1== this_king.x+1 && y1== this_king.y+1)  return true;
                if(piece =='q' || piece =='b') return true;
            }
            else break; // sameType elem is breaking the file
        }  
    }

    // check diag1 above

    for(let x1= this_king.x+1 , y1= this_king.y-1 ; x1<COL && y1>0 ; x1++, y1--){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                if(piece == 'k' && y1==this_king.y-1 && x1== this_king.x+1) return true;
                if(piece =='p' && this_king.piece.name.startsWith('w') && x1== this_king.x+1 && y1== this_king.y-1)  return true;
                if(piece =='q' || piece =='b') return true;
            }
            else break; // sameType elem is breaking the file
        }  
    }

    // check diag2 above

    for(let x1= this_king.x-1 , y1= this_king.y-1 ; x1>0 && y1>0 ; x1--, y1--){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                if(piece == 'k' && y1==this_king.y-1 && x1== this_king.x-1) return true;
                if(piece =='p' && this_king.piece.name.startsWith('w') && x1== this_king.x-1 && y1== this_king.y-1)  return true;
                if(piece =='q' || piece =='b') return true;
            }
            else break; // sameType elem is breaking the file
        }  
    }
    
    //check diag2 below

    for(let x1= this_king.x-1 , y1= this_king.y+1 ; x1>0 && y1<ROW ; x1--, y1++){
        if(board[y1][x1][1] != EMPTY) {
            if(!this_king.isSameType(x1, y1)) {
                let piece= board[y1][x1][1].piece.name[1];
                if(piece == 'k' && y1==this_king.y+1 && x1== this_king.x-1) return true;
                if(piece =='p' && this_king.piece.name.startsWith('b') && x1== this_king.x+1 && y1== this_king.y+1)  return true;
                if(piece =='q' || piece =='b') return true;
            }
            else break; // sameType elem is breaking the file
        }  
    }

    
    //knight check is simpler just check if any present in nMoves
    for(let i =0; i< nxMoves.length ;++i){
        let x1= this_king.x+nxMoves[i] ; 
        let y1= this_king.y+nyMoves[i];
        if(x1>=0 && x1<COL && y1>=0 && y1<ROW){
            if(board[y1][x1][1] != EMPTY){
                if(!this_king.isSameType(x1, y1)){
                    let piece= board[y1][x1][1].piece.name[1];
                    if(piece =='n') return true;
                }
            }
        }
        // have to check all possible no file breaking here
    }
    return false;
}



function enPassant(x, y){
    // selectedPiece is already available
    
    if(!selectedPiece.piece.name.endsWith('p')) return false;

    if(currPlayer ==1){
        // white's turn
        let pawn= board[y+1][x][1];
        if(pawn.piece.name[1] != 'p') return false;
        else if(pawn.doubleMove==0) return false;
        
        else {
            capturedPiece= board[y+1][x][1];
            return true;
        }
    }else{
        let pawn= board[y-1][x][1];
        if(pawn.piece.name[1] != 'p') return false; // filtered out 
        else if(pawn.doubleMove == 0) return false;
        else {
            capturedPiece= board[y-1][x][1];
            return true;
        }
    }
}

function swapPieces(){

}


function castelling(x, y){
    if(softCheck(Klist[currPlayer])) return false; // can't castle when already in check
    // can castle only when the king and the rook in concern haven't moved
    // if it is white King
    // implement the file empty because it may not castle if it is not
    if(selectedPiece.piece.name.endsWith('k')){
        let sx= selectedPiece.x;
        let sy= selectedPiece.y;
        if(!selectedPiece.canCastle) return false;
        // determing either o-o or o-o-o
        
        if((x == sx +2 && board[y][x+1][1].canCastle )){
            for(let xx= sx+1 ; xx<=x ;++xx) if(board[y][xx][1] != EMPTY) return false;

            // have to castle
            board[y][x+1][1].canCastle= false;
            // clear the old king's location
            ctx.clearRect(sx*SQ, sy*SQ, SQ, SQ);
            ctx.fillStyle= colors[board[sx][sy][0]];
            ctx.fillRect(sx*SQ, sy*SQ, SQ, SQ);
            //DONE

            //clear old rook's position
            ctx.clearRect((x+1)*SQ , y*SQ, SQ, SQ);
            ctx.fillStyle = colors[board[y][x+1][0]];
            ctx.fillRect((x+1)*SQ, y*SQ, SQ, SQ);
            // done

            // set image on x,y to be of the selected king and update it's coordinates
            ctx.clearRect(x*SQ, y*SQ, SQ, SQ);
            ctx.fillStyle = colors[board[y][x][0]];
            ctx.fillRect(x*SQ, y*SQ, SQ,SQ);
            selectedPiece.canCastle= false;
            
            ctx.drawImage(selectedPiece.piece.img, x*SQ+15, y*SQ+15, 50,50);
            board[sy][sx][1]= EMPTY; board[y][x][1]= selectedPiece;
            board[y][x][1].x = x; board[y][x][1].y = y;
            ctx.clearRect((x+1)*SQ, y*SQ, SQ,SQ);
            ctx.fillStyle = colors[board[y][x+1][0]];
            ctx.fillRect((x+1)*SQ, y*SQ, SQ, SQ);
            
            ctx.drawImage(board[y][x+1][1].piece.img, (x-1)*SQ+15 , y*SQ+15, 50 ,50);
            board[y][x-1][1]=board[y][x+1][1]; board[y][x-1][1].x = x-1; 
            board[y][x+1][1]= EMPTY;

        }else if((x== sx -2 && board[y][x-2][1].canCastle)){
            for(let xx= sx-1 ; xx>=x ;xx--) if(board[y][xx][1] != EMPTY) return false;

            // have to castle
            board[y][x-2][1].canCastle= false;

            ctx.clearRect(sx*SQ, sy*SQ, SQ, SQ);
            ctx.fillStyle= colors[board[sx][sy][0]];
            ctx.fillRect(sx*SQ, sy*SQ, SQ,SQ);
            //DONE

            //clear old rook's position
            ctx.clearRect((x-2)*SQ , y*SQ, SQ,SQ);
            ctx.fillStyle = colors[board[y][x-2][0]];
            ctx.fillRect((x-2)*SQ, y*SQ, SQ, SQ);
            // done

            // set image on x,y to be of the selected king and update it's coordinates
            ctx.clearRect(x*SQ, y*SQ, SQ, SQ);
            ctx.fillStyle = colors[board[y][x][0]];
            ctx.fillRect(x*SQ, y*SQ, SQ,SQ);
            selectedPiece.canCastle= false;
            ctx.drawImage(selectedPiece.piece.img,x*SQ+15, y*SQ+15, 50,50);
            board[sy][sx][1]= EMPTY; board[y][x][1]= selectedPiece;
            board[y][x][1].x = x; board[y][x][1].y = y;

            ctx.clearRect(x*SQ+SQ, y*SQ, SQ, SQ);
            ctx.fillStyle = colors[board[y][x+1][0]];
            ctx.fillRect(x*SQ+SQ, y*SQ, SQ, SQ);
            ctx.drawImage(board[y][x-2][1].piece.img, (x+1)*SQ+15 , y*SQ+15, 50 ,50);
            board[y][x+1][1]=board[y][x-2][1]; board[y][x+1][1].x = x+1;
            board[y][x-2][1]= EMPTY;
            
        }

        

        if(board[y][x][1].piece.name == 'wk'){
            wKing= selectedPiece;
        }else if(board[y][x][1].piece.name == 'bk'){
            bKing= selectedPiece;
        }

        return true;
    } 
    else return false; // no other piece can move in this way
}


function pawnMove(piece, yy, xx){
    // WIll handle EN passant later
    // it is a special pawn move
    // it can capture a pawn immediately after that pawn has made two steps, i.e. it gets unlocked only after that
    // how to handle it
    // if on exact left and exact right is a pawn that made 2step stride
    //we can treat that pawn 
    if(piece.x== xx){ // same column
        if(piece.firstMove==0){
            if(Math.abs(yy- piece.y) ==2) piece.doubleMove++;
            else piece.doubleMove=0;
            piece.firstMove++;
            return (piece.piece.name.startsWith('w') ? (piece.y-yy <=2 && piece.y-yy >0 )  : (yy- piece.y <=2 && yy-piece.y >0 )) && board[yy][xx][1]=== EMPTY;
        }
        else return (piece.piece.name.startsWith('w') ? piece.y-yy==1 : yy-piece.y==1) && board[yy][xx][1] === EMPTY;
    }else{
        // can attack the top right diag1 top left diag1 to single elem
           
            if(piece.firstMove==0){
                piece.firstMove++;
            }
            if(board[yy][xx][1] == EMPTY) return false;
            
            if(piece.isSameType(xx, yy)) return false;
            // !is SameType and is not empty
           
            if(piece.piece.name.startsWith('w') ){
               piece.doubleMove=0;
            return yy-piece.y ==-1 && Math.abs(xx- piece.x) ==1;
           }else{
               piece.doubleMove=0;
            return yy-piece.y ==1 && Math.abs(xx- piece.x) ==1;
           }
            
    }
}

function drawBoard(){
    for(let y=0; y< ROW ;y++){
        for(let x=0; x< COL ;x++){
            if(board[y][x][1] != ""){
                board[y][x][1].draw();
            }
        }
    }
}
drawBoard();

function modClearRect(x, y){
    // clear left rectangle
    let color = colors[board[y][x][0]];
    ctx.fillStyle= color;
    ctx.clearRect(x*SQ, y*SQ, SQ, SQ);
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
    ctx.drawImage(board[y][x][1].piece.img, x*SQ+15, y*SQ+15, 50, 50);
    //fill bottom rectangle
}

function highlight(x, y){
    ctx.strokeStyle = colors[board[y][x][0]==0 ? 1: 0];
    ctx.beginPath();
    ctx.ellipse(x*SQ+SQ/2, y*SQ+SQ/2, 40, 40, 0, 0, 2*Math.PI);
    ctx.stroke();
}

// always track the kings as for checking for check
let bKing= board[0][4][1];
let wKing= board[7][4][1];

let Klist= {1:wKing, 0: bKing};


let selectedPiece=EMPTY;

const pList={1:'w',0:'b'};
let currPlayer= 1;

let moveOn=0;
let prev_x, prev_y;
ctx.lineWidth= 3;

let moves =[] ;
let moveCount=-1;
// standard board notation
let capturedPiece=null;

let diff= false;

canvas.addEventListener('mousedown', (ev)=>{
    canvas.style.cursor  = 'pointer';
   let x= Math.floor((ev.x-canvas.offsetLeft)/SQ);
   let y= Math.floor((ev.y- canvas.offsetTop)/SQ);

    if(selectedPiece == EMPTY && moveOn ==0 && board[y][x][1] !=EMPTY){
        if(board[y][x][1].piece.name.startsWith(pList[currPlayer])) {
            selectedPiece= board[y][x][1]; 
            prev_x= x; prev_y=y;
            highlight(x, y);
            moveOn++;
        }
        
    }else if(selectedPiece!= EMPTY && moveOn==1){
        if(moveOn ==1 && board[y][x][1]!=EMPTY && board[y][x][1].piece.name.startsWith(pList[currPlayer])){
            modClearRect(prev_x, prev_y);
            highlight(x, y);
            prev_x= x; prev_y=y;
            selectedPiece= board[y][x][1];
        }else if(moveOn ==1 && board[y][x][1] == EMPTY){
            if(selectedPiece.move(x, y, colors[board[y][x][0]])){
                moves.push(new Move(selectedPiece, prev_x, prev_y, x, y ,capturedPiece)); // empty square move
                if(capturedPiece) scoreEm(capturedPiece);
                moveOn=0; selectedPiece=EMPTY;
                currPlayer = (currPlayer == 1) ? 0: 1;
                capturedPiece=null;
            }
        }else if(moveOn ==1 && board[y][x][1] !=EMPTY && board[y][x][1].piece.name.startsWith(pList[currPlayer == 1 ? 0 : 1]) ){
                capturedPiece= board[y][x][1];
            if(selectedPiece.move(x, y, colors[board[y][x][0]])){
                moves.push(new Move(selectedPiece, prev_x, prev_y, x, y , capturedPiece));
                if(capturedPiece) scoreEm(capturedPiece);
                moveOn=0; selectedPiece=EMPTY;
                currPlayer = (currPlayer == 1) ? 0: 1;
                capturedPiece=null;
            }
        }
    }
    else{
        console.log('wtf');
    }
});


const la= document.getElementById('lu');
const ra= document.getElementById('ru');

let movCount= moves.length-1; // that is the index of the last move
// depending on what we seek we can go anywhere 
// if moveCount is same as move.length-1 we can't get ahead
// it may happen that after undoing we did a new move , the way to encounter that is
// when pressed these buttons once the next move is different that is moves[-1]!= moves[-2], we need to splice this -2 one
// or we can implement a move tree that will go down different path now 
la.addEventListener('click', ()=>{
    // undo last move
    if(moves.length ==0) return; // can't do anything about it
    if(moves.length%2 !=0 ) return ; // it was white's turn  
    undoLast(moves[moves.length-1]);
    BlackPoints -= 50;
    moves.pop();
    currPlayer =0; // black's turn again

});

ra.addEventListener('click', ()=>{
    // redo last move if can 
    if(moves.length ==0) return; // can't do anything about it
    if(moves.length%2 ==0 ) return ; // it was black's turn  
    undoLast(moves[moves.length-1]);
    WhitePoints -=50;
    moves.pop();
    currPlayer =1; // white's turn again
});
//900