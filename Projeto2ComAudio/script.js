var svg = document.getElementById("mainSvg");
var idObject = 0;

//Intersection between two line segments
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

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
		this.drawed = false;
		this.solid = solid;
		this.pos = pos;
		this.vel = [0,0];
		this.bouncy = bouncy;
		this.harmable = harmable;
		this.skin = undefined;
		this.direction = "r";
		this.color = "grey";
		this.type = undefined;
		this.hp = undefined;
		
		idObject=idObject+1;
		
		//SVG Path
		var points = rectanglePoints(0,0,size[0],size[1]);
		points.push(points[0]);
		if(points.length==0) {
			this.path = "";
			return;
		};
		var p = "";
		var p = "M"+points[0][0]+" "+points[0][1];
		
		for(var i=1;i<points.length;i++){
			p = p + " L"+points[i][0]+" "+points[i][1];
		}
		
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

var music = document.getElementById("music");
var currentMusic = document.getElementById("currentMusic");
$("body").keydown(function (event) {
 music.play();
 var buttom = event.keyCode;
 if(!dead){
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
 };
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
	
	//Some functions to make the creation of objects easier
	function ground(x,y,width,height,color){
		object = new Objeto([width,height],true,[x,y],false,false);
		object.color = color;
		listObjects.push(object);
		return;
	};
	
	function breakableGround(x,y,width,height,color,hp){
		object = new Objeto([width,height],true,[x,y],false,false);
		object.color = color;
		object.hp = hp;
		listObjects.push(object);
		return;
	};
	
	function platforms(x,y,width,height){
		object = new Objeto([width,height],true,[x,y],false,false);
		listObjects.push(object);
		return;
	};
	
	function spikes(x,y,dire){
		object = new Objeto([50,50],true,[x,y],true,1);
		object.skin = "images/spikes.svg";
		object.direction = dire;
		listObjects.push(object);
		return;
	};
	
	function smallFly(x,y){
		object = new Objeto([50,50],false,[x,y],true,1);
		object.type = "smallFly";
		object.skin = "images/smallFly.svg";
		object.hp = 2;
		listObjects.push(object);
		return;
	};
	
	//Knight
	listObjects.push(new Objeto([40,80],false,[400,450],false,false));
	
	//Weapon
	listObjects.push(new Objeto([80,80],false,[400,470],false,false));
	
	ground(-500,550,2300,50,"e1a95f");
	breakableGround(-400,0,400,550,"e1a95f",1);
	platforms(800,-200,50,650);
	breakableGround(800,450,50,100,"red",1);
	platforms(1200,430,50,25);
	platforms(1400,330,50,25);
	platforms(1600,250,200,300);
	platforms(1600,0,400,150);
	platforms(1900,250,100,300);
	ground(1900,550,4800,50,"e1a95f");
	platforms(2400,300,200,250);
	spikes(2350,500,"r");
	for(var i=0; i<19; i++) spikes(2600+50*i,500,"r");
	platforms(3550,300,200,250);
	platforms(4000,0,30,450);
	smallFly(4250,50);
	platforms(4500,0,30,450);
	breakableGround(4500,450,30,100,"red",3);
	platforms(4700,0,30,450);
	platforms(4900,100,30,450);
	for(var i=0; i<7; i++){
		spikes(4730,100+i*50,"d");
		spikes(4850,100+i*50,"u");
	};
	platforms(4930,100,300,30);
	platforms(5280,100,500,30);
	platforms(5780,-200,30,650);
	breakableGround(5780,450,30,100,"red",5);
	platforms(5030,420,250,30);
	platforms(5380,420,200,30);
	platforms(6200,420,200,20);
	platforms(6500,350,200,20);
	smallFly(4980,150);
	smallFly(5680,150);
	smallFly(5580,500);
	
	//Tutorials
	//tutorial 1 400/50
	var object = new Objeto([400,50],false,[400,200],false,false);
	object.skin = "images/tutorial1.svg";
	listObjects.push(object);
	//tutorial 2 400/50
	var object = new Objeto([400,50],false,[950,200],false,false);
	object.skin = "images/tutorial2.svg";
	listObjects.push(object);
	//tutorial 3 400/50
	var object = new Objeto([400,50],false,[1600,50],false,false);
	object.skin = "images/tutorial3.svg";
	listObjects.push(object);
	//tutorial 4 400/100
	var object = new Objeto([400,100],false,[2000,100],false,false);
	object.skin = "images/tutorial4.svg";
	listObjects.push(object);
	
	//Lamp
	var object = new Objeto([40,60],false,[6600,490],false,false);
	object.hp = 1;
	object.skin = "images/lamp.svg";
	object.type = "bossActivator1";
	listObjects.push(object);
	
	
	//Life masks
	var lifeMasks = [];
	var currentLife = 5;
	for(i=0;i<5;i++) lifeMasks.push(new Objeto([40,60],false,[(45*i),0],false,false));

	//Special skins
	listObjects[1].skin = "images/slash.svg";
	listObjects[2].color = "e1a95f";
};



//Special attributes
listObjects[1].inScreen = false;
listObjects[0].canJump = true;
listObjects[0].isDashing = false;
listObjects[0].canDash = true;
listObjects[0].invulnerable = false;



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



//Physics and user input
var observerX = 0;
var totalObserverX = 0;
var last = 0;
function updateVel() {	
	//Enemies speed
	updateEnemies();
	
	//Knight movement
	if(keys["left"]) listObjects[0].vel[0] = -1.5;
	else if(keys["right"]) listObjects[0].vel[0] = 1.5;
	else{
		listObjects[0].vel[0] = 0.9*listObjects[0].vel[0];
		if(Math.abs(listObjects[0].vel[0])<0.01) listObjects[0].vel[0] = 0;
	};
	
	//Attack
	if(keys["z"] && weaponInCooldown && !listObjects[0].isDashing){
		objectsHit = [];
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
	
	var now = new Date().getTime();
	var difference = 0;
	if(last != 0){
		difference = now-last;
	}
	last = now;
	
	observerX = listObjects[0].pos[0] - 400;
	//Positions update with the speed vector
	for(var i=0; i<listObjects.length; i++){
		listObjects[i].pos[0] += (0.15)*difference*listObjects[i].vel[0];
		listObjects[i].pos[1] += (0.15)*difference*listObjects[i].vel[1];
	};
	for(var i=0; i<listObjects.length; i++){
		listObjects[i].pos[0] = listObjects[i].pos[0] - observerX;
	};
	
	totalObserverX = totalObserverX - observerX;
	lastSafeSpot[0] = lastSafeSpot[0] - observerX;
};



var lastSafeSpot = [];
var objectsHit = [];
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
					case "d":
						listObjects[0].vel[1] = -4;
						break;
					default:
				};
			};
			
			//Hit damage
			if(result[0] && listObjects[i].hp){
				if(objectsHit.indexOf(i) == -1){
					listObjects[i].hp = listObjects[i].hp - 1;
					objectsHit.push(i);
				};
			};
		};
		
		//Removing objects with life below or equal 0
		for(i=2;i<listObjects.length;i++){
			if(listObjects[i].hp == 0){
				//Bosses activator
				if(listObjects[i].type=="bossActivator1"){
					var object = new Objeto([240,200],false,[listObjects[i].pos[0]+200,0],true,1);
					currentMusic.src = "music/boss.mp3";
					music.load();
					music.play();
					object.type = "vengeflyKing";
					object.skin = "images/vengeflyKing.svg";
					object.hp = 20;
					object.vel = [0,1];
					listObjects.push(object);
					breakableGround(5780+totalObserverX,450,30,100,"red",10);
				};
				if(listObjects[i].type=="vengeflyKing"){
					//tutorial 1 400/50
					var object = new Objeto([200,50],false,[400,250],false,false);
					object.skin = "images/theEnd.svg";
					listObjects.push(object);
					currentMusic.src = "music/queenGardens.mp3";
					music.load();
					music.play();
				};
				
				//Removing
				listObjects[i].remove();
				listObjects.splice(i,1);
			};
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
			if(!listObjects[i].harmable && result[1][1]<0){
				lastSafeSpot = listObjects[0].pos.slice();
			};
		};
		if(result[0] && listObjects[i].harmable && !listObjects[0].invulnerable){
			currentLife = currentLife - listObjects[i].harmable;
			listObjects[0].invulnerable = true;
			intervalResetInvulnerability = setInterval(resetInvulnerability,618);
		};
	};	
	if(flagInAir){
		listObjects[0].canJump = false;
	};
	
	//Collision between enemies and objects
	for(j=2;j<listObjects.length;j++){
		for(i=2;i<listObjects.length;i++){
			var result = checkCollisions(listObjects[i],listObjects[j]);
			if(result[0] && listObjects[i].solid && listObjects[j].type!=undefined){
				if(result[1][1] > 0 && listObjects[j].vel[1]<0) listObjects[j].vel[1] = 0;
				listObjects[j].pos[0] = listObjects[j].pos[0] + result[1][0];
				listObjects[j].pos[1] = listObjects[j].pos[1] + result[1][1];
			};
		};	
	};
	
	//Knight falling in void
	if(listObjects[0].pos[1]>600){
		currentLife = currentLife - 1;
		listObjects[0].pos = lastSafeSpot.slice();
	};
	return;
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
var dead = false;
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
	}else if(!listObjects[0].canJump){
		if(listObjects[0].vel[1]<0) knightAnimation = "jumping";
		else knightAnimation = "falling";
	}else if(listObjects[0].vel[0]!=0) knightAnimation = "walking";
	
	
	if(knightAnimation!="walking"){
		if(flagWalk1){
			clearInterval(intervalWalk);
			flagWalk1 = false;
		};
	};
	
	if(!dead){
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
			case "jumping":
				listObjects[0].skin = "images/knightJumping.svg";
				break;
			case "falling":
				listObjects[0].skin = "images/knightFalling.svg";
				break;
			case "walking":
				if(!flagWalk1) intervalWalk = setInterval(walk,200);
				flagWalk1 = true;
				break;
			default:
				listObjects[0].skin = "images/knightIdle.svg";
		};
	};
	
	//Death
	if(!dead && currentLife <= 0){
		dead = true;
		listObjects[0].remove();
		var dir = listObjects[0].direction;
		listObjects[0] = new Objeto([40,40],false,[listObjects[0].pos[0],listObjects[0].pos[1]+40],false,false);
		listObjects[0].direction = dir;
	};
};



