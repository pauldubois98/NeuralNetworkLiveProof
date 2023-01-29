var NODES = [];
var LINKS = [];
var node_x = undefined;
var node_y = undefined;
var SIZE = undefined;


function apply_x(x){
    // architecture part
    node_x.style.fill = "#3eFc91";
    node_x.r.baseVal.value = SIZE/2 + SIZE*Number(x)/WIDTH;
    // plot part
    ctx_bis.clearRect(0, 0, canvas_bis.width, canvas_bis.height);
    ctx_bis.drawImage(canvas, 0, 0);
    ctx_bis.beginPath();
    ctx_bis.strokeStyle = "green";
    ctx_bis.lineWidth = 4;
    ctx_bis.moveTo(x, 0);
    ctx_bis.lineTo(x, HEIGHT);
    ctx_bis.stroke();
}

function apply_network(x){
    x = Number(x);
    apply_x(x)
    node_x.style.fill = "#2ecc71";
    node_x.r.baseVal.value = SIZE/2 + SIZE*x/WIDTH;
    NODES.forEach((node, index) => {
        if(index < BOXES.length){
            const box = BOXES[index];
            if(x >= box.x1){
                node.style.fill = "#3498db";
                node.r.baseVal.value = SIZE/2 + SIZE*(x-box.x1)/WIDTH;
            } else{
                node.style.fill = "#54f8fb";
                node.r.baseVal.value = SIZE/2;
            }
        } else{
            // more nodes than boxes
            node.style.fill = "#54f8fb";
            node.r.baseVal.value = SIZE/2;
        }
        
      });
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


function draw_network(n){
    SIZE = Math.min(25, 250/(Number(n)+1));
    architecture.innerHTML = "";
    NODES = [];
    LINKS = [];
    node_x = draw_node(50, SIZE+SIZE*n, 20, "#2ecc71", "node_x");
    node_y = draw_node(450, SIZE+SIZE*n, 20, "#e74c3c", "node_y");
    for (var i = 0; i < n; i++){
        var node = draw_node(250, 2*SIZE + i * 2*SIZE, SIZE-1, "#3498db", "node_" + i);
        NODES.push(node);
    }
    NODES.forEach(function(node){
        link = connect_nodes(node_x, node);
        LINKS.push(link);
    });
    NODES.forEach(function(node){
        link = connect_nodes(node, node_y);
        LINKS.push(link);
    });
    architecture.height.baseVal.value = 500; // 2 * (n+1) * SIZE
    return [NODES, LINKS];
}

draw_network(network_size.value);