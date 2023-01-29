var canvas = document.getElementById('plot');
var ctx = canvas.getContext('2d');
var canvas_bis = document.getElementById('plot_bis');
var ctx_bis = canvas_bis.getContext('2d');
const HEIGHT = canvas.height;
const WIDTH = canvas.width;
var FUNCTION_PTS = [];
var BOXES = [];
var EPSILON = undefined;
var DOWN = false;
var A = undefined;
var B = undefined;

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    BOXES.forEach(function (box) {
        const pad = 3;
        ctx.moveTo(box.x1, box.y_min - pad);
        ctx.lineTo(box.x2, box.y_min - pad);
        ctx.lineTo(box.x2, box.y_max + pad);
        ctx.lineTo(box.x1, box.y_max + pad);
        ctx.lineTo(box.x1, box.y_min - pad);
        ctx.lineTo(box.x2, box.y_min - pad);
    });
    ctx.stroke();
}

function draw_segments() {
    if(BOXES.length !== 0) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
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
        if (smart_boxes_checkbox.checked) {
            calculate_boxes_smart();
        } else {
            calculate_boxes();
        }
    }
    if (draw_boxes_checkbox.checked) {
        draw_boxes();
    }
    if (draw_segments_checkbox.checked) {
        draw_segments();
    }
    ctx_bis.clearRect(0, 0, canvas_bis.width, canvas_bis.height);
    ctx_bis.drawImage(canvas, 0, 0);
}

function add_point(x, y) {
    x = Math.round(x);
    x_min = FUNCTION_PTS[0].x
    x_max = FUNCTION_PTS[FUNCTION_PTS.length - 1].x;
    y_begin = FUNCTION_PTS[0].y;
    y_end = FUNCTION_PTS[FUNCTION_PTS.length - 1].y;
    if (x < x_min) {
        console.log(x, y);
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