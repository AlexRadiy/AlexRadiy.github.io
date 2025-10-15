import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';


//It`s all vibe coding, plus I was learning on the go. Don`t judge harshly. 

let camera, scene, renderer, listener;
let mouseX = 0, mouseY = 0;
let FlickerLight, headlamp1Light, fan, condgrid;
let fanstrip1, fanstrip2, fanstrip3;
let CigaretteButt, CigaretteLight;
let Smoke1, Smoke2;
let StandGuy;
let INTERSECTED = null;
let StandGuyScrewedYou = false;
let SpinForMeBaby = false;
let socks, socksLight;
let booom, meow, buzz, buzz2, click;
let boomboxplay, boomboxhiss, boomboxchange, boomboxstop;
let chooselife, vacation, SA;
let cassette1, cassette2, cassette3;
let boomboxMesh;
let room1, room2, room3;
let pause, play;

let highlightBox = null;

// Label for displaying object names
let nameLabel = document.createElement('div');
nameLabel.style.position = 'absolute';
nameLabel.style.background = 'rgba(30,23,20,0.85)';
nameLabel.style.color = 'white';
nameLabel.style.padding = '4px 12px';
nameLabel.style.borderRadius = '18px';
nameLabel.style.pointerEvents = 'none';
nameLabel.style.fontFamily = 'monospace';
nameLabel.style.fontSize = '16px';
nameLabel.style.display = 'none';
document.body.appendChild(nameLabel);

let boombox = {
  isOn: false,
  isBroken: false,
  toggleCount: 0,
  maxToggles: 25,
  currentTrack: null,
};

let music1, music2, music3;

let lastPromptQ1 = "";
let lastPromptQ2 = "";
let isSocksOverlayOpen = false;

const windowHalf = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const buttonsDiv = document.getElementById("buttons");

// simple animation scheduler
let _anims = [];

