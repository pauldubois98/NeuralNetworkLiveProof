canvas = document.getElementById('plot');
ctx = canvas.getContext('2d');
HEIGHT = canvas.height;
WIDTH = canvas.width;


function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}