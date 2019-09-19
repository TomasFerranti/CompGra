var canvas1 = document.getElementById("imagem1");
var ctx1 = canvas1.getContext("2d");

var canvasF = document.getElementById("imagemFinal");
var ctxF = canvasF.getContext("2d");
	
var img1 = new Image();
var img2 = new Image();

img1.crossOrigin = '';
img2.crossOrigin = '';

img1.src = 'https://raw.githubusercontent.com/TomasFerranti/CompGra/master/images/ex_11.jpg';
img2.src = 'https://raw.githubusercontent.com/TomasFerranti/CompGra/master/images/ex_12.png';

img1.onload = function(){
	ctx1.drawImage(img1, 0, 0, 500, 500);	
};	    

img2.onload = function(){
	ctx1.drawImage(img2, 600, 0, 500, 500);
};



function updateFigure1(){
	x = prompt("Por favor insira a URL da imagem desejada.");
	img1.src = x;
};

function updateFigure2(){
	x = prompt("Por favor insira a URL da imagem desejada.");
	img2.src = x;
};

var form = document.querySelector("form");
var log = document.querySelector("#log");

var f = function (a,b){
	a = a/255;
	b = b/255;
	y = (a+b)/2;
	y = y*255;
	return y;
};

form.addEventListener("submit", function(event) {
	var data = new FormData(form);
	for(var p of data.entries()){
		mode = p[1];
	};
	switch(mode){
		case "1":
			//darken
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = Math.min(a,b);
				y = y*255;
				return y;
			};
			break;
		case "2":
			//multiply
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = a*b;
				y = y*255;
				return y;
			};
			break;
		case "3":
			//color burn
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = 1-(1-a)/b;
				y = y*255;
				return y;
			};
			break;
		case "4":
			//linear burn
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = a+b-1;
				y = y*255;
				return y;
			};
			break;
		case "5":
			//lighten
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = Math.max(a,b);
				y = y*255;
				return y;
			};
			break;
		case "6":
			//screen
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = 1-(1-a)*(1-b);
				y = y*255;
				return y;
			};
			break;
		case "7":
			//color dodge
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = a/(1-b);
				y = y*255;
				return y;
			};
			break;
		case "8":
			//linear dodge
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = a+b;
				y = y*255;
				return y;
			};
			break;
		case "9":
			//overlay
			f = function (a,b){
				a = a/255;
				b = b/255;
				if(a>0.5){
					y = 1-(1-2*(a-0.5))*(1-b);
				}else{
					y = 2*a*b;
				}
				y = y*255;
				return y;
			};
			break;
		case "10":
			//soft light
			f = function (a,b){
				a = a/255;
				b = b/255;
				if(b<0.5){
					y = 2*a*b+a*a*(1-2*b);
				}else{
					y = 2*a*(1-b)+Math.sqrt(a)*(2*b-1);
				}
				y = y*255;
				return y;
			};
			break;
		case "11":
			//hard light
			f = function (a,b){
				a = a/255;
				b = b/255;
				if(a>0.5){
					y = 1-(1-a)*(1-2*(b-0.5));
				}else{
					y = a*2*b;
				}
				y = y*255;
				return y;
			};
			break;
		case "12":
			//vivid light
			f = function (a,b){
				a = a/255;
				b = b/255;
				if(a>0.5){
					y = 1-(1-a)/(2*(b-0.5));
				}else{
					y = a/(1-2*b);
				}
				y = y*255;
				return y;
			};
			break;
		case "13":
			//linear light
			f = function (a,b){
				a = a/255;
				b = b/255;
				if(a>0.5){
					y = a+2*(b-0.5);
				}else{
					y = a+2*b-1;
				}
				y = y*255;
				return y;
			};
			break;
		case "14":
			//pin light
			f = function (a,b){
				a = a/255;
				b = b/255;
				if(a>0.5){
					y = Math.max(a,2*(b-0.5));
				}else{
					y = Math.min(a,2*b);
				}
				y = y*255;
				return y;
			};
			break;
		case "15":
			//difference
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = Math.abs(a-b);
				y = y*255;
				return y;
			};
			break;
		case "16":
			//exclusion
			f = function (a,b){
				a = a/255;
				b = b/255;
				y = 0.5-2*(a-0.5)*(b-0.5);
				y = y*255;
				return y;
			};
			break;
		default:
			alert("Por favor escolha um método");
	};
	event.preventDefault();
}, false);
	
function drawFigure3(){
	img1Data = ctx1.getImageData(0,0,500,500);
	img2Data = ctx1.getImageData(600,0,500,500);
	imgF1Data = img1Data;
	for (let i = 0; i < img1Data.data.length; i += 4) {
		if(i-Math.floor(i/(4*500))*4*500>4*250){
			imgF1Data.data[i] = f(img1Data.data[i] , img2Data.data[i-4*250]);
			imgF1Data.data[i+1] = f(img1Data.data[i+1] , img2Data.data[i+1-4*250]);
			imgF1Data.data[i+2] = f(img1Data.data[i+2] , img2Data.data[i+2-4*250]);
			imgF1Data.data[i+3] = 255;
		}
	}
	
	
	img1Data = ctx1.getImageData(0,0,500,500);
	img2Data = ctx1.getImageData(600,0,500,500);
	imgF2Data = img2Data;
	for (let i = 0; i < img1Data.data.length; i += 4) {
		imgF2Data.data[i] = f(img1Data.data[i] , img2Data.data[i]);
		imgF2Data.data[i+1] = f(img1Data.data[i+1] , img2Data.data[i+1]);
		imgF2Data.data[i+2] = f(img1Data.data[i+2] , img2Data.data[i+2]);
		imgF2Data.data[i+3] = 255;
	}
	ctxF.putImageData(imgF2Data, 0, 0);
};

function swapImages(){
	x = img1.src;
	img1.src = img2.src;
	img2.src = x;
}