function _easeInOut(t) {
  // easeInOutQuad
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateNumber(get, set, to, duration = 300) {
  const from = get();
  const start = performance.now();
  const anim = {
    update(now) {
      const t = Math.min((now - start) / duration, 1);
      const v = from + (to - from) * _easeInOut(t);
      set(v);
      return t < 1;
    }
  };
  _anims.push(anim);
}

function animateCameraForward(delta = -150, duration = 300) {
  animateNumber(
    () => camera.position.z,
    (v) => { camera.position.z = v; },
    camera.position.z + delta,
    duration
  );
}

// rooms handling
const rooms = [];
let activeRoomIndex = 0;
const roomOffsetX = 1600;

function setActiveRoom(index, duration = 300) {
  activeRoomIndex = Math.max(0, Math.min(2, index));
  rooms.forEach((r, i) => {
    const targetX = (i - activeRoomIndex) * roomOffsetX;
    animateNumber(
      () => r.position.x,
      (v) => { r.position.x = v; },
      targetX,
      duration
    );
  });
}


init();

animate();

function init() {

  
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 50, 100);

  // Camera-sound
  listener = new THREE.AudioListener(); 
  camera.add(listener); 

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

  socksLight = new THREE.PointLight(0xffffff, 0, 500);
  socksLight.position.set(300, -200, -250);
scene.add(socksLight);
  
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

  //SOUNDS

  booom = new THREE.Audio(listener); new THREE.AudioLoader().load('booom.mp3', b => booom.setBuffer(b));
  booom.setVolume(0.05);

  meow = new THREE.Audio(listener); new THREE.AudioLoader().load('meow.mp3', b => meow.setBuffer(b));
  meow.setVolume(0.1);

  buzz = new THREE.PositionalAudio(listener); new THREE.AudioLoader().load('buzz.mp3', b => buzz.setBuffer(b));
  buzz.setLoop(true);
  buzz.setRefDistance(20);
  buzz.position.set(-600, 330, -100);
  scene.add(buzz);


  buzz2 = new THREE.PositionalAudio(listener); new THREE.AudioLoader().load('buzz2.mp3', b => buzz2.setBuffer(b));
  buzz2.setLoop(true);
  buzz2.setRefDistance(2000);
  buzz2.position.set(200, 330, -100);
  scene.add(buzz2);

  click = new THREE.PositionalAudio(listener); new THREE.AudioLoader().load('click.mp3', b => click.setBuffer(b));
  click.setRefDistance(2000);
  click.position.set(-9, 50, 80);
  scene.add(click);
  camera.add(click);

  music1 = new THREE.Audio(listener); new THREE.AudioLoader().load('music1.mp3', b => music1.setBuffer(b));
  music1.setVolume(0.05);

  music2 = new THREE.Audio(listener); new THREE.AudioLoader().load('music2.mp3', b => music2.setBuffer(b));
  music2.setVolume(0.05);

  music3 = new THREE.Audio(listener); new THREE.AudioLoader().load('music3.mp3', b => music3.setBuffer(b));
  music3.setVolume(0.05);

  boomboxchange = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-change.mp3', b => boomboxchange.setBuffer(b));
  boomboxchange.setVolume(0.1);

  boomboxplay = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-play.mp3', b => boomboxplay.setBuffer(b));
  boomboxplay.setVolume(0.1);

  boomboxhiss = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-hiss.mp3', b => boomboxhiss.setBuffer(b));
  boomboxhiss.setVolume(0.1);
   
  boomboxstop = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-stop.mp3', b => boomboxstop.setBuffer(b));
  boomboxstop.setVolume(0.1);


  // Box textures
  const loader = new THREE.TextureLoader();
  const roommaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide })  
  ];

    const room2materials = [
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q2.png'), side: THREE.BackSide })  
  ];

    const room3materials = [
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide })  
  ];
  
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

  const headlampmaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }),   
    new THREE.MeshBasicMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }),
  ];

  //CONDITIONER
  
  const condpart1 = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 2000, 32), new THREE.MeshLambertMaterial({ map: loader.load('cond.png'), transparent: true, side: THREE.DoubleSide }));
  condpart1.position.set(300, 330, -630);
  condpart1.rotation.z = Math.PI / 2;
  scene.add(condpart1);

  const condpart2 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond.png'), transparent: true, side: THREE.DoubleSide }));
  condpart2.position.set(400, 300, -680);
  condpart2.rotation.y = Math.PI / 2;
  scene.add(condpart2);

  condgrid = new THREE.Mesh(new THREE.PlaneGeometry(200, 170), new THREE.MeshLambertMaterial({ map: loader.load('cond-grid.png'), transparent: true, side: THREE.DoubleSide }));
  condgrid.position.set(500, 280, -580);
  scene.add(condgrid);

  const condpart3 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond-back.png'), transparent: true, side: THREE.DoubleSide }));
  condpart3.position.set(500, 300, -600);
  scene.add(condpart3);

    const condpart4 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond-back.png'), transparent: true, side: THREE.DoubleSide }));
  condpart4.position.set(600, 300, -680);
    condpart4.rotation.y = Math.PI / 2;
  scene.add(condpart4);

    const condpart5 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond.png'), transparent: true, side: THREE.DoubleSide }));
  condpart5.position.set(500, 200, -680);
  condpart5.rotation.x = Math.PI / 2;
  scene.add(condpart5);

  fan = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshLambertMaterial({ map: loader.load('fan.png'), transparent: true, side: THREE.DoubleSide }));
  fan.position.set(506, 289, -598);
  scene.add(fan);

  fanstrip1 = new THREE.Mesh(new THREE.PlaneGeometry(22, 49), new THREE.MeshLambertMaterial({ map: loader.load('fanstrips.png'), transparent: true, side: THREE.DoubleSide }));
  fanstrip1.position.set(540, 260, -579);
  scene.add(fanstrip1);

  fanstrip2 = new THREE.Mesh(new THREE.PlaneGeometry(22, 49), new THREE.MeshLambertMaterial({ map: loader.load('fanstrips2.png'), transparent: true, side: THREE.DoubleSide }));
  fanstrip2.position.set(540, 260, -579);
  scene.add(fanstrip2);

  fanstrip3 = new THREE.Mesh(new THREE.PlaneGeometry(22, 49), new THREE.MeshLambertMaterial({ map: loader.load('fanstrips3.png'), transparent: true, side: THREE.DoubleSide }));
  fanstrip3.position.set(540, 260, -579);
  scene.add(fanstrip3);

  //BOOMBOX & CASSETES

  boomboxMesh = new THREE.Mesh(new THREE.BoxGeometry(182, 84, 84), new THREE.MeshLambertMaterial({ map: loader.load('boombox.png'), transparent: true, side: THREE.DoubleSide }));
  boomboxMesh.position.set(270, -58, -410);
  boomboxMesh.rotation.y = -0.3;
  scene.add(boomboxMesh);

      const boomboxhandle = new THREE.Mesh(new THREE.PlaneGeometry(140, 30), new THREE.MeshLambertMaterial({ map: loader.load('boomboxhandle.png'), transparent: true, side: THREE.DoubleSide }));
  boomboxhandle.position.set(270, -5, -410);
  boomboxhandle.rotation.x = Math.PI / 1;
  boomboxhandle.rotation.y = 0.3;
  scene.add(boomboxhandle);

  cassette1 = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('cover1.png'), transparent: true, side: THREE.DoubleSide }));
  cassette1.position.set(150, -94, -320);
  cassette1.rotation.y = -1;
  scene.add(cassette1);

  cassette2 = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('cover2.png'), transparent: true, side: THREE.DoubleSide }));
  cassette2.position.set(240, -94, -315);
  cassette2.rotation.y = -0.1;
  scene.add(cassette2);

  cassette3 = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('cover3.png'), transparent: true, side: THREE.DoubleSide }));
  cassette3.position.set(350, -94, -315);
  cassette3.rotation.y = 0.5;
  scene.add(cassette3);

  pause = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshLambertMaterial({ map: loader.load('pause.png'), transparent: true, side: THREE.DoubleSide }));
  pause.position.set(211, -31, -360);
  pause.rotation.y = -0.3;
  pause.material.opacity = 1;
  scene.add(pause);

  play = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshLambertMaterial({ map: loader.load('play.png'), transparent: true, side: THREE.DoubleSide }));
  play.position.set(211, -31, -360);
  play.rotation.y = -0.3;
  play.material.opacity = 1;
  scene.add(play);

  //SOCKS
  socks = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('socks.png'), transparent: true, side: THREE.DoubleSide }));
  socks.position.set(300, -200, -270);
  scene.add(socks);

  //POSTERS

 chooselife = new THREE.Mesh(new THREE.PlaneGeometry(110, 210), new THREE.MeshLambertMaterial({ map: loader.load('choose-life.png'), transparent: true, side: THREE.DoubleSide }));
  chooselife.position.set(-550, 100, -350);
  chooselife.rotation.y = 1.55555;
    chooselife.rotation.x = 0.01;
  scene.add(chooselife);

   vacation = new THREE.Mesh(new THREE.PlaneGeometry(110, 150), new THREE.MeshLambertMaterial({ map: loader.load('vietnam.png'), transparent: true, side: THREE.DoubleSide }));
  vacation.position.set(350, 180, -639);
  vacation.rotation.z = 0.1;
  scene.add(vacation);

  SA = new THREE.Mesh(new THREE.PlaneGeometry(110, 150), new THREE.MeshLambertMaterial({ map: loader.load('SA.png'), transparent: true, side: THREE.DoubleSide }));
  SA.position.set(550, 100, -350);
  SA.rotation.x = 0.01;
  SA.rotation.y = Math.PI / 0.5;
  SA.rotation.y += 4.6;
  scene.add(SA);

  // Headlamps
  const headlamp1 = new THREE.Mesh(new THREE.BoxGeometry(90, 24, 300), headlampmaterials);
  headlamp1.position.set(-400, 350, -410);
  scene.add(headlamp1);

  const headlamp2 = new THREE.Mesh(new THREE.BoxGeometry(90, 24, 300), headlampmaterials);
  headlamp2.position.set(400, 350, -410);
  scene.add(headlamp2);

  headlamp1Light = new THREE.Mesh(new THREE.PlaneGeometry(90, 300), new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }));
  headlamp1Light.position.set(-400, 337, -410);
    headlamp1Light.rotation.x = 1.57;
  scene.add(headlamp1Light);

  // Rooms
  room1 = new THREE.Mesh(new THREE.BoxGeometry(1280, 720, 1280), roommaterials);
  room1.position.set(0, 0, 0);
  scene.add(room1);

  room2 = new THREE.Mesh(new THREE.BoxGeometry(1280, 720, 1280), room2materials);
  room2.position.set(roomOffsetX, 0, 0);
  scene.add(room2);

  room3 = new THREE.Mesh(new THREE.BoxGeometry(1280, 720, 1280), room3materials);
  room3.position.set(-roomOffsetX, 0, 0);
  scene.add(room3);

  rooms.push(room1, room2, room3);
  setActiveRoom(0, 0);

  // table&tabletop cube
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(785, 21, 231), tabletopmaterials);
  tabletop.position.set(0, -110, -400);
  scene.add(tabletop);

  const table = new THREE.Mesh(new THREE.BoxGeometry(750, 157, 207), tablematerials);
  table.position.set(0, -180, -400);
  scene.add(table);


  // Guy texture
