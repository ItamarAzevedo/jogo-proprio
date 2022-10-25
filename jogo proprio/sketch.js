var bife, bifeimg;
var dog, dogeat, dogrun, dogobs, dogfim, doginicio;
var floresta, florestaimg;
var pedra, pedraimg;
var arvore, arvoreimg;
var solo;
var bifegp, obstaclegp;
var score = 0
var gameState = PLAY
var PLAY = 1
var END = 0
var WIN = 2
var ground
var restart, restartimg

function preload() {
  dogeat = loadImage("dogEat.png")
  dogobs = loadImage("dogObs.png")
  dogfim = loadImage("dogFim.png")
  doginicio = loadImage("dogInicio.png")
  dogrun = loadAnimation("dogRun1.png", "dogRun2.png")
  bifeimg = loadImage("bife.png")
  gameOverimg = loadImage("fimdejogo.png")
  florestaimg = loadImage("floresta.png")
  pedraimg = loadImage("pedra.png")
  arvoreimg = loadImage("arvore.png")
  restartimg = loadImage("restart.png")
}

function setup() {
  createCanvas(1500, 700);

  dog = createSprite(1400, 645, 50, 50)
  dog.addImage("inicio", doginicio)
  dog.scale = 0.25
  dog.frameDelay = 15
  dog.debug = false
  dog.setCollider("circle", 0, 0, 200)

  dog.addImage("eat", dogeat)
  dog.addImage("obs", dogobs)
  dog.addImage("fim", dogfim)
  dog.addAnimation("correndo", dogrun)

  dog.changeImage("inicio")

  solo = createSprite(900, 700, 2500, 2)
  solo.visible = false

  obstaclegp = new Group()
  bifegp = new Group()

  ground = createSprite(800, 300, 1500, 20)
  ground.addImage(florestaimg)
  ground.scale = 3
  ground.depth = dog.depth - 1
  ground.x = width / 2

  gameOver = createSprite(width / 2, height / 2 + 20)
  gameOver.addImage(gameOverimg)
  gameOver.visible = false

  restart = createSprite(width / 2, height / 2 + 60)
  restart.addImage(restartimg)
  restart.visible = false
}

function draw() {
  background("skyBlue")
  dog.x = camera.position.x + 690

  if (gameState === PLAY) {
    ground.velocityX = 2
    if (ground.x > 950) {
      ground.x = 600
    }
    if (obstaclegp.isTouching(dog)) {
      gameState = END
    }
    if (bifegp.isTouching(dog)) {
      dog.changeImage("eat")
      score += 5
      bifegp.destroyEach()
    }
    movimento()
    obstacles()
    bifes()

  }

  if (gameState === END) {
    gameOver.x = camera.position.x
    restart.x = camera.position.x
    gameOver.visible = true
    restart.visible = true
    dog.velocityX = 0
    obstaclegp.setVelocityXEach(0)
    bifegp.setVelocityXEach(0)
    dog.changeAnimation("fim")
    obstaclegp.setLifetimeEach(-1)
    bifegp.setLifetimeEach(-1)
    if (mousePressedOver(restart)) {
      reset()
    }
  }

  if (gameState === WIN) {
    ground.velocityX = 0
    dog.velocityX = 0
    bifegp.setVelocityXEach(0)
    obstaclegp.setVelocityXEach(0)
    dog.changeAnimation("inicio")
    obstaclegp.setLifetimeEach(-1)
    bifegp.setLifetimeEach(-1)
  }


  if (score >= 100) {
    textSize(25)
    fill("white")
    stroke("black")
    text("Parabéns Você Ganhou", 70, 200)
  }

  textSize(25)
  fill("white")
  stroke("black")
  text("score: " + score, camera.position.x - 500, 35)

  dog.collide(solo)
  //coordenadas do mouse na tela 
  textSize(40)
  text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);
  drawSprites()
}

function obstacles() {
  if (frameCount % 250 === 0) {
    obstacle = createSprite(0, random(462, 655), 15, 100)
    obstacle.velocityX = 2
    obstacle.lifetime = width / obstacle.velocityX
    obstaclegp.add(obstacle)
    obstacle.debug = false
    obstacle.setCollider("rectangle", 0, 0, 250, 400)
    var sorteio = Math.round(random(1, 2))
    switch (sorteio) {
      case 1: obstacle.addImage(pedraimg);
        obstacle.scale = 0.3;
        break;
      case 2: obstacle.addImage(arvoreimg);
        obstacle.scale = 0.5;
        obstacle.y = 620;
        break;
    }
  }
}

function movimento() {
  if (keyIsDown(UP_ARROW) && this.dog.y > 450) {
    dog.y -= 5
    dog.changeAnimation("correndo")
    dog.frameDelay = 15
  }

  if (keyIsDown(DOWN_ARROW) && this.dog.y < 655) {
    dog.y += 5
    dog.changeAnimation("correndo")
    dog.frameDelay = 15
  }

  if (keyIsDown(LEFT_ARROW)) {
    dog.x -= 5
    dog.changeAnimation("correndo")
    dog.frameDelay = 15
  }

  if (keyIsDown(RIGHT_ARROW)) {
    dog.x += 5
    dog.changeAnimation("correndo")
    dog.frameDelay = 15
  }


  // camera.position.x=dog.position.x
}

function bifes() {
  if (frameCount % 450 === 0) {
    bife = createSprite(random(1500, 15), random(462, 655), 15, 100)
    bife.addImage(bifeimg)
    bife.scale = 0.2
    bife.lifetime = width / bife.velocityX
    bife.depth = dog.depth
    bifegp.add(bife)
  }
}

function reset() {
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false
  dog.changeAnimation("inicio")
  obstaclegp.destroyEach()
  bifegp.destroyEach()
  score = 0
}