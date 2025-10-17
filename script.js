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
let booom, meow, buzz, buzz2, click, sockssound, paper;
let boomboxplay, boomboxhiss, boomboxchange, boomboxstop;
let speechFiles;
let chooselife, vacation, SA, siganim;
let cassette1, cassette2, cassette3;
let freefilms;
let boomboxMesh;
let room1, room2, room3;
let pause, play;
let Esc = false;
let turnoff, outro, OverallLight, goodbye;

let menuOpen = false;
let YOURFavStatus = false;

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

// remember last InitialOptions carousel index
let lastInitialIndex = 0;

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




  OverallLight = new THREE.AmbientLight(0x7a6b5c, 0.4, 10000);
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
  boomboxchange.setVolume(0.2);

  boomboxplay = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-play.mp3', b => boomboxplay.setBuffer(b));
  boomboxplay.setVolume(0.5);

  boomboxhiss = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-hiss.mp3', b => boomboxhiss.setBuffer(b));
  boomboxhiss.setVolume(0.3);
   
  boomboxstop = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-stop.mp3', b => boomboxstop.setBuffer(b));
  boomboxstop.setVolume(0.3);

  sockssound = new THREE.Audio(listener); new THREE.AudioLoader().load('socks.mp3', b => sockssound.setBuffer(b));
  sockssound.setVolume(0.1);
  sockssound.setLoop(true);

  paper = new THREE.Audio(listener); new THREE.AudioLoader().load('paper.mp3', b => paper.setBuffer(b));
  paper.setVolume(0.5);

  turnoff = new THREE.Audio(listener); new THREE.AudioLoader().load('turnoff.mp3', b => turnoff.setBuffer(b));
  turnoff.setVolume(0.9);

  outro = new THREE.Audio(listener); new THREE.AudioLoader().load('outro.mp3', b => outro.setBuffer(b));
  outro.setVolume(0.9);

speechFiles = [
  'speech1.mp3',
  'speech2.mp3',
  'speech3.mp3',
  'speech4.mp3',
  'speech5.mp3',
];


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
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide })  
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

  siganim = new THREE.Mesh(new THREE.PlaneGeometry(50, 57), new THREE.MeshLambertMaterial({ map: loader.load('siganim.png'), transparent: true, side: THREE.DoubleSide }));
  siganim.position.set(-480, 210, -637);
  siganim.rotation.z = -0.05;
  scene.add(siganim);

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

  // SHELVES and FREE box
  freefilms = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 80), new THREE.MeshLambertMaterial({ map: loader.load('free.png'), transparent: true, side: THREE.DoubleSide }));
  freefilms.position.set(-400, -28, -580);
  scene.add(freefilms);

 const shelveback = new THREE.Mesh(new THREE.PlaneGeometry(480, 590), new THREE.MeshLambertMaterial({ map: loader.load('shelveback.png'), transparent: true, side: THREE.DoubleSide }));
  shelveback.position.set(-393, -20, -639);
  scene.add(shelveback);

   const shelvegrid = new THREE.Mesh(new THREE.PlaneGeometry(480, 590), new THREE.MeshLambertMaterial({ map: loader.load('shelvegrid.png'), transparent: true, side: THREE.DoubleSide }));
  shelvegrid.position.set(-393, -20, -638);
  scene.add(shelvegrid);