StandGuy = new THREE.Mesh(new THREE.PlaneGeometry(222, 327), new THREE.MeshLambertMaterial({ map: loader.load('Stand.png'), transparent: true, side: THREE.DoubleSide }));
StandGuy.position.set(0, 0, -500);
scene.add(StandGuy);

  const menu = new THREE.Mesh(new THREE.PlaneGeometry(100, 20), new THREE.MeshLambertMaterial({ map: loader.load('menu.png'), transparent: false, side: THREE.DoubleSide }));
  menu.position.set(0, -50, -499);
 ///////scene.add(menu);

  // Smoke texture
Smoke1 = new THREE.Mesh(new THREE.PlaneGeometry(46, 141), new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke 2.png'), transparent: true, side: THREE.DoubleSide }));
Smoke1.position.set(90, 140, -480);
scene.add(Smoke1);

Smoke2 = new THREE.Mesh(new THREE.PlaneGeometry(46, 141), new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke.png'), transparent: true, side: THREE.DoubleSide }));
Smoke2.position.set(90, 140, -480);
scene.add(Smoke2);

  // Mouse move and click
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('click', onClick, false);

  // Resize
  window.addEventListener('resize', onWindowResize);



  //TOTAL OBJECTS AND THEIR NAMES
  chooselife.name = "poster";
  vacation.name = "promo";
  SA.name = "poster";
  StandGuy.name = "MENU";
  boomboxMesh.name = "music";
  cassette1.name = "Vibes";
  cassette2.name = "Welcome";
  cassette3.name = "Meow";
  socks.name = "Socks";
}

function setSubtext(value) {
  // Find or create the subtext element once per overlay
  let el = overlay.querySelector('.overlay-subtext');
  if (!el && value != null && value !== false && value !== '') {
    el = document.createElement('div');
    el.className = 'overlay-subtext';
    message.insertAdjacentElement('afterend', el);
  }
  if (!el) return;

  if (value == null || value === false || value === '') {
    el.hidden = true;          
  } else {
    el.hidden = false;
    el.textContent = String(value);
  }
}

//Clicking menu
function onClick() {
  raycaster.setFromCamera(mouse, camera);
  buzz.play();
  buzz2.play();

  if (overlay.style.display === "flex") return;

  if (StandGuyScrewedYou) {
    showGoodbyeMessage();
    return;
  }

  // StandGuy
  const standIntersects = raycaster.intersectObject(StandGuy);
  if (standIntersects.length > 0) {
    showInitialOptions();
  }

  const socksIntersects = raycaster.intersectObject(socks);
  if (socksIntersects.length > 0) {
    socksCredits();
  }

  const chooselifeIntersects = raycaster.intersectObject(chooselife);
  if (chooselifeIntersects.length > 0) {
    chooselifefunction();
  }

  const vacationIntersects = raycaster.intersectObject(vacation);
  if (vacationIntersects.length > 0) {
    vacationfunction();
  } 

    const SAIntersects = raycaster.intersectObject(SA);
  if (SAIntersects.length > 0) {
    SAfunction();
  } 

  const boomboxIntersects = raycaster.intersectObject(boomboxMesh);
  if (boomboxIntersects.length > 0) {
    boomboxfunction();
    playsound();
  }

  const cassette1Intersects = raycaster.intersectObject(cassette1);
  if (cassette1Intersects.length > 0) {
    insertCassette(1);
  }

  const cassette2Intersects = raycaster.intersectObject(cassette2);
  if (cassette2Intersects.length > 0) {
    insertCassette(2);
  }

  const cassette3Intersects = raycaster.intersectObject(cassette3);
  if (cassette3Intersects.length > 0) {
    insertCassette(3);
  }
}

function stopAllMusic() {
  [music1, music2, music3].forEach((a) => {
    if (a && a.isPlaying) a.stop();
  });
}

function playsound(){
  if (play.visible === false){boomboxplay.play()
  }else{boomboxstop.play()}
}

function boomboxfunction() {
  if (boombox.isBroken) {
    return;
  }

  if (boombox.currentTrack === null){ 
    overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
    message.innerText = "You`ve gotta insert the tape, man..";
    setTimeout(() => {overlay.style.display = "none";}, 1800);
  }

  boombox.toggleCount += 1;
  if (boombox.toggleCount > boombox.maxToggles) {
    boombox.isBroken = true;
    boombox.isOn = false;
    boombox.currentTrack = null;
    overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
    message.innerText = "You broke my boombox! I`ll remember that!";
    setTimeout(() => {overlay.style.display = "none";}, 1800);
    return;
  }

  boombox.isOn = !boombox.isOn;

  if (boombox.isOn) {
    if (boombox.currentTrack) {
      stopAllMusic();
boombox.currentTrack.play();
    }
  } else {
    stopAllMusic();
  }
}


function insertCassette(n) {
  if (boombox.isBroken) return;

  boomboxchange.play();

  const nextTrack = n === 1 ? music1 : n === 2 ? music2 : music3;

  if (boombox.currentTrack === nextTrack) return;

  boombox.currentTrack = nextTrack;
  boombox.isOn = false;
  stopAllMusic();

  if (boombox.isOn && nextTrack) {
    stopAllMusic();
    nextTrack.play();
  }
}

function SAfunction(){
      overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
    message.innerText = "The Birds There Don't Sing, They Screech in Pain.";
  
    const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
  }

function vacationfunction(){
      overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
    message.innerText = "Saigon… Every time I think I'm gonna wake up back in the jungle.";
  
    const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
  }

function chooselifefunction(){
      overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
    message.innerText = "Choose Life. Choose a job. Choose a career. Choose a good movie to watch";
  
    const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
  }


function socksCredits() {
    overlay.style.display = "flex";
    isSocksOverlayOpen = true;
    buttonsDiv.innerHTML = "";
    message.innerHTML = `Website by <span style="font-size:1.3em;font-weight:bold;">NOTInteresting</span><br><br><br>Feedback form:`;
    SpinForMeBaby = !SpinForMeBaby;
    
    //feedback input
    const input = document.createElement("textarea");
  input.rows = 1;
  input.maxLength = 400;
  input.placeholder = "";
  input.classList.add("overlay-input");
  input.style.resize = "none";
  input.style.overflowY = "hidden";
  input.addEventListener("input", () => {
    input.rows = 1;
    const lines = input.value.split("\n").length;
    const scrollRows = Math.ceil(input.scrollHeight / 24);
    input.rows = Math.min(Math.max(lines, scrollRows), 4);
  });
  input.style.display = "block";
    

    //Send feedback
const SendBtn = document.createElement("button");
SendBtn.textContent = "Send";

SendBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const feedbackText = input.value;

  if (!feedbackText.trim()) {
    message.innerText = "You ok? Say hi at least.";
    return;
  }
  message.innerText = "Pending..."
  buttonsDiv.innerHTML = "";
  emailjs.init("j6eGEWxM4dbVz2LIQ");
  emailjs.send("service_d1s52e7", "template_ss3e15y", {
    message: feedbackText
  })
  .then(() => {
    message.innerText = "Thanks!!";
    SpinForMeBaby = !SpinForMeBaby;
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1500);
  })
  .catch((error) => {
    console.error("Email send error:", error);
    message.innerText = "Error. sry";
  });
});
SendBtn.style.display = "block";


      //Links
    const LinkBtn = document.createElement("button");
      LinkBtn.textContent = "Other Projects";
      LinkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    LinkBtn.style.display = "block";
    LinkBtn.classList.add("centered");
    LinkBtn.style.marginTop = "18px";

      //meow
    const SocksBtn = document.createElement("button");
      SocksBtn.textContent = "Lucy";
      SocksBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        meow.play();
      });
    SocksBtn.style.display = "block";

      //close
    const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        SpinForMeBaby = !SpinForMeBaby;
      });
      closeBtn.style.marginTop = "68px";

      buttonsDiv.appendChild(input);
      buttonsDiv.appendChild(SendBtn);
      buttonsDiv.appendChild(LinkBtn);
      buttonsDiv.appendChild(SocksBtn);
      buttonsDiv.appendChild(closeBtn);
  }

