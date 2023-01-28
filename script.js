canvas = document.getElementById('plot');
ctx = canvas.getContext('2d');
HEIGHT = canvas.height;
WIDTH = canvas.width;
FUNCTION_PTS_X = [];
FUNCTION_PTS_Y = [];
DOWN = false;

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_axes(x = 50, y = 550, arrow_size = 8) {
    clear();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(x, HEIGHT);
    ctx.lineTo(x, 2);
    ctx.lineTo(x - arrow_size, arrow_size + 2);
    ctx.lineTo(x, 2);
    ctx.lineTo(x + arrow_size, arrow_size + 2);
    ctx.lineTo(x, 2);
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH - 2, y);
    ctx.lineTo(WIDTH - 2 - arrow_size, y - arrow_size);
    ctx.lineTo(WIDTH - 2, y);
    ctx.lineTo(WIDTH - 2 - arrow_size, y + arrow_size);
    ctx.lineTo(WIDTH - 2, y);
    ctx.stroke();
}

function typical_function(x) {
    FUNCTION_PTS_X = [];
    FUNCTION_PTS_Y = [];
    for (var x = -3; x < WIDTH + 3; x++) {
        FUNCTION_PTS_X.push(x);
        FUNCTION_PTS_Y.push((HEIGHT * 5 / 6) - ((HEIGHT / 4) * Math.sin(x * Math.PI * 2 / WIDTH)) - (x * HEIGHT / WIDTH / 1.5));
    }
}


function draw_function() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.moveTo(FUNCTION_PTS_X[0], FUNCTION_PTS_Y[0]);
    for (var i = 1; i < FUNCTION_PTS_X.length; i++) {
        ctx.lineTo(FUNCTION_PTS_X[i], FUNCTION_PTS_Y[i]);
    }
    ctx.stroke();
}

function add_point(x,y){
    x = Math.round(x);
    y = Math.round(y);
    x_min = FUNCTION_PTS_X[0]
    x_max = FUNCTION_PTS_X[FUNCTION_PTS_X.length - 1];
    y_begin = FUNCTION_PTS_Y[0];
    y_end = FUNCTION_PTS_Y[FUNCTION_PTS_Y.length - 1];
    if (x < x_min) {
        for(var xi = x_min-1; xi >= x; xi--){
            FUNCTION_PTS_X.unshift(xi);
            FUNCTION_PTS_Y.unshift(y_begin + ((y - y_begin) * (x_min - xi) / (x_min - x)) );
        }
    } else if (x > x_max) {
        for(var xi = x_max+1; xi <= x; xi++){
            FUNCTION_PTS_X.push(xi);
            FUNCTION_PTS_Y.push(y_end + ((y - y_end) * (xi - x_max) / (x - x_max)) );
        }
    }
}

// user interaction
canvas.addEventListener('mouseup', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN = false;
    add_point(x,y);
    draw_axes();
    draw_function();
});
canvas.addEventListener('mousedown', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN = true;
    FUNCTION_PTS_X = [x];
    FUNCTION_PTS_Y = [y];
});
canvas.addEventListener('mousemove', function (e) {
    if (DOWN) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        add_point(x,y);
        draw_function();
    }
});


draw_axes();
typical_function();
draw_function();