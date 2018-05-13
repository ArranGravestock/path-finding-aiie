"use strict"

window.onload = function() {
    initialise()
}

class Node {
    constructor(x, y, walkable, value) {
        this.x = x
        this.y = y
        this.value = value
        this.walkable = walkable;

    }

    getNeighbours() {
        let neighbours = []
        
        if (this.y-1 >= 0) {
            neighbours.push(world[this.x][this.y-1])
        }
        if (this.y+1 < world_height) {
            neighbours.push(world[this.x][this.y+1])
        }
        if (this.x-1 >= 0) {
            neighbours.push(world[this.x-1][this.y])
        }
        if (this.x+1 < world_width) {
            neighbours.push(world[this.x+1][this.y])
        }
        return neighbours;
    }
}

class Time {
    constructor(time) {
        this.time = time
    }
    update_time(time) {
        this.time = time
        this.redraw_time()
    }
    
    redraw_time() {
        ctx.clearRect(world_width * tile_width, 20, 300, 25)
        ctx.fillStyle = 'white'
        ctx.font = "20px Arial"
        ctx.fillText(`Path calculated in (${this.time})ms`, world_width * tile_width + 10, 40)
    }
    
}

class Score {
    constructor(score) {
        this.score = score;
    }

    update_score(points) {
        this.score += points
        this.redraw_score()
    }
    
    redraw_score() {
        ctx.clearRect(world_width * tile_width, 0, 100, 20)
        ctx.fillStyle = 'white'
        ctx.font = "20px Arial"
        ctx.fillText(this.score, world_width * tile_width + 10, 20)
    }
    
}

let canvas, ctx = false
const tile_width = 32
const tile_height = 32

const world_width = 25
const world_height = Math.round(window.innerHeight / tile_height)

	
		



let world = [[]]
let current_path = []
let path_start = [world_height, world_width]
let path_end = []

let player_position = {}
let enemy_position = {}

const enemy_interval = setInterval(update_enemy, 450)
let score = new Score(0)
let search_time = new Time(0);

function initialise() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    if (ctx.getContext) {
        // canvas unsupported
    } else {
        ctx.canvas.width  = window.innerWidth
        ctx.canvas.height = window.innerHeight
        
        createWorld()
    } 
}


function createWorld() {
    for (let x = 0; x < world_width; x++) {
        world[x] = []

        for (let y = 0; y < world_height; y++) {
            world[x][y] = new Node(x, y, true, 0.9)
            
        }
    }
    
    generateMaze()
    
    draw()
}



function generateMaze() {
    
    if (world.length == 9) {

        world[0][0].player = true
        world[8][8].enemy = true

        player_position = {x: 0,y: 0}
        enemy_position = {x: 8, y: 8}


        world[1][1].walkable = false
        world[1][2].walkable = false
        world[1][3].walkable = false

        world[1][4].coin = true
        world[1][4].coin = true

        world[1][5].walkable = false
        world[1][6].walkable = true
        world[1][7].walkable = false

        world[2][1].walkable = true
        world[2][2].walkable = true
        world[2][3].walkable = false
        world[2][4].walkable = true
        world[2][5].walkable = false
        world[2][6].walkable = true
        world[2][7].walkable = false

        world[3][1].walkable = false
        world[3][2].walkable = true
        world[3][3].walkable = false
        world[3][4].walkable = true
        world[3][5].walkable = true
        world[3][6].walkable = true
        world[3][7].walkable = false

        world[4][1].walkable = false
        world[4][2].walkable = true
        world[4][3].walkable = false
        world[4][4].walkable = false
        world[4][5].walkable = false
        world[4][6].walkable = true
        world[4][7].walkable = false

        world[5][1].walkable = false
        world[5][2].walkable = true
        world[5][3].walkable = true
        world[5][4].walkable = true
        world[5][5].walkable = false
        world[5][6].walkable = true
        world[5][7].walkable = false

        world[6][1].walkable = false
        world[6][2].walkable = true
        world[6][3].walkable = false
        world[6][4].walkable = true
        world[6][5].walkable = false
        world[6][6].walkable = true
        world[6][7].walkable = true

        world[7][1].walkable = false
        world[7][2].walkable = true
        world[7][3].walkable = false
        world[7][4].walkable = true
        world[7][5].walkable = false
        world[7][6].walkable = false
        world[7][7].walkable = false
    } else {
        generateRandomWalls(world_width, world_height)
        generateCoin(4)
    }
}