//mainmenu
function showInitialOptions() {
  animateCameraForward(-120, 300);

  overlay.style.display = "flex";
  message.innerHTML = '*Wassup.*';

  setSubtext('MODE');

  buttonsDiv.innerHTML = "";

  // Carousel
  const carousel = document.createElement("div");
  carousel.id = "carousel";

  const leftBtn = document.createElement("button");
  leftBtn.className = "nav-btn";
  leftBtn.textContent = "<";

  const rightBtn = document.createElement("button");
  rightBtn.className = "nav-btn";
  rightBtn.textContent = ">";

  const viewport = document.createElement("div");
  viewport.className = "viewport";

  const inner = document.createElement("div");
  inner.className = "inner";
  viewport.appendChild(inner);

  const items = [
    { text: "Recommendation", handler: handleQ1 },
    { text: "Therapy",        handler: handleQ2 },
    { text: "Cinemaphile",    handler: handleQ3 },
  ];

  const buttons = items.map((q, idx) => {
    const btn = document.createElement("button");
    btn.textContent = q.text;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveRoom(idx, 300);
      q.handler();
    });
    inner.appendChild(btn);
    return btn;
  });

  carousel.appendChild(leftBtn);
  carousel.appendChild(viewport);
  carousel.appendChild(rightBtn);

  // Sync for scroll and room animation
  let currentIndex = 0;
  const duration = 300;

  function itemWidth() {
    const first = buttons[0];
    if (!first) return 200;
    const rect = first.getBoundingClientRect();
    // include CSS gap
    const gapStr = getComputedStyle(inner).gap || getComputedStyle(inner).columnGap || "8px";
    const gap = parseFloat(gapStr) || 8;
    return rect.width + gap;
  }

  function scrollToIndex(index, smooth = true) {
    currentIndex = (index + items.length) % items.length;
    const left = currentIndex * itemWidth();
    if (smooth) {
      viewport.scrollTo({ left, behavior: "smooth" });
    } else {
      viewport.scrollLeft = left;
    }
    setActiveRoom(currentIndex, duration);
  }

  leftBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollToIndex(currentIndex - 1);
  });

  rightBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollToIndex(currentIndex + 1);
  });

  // Optional: keyboard navigation when overlay is open
  function onKey(e) {
    if (overlay.style.display !== "flex") return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(currentIndex + 1);
    }
  }
  document.addEventListener("keydown", onKey);

  // Keep selection centered on resize
  const onResize = () => scrollToIndex(currentIndex, false);
  window.addEventListener("resize", onResize);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "close";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.display = "none";
    camera.position.z -= -120;
      setSubtext('');

    // cleanup listeners
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
  });

  buttonsDiv.appendChild(carousel);
  buttonsDiv.appendChild(closeBtn);

  // Start on the first item
  // Ensure layout is painted before initial scroll
  requestAnimationFrame(() => scrollToIndex(0, false));
}

