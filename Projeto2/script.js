var svg = document.getElementById("mainSvg");

var idObject = 0;

//Generate points of a rectangle
function rectanglePoints(x,y,width,height){
	return [[x,y],[x+width,y],[x+width,y+height],[x,y+height]];
}



//Objects class
class Objeto {	
	
    constructor(size,solid,pos,bouncy,harmable) {
		//Internal Values
        this.id = "obj"+idObject;
		this.width = size[0];
		this.height = size[1];
		idObject=idObject+1;
		this.drawed = false;
		this.solid = solid;
		this.pos = pos;
		this.vel = [0,0];
		this.bouncy = bouncy;
		this.harmable = harmable;
		this.skin = undefined;
		this.direction = "r";
		this.color = "grey";
		
		//SVG Path
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
		//Drawing the object
		
		//If already drawn, remove
		if(this.drawed) this.remove();
		
		//Creating the SVG element
		if (!this.skin){
			var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			newElement.setAttribute("d",this.path);
			newElement.setAttribute("transform","translate("+this.pos[0]+" "+this.pos[1]+")");
			newElement.id = this.id;
			newElement.style.stroke = "black";
			newElement.style.fill = this.color;
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
		//Function to remove the object from the screen
		if(!this.drawed) return;
		
		var myObj = document.getElementById(this.id);
		svg.removeChild(myObj);
		this.drawed = false;
		return;
	}
}



//Mouse position
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



//User input
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



//Game objects
{
var listObjects = [];
var lifeMasks = [];
//Knight
listObjects.push(new Objeto([40,80],false,[280,470],false,false));
//Weapon
listObjects.push(new Objeto([80,80],false,[400,470],false,false));
//Ground
listObjects.push(new Objeto([800,50],true,[0,550],false,false));
//Platforms
listObjects.push(new Objeto([50,20],true,[150,500],false,false));
listObjects.push(new Objeto([50,20],true,[350,400],false,false));
listObjects.push(new Objeto([50,20],true,[550,300],false,false));
listObjects.push(new Objeto([100,20],true,[700,200],false,false));
//Border
//listObjects.push(new Objeto([50,600],true,[-50,0],false,false));
//listObjects.push(new Objeto([800,50],true,[0,-50],false,false));
//listObjects.push(new Objeto([50,600],true,[800,0],false,false));
//Life masks
var currentLife = 5;
for(i=0;i<5;i++) lifeMasks.push(new Objeto([40,60],false,[(45*i),0],false,false));
//Spikes
listObjects.push(new Objeto([46,50],true,[152,450],true,1));
};

//Special attributes
listObjects[1].inScreen = false;
listObjects[0].canJump = true;
listObjects[0].isDashing = false;
listObjects[0].canDash = true;
listObjects[0].invulnerable = false;

//Skins
listObjects[0].skin = "images/knightIdle.svg";
listObjects[1].skin = "images/slash.svg";
listObjects[2].color = "e1a95f";
listObjects[7].skin = "images/spikes.svg";



//Collision checking
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
			//bottom right
		}else if(bottom && !right){
			//bottom left
			smallestVector[0] = -smallestVector[0];
		}else if(!bottom && right){
			//up right
			smallestVector[1] = -smallestVector[1];	
		}else{
			//up left
			smallestVector[0] = -smallestVector[0];
			smallestVector[1] = -smallestVector[1];
		};
		return [true,smallestVector];
	}else return [false];
};
//Verifying collisions
function updateCollisions(){
	//Collision between weapon and objects
	if(listObjects[1].inScreen){
		for(i=2;i<listObjects.length;i++){
			var result = checkCollisions(listObjects[i],listObjects[1]);
			//Bouncy effect
			if(result[0] && listObjects[i].bouncy){
				switch(listObjects[1].direction){
					case "r":
						listObjects[0].vel[0] = -3;
						break;
					case "l":
						listObjects[0].vel[0] = 3;
						break;
					case "u":
						listObjects[0].vel[1] = 4;
						break;
					case "d":
						listObjects[0].vel[1] = -4;
						break;
					default:
				};
			};
			
			//Hitting effect
		};
	};
	
	//Collision between knight and objects
	var flagInAir = true;
	for(i=2;i<listObjects.length;i++){
		var result = checkCollisions(listObjects[i],listObjects[0]);
		if(result[0] && listObjects[i].solid){
			flagInAir = false;
			if(result[1][1] < 0) listObjects[0].canJump = true;
			if(result[1][1] > 0 && listObjects[0].vel[1]<0) listObjects[0].vel[1] = 0;
			listObjects[0].pos[0] = listObjects[0].pos[0] + result[1][0];
			listObjects[0].pos[1] = listObjects[0].pos[1] + result[1][1];
		};
		if(result[0] && listObjects[i].harmable && !listObjects[0].invulnerable){
			console.log(listObjects[0].invulnerable);
			currentLife = currentLife - listObjects[i].harmable;
			listObjects[0].invulnerable = true;
			intervalResetInvulnerability = setInterval(resetInvulnerability,618);
		};
	};	
	if(flagInAir) listObjects[0].canJump = false;	
	return;
};

//Function that resets knight invulnerability
var intervalResetInvulnerability;
function resetInvulnerability(){
	listObjects[0].invulnerable = false;
	clearInterval(intervalResetInvulnerability);
};



