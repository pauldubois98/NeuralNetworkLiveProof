var NODES = [];
var LINKS = [];

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
    architecture.innerHTML = "";
    NODES = [];
    LINKS = [];
    node_x = draw_node(50, 25+25*n, 20, "#2ecc71", "node_x");
    node_y = draw_node(450, 25+25*n, 20, "#e74c3c", "node_y");
    for (var i = 0; i < n; i++){
        var node = draw_node(250, 50 + i * 50, 20, "#3498db", "node_" + i);
        NODES.push(node);
    }
    for (var i = 0; i < n; i++){
        link = connect_nodes(node_x, NODES[i]);
        LINKS.push(link);
    }
    for (var i = 0; i < n; i++){
        link = connect_nodes(NODES[i], node_y);
        LINKS.push(link);
    }
    NODES.push(node_x);
    NODES.push(node_y)
    return [NODES, LINKS];
}

// draw_node(100, 100, 10, "#ff0000", "node_z");
// connect_nodes(node_x, node_z);
draw_network(4)