function handleQ1() {
  message.innerText = "Yeah. Watch ya thinking `bout? (Every input`s optional)";
  buttonsDiv.innerHTML = "";
  message.subtext = "";
  setSubtext('');

  // State for continuation
  let lastPromptQ2 = "";
  let seenMoviesQ2 = [];
  let seenBtnQ2 = null;

  const extractMovieTitle = (text) => {
    if (!text) return "";
    const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
    return lines[0] || "";
  };

  const ensureCloseButton = () => {
    const alreadyHasClose = [...buttonsDiv.querySelectorAll("button")].some(
      (b) => b.textContent === "close"
    );
    if (!alreadyHasClose) {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        camera.position.z -= -120;
      });
      buttonsDiv.appendChild(closeBtn);
    }
  };

  const appendSeenButton = () => {
    if (seenBtnQ2 && seenBtnQ2.isConnected) {
      seenBtnQ2.remove();
    }
    seenBtnQ2 = document.createElement("button");
    seenBtnQ2.textContent = "I`ve seen that one!";
    seenBtnQ2.style.display = "inline-block";
    seenBtnQ2.style.marginTop = "8px";
    seenBtnQ2.addEventListener("click", () => {
      const continuationPrompt =
        lastPromptQ2 +
        "\n\n" +
        (seenMoviesQ2.length ? ` (avoid: ${seenMoviesQ2.join(", ")})` : "") +
        "";
      sendPrompt(continuationPrompt, true);
    });
    buttonsDiv.appendChild(seenBtnQ2);
  };

