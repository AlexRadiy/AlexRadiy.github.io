import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

let camera, scene, renderer;
let mouseX = 0, mouseY = 0;
const windowHalf = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 160, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Room dimensions
  const roomWidth = 1280;
  const roomHeight = 720;
  const roomDepth = 1280;

  // Load textures
  const loader = new THREE.TextureLoader();
  const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('Wall1.png'), side: THREE.BackSide }), 
    new THREE.MeshBasicMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide }), 
    new THREE.MeshBasicMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshBasicMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshBasicMaterial({ map: loader.load('Wall3.png'), side: THREE.BackSide }), 
    new THREE.MeshBasicMaterial({ map: loader.load('Wall3.png'), side: THREE.BackSide })  
  ];

  // Create cube (room)
  const geometry = new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth);
  const room = new THREE.Mesh(geometry, materials);
  scene.add(room);

  // Mouse move
  document.addEventListener('mousemove', onDocumentMouseMove);

  // Resize
  window.addEventListener('resize', onWindowResize);

  // Button logic
  document.getElementById("toggleBtn").addEventListener("click", () => {
    document.getElementById("message").innerText = "Hi there! This is a study project I`m working on. I should tell you a good film to watch based on your preferences, but for no I`ll just recommend you one of my own favourites. Let it be... Lawrence of Arabia!";
    document.getElementById("toggleBtn").style.display = "none";
  });
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalf.x) / 50;
  mouseY = (event.clientY - windowHalf.y) / 50;
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

  // Smooth camera movement
  camera.rotation.y = -mouseX * 0.01;
  camera.rotation.x = -mouseY * 0.01;

  renderer.render(scene, camera);
}
