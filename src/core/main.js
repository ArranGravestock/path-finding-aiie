window.onload = function() {
    initialise();
}

player_x = 0;
player_y = 0;

direction_x = 0;
direction_y = 0;

player_size = 25;
speed = 5;

enemy_x = 150;
enemy_y = 150;

dead = false;

delay = 100; //ms

setInterval(function() {
    if (dead) {

        clearInterval(enemy);
        alert("you have died");
        resetGame();
    }
}, 10)


function resetGame() {
    dead = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);    

    player_x = 0;
    player_y = 0;

    direction_x = 0;
    direction_y = 0;

    enemy_x = canvas.width - player_size;
    enemy_y = canvas.height - player_size;

}

function initialise() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d')

    if (ctx.getContext) {
        // canvas unsupported
    } else {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        player_x = canvas.width / 2;
        player_y = canvas.height / 2;
        
        update_player();
        enemy = setInterval("update_enemy()", delay)

        resetGame();
    } 
}

function update_player() {
    requestAnimationFrame(update_player);

    if (player_x < player_size) {
        player_x = player_size;
    } else if (player_x > ctx.canvas.width - player_size) {
        player_x = ctx.canvas.width - player_size;
    }

    if (player_y < player_size) {
        player_y = player_size;
    } else if (player_y > ctx.canvas.height - player_size) {
        player_y = ctx.canvas.height - player_size;
    }

    if (direction_x == 1) { player_x += speed; }
    if (direction_x == -1) { player_x -= speed; } 
    if (direction_y == 1) { player_y -= speed; } 
    if (direction_y == -1) { player_y += speed; } 


    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath();
    ctx.arc(player_x, player_y, player_size, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.lineWidth = player_size * 0.1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    ctx.fill();
}

function calculateNextMove() {
    //
}

function update_enemy() {
    requestAnimationFrame(update_enemy);

    calculateNextMove();

    ctx.beginPath();
    ctx.arc(enemy_x, enemy_y, player_size, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.lineWidth = player_size * 0.1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    ctx.fill();

    if (enemy_x - player_x < player_size * 2 && enemy_x - player_x > - player_size * 2 && enemy_y - player_y < player_size * 2 && enemy_y - player_y > - player_size * 2) {

        if (!dead) {
            console.log(`died at : ${enemy_x - player_x}`);
            dead = true;
        }
    }
}

var config = 
{
    "player_binds": {
        "up": 87,
        "down": 83,
        "left": 65,
        "right": 68
    }
}
binds = config.player_binds;

onkeydown =  (e) => {
    key = e.keyCode;

    switch(key) {
        case binds.right: 
            direction_x = 1;
            break;
        case binds.left:
            direction_x = -1;
            break;
        case binds.up:
            direction_y = 1;
            break;
        case binds.down:
            direction_y = -1;
            break;
    }
},

onkeyup = (e) => {
    key = e.keyCode;

    switch(key) {
        case binds.right: case binds.left: 
            direction_x = 0;
            break;
        case binds.up: case binds.down:
            direction_y = 0;
            break;
    }
}