const sendPrompt = (prompt, isContinuation = false) => {
  message.innerText = "wait a sec...";
  buttonsDiv.innerHTML = "";
  ensureCloseButton();

  fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.reply !== undefined) {
        const title = extractMovieTitle(data.reply);

        if (title) {
          message.innerHTML =
            `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
            data.reply.replace(title, "");
          if (!seenMoviesQ2.includes(title)) seenMoviesQ2.push(title);
        } else {
          message.innerText = data.reply;
        }

        ensureCloseButton();
        appendSeenButton();
      } else if (data.error) {
        message.innerText = "Error: " + data.error;
      } else {
        message.innerText = "Error: Unexpected response";
      }
    })
    .catch((err) => {
      message.innerText = "Error: " + err.message;
    });
};

  // Text input
  const input = document.createElement("textarea");
  input.rows = 1;
  input.maxLength = 400;
  input.placeholder = "key words";
  input.classList.add("overlay-input");
  input.style.resize = "none";
  input.style.overflowY = "hidden";
  input.addEventListener("input", () => {
    input.rows = 1;
    const lines = input.value.split("\n").length;
    const scrollRows = Math.ceil(input.scrollHeight / 24);
    input.rows = Math.min(Math.max(lines, scrollRows), 4);
  });
  input.style.display = "block";

  // season`s mood toggle button
  let moodOn = false;
  const moodBtn = document.createElement("button");
  const setMoodLabel = () => (moodBtn.textContent = `season\`s mood: ${moodOn ? "on" : "off"}`);
  setMoodLabel();
  moodBtn.addEventListener("click", () => {
    moodOn = !moodOn;
    setMoodLabel();
  });
  moodBtn.style.display = "block";
  moodBtn.style.marginTop = "8px";

  // List box 1
  const list1 = document.createElement("select");
  list1.classList.add("overlay-input");
  const options1 = [
    { value: "Your MBTI type", label: "Your MBTI type" },
    { value: "ENTJ", label: "ENTJ" }, { value: "ENTP", label: "ENTP" },
    { value: "ENFJ", label: "ENFJ" }, { value: "ENFP", label: "ENFP" },
    { value: "ESTJ", label: "ESTJ" }, { value: "ESTP", label: "ESTP" },
    { value: "ESFJ", label: "ESFJ" }, { value: "ESFP", label: "ESFP" },
    { value: "INTJ", label: "INTJ" }, { value: "INTP", label: "INTP" },
    { value: "INFJ", label: "INFJ" }, { value: "INFP", label: "INFP" },
    { value: "ISTJ", label: "ISTJ" }, { value: "ISTP", label: "ISTP" },
    { value: "ISFJ", label: "ISFJ" }, { value: "ISFP", label: "ISFP" },
  ];
  options1.forEach(({ value, label }) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    list1.appendChild(opt);
  });
  list1.style.display = "block";

  // List box 2
  const list2 = document.createElement("select");
  list2.classList.add("overlay-input");
  const options2 = [
    { value: "Your star sign", label: "Your star sign" },
    { value: "Aries", label: "Aries" }, { value: "Taurus", label: "Taurus" },
    { value: "Gemini", label: "Gemini" }, { value: "Cancer", label: "Cancer" },
    { value: "Leo", label: "Leo" }, { value: "Virgo", label: "Virgo" },
    { value: "Libra", label: "Libra" }, { value: "Scorpio", label: "Scorpio" },
    { value: "Sagittarius", label: "Sagittarius" }, { value: "Capricorn", label: "Capricorn" },
    { value: "Aquarius", label: "Aquarius" }, { value: "Pisces", label: "Pisces" },
  ];
  options2.forEach(({ value, label }) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    list2.appendChild(opt);
  });
  list2.style.display = "block";

  const btn1 = document.createElement("button");
  btn1.textContent = "Submit";
  btn1.classList.add("centered");
  btn1.style.marginTop = "8px";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btn1.click();
    }
  });

  btn1.addEventListener("click", () => {
    try {
      const userInput = input.value;

      const parts = ["Recommend me a movie!"];
      if (typeof userInput === "string" && userInput.trim().length > 0) {
        parts.push(".Key word(s) will be: ", userInput.trim());
      }
      if (moodOn) {
        const month = new Date().toLocaleString("en-US", { month: "long" });
        parts.push(".It must correlate with ", month);
      }
      if (list1.value !== "Your MBTI type") {
        parts.push(".Its story should be liked by ", list1.value);
      }
      if (list2.value !== "Your star sign") {
        parts.push(".And its vibe should be liked by ", list2.value);
      }

      lastPromptQ2 =
        parts.join(" ") +
        " Be sure to include EVERYTHING mentioned in your answer. Strict answer form: first line only the name of the film, then skip a line, " +
        "then highlight why you chose this film in less than 25 words. Write as you are a teenager. No emojis. No formatting";

      sendPrompt(lastPromptQ2, false);
    } catch (err) {
      message.innerText = "Error: " + (err && err.message ? err.message : String(err));
    }
  });

  // "What are YOUR favourites?" lower
  const btn2 = document.createElement("button");
  btn2.textContent = "What are YOUR favourites?";
  btn2.style.display = "block";
  btn2.style.marginTop = "30px"; // lower
  btn2.addEventListener("click", () => {
    message.innerText = "You will never be able to comprehend the levels of MY understanding of cinema.";
    booom.play();
    camera.position.z -= 80;
    buttonsDiv.innerHTML = "";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "close";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      overlay.style.display = "none";
      camera.position.z -= -200;
    });
    buttonsDiv.appendChild(closeBtn);
  });

  buttonsDiv.appendChild(input);
  buttonsDiv.appendChild(moodBtn);
  buttonsDiv.appendChild(list1);
  buttonsDiv.appendChild(list2);
  buttonsDiv.appendChild(btn1);
  buttonsDiv.appendChild(btn2);
}