//SUPPORT FUNCTIONS
//Function that resets knight invulnerability
var intervalResetInvulnerability;
function resetInvulnerability(){
	listObjects[0].invulnerable = false;
	clearInterval(intervalResetInvulnerability);
};

//Enemies movement mechanic
function updateEnemies(){
	//Enemys movement
	for(var i=0; i<listObjects.length; i++){
		switch(listObjects[i].type){
			case "smallFly":
				if(!dead){
					var knightInSight = true;
					var midX0 = listObjects[i].pos[0] + listObjects[i].width/2;
					var midY0 = listObjects[i].pos[1] + listObjects[i].height/2;
					var midX = listObjects[0].pos[0] + listObjects[0].width/2;
					var midY = listObjects[0].pos[1] + listObjects[0].height/2;
					if(midX>midX0) listObjects[i].direction = "r";
					else listObjects[i].direction = "l";
					var flagInnerLoop1 = false;
					for(var j=2; j<listObjects.length; j++){
						if(listObjects[j].solid && i!=j){
							var listPoints = rectanglePoints(listObjects[j].pos[0],listObjects[j].pos[1],listObjects[j].width,listObjects[j].height);
							listPoints.push(listPoints[0]);
							for(var k=0; k<listPoints.length-1; k++){
								if(intersects(midX0,midY0,midX,midY,listPoints[k][0],listPoints[k][1],listPoints[k+1][0],listPoints[k+1][1])){
									knightInSight = false;
									flagInnerLoop1 = true;
									break;
								};
							};
						};
						if(flagInnerLoop1) break;
					};
					if(knightInSight){
						var x = listObjects[0].pos[0] - listObjects[i].pos[0] - listObjects[i].width/2 + listObjects[0].width/2;
						var y = listObjects[0].pos[1] - listObjects[i].pos[1] - listObjects[i].height/2 + listObjects[0].height/2;
						var mod = Math.sqrt(x**2+y**2);
						x = x/mod;
						y = y/mod;
						listObjects[i].vel[0] = x;
						listObjects[i].vel[1] = y;
					}else{
						if(Math.abs(listObjects[i].vel[0])+Math.abs(listObjects[i].vel[1])<0.1){
							listObjects[i].vel[0] = 0;
							listObjects[i].vel[1] = 0;
						}else{
							listObjects[i].vel[0] = 0.9*listObjects[i].vel[0];
							listObjects[i].vel[1] = 0.9*listObjects[i].vel[1];
						};
					};
				}else{
					listObjects[i].vel[0] = Math.random()*2-1;
					listObjects[i].vel[1] = Math.random()*2-1;
				};
				break;
			case "vengeflyKing":
				if(listObjects[i].vel[1]>0){
					if(listObjects[i].pos[1] > 600 - listObjects[i].height){
						if(Math.random()<0.3){
							smallFly(Math.random()*800,-10);
						};
						listObjects[i].vel[1] = -1;
						listObjects[i].pos[1] = listObjects[i].pos[1] - 2;
					};
				}else{
					if(listObjects[i].pos[1] < 0){
						if(Math.random()<0.3){
							smallFly(Math.random()*800,-10);
						};
						listObjects[i].vel[1] = 1;
						listObjects[i].pos[1] = listObjects[i].pos[1] + 2;
					};
				};
			default:
		};
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



//Final drawing
function draw() {
	if(dead) listObjects[0].skin = "images/deadHead.svg";
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