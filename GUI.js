var canvas = document.getElementById('plot');
var ctx = canvas.getContext('2d');
const HEIGHT = canvas.height;
const WIDTH = canvas.width;
var FUNCTION_PTS = [];
var BOXES = [];
var EPSILON = undefined;
var DOWN = false;
var A = undefined;
var B = undefined;
var EXPORT = false;

var canvas_bis = document.getElementById('plot_bis');
var ctx_bis = canvas_bis.getContext('2d');
var DOWN_BIS = false;

var canvas_ter = document.getElementById('network_architecture');
var ctx_ter = canvas_ter.getContext('2d');
var SIZE = undefined;
var SHIFT = undefined;
var LINKS = [];
var NODES = [];
var NODE_X = undefined;
var NODE_Y = undefined;

function clear() {
    if (!EXPORT) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function draw_axes(x = 50, y = 350, arrow_size = 8) {
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
    if(draw_legend_checkbox.checked){
        // A
        ctx.fillStyle = "#FFFFFFAA";
        ctx.fillRect(A-10, HEIGHT-20, 20, 20);
        ctx.font = "20px Arial";
        ctx.fillStyle = "grey";
        if(!EXPORT){
            ctx.fillText("a", A-6, HEIGHT-4);
        }
        // B
        ctx.fillStyle = "#FFFFFFAA";
        ctx.fillRect(B-10, HEIGHT-20, 20, 20);
        ctx.font = "20px Arial";
        ctx.fillStyle = "grey";
        if(!EXPORT){
            ctx.fillText("b", B-5, HEIGHT-3);
        }
        // // f
        // ctx.beginPath();
        // ctx.strokeStyle = "black";
        // ctx.lineWidth = 5;
        // ctx.moveTo(18, 15);
        // ctx.lineTo(38, 15);
        // ctx.stroke();
        // ctx.font = "20px Arial";
        // ctx.fillStyle = "black";
        // ctx.fillText("f", 5, 22);
    }
}

function typical_function(x) {
    FUNCTION_PTS = [];
    for (var x = -3; x < WIDTH + 3; x++) {
        y = HEIGHT - ((HEIGHT / 3) * Math.sin(x * Math.PI * 2 / WIDTH)) - (x * HEIGHT / WIDTH);
        FUNCTION_PTS.push({ x: x, y: y });
    }
}

function draw_function() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    if (FUNCTION_PTS.length !== 0) {
        ctx.moveTo(FUNCTION_PTS[0].x, FUNCTION_PTS[0].y);
        FUNCTION_PTS.slice(1).forEach(function (point) {
            ctx.lineTo(point.x, point.y);
        });
    }
    
    ctx.stroke();
}

function draw_boxes() {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    const pad = 3;
    BOXES.forEach(function (box) {
        ctx.moveTo(box.x1, box.y_min - pad);
        ctx.lineTo(box.x2, box.y_min - pad);
        ctx.lineTo(box.x2, box.y_max + pad);
        ctx.lineTo(box.x1, box.y_max + pad);
        ctx.lineTo(box.x1, box.y_min - pad);
        ctx.lineTo(box.x2, box.y_min - pad);
    });
    ctx.stroke();
    if(draw_subintervals_checkbox.checked && BOXES.length > 0){
        ctx.fillStyle = "#FFFFFFAA";
        ctx.fillRect(A-12, 351, 20, 20);
        ctx.fillStyle = "#FFFFFFAA";
        ctx.fillRect(B-7, 351, 20, 20);
        ctx.fillStyle = "red";
        ctx.beginPath();
        var n = 0;
        ctx.strokeStyle = "red";
        ctx.font = "12px Arial";
        ctx.lineWidth = 1;
        if (!EXPORT){
            ctx.setLineDash([5, 15]);
        }
        var last_box_y_max = 0;
        BOXES.forEach(function (box) {
            ctx.moveTo(box.x1, Math.max(box.y_max, last_box_y_max) + pad);
            ctx.lineTo(box.x1, 350);
            if (!EXPORT){
                ctx.fillText("c", box.x1-9, 362);
                ctx.fillText(n, box.x1-3, 370);
            }
            last_box_y_max = box.y_max;
            n++;
        });
        if (!EXPORT){
            ctx.fillText("c", B-3, 362);
            ctx.fillText(n, B+3, 370);
        }
        ctx.moveTo(B, BOXES[BOXES.length-1].y_max + pad);
        ctx.lineTo(B, 350);
        ctx.stroke();
        if (!EXPORT){
            ctx.setLineDash([]);
        }
    }
}

function draw_segments() {
    if(BOXES.length !== 0) {
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 3;
        ctx.moveTo(BOXES[0].x1, BOXES[0].y1);
        BOXES.forEach(function (box) {
            ctx.lineTo(box.x2, box.y2);
        });
        ctx.stroke();
    }
}