const shelve1 = new THREE.Mesh(new THREE.BoxGeometry(450, 10, 90), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelve1.position.set(-393, -87, -590);
  scene.add(shelve1);

  const shelve2 = new THREE.Mesh(new THREE.BoxGeometry(450, 10, 90), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelve2.position.set(-393, 36, -590);
  scene.add(shelve2);

    const shelve3 = new THREE.Mesh(new THREE.BoxGeometry(450, 10, 90), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelve3.position.set(-393, 154, -590);
  scene.add(shelve3);

  const shelvetape = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelvetape.position.set(-393, 154, -590);
  scene.add(shelvetape);

    const shelvefilms = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 50), new THREE.MeshLambertMaterial({ map: loader.load('shelvefilms.png'), transparent: true, side: THREE.DoubleSide }));
  shelvefilms.position.set(-490, 93, -570);
  scene.add(shelvefilms);


  const shelvefilms1 = new THREE.Mesh(new THREE.BoxGeometry(70, 100, 50), new THREE.MeshLambertMaterial({ map: loader.load('shelvefilms1.png'), transparent: true, side: THREE.DoubleSide }));
  shelvefilms1.position.set(-550, -28, -580);
  scene.add(shelvefilms1);

    const shelvefilms2 = new THREE.Mesh(new THREE.BoxGeometry(70, 100, 50), new THREE.MeshLambertMaterial({ map: loader.load('shelvefilms2.png'), transparent: true, side: THREE.DoubleSide }));
  shelvefilms2.position.set(-260, -28, -580);
  scene.add(shelvefilms2);



  // Guy texture
StandGuy = new THREE.Mesh(new THREE.PlaneGeometry(222, 327), new THREE.MeshLambertMaterial({ map: loader.load('Stand.png'), transparent: true, side: THREE.DoubleSide }));
StandGuy.position.set(0, 0, -500);
scene.add(StandGuy);

  const menu = new THREE.Mesh(new THREE.PlaneGeometry(100, 20), new THREE.MeshLambertMaterial({ map: loader.load('menu.png'), transparent: false, side: THREE.DoubleSide }));
  menu.position.set(0, -50, -499);
 //////scene.add(menu);

 goodbye = new THREE.Mesh(new THREE.PlaneGeometry(60, 100), new THREE.MeshLambertMaterial({ map: loader.load('goodbye.png'), transparent: true, side: THREE.DoubleSide }));
  goodbye.position.set(1000, -94, -340);
  goodbye.rotation.x = Math.PI / 2;
  goodbye.rotation.z = Math.PI / 1.1;

scene.add(goodbye);

  // Smoke texture
Smoke1 = new THREE.Mesh(new THREE.PlaneGeometry(46, 141), new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke 2.png'), transparent: true, side: THREE.DoubleSide }));
Smoke1.position.set(90, 140, -480);
scene.add(Smoke1);

Smoke2 = new THREE.Mesh(new THREE.PlaneGeometry(46, 141), new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke.png'), transparent: true, side: THREE.DoubleSide }));
Smoke2.position.set(90, 140, -480);
scene.add(Smoke2);





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
  freefilms.name = "free films";
  siganim.name = "booklet";
  goodbye.name = "photo"

  // Mouse move and click
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('click', onClick, false);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function getRandomSound() {
  const idx = Math.floor(Math.random() * speechFiles.length);
  return new Audio(speechFiles[idx]);
}


function speechAnimation(text, container, speed = 100) {
  return new Promise(resolve => {
    container.textContent = ''; // Clear previous text
    let i = 0;
    function typeNext() {
      if (i < text.length) {
        container.textContent += text[i];
        if (text[i].trim()) {
          const sound = getRandomSound();
          sound.volume = 0.5;
          sound.play();
        }
        i++;
        setTimeout(typeNext, speed);
      } else {
        resolve();
      }
    }
    typeNext();
  });
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

// helper: top-left back/home button
function ensureTopLeftButton(key, label, onClick) {
  if (buttonsDiv.querySelector(`button[data-role="${key}"]`)) return;
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.dataset.role = key;
  btn.style.position = "fixed";
  btn.style.left = "16px";
  btn.style.top = "-21px";
  btn.style.zIndex = "1000";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  buttonsDiv.appendChild(btn);
}

function onClick() {
  raycaster.setFromCamera(mouse, camera);
  buzz.play();
  buzz2.play();

  if (overlay.style.display === "flex") return;

  if (Esc){
    const goodbyeIntersects = raycaster.intersectObject(goodbye);
  if (goodbyeIntersects.length > 0) {goodbyeFunction();}
    return;
  }

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

    const freefilmsIntersects = raycaster.intersectObject(freefilms);
  if (freefilmsIntersects.length > 0) {
    freefilmsfunction();
  }

    const siganimIntersects = raycaster.intersectObject(siganim);
  if (siganimIntersects.length > 0) {
    siganimfunction();
  }


}

function siganimfunction() {
  overlay.style.display = "flex";
  buttonsDiv.innerHTML = "";
  message.innerText = "";
  paper.play();

  const img = document.createElement("img");
  img.src = "siganim.png";
  img.style.width = "400px";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "0 auto";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "close";
  closeBtn.style.display = "block";
  closeBtn.style.margin = "18px auto 0 auto";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.display = "none";
  });

  buttonsDiv.appendChild(img);
  buttonsDiv.appendChild(closeBtn);
}


function goodbyeFunction(){
  overlay.style.display = "flex";
  buttonsDiv.innerHTML = "";
  message.innerText = "";
  paper.play();

  const img = document.createElement("img");
  img.src = "goodbye.png";
  img.style.width = "400px";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "0 auto";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "close";
  closeBtn.style.display = "block";
  closeBtn.style.margin = "18px auto 0 auto";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.display = "none";
  });

  buttonsDiv.appendChild(img);
  buttonsDiv.appendChild(closeBtn);
}

