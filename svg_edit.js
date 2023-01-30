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
                if(index == NODES.length && x >= box.x1){
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
    NODES_BIS.forEach((node, index) => {
        if(index < BOXES.length){
            const box = BOXES[index];
            if(x >= box.x1){
                node.color = "#3498db";
                node.r = SIZE/10 + SIZE*(x-box.x1)/WIDTH;
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
    draw_network_bis();
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
    draw_network_bis();
}

function draw_node(cx, cy, r, color, name){
    var node_element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    node_element.setAttribute("id", name);
    node_element.setAttribute("cx", cx);
    node_element.setAttribute("cy", cy);
    node_element.setAttribute("r", r);
    node_element.style.fill = color;
    architecture.appendChild(node_element);
    return node_element;
}

function connect_nodes(node_a, node_b){
    var link_element = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    link_element.setAttribute("id", "network");
    link_element.setAttribute("d", 
        "M " + node_a.cx.baseVal.value + 
        " " + node_a.cy.baseVal.value +
        " L " + node_b.cx.baseVal.value +
        " " + node_b.cy.baseVal.value);
    link_element.style.stroke = "#000000";
    link_element.style.strokeWidth = "1";
    // architecture.appendChild(link_element);
    architecture.insertBefore(link_element, architecture.firstChild);
    return link_element;
}


function draw_network_bis(){
    // canvas part
    ctx_ter.clearRect(0, 0, canvas_ter.width, canvas_ter.height);
    // links
    ctx_ter.beginPath();
    ctx_ter.strokeStyle = "grey";
    ctx_ter.lineWidth = 1;
    LINKS_BIS.forEach(link => {
        ctx_ter.moveTo(link.x1, link.y1);
        ctx_ter.lineTo(link.x2, link.y2);
    });
    ctx_ter.stroke();
    // nodes
    // x
    ctx_ter.beginPath();
    ctx_ter.fillStyle = NODE_X.color;
    ctx_ter.arc(NODE_X.x, NODE_X.y, NODE_X.r, 0, 2 * Math.PI, false);
    ctx_ter.fill();
    // y
    ctx_ter.beginPath();
    ctx_ter.fillStyle = NODE_Y.color;
    ctx_ter.arc(NODE_Y.x, NODE_Y.y, NODE_Y.r, 0, 2 * Math.PI, false);
    ctx_ter.fill();
    // hidden
    NODES_BIS.forEach(node => {
        ctx_ter.beginPath();
        ctx_ter.fillStyle = node.color;
        ctx_ter.arc(node.x, node.y, node.r, 0, 2 * Math.PI, false);
        ctx_ter.fill();
    });
}


function draw_network(n){
    n = Number(n);
    SIZE = Math.min(25, 250/(Number(n)+1));
    SHIFT = SIZE;
    if (n < 10){
        SIZE = 25;
        SHIFT = SIZE * (10 - n);
    }
    NODES_BIS = [];
    LINKS_BIS = [];
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
        NODES_BIS.push({
            x: 250,
            y: SHIFT + SIZE + i * 2*SIZE,
            r: SIZE-1,
            color: "#3498db"
        });
    }
    NODES_BIS.forEach(function(node){
        LINKS_BIS.push({
            x1: NODE_X.x,
            y1: NODE_X.y,
            x2: node.x,
            y2: node.y
        });
    });
    NODES_BIS.forEach(function(node){
        LINKS_BIS.push({
            x1: node.x,
            y1: node.y,
            x2: NODE_Y.x,
            y2: NODE_Y.y
        });
    });
    draw_network_bis();
    draw_all_bis();
}

draw_network(network_size.value);