//Physics and user input
var observerX = 0;
var observerY = 0;
function updateVel() {	
	//Knight movement
	if(keys["left"]) listObjects[0].vel[0] = -1.5;
	else if(keys["right"]) listObjects[0].vel[0] = 1.5;
	else{
		listObjects[0].vel[0] = 0.9*listObjects[0].vel[0];
		if(Math.abs(listObjects[0].vel[0])<0.01) listObjects[0].vel[0] = 0;
	};
	
	//Attack
	if(keys["z"] && weaponInCooldown && !listObjects[0].isDashing){
		listObjects[1].inScreen = true;
		weaponInCooldown = false;
		intervalResetWeapon = setInterval(resetWeapon, 300);
	};
	
	//Jump
	if(keys["x"] && listObjects[0].canJump){
		listObjects[0].vel[1] = -3.7;
		listObjects[0].canJump = false;
	};
	
	//Dash
	if(keys["c"] && listObjects[0].canDash && !listObjects[1].inScreen){
		listObjects[0].isDashing = true;
		listObjects[0].canDash = false;
		intervalResetDash = setInterval(resetDash, 500);		
	};
	
	//Gravity
	if(listObjects[0].vel[1]<3) listObjects[0].vel[1] += 0.05;
	else listObjects[0].vel[1] = 3;
	
	//Dash speed
	if(listObjects[0].isDashing){
		listObjects[0].vel[1] = 0;
		if(listObjects[0].direction == "r"){
			listObjects[0].vel[0] = 3;
		}else{
			listObjects[0].vel[0] = -3;
		};
	};
	
	observerX = listObjects[0].pos[0] - 400;
	//Positions update with the speed vector
	for(var i=0; i<listObjects.length; i++){
		listObjects[i].pos[0] = listObjects[i].pos[0] + listObjects[i].vel[0];
		listObjects[i].pos[1] = listObjects[i].pos[1] + listObjects[i].vel[1];
	};
	for(var i=0; i<listObjects.length; i++){
		listObjects[i].pos[0] = listObjects[i].pos[0] - observerX;
	};
};



//Attack and knight directions
function checkAttacking(){	
	//Updating direction of the attack
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
	
	//Updating position of the attack
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
	
	//Updating direction of the knight
	if(!listObjects[1].inScreen){
		if(keys["left"] && keys["right"]) {
			if(listObjects[0].vel[0]>0) listObjects[0].direction = "r";
			else listObjects[0].direction = "l";
		}
		else if(keys["left"] && listObjects[0].direction == "r" && !listObjects[0].isDashing) listObjects[0].direction = "l";
		else if(keys["right"] && listObjects[0].direction == "l" && !listObjects[0].isDashing) listObjects[0].direction = "r";
	};
};



//Attack interval
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

//Dash interval
var intervalResetDashCooldown;
var intervalResetDash;
function resetDash(){
	listObjects[0].isDashing = false;
	intervalResetDashCooldown = setInterval(resetDashCooldown,1000);
	clearInterval(intervalResetDash);
};
function resetDashCooldown(){
	listObjects[0].canDash = true;
	clearInterval(intervalResetDashCooldown);
};



//Life update
function updateLife(){
	if(currentLife < 0) currentLife = 0;
	for(var i=0; i<lifeMasks.length; i++){
		if(i<currentLife) lifeMasks[i].skin = "images/maskShard.svg";
		else lifeMasks[i].skin = "images/emptyMaskShard.svg";
	}
};



//Animation in general
//Will be all commented in the future
var flagWalk2 = true;
function walk(){
	if(flagWalk2){
		listObjects[0].skin = "images/knightWalk1.svg";
		flagWalk2 = false;
	}else{
		listObjects[0].skin = "images/knightWalk2.svg";
		flagWalk2 = true;
	};
};
var knightAnimation;
var flagWalk1 = false;
var intervalWalk;
function animate(){
	knightAnimation = "idle";
	if(listObjects[0].isDashing) knightAnimation = "dashing";
	else if(listObjects[1].inScreen){
		if(listObjects[1].direction == "u") knightAnimation = "attackingU";
		else if(listObjects[1].direction == "d") knightAnimation = "attackingD";
		else knightAnimation = "attackingH";
	}else if(listObjects[0].vel[0]!=0) knightAnimation = "walking";
	
	
	if(knightAnimation!="walking"){
		if(flagWalk1){
			clearInterval(intervalWalk);
			flagWalk1 = false;
		};
	};
	switch(knightAnimation){
		case "attackingH":
			listObjects[0].skin = "images/knightHorAttack.svg";
			break;
		case "attackingU":
			listObjects[0].skin = "images/knightUpAttack.svg";
			break;
		case "attackingD":
			listObjects[0].skin = "images/knightDownAttack.svg";
			break;
		case "dashing":
			listObjects[0].skin = "images/knightDash.svg";
			break;
		case "walking":
			if(!flagWalk1) intervalWalk = setInterval(walk,200);
			flagWalk1 = true;
			break;
		default:
			listObjects[0].skin = "images/knightIdle.svg";
	};
};



//Final drawing
function draw() {
	checkAttacking();
	updateVel();
	updateCollisions();
	updateLife();
	animate();
	
	//Drawing objects
	for(var i=0; i<listObjects.length; i++){	
		if(i!=1) listObjects[i].draw();
		else if(listObjects[i].inScreen) listObjects[i].draw();
		else listObjects[i].remove();
	};
	
	//Drawing lifemasks
	for(var i=0; i<lifeMasks.length; i++){
		lifeMasks[i].draw();
	};
};



//Calling the function draw every 5ms
setInterval(draw,5);

