//WHEN CLOSE BUTTON IS CLICKED, I CLICK THE STANDGUY SO IT NEVER GETS CLOSED. STANDGUY ONLY LISTENS TO CLICKS WHEN THERE IS NO OVERLAY. FIX!!!


import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';


let camera, scene, renderer;
let mouseX = 0, mouseY = 0;
let FlickerLight;
let CigaretteButt, CigaretteLight;
let Smoke1, Smoke2;
let StandGuy;
let INTERSECTED = null;
let StandGuyScrewedYou = false;

const windowHalf = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const buttonsDiv = document.getElementById("buttons");



init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 50, 100);

  //Light

  const OverallLight = new THREE.AmbientLight(0x7a6b5c, 0.4, 10000);
OverallLight.position.set(0, 200, -100);
scene.add(OverallLight);

  const CeilingLight = new THREE.PointLight(0x7a6b5c, 0, 1000);
CeilingLight.position.set(400, 330, -100);
scene.add(CeilingLight);


  const SpotLight = new THREE.PointLight(0x635a52, 3, 1000);
SpotLight.position.set(0, 120, 0);
scene.add(SpotLight);

  const CeilingLight2 = new THREE.PointLight(0x7a6b5c, 1.1, 1000);
CeilingLight2.position.set(400, 330, -500);
scene.add(CeilingLight2);
  
  const CeilingLight3 = new THREE.PointLight(0xffffff, 0, 1000);
CeilingLight3.position.set(-400, 330, -100);
scene.add(CeilingLight3);

  FlickerLight = new THREE.PointLight(0x7a6b5c, 1.1, 1000);
FlickerLight.position.set(-400, 330, -500);
scene.add(FlickerLight);

  CigaretteButt = new THREE.PointLight(0xff532b, 100, 10);
CigaretteButt.position.set(55.5, 30, -499);
scene.add(CigaretteButt);

  CigaretteLight = new THREE.PointLight(0xb33417, 0.5, 200);
CigaretteLight.position.set(55.5, 30, -470);
scene.add(CigaretteLight);

  
const pointLightHelper1 = new THREE.PointLightHelper( CeilingLight, 0);
const pointLightHelper2 = new THREE.PointLightHelper( CeilingLight2, 0);
const pointLightHelper3 = new THREE.PointLightHelper( CeilingLight3, 0);
const pointLightHelper4 = new THREE.PointLightHelper( FlickerLight, 0);
scene.add( pointLightHelper1 );
scene.add( pointLightHelper2 );
scene.add( pointLightHelper3 );
scene.add( pointLightHelper4 );
  

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  // Load textures
  const loader = new THREE.TextureLoader();
  const roommaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide })  
  ];
  const StandGuyTexture = new THREE.MeshLambertMaterial({ map: loader.load('Stand.png'), transparent: true, side: THREE.DoubleSide });
  const Smoke1Texture = new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke.png'), transparent: true, side: THREE.DoubleSide });
  const Smoke2Texture = new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke 2.png'), transparent: true, side: THREE.DoubleSide });
  
  const tabletopmaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_side.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_side.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_top.png'), side: THREE.DoubleSide }),   
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_top.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_front.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_front.png'), side: THREE.DoubleSide }),
  ];

  const tablematerials = [
    new THREE.MeshLambertMaterial({ map: loader.load('table_side.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('table_side.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('table_front.png'), transparent: true, side: THREE.DoubleSide }),   
    new THREE.MeshLambertMaterial({ map: loader.load('table_front.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('table_front.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('table_front.png'), transparent: true, side: THREE.DoubleSide }),
  ];


  // Room cube
  const roomgeometry = new THREE.BoxGeometry(1280, 720, 1280);
  const room = new THREE.Mesh(roomgeometry, roommaterials);
  scene.add(room);

  // table&tabletop cube
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(785, 21, 231), tabletopmaterials);
  tabletop.position.set(0, -110, -400);
  scene.add(tabletop);

  const table = new THREE.Mesh(new THREE.BoxGeometry(750, 157, 207), tablematerials);
  table.position.set(0, -180, -400);
  scene.add(table);


  // Guy texture
StandGuy = new THREE.Mesh(new THREE.PlaneGeometry(222, 327), StandGuyTexture);
StandGuy.position.set(0, 0, -500);
StandGuy.name = "Stranger";
scene.add(StandGuy);

  // Smoke texture
Smoke1 = new THREE.Mesh(new THREE.PlaneGeometry(1280, 720), Smoke1Texture);
Smoke1.position.set(0, 0, -450);
scene.add(Smoke1);

Smoke2 = new THREE.Mesh(new THREE.PlaneGeometry(1280, 720), Smoke2Texture);
Smoke2.position.set(0, 0, -450);
scene.add(Smoke2);

  // Mouse move and click
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('click', onClick, false);

  // Resize
  window.addEventListener('resize', onWindowResize);

}