function freefilmsfunction() {
  overlay.style.display = "flex";
  buttonsDiv.innerHTML = "";

  speechAnimation("Free of charge. Public domain - ever heard of it?", message, 30)
    .then(() => {
      // Carousel Data
      const carouselScreens = [
        {
          poster: "poster1.png",
          text: "Soviet arthouse - modern operator`s textbook",
          link: "https://youtu.be/3GyNB4-eN1E?si=SPlw--8JxHheAt7g"
        },
        {
          poster: "poster2.png",
          text: "Greatest slapstick comedy of all time",
          link: "https://youtu.be/efydqBb5_Wc?si=8XkFCfMxH1eA53VJ"
        },
        {
          poster: "poster3.png",
          text: "Incredible performances",
          link: "https://youtu.be/P_gly_fIfEE?si=9YlUsMCulztplpQ_"
        },
        {
          poster: "poster4.png",
          text: "First truely blockbuster movie",
          link: "https://youtu.be/1CVLz1_MrCk?si=4oLmztjFV4iZTXCj"
        }
      ];

      // Carousel Setup
      const SCREEN_GAP = 32;
      const carousel = document.createElement("div");
      carousel.id = "carousel";
      carousel.style.display = "grid";
      carousel.style.gridTemplateColumns = "auto 1fr auto";
      carousel.style.alignItems = "center";
      carousel.style.columnGap = "16px";

      const leftBtn = document.createElement("button");
      leftBtn.className = "nav-btn";
      leftBtn.textContent = "<";

      const rightBtn = document.createElement("button");
      rightBtn.className = "nav-btn";
      rightBtn.textContent = ">";

      const viewport = document.createElement("div");
      viewport.className = "viewport";
      viewport.style.overflow = "hidden";
      viewport.style.justifySelf = "center";
      viewport.style.width = "min(400px, 80vw)";
      viewport.style.maxWidth = "100%";

      const inner = document.createElement("div");
      inner.className = "inner";
      inner.style.display = "flex";
      inner.style.gap = `${SCREEN_GAP}px`;
      inner.style.transition = "transform 0.25s cubic-bezier(.4,2,.2,1)";

      // Create carousel screens
      carouselScreens.forEach((screen, idx) => {
        const screenDiv = document.createElement("div");
        screenDiv.className = "carousel-screen";
        screenDiv.style.display = "flex";
        screenDiv.style.flexDirection = "column";
        screenDiv.style.alignItems = "center";
        screenDiv.style.justifyContent = "center";
        screenDiv.style.height = "450px";
        screenDiv.style.width = "100%";

        // Poster image
        const img = document.createElement("img");
        img.src = screen.poster;
        img.alt = `Poster ${idx + 1}`;
        img.style.width = "200px";
        img.style.height = "auto";
        img.style.border = "3px solid #bbb";
        img.style.borderRadius = "6px"; // fixed: was "px"
        img.style.cursor = "pointer";
        img.style.transition = "border-color 0.2s";
        img.addEventListener("mouseover", () => {
          img.style.borderColor = "#ff9900ff";
        });
        img.addEventListener("mouseout", () => {
          img.style.borderColor = "#bbb";
        });
        img.addEventListener("click", () => {
          window.open(screen.link, "_blank");
        });

        // Text
        const txt = document.createElement("div");
        txt.textContent = screen.text;
        txt.style.marginTop = "18px";
        txt.style.textAlign = "center";
        txt.style.fontSize = "1em";
        txt.style.color = "#fffcfcff";

        screenDiv.appendChild(img);
        screenDiv.appendChild(txt);
        inner.appendChild(screenDiv);
      });

      viewport.appendChild(inner);

      // Carousel logic
      let index = 0;
      const clampIndex = (i) => Math.max(0, Math.min(carouselScreens.length - 1, i));

      const updateCarousel = () => {
        const viewportWidth = viewport.clientWidth || 0;
        if (viewportWidth === 0) return; // guard for early calls before layout

        [...inner.children].forEach((s) => {
          s.style.flex = `0 0 ${viewportWidth}px`;
          s.style.width = `${viewportWidth}px`;
        });
        inner.style.width = `${viewportWidth * carouselScreens.length + SCREEN_GAP * (carouselScreens.length - 1)}px`;
        const offset = index * (viewportWidth + SCREEN_GAP);
        inner.style.transform = `translate3d(-${offset}px, 0, 0)`;
        leftBtn.disabled = (index === 0);
        rightBtn.disabled = (index === carouselScreens.length - 1);
        leftBtn.classList.toggle("disabled", leftBtn.disabled);
        rightBtn.classList.toggle("disabled", rightBtn.disabled);
      };

      leftBtn.addEventListener("click", () => {
        index = clampIndex(index - 1);
        updateCarousel();
      });
      rightBtn.addEventListener("click", () => {
        index = clampIndex(index + 1);
        updateCarousel();
      });

      window.addEventListener("resize", updateCarousel, { passive: true });

      // Build DOM
      carousel.appendChild(leftBtn);
      carousel.appendChild(viewport);
      carousel.appendChild(rightBtn);

      // Insert carousel before buttons so it has layout
      buttonsDiv.appendChild(carousel);

      // Trigger initial layout AFTER it's in the DOM
      requestAnimationFrame(updateCarousel);

      // Also observe container size changes (more robust than window resize alone)
      let ro;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => updateCarousel());
        ro.observe(viewport);
      }

      // Buttons
      const linkBtn = document.createElement("button");
      linkBtn.textContent = "youtube playlist";
      linkBtn.style.display = "block";
      linkBtn.style.margin = "20px auto";
      linkBtn.addEventListener("click", () => {
        window.open("https://youtube.com/playlist?list=PLTYZuvjJPVnGYlXEiFujZFQNk6WMIp6u7&si=4ftAFitm_h-m8bwI", "_blank");
      });

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.style.display = "block";
      closeBtn.style.margin = "20px auto";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        // cleanup observers/listeners
        if (ro) ro.disconnect();
        window.removeEventListener("resize", updateCarousel);
      });

      buttonsDiv.appendChild(linkBtn);
      buttonsDiv.appendChild(closeBtn);
    });
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
    speechAnimation("You`ve gotta insert the tape, man..", message, 30)
    setTimeout(() => {overlay.style.display = "none";}, 1800);
  }

  boombox.toggleCount += 1;
  if (boombox.toggleCount > boombox.maxToggles) {
    boombox.isBroken = true;
    boombox.isOn = false;
    if (boombox.currentTrack) {
        boombox.currentTrack.pause();
        boombox.currentTrack.currentTime = 0;
        }
    boombox.currentTrack = null;
    boomboxhiss.play();

    buttonsDiv.innerHTML = "";
    setTimeout(() => {
    overlay.style.display = "flex"; 
    speechAnimation("You broke my boombox! I`ll remember that!", message, 30);
    setTimeout(() => {overlay.style.display = "none";}, 2200);
  }, 400);
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

  const nextTrack = n === 1 ? music1 : n === 2 ? music2 : music3;

  if (boombox.currentTrack === nextTrack) return;
    
  if (boombox.isOn ===true){boomboxstop.play();}

  boomboxchange.play();
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
  speechAnimation("Ze Birds there Don't Sing, zey Screech in Pain.", message, 30)
    .then(() => {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
    });
}

function vacationfunction(){
      overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
  speechAnimation("Saigon… Every time I think I'm gonna wake up back in the jungle.", message, 30)
    .then(() => {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
    });
}


function chooselifefunction(){
  
      overlay.style.display = "flex";
      buttonsDiv.innerHTML = "";
speechAnimation("Choose Life. Choose a job. Choose a career. Choose a good movie to watch", message, 30)
    .then(() => {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
    });
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


      //Link
    const LinkBtn = document.createElement("button");
      LinkBtn.textContent = "Project`s Discord";
      LinkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.open('https://discord.gg/nB7gYuAa', '_blank');
      });
    LinkBtn.style.display = "block";
    LinkBtn.classList.add("centered");
    LinkBtn.style.marginTop = "18px";

      //meow
    const SocksBtn = document.createElement("button");
      SocksBtn.textContent = "Socks";
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
  if (overlay.style.display !== "flex") animateCameraForward(-130, 300);

  overlay.style.display = "flex";
if (menuOpen === false){speechAnimation("Wassup. What you want?", message, 30)
  }else{message.innerText = "What else?"}

menuOpen = true;

  setSubtext('');

  buttonsDiv.innerHTML = "";

// Carousel
const carousel = document.createElement("div");
carousel.id = "carousel";

carousel.style.display = "grid";
carousel.style.gridTemplateColumns = "auto 1fr auto";
carousel.style.alignItems = "center";
carousel.style.columnGap = "16px";

