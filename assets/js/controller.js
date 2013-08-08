			var moveCharJump = function(event) 
			{
					jump = true;
			};	
			var moveCharRight =function() 
			{
					RightIsPressed = true;
					perso.style.transform = "perspective(700px) rotateY(0deg)";
					perso.style.webkitTransform = "perspective(700px) rotateY(0deg)";
			};	
			var moveCharLeft =function() 
			{
					LeftIsPressed = true;
					perso.style.transform = "perspective(700px) rotateY(180deg)";
					perso.style.webkitTransform = "perspective(700px) rotateY(180deg)";
			};
			var moveChar =function(event) 
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
			};
			var stopChar=function(event) {
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
			};
			var stopCharMob function() 
			{
					LeftIsPressed = false;
					RightIsPressed = false;	
			};
			
			var createCloud = function(time) {
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
			};
			
			var updateClouds =function() {
				for (i = 0; i < clouds.children.length; i++) {
					clouds.children[i].style.left = clouds.children[i].offsetLeft + vCloud * clouds.children[i].style.opacity + "px";
					if (clouds.children[i].offsetLeft > window.innerWidth) clouds.removeChild(clouds.children[i]);
				}
				
				if (clouds.children.length < nbClouds) {
					var nb = nbClouds - clouds.children.length;
					for (i = 0; i < nb; i++) {
						createCloud("game");
					}
				}
			};
			
			var updatePerso = function() {
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
			};
			
			var drawPerso = function() 
			{
				if (isJumping) 
				{
					dPerso = 4;
					stepAnim = frames;
				}
				else if (LeftIsPressed || RightIsPressed) 
				{
					if (frames % sequence == 0) 
					{
						dPerso = (dPerso == 2) ? 3 : 2;
						stepAnim = frames;
					}
				}
				else 
				{
					if (dPerso == 1) 
					{
						if (frames - stepAnim == sequence) 
						{
							dPerso = 0;
							stepAnim = frames;
						}
					}
					else 
					{
						if (frames - stepAnim == breathRythm) 
						{
							dPerso = 1;
							stepAnim = frames
						}
						else dPerso = 0;
					}
				}				
				//perso.style.background = 'url("/img/perso.png") ' + (-120 * dPerso) + 'px 0px no-repeat';
			};
			
			var loop =function() 
			{
				updatePerso();
				drawPerso();
				
				updateClouds();
				
				frames++;
			};