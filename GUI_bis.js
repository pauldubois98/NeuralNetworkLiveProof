var DOWN_BIS = false;

canvas_bis.addEventListener('mouseup', function (e) {
    var rect = canvas_bis.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN_BIS = false;
    apply_network(x);
});
canvas_bis.addEventListener('mousedown', function (e) {
    var rect = canvas_bis.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    DOWN_BIS = true;
    apply_x(x);
});
canvas_bis.addEventListener('mousemove', function (e) {
    var rect = canvas_bis.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (DOWN_BIS) {
        apply_x(x);
    }
});
