var svg = document.getElementById("mainSvg");

var idObject = 0;

//Função que gera os pontos de um retangulo
function rectanglePoints(x,y,width,height){
	return [[x,y],[x+width,y],[x+width,y+height],[x,y+height]];
}



//Criando uma classe para facilitar os desenhos
class Objeto {	
	
    constructor(size,solid,pos,vel,bouncy,harmable) {
		//Valores internos
        this.id = "obj"+idObject;
		this.width = size[0];
		this.height = size[1];
		idObject=idObject+1;
		this.drawed = false;
		this.solid = solid;
		this.pos = pos;
		this.vel = vel;
		this.bouncy = bouncy;
		this.harmable = harmable;
		this.skin = undefined;
		this.direction = "r";
		this.color = "grey";
		
		//Construindo o path do SVG que a compõe:
		var points = rectanglePoints(0,0,size[0],size[1]);
		if(points.length==0) {
			this.path = "";
			return;
		};
		var p = "";
		var p = "M"+points[0][0]+" "+points[0][1];
		
		for(var i=1;i<points.length;i++){
			p = p + " L"+points[i][0]+" "+points[i][1];
		}
		
		p = p +" L"+points[0][0]+" "+points[0][1];
		
		this.path = p;
    }

    draw() {
		//Comando de desenhar o objeto
		
		//Se já desenhado
		if(this.drawed) this.remove();
		
		//Crio o elemento SVG e atribuo seus valores
		if (!this.skin){
			var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			newElement.setAttribute("d",this.path);
			newElement.setAttribute("transform","translate("+this.pos[0]+" "+this.pos[1]+")");
			newElement.id = this.id;
			newElement.style.stroke = "black";
			newElement.style.fill = this.color;
			if(!this.solid) newElement.style.fill = "none"; 
					
			//Adicionando ele ao SVG
			svg.appendChild(newElement);
		}else{
			var mySkin = document.createElementNS("http://www.w3.org/2000/svg", 'image');
			mySkin.setAttribute("id",this.id);
			mySkin.setAttribute("x",this.pos[0]);
			mySkin.setAttribute("y",this.pos[1]);
			mySkin.setAttribute("href",this.skin);
			mySkin.setAttribute("width",this.width);
			mySkin.setAttribute("height",this.height);
			if(this.direction == "l") mySkin.setAttribute("transform","translate("+(this.pos[0]+this.width/2)+" "+(this.pos[1]+this.height/2)+") scale(-1,1) "+"translate("+(-this.pos[0]-this.width/2)+" "+(-this.pos[1]-this.height/2)+")");
			if(this.direction == "u") mySkin.setAttribute("transform","translate("+(this.pos[0]+this.width/2)+" "+(this.pos[1]+this.height/2)+") rotate(-90) "+"translate("+(-this.pos[0]-this.width/2)+" "+(-this.pos[1]-this.height/2)+")");
			if(this.direction == "d") mySkin.setAttribute("transform","translate("+(this.pos[0]+this.width/2)+" "+(this.pos[1]+this.height/2)+") rotate(90) "+"translate("+(-this.pos[0]-this.width/2)+" "+(-this.pos[1]-this.height/2)+")");
			svg.appendChild(mySkin);
		}
		
		this.drawed = true;
		
		return;
    }
	
	remove() {
		//Função para remover o objeto do desenho
		if(!this.drawed) return;
		
		var myObj = document.getElementById(this.id);
		svg.removeChild(myObj);
		this.drawed = false;
		return;
	}
}



//Tratando a posição do mouse
/*
var mouseX = null;
var mouseY = null;

var svgX = svg.getBoundingClientRect().x;
var svgY = svg.getBoundingClientRect().y;
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
    
function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}
*/



//Tratando a entrada do usuário
var keys = {
    up: false,
    left: false,
	right: false,
	down: false,
	z: false,
	x: false,
	c: false
};

$("body").keydown(function (event) {
 var buttom = event.keyCode;
 //left code = 37
 if(buttom==37){
	keys["left"] = true;
 }
 
 //up code = 38
 if(buttom==38){
	keys["up"] = true;
 }
 
 //right code = 39
 if(buttom==39){
	keys["right"] = true;
 }
 
 //down code = 40
 if(buttom==40){
	keys["down"] = true;
 }
 
 //z code = 90
 if(buttom==90){
	keys["z"] = true;
 }
 
 //x code = 88
 if(buttom==88){
	keys["x"] = true;
 }
 
 //c code = 67
 if(buttom==67){
	keys["c"] = true;
 }
})

