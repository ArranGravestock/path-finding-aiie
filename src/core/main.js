window.onload = function() {
    initialise();
}



world_width = 9;
world_height = 9;

// tile_width = window.innerWidth / world_width;
// tile_height = window.innerHeight / world_height;

tile_width = 32;
tile_height = 32

world = [[]]
current_path = []
path_start = [world_height, world_width]
path_end = []

player_position = {}
enemy_position = {}



function initialise() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d')

    if (ctx.getContext) {
        // canvas unsupported
    } else {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        
        createWorld();
    } 
}

function Node(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
}

function createWorld() {
    for (var x = 0; x < world_width; x++) {
        world[x] = []

        for (var y = 0; y < world_height; y++) {
            world[x][y] = new Node(x, y, 0);
        }
    }
    
    generateMaze();
    
    draw();
}



function generateMaze() {
    
    if (world.length == 9) {

        world[0][0].player = true;
        world[8][8].enemy = true;

        player_position = {x: 0,y: 0}
        enemy_position = {x: 8, y: 8}


        world[1][1].value = 1
        world[1][2].value = 1
        world[1][3].value = 1
        world[1][4].value = 0
        world[1][5].value = 1
        world[1][6].value = 0
        world[1][7].value = 1

        world[2][1].value = 0
        world[2][2].value = 0
        world[2][3].value = 1
        world[2][4].value = 0
        world[2][5].value = 1
        world[2][6].value = 0
        world[2][7].value = 1

        world[3][1].value = 1
        world[3][2].value = 0
        world[3][3].value = 1
        world[3][4].value = 0
        world[3][5].value = 0
        world[3][6].value = 0
        world[3][7].value = 1

        world[4][1].value = 1
        world[4][2].value = 0
        world[4][3].value = 1
        world[4][4].value = 1
        world[4][5].value = 1
        world[4][6].value = 0
        world[4][7].value = 1

        world[5][1].value = 1
        world[5][2].value = 0
        world[5][3].value = 0
        world[5][4].value = 0
        world[5][5].value = 1
        world[5][6].value = 0
        world[5][7].value = 1

        world[6][1].value = 1
        world[6][2].value = 0
        world[6][3].value = 1
        world[6][4].value = 0
        world[6][5].value = 1
        world[6][6].value = 0
        world[6][7].value = 0

        world[7][1].value = 1
        world[7][2].value = 0
        world[7][3].value = 1
        world[7][4].value = 0
        world[7][5].value = 1
        world[7][6].value = 1
        world[7][7].value = 1
    } else {
        generateRandomWalls(world_width, world_height);
    }
}

function generateRandomWalls(width, height) {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            if (Math.random() > 0.7) {
                world[x][y].value = 1;
            }
        }
    }

    for(var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            if (world[x][y].value == 1) {
                var neighbours = getNeighbours(world[x][y], 1);
                if (neighbours.length == 4) {
                    world[x][y].value = 0;
                }
            } 
			else if (world[x][y].value == 3) {
				var neighbours = getNeighbours(world[x][y], 0)
				if (neighbours.length == 4) {
					world[x+1][y].value = 1;
				}
			}
        }
    }

    function getNeighbours(node, max) {
        var neighbours = []
        var x = node.x;
        var y = node.y;
        var value = node.value;

        if (y-1 >= 0 && world[x][y-1].value < max) {
            neighbours.push(world[x][y-1])
        }
        if (y+1 < world_height && world[x][y+1].value < max) {
            neighbours.push(world[x][y+1])
        }
        if (x-1 >= 0 && world[x-1][y].value < max ) {
            neighbours.push(world[x-1][y])
        }
        if (x+1 < world_width && world[x+1][y].value < max) {
            neighbours.push(world[x+1][y])
        }
		
		//diagonals

            
        return neighbours
    }
}

function draw() {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < world_width; x++) {
        for (var y = 0; y < world_height; y++) {

            ctx.beginPath();
            ctx.rect(x * tile_width, y * tile_height, tile_width, tile_height)
            
            if (world[x][y].value == 1) {
                ctx.fillStyle = '#666'
                
            } else if (world[x][y].player == true) {
                world[x][y].player = false;
                player_position = {x: x,y: y}
                ctx.fillStyle = 'green'
            } else if (world[x][y].enemy == true) {
                world[x][y].enemy = false;
                enemy_position = {x: x,y: y}
                ctx.fillStyle = 'red'
            } else {
                ctx.fillStyle = 'white'
            }

            ctx.fill();
            
        }
    }

}

function reset_game() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    createWorld();
}