function generateRandomWalls(width, height) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (Math.random() > 0.7) {
                world[x][y].walkable = false
                world[x][y].value = 1;
            }
        }
    }

    for(let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let count = getWallCount(world[x][y], false, 1)

            if(count >= 3) {
                world[x][y].walkable = false;
                world[x][y].value = 1;
            }
        }
    }

    let player_set = false
    for (let x = 0; x < width; x++) {
        if (player_set) {
            break
        }
        for (let y = 0; y < height; y++) {
            if (world[x][y].walkable) {
                world[x][y].player = true
                player_set = true
                break
            }
        }
    }

    let enemy_set = false
    for (let x = width-1; x > 0; x--) {
        if (enemy_set) {
            break
        }
        for (let y = width-1; y > 0; y--) {
            if (world[x][y].walkable) {
                world[x][y].enemy = true
                enemy_set = true
                break
            }
        }
    }

    function getWallCount(node, diagonal, val) {
        let x = node.x
        let y = node.y
    
        var i = 0;
        if (y-1 >= 0 && world[x][y-1].value == val) {
            i++
        }
        if (y+1 < world_height && world[x][y+1].value == val) {
            i++
        }
        if (x-1 >= 0 && world[x-1][y].value == val) {
            i++
        }
        if (x+1 < world_width && world[x+1][y].value == val) {
            i++
        }
        
        if (diagonal) {
            if(world[x+1][y+1].value == val) {
                i++
            }
            if(world[x+1][y-1].value == val) {
                i++
            }
            if(world[x-1][y+1].value == val) {
                i++
            }
            if(world[x-1][y-1].value == val) {
                i++
            }
        }

        return i
    }

}

function draw() {

    ctx.fillStyle = '#ccc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let x = 0; x < world_width; x++) {
        for (let y = 0; y < world_height; y++) {

            ctx.beginPath()
            ctx.rect(x * tile_width, y * tile_height, tile_width, tile_height)
			
            if (!world[x][y].walkable) {
                ctx.fillStyle = '#666'
            } else if (world[x][y].player == true) {
                world[x][y].player = false
                player_position.x = x;
                player_position.y = y;
                ctx.fillStyle = 'green'
            } else if (world[x][y].enemy == true) {
                world[x][y].enemy = false
                enemy_position.x = x;
                enemy_position.y = y;
                ctx.fillStyle = 'red'
            } else if (world[x][y].coin == true) {
                ctx.fillStyle = 'yellow'
            } else {
                ctx.fillStyle = 'white'
            }

            ctx.fill()
        }
    }

    score.redraw_score();
}

function reset_game() {
    alert(`Game over! You scored ${score.score} points`)
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    score = new Score(0)
    createWorld()
}



function update_player(direction) {

    const move_to = {x: player_position.x + direction.x, y: player_position.y + direction.y}

    if (enemy_position.x == move_to.x && enemy_position.y == move_to.y || enemy_position.x == player_position.x && enemy_position.y == player_position.y) {
        reset_game()
    } else {

        if (!(world[move_to.x] == undefined || world[move_to.x][move_to.y] == undefined)) {
    
            if ( world[move_to.x][move_to.y].walkable ) {

                if (world[move_to.x][move_to.y].coin == true) {
                    world[move_to.x][move_to.y].coin = false
                    world[move_to.x][move_to.y].walkable = true

                    score.update_score(100)
                    generateCoin(1)
                }
    
                ctx.beginPath()
                ctx.clearRect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height)
                ctx.fillStyle = 'white'
                ctx.rect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height)
                ctx.fill()
    
                player_position.x = move_to.x
                player_position.y = move_to.y
    
                ctx.beginPath()
                ctx.clearRect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height)
                ctx.fillStyle = 'green'
                ctx.rect(player_position.x * tile_width, player_position.y * tile_height, tile_width, tile_height)
                ctx.fill()
    
            } else {
                console.log("hit object")
            }
        } else {
            console.log("out of bounds")
        }
    }

}

function generateCoin(number_to_draw) {
    let i = 0
    for (let x = 0; x < world_width; x++) {
        if (i == number_to_draw) {
            break
        }
        for (let y = 0; y < world_height; y++) {
            if (Math.random() > 0.99) {
                if (world[x][y].walkable) {
                    world[x][y].coin = true
                    world[x][y].value = 0.4
                    i++
                    break
                }
            }
        }
    }

    redrawCoins()
}

function redrawCoins() {
    for (let x = 0; x < world_width; x++) {
        for (let y = 0; y < world_height; y++) {
            if (world[x][y].coin == true) {
                ctx.beginPath()
                ctx.rect(x * tile_width, y * tile_height, tile_width, tile_height)
                ctx.fillStyle = 'yellow'
                ctx.fill()
            } 
        }
    }
}

function draw_path(moves) {
    for (let x = 0; x < world_width; x++) {
        for (let y = 0; y < world_height; y++) {
            if (world[x][y].path == true) {
                world[x][y].path = false;
                ctx.beginPath()
                ctx.rect(x * tile_width, y * tile_height, tile_width, tile_height)
                ctx.fillStyle = 'white'
                ctx.fill()
            } 
        }
    }
    for (let move in moves) {
       world[moves[move].x][moves[move].y].path = true;
    }
    for (let x = 0; x < world_width; x++) {
        for (let y = 0; y < world_height; y++) {
            if (world[x][y].player == true) {
                continue
            }
            if (world[x][y].path == true) {
                ctx.beginPath()
                ctx.rect(x * tile_width, y * tile_height, tile_width, tile_height)
                ctx.fillStyle = "rgba(0, 0, 255, 0.1)"
                ctx.fill()
            } 
        }
    }
}

