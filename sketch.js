var trex, trex_running, trex_collide, edges;
var groundImage,ground,groundInv;
var cloud,cloudImg
var Cacto,Cacto_img1,Cacto_img2,Cacto_img3,Cacto_img4,Cacto_img5,Cacto_img6
var cloudGp;
var cactoGp;
var gameOver,gameOver_Img;
var Restart,Restart_Img;
var Jump_sound;
var Die_sound;
var Checkpoint_sound;

var Recorde = 0;
var Score = 0;

var PLAY = 1;
var END = 0;
gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex3.png","trex4.png");
  trex_collide = loadAnimation("trex_collided.png");
  gameOver_Img = loadImage("gameOver.png");
  Restart_Img = loadImage("restart.png");
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  Cacto_img1 = loadImage("obstacle1.png");
  Cacto_img2 = loadImage("obstacle2.png");
  Cacto_img3 = loadImage("obstacle3.png");
  Cacto_img4 = loadImage("obstacle4.png");
  Cacto_img5 = loadImage("obstacle5.png");
  Cacto_img6 = loadImage("obstacle6.png");
  Jump_sound = loadSound("jump.mp3");
  Die_sound = loadSound("die.mp3");
  Checkpoint_sound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  
  //criando o trex
  trex = createSprite(width/10,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trex_collide);
  //trex.debug = true;
  //trex.setCollider("circle",0,0,40);
  trex.setCollider("rectangle",0,0,30,80,40)
  edges = createEdgeSprites();
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage (groundImage);
  groundInv = createSprite (width/2,height-10,width,10);
  cloudGp = new Group();
  cactoGp = new Group();
  gameOver = createSprite(width/2,height-100);
  gameOver.addImage (gameOver_Img);
  gameOver.scale = 0.7
  gameOver.visible = false;
  Restart = createSprite(width/2,height-50)
  Restart.addImage (Restart_Img);
  Restart.scale = 0.7;
  Restart.visible = false;

  groundInv.visible = false;
  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
}


function draw(){
  //definir a cor do plano de fundo 
  background("white");
  
  if (trex.isTouching (cactoGp)) {
    trex.changeAnimation("collide",trex_collide);
    //Die_sound.play();
    gameState = END; 
  }

  //registrando a posição y do trex
  console.log(trex.y)

  if (gameState === PLAY) {
    if(keyDown("space")||touches > 0 && trex.y > height-40 ){
      trex.velocityY = -10;
      Jump_sound.play(); 
      touches = [];
    }
    ground.velocityX = -(2+Score/200)
    if(ground.x < 200){
      ground.x = ground.width/2
    }
    Score = Math.round(frameCount/2);
    if(Score%100 === 0 && Score > 0){
       Checkpoint_sound.play();
    }
    
    spawnClouds();
    spawnCactos();
  }

  if (gameState === END) {
    ground.velocityX = 0
    cloudGp.setVelocityXEach (0);
    cactoGp.setVelocityXEach (0);
    cactoGp.setLifetimeEach (-1);
    cloudGp.setLifetimeEach (-1);
    Restart.visible = true;
    gameOver.visible = true;
    if(mousePressedOver(Restart)){
      gameState = PLAY
      Restart.visible = false;
      gameOver.visible = false;
      cactoGp.destroyEach();
      cloudGp.destroyEach();
      frameCount = 1;
      trex.changeAnimation("running", trex_running);
      ground.x = 300
    }
    if (Recorde < Score){
      Recorde = Score;

    }

  }
  text ("Pontuação: "+Score ,width-100,height-180);
  text ("Melhor Pontuação: "+Recorde, width-150, height-160)

  trex.velocityY = trex.velocityY + 0.5;

 //impedir que o trex caia
  trex.collide(groundInv);
  drawSprites();
}

function spawnClouds() {
  if (frameCount%95 === 0) {
    cloud = createSprite (width,2,30,30);
    cloud.velocityX = -(2+Score/200);
    cloud.addImage (cloudImg);
    cloud.y = random(height-198,height-100);
    cloud.depth = trex.depth-1;
    cloud.scale = random(0.5,1.5);
    cloud.lifetime = width/cloud.velocityX;
    cloudGp.add(cloud)
  }
}
function spawnCactos() {
  if (frameCount%125 === 0) {
    Cacto = createSprite (width,height-30,30,30);
    Cacto.velocityX = -(2+Score/200);
    var SortImageCac = Math.round (random(1,6))
    switch (SortImageCac) {
      case 1:
        Cacto.addImage(Cacto_img1);
        break;
      case 2:
        Cacto.addImage(Cacto_img2);
        break;
      case 3:
        Cacto.addImage(Cacto_img3);
        break;
      case 4:
        Cacto.addImage(Cacto_img4);
        break;
      case 5:
        Cacto.addImage(Cacto_img5);
        break;
      case 6:
        Cacto.addImage(Cacto_img6);
        break;
    }
    Cacto.depth = trex.depth-1;
    Cacto.scale = (0.4);
    Cacto.lifetime = width/Cacto.velocityX;
    cactoGp.add (Cacto);
 }
}