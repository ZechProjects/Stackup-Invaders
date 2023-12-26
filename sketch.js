let alienImage;
let invaders;
let shooterImage;
let player;
let allDebris = [];
let gameOver = false;
let canvas;
let canvasEl;
let loading = 10;
let loadingPlus = true;
let resumeButton;
let upgradedShooterImage;
let upgradedShooter2Image;
let asteroidImg;

//Scrolling Background
let bgImg;
let bgImgArtifact;
let bgImgArtifact1;
let bgImgArtifact2;
let bgImgArtifact3;
let bgImgY1 = 0;
let bgImgY2;
let bgImgArtifactY = 0;
let bgScrollingSpeed = 1;
let bgArtifactScrollingSpeed = 2;

//Audio
let bgm;
let bgmStarted = false;
let bgmDefeat;
let bgmVictory;
let sfxPlayerShot1;
let sfxPlayerShot2;
let sfxEnemyShot;
let sfxDestroyed;
let sfxHit;

const NUM_DEBRIS = 5; // number of space debris

function preload() {
    alienImage = loadImage("media/img/invader_bomber1.png");
    shooterImage = loadImage('media/img/player_v1.png');
    upgradedShooterImage = loadImage('media/img/player_v2.png');
    upgradedShooter2Image = loadImage('media/img/player_v3.png');
    asteroidImg = loadImage('media/img/asteroid1.png');

    bgImg = loadImage("media/img/bg/stars.png");
    bgImgArtifact1 = loadImage("media/img/bg/nebula1.png");
    bgImgArtifact2 = loadImage("media/img/bg/nebula2.png");
    bgImgArtifact3 = loadImage("media/img/bg/nebula3.png");

    soundFormats('mp3', 'ogg', 'wav');
    bgm = loadSound('media/audio/bgm/bgm1');
    bgmDefeat = loadSound('media/audio/bgm/defeat');
    bgmVictory = loadSound('media/audio/bgm/victory');
    sfxPlayerShot1 = loadSound('media/audio/sfx/sfx_shot1.wav');
    sfxPlayerShot2 = loadSound('media/audio/sfx/sfx_shot2.wav');
    sfxEnemyShot = loadSound('media/audio/sfx/sfx_enemy_shot.wav');
    sfxDestroyed = loadSound('media/audio/sfx/sfx_blast.wav');
    sfxHit = loadSound('media/audio/sfx/sfx_hit.wav');
}

function setup() {
    console.log("Game Setup Called");

    canvasEl = document.getElementById('sketch-holder')
    canvas = createCanvas(canvasEl.offsetWidth, 400);
    canvas.style('display', 'block');
    canvas.parent('sketch-holder');
    invaders = new Invaders(alienImage, 4);
    player = new Player(shooterImage);

    // create the debris objects
    for (let i = 0; i < NUM_DEBRIS; i++) {
        if (allDebris.length < NUM_DEBRIS) {
            allDebris.push(new Debris());
        }
    }

    // Create the resume game button but hide it initially
    resumeButton = createButton('Resume Game');
    resumeButton.position(windowWidth / 2 - 50, height / 2 + 220);
    resumeButton.mousePressed(resumeGame);
    resumeButton.style('background-color', '#111111');
    resumeButton.style('color', '#ffffff');
    resumeButton.hide();

    bgImgY2 = height;

    bgImgArtifact = bgImgArtifact1;

    bgm.play();
}

function showGameOver() {
    background(0);
    gameOver = true;
    fill(255);
    let gameOverT = "GAME OVER! Click to continue. Your score was " + player.score;
    textSize(16);
    text(gameOverT, width / 2 - textWidth(gameOverT) / 2, height / 2);
}

function connectToStart() {
    background(100);
    fill(255);
    textSize(16);
    let startText1 = "Game will start after successful authentication";
    let startText2 = "Click on Connect passport";
    let textXpos1 = width / 2 - textWidth(startText1) / 2;
    let textXpos2 = width / 2 - textWidth(startText2) / 2;
    let textYpos = height / 2;

    if (window.isconnecting) {
        startText1 = "Connecting ...";
        textXpos1 = width / 2 - textWidth(startText1) / 2;
        if (loadingPlus === true && loading == 100) {
            loadingPlus = false;
        } else if (loading == 10 && loadingPlus === false) {
            loadingPlus = true;
        }
        if (loadingPlus) {
            loading++;
        } else {
            loading--;
        }
        fill(loading + 150);
    }

    text(startText1, textXpos1, textYpos);
    text(startText2, textXpos2, textYpos + 20);
}

function resumeGame() {
    bgm.loop(0, 1, 0.3);
    console.log('Resuming game, hiding resume button');
    player.resumeGame();
    resumeButton.hide();
    loop();
    let nft = document.getElementById("nft");
    nft.innerHTML = ""
}

function draw() {
    if (gameOver) {
        showGameOver();
    } else if (true || window?.userProfile?.email) {
        if (!player.gamePaused) {
            background(0);
            drawBG();
            player.update();
            updateDebrisAndCheckCollisions();
            invaders.update(player);
        }

        player.draw();
        player.drawInfo();
        invaders.draw();

        // Check if the game needs to be paused
        if (player.gamePaused && resumeButton.elt.style.display === 'none') {
            bgm.stop();
            console.log('Pausing game, showing resume button');
            noLoop();
            resumeButton.show();
        }

        if (player.lives == 0) {
            bgm.stop();
            bgmDefeat.play();
            gameOver = true;
        }
    } else {
        connectToStart();
    }

    // Update button visibility based on authentication status
    document.getElementById('btn-passport').hidden = window?.userProfile?.email;
    document.getElementById('btn-logout').hidden = !window?.userProfile?.email;

}

function mousePressed() {
    if (gameOver === true) {
        gameOver = false;
        setup();
    }
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW || keyCode == 88) {
        player.moveRight();
    } else if (keyCode === LEFT_ARROW || keyCode == 90) {
        player.moveLeft();
    } else if (keyCode === 32) {
        if (!bgmStarted) {
            bgmStarted = true;
            bgm.loop(0, 1, 0.3);
        }
        player.shoot();
    }

    if (keyCode === UP_ARROW) {
        player.moveUp()
    } else if (keyCode == DOWN_ARROW) {
        player.moveDown();
    }
}

function updateDebrisAndCheckCollisions() {
    for (let i = 0; i < allDebris.length; i++) {
        allDebris[i].update();
        allDebris[i].draw();

        if (allDebris[i].hasHitPlayer(player)) {
            allDebris.splice(i, 1);
            player.loseLife();
            break;
        }
    }
}

function windowResized() {
    resizeCanvas(canvasEl.offsetWidth, 400)
    background(0)
}

function drawBG() {
    image(bgImg, 0, bgImgY1, width, height);
    image(bgImg, 0, bgImgY2, width, height);
    image(bgImgArtifact, 0, bgImgArtifactY, width, height);

    bgImgY1 += bgScrollingSpeed;
    bgImgY2 += bgScrollingSpeed;
    bgImgArtifactY += bgArtifactScrollingSpeed;

    if (bgImgY1 > height) {
        bgImgY1 = -height;
    }
    if (bgImgY2 > height) {
        bgImgY2 = -height;
    }
    if (bgImgArtifactY > height) {
        bgImgArtifactY = -height;

        var randval = Math.random() * 3;
        if (randval >= 2) {
            bgImgArtifact = bgImgArtifact1;
        } else if (randval >= 1) {
            bgImgArtifact = bgImgArtifact2;
        } else {
            bgImgArtifact = bgImgArtifact3;
        }

    }
}