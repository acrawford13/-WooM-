var requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) { return setTimeout(callback, 1000 / 60); };
	
//canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var cw = canvas.width;
var ch = canvas.height;
var cr = Math.hypot(cw,ch)/2;

//color variables
var red = "rgb(250,102,105)";
var oppRed = "rgb(5,153,150)";
var grey = "rgb(215,215,215)";
var canvasBG = "white";


function circleObj(text){
	//circle variables
	this.x = 0;
	this.y = 0;
	this.r = 20;
	this.text = text;
	//force variables
	this.a = 0;
	this.b = 0;
	this.c = 0;
	this.d = 0;
	this.f = 1/1000;
	//check bgcol
	this.bg = ctx.getImageData(this.x,this.y, 1, 1).data;
	this.color = red;
	this.rev = false;
	this.instr = "";
}

var circ1 = new circleObj(">");
var circ2 = new circleObj("w");

function restart(){
    circ1.f = circ2.f = 1/1000;
	lvl = 0;
	newlevel();
    restartBtn.style.visibility="hidden";
}

//shape variables
var s1, s2;
var t = 0;
var m = 1000;
var speed = 1/500;
var colshape;

var shapes = new Array();

//circle variables
var x, y;
var r = 20;
var col = grey;

//force variables
var a = Math.random()*cw;
var b = Math.random()*ch;
var c = cw/2;
var d = ch/2;
var f = 1/1000;



function shape(n, v, color){
	this.n = n;
	this.v = v;
	var o = Math.random()*Math.PI*2;
	this.coord = [o, o+Math.random()/Math.PI*2 + o+Math.PI*3/4, o+Math.random()*Math.PI*2, o+0];
	this.dir = [Math.random()-0.5, Math.random()-0.5, Math.random()-0.5, Math.random()-0.5];
	this.color = color;
	this.move = function () {
		var self = this;
		//console.log(self.coord);
		var ncoord = [];
		//console.log(ncoord);
		var tmp=0;
		for (i = 0; i < self.n; i++) {
			ncoord.push(self.coord[i] + self.v*self.dir[i]);
		}
		self.coord = ncoord; 
	}
}


// key variables
var upp = false;
var downp = false;
var rightp = false;
var leftp = false;
var up2p = false;
var down2p = false;
var right2p = false;
var left2p = false;
var mv=6;
var diff=1;

//game variables
var lvl = 0;
var lvllength=4;
var countdown = lvllength;
var win = false;
var t0;
var waitlength=1000;

var restartBtn = document.getElementById('restart');
var startBtn = document.getElementById('start');
    

function newlevel(){
    startBtn.style.visibility="hidden";
	setTimeout(init,waitlength);
	lvl+=1;
	diff += 0.5;
	if(lvl==1){
		shapes.length = 0;
		circ1.instr = "move me using your arrow keys";
	}
	if(lvl==2){
		canvasBG = red;
		circ1.instr = "watch out for the red sections - they'll reverse your controls";
	}
	if(lvl==3){
		shapes.length = 0;
		shapes.push(new shape (n=3, v=1/200, color=red));
		shapes.push(new shape (n=4, v=1/200, color=red));
		canvasBG = "white";
		circ1.instr = "got it? go!";
	}
	if(lvl==10){
		circ2.instr = "move me using WASD";
		circ1.f+=1/5000;
	}
	if(lvl>10){
		circ2.instr = null;
		circ1.f+=1/5000;
		circ2.f+=1/5000;
	}
	if(lvl>=4){
		shapes.length = 0;
		shapes.push(new shape (n=3, v=lvl/500, color=red));
		shapes.push(new shape (n=4, v=lvl/500, color=red));
		circ1.instr = null;
		circ1.f+=1/5000;
	}
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle=oppRed;    
    ctx.fillRect(0,0,cw,ch);
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font="100 40px sans-serif";
    ctx.fillText("level "+lvl,cw/2,ch/2);
}

function start(){
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle=red;    
    ctx.fillRect(0,0,cw,ch);
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font="100 100px sans-serif";
    ctx.fillText("<WooM>",cw/2,ch/2);
    startBtn.style.left=(cw/2) - 75 + "px";
    startBtn.style.top=(ch/2) + 75 + "px";
    startBtn.style.visibility="visible";
};

function endslate(){
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle="black";
    ctx.fillRect(0,0,cw,ch);
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font="100 40px sans-serif";
    ctx.fillText("game over",cw/2,ch/2-20);
    ctx.font="100 24px sans-serif";
    ctx.fillText("you reached level " + lvl,cw/2,ch/2+20);
    restartBtn.style.left=(cw/2) - 75 + "px";
    restartBtn.style.top=(ch/2) + 75 + "px";
    restartBtn.style.visibility="visible";
}
function init(){ // reinitialisation of the parameters and start of the game
	circ1.x = circ1.c = cw/2
	circ1.y = circ1.d = ch/2;
	circ2.x = circ2.c = cw/2
	circ2.y = circ2.d = ch/2;
	s1=Math.random()*2 * Math.PI;
	s2=Math.random()*2 * Math.PI;
	t0 = new Date();
	countdown = lvllength;
	countdownCont = lvllength;
	win = false;
	game();
	setInterval("pull()",1000);
}
function game(){
	if(countdown<=0){
	newlevel();
	} else if(circ1.x<0||circ1.y<0||circ1.x>cw||circ1.y>ch||circ2.x<0||circ2.y<0||circ2.x>cw||circ2.y>ch){
	endslate();
    } else {
	draw();
	updateEach(circleArray);
	
	requestAnimFrame(game);
    }
}
function draw(){
	ctx.clearRect(0,0,cw,ch);
	ctx.fillStyle=canvasBG;
	ctx.fillRect(0,0,cw,ch);
	drawShapes();
	checkcol(circleArray);
	drawCircle(circ1.x,circ1.y,circ1.r,circ1.color,circ1.text,circ1.instr);
	if(lvl>=10){drawCircle(circ2.x,circ2.y,circ2.r,circ2.color,circ2.text,circ2.instr)};
    drawBar();
}