const leftBtn = document.createElement("button");
leftBtn.className = "nav-btn";
leftBtn.textContent = "<";

const rightBtn = document.createElement("button");
rightBtn.className = "nav-btn";
rightBtn.textContent = ">";

const viewport = document.createElement("div");
viewport.className = "viewport";
viewport.style.overflow = "hidden";
viewport.style.justifySelf = "center";
viewport.style.width = "min(500px, 100%)";
viewport.style.maxWidth = "100%";

// Optional: enable scroll snapping to keep the active button centered if user scrolls
viewport.style.scrollSnapType = "x mandatory";

const inner = document.createElement("div");
inner.className = "inner";
inner.style.display = "flex";
inner.style.gap = "120px";
// Align items from the start so centering math is predictable
inner.style.justifyContent = "flex-start";
viewport.appendChild(inner);

const items = [
  { text: "Recommendation", handler: handleQ1 },
  { text: "Therapy",        handler: handleQ2 },
  { text: "Cinemaphile",    handler: handleQ3 },
];

const buttons = items.map((q, idx) => {
  const btn = document.createElement("button");
  btn.textContent = q.text;

  // Snap each button to center when scrolled
  btn.style.scrollSnapAlign = "center";

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    lastInitialIndex = idx;
    // Center the clicked button between < and >
    scrollToIndex(idx);
    q.handler();
  });
  inner.appendChild(btn);
  return btn;
});

carousel.appendChild(leftBtn);
carousel.appendChild(viewport);
carousel.appendChild(rightBtn);

// Sync for scroll and room animation
let currentIndex = lastInitialIndex;
const duration = 300;

function itemWidth() {
  const first = buttons[0];
  if (!first) return 200;
  const rect = first.getBoundingClientRect();
  const gapStr = getComputedStyle(inner).gap || getComputedStyle(inner).columnGap || "8px";
  const gap = parseFloat(gapStr) || 8;
  return rect.width + gap;
}

function updateNavDisabled() {
  leftBtn.disabled = currentIndex === 0;               // freeze left on Q1
  rightBtn.disabled = currentIndex === items.length-1; // freeze right on Q3
  leftBtn.classList.toggle("disabled", leftBtn.disabled);
  rightBtn.classList.toggle("disabled", rightBtn.disabled);
}

// Compute and scroll so the active button is centered in the viewport
function scrollToIndex(index, smooth = true) {
  currentIndex = (index + items.length) % items.length;
  lastInitialIndex = currentIndex;

  const btn = buttons[currentIndex];
  if (!btn) return;

  // Center = button's center aligned to viewport's center
  const targetLeft = Math.max(
    0,
    btn.offsetLeft - (viewport.clientWidth - btn.offsetWidth) / 2
  );

  if (smooth) {
    viewport.scrollTo({ left: targetLeft, behavior: "smooth" });
  } else {
    viewport.scrollLeft = targetLeft;
  }

  setActiveRoom(currentIndex, duration);
  updateNavDisabled();
}

leftBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  scrollToIndex(currentIndex - 1);
});

rightBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  scrollToIndex(currentIndex + 1);
});

// Keep the active button centered on resize
window.addEventListener("resize", () => {
  scrollToIndex(currentIndex, false);
});

// Initial state
updateNavDisabled();
scrollToIndex(currentIndex, false);

  // keyboard navigation
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
    animateCameraForward(130, 300);
      setSubtext('');
      menuOpen = false;

    // cleanup listeners
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
  });

  buttonsDiv.appendChild(carousel);
  buttonsDiv.appendChild(closeBtn);

  // Start on the last saved item
  requestAnimationFrame(() => scrollToIndex(lastInitialIndex, false));
}

