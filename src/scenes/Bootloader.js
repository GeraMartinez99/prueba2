class Bootloader extends Phaser.Scene{
    
    constructor(){
        super({
            key: "Bootloader" //Nombre interno o clave de referencia
        });
        var estrellas;
    }
    init() {
        console.log("Soy init");
    }
    preload() {
        this.load.path="./assets/";     //Rutas de todas las imagenes    
        this.load.image("yoshi","yoshi.png");   //alias y archivo
        this.load.image("yoshi_fondo",);    //sin nombre del archivo, se toma por defecto el nombre del alias
        this.load.image("drop","drop.png");
        this.load.image("escenario","escenario.png");  
        this.load.spritesheet("fantasmas","fantasmas.png",{frameWidth:126,frameHeight:130});
        this.load.image("pacman","pacman.png");
        this.load.image("reiniciar","reiniciar.png");
        this.load.audio("inicio","inicio.mp3");
        this.load.audio("perder","perder.mp3");
    }
    
    create(){
        //Cracioón de la constante que contiene todos los valores numericos de las teclas
        const eventos = Phaser.Input.Events;
        
        this.gano = false;
        this.drop = new Array(3);
        this.pacman = new Array(3);
        this.fantasma1 = new Array(5);
        this.inicio = this.sound.add("inicio",{loop: false});
        this.perder = this.sound.add("perder",{loop: true});
        this.inicio.play();
        
        this.fantasma2 = new Array(5);
        this.turno = 1;
        this.turnoFantasma = this.add.sprite(780,110,"fantasmas",0);
        this.turnoFantasma.setScale(.5);
        this.turnoFantasma2 = this.add.sprite(770,110,"fantasmas",2);
        this.turnoFantasma2.setScale(.5);
        this.turnoFantasma2.setVisible(0);
        var style2 = {
            font: "22px PacFont",
            fill: "yellow",
            align: "center"
           // backgroundColor:"white"
        };
        var style = {
            font: "32px PacFont",
            fill: "yellow",
            align: "center"
           // backgroundColor:"white"
        };
        this.textTurno = this.add.text(630,100,"Turno: ",style2);
        var text = this.add.text(305,35,"TIC TAC TOE",style);
        text.setOrigin(.5);
        this.anims.create({
            key:'fantasma_rojo',
            frames: this.anims.generateFrameNumbers('fantasmas',{
                frames: [0,4]
            }),
            repeat: -1,
            frameRate: 1
        });
               
        this.anims.create({
            key: "fantasma_azul",
            frames: this.anims.generateFrameNumbers('fantasmas',{
                frames: [2,3]
            }),
            repeat:-1,
            frameRate:1
        });
        for(var i = 0; i<5; i++){
            this.fantasma1[i] = this.add.sprite(700,250,"fantasmas").setInteractive();
            this.fantasma1[i].setOrigin(0.5);
            this.fantasma1[i].name = "rojo";
            this.input.setDraggable(this.fantasma1[i]);
            this.fantasma1[i].anims.play('fantasma_rojo');
            this.fantasma2[i] = this.add.sprite(680,380,'fantasmas').setInteractive(); 
            this.input.setDraggable(this.fantasma2[i]);
            this.fantasma2[i].setOrigin(.5);
            this.fantasma2[i].name = "azul";
            this.fantasma2[i].anims.play('fantasma_azul');
        }
        console.log(this.fantasma1[0]);
        
        for (var i = 0; i<3; i++){
            this.pacman[i] = this.add.image(200,200,"pacman");
            this.pacman[i].setScale(.3);
            this.pacman[i].setVisible(0);
        }
        //this.yoshi = this.add.image(100,100,"yoshi").setInteractive();
        
        //this.input.setDraggable(this.yoshi);
    
        for(var i=0;i<3;i++){
            this.drop[i] = new Array(3);
            for(var j=0;j<3;j++){
                this.drop[i][j] = this.add.image(130+(i*190),160+(j*190),'escenario').setInteractive();
                this.drop[i][j].setOrigin(.5);
                this.drop[i][j].setDepth(-1);
                this.drop[i][j].input.dropZone = true;
            }
        }

        this.input.on(eventos.DRAG_START,(pointer,obj,dragX,dragY)=>{
            obj.setScale(.9);
        });
        this.input.on(eventos.DRAG,(pointer,obj,dragX,dragY)=>{
            obj.x = dragX;
            obj.y = dragY;
        });
        this.input.on(eventos.DRAG_END,(pointer,obj,dropzone)=>{
            if(!dropzone){
                obj.x = obj.input.dragStartX;
                obj.y = obj.input.dragStartY;
            }
            obj.setScale(1);
        });
        this.input.on(eventos.DRAG_ENTER,(pointer,obj,dropzone)=>{
            dropzone.setTint(0xD5A6BD);
        });
        this.input.on(eventos.DRAG_LEAVE,(pointer,obj,dropzone)=>{
            dropzone.clearTint();
        });
        this.input.on(eventos.DROP,(pointer,obj,dropzone)=>{
            //console.log("fantasma",obj.name);
            if(this.turno==1){
                if(obj.name ==="rojo"){
                    obj.x = dropzone.x+20;
                    obj.y =dropzone.y;
                    this.turno = 2;
                    dropzone.input.dropZone =false;
                    dropzone.name = "rojo";
                    this.input.setDraggable(obj,false);
                    this.turnoFantasma.setVisible(false);
                    this.turnoFantasma2.setVisible(true);
                    this.compruebaRojo();
                }
                else {
                    obj.x = obj.input.dragStartX;
                    obj.y = obj.input.dragStartY;
                }
              
            }
            else{
                if(obj.name ==="azul"){
                    obj.x = dropzone.x;
                    obj.y =dropzone.y;
                    this.turno = 1;
                    dropzone.input.dropZone =false;
                    dropzone.name = "azul";
                    this.input.setDraggable(obj,false);
                    this.turnoFantasma.setVisible(true);
                    this.turnoFantasma2.setVisible(false);
                    this.compruebaAzul();
                }
                else{
                    obj.x = obj.input.dragStartX;
                    obj.y = obj.input.dragStartY;
                }
      
            }
           
            
        });
        this.tam = .1;
        this.rectangulo = this.add.rectangle(405,330,50,50,0x000000,.8);
        this.rectangulo.setVisible(0);
        this.reiniciar = this.add.image(700,600,"reiniciar").setInteractive({useHandCursor:true});
        this.reiniciar.setScale(.3);
        var style3 = {
            font: "60px PacFont",
            fill: "yellow",
            align: "center"
           // backgroundColor:"white"
        };
        this.texto = this.add.text(370,330,"YOU WIN",style3);
        this.texto.setOrigin(.5);
        this.texto.setVisible(0);
        this.texto2 = this.add.text(370,330,"GAME OVER",style3);
        this.texto2.setOrigin(.5);
        this.texto2.setVisible(0);
        this.reiniciar.on("pointerover",()=>{
            this.reiniciar.setScale(.4);
        });
        this.reiniciar.on("pointerout",()=>{
            this.reiniciar.setScale(.3);
        });
        this.reiniciar.on("pointerdown",()=>{
            this.scene.restart();
        });
   
    }
  
    empate(){
        var bandera = true;
        for(var i = 0; i<3; i++){
            for(var j = 0; j<3; j++){
                if(this.drop[i][j].input.dropZone==true){
                    bandera = false;
                }
            }
        }
    
        
        return bandera;
    }
    compruebaRojo(){
        var bandera = false;
        var cont = 0;
        //Condiciones para ganar
        if(this.drop[0][0].name=="rojo"&&this.drop[1][0].name=="rojo"&&this.drop[2][0].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][0].x;
            this.pacman[1].x = this.drop[1][0].x;
            this.pacman[2].x = this.drop[2][0].x;
            this.pacman[0].y = this.drop[0][0].y;
            this.pacman[1].y = this.drop[1][0].y;
            this.pacman[2].y = this.drop[2][0].y;
        }
        if(this.drop[0][1].name=="rojo"&&this.drop[1][1].name=="rojo"&&this.drop[2][1].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][1].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[2][1].x;
            this.pacman[0].y = this.drop[0][1].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[2][1].y;
        }
        if(this.drop[0][2].name=="rojo"&&this.drop[1][2].name=="rojo"&&this.drop[2][2].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][2].x;
            this.pacman[1].x = this.drop[1][2].x;
            this.pacman[2].x = this.drop[2][2].x;
            this.pacman[0].y = this.drop[0][2].y;
            this.pacman[1].y = this.drop[1][2].y;
            this.pacman[2].y = this.drop[2][2].y;
        }
        if(this.drop[0][0].name=="rojo"&&this.drop[0][1].name=="rojo"&&this.drop[0][2].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][0].x;
            this.pacman[1].x = this.drop[0][1].x;
            this.pacman[2].x = this.drop[0][2].x;
            this.pacman[0].y = this.drop[0][0].y;
            this.pacman[1].y = this.drop[0][1].y;
            this.pacman[2].y = this.drop[0][2].y;
        
        }
        if(this.drop[1][0].name=="rojo"&&this.drop[1][1].name=="rojo"&&this.drop[1][2].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[1][0].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[1][2].x;
            this.pacman[0].y = this.drop[1][0].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[1][2].y;
        }
        if(this.drop[2][0].name=="rojo"&&this.drop[2][1].name=="rojo"&&this.drop[2][2].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[2][0].x;
            this.pacman[1].x = this.drop[2][1].x;
            this.pacman[2].x = this.drop[2][2].x;
            this.pacman[0].y = this.drop[2][0].y;
            this.pacman[1].y = this.drop[2][1].y;
            this.pacman[2].y = this.drop[2][2].y;
        }
        if(this.drop[0][0].name=="rojo"&&this.drop[1][1].name=="rojo"&&this.drop[2][2].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][0].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[2][2].x;
            this.pacman[0].y = this.drop[0][0].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[2][2].y;
        
        }
        if(this.drop[2][0].name=="rojo"&&this.drop[1][1].name=="rojo"&&this.drop[0][2].name=="rojo"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[2][0].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[0][2].x;
            this.pacman[0].y = this.drop[2][0].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[0][2].y;
        }
        if(bandera){
            this.deshabilitarDrag();
            this.pacman[0].setVisible(1);
            this.pacman[1].setVisible(1);
            this.pacman[2].setVisible(1);
            this.gano = true;
            //this.rectangulo.setVisible(1);
        }
            
        
        
    }
    deshabilitarDrag(){
        for(var i = 0; i<5; i++){
            this.input.setDraggable(this.fantasma1[i],false);
            this.input.setDraggable(this.fantasma2[i],false);
        }
    }
    compruebaAzul(){

        var bandera = false;
        var cont = 0;
        if(this.drop[0][0].name=="azul"&&this.drop[1][0].name=="azul"&&this.drop[2][0].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][0].x;
            this.pacman[1].x = this.drop[1][0].x;
            this.pacman[2].x = this.drop[2][0].x;
            this.pacman[0].y = this.drop[0][0].y;
            this.pacman[1].y = this.drop[1][0].y;
            this.pacman[2].y = this.drop[2][0].y;
        
        }
        if(this.drop[0][1].name=="azul"&&this.drop[1][1].name=="azul"&&this.drop[2][1].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][1].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[2][1].x;
            this.pacman[0].y = this.drop[0][1].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[2][1].y;
        
        }
        if(this.drop[0][2].name=="azul"&&this.drop[1][2].name=="azul"&&this.drop[2][2].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][2].x;
            this.pacman[1].x = this.drop[1][2].x;
            this.pacman[2].x = this.drop[2][2].x;
            this.pacman[0].y = this.drop[0][2].y;
            this.pacman[1].y = this.drop[1][2].y;
            this.pacman[2].y = this.drop[2][2].y;
        
        }
        if(this.drop[0][0].name=="azul"&&this.drop[0][1].name=="azul"&&this.drop[0][2].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][0].x;
            this.pacman[1].x = this.drop[0][1].x;
            this.pacman[2].x = this.drop[0][2].x;
            this.pacman[0].y = this.drop[0][0].y;
            this.pacman[1].y = this.drop[0][1].y;
            this.pacman[2].y = this.drop[0][2].y;
        
        }
        if(this.drop[1][0].name=="azul"&&this.drop[1][1].name=="azul"&&this.drop[1][2].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[1][0].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[1][2].x;
            this.pacman[0].y = this.drop[1][0].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[1][2].y;
        
        }
        if(this.drop[2][0].name=="azul"&&this.drop[2][1].name=="azul"&&this.drop[2][2].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[2][0].x;
            this.pacman[1].x = this.drop[2][1].x;
            this.pacman[2].x = this.drop[2][2].x;
            this.pacman[0].y = this.drop[2][0].y;
            this.pacman[1].y = this.drop[2][1].y;
            this.pacman[2].y = this.drop[2][2].y;
        
        }
        
        if(this.drop[0][0].name==="azul"&&this.drop[1][1].name==="azul"&&this.drop[2][2].name==="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[0][0].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[2][2].x;
            this.pacman[0].y = this.drop[0][0].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[2][2].y;
        }
        if(this.drop[2][0].name=="azul"&&this.drop[1][1].name=="azul"&&this.drop[0][2].name=="azul"){
            bandera = true;
            console.log("Ya gano");
            this.pacman[0].x = this.drop[2][0].x;
            this.pacman[1].x = this.drop[1][1].x;
            this.pacman[2].x = this.drop[0][2].x;
            this.pacman[0].y = this.drop[2][0].y;
            this.pacman[1].y = this.drop[1][1].y;
            this.pacman[2].y = this.drop[0][2].y;
        }
        if(bandera){
            this.pacman[0].setVisible(1);
            this.pacman[1].setVisible(1);
            this.pacman[2].setVisible(1);
            this.deshabilitarDrag();
            this.gano = true;
        }
        

       
    }

    update(time,delta){
        //Esta función crea un ciclo infinito
        //this.perder.play();
         if(this.gano){
             this.rectangulo.setVisible(1);
             this.tam +=.3;
             this.rectangulo.setScale(this.tam);
             this.texto.setVisible(1);
            // this.perder.play();
         }
         if(this.empate()&& !this.gano){
            this.rectangulo.setVisible(1);
            this.tam +=.5;

            this.rectangulo.setScale(this.tam);
            this.texto2.setVisible(1);
            console.log(this.tam);
            if(this.tam==3.6)
            this.perder.play();
            if(this.tam>20){
                this.game.destroy();
            }
            
         }

    }
    

}
export default Bootloader;