$("body").keyup(function (event) {
 var buttom = event.keyCode;
 //left code = 37
 if(buttom==37){
	keys["left"] = false;
 }
 
 //up code = 38
 if(buttom==38){
	keys["up"] = false;
 }
 
 //right code = 39
 if(buttom==39){
	keys["right"] = false;
 }
 
 //down code = 40
 if(buttom==40){
	keys["down"] = false;
 }
 
 //z code = 90
 if(buttom==90){
	keys["z"] = false;
 }
 
 //x code = 88
 if(buttom==88){
	keys["x"] = false;
 }
 
 //c code = 67
 if(buttom==67){
	keys["c"] = false;
 }
})



//Criando os objetos
listObjects = [];
//Knight
listObjects.push(new Objeto([40,80],false,[380,470],[0,0],false,false));
//Weapon
listObjects.push(new Objeto([80,80],false,[400,470],[0,0],false,false));
//Ground
listObjects.push(new Objeto([800,50],true,[0,550],[0,0],false,false));
//Plataformas
listObjects.push(new Objeto([100,20],true,[0,350],[0,0],false,false));
listObjects.push(new Objeto([100,20],true,[600,350],[0,0],false,false));
listObjects.push(new Objeto([100,20],true,[350,250],[0,0],false,false));
listObjects.push(new Objeto([200,20],true,[0,150],[0,0],false,false));
//Borda
listObjects.push(new Objeto([50,600],true,[-50,0],[0,0],false,false));
listObjects.push(new Objeto([800,50],true,[0,-50],[0,0],false,false));
listObjects.push(new Objeto([50,600],true,[800,0],[0,0],false,false));

//Atributos especiais de alguns objetos
listObjects[1].inScreen = false;
listObjects[0].canJump = true;

//Colocando skins
listObjects[0].skin = "svgKnight.svg";
listObjects[1].skin = "slash.svg";
listObjects[2].color = "e1a95f";



//Verificando colisões entre o knight, sua arma e os objetos
//Função que verifica colisão entre dois objetos, retornando [false,[0,0]] se não há colisão
//e retornando [true,[x,y]] se há colisão, sendo que [x,y] é o vetor de menor módulo que
//desloca o retangulo passado como segundo parametro
function checkCollisions(object1,object2){
	var center1 = [object1.pos[0]+object1.width/2,object1.pos[1]+object1.height/2];
	var center2 = [object2.pos[0]+object2.width/2,object2.pos[1]+object2.height/2];
	var vector = [center2[0]-center1[0],center2[1]-center1[1]];
	if(Math.abs(vector[0])<object1.width/2+object2.width/2 && Math.abs(vector[1])<object1.height/2+object2.height/2){
		var bottom = true;
		var right = true;
		if(vector[0]<0) right = false;
		if(vector[1]<0) bottom = false;
		var smallestVector = [object1.width/2 + object2.width/2 - Math.abs(vector[0]), object1.height/2 + object2.height/2 - Math.abs(vector[1])];
		if(Math.abs(smallestVector[0])>Math.abs(smallestVector[1])) smallestVector[0] = 0;
		else smallestVector[1] = 0;
		if(bottom && right){
			//baixo direita
		}else if(bottom && !right){
			//baixo esquerda
			smallestVector[0] = -smallestVector[0];
		}else if(!bottom && right){
			//cima direita
			smallestVector[1] = -smallestVector[1];	
		}else{
			//cima esquerda
			smallestVector[0] = -smallestVector[0];
			smallestVector[1] = -smallestVector[1];
		};
		return [true,smallestVector];
	}else return [false];
};

//Verificando colisões entre os objetos
function updateCollisions(){
	var flagInAir = true;
	for(i=2;i<listObjects.length;i++){
		var result = checkCollisions(listObjects[i],listObjects[0]);
		if(result[0]){
			flagInAir = false;
			if(result[1][1] < 0) listObjects[0].canJump = true;
			if(result[1][1] > 0 && listObjects[0].vel[1]<0) listObjects[0].vel[1] = 0;
			listObjects[0].pos[0] = listObjects[0].pos[0] + result[1][0];
			listObjects[0].pos[1] = listObjects[0].pos[1] + result[1][1];
		};
	};
	if(flagInAir) listObjects[0].canJump = false;
	return;
};