//StandGuy clicking menu
function onClick() {
    if (overlay.style.display === "flex") return; 
  if (StandGuyScrewedYou) {
    showGoodbyeMessage();
    return;
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(StandGuy);

  if (intersects.length > 0) {
    showInitialOptions();
  }
}

//mainmenu
function showInitialOptions() {
  camera.position.z -= 100;
  overlay.style.display = "flex";
  message.innerText = "Yo  man. How can i help you?";
  buttonsDiv.innerHTML = "";

  const questions = [
    { text: "I got noone to talk to...", handler: handleQ1 },
   // { text: "Recommend me a movie!", handler: handleQ2 },
   // { text: "What are you doing here?", handler: handleQ3 },
   // { text: "I`m just wandering around", handler: handleQ4 },
  ];

  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.textContent = q.text;
    btn.addEventListener("click", q.handler);
    buttonsDiv.appendChild(btn);
  });
}

//Q1
function handleQ1() {
  
  message.innerText = "Wanna hear a joke? Gimme a theme";
  buttonsDiv.innerHTML = "";
  

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "";
  input.classList.add("overlay-input");

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Try this";

  submitBtn.addEventListener("click", () => {
  const userInput = input.value;

  // Send userInput to Google Cloud Function
  fetch('https://gemini-cloud-function-994729946863.europe-west1.run.app', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: "Answer to me in short, subtle manner, in the same language as the joke theme provided further. Tell me a fresh modern joke about:" + userInput })
})
  .then(res => res.json())
  .then(data => {
    if (data.reply !== undefined) {
      message.innerText = data.reply;
    } else if (data.error) {
      message.innerText = "Error: " + data.error;
    } else {
      message.innerText = "Error: Unexpected response";
    }
  })
  .catch(err => {
    message.innerText = "Error: " + err.message;
  });
          buttonsDiv.innerHTML = "";
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "omfg not again...";
      closeBtn.addEventListener("click", (e) => {e.stopPropagation(); overlay.style.display = "none"; camera.position.z -= -100;});
      buttonsDiv.appendChild(closeBtn);
});

  buttonsDiv.appendChild(input);
  buttonsDiv.appendChild(submitBtn);
}

//Q2
function handleQ2() {
  message.innerText = "Yeah. Watch ya thinking `bout?";
  buttonsDiv.innerHTML = "";

  const btn1 = document.createElement("button");
  btn1.textContent = "Today is a marvelous day.";
  btn1.addEventListener("click", () => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    message.innerText = `Is it? ${formattedDate}? I guess. Autumn is great for Dead Poets Society.`;
    buttonsDiv.innerHTML = "";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Thanks!";
    closeBtn.addEventListener("click", (e) => {e.stopPropagation(); overlay.style.display = "none";camera.position.z -= -100;});
    buttonsDiv.appendChild(closeBtn);
  });

  const btn2 = document.createElement("button");
  btn2.textContent = "What are your favourites?";
  btn2.addEventListener("click", () => {
    camera.position.z -= 100;
    triggerExternalAnimation(); // Stub
    message.innerText = "You will never be able to comprehend the levels of MY understanding of cinema.";
    buttonsDiv.innerHTML = "";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "...I guess.";
    closeBtn.addEventListener("click", (e) => {e.stopPropagation(); camera.position.z -= -200; overlay.style.display = "none";});
    buttonsDiv.appendChild(closeBtn);
  });

  buttonsDiv.appendChild(btn1);
  buttonsDiv.appendChild(btn2);
}

// Stub external animation function
function triggerExternalAnimation() {
  console.log("External animation triggered");
}