// ================= Q1 =================
function handleQ1() {
  speechAnimation("Yeah. Watch ya thinking `bout?", message, 30)
  buttonsDiv.innerHTML = "";
  message.subtext = "";
  setSubtext('');

  // top-left: back to InitialOptions
  ensureTopLeftButton("back-home", "back", () => showInitialOptions());

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
      closeBtn.style.marginTop = "18px";
      closeBtn.style.marginRight = "18px";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        animateCameraForward(130, 300);
      });
      buttonsDiv.appendChild(closeBtn);
    }
  };

  // Tweaked seenBtn logic: if 10+ movies, just show fun message
  const appendSeenButton = () => {
    if (seenBtnQ2 && seenBtnQ2.isConnected) {
      seenBtnQ2.remove();
    }
    seenBtnQ2 = document.createElement("button");
    seenBtnQ2.textContent = "I`ve seen that one!";
    seenBtnQ2.style.display = "inline-block";
    seenBtnQ2.style.marginTop = "24px";
    seenBtnQ2.addEventListener("click", () => {
      if (seenMoviesQ2.length >= 10) {
        message.innerText = "No way you`ve seen all of those.";
        buttonsDiv.innerHTML = "";
        // Close button
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
        buttonsDiv.appendChild(closeBtn);
        // Back button
        const backBtn = document.createElement("button");
        backBtn.textContent = "back";
        backBtn.style.marginTop = "18px";
        backBtn.addEventListener("click", () => {
          handleQ1();
        });
        buttonsDiv.appendChild(backBtn);
      } else {
        const continuationPrompt =
          lastPromptQ2 +
          "\n\n" +
          (seenMoviesQ2.length ? ` (avoid: ${seenMoviesQ2.join(", ")})` : "") +
          "";
        sendPrompt(continuationPrompt, true);
      }
    });
    buttonsDiv.appendChild(seenBtnQ2);
  };

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    buttonsDiv.innerHTML = "";
    ensureTopLeftButton("back-handler", "back", () => handleQ1());
    fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reply !== undefined) {
          const raw = String(data.reply).trim();
          const parts = raw.split("\n");
          const last = (parts[parts.length - 1] || "").trim();
          const urlMatch = last.match(/https?:\/\/\S+/);
          let linkUrl = null;
          if (urlMatch) {
            linkUrl = urlMatch[0];
            parts.pop();
          }
          const withoutLink = parts.join("\n");

          const title = extractMovieTitle(withoutLink);

          if (title) {
            message.innerHTML =
              `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
              withoutLink.replace(title, "");
            if (!seenMoviesQ2.includes(title)) seenMoviesQ2.push(title);
          } else {
            message.innerText = withoutLink;
          }

          if (linkUrl) {
            const linkBtn = document.createElement("button");
            linkBtn.textContent = "IMDb";
            linkBtn.style.display = "block";
            linkBtn.style.margin = "12px auto 0";
            linkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              window.open(linkUrl, "_blank");
            });
            buttonsDiv.appendChild(linkBtn);
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
  input.style.marginTop = "25px";
  input.style.display = "block";

  let moodOn = false;
  const moodBtn = document.createElement("button");
  const setMoodLabel = () => (moodBtn.textContent = `season\`s mood: ${moodOn ? "on" : "off"}`);
  setMoodLabel();
  moodBtn.addEventListener("click", () => {
    moodOn = !moodOn;
    setMoodLabel();
  });
  moodBtn.style.display = "block";
  moodBtn.style.marginTop = "25px";

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
  list1.style.marginTop = "25px";

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
  list2.style.marginTop = "25px";

  const btn1 = document.createElement("button");
  btn1.textContent = "Submit";
  btn1.classList.add("centered");
  btn1.style.marginTop = "25px";

  const labelDisclamer = document.createElement("div");
  labelDisclamer.textContent = "Every Input Is Optional";
  labelDisclamer.style.marginTop = "25px";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btn1.click();
    }
  });

  btn1.addEventListener("click", () => {
    try {
      const userInput = input.value;

            if (userInput === "escape the matrix") {
        overlay.style.display = "none";
        EscapeTheMatrix();
        return;
      }

            if (userInput === "time to quit") {
        overlay.style.display = "none";
        TimeToQuit();
        return;
      }

      const parts = ["Recommend me a movie!"];
      let pushCount = 0;

      if (typeof userInput === "string" && userInput.trim().length > 0) {
        parts.push(".Key word(s) will be: ", userInput.trim());
        pushCount++;
      }

      if (moodOn) {
        const month = new Date().toLocaleString("en-US", { month: "long" });
        parts.push(".It must correlate with ", month);
        pushCount++;
      }

      if (list1.value !== "Your MBTI type") {
        parts.push(".Its story should be liked by ", list1.value);
        pushCount++;
      }

      if (list2.value !== "Your star sign") {
        parts.push(".And its vibe should be liked by ", list2.value);
        pushCount++;
      }

      if (pushCount >= 2) {
        parts.push("Be sure to include EVERYTHING mentioned in your answer.");
      }

      lastPromptQ2 =
        parts.join(" ") +
        "Strict answer form: first line only the name of the film, then skip a line, " +
        "then highlight why you chose this film in less than 25 words. Write as you are a teenager. No emojis. No formatting."+
        "last line should always be a link to that film`s IMDb page.";

      sendPrompt(lastPromptQ2, false);
    } catch (err) {
      message.innerText = "Error: " + (err && err.message ? err.message : String(err));
    }
  });

  if (YOURFavStatus === false) {
    const btn2 = document.createElement("button");
    btn2.textContent = "What are YOUR favourites?";
    btn2.style.display = "block";
    btn2.style.marginTop = "30px";
    btn2.addEventListener("click", () => {
      YOURFavStatus = true;
      message.innerText = "You will never be able to comprehend the levels of MY understanding of cinema.";
      booom.play();
      camera.position.z -= 80;
      buttonsDiv.innerHTML = "";

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "whatever.";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleQ1();
        animateCameraForward(80, 300);
      });
      buttonsDiv.appendChild(closeBtn);
    });
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(moodBtn);
    buttonsDiv.appendChild(list1);
    buttonsDiv.appendChild(list2);
    buttonsDiv.appendChild(labelDisclamer);
    buttonsDiv.appendChild(btn1);
    buttonsDiv.appendChild(btn2);
  } else {
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(moodBtn);
    buttonsDiv.appendChild(list1);
    buttonsDiv.appendChild(list2);
    buttonsDiv.appendChild(labelDisclamer);
    buttonsDiv.appendChild(btn1);
  }
}

