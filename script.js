var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
var ball;
var paddle;
var lives = 3;
var score = 0;
var livesText;
var scoreText;
var gameOverText;
var winText;
var restartButton;
var brickInfo = {
    width: 50,
    height: 20,
    count: {
        row: 4,
        col: 12
    },
    offset: {
        top: 90,
        left: 60
    },
    padding: 10
};

var scene;

function create() {
    scene = this;

    // Set black background
    scene.cameras.main.setBackgroundColor('#000000');

    // Paddle and Ball with new colors
    paddle = scene.add.rectangle(400, 570, 140, 10, 0x00FF00);  // Neon green paddle
    ball = scene.add.circle(400, 300, 10, 0xFFFFFF);  // White ball
    lava = scene.add.rectangle(0, 600, 200000, 10, 0xFF0000);  // Red lava

    // Stylized text
    scoreText = scene.add.text(16, 16, "Score: " + score, { fontSize: '32px', fill: '#00FF00', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 3 });
    livesText = scene.add.text(630, 16, "Lives: " + lives, { fontSize: '32px', fill: '#00FF00', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 3 });
    gameOverText = scene.add.text(400, 300, "", { fontSize: '64px', fill: '#FF0000', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);
    winText = scene.add.text(400, 300, "", { fontSize: '64px', fill: '#00FF00', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);

    restartButton = scene.add.text(400, 400, "", { fontSize: '32px', fill: '#FFFFFF', fontFamily: 'Arial', backgroundColor: '#000000' }).setOrigin(0.5).setInteractive();
    restartButton.on('pointerdown', restartGame);

    scene.physics.add.existing(ball);
    scene.physics.add.existing(paddle);
    scene.physics.add.existing(lava);

    ball.body.velocity.x = 250;
    ball.body.velocity.y = 250;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.y = 1;
    ball.body.bounce.x = 1;

    paddle.body.immovable = true;
    lava.body.immovable = true;

    scene.physics.add.collider(paddle, ball, bounceOffPaddle);
    createBricks();

    scene.physics.add.collider(ball, lava, hitLava);
    scene.input.on("pointermove", function (pointer) {
        paddle.setPosition(pointer.x, paddle.y);
    });
}

function update() {
    if (lives <= 0) {
        gameOver();
    }
    if (score == brickInfo.count.row * brickInfo.count.col) {
        win();
    }
}

function bounceOffPaddle() {
    ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}

function createBricks() {
    var colors = [0xFF00FF, 0x00FFFF, 0xFFFF00, 0xFF0000]; // Neon magenta, cyan, yellow, and red
    for (c = 0; c < brickInfo.count.col; c++) {
        for (r = 0; r < brickInfo.count.row; r++) {
            var brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            var brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            manage(scene.physics.add.existing(scene.add.rectangle(brickX, brickY, 50, 20, colors[r])));
        }
    }
}

function manage(brick) {
    brick.body.immovable = true;
    scene.physics.add.collider(ball, brick, function () {
        ballHitBrick(brick);
    });
}

function ballHitBrick(brick) {
    brick.destroy();
    score++;
    scoreText.setText("Score: " + score);
}

function hitLava() {
    if (lives > 0) {
        lives--;
        livesText.setText("Lives: " + lives);
        if (lives <= 0) {
            gameOver();
        }
    }
}

function gameOver() {
    ball.body.velocity.x = 0;
    ball.body.velocity.y = 0;
    gameOverText.setText("Game Over");
    restartButton.setText("Restart Game");
}

function win() {
    ball.body.velocity.x = 0;
    ball.body.velocity.y = 0;
    winText.setText("You Win!");
    restartButton.setText("Play Again");
}

function restartGame() {
    // Reset game variables
    lives = 3;
    score = 0;

    // Reset text
    livesText.setText("Lives: " + lives);
    scoreText.setText("Score: " + score);
    gameOverText.setText("");
    winText.setText("");
    restartButton.setText("");

    // Reset ball and paddle positions
    ball.setPosition(400, 300);
    ball.body.velocity.x = 250;
    ball.body.velocity.y = 250;

    paddle.setPosition(400, 570);

    // Remove old bricks
    scene.physics.world.colliders.destroy();

    // Create new bricks
    createBricks();

    // Add new colliders
    scene.physics.add.collider(paddle, ball, bounceOffPaddle);
    scene.physics.add.collider(ball, lava, hitLava);
}

function setRandomBackground() {
    const images = [
        '/images/lighthouse.jpg',
        '/images/tree.jpg',
        '/images/tree2.jpg',
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    document.body.style.backgroundImage = `url(${images[randomIndex]})`;
}
window.onload = setRandomBackground;
