function apply_x_y(x){
    // architecture part
    // x
    NODE_X.color = "#3efc91";
    NODE_X.r = SIZE/10 + 3*SIZE*Number(x)/WIDTH;
    // y
    NODE_Y.color = "#ff6f5c";
    if(BOXES.length !== 0){
        if (x < A) {
            NODE_Y.r = SIZE/10 + 3*SIZE*(HEIGHT-BOXES[0].y1)/HEIGHT;
        } else {
            BOXES.forEach((box, index) => {
                if(index < NODES.length && x >= box.x1 && x < box.x2){
                    var y = box.y1 + (box.y1 - box.y2)*(x - box.x1)/(box.x1 - box.x2);
                    NODE_Y.r = SIZE/10 + 3*SIZE*(HEIGHT-y)/HEIGHT;
                }
                if(index < NODES.length && x >= box.x1){
                    var y = box.y1 + (box.y1 - box.y2)*(x - box.x1)/(box.x1 - box.x2);
                    NODE_Y.r = SIZE/10 + 3*SIZE*(HEIGHT-y)/HEIGHT;
                }
            });
        }
        if (x >= B && NODES.length > BOXES.length) {
            NODE_Y.r = SIZE/10 + 3*SIZE*(HEIGHT-BOXES[BOXES.length-1].y2)/HEIGHT;
        }
    }
    // hidden
    NODES.forEach((node, index) => {
        if(index < BOXES.length){
            const box = BOXES[index];
            if(x >= box.x1){
                node.color = "#3498db";
                node.r = SIZE/10 + SIZE*(x-box.x1)/WIDTH;
            } else{
                node.color = "#54f8fb";
                node.r = SIZE/10;
            }
        } else if(index == BOXES.length){
            const box = BOXES[index-1];
            if(x >= box.x2){
                node.color = "#3498db";
                node.r = SIZE/10 + SIZE*(x-box.x2)/WIDTH;
            } else{
                node.color = "#54f8fb";
                node.r = SIZE/10;
            }
        } else{
            // more nodes than boxes
            node.color = "#54f8fb";
            node.r = SIZE/2;
        }
    });
    draw_network();
    // plot part
    draw_all_bis();
    ctx_bis.beginPath();
    ctx_bis.strokeStyle = "green";
    ctx_bis.lineWidth = 4;
    ctx_bis.moveTo(x, 0);
    ctx_bis.lineTo(x, HEIGHT);
    ctx_bis.stroke();
}

function apply_network(x){
    x = Number(x);
    apply_x_y(x)
    NODE_X.color = "#2ecc71";
    NODE_Y.color = "#e74c3c";
    draw_network();
}

function draw_network(){
    // canvas part
    ctx_ter.clearRect(0, 0, canvas_ter.width, canvas_ter.height);
    // links
    ctx_ter.beginPath();
    ctx_ter.strokeStyle = "grey";
    ctx_ter.lineWidth = 1;
    LINKS.forEach(link => {
        ctx_ter.moveTo(link.x1, link.y1);
        ctx_ter.lineTo(link.x2, link.y2);
    });
    ctx_ter.stroke();
    // nodes
    // x
    ctx_ter.beginPath();
    ctx_ter.fillStyle = NODE_X.color;
    ctx_ter.arc(NODE_X.x, NODE_X.y, Math.max(0, NODE_X.r), 0, 2 * Math.PI, false);
    ctx_ter.fill();
    // y
    ctx_ter.beginPath();
    ctx_ter.fillStyle = NODE_Y.color;
    ctx_ter.arc(NODE_Y.x, NODE_Y.y, Math.max(0, NODE_Y.r), 0, 2 * Math.PI, false);
    ctx_ter.fill();
    // hidden
    NODES.forEach(node => {
        ctx_ter.beginPath();
        ctx_ter.fillStyle = node.color;
        ctx_ter.arc(node.x, node.y, Math.max(0, node.r), 0, 2 * Math.PI, false);
        ctx_ter.fill();
    });
}


function create_network(n){
    n = Number(n);
    SIZE = Math.min(25, 250/(Number(n)+1));
    SHIFT = SIZE;
    if (n < 10){
        SIZE = 25;
        SHIFT = SIZE * (10 - n);
    }
    NODES = [];
    LINKS = [];
    NODE_X = {
        x: 50,
        y: SHIFT+SIZE*n,
        r: 20,
        color: "#2ecc71"
    };
    NODE_Y = {
        x: 450,
        y: SHIFT+SIZE*n,
        r: 20,
        color: "#e74c3c"
    };
    for (var i = 0; i < n; i++){
        NODES.push({
            x: 250,
            y: SHIFT + SIZE + i * 2*SIZE,
            r: SIZE-1,
            color: "#3498db"
        });
    }
    NODES.forEach(function(node){
        LINKS.push({
            x1: NODE_X.x,
            y1: NODE_X.y,
            x2: node.x,
            y2: node.y
        });
    });
    NODES.forEach(function(node){
        LINKS.push({
            x1: node.x,
            y1: node.y,
            x2: NODE_Y.x,
            y2: NODE_Y.y
        });
    });
    draw_network();
    draw_all_bis();
}

function match_subintervals(){
    network_size.value = Math.max(1, BOXES.length+1);
    create_network(network_size.value);
}

create_network(network_size.value);


//////////////////////////////////////////////////////////

function hover_x(){
    hover.innerText = "$x$";
    hover.style.color = "#2ecc71";
    AMprocessNodeR(hover, false);
}

function hover_y(){
    hover.innerHTML = "$y = \\sum_{k=0}^{" + Math.min(NODES.length, BOXES.length+1) + "} \\gamma_k (x-c_k)_+$";
    hover.style.color = "#e74c3c";
    AMprocessNodeR(hover, false);
}

function hover_node(n){
    hover.innerHTML = "$n_{" + (n+1) + "} = (x-c_{" + (n+1) + "})_+$";
    hover.style.color = "#3498db";
    AMprocessNodeR(hover, false);
}

function hoover_none(){
    hover.innerHTML = "";
    AMprocessNodeR(hover, false);
}

canvas_ter.addEventListener('mousemove', function(e) {
    var rect = canvas_ter.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var node = NODES.find(node => Math.sqrt(Math.pow(node.x-x, 2) + Math.pow(node.y-y, 2)) < node.r);
    if (node){
        hover_node(NODES.indexOf(node));
    } else if (Math.sqrt(Math.pow(NODE_X.x-x, 2) + Math.pow(NODE_X.y-y, 2)) < NODE_X.r){
        hover_x();
    } else if (Math.sqrt(Math.pow(NODE_Y.x-x, 2) + Math.pow(NODE_Y.y-y, 2)) < NODE_Y.r){
        hover_y();
    } else{
        hoover_none();
    }
}, false);