function update_enemy() {

    const moves = calculateNextMove(world, enemy_position, player_position)
    //draw_path(moves);

    const move_to = moves[1]

    //quick fix to reset game where unblockable path exists
    if (!move_to) {
        reset_game()
    }
    
    if (enemy_position.x == move_to.x && enemy_position.y == move_to.y || enemy_position.x == player_position.x && enemy_position.y == player_position.y) {
        reset_game()
    } else {

        //clear the previous square the enemy was on
        world[enemy_position.x][enemy_position.y].enemy = false

        //if enemy steps over a coin destroy it :)
        if (world[enemy_position.x][enemy_position.y].coin == true) {
            world[enemy_position.x][enemy_position.y].coin = false
            world[enemy_position.x][enemy_position.y].value = 0.4
            score.update_score(-100)
            generateCoin(1)
        }

        ctx.beginPath()
        ctx.clearRect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height)
        ctx.fillStyle = 'white'
        ctx.rect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height)
        ctx.fill()
		

        //update the new position of the enemy
        enemy_position.x = move_to.x
        enemy_position.y = move_to.y

        //update the world item
        world[enemy_position.x][enemy_position.y].enemy = true

        ctx.beginPath()
        ctx.clearRect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height)
        ctx.fillStyle = 'red'
        ctx.rect(enemy_position.x * tile_width, enemy_position.y * tile_height, tile_width, tile_height)
        ctx.fill()
    }
}


function calculateNextMove(world, path_start, path_end) {
    let world_width = world[0].length
    let world_height = world.length
    let world_size = world_width * world_height

    let node

    let walkable = 0

    function ManhattanDistance(start, end) {
        return (Math.abs(start.x - end.x) + Math.abs(start.y - end.y))
    }
    
    function findPath (start, end, grid) {
        let start_x = start.x
        let start_y = start.y
        let end_x = end.x
        let end_y = end.y
        let time_start = Date.now()

        let closed_set = []
        let open_set = []
        
        let end_node = new Node(end_x, end_y, false, 0)
        let start_node = new Node(start_x, start_y, false, 0)

        start_node.g = 0
        start_node.f = 0

        open_set.push(start_node)

        while (open_set.length > 0) {
            //find the lowest f in the set
            let node = open_set[0]
            for (let tile in open_set) {
                node = (open_set[tile].f < node.f) ? open_set[tile] : node
            }
            
            //remove the lowest f from the openset
            for (let i = 0; i < open_set.length; i++) {
                if (node == open_set[i]) {
                    open_set.splice(i, 1)
                    break
                }
            }

            //add the lowest node to the closedset
            closed_set.push(node)

            //if matching paths then target found

            if (node == world[end_x][end_y]) {
                let path = [{x: node.x, y: node.y}]
                while (node.parent) {
                    node = node.parent
                    path.push({x: node.x, y: node.y})
                }
                let time_end = Date.now()
                search_time.update_time(time_end - time_start)
                return path.reverse()
            }

            //get the neighbours for the node
            let neighbours = getNeighbours(node, 1)

            //for every neighbour
            for (let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i]

                if (closed_set.includes(neighbour)) {
                    continue
                }

                //g = distance from starting node
                //h = distance from end node
                //f = g + h

                let x = neighbour.x
                let y = neighbour.y

                let g = node.g + node.value * ManhattanDistance(neighbour, end_node)

                if (!open_set.includes(neighbour) || g < neighbour.g) {
                    
                    neighbour.g = g
                    neighbour.h =  neighbour.value * ManhattanDistance(neighbour, end_node)
                    neighbour.f = neighbour.g + neighbour.h
                    neighbour.parent = node

                    if (!open_set.includes(neighbour)) {
                        open_set.push(neighbour)
                    } else {
                        open_set[i] = neighbour
                    }
                    
                }
            }
            
        }
        return []
    }
    
    return findPath (path_start, path_end, world)

}

function getNeighbours(node, max) {
    let neighbours = []
    let x = node.x
    let y = node.y
    let value = node.value

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
        
    return neighbours
}

let config = 
{
    "player_binds": {
        "up": 87,
        "down": 83,
        "left": 65,
        "right": 68
    }
}
const binds = config.player_binds

onkeydown =  (e) => {
    let key = e.keyCode

    switch(key) {
        case binds.right: 
            update_player({x:1, y:0})
            break
        case binds.left:
            update_player({x:-1, y:0})
            break
        case binds.up:
            update_player({x:0, y:-1})
            break
        case binds.down:
            update_player({x:0, y:1})
            break
    }
}