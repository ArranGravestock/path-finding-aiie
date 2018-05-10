window.onload = function() {
    initialise();
}

tile_width = 64;
tile_height = 64;

world_width = 9;
world_height = 9;

world = [[]]
current_path = []
path_start = [world_height, world_width]
path_end = [0, 0]

player_position = []

player_start = []
enemy_start = []




// setInterval(function() {
//     if (dead) {

//         clearInterval(enemy);
//         alert("you have died");
//         resetGame();
//     }
// }, 10)


// function resetGame() {
//     dead = false;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);    

//     player_x = 0;
//     player_y = 0;

//     direction_x = 0;
//     direction_y = 0;

//     enemy_x = canvas.width - player_size;
//     enemy_y = canvas.height - player_size;

// }

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
        
        createWorld();

        // enemy = setInterval("update_enemy()", delay)

        //resetGame();
    } 
}

function createWorld() {
    for (var x = 0; x < world_width; x++) {
        world[x] = []

        for (var y = 0; y < world_height; y++) {
            world[x][y] = 0;
        }
    }
    
    generateMaze();
    
    draw();
}

function generateMaze() {
    player_start = [0, 0]
    if (world.length == 9) {

        world[0][0] = 2 //player start
        world[8][8] = 3 //enemy start

        world[1][1] = 1
        world[1][2] = 1
        world[1][3] = 1
        world[1][4] = 0
        world[1][5] = 1
        world[1][6] = 0
        world[1][7] = 1

        world[2][1] = 0
        world[2][2] = 0
        world[2][3] = 1
        world[2][4] = 0
        world[2][5] = 1
        world[2][6] = 0
        world[2][7] = 1

        world[3][1] = 1
        world[3][2] = 0
        world[3][3] = 1
        world[3][4] = 0
        world[3][5] = 0
        world[3][6] = 0
        world[3][7] = 1

        world[4][1] = 1
        world[4][2] = 0
        world[4][3] = 1
        world[4][4] = 1
        world[4][5] = 1
        world[4][6] = 0
        world[4][7] = 1

        world[5][1] = 1
        world[5][2] = 0
        world[5][3] = 0
        world[5][4] = 0
        world[5][5] = 1
        world[5][6] = 0
        world[5][7] = 1

        world[6][1] = 1
        world[6][2] = 0
        world[6][3] = 1
        world[6][4] = 0
        world[6][5] = 1
        world[6][6] = 0
        world[6][7] = 0

        world[7][1] = 1
        world[7][2] = 0
        world[7][3] = 1
        world[7][4] = 0
        world[7][5] = 1
        world[7][6] = 1
        world[7][7] = 1
    }
}

function generateRandom() {

}



function draw() {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < world_width; x++) {
        for (var y = 0; y < world_height; y++) {

            ctx.beginPath();
            ctx.rect(x * tile_width, y * tile_height, tile_width, tile_height)
            
            if (world[x][y] == 1) {
                ctx.fillStyle = '#666'
                
            } else if (world[x][y] == 2) {
                player_position = [x,y]
                ctx.fillStyle = 'green'
            } else if (world[x][y] == 3) {
                enemy_position = [x,y]
                ctx.fillStyle = 'red'
            } else {
                ctx.fillStyle = 'white'
            }

            ctx.fill();
            
        }
    }

}

function update_player(direction) {

    var move_to = [player_position[0] + direction[0], player_position[1] + direction[1]]

    if ( !(move_to[0] < 0 || move_to[1] < 0 || move_to[0] >= world_width || move_to[1] >= world_height) ) {

        if ( world[move_to[0]][move_to[1]] != 1 ) {

            if (world[move_to[0]][move_to[1]] == 3) {
                alert("game over! you died!");
                //reset game
            }

            world[move_to[0]][move_to[1]] = 0

            ctx.beginPath();
            ctx.clearRect(player_position[0] * tile_width, player_position[1] * tile_height, tile_width, tile_height)
            ctx.fillStyle = 'white'
            ctx.rect(player_position[0] * tile_width, player_position[1] * tile_height, tile_width, tile_height);
            ctx.fill()

            player_position = [move_to[0], move_to[1]]
            world[move_to[0]][move_to[1]] = 2

            ctx.beginPath();
            ctx.clearRect(player_position[0] * tile_width, player_position[1] * tile_height, tile_width, tile_height)
            ctx.fillStyle = 'green'
            ctx.rect(player_position[0] * tile_width, player_position[1] * tile_height, tile_width, tile_height);
            ctx.fill()

        } else {
            console.log("hit something");
        }
    } else {
        console.log("cannot move");
    }


   

}

function calculateNextMove() {
    //
}

// function update_enemy() {
//     requestAnimationFrame(update_enemy);

//     calculateNextMove();

//     ctx.beginPath();
//     ctx.arc(enemy_x, enemy_y, player_size, 0, 2 * Math.PI);
//     ctx.fillStyle = 'red';
//     ctx.lineWidth = player_size * 0.1;
//     ctx.strokeStyle = '#003300';
//     ctx.stroke();
//     ctx.fill();

//     if (enemy_x - player_x < player_size * 2 && enemy_x - player_x > - player_size * 2 && enemy_y - player_y < player_size * 2 && enemy_y - player_y > - player_size * 2) {

//         if (!dead) {
//             console.log(`died at : ${enemy_x - player_x}`);
//             dead = true;
//         }
//     }
// }

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
            update_player([1,0]);
            break;
        case binds.left:
            update_player([-1,0]);
            break;
        case binds.up:
            update_player([0,-1]);
            break;
        case binds.down:
            update_player([0, 1]);
            break;
    }
}