var svg = document.getElementById("mainSvg");

var idObject = 0;

class Polygon {
    constructor(points) {
        this.points = points;
        this.id = "obj"+idObject;
		idObject=idObject+1;
		this.drawed = false;
    }

    draw(fill,color,origin,border) {
		if(this.drawed) this.remove();
		
		if(this.points.length==0) return;
		
		var d = "M"+(origin[0]+this.points[0][0])+" "+(origin[1]+this.points[0][1]);
		for(var i=1;i<this.points.length;i++){
			d = d + " L"+(origin[0]+this.points[i][0])+" "+(origin[1]+this.points[i][1]);
		}
		
		d = d +" L"+(origin[0]+this.points[0][0])+" "+(origin[1]+this.points[0][1]);
		
		console.log(d);
		var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
		newElement.setAttribute("d",d);
		newElement.id = this.id;
		newElement.style.stroke = color;
		if(border) newElement.style.strokeWidth = "5px";
		newElement.style.fill = color;
		if(!fill) newElement.style.fill = "none"; 
				
		svg.appendChild(newElement);
		
		this.drawed = true;
		
		return;
    }
	
	remove() {
		if(!this.drawed) return;
		
		var myObj = document.getElementById(this.id);
		svg.removeChild(myObj);
		return;
	}
}

function Rectangle(x,y,width,height){
	return new Polygon([[x,y],[x+width,y],[x+width,y+height],[x,y+height]]);
}

var x = null;
var y = null;

var svgX = svg.getBoundingClientRect().x;
var svgY = svg.getBoundingClientRect().y;
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
    
function onMouseUpdate(e) {
  x = e.pageX;
  y = e.pageY;
}

var r = 0;
var rX = 512;
var rY = 384;
var tlx = 0;
var tly = 0;
$("body").keydown(function (event) {
 var buttom = event.keyCode;
 
 //r
 if(buttom==82){
	 rX = x-svgX;
	 rY = y-svgY;
	 r=r+10;
	 for(var i=0; i<idObject ; i++){
		 var object = svg.getElementById("obj"+i);
		 object.setAttribute("transform","translate("+tlx+" "+tly+")"+"rotate("+r+" "+rX+" "+rY+")");
	 }
 }
 
 //t
 if(buttom==84){
	 tlx = x-svgX-512;
	 tly = y-svgY-384;
	 for(var i=0; i<idObject ; i++){
		 var object = svg.getElementById("obj"+i);
		 object.setAttribute("transform","translate("+tlx+" "+tly+")"+"rotate("+r+" "+rX+" "+rY+")");}
 }
})

//Nuvens
Rectangle(40,25,200,100).draw(true,"skyblue",[0,0],false);
Rectangle(300,50,200,100).draw(true,"skyblue",[0,0],false);
Rectangle(550,30,200,100).draw(true,"skyblue",[0,0],false);
Rectangle(790,60,200,100).draw(true,"skyblue",[0,0],false);

//Casa
Rectangle(45,473,310,210).draw(false,"rgb(245, 247, 247)",[0,0],true);
Rectangle(50,468,300,200).draw(true,"green",[0,0],false);
Rectangle(45,563,310,170).draw(false,"rgb(245, 247, 247)",[0,0],true);
(new Polygon([[45,473],[355,473],[320,400],[80,400]])).draw(true,"yellow",[0,0],false);
Rectangle(100,500,50,50).draw(true,"lightblue",[0,0],false);
Rectangle(250,500,50,50).draw(true,"lightblue",[0,0],false);
Rectangle(100,580,50,50).draw(true,"lightblue",[0,0],false);
Rectangle(250,580,50,50).draw(true,"lightblue",[0,0],false);
Rectangle(175,590,50,80).draw(true,"red",[0,0],false);
//Chao
Rectangle(0,668,1024,100).draw(true,"rgb(101,67,33)",[0,0],false);
