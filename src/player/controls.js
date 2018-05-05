var config = 
{
    "player_binds": {
        "up": 87,
        "down": 83,
        "left": 67,
        "right": 68
    }
}
binds = config.player_binds;

onkeydown =  (e) => {
    key = e.keyCode;

    switch(key) {
        case binds.right: 
            x++;
            break;
        case binds.left:
            x--;
            break;
        case binds.up:
            y++;
            break;
        case binds.down:
            y--;
            break;
    }
},

onkeyup = (e) => {
    key = e.keyCode;

    switch(key) {
        case binds.right, binds.left: 
            x =0;
            break;
        case binds.up, binds.down:
            y = 0;
            break;
    }
}
    
