import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

let camera, scene, renderer;
let mouseX = 0, mouseY = 0;
let FlickerLight;
let CigaretteButt, CigaretteLight, CigaretteButtAnimation;
let Smoke1, Smoke2;
let StandGuy;
let INTERSECTED = null;

const windowHalf = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 50, 0);

  //Light

  const OverallLight = new THREE.AmbientLight(0x29010a, 0.2, 1700);
OverallLight.position.set(-200, 100, 0);
scene.add(OverallLight);

  const CeilingLight = new THREE.PointLight(0xffffff, 1.7, 1400);
CeilingLight.position.set(200, 50, 300);
scene.add(CeilingLight);

  FlickerLight = new THREE.PointLight(0xffffff, 1.7, 1400);
FlickerLight.position.set(-200, 50, 300);
scene.add(FlickerLight);

  CigaretteButt = new THREE.PointLight(0xff532b, 100, 10);
CigaretteButt.position.set(62, 70, -499);
scene.add(CigaretteButt);

  CigaretteLight = new THREE.PointLight(0xb33417, 0.5, 200);
CigaretteLight.position.set(50, 70, -470);
scene.add(CigaretteLight);

  
  

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  // Load textures
  const loader = new THREE.TextureLoader();
  const materials = [
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

  // Create cube (room)
  const geometry = new THREE.BoxGeometry(1280, 720, 1280);
  const room = new THREE.Mesh(geometry, materials);
  scene.add(room);

  // Guy texture
StandGuy = new THREE.Mesh(new THREE.PlaneGeometry(1280, 720), StandGuyTexture);
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

  // Button logic
  document.getElementById("toggleBtn").addEventListener("click", () => {
    document.getElementById("message").innerText = "Idk yet. Probably tell you some cool films. Maybe let you play some synths. Whatever. It`s JS, baby!";
    document.getElementById("toggleBtn").style.display = "none";
  });
}

//Idk yet. Probably tell you some cool films. Maybe let you play some synths. Whatever. It`s JS, baby!
//Oh hi! So nice to see some people here. This is a study project I`m working on. Today I added lights, toggle, clickable character and smoke animation. For now I`m just chilling.


function onClick() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(StandGuy);

  if (intersects.length > 0) {
    // Show toggle button
    const overlay = document.getElementById("overlay");
    overlay.style.display = "flex";
    
    // Reset message text
    //document.getElementById("message").innerText = "Oh hi! So nice to see some people here. This is a study project I`m working on. Today I added lights, toggle, clickable character and smoke animation. For now I`m just chilling.";
  }
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

  //FlickLight flicker 
  if (Math.random() < 0.05) { //% chance per frame
  FlickerLight.intensity = 0.5 + Math.random() * 0.5;
} else {
  FlickerLight.intensity = 1.0;
}

  //CigaretteButt.intensity
  const Inhale = 2000;
  const pauseInhale = 800;
  const Exhale = 3000;
  const pauseExhale = 10000;
  const cycle = Inhale + pauseInhale + Exhale + pauseExhale;
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
  
  //CigaretteLight.intensity
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
  const smoketimer = Date.now() % cycle;
  const smokepause = Inhale + pauseInhale + Exhale;
if (smoketimer < 154 + smokepause) {
  Smoke1.visible = false;
  Smoke2.visible = false;
} else if (smoketimer < 783 + smokepause) {
  Smoke1.visible = false;
  Smoke2.visible = true;
} else if (smoketimer < 1100 + smokepause) {
  Smoke1.visible = true;
  Smoke2.visible = true;
} else if (smoketimer < 2111 + smokepause) {
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

raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObject(StandGuy);

if (intersects.length > 0) {
  const hit = intersects[0];
  const distanceToCenter = hit.point.distanceTo(StandGuy.position);

  // Only highlight if hit is near object's center
  if (distanceToCenter < 200) {
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
}
