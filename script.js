canvas = document.getElementById('plot');
ctx = canvas.getContext('2d');
HEIGHT = canvas.height;
WIDTH = canvas.width;


function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_func() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.moveTo(0,500);
    for (var x = -3; x < WIDTH+3; x++) {
        ctx.lineTo(x, (HEIGHT*5/6) - ((HEIGHT/4) * Math.sin(x * Math.PI * 2 / WIDTH)) - (x*HEIGHT/WIDTH/1.5));
    }
    ctx.stroke();
}

draw_func();