function drawBar() {
	ctx.fillStyle="rgba(0,0,0,0.4)";
	ctx.fillRect(0,ch-20,cw/lvllength*countdownCont,20);
}

function checkcol(circle){
	for(var i=0; i<circle.length; i++){
		var bg = ctx.getImageData(circle[i].x, circle[i].y, 1, 1).data;
		if(bg[0]==250){
		    circle[i].color=oppRed;
		    circle[i].rev=true;
		} else {
		    circle[i].color=grey;
		    circle[i].rev=false;
		}
	}
}


function pull(){
	circ1.a = cw/2+(Math.random()-1/2)*diff*cw;
	circ1.b = ch/2+(Math.random()-1/2)*diff*ch;
	circ2.a = Math.random()*(cw+1200)-600;
	circ2.b = Math.random()*(ch+1200)-600;
	
}
var circleArray = [circ1,circ2];

function updateEach(circle){
	for(var i=0; i<shapes.length; i++){
		shapes[i].move();
	}	
	for(var i=0; i<circle.length; i++){
		circle[i].c+=(circle[i].a-circle[i].c)/10;
		circle[i].d+=(circle[i].b-circle[i].d)/10;
		circle[i].x+=(circle[i].c-circle[i].x)*circle[i].f;
		circle[i].y+=(circle[i].d-circle[i].y)*circle[i].f;

		    countdown=Math.ceil(lvllength-(Date.now()-t0.getTime())/1000);
		    countdownCont=lvllength-(Date.now()-t0.getTime())/1000;
		
	}
	//update circle 1 -- arrow keys
	if(downp){
		circ1.y+=mv;
	}
	if(upp){
		circ1.y-=mv;
	}
	if(leftp){
		circ1.x-=mv;
	}
	if(rightp){
		circ1.x+=mv;
	}
	//update circle 2 -- WASD
	if(down2p){
		circ2.y+=mv;
	}
	if(up2p){
		circ2.y-=mv;
	}
	if(left2p){
		circ2.x-=mv;
	}
	if(right2p){
		circ2.x+=mv;
	}

}
function drawShapes(){
	for(var i=0; i<shapes.length; i++){
		ctx.beginPath();
		ctx.moveTo(cr*Math.cos(shapes[i].coord[0])+cw/2, cr*Math.sin(shapes[i].coord[0])+ch/2);
		for(var j=1; j<shapes[i].n; j++){
			ctx.lineTo(cr*Math.cos(shapes[i].coord[j])+cw/2, cr*Math.sin(shapes[i].coord[j])+ch/2);
		}
		ctx.fillStyle=shapes[i].color;
		ctx.fill();
		ctx.lineWidth="30";
		ctx.strokeStyle=shapes[i].color;
		ctx.stroke();
	}
}

function drawCircle(x,y,r,col,text,instr){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=col;
    ctx.fill();
    ctx.fillStyle="white";
    ctx.font="20px sans-serif";
    ctx.fillText(text,x,y+6);
    if(instr){
    ctx.fillStyle="black";
    ctx.font="12px sans-serif";
    ctx.fillText(instr,x,y+40);
    }
}

document.onkeydown = function(e){
    e = e || window.event;
    switch(e.keyCode || e.which){
	case 40:
	    if(circ1.rev==false){
	    downp = true;
	    upp = false;
	    } else {
	    upp = true;
	    downp = false;
	    }
	    e.preventDefault();
	    break;
	case 38:
	    if(circ1.rev==false){
	    upp = true;
	    downp = false;
	    } else {
	    downp = true;
	    upp = false;
	    }
	    e.preventDefault();
	    break;
	case 37:
	    if(circ1.rev==false){
	    leftp = true;
	    rightp = false;
	    } else {
	    rightp = true;
	    leftp = false;
	    }
	    e.preventDefault();
	    break;
	case 39:
	    if(circ1.rev==false){
	    rightp = true;
	    leftp = false;
	    } else {
	    leftp = true;
	    rightp = false;
	    }
	    e.preventDefault();
	    break;
	case 83:
	    if(circ2.rev==false){
	    down2p = true;
	    up2p = false;
	    } else {
	    up2p = true;
	    down2p = false;
	    }
	    e.preventDefault();
	    break;
	case 87:
	    if(circ2.rev==false){
	    up2p = true;
	    down2p = false;
	    } else {
	    down2p = true;
	    up2p = false;
	    }
	    e.preventDefault();
	    break;
	case 65:
	    if(circ2.rev==false){
	    left2p = true;
	    right2p = false;
	    } else {
	    right2p = true;
	    left2p = false;
	    }
	    e.preventDefault();
	    break;
	case 68:
	    if(circ2.rev==false){
	    right2p = true;
	    left2p = false;
	    } else {
	    left2p = true;
	    right2p = false;
	    }
	    e.preventDefault();
	    break;
    }
}



document.onkeyup = function(e){
    downp = upp = rightp = leftp = down2p = up2p = right2p = left2p = false;
    e.preventDefault();
}

start();