function update_player(direction) {

    var move_to = {x: player_position.x + direction.x, y: player_position.y + direction.y}

    var moves = calculateNextMove(world, enemy_position, player_position)
    update_enemy(moves[1]);

    if (enemy_position.x == move_to.x && enemy_position.y == move_to.y || enemy_position.x == player_position.x && enemy_position.y == player_position.y) {
        alert("game over! you died!");
        console.log(player_position)
        reset_game();
    } else {
        if (!(world[move_to.x] == undefined || world[move_to.x][move_to.y] == undefined)) {
    
            if ( world[move_to.x][move_to.y].value != 1 ) {
    
                ctx.beginPath();
                ctx.clearRect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height)
                ctx.fillStyle = 'white'
                ctx.rect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height);
                ctx.fill()
    
                player_position.x = move_to.x
                player_position.y = move_to.y
    
                ctx.beginPath();
                ctx.clearRect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height)
                ctx.fillStyle = 'green'
                ctx.rect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height);
                ctx.fill()
    
            } else {
                console.log("hit object");
            }
        } else {
            console.log("out of bounds");
        }
    }

}

function update_enemy(move_to) {

    //clear the previous square the enemy was on
    world[enemy_position.x][enemy_position.y].value = 0

    ctx.beginPath();
    ctx.clearRect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height)
    ctx.fillStyle = 'white'
    ctx.rect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height);
    ctx.fill()

    //update the new position of the enemy
    enemy_position.x = move_to.x
    enemy_position.y = move_to.y

    //update the world item
    world[enemy_position.x][enemy_position.y].value = 3

    ctx.beginPath();
    ctx.clearRect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height)
    ctx.fillStyle = 'red'
    ctx.rect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height);
    ctx.fill()
}


function calculateNextMove(world, path_start, path_end) {
    var world_width = world[0].length;
    var world_height = world.length;
    var world_size = world_width * world_height;

    var node;

    var walkable = 0;

    function ManhattanDistance(start, end) {
        return (Math.abs(start.x - end.x) + Math.abs(start.y - end.y));
    }
    
    function findPath (start, end, grid) {
        var start_x = start.x
        var start_y = start.y;
        var end_x = end.x;
        var end_y = end.y

        var closed_set = []
        var open_set = []
        
        var end_node = new Node(end_x, end_y, 0)
        
        var start_node = new Node(start_x, start_y, 0)
        start_node.g = 0;
        start_node.f = 0;

        open_set.push(start_node)

        while (open_set.length > 0) {
            //find the lowest f in the set
            var node = open_set[0]
            for (var tile in open_set) {
                node = (open_set[tile].f < node.f) ? open_set[tile] : node
            }
            
            //remove the lowest f from the openset
            for (var i = 0; i < open_set.length; i++) {
                if (node == open_set[i]) {
                    open_set.splice(i, 1);
                    break;
                }
            }

            //add the lowest node to the closedset
            closed_set.push(node)

            //if matching paths then target found
            if (node == world[end_x][end_y]) {
                var path = [[node.x, node.y]]
                while (node.parent) {
                    node = node.parent;
                    path.push({x: node.x, y: node.y})
                }
                return path.reverse();
            }

            //get the neighbours for the node
            neighbours = getNeighbours(node)

            //for every neighbour
            for (var i = 0; i < neighbours.length; i++) {
                neighbour = neighbours[i]

                if (closed_set.includes(neighbour)) {
                    continue;
                }

                //g = distance from starting node
                //h = distance from end node
                //f = g + h

                x = neighbour.x;
                y = neighbour.y;

                //could be wrong
                g = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : Math.SQRT2)

                if (!open_set.includes(neighbour) || g < neighbour.g) {
                    
                    neighbour.g = g;
                    neighbour.h = ManhattanDistance(neighbour, end_node)
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = node;

                    if (!open_set.includes(neighbour)) {
                        open_set.push(neighbour);
                    } else {
                        open_set[i] = neighbour;
                    }
                    
                }
            }
            
        }
        return [];
    }

    function getNeighbours(node) {
        var neighbours = []
        var x = node.x;
        var y = node.y;
        var value = node.value;

        if (y-1 >= 0 && world[x][y-1].value < 1) {
            neighbours.push(world[x][y-1])
        }
        if (y+1 < world_height && world[x][y+1].value < 1) {
            neighbours.push(world[x][y+1])
        }
        if (x-1 >= 0 && world[x-1][y].value < 1 ) {
            neighbours.push(world[x-1][y])
        }
        if (x+1 < world_width && world[x+1][y].value < 1) {
            neighbours.push(world[x+1][y])
        }
            
        return neighbours
    }

    return findPath (path_start, path_end, world)

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
            update_player({x:1, y:0});
            break;
        case binds.left:
            update_player({x:-1, y:0});
            break;
        case binds.up:
            update_player({x:0, y:-1});
            break;
        case binds.down:
            update_player({x:0, y:1});
            break;
    }
}