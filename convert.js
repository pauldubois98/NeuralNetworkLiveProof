ctx = new SVGCanvas(800, 400);
draw_all()
document.getElementById("svg").innerHTML = ctx.svg.htmlElement.innerHTML
// download the svg
var svg_inner = ctx.svg.htmlElement.innerHTML;
//get svg element
var svg = document.getElementById("svg");
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

var a = document.createElement("a");
a.href = url;
a.download = "test.svg";
a.click();
window.URL.revokeObjectURL(url);