//Q2
function handleQ2() {
  message.innerText = "I`ll find a film that shows how to deal with your situation!";
  buttonsDiv.innerHTML = "";
  setSubtext('');

  let lastPromptQ1 = "";
  let seenMoviesQ1 = [];
  let seenBtnQ1 = null;

  const extractMovieTitle = (text) => {
    if (!text) return "";
    const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
    return lines[0] || "";
  };
//CLOSE BTN
  const ensureCloseButton = () => {
    const alreadyHasClose = [...buttonsDiv.querySelectorAll("button")].some(
      (b) => b.textContent === "close"
    );
    if (!alreadyHasClose) {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        camera.position.z -= -100;
      });
      buttonsDiv.appendChild(closeBtn);
    }
  };
//SEEN
  const appendSeenButton = () => {
    if (seenBtnQ1 && seenBtnQ1.isConnected) {
      seenBtnQ1.remove();
    }
    seenBtnQ1 = document.createElement("button");
    seenBtnQ1.textContent = "I`ve seen that one!";
    seenBtnQ1.addEventListener("click", () => {
      const continuationPrompt =
        lastPromptQ1 +
        "\n\n" +
        (seenMoviesQ1.length ? ` (avoid: ${seenMoviesQ1.join(", ")})` : "") +
        "";
      sendPrompt(continuationPrompt, true);
    });
    buttonsDiv.appendChild(seenBtnQ1);
  };

  const sendPrompt = (prompt, isContinuation = false) => {
  message.innerText = "wait a sec...";
  buttonsDiv.innerHTML = "";
  ensureCloseButton();

  fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.reply !== undefined) {
        const title = extractMovieTitle(data.reply);

        if (title) {
          // Title is bold, large, and a blank line separates it from the rest
          message.innerHTML =
            `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
            data.reply.replace(title, "");
          if (!seenMoviesQ1.includes(title)) seenMoviesQ1.push(title);
        } else {
          message.innerText = data.reply;
        }

        ensureCloseButton();
        appendSeenButton();
      } else if (data.error) {
        message.innerText = "Error: " + data.error;
      } else {
        message.innerText = "Error: Unexpected response";
      }
    })
    .catch((err) => {
      message.innerText = "Error: " + err.message;
    });
};

  const input = document.createElement("textarea");
  input.rows = 1;
  input.maxLength = 400;
  input.placeholder = "";
  input.classList.add("overlay-input");
  input.style.resize = "none";
  input.style.overflowY = "hidden";
  input.addEventListener("input", () => {
    input.rows = 1;
    const lines = input.value.split("\n").length;
    const scrollRows = Math.ceil(input.scrollHeight / 24);
    input.rows = Math.min(Math.max(lines, scrollRows), 4);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.classList.add("centered");

  // Enter works as click
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitBtn.click();
    }
  });

  submitBtn.addEventListener("click", () => {
    const userInput = input.value;
    lastPromptQ1 =
      userInput +
      ". What film is about it and shows how to deal with it?" +
      "Strict answer form: first line only the name of the film, then skip a line, " +
      "then highlight why you chose this film in less than 25 words. Write as you are a teenager. No emojis, no formatting.";

    sendPrompt(lastPromptQ1, false);
  });

  buttonsDiv.appendChild(input);
  buttonsDiv.appendChild(submitBtn);
}


//Q3
function handleQ3() {
  message.innerText = "Work in progress here!";
  buttonsDiv.innerHTML = "";
  setSubtext('');

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", (e) => {e.stopPropagation(); camera.position.z -= -120; overlay.style.display = "none";});
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

  // run active number animations
  const now = performance.now();
  _anims = _anims.filter(a => a.update(now));


  //FlickerLight flicker 
  if (Math.random() < 0.01) { //% chance per frame
  FlickerLight.intensity = 0.3 + Math.random() * 0.1;
  click.play();
  headlamp1Light.visible = true;
} else {
  FlickerLight.intensity = 1.0;
  headlamp1Light.visible = false;
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

//fan animation 
    fan.rotation.z += -0.14;


      const fancycle = 800;
      const timefan = Date.now() % fancycle;
  if (timefan < 200) {
  fanstrip1.visible = true;
  fanstrip2.visible = false;
  fanstrip3.visible = false;
} else if (timefan < 300) {
  fanstrip1.visible = false;
  fanstrip2.visible = true;
  fanstrip3.visible = false;
} else if (timefan < 400) {
  fanstrip1.visible = false;
  fanstrip2.visible = false;
  fanstrip3.visible = true;
} else if (timefan < 600){
  fanstrip1.visible = false;
  fanstrip2.visible = true;
  fanstrip3.visible = false;
} else if (timefan < 800){
  fanstrip1.visible = false;
  fanstrip2.visible = true;
  fanstrip3.visible = false;
}

  // Smooth camera movement
  camera.rotation.y = -mouseX * 0.01;
  camera.rotation.x = -mouseY * 0.01;

  renderer.render(scene, camera);


  // Object highlighting

  if (overlay.style.display !== "flex") {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([StandGuy, socks, chooselife, boomboxMesh, cassette1, cassette2, cassette3, vacation, SA]);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const object = hit.object;
      const distanceToCenter = hit.point.distanceTo(object.position);

      if (distanceToCenter < 100) {
        if (INTERSECTED !== object) {
          // Remove highlight from previous
          if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          }
          if (highlightBox) {
            scene.remove(highlightBox);
            highlightBox = null;
          }
          nameLabel.style.display = 'none';

          INTERSECTED = object;

          // Apply highlight
          if (INTERSECTED.material && INTERSECTED.material.emissive) {
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0x1a1714);
          }

          // Add perimeter box
          highlightBox = new THREE.BoxHelper(INTERSECTED, 0xffd700); // Gold color
          highlightBox.material.linewidth = 4;
          ////////scene.add(highlightBox);

          // Show name label
          nameLabel.textContent = INTERSECTED.name || 'Unnamed Object';
          nameLabel.style.display = 'block';

          // Project object's position to screen
          let vector = INTERSECTED.position.clone();
          vector.project(camera);

          // Convert to screen coordinates
          let x = (vector.x * 0.5 + 0.5) * window.innerWidth;
          let y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
          nameLabel.style.left = `${x + 12}px`;
          nameLabel.style.top = `${y - 24}px`;
        } else {
          // If already intersected, just update nameLabel position (in case camera moved)
          if (INTERSECTED) {
            let vector = INTERSECTED.position.clone();
            vector.project(camera);
            let x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            let y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
            nameLabel.style.left = `${x + 12}px`;
            nameLabel.style.top = `${y - 24}px`;
          }
        }
      } else {
        // Too far, remove highlight
        if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
        if (highlightBox) {
          scene.remove(highlightBox);
          highlightBox = null;
        }
        nameLabel.style.display = 'none';
      }
    } else {
      // Nothing intersected
      if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
      INTERSECTED = null;
      if (highlightBox) {
        scene.remove(highlightBox);
        highlightBox = null;
      }
      nameLabel.style.display = 'none';
    }
  } else {
    // Overlay up, always clear highlight
    if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
    if (highlightBox) {
      scene.remove(highlightBox);
      highlightBox = null;
    }
    nameLabel.style.display = 'none';
  }


//SPINFORMEBABY
  if (SpinForMeBaby) {
  socksLight.color.setHSL((performance.now() * 0.0001) % 1, 1, 0.05);
  socksLight.intensity = 50 + 50 * Math.sin(performance.now() * 0.004);
  socks.rotation.z += 0.1;
  socks.rotation.y += 0.01;
  socks.rotation.x += 0.1;
  }
  else {
  socksLight.intensity = 0;
  socks.rotation.z = 0;
  socks.rotation.y = 0;
  socks.rotation.x = 0;
}

//Boombox playbutton sound toggle

if(boombox.isOn & boombox.currentTrack === null){
play.visible = true;
pause.visible = false;
}else if(boombox.isOn){
play.visible = true;
pause.visible = false;
buzz.setVolume(0.01);
buzz2.setVolume(0.02);
click.setVolume(0.002);
}else{
  play.visible = false;
pause.visible = true;
buzz.setVolume(0.03);
buzz2.setVolume(0.07);
click.setVolume(0.01);
}

}

//Camera animations