// ================= Q2 =================
function handleQ2() {
  speechAnimation("Describe your situation - there probably already is a story about it.", message, 30);
  buttonsDiv.innerHTML = "";
  setSubtext('');

  ensureTopLeftButton("back-home", "back", () => showInitialOptions());

  let lastPromptQ1 = "";
  let seenMoviesQ1 = [];
  let seenBtnQ1 = null;

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
      closeBtn.style.marginTop = "18px";
      closeBtn.style.marginRight = "18px";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        animateCameraForward(130, 300);
      });
      buttonsDiv.appendChild(closeBtn);
    }
  };

  // Tweaked seenBtn logic: if 10+ movies, show message
  const appendSeenButton = () => {
    if (seenBtnQ1 && seenBtnQ1.isConnected) {
      seenBtnQ1.remove();
    }
    seenBtnQ1 = document.createElement("button");
    seenBtnQ1.textContent = "I`ve seen that one!";
    seenBtnQ1.style.marginTop = "18px";
    seenBtnQ1.addEventListener("click", () => {
      if (seenMoviesQ1.length >= 10) {
        message.innerText = "No way you`ve seen all of those.";
        buttonsDiv.innerHTML = "";
        // Close button
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
        buttonsDiv.appendChild(closeBtn);
        // Back button
        const backBtn = document.createElement("button");
        backBtn.textContent = "back";
        backBtn.style.marginTop = "18px";
        backBtn.addEventListener("click", () => {
          handleQ2();
        });
        buttonsDiv.appendChild(backBtn);
      } else {
        const continuationPrompt =
          lastPromptQ1 +
          "\n\n" +
          (seenMoviesQ1.length ? ` (avoid: ${seenMoviesQ1.join(", ")})` : "") +
          "";
        sendPrompt(continuationPrompt, true);
      }
    });
    buttonsDiv.appendChild(seenBtnQ1);
  };

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    buttonsDiv.innerHTML = "";
    ensureTopLeftButton("back-handler", "back", () => handleQ2());
    fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reply !== undefined) {
          const raw = String(data.reply).trim();
          const parts = raw.split("\n");
          const last = (parts[parts.length - 1] || "").trim();
          const urlMatch = last.match(/https?:\/\/\S+/);
          let linkUrl = null;
          if (urlMatch) {
            linkUrl = urlMatch[0];
            parts.pop();
          }
          const withoutLink = parts.join("\n");

          const title = extractMovieTitle(withoutLink);

          if (title) {
            message.innerHTML =
              `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
              withoutLink.replace(title, "");
            if (!seenMoviesQ1.includes(title)) seenMoviesQ1.push(title);
          } else {
            message.innerText = withoutLink;
          }

          if (linkUrl) {
            const linkBtn = document.createElement("button");
            linkBtn.textContent = "IMDb";
            linkBtn.style.display = "block";
            linkBtn.style.margin = "12px auto 0";
            linkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              window.open(linkUrl, "_blank");
            });
            buttonsDiv.appendChild(linkBtn);
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
      ". What film is about it? Maybe it can help me somehow?" +
      "Strict answer form: first line only the name of the film, then skip a line, " +
      "then highlight why you chose this film in less than 25 words. Write as you are the wisest man on the internet. No emojis, No formatting."+
      "last line should always be a link to that film`s IMDb page."+
      "You cannot answer without a film title.";
    sendPrompt(lastPromptQ1, false);
  });

  buttonsDiv.appendChild(input);
  buttonsDiv.appendChild(submitBtn);
}