//Q3
function handleQ3() {
  message.innerText = "Mostly chillin`. There`s not much to do yet";
  buttonsDiv.innerHTML = "";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", (e) => {e.stopPropagation(); camera.position.z -= -100; overlay.style.display = "none";});
  buttonsDiv.appendChild(closeBtn);
}


//Q4
function handleQ4() {
  message.innerText = "Then don`t bother me!";
  buttonsDiv.innerHTML = "";
  setTimeout(() => {
    camera.position.z -= -100;
    overlay.style.display = "none";
    StandGuyScrewedYou = true;
  }, 2000);
}

//Goodbye Message
function showGoodbyeMessage() {
  overlay.style.display = "flex";
  message.innerText = "Don`t bother me.";
  buttonsDiv.innerHTML = "";
  camera.position.z -= 100;
  
  setTimeout(() => {
    camera.position.z -= -100;
    overlay.style.display = "none";
    StandGuyScrewedYou = true;
  }, 2000);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalf.x) / 50;
  mouseY = (event.clientY - windowHalf.y) / 50;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  windowHalf.x = window.innerWidth / 2;
  windowHalf.y = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);



  //FlickerLight flicker 
  if (Math.random() < 0.01) { //% chance per frame
  FlickerLight.intensity = 0.3 + Math.random() * 0.1;
} else {
  FlickerLight.intensity = 1.0;
}


  //CIGGIE ANIMATION
  //CigaretteButt light
 
  const Inhale = 2000;
  const pauseInhale = 800;
  const Exhale = 3000;
  const pauseExhale = 10000;
  const cycle = Inhale + pauseInhale + Exhale + pauseExhale;
  const smokepause = Inhale + pauseInhale + Exhale;
  const minIntensity = 3;
  const maxIntensity = 100;
  const lerp = (a, b, t) => a + (b - a) * t;
  const t = Date.now() % cycle;

    if (t < Inhale) {
  CigaretteButt.intensity = lerp(minIntensity, maxIntensity, t / Inhale);
} else if (t < Inhale + pauseInhale) {
  CigaretteButt.intensity = maxIntensity;
} else if (t < Inhale + pauseInhale + Exhale) {
  CigaretteButt.intensity = lerp(maxIntensity, minIntensity, (t - Inhale - pauseInhale) / Exhale);
} else {
  CigaretteButt.intensity = minIntensity;
}

  //CigaretteLight ambient light
  
  const minIntensityCL = 0.5;
  const maxIntensityCL = 2;

    if (t < Inhale) {
  CigaretteLight.intensity = lerp(minIntensityCL, maxIntensityCL, t / Inhale);
} else if (t < Inhale + pauseInhale) {
  CigaretteLight.intensity = maxIntensityCL;
} else if (t < Inhale + pauseInhale + Exhale) {
  CigaretteLight.intensity = lerp(maxIntensityCL, minIntensityCL, (t - Inhale - pauseInhale) / Exhale);
} else {
  CigaretteLight.intensity = 0.5 + 0.2 * Math.sin(t * 0.0005);
}

  //Smoke animation

if (t < 154 + smokepause) {
  Smoke1.visible = false;
  Smoke2.visible = false;
} else if (t < 783 + smokepause) {
  Smoke1.visible = false;
  Smoke2.visible = true;
} else if (t < 1100 + smokepause) {
  Smoke1.visible = true;
  Smoke2.visible = true;
} else if (t < 2111 + smokepause) {
  Smoke1.visible = true;
  Smoke2.visible = false;
} else {
  Smoke1.visible = false;
  Smoke2.visible = false;
}


  // Smooth camera movement
  camera.rotation.y = -mouseX * 0.01;
  camera.rotation.x = -mouseY * 0.01;

  renderer.render(scene, camera);


  //Object highlighting

if (overlay.style.display !== "flex") {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(StandGuy);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const distanceToCenter = hit.point.distanceTo(StandGuy.position);

    // Only highlight if hit is near object's center
    if (distanceToCenter < 100) {
      if (INTERSECTED !== StandGuy) {
        if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }

        INTERSECTED = StandGuy;

        if (INTERSECTED.material && INTERSECTED.material.emissive) {
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0x1a1714);
        }
      }
    } else {
      if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
      INTERSECTED = null;
    }
  } else {
    if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
  }
} else {
  // If overlay is up, always clear highlight
  if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
  }
  INTERSECTED = null;
}
}

//Camera animations


