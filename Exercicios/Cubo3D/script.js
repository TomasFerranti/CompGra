//Algumas variáveis globais
var gl;
var shaderProgram;
var cuboVertexPositionBuffer;
var cuboVertexColorBuffer;
var cuboVertexIndexBuffer;
var rCubo = 0;
var ultimo = 0;

//Matrizes de transformação usando um sistema de pilha
var mMatrix = mat4.create();
var mMatrixPilha = [];
var pMatrix = mat4.create();
var vMatrix = mat4.create();

//Iniciar o ambiente quando a página for carregada
$(function(){
	iniciaWebGL();
});

//Iniciar o nosso canvas com webGl3D
function iniciaWebGL(){
	var canvas = $('#canvasWebGl3D')[0]; // Pegando seu id
	iniciarGL(canvas); 					 // Definir o canvas com webgl 3D
	iniciarShaders();  					 // Obter e processar os Shaders
	iniciarBuffers();  					 // Enviar o cubo para a GPU
	iniciarAmbiente(); 					 // Definir background e cor do objeto
	tick();            					 // Desenho dos objetos
}

//Iniciando o WebGL 3D
function iniciarGL(canvas){
	try{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		//Definindo a nossa viewPort como o tamanho do canvas
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}catch(e){
		//Se não inicializou retorne um aviso
		if(!gl){
			alert("Não pode inicializar WebGL, desculpe");
		}			
	}
}

//Função que pega o shader dado o id do script
function getShader(gl, id){
	//Pegando nosso script
	var shaderScript = $(id)[0];
	if(!shaderScript){
		return null;
	}
	
	//Identificando sua origem
	var shaderSourceStr = "";
	var k = shaderScript.firstChild;
	while(k){
		if(k.nodeType == 3)
		shaderSourceStr += k.textContent;
		k = k.nextSibling;
	}
	
	//Criando seu shader
	var shader;
	if(shaderScript.type == "x-shader/x-fragment"){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}else if(shaderScript.type == "x-shader/x-vertex"){
		shader = gl.createShader(gl.VERTEX_SHADER);
	}else{
		return null;
	}
	
	//Dizendo sua origem e compilando
	gl.shaderSource(shader, shaderSourceStr);
	gl.compileShader(shader);

	//Se não compilou retorne um aviso
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function iniciarShaders(){
	//Pegando shaders dos dois scripts vS e fS
	var vertexShader = getShader(gl, "#shader-vs");
	var fragmentShader = getShader(gl, "#shader-fs");

	//Criando um programa para linkar com o vS (vertex shader) e fS(fragmentSHader)
	//Esse programar irá lidar com a entrada para os shaders
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	//Se não conseguiu inicializar
	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		alert("Não pode inicializar shaders");
	}

	//Usando o programa
	gl.useProgram(shaderProgram);
	
	//Estabelecendo atributos do programa como:
	//Posição
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	//Cores
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	//Matrizes de transformação
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
}

function iniciarBuffers(){
	//Carregando os vertices do cubo e linkando com o ARRAY_BUFFER
	cuboVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
	vertices = [
	// Front face
	-1.0, -1.0,  1.0,
	1.0, -1.0,  1.0,
	1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,

	// Back face
	-1.0, -1.0, -1.0,
	-1.0,  1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0, -1.0, -1.0,

	// Top face
	-1.0,  1.0, -1.0,
	-1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
	1.0,  1.0, -1.0,

	// Bottom face
	-1.0, -1.0, -1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0,  1.0,
	-1.0, -1.0,  1.0,

	// Right face
	1.0, -1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0,  1.0,  1.0,
	1.0, -1.0,  1.0,

	// Left face
	-1.0, -1.0, -1.0,
	-1.0, -1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0,  1.0, -1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cuboVertexPositionBuffer.itemSize = 3;
	cuboVertexPositionBuffer.numItems = 4;

	//Carregando as cores do cubo e linkando com o ARRAY_BUFFER
	cuboVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexColorBuffer);
	//Criando um array com 24*4 valores que indica as cores do cubo
	//No nosso caso, todas faces são pretas
	cores = [0.0, 0.0, 0.0, 1.0];
	var coresReplicadas = [];
	for (var j=0; j < 24; j++) {
		coresReplicadas = coresReplicadas.concat(cores);
	}
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coresReplicadas), gl.STATIC_DRAW);
	cuboVertexColorBuffer.itemSize = 4;
	cuboVertexColorBuffer.numItems = 24;

	//Carregando o index dos vértices do cubo com as respectivas cores
	cuboVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
	var indices = [
	0, 1, 2,      0, 2, 3,    // Frente
	4, 5, 6,      4, 6, 7,    // Trás
	8, 9, 10,     8, 10, 11,  // Topo
	12, 13, 14,   12, 14, 15, // Base
	16, 17, 18,   16, 18, 19, // Direita
	20, 21, 22,   20, 22, 23  // Esquerda
	]
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	cuboVertexIndexBuffer.itemSize = 1;
	cuboVertexIndexBuffer.numItems = 36;
}

//Iniciando o ambiente 3D
function iniciarAmbiente(){
	//Limpa a tela com uma cor específica, no nosso caso cinza
	gl.clearColor(0.8, 0.8, 0.8, 1.0);
	//DEPTH_TEST seria o de testar qual objeto está na frente um do outro
	//para não realizar desenhos desnecessários
	gl.enable(gl.DEPTH_TEST);
}

//Desenhando os nossos elementos
function tick(){
	//Função específica para próxima repintura: ela mesma
	requestAnimFrame(tick);
	//Desenho os objetos
	desenharCena();
	//Calculo os valores de animação
	animar();
}

function setMatrixUniforms(){
	//Atribuindo as matrizes de transformação
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
}

function desenharCena(){
	//Limpando os buffers
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//Criando as matrizes de transformação
	//Configuração da câmera: perspective(out, fovy, aspect, near, far)
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	//Tornando as duas matrizes identidade
	mat4.identity(mMatrix);
	mat4.identity(vMatrix);

	//Desenhando o Cubo	
	mat4.translate(mMatrix, [0, 0, -5]);
	mat4.rotate(mMatrix, degToRad(rCubo),[1,1,1]);
	mPushMatrix();
	
	//Atribuindo os buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cuboVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cuboVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
	setMatrixUniforms();
	//Desenhando os elementos
	gl.drawElements(gl.TRIANGLES, cuboVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT,0);
	mPopMatrix();
}

//Simplesmente um método de euler para atualizar os valores da matriz de rotação
function animar(){
	var agora = new Date().getTime();
	if(ultimo != 0){
		var diferenca = agora-ultimo;
		rCubo      += ((75*diferenca)/1000.0) % 360.0;
	}
	ultimo = agora;
}

//mMatrixPilha recebendo matriz
function mPushMatrix(){
	var copy = mat4.create();
	mat4.set(mMatrix, copy);
	mMatrixPilha.push(copy);
}

//mMatrixPilha devolvendo matriz
function mPopMatrix(){
	if(mMatrixPilha.length == 0){
		throw "inválido popMatrix!";
	}
	mMatrix = mMatrixPilha.pop();
}

//Função simples que transforma de graus para radianos
function degToRad(graus){
	return graus * Math.PI / 180;
}