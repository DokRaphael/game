var perso, portes, info, clouds, nbClouds, vCloud, vPerso, dPerso, frames, sequence, breathRythm, stepAnim, position, velocity, acceleration, gravity, jumpHeight, jumpCount, nbJumps, jump, isJumping, ground, LeftIsPressed, RightIsPressed, BottomIsPressed;
var url = 'http://ec2-54-229-102-239.eu-west-1.compute.amazonaws.com/Game';
var leftBreakThreshold = -7;
var leftTurnThreshold = -40;
var rightBreakThreshold = 7;
var rightTurnThreshold = 40;			
			window.onload = function init() 
			{

				perso = document.getElementById("perso");
				portes = document.getElementsByClassName("porte");
				info = document.getElementById("info");
				clouds = document.getElementById("nuages");
				nbClouds = 5;					// nombre max de nuages visibles en même temps
				vCloud = 2;						// vitesse des nuages
				vPerso = 20;					// vitesse de déplacement
				dPerso = 0;						// image affichée
				frames = 0;						// compteur de frames
				sequence = 4;					// rythme de images
				breathRythm = 35;				// espacement des respirations (en frames)
				stepAnim = 0;
				position = [0,0];				// position x,y du personnage
				velocity = [0,0];				// vecteur de déplacement x,y du personnage
				acceleration = [0,0];			// vecteur d'acceleration x,y du personnage
				gravity = 3;					// force de gravité (px / frame)
				jumpHeight = 30;				// hauteur de saut
				jumpCount = 0;					// compteur de saut sans toucher le sol
				nbJumps = 2;					// nombre de saut possibles sans toucher le sol
				jump = false;					// key listener
				isJumping = false;				// le personnage est en train de sauter
				ground = perso.offsetTop;		// hauteur du sol = hauteur de départ du personnage;
				LeftIsPressed = false;			// key listeners
				RightIsPressed = false;
				BottomIsPressed = false;

				for (i = 0; i < nbClouds; i++) 
				{
					createCloud("init");
				}
				
				window.setInterval(loop, 40);
				window.onkeydown = function() { moveChar(event) };
				window.onkeyup = function() { stopChar(event) };
				
				var socket = io.connect(url);
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
				{
				socket.emit("device","controller");
        			// When game code is validated, we can begin playing...
        		console.log("controller");

			 	socket.on("connected", function(data)
			 	{
			 		window.addEventListener('deviceorientation', function(event) 
					{
					   var a = event.alpha; // "direction"
					   var b = event.beta; // left/right 'tilt'
					   var g = event.gamma; // forward/back 'tilt'
		   
					   // Regardless of phone direction, 
					   //  left/right tilt should behave the same
					   var turn = b;
					
					   // Update controller UI		   
					   // Tell game to turn the vehicle
					   socket.emit("turn", {'turn':turn, 'g':b});
					}, false);
			 		/*window.ondevicemotion = function(event) 
					{
						ax = event.accelerationIncludingGravity.x
						ay = event.accelerationIncludingGravity.y
						az = event.accelerationIncludingGravity.z
						rotation = event.rotationRate;
						if (rotation != null) 
						{
							arAlpha = Math.round(rotation.alpha);
							arBeta = Math.round(rotation.beta);
							arGamma = Math.round(rotation.gamma);
						}
						if(Math.abs(arBeta)>160)
						{
							moveCharJump(event);
						}
					}
					window.ondeviceorientation = function(event) 
					{
						alpha = Math.round(event.alpha);
						beta = Math.round(event.beta);
						gamma = Math.round(event.gamma);
					
						if(beta > 15)
						{
							moveCharRight(event);
						}
						else if(beta<-15)
						{
							moveCharLeft(event);
						}
						else
						{
							stopCharMob(event);
						}
					
					}*/
						// Hide game code input, and show the vehicle wheel UI						
						// If user touches the screen, accelerate
						document.addEventListener("touchstart", function(event){
						   socket.emit("accelerate", {'accelerate':true});
						   $('#forward').addClass('active');

						}, false);
			
						// Stop accelerating if user stops touching screen
						document.addEventListener("touchend", function(event){
						   socket.emit("accelerate", {'accelerate':false});
						   $('#forward').removeClass('active');
						}, false);
			
						// Prevent touchmove event from cancelling the 'touchend' event above
						document.addEventListener("touchmove", function(event){
						   event.preventDefault();
						}, false);
			
						// Steer the vehicle based on the phone orientation
						
					 });         	
				}
				else
				{
					console.log("game");
					socket.emit("device", "game");
					socket.on('turn', function(turn)
				  	{
					 if(turn < -15)
					 {
						moveCharLeft();
					 }
					 else if (turn > 15)
					 {
						moveCharRight();
					 }
					 else
					 {				
					 	RightIsPressed = false;
						LeftIsPressed = false;
					 }
					 
				  });
				}
			}
			
			function moveCharJump(event) 
			{
					jump = true;
			}	
			function moveCharRight() 
			{
					RightIsPressed = true;
					perso.style.transform = "perspective(700px) rotateY(0deg)";
					perso.style.webkitTransform = "perspective(700px) rotateY(0deg)";
			}	
			function moveCharLeft() 
			{
					LeftIsPressed = true;
					perso.style.transform = "perspective(700px) rotateY(180deg)";
					perso.style.webkitTransform = "perspective(700px) rotateY(180deg)";
			}
			function moveChar(event) 
			{
				if (event.keyCode == 37) 
				{ 
					LeftIsPressed = true;
					perso.style.transform = "perspective(700px) rotateY(180deg)";
					perso.style.webkitTransform = "perspective(700px) rotateY(180deg)";
				}
				if (event.keyCode == 38) 
				{ 
					jump = true;
				}
				if (event.keyCode == 39) 
				{ 
					RightIsPressed = true;
					perso.style.transform = "perspective(700px) rotateY(0deg)";
					perso.style.webkitTransform = "perspective(700px) rotateY(0deg)";
				}
			}
			function stopChar(event) {
				if (event.keyCode == 37) {
					LeftIsPressed = false;
				}
				if (event.keyCode == 39) {
					RightIsPressed = false;
				}
				if (event.keyCode == 65) {
					vPerso *= 2;
					sequence /= 2;
				}
				if (event.keyCode == 90) {
					vPerso /= 2;
					sequence *= 2;
				}
			}
			function stopCharMob(event) 
			{
					LeftIsPressed = false;
					RightIsPressed = false;	
			}
			
			function createCloud(time) {
				var n = document.createElement("img");
				var nScale = 0.5 + Math.random() * .5;
				n.src = "img/nuage.png";
				n.alt = "nuage";
				n.style.width = 150 * nScale + "px";
				if (time == "init") n.style.left = Math.random() * (window.innerWidth - n.offsetWidth) + "px";
				else n.style.left = -150 * nScale + "px";
				n.style.top = Math.random() * (clouds.offsetHeight - 60 * nScale) + "px";
				n.style.opacity = 1 * nScale;
				clouds.appendChild(n);
			}
			
			function updateClouds() {
				for (i = 0; i < clouds.children.length; i++) {
					clouds.children[i].style.left = clouds.children[i].offsetLeft + vCloud * clouds.children[i].style.opacity + "px";
					if (clouds.children[i].offsetLeft > window.innerWidth) clouds.removeChild(clouds.children[i]);
				}
				
				if (clouds.children.length < nbClouds) {
					var nb = nbClouds - clouds.children.length;
					for (i = 0; i < nb; i++) {
						console.log("nuage" + i);
						createCloud("game");
					}
				}
			}
			
			function updatePerso() {
				position[0] = perso.offsetLeft;
				position[1] = perso.offsetTop;
				if (LeftIsPressed) {
					if (position[0] + acceleration[0] - vPerso > 0) velocity[0] -= vPerso;
					else {
						acceleration[0] = 0;
						velocity[0] = 0;
						position[0] = 0;
					}
				}
				if (RightIsPressed) {
					if (position[0] + acceleration[0] + vPerso + perso.offsetWidth < window.innerWidth) velocity[0] += vPerso;
					else {
						acceleration[0] = 0;
						velocity[0] = 0;
						position[0] = window.innerWidth - perso.offsetWidth;
					}
				}			
				if (jump) {			
					jumpCount++;
					if (jumpCount <= nbJumps) acceleration[1] = -jumpHeight;
					isJumping = true;
					jump = false;
				}
				if (isJumping) {
					if (position[1] + acceleration[1] + gravity < ground) acceleration[1] += gravity;
					else {
						acceleration[1] = 0;
						position[1] = ground;
						isJumping = false;
						jumpCount = 0;
					}
				}
				velocity[0] += acceleration[0];
				velocity[1] += acceleration[1];
				position[0] += velocity[0];
				position[1] += velocity[1];
				velocity = [0,0];
				
				perso.style.left = position[0] + "px";
				perso.style.top = position[1] + "px";
			}
			
			function drawPerso() {
				if (isJumping) {
					dPerso = 4;
					stepAnim = frames;
				}
				else if (LeftIsPressed || RightIsPressed) {
					if (frames % sequence == 0) {
						dPerso = (dPerso == 2) ? 3 : 2;
						stepAnim = frames;
					}
				}
				else {
					if (dPerso == 1) {
						if (frames - stepAnim == sequence) {
							dPerso = 0;
							stepAnim = frames;
						}
					}
					else {
						if (frames - stepAnim == breathRythm) {
							dPerso = 1;
							stepAnim = frames
						}
						else dPerso = 0;
					}
				}				
				//perso.style.background = 'url("/img/perso.png") ' + (-120 * dPerso) + 'px 0px no-repeat';
			}
			
			function loop() {
				updatePerso();
				drawPerso();
				
				updateClouds();
				
				frames++;
			}