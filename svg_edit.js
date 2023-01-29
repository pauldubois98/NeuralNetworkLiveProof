var NODES = [];
var LINKS = [];
var node_x = undefined;
var node_y = undefined;
var SIZE = undefined;

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
    console.log(SIZE);
    // architecture.innerHTML = "";
    // NODES = [];
    // LINKS = [];
    if(NODES.length == 0){
        node_x = draw_node(50, SIZE+SIZE*n, 20, "#2ecc71", "node_x");
        node_y = draw_node(450, SIZE+SIZE*n, 20, "#e74c3c", "node_y");
    }
    for (var i = 0; i < n; i++){
        if(i < NODES.length){
            NODES[i].cx.baseVal.value = 250;
            NODES[i].cy.baseVal.value = 2*SIZE + i * 2*SIZE;
            NODES[i].r.baseVal.value = SIZE-1;
        } else{
            var node = draw_node(250, 2*SIZE + i * 2*SIZE, SIZE-1, "#3498db", "node_" + i);
            NODES.push(node);
        }
    }
    for (var i = 0; i < n; i++){
        if(i < LINKS.length){
            LINKS[i].setAttribute("d",
                "M " + node_x.cx.baseVal.value +
                " " + node_x.cy.baseVal.value +
                " L " + NODES[i].cx.baseVal.value +
                " " + NODES[i].cy.baseVal.value);
        } else{
            link = connect_nodes(node_x, NODES[i]);
            LINKS.push(link);
        }
    }
    for (var i = 0; i < n; i++){
        if(n+i < LINKS.length){
            LINKS[n+i].setAttribute("d",
                "M " + NODES[i].cx.baseVal.value +
                " " + NODES[i].cy.baseVal.value +
                " L " + node_y.cx.baseVal.value +
                " " + node_y.cy.baseVal.value);
        } else{
            link = connect_nodes(NODES[i], node_y);
            LINKS.push(link);
        }
    }
    if(NODES.length > n){
        for(var i = NODES.length-1; i >= n; i--){
            NODES[i].remove();
            NODES.pop();
        }
    }
    if(LINKS.length > 2*n){
        for(var i = LINKS.length-1; i >= 2*n; i--){
            LINKS[i].remove();
            LINKS.pop();
        }
    }
    architecture.height.baseVal.value = 500; // 2 * (n+1) * SIZE
    return [NODES, LINKS];
}


draw_network(network_size.value);