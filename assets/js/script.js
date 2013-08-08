var perso, portes, info, clouds, nbClouds, vCloud, vPerso, dPerso, frames, sequence, breathRythm, stepAnim, position, velocity, acceleration, gravity, jumpHeight, jumpCount, nbJumps, jump, isJumping, ground, LeftIsPressed, RightIsPressed, BottomIsPressed;
var url = 'http://ec2-54-229-102-239.eu-west-1.compute.amazonaws.com/Game';
var leftBreakThreshold = -7;
var leftTurnThreshold = -40;
var rightBreakThreshold = 7;
var rightTurnThreshold = 40;			
			var initPhoneController = function()
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
				socket.emit("device",{"type":"controller"});
        			// When game code is validated, we can begin playing...
        		console.log("controller");
        		socket.on("connected", function()
         		{
         			console.log("connected");

			 		window.addEventListener('deviceorientation', function(event) 
					{
					   var a = Math.round(event.alpha); // "direction"
					   var b = Math.round(event.beta); // left/right 'tilt'
					   var g = Math.round(event.gamma); // forward/back 'tilt'
		   
					   // Regardless of phone direction, 
					   //  left/right tilt should behave the same
					   var turn = b;
						console.log("beta :"+b); 
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
					socket.emit("device", {"type":"game"});
					socket.on("initialize",function()
					{
					        		console.log("initialize");

						socket.on('turn', function(turn)
						{
							console.log("turn");
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
								stopCharMob();
							}
					 
						});
				  	});
				}
			};
			
			
			