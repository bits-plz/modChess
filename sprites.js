const img_folder="./assets/images/"

class Sprite{
    constructor(image_name){
        this.name= image_name;
        this.img_url="assets/images/"+image_name+".png";
        this.img= new Image();
        this.img.src= this.img_url;
        this.img.style.zIndex=2;
    }
}


const sprites ={
    bq:new Sprite('bq'),bk:new Sprite('bk'),bb:new Sprite('bb'),br:new Sprite('br'),bn:new Sprite('bn'),bp:new Sprite('bp'),
    wq:new Sprite('wq'),wk:new Sprite('wk'),wb:new Sprite('wb'),wr:new Sprite('wr'),wn:new Sprite('wn'),wp:new Sprite('wp'),
};

const sprite_arr=[[sprites.br, sprites.bn, sprites.bb, sprites.bq, sprites.bk], 
                 [sprites.wr, sprites.wn, sprites.wb, sprites.wq, sprites.wk] ];
