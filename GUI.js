canvas = document.getElementById('plot');
ctx = canvas.getContext('2d');
HEIGHT = canvas.height;
WIDTH = canvas.width;
FUNCTION_PTS_X = [];
FUNCTION_PTS_Y = [];
BOXES = [];
EPSILON = 20;
DOWN = false;
A = 150;
B = 650;

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_axes(x = 50, y = 550, arrow_size = 8) {
    ctx.beginPath();
    ctx.strokeStyle = "darkgray";
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

function draw_bounds() {
    ctx.beginPath();
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 3;
    ctx.moveTo(A, 0);
    ctx.lineTo(A, HEIGHT);
    ctx.moveTo(B, 0);
    ctx.lineTo(B, HEIGHT);
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

function draw_boxes(){
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    for(var i = 0; i < BOXES.length; i++){
        x1 = BOXES[i][0];
        x2 = BOXES[i][1];
        y1 = BOXES[i][2]-3;
        y2 = BOXES[i][3]+3;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y1);
    }
    ctx.stroke();
}

function draw_all(){
    clear();
    draw_axes();
    draw_bounds();
    draw_function();
    if(BOXES.length == 0 && EPSILON >= calculate_max_epsilon()){
        if(smart_boxes_checkbox.checked){
            calculate_boxes_smart();
        } else {
            calculate_boxes();
        }
    }
    if(draw_boxes_checkbox.checked){
        draw_boxes();
    }
    if(draw_segments_checkbox.checked){
        draw_segments();
    }
}

function add_point(x,y){
    x = Math.round(x);
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
function auto_bounds(){
    A = FUNCTION_PTS_X[0]
    B = FUNCTION_PTS_X[FUNCTION_PTS_X.length - 1];
    document.getElementById('range_A').value = A;
    document.getElementById('range_B').value = B;
    BOXES = [];
}
function change_bounds(){
    A = Math.max(document.getElementById('range_A').value, FUNCTION_PTS_X[0]);
    B = Math.min(document.getElementById('range_B').value, FUNCTION_PTS_X[FUNCTION_PTS_X.length - 1]);
    if(A > B){
        Z = A;
        A = B;
        B = Z;
    }
    document.getElementById('range_A').value = A;
    document.getElementById('range_B').value = B;
    BOXES = [];
    draw_all();
}

function change_epsilon(){
    BOXES = [];
    EPSILON = document.getElementById("range_Epsilon").value;
    if (EPSILON < calculate_max_epsilon()) {
        console.log(EPSILON, "Epsilon is too small");
    } else{
        console.log(EPSILON, "Epsilon is good");
    }
    draw_all();
}

// user interaction
canvas.addEventListener('mouseup', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN = false;
    add_point(x,y);
    auto_bounds();
    draw_all();
});
canvas.addEventListener('mousedown', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN = true;
    FUNCTION_PTS_X = [Math.round(x)];
    FUNCTION_PTS_Y = [y];
    BOXES = [];
    clear();
    draw_axes();
    draw_bounds();
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

typical_function();
draw_all();