function draw_all() {
    BOXES = [];
    clear();
    draw_axes();
    draw_bounds();
    draw_function();
    if (EPSILON >= calculate_max_epsilon()) {
        if (const_height.checked) {
            calculate_boxes_const_height();
        }
        if (const_width.checked) {
            calculate_boxes_const_width();
        }
    }
    if (draw_boxes_checkbox.checked) {
        draw_boxes();
    }
    if (draw_segments_checkbox.checked) {
        draw_segments();
    }
    draw_all_bis();
}

function add_point(x, y) {
    x = Math.round(x);
    x_min = FUNCTION_PTS[0].x
    x_max = FUNCTION_PTS[FUNCTION_PTS.length - 1].x;
    y_begin = FUNCTION_PTS[0].y;
    y_end = FUNCTION_PTS[FUNCTION_PTS.length - 1].y;
    if (x < x_min) {
        for (var xi = x_min - 1; xi >= x; xi--) {
            const yi = y_begin + ((y - y_begin) * (xi - x_min) / (x - x_min));
            FUNCTION_PTS.unshift({ x: xi, y: yi });
        }
    } else if (x > x_max) {
        for (var xi = x_max + 1; xi <= x; xi++) {
            const yi = y_end + ((y - y_end) * (xi - x_max) / (x - x_max));
            FUNCTION_PTS.push({ x: xi, y: yi });
        }
    }
}
function auto_bounds() {
    A = FUNCTION_PTS[0].x
    B = FUNCTION_PTS[FUNCTION_PTS.length - 1].x;
    document.getElementById('range_A').value = A;
    document.getElementById('range_B').value = B;
}
function change_bounds() {
    A = Math.min(document.getElementById('range_A').value, FUNCTION_PTS[FUNCTION_PTS.length - 1].x);
    A = Math.max(A, FUNCTION_PTS[0].x);
    B = Math.min(document.getElementById('range_B').value, FUNCTION_PTS[FUNCTION_PTS.length - 1].x);
    B = Math.max(B, FUNCTION_PTS[0].x);
    if (A > B) {
        Z = A;
        A = B;
        B = Z;
    }
    document.getElementById('range_A').value = A;
    document.getElementById('range_B').value = B;
}

function change_epsilon() {
    EPSILON = document.getElementById("range_Epsilon").value;
    if (EPSILON < calculate_max_epsilon()) {
        // console.log(EPSILON, "Epsilon is too small");
        error_delta.style.display = "block";
    } else {
        // console.log(EPSILON, "Epsilon is good");
        error_delta.style.display = "none";
    }
    draw_all();
}

// user interaction
canvas.addEventListener('mouseup', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN = false;
    if(FUNCTION_PTS.length === 1) {
        FUNCTION_PTS.push({ x: Math.round(x)+1, y: y });
    }
    add_point(x, y);
    auto_bounds();
    draw_all();
});
canvas.addEventListener('mouseleave', function (e) {
    if (DOWN) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        add_point(Math.max(0, Math.min(x, WIDTH)), Math.max(0, Math.min(y, HEIGHT)));
        auto_bounds();
    }
    DOWN = false;
    draw_all();
});
canvas.addEventListener('mousedown', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN = true;
    FUNCTION_PTS = [{ x: Math.round(x), y: y }];
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
        add_point(x, y);
        draw_function();
    }
});

typical_function();
change_bounds();
change_epsilon();
draw_all();


function draw_network_function(){
    if(BOXES.length !== 0) {
        ctx_bis.beginPath();
        ctx_bis.strokeStyle = "yellow";
        ctx_bis.lineWidth = 3;
        ctx_bis.moveTo(0, BOXES[0].y1);
        ctx_bis.lineTo(BOXES[0].x1, BOXES[0].y1);
        BOXES.forEach((box, index) => {
            if(index < NODES.length){
                ctx_bis.lineTo(box.x2, box.y2);
            }
        });
        if(BOXES.length >= NODES.length){
            last_box = BOXES[Math.max(NODES.length - 1, 0)];
            ctx_bis.lineTo(WIDTH, last_box.y2 + 
                ((WIDTH - last_box.x2) * (last_box.y2 - last_box.y1) / (last_box.x2 - last_box.x1)));
        } else {
            ctx_bis.lineTo(WIDTH, BOXES[BOXES.length - 1].y2);
        }
        ctx_bis.stroke();
    }
}

function draw_all_bis(){
    ctx_bis.clearRect(0, 0, canvas_bis.width, canvas_bis.height);
    ctx_bis.drawImage(canvas, 0, 0);
    draw_network_function();
}