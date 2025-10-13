import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';
//It`s all vibe coding, plus I was learning on the go. Don`t judge harshly. 

let camera, scene, renderer, listener;
let mouseX = 0, mouseY = 0;
let FlickerLight;
let CigaretteButt, CigaretteLight;
let Smoke1, Smoke2;
let StandGuy;
let INTERSECTED = null;
let StandGuyScrewedYou = false;
let SpinForMeBaby = false;
let socks, socksLight;
let booom, meow;

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

  //SOUNDS

  booom = new THREE.Audio(listener); new THREE.AudioLoader().load('booom.mp3', b => booom.setBuffer(b));
  booom.setVolume(0.05);

  meow = new THREE.Audio(listener); new THREE.AudioLoader().load('meow.mp3', b => meow.setBuffer(b));
  meow.setVolume(0.1);

  //SOCKS(or not)
 socks = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('socks.png'), transparent: true, side: THREE.DoubleSide }));
  socks.position.set(300, -200, -270);
  scene.add(socks);


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

//Clicking menu
function onClick() {
  raycaster.setFromCamera(mouse, camera);

  const socksIntersects = raycaster.intersectObject(socks);
  if (socksIntersects.length > 0) {
    if (isSocksOverlayOpen) {
      overlay.style.display = "none";
      SpinForMeBaby = !SpinForMeBaby;
      isSocksOverlayOpen = false;
    } else if (overlay.style.display !== "flex") {
      socksCredits();
    }
    return;
  }

  if (overlay.style.display === "flex") return;

  if (StandGuyScrewedYou) {
    showGoodbyeMessage();
    return;
  }

  raycaster.setFromCamera(mouse, camera);

  //StandGuy
  const standIntersects = raycaster.intersectObject(StandGuy);
  if (standIntersects.length > 0) {
    showInitialOptions();
  }
}


function socksCredits() {
    overlay.style.display = "flex";
    isSocksOverlayOpen = true;
    buttonsDiv.innerHTML = "";
    message.innerText = "Socks says: this is a cool website!";
    SpinForMeBaby = !SpinForMeBaby;
        
    const LinkBtn = document.createElement("button");
      LinkBtn.textContent = "socks";
      LinkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        meow.play();
      });
      buttonsDiv.appendChild(LinkBtn);
  }

//mainmenu
function showInitialOptions() {
  isSocksOverlayOpen = false; // ensure state reset if other overlay opens
  camera.position.z -= 100;
  overlay.style.display = "flex";
  message.innerText = "Hi-up. Wanna rent a movie?";
  buttonsDiv.innerHTML = "";

  const questions = [
    { text: "Recommend me one!", handler: handleQ2 },
   { text: "I don`t know... I just really need to talk to someone.", handler: handleQ1 },
   //{ text: "What are you doing here?", handler: handleQ3 },
   //{ text: "I`m just wandering around", handler: handleQ4 },
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
  isSocksOverlayOpen = false; // ensure state reset
  message.innerText = "What`s been on your mind? Tell me whatever. I keep no server data.";
  buttonsDiv.innerHTML = "";

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
        "\n\nContinue the same dialog. Recommend one different film than any you suggested before" +
        (seenMoviesQ1.length ? ` (avoid: ${seenMoviesQ1.join(", ")})` : "") +
        ". Keep the same strict answer form. Reply with only one film";
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
          message.innerText = data.reply;

          const title = extractMovieTitle(data.reply);
          if (title && !seenMoviesQ1.includes(title)) seenMoviesQ1.push(title);

          appendSeenButton();
          ensureCloseButton();
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

  // Enter works as click
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitBtn.click();
    }
  });

  submitBtn.addEventListener("click", () => {
    const userInput = input.value;
    // Base prompt for the first send; store it for continuation
    lastPromptQ1 =
      userInput +
      ". Think of what film is about this and helps to deal with these problems. Don`t make it an obvious choise. " +
      "Strict answer form: first line only the name of the film, then skip a line, " +
      "then highlight why you chose this film in less than 25 words. Write as you are a teenager. No emojis";

    sendPrompt(lastPromptQ1, false);
  });

  buttonsDiv.appendChild(input);
  buttonsDiv.appendChild(submitBtn);
}

function handleQ2() {
  isSocksOverlayOpen = false; // ensure state reset
  message.innerText = "Yeah. Watch ya thinking `bout? (Every input`s optional)";
  buttonsDiv.innerHTML = "";

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
        camera.position.z -= -100;
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
        "\n\nContinue the same dialog. Recommend only one different film than any you suggested before" +
        (seenMoviesQ2.length ? ` (avoid: ${seenMoviesQ2.join(", ")})` : "") +
        ". Keep the same strict answer form. Reply with only one film";
      sendPrompt(continuationPrompt, true);
    });
    buttonsDiv.appendChild(seenBtnQ2);
  };

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    // Keep only the close button while waiting
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
          message.innerText = data.reply;

          // Track the movie to avoid repeating on continuation
          const title = extractMovieTitle(data.reply);
          if (title && !seenMoviesQ2.includes(title)) seenMoviesQ2.push(title);

          // After receiving data, show "I've seen that one!" and keep "close"
          appendSeenButton();
          ensureCloseButton();
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

  // Submit button
  const btn1 = document.createElement("button");
  btn1.textContent = "Submit";
  btn1.style.display = "block";
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
        "then highlight why you chose this film in less than 25 words. Write as you are in your 20s. No emojis";

      sendPrompt(lastPromptQ2, false);
    } catch (err) {
      message.innerText = "Error: " + (err && err.message ? err.message : String(err));
    }
  });

  // "What are YOUR favourites?"
  const btn2 = document.createElement("button");
  btn2.textContent = "What are YOUR favourites?";
  btn2.style.display = "block";
  btn2.style.marginTop = "8px";
  btn2.addEventListener("click", () => {
    message.innerText = "You will never be able to comprehend the levels of MY understanding of cinema.";
    booom.play();
    camera.position.z -= 100;
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


//Q3
function handleQ3() {
  isSocksOverlayOpen = false; // ensure state reset
  message.innerText = "Mostly chillin`. There`s not much to do yet";
  buttonsDiv.innerHTML = "";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", (e) => {e.stopPropagation(); camera.position.z -= -100; overlay.style.display = "none";});
  buttonsDiv.appendChild(closeBtn);
}


//Q4
function handleQ4() {
  isSocksOverlayOpen = false; // ensure state reset
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
  isSocksOverlayOpen = false; // ensure state reset
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


  // Object highlighting

if (overlay.style.display !== "flex") {
  raycaster.setFromCamera(mouse, camera);
  
  // Raycast against both StandGuy and socks
  const intersects = raycaster.intersectObjects([StandGuy, socks]);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const object = hit.object;
    const distanceToCenter = hit.point.distanceTo(object.position);

    // Only highlight if hit is near object's center
    if (distanceToCenter < 100) {
      if (INTERSECTED !== object) {
        // Remove highlight from previously intersected object
        if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }

        INTERSECTED = object;

        // Apply highlight to the new intersected object
        if (INTERSECTED.material && INTERSECTED.material.emissive) {
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0x1a1714);
        }
      }
    } else {
      // Distance too far, remove highlight
      if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
      INTERSECTED = null;
    }
  } else {
    // Nothing intersected, clear highlight
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

}

//Camera animations