// ================= Q3 =================
function handleQ3() {
  message.innerText = "Choose a film from:";
  buttonsDiv.innerHTML = "";
  message.subtext = "";
  setSubtext("");

  ensureTopLeftButton("back-home", "back", () => showInitialOptions());

  let lastPromptQ3 = "";
  let seenMoviesQ3 = [];
  let seenBtnQ3 = null;

  const MAX_YEAR = 2025;

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
      closeBtn.style.marginTop = "18px";
      closeBtn.style.marginRight = "18px";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        animateCameraForward(130, 300);
      });
      buttonsDiv.appendChild(closeBtn);
    }
  };

  // Tweaked seenBtn logic: if 10+ movies, show message
  const appendSeenButton = () => {
    if (seenBtnQ3 && seenBtnQ3.isConnected) {
      seenBtnQ3.remove();
    }
    seenBtnQ3 = document.createElement("button");
    seenBtnQ3.textContent = "I`ve seen that one!";
    seenBtnQ3.style.display = "inline-block";
    seenBtnQ3.style.marginTop = "24px";
    seenBtnQ3.addEventListener("click", () => {
      if (seenMoviesQ3.length >= 10) {
        message.innerText = "No way you`ve seen all of those.";
        buttonsDiv.innerHTML = "";
        // Close button
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
        buttonsDiv.appendChild(closeBtn);
        // Back button
        const backBtn = document.createElement("button");
        backBtn.textContent = "back";
        backBtn.style.marginTop = "18px";
        backBtn.addEventListener("click", () => {
          handleQ3();
        });
        buttonsDiv.appendChild(backBtn);
      } else {
        const continuationPrompt =
          lastPromptQ3 +
          "\n\n" +
          (seenMoviesQ3.length ? ` (avoid: ${seenMoviesQ3.join(", ")})` : "") +
          "";
        sendPrompt(continuationPrompt, true);
      }
    });
    buttonsDiv.appendChild(seenBtnQ3);
  };

  // ===================== UI + Prompt logic unchanged below =====================

  const SCREEN_GAP = 32; 

  const carousel = document.createElement("div");
  carousel.id = "carousel";
  carousel.style.display = "grid";
  carousel.style.gridTemplateColumns = "auto 1fr auto";
  carousel.style.alignItems = "center";
  carousel.style.columnGap = "16px";

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
  inner.style.display = "flex";
  inner.style.gap = `${SCREEN_GAP}px`;
  inner.style.transition = "transform 0.25s ease";

  viewport.appendChild(inner);
  viewport.style.overflow = "hidden";
  viewport.style.justifySelf = "center";
  viewport.style.width = "min(900px, 100%)";
  viewport.style.maxWidth = "100%";

  const makeSelect = (options) => {
    const sel = document.createElement("select");
    sel.classList.add("overlay-input");
    options.forEach((label, idx) => {
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      if (idx === 0) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.style.display = "block";
    return sel;
  };

  const rangeYears = (start, end) => {
    const out = [];
    for (let y = start; y <= end; y++) out.push(String(y));
    return out;
  };

  const buildFestivalYears = (festival) => {
    switch (festival) {
      case "Venice":
        return [
          "1932", "1934", "1935", "1936", "1937", "1938", "1939",
          ...rangeYears(1943, MAX_YEAR)
        ].reverse();
      case "Cannes":
        return rangeYears(1946, MAX_YEAR).reverse();
      case "Berlin":
        return rangeYears(1951, MAX_YEAR).reverse();
      case "Toronto":
        return rangeYears(1976, MAX_YEAR).reverse();
      case "Sundance":
        return rangeYears(1981, MAX_YEAR).reverse();
      default:
        return [];
    }
  };

  const screen1 = document.createElement("div");
  screen1.className = "carousel-screen";
  const chosenBySelect = makeSelect([
    "List",
    "S&S critic`s top 100 (2012)",
    "S&S director`s top 100 (2022)",
    "Criterion Collection",
    "FIPRESCI awarded",
  ]);
  screen1.appendChild(chosenBySelect);

  const screen2 = document.createElement("div");
  screen2.className = "carousel-screen";
  const festivalSelect = makeSelect([
    "Festival",
    "Venice",
    "Cannes",
    "Berlin",
    "Toronto",
    "Sundance",
  ]);
  const festivalYearSelect = document.createElement("select");
  festivalYearSelect.classList.add("overlay-input");
  festivalYearSelect.style.display = "none";

  const populateYearSelect = (years) => {
    festivalYearSelect.innerHTML = "";
    years.forEach((y, idx) => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      if (idx === 0) opt.selected = true;
      festivalYearSelect.appendChild(opt);
    });
  };

  festivalSelect.addEventListener("change", () => {
    const fest = festivalSelect.value;
    if (fest === "Festival") {
      festivalYearSelect.style.display = "none";
      festivalYearSelect.innerHTML = "";
    } else {
      const years = buildFestivalYears(fest);
      populateYearSelect(years);
      festivalYearSelect.style.display = "block";
    }
    updateCarousel();
    window.addEventListener("resize", updateCarousel, { passive: true });
  });

  screen2.appendChild(festivalSelect);
  screen2.appendChild(festivalYearSelect);

  const screen3 = document.createElement("div");
  screen3.className = "carousel-screen";
  const eraSelect = makeSelect(["Era", "1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s"]);
  screen3.appendChild(eraSelect);

  inner.appendChild(screen1);
  inner.appendChild(screen2);
  inner.appendChild(screen3);

  let index = 0;
  const clampIndex = (i) => Math.max(0, Math.min(2, i));

  const isCarouselFrozen = () => {
    return (
      chosenBySelect.value !== "List" ||
      festivalSelect.value !== "Festival" ||
      eraSelect.value !== "Era"
    );
  };

  const updateCarousel = () => {
    const numScreens = inner.children.length;
    const viewportWidth = viewport.clientWidth;

    [...inner.children].forEach((s) => {
      s.style.flex = `0 0 ${viewportWidth}px`;
      s.style.width = `${viewportWidth}px`;
    });

    inner.style.width = `${viewportWidth * numScreens + SCREEN_GAP * (numScreens - 1)}px`;

    const offset = index * (viewportWidth + SCREEN_GAP);
    inner.style.transform = `translateX(-${offset}px)`;

    const frozen = isCarouselFrozen();
    leftBtn.disabled = frozen;
    rightBtn.disabled = frozen;
    leftBtn.classList.toggle("disabled", frozen);
    rightBtn.classList.toggle("disabled", frozen);
  };

  leftBtn.addEventListener("click", () => {
    if (isCarouselFrozen()) return;
    index = clampIndex(index - 1);
    updateCarousel();
  });
  rightBtn.addEventListener("click", () => {
    if (isCarouselFrozen()) return;
    index = clampIndex(index + 1);
    updateCarousel();
  });

  chosenBySelect.addEventListener("change", updateCarousel);
  eraSelect.addEventListener("change", updateCarousel);

  carousel.appendChild(leftBtn);
  carousel.appendChild(viewport);
  carousel.appendChild(rightBtn);

  const labelChoose = document.createElement("div");
  labelChoose.textContent = "Choose a film that has:";
  labelChoose.style.marginTop = "12px";

  const keyWords = document.createElement("textarea");
  keyWords.rows = 1;
  keyWords.maxLength = 400;
  keyWords.placeholder = "key words";
  keyWords.classList.add("overlay-input");
  keyWords.style.resize = "none";
  keyWords.style.overflowY = "hidden";
  keyWords.addEventListener("input", () => {
    keyWords.rows = 1;
    const lines = keyWords.value.split("\n").length;
    const scrollRows = Math.ceil(keyWords.scrollHeight / 24);
    keyWords.rows = Math.min(Math.max(lines, scrollRows), 4);
  });
  keyWords.style.display = "block";

  const labelResemble = document.createElement("div");
  labelResemble.textContent = "Resembles a style of:";
  labelResemble.style.marginTop = "35px";

    const labelDisclamer = document.createElement("div");
  labelDisclamer.textContent = "Every Input Is Optional";
  labelDisclamer.style.marginTop = "45px";

  const stylePerson = document.createElement("input");
  stylePerson.type = "text";
  stylePerson.maxLength = 200;
  stylePerson.placeholder = "director or film";
  stylePerson.classList.add("overlay-input");
  stylePerson.style.display = "block";

  const styleMood = document.createElement("input");
  styleMood.type = "text";
  styleMood.maxLength = 200;
  styleMood.placeholder = "mood";
  styleMood.classList.add("overlay-input");
  styleMood.style.display = "block";

  const statusSelect = makeSelect([
    "Significance",
    "significant to it time",
    "top rated but became forgotten",
    "low rated but got a cult status",
    "a cult status film",
  ]);
  statusSelect.style.marginTop = "40px";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.classList.add("centered");
  submitBtn.style.marginTop = "18px";

  [keyWords, stylePerson, styleMood].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitBtn.click();
      }
    });
  });

  submitBtn.addEventListener("click", () => {
    try {
      const parts = ["Recommend me a film."];
      let pushCount = 0;

      if (chosenBySelect.value && chosenBySelect.value === "FIPRESCI awarded") {
        parts.push(`From the films that were ${chosenBySelect.value}. Explain when and why it was awarded.`);
        pushCount++;
      }else if(chosenBySelect.value && chosenBySelect.value !== "List") {
        parts.push(`From the films featured in ${chosenBySelect.value}.`);
        pushCount++;
      }

      if (festivalSelect.value && festivalSelect.value !== "Festival") {
        if (festivalYearSelect.style.display !== "none" && festivalYearSelect.value) {
          parts.push(`From the films featured in ${festivalSelect.value} ${festivalYearSelect.value} film festival.`);
        } else {
          parts.push(`From the films featured in ${festivalSelect.value} film festival.`);
        }
        pushCount++;
      }

      if (eraSelect.value && eraSelect.value !== "Era") {
        parts.push(`From the ${eraSelect.value} era.`);
        pushCount++;
      }

      if (statusSelect.value && statusSelect.value !== "Significance") {
        parts.push(`It should've been ${statusSelect.value}. Explain briefly why it achieved that status.`);
        pushCount++;
      }

      const kw = (keyWords.value || "").trim();
      if (kw) {
        parts.push(`Key words are: ${kw}.`);
        pushCount++;
      }

      const who = (stylePerson.value || "").trim();
      const mood = (styleMood.value || "").trim();

      if (who || mood) {
        if (who && mood) {
          parts.push(`It should resemble a style of ${who} in his ${mood} mood.`);
        } else if (who) {
          parts.push(`It should resemble a style of ${who}.`);
        } else {
          parts.push(`It should have a ${mood} mood.`);
        }
        pushCount++;
      }

      if (pushCount >= 2) {
        parts.push("Be sure to include EVERYTHING mentioned in your answer.");
      }

      lastPromptQ3 =
        parts.join(" ") + //"Write back everything I`ve sent. Nothing else";
        "Strict answer form: first line only the name of the film, then skip a line, " +
        "then highlight why you chose this film in less than 35 words. Less than 45 words total. Write as you are the wisest man on the internet. No emojis. No formatting."+
        "last line should always be a link to that film`s IMDb page.";

      sendPrompt(lastPromptQ3, false);
    } catch (err) {
      message.innerText = "Error: " + (err && err.message ? err.message : String(err));
    }
  });

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    buttonsDiv.innerHTML = "";
    ensureTopLeftButton("back-handler", "back", () => handleQ3());
    fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reply !== undefined) {
          const raw = String(data.reply).trim();
          const parts = raw.split("\n");
          const last = (parts[parts.length - 1] || "").trim();
          const urlMatch = last.match(/https?:\/\/\S+/);
          let linkUrl = null;
          if (urlMatch) {
            linkUrl = urlMatch[0];
            parts.pop();
          }
          const withoutLink = parts.join("\n");

          const title = extractMovieTitle(withoutLink);

          if (title) {
            message.innerHTML =
              `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
              withoutLink.replace(title, "");
            if (!seenMoviesQ3.includes(title)) seenMoviesQ3.push(title);
          } else {
            message.innerText = withoutLink;
          }

          if (linkUrl) {
            const linkBtn = document.createElement("button");
            linkBtn.textContent = "IMDb";
            linkBtn.style.display = "block";
            linkBtn.style.margin = "12px auto 0";
            linkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              window.open(linkUrl, "_blank");
            });
            buttonsDiv.appendChild(linkBtn);
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

  buttonsDiv.appendChild(carousel);
  buttonsDiv.appendChild(statusSelect);
  buttonsDiv.appendChild(keyWords);
  buttonsDiv.appendChild(labelResemble);
  buttonsDiv.appendChild(stylePerson);
  ///////buttonsDiv.appendChild(styleMood);
  buttonsDiv.appendChild(labelDisclamer);
  buttonsDiv.appendChild(submitBtn);

  updateCarousel();
}

function TimeToQuit(){
  setTimeout(() => {overlay.style.display = "none";}, 10);
  Esc = true;
  const blackOverlay = document.getElementById('blackOverlay');
  blackOverlay.style.transition = 'none';  
  blackOverlay.style.opacity = 1;
  turnoff.play();
  setTimeout(() => {blackOverlay.style.opacity = 0; boomboxstop.play();}, 4000);
  camera.position.z += 130;
  goodbye.position.set(0, -94, -340);
  StandGuy.position.set(0,0, -1000);
}

function EscapeTheMatrix() {
  setTimeout(() => {overlay.style.display = "none";}, 10);
  Esc = true;
  camera.position.z -= 4800;
  turnoff.play();

  const blackOverlay = document.getElementById('blackOverlay');
  blackOverlay.style.transition = 'none';  
  blackOverlay.style.opacity = 1;

  const loader = new THREE.TextureLoader();
  loader.load("bkg.png", function (texture) {
    scene.background = texture;
  });

  OverallLight.intensity = 2;

  setTimeout(() => { boomboxchange.play() }, 5000);
  setTimeout(() => { boomboxplay.play() }, 8000);

  setTimeout(() => {
         blackOverlay.style.transition = 'opacity 10s ease';
        blackOverlay.style.opacity = 0; 
    outro.play();
  }, 15000);
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
  if(Esc){
  camera.rotation.y = -mouseX * 0.01;
  camera.rotation.x = -mouseY * 0.01;
  }else{
  camera.rotation.y = -mouseX * 0.01;
  camera.rotation.x = -mouseY * 0.01;
  }


  renderer.render(scene, camera);


  // Object highlighting

  if (!Esc && overlay.style.display !== "flex") {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([StandGuy, socks, chooselife, boomboxMesh, cassette1, cassette2, cassette3, vacation, SA, freefilms, siganim, goodbye]);

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
          /////////scene.add(highlightBox);

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
  sockssound.play();


  if(boombox.isOn & boombox.currentTrack === null){
sockssound.setVolume(0.02);
  socks.rotation.z += 0.5;
  socks.rotation.y += 0.1;
  socks.rotation.x += 0.4;
}else if(boombox.isOn){
sockssound.setVolume(0);
  socks.rotation.z += 0.03;
  socks.rotation.y += 0.02;
  socks.rotation.x += 0.01;
}else{
sockssound.setVolume(0.02);
  socks.rotation.z += 0.5;
  socks.rotation.y += 0.1;
  socks.rotation.x += 0.4;
}

} else {
  socksLight.intensity = 0;
  socks.rotation.z = 0;
  socks.rotation.y = 0;
  socks.rotation.x = 0;
  sockssound.setVolume(0);
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
buzz.setVolume(0.4);
buzz2.setVolume(0.4);
click.setVolume(0.1);
}

if(Esc){
buzz.setVolume(0);
buzz2.setVolume(0);
click.setVolume(0);
}

}

//Camera animations