//Atualizando velocidades
function updateVel() {	
	//Update with keys
	if(keys["left"]) listObjects[0].vel[0] = -1.5;
	else if(keys["right"]) listObjects[0].vel[0] = 1.5;
	else listObjects[0].vel[0] = 0;
	
	//Attack
	if(keys["z"] && weaponInCooldown){
		listObjects[1].inScreen = true;
		weaponInCooldown = false;
		intervalResetWeapon = setInterval(resetWeapon, 300);
	};
	
	//Jump
	if(keys["x"] && listObjects[0].canJump){
		listObjects[0].vel[1] = -5;
		listObjects[0].canJump = false;
	};
	
	//Gravity
	if(listObjects[0].vel[1]<3) listObjects[0].vel[1] += 0.05;
	else listObjects[0].vel[1] = 3;
	
	//Final update
	for(var i=0; i<listObjects.length; i++){
		listObjects[i].pos[0] = listObjects[i].pos[0] + listObjects[i].vel[0];
		listObjects[i].pos[1] = listObjects[i].pos[1] + listObjects[i].vel[1];
	};
};



//Função que lida com o ataque do personagem e atualiza suas direções
function checkAttacking(){	
	//Atualizando a direção do ataque
	if(!listObjects[1].inScreen){
		listObjects[1].direction = listObjects[0].direction;
		if(keys["left"]){
			listObjects[1].direction = "l";
		}else if(keys["right"]){
			listObjects[1].direction = "r";
		}else if(keys["up"]){
			listObjects[1].direction = "u";
		}else if(keys["down"]){
			listObjects[1].direction = "d";
		};
	};
	
	//Atualizando a posição do ataque
	switch(listObjects[1].direction){
		case "l":
			listObjects[1].pos[0] = listObjects[0].pos[0] + listObjects[0].width/2 - listObjects[1].width;
			listObjects[1].pos[1] = listObjects[0].pos[1];
			break;
		case "r":
			listObjects[1].pos[0] = listObjects[0].pos[0] + listObjects[0].width/2;
			listObjects[1].pos[1] = listObjects[0].pos[1];
			break;
		case "d":
			listObjects[1].pos[0] = listObjects[0].pos[0] + listObjects[0].width/2 - listObjects[1].width/2;
			listObjects[1].pos[1] = listObjects[0].pos[1] + listObjects[1].height/2;
			break;
		case "u":
			listObjects[1].pos[0] = listObjects[0].pos[0] + listObjects[0].width/2 - listObjects[1].width/2;
			listObjects[1].pos[1] = listObjects[0].pos[1] - listObjects[1].height/2;
			break;
		default:
	};
	
	//Atualizando a direção do personagem
	if(keys["left"] && keys["right"]) {}
	if(keys["left"] && listObjects[0].direction == "r") listObjects[0].direction = "l";
	if(keys["right"] && listObjects[0].direction == "l") listObjects[0].direction = "r";
};



//Seção que lida com o ataque
var weaponInCooldown = true;
var intervalResetWeaponCooldown;
var intervalResetWeapon;
function resetWeapon(){
	listObjects[1].inScreen = false;
	weaponInCooldown = false;
	intervalResetWeaponCooldown = setInterval(resetWeaponCooldown,500);
	clearInterval(intervalResetWeapon);
};
function resetWeaponCooldown(){
	weaponInCooldown = true;
	clearInterval(intervalResetWeaponCooldown);
};



//Desenhando os objetos da lista
function draw() {
	//Checando se está atacando e atualiza direções
	checkAttacking();

	//Atualizando velocidades
	updateVel();
	
	//Checando colisões
	updateCollisions();
	
	//Desenhando
	for(var i=0; i<listObjects.length; i++){	
		if(i!=1) listObjects[i].draw();
		else if(listObjects[i].inScreen) listObjects[i].draw();
		else listObjects[i].remove();
	};
};



//Desenhando e atualizando os valores
setInterval(draw,5);