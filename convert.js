function download_svg(dl=true){
    EXPORT = true;
    ctx = new SVGCanvas(800, 400);
    draw_all();
    var svg = document.getElementById("svg");
    svg.innerHTML = ctx.svg.htmlElement.innerHTML;
    // draw text to svg
    if(draw_legend_checkbox.checked){
        // a
        var text_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text_element.setAttribute("x", A-4);
        text_element.setAttribute("y", HEIGHT-8);
        text_element.style.fill = "grey";
        text_element.innerHTML = "a";
        svg.appendChild(text_element);
        // b
        var text_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text_element.setAttribute("x", B-4);
        text_element.setAttribute("y", HEIGHT-7);
        text_element.style.fill = "grey";
        text_element.innerHTML = "b";
        svg.appendChild(text_element);
    }
    if(draw_subintervals_checkbox.checked && draw_boxes_checkbox.checked && BOXES.length > 0){
        // c_n
        var n = 0;
        var last_box_y_max = 0;
        BOXES.forEach(function (box) {
            var text_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            text_element.setAttribute("x", box.x1-8);
            text_element.setAttribute("y", 362);
            text_element.style = "fill:red;font-size:12px";
            text_element.innerHTML = "c";
            svg.appendChild(text_element);
            var text_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            ctx.font = "15px Arial";
            text_element.setAttribute("x", box.x1-3);
            text_element.setAttribute("y", 370);
            text_element.style = "fill:red;font-size:12px";
            text_element.innerHTML = n;
            svg.appendChild(text_element);
            last_box_y_max = box.y_max;
            n++;
        });
        var text_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text_element.setAttribute("x", B-2);
        text_element.setAttribute("y", 362);
        text_element.style = "fill:red;font-size:12px";
        text_element.innerHTML = "c";
        svg.appendChild(text_element);
        var text_element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        ctx.font = "15px Arial";
        text_element.setAttribute("x", B+2);
        text_element.setAttribute("y", 370);
        text_element.style = "fill:red;font-size:12px";
        text_element.innerHTML = n;
        svg.appendChild(text_element);
        // dot the lines
        var dots = undefined
        for(var i=0; i<svg.children.length; i++){
            if(svg.children[i].getAttribute("stroke")=="#ff0000"){
                dots = svg.children[i];
            }
        }
        if(dots){
            dots.style="stroke-dasharray:4,1;stroke-dashoffset:0"
        }
        // opacity of rectangles
        for(var i=0; i<svg.children.length; i++){
            if(svg.children[i].tagName == 'rect'){
                svg.children[i].style = "fill:#ffffff;fill-opacity:0.75" 
            }
        }
    }

    // download the svg
    if(dl){
        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);
        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        // add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        // convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
        // set url value to a element's href attribute.
        var a = document.createElement("a");
        a.href = url;
        a.download = "plot.svg";
        a.click();
        window.URL.revokeObjectURL(url);
    }
    ctx = canvas.getContext('2d');
    EXPORT = false;
}

function download_svg_bis(){
    download_svg(false);
    ctx_bis = new SVGCanvas(800, 400);
    draw_network_function();
    var svg = document.getElementById("svg");
    svg.innerHTML += ctx_bis.svg.htmlElement.innerHTML;
    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);
    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    // add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    // convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    // set url value to a element's href attribute.
    var a = document.createElement("a");
    a.href = url;
    a.download = "plot.svg";
    a.click();
    window.URL.revokeObjectURL(url);

    ctx_bis = canvas_bis.getContext('2d');
}