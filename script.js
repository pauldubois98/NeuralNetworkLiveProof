canvas = document.getElementById('plot');
ctx = canvas.getContext('2d');
HEIGHT = canvas.height;
WIDTH = canvas.width;
FUNCTION_PTS_X = [];
FUNCTION_PTS_Y = [];


function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_axes(x=50, y=550, arrow_size=8) {
    clear();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(x, HEIGHT);
    ctx.lineTo(x, 2);
    ctx.lineTo(x-arrow_size, arrow_size+2);
    ctx.lineTo(x, 2);
    ctx.lineTo(x+arrow_size, arrow_size+2);
    ctx.lineTo(x, 2);
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH-2, y);
    ctx.lineTo(WIDTH-2-arrow_size, y-arrow_size);
    ctx.lineTo(WIDTH-2, y);
    ctx.lineTo(WIDTH-2-arrow_size, y+arrow_size);
    ctx.lineTo(WIDTH-2, y);
    ctx.stroke();
}

function typical_function(x) {   
    FUNCTION_PTS_X = [];
    FUNCTION_PTS_Y = [];
    for (var x = -3; x < WIDTH+3; x++) {
        FUNCTION_PTS_X.push(x);
        FUNCTION_PTS_Y.push((HEIGHT*5/6) - ((HEIGHT/4) * Math.sin(x * Math.PI * 2 / WIDTH)) - (x*HEIGHT/WIDTH/1.5));
    }
}


function draw_function() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.moveTo(FUNCTION_PTS_X[0], FUNCTION_PTS_Y[0]);
    for(var i = 1; i < FUNCTION_PTS_X.length; i++) {
        ctx.lineTo(FUNCTION_PTS_X[i], FUNCTION_PTS_Y[i]);
    }
    ctx.stroke();
}

draw_axes();
typical_function();
draw_function();