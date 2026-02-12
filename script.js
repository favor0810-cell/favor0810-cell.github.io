/* =====================
   404 WINDOW SYSTEM
===================== */

let zIndex = 10;
const closeAllBtn = document.getElementById("closeAllBtn");
const windowImages = [
  "icon1/1.jpg","icon1/2.jpg","icon1/3.jpg","icon1/4.jpg","icon1/5.jpg",
  "icon1/6.jpg","icon1/7.jpg","icon1/8.jpg","icon1/9.jpg","icon1/10.jpg"
];

let usedImages = new Set();

function closeAll404Windows() {
  const windows = document.querySelectorAll(".window");
  windows.forEach(w => w.remove());

  document.getElementById("window-layer").classList.remove("show");
  closeAllBtn.classList.remove("show");
  usedImages.clear();
}


function getRandomImage() {
  if (usedImages.size === windowImages.length) return null;
  let img;
  do {
    img = windowImages[Math.floor(Math.random() * windowImages.length)];
  } while (usedImages.has(img));
  usedImages.add(img);
  return img;
}

function resetImageModal() {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");

  if (modal) {
    modal.style.display = "none";
  }

  if (modalImg) {
    modalImg.src = "";   // 🔥 이미지도 비워줌
  }
}

function open404() {
  closeAll404Windows();
  usedImages.clear();
  closeImageModal();
  playBGM(1);

    // 🔥 이 두 줄 추가
  document.getElementById("window-layer").classList.add("show");
  closeAllBtn.classList.add("show")

  let count = 0;
  const total = 10;
  const interval = 300;

  function spawn() {
    if (count >= total) return;

    createWindow();
    count++;

    setTimeout(spawn, interval);
  }

  setTimeout(() => {
  spawn();
}, 1500);
}   // ✅ 여기서 끝



function createWindow() {
  const imgSrc = getRandomImage();
  if (!imgSrc) return;

  const win = document.createElement("div");
  win.className = "window";
  win.style.left = Math.random() * (window.innerWidth - 320) + "px";
  win.style.top = Math.random() * (window.innerHeight - 320) + "px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="window-header">
      <span>404 Everywhere</span>
      <button class="window-close-btn"></button>
    </div>
    <img src="${imgSrc}" class="popup-image">
  `;

  document.getElementById("window-layer").appendChild(win);
  requestAnimationFrame(() => win.classList.add("show"));

  makeDraggable(win);

  const popupImg = win.querySelector(".popup-image");
  popupImg.onclick = (e) => {
    openImageModal(e.target.src);
  };


  win.querySelector(".window-close-btn").onclick = () => {
    win.classList.remove("show");
    win.classList.add("hiding");
    setTimeout(() => win.remove(), 500);
  };
}

closeAllBtn.onclick = () => {
  const windows = document.querySelectorAll(".window");
  
  // 배경도 서서히 사라지게
  document.getElementById("window-layer").classList.remove("show");
  
  // 하나씩 순차적으로 사라지게
  windows.forEach((w, index) => {
    setTimeout(() => {
      w.classList.remove("show");
      w.classList.add("hiding");
      setTimeout(() => w.remove(), 500);
    }, index * 100);
  });
  
  // 모든 애니메이션 끝나면 정리
  setTimeout(() => {
    usedImages.clear();
    closeAllBtn.classList.remove("show");
  }, windows.length * 100 + 500);
};

/* =====================
   DRAG
===================== */

function makeDraggable(win) {
  let offsetX = 0, offsetY = 0;
  let dragging = false;

  const header = win.querySelector(".window-header");

  header.addEventListener("mousedown", (e) => {
    dragging = true;

    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    win.style.zIndex = zIndex++;

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  function move(e) {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  }

  function up() {
    dragging = false;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  }
}

/* =====================
   IMAGE MODAL (아이콘1 확대용)
===================== */

const imageModal = document.createElement("div");
imageModal.id = "imageModal";
imageModal.innerHTML = `
  <div class="image-modal-bg"></div>
  <div class="image-modal-content">
    <button class="image-modal-close">✕</button>
    <img id="imageModalImg" />
  </div>
`;
document.body.appendChild(imageModal);

function openImageModal(src) {
  const img = document.getElementById("imageModalImg");

  img.src = src;

  imageModal.style.display = "flex";
  imageModal.style.opacity = "1";
  imageModal.style.pointerEvents = "auto";

  imageModal.classList.add("show");
}


function closeImageModal() {
  imageModal.classList.remove("show");

  // 완전 강제 초기화
  imageModal.style.display = "none";
  imageModal.style.opacity = "0";
  imageModal.style.pointerEvents = "none";

  const img = document.getElementById("imageModalImg");
  img.src = "";
}

imageModal.querySelector(".image-modal-close")
  .addEventListener("click", function(e) {
    e.stopPropagation();     // 🔥 이벤트 전파 차단
    closeImageModal();
  });

  imageModal.querySelector(".image-modal-bg")
  .addEventListener("click", function(e) {
    e.stopPropagation();     // 🔥 중요
    closeImageModal();
  });

/* =====================
   MOLE GAME
===================== */

function openMoleGame() {
  closeImageModal();
  playBGM(2);   // 🔥 변경
  
  // 아이콘 3(사진 뷰어)이 열려 있다면 닫기
  const simpleViewer = document.getElementById("simpleViewer");
  if (simpleViewer) {
    simpleViewer.classList.remove("show");
  }
  
  // 메인 화면 숨기고 게임 화면 보이기
  document.getElementById("iconScreen").style.display = "none";
  document.getElementById("moleGame").style.display = "block";
  document.getElementById("gameIntro").style.display = "block";
  document.getElementById("gameScreen").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const iconScreen = document.getElementById("iconScreen");
  const moleGame = document.getElementById("moleGame");
  const gameIntro = document.getElementById("gameIntro");
  const gameScreen = document.getElementById("gameScreen");
  const gameOver = document.getElementById("gameOver");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const closeGame = document.getElementById("closeGame");
  const moles = document.querySelectorAll(".mole");
  const scoreEl = document.getElementById("score");
  const finalScoreEl = document.getElementById("finalScore");

  const moleImages = [
    "icon2/누끼율1.jpg",
    "icon2/누끼율2.jpg"
  ];

  let score = 0;
  let lastMole = null;
  let running = false;
  let gameTimer = null;

  function randomMole() {
    const mole = moles[Math.floor(Math.random() * moles.length)];
    if (mole === lastMole && moles.length > 1) return randomMole();
    lastMole = mole;
    return mole;
  }

  function peep() {
    if (!running) return;
    
    const mole = randomMole();
    mole.src = moleImages[Math.floor(Math.random() * moleImages.length)];
    mole.style.display = "block";
    
    setTimeout(() => {
      mole.classList.add("up");
    }, 50);

    setTimeout(() => {
      mole.classList.remove("up");
      setTimeout(() => {
        mole.style.display = "none";
        peep();
      }, 400);
    }, 800);
  }

  startBtn.addEventListener("click", () => {
    gameIntro.style.display = "none";
    gameScreen.style.display = "block";
    score = 0;
    scoreEl.textContent = score;
    running = true;
    
    moles.forEach(mole => {
      mole.src = "";
      mole.style.display = "none";
      mole.classList.remove("up");
    });
    
    peep();
    
    gameTimer = setTimeout(() => {
      running = false;
      finalScoreEl.textContent = score;
      gameScreen.style.display = "none";
      gameOver.style.display = "flex";
    }, 10000);
  });

  moles.forEach(mole => {
    mole.addEventListener("click", () => {
      if (!mole.classList.contains("up")) return;
      score++;
      scoreEl.textContent = score;
      mole.classList.remove("up");
    });
  });

  restartBtn.addEventListener("click", () => {
    gameOver.style.display = "none";
    gameIntro.style.display = "block";
  });

  closeGame.addEventListener("click", () => {
    running = false;
    if (gameTimer) clearTimeout(gameTimer);
    moleGame.style.display = "none";
    iconScreen.style.display = "block";
    gameScreen.style.display = "none";
    gameOver.style.display = "none";
    gameIntro.style.display = "block";
  });
});

/* =====================
   SIMPLE VIEWER (아이콘3) 로직
===================== */
const mediaList = [
  "icon3/1.jpg", 
  "icon3/2.jpg", 
  "icon3/3.jpg",
  "icon3/V1.MP4",
  "icon3/4.jpg",
  "icon3/5.jpg",
  "icon3/6.jpg",
  "icon3/V2.MP4",
  "icon3/7.jpg",
  "icon3/8.jpg"
];

let currentMediaIndex = 0;

function openSimpleViewer() {
  closeAll404Windows();   // 🔥 추가
  closeImageModal();
  playBGM(3);   // 🔥 변경

  const viewer = document.getElementById("simpleViewer");
  document.getElementById("moleGame").style.display = "none";

  currentMediaIndex = 0;
  updateViewer();
  viewer.classList.add("show");
}

function updateViewer() {
  const container = document.getElementById("mediaContainer");
  const mediaPath = mediaList[currentMediaIndex];
  
  if (mediaPath.endsWith("MP4")) {
    container.innerHTML = `<video src="${mediaPath}" autoplay loop controls></video>`;
  } else {
    container.innerHTML = `<img src="${mediaPath}" alt="Photo">`;
  }
}

function changeMedia(direction) {
  currentMediaIndex += direction;
  
  if (currentMediaIndex < 0) currentMediaIndex = mediaList.length - 1;
  if (currentMediaIndex >= mediaList.length) currentMediaIndex = 0;
  
  updateViewer();
}

// 배경 클릭 시 닫기 기능
document.getElementById("simpleViewer").onclick = function(e) {
  if (e.target.id === "simpleViewer") {
    this.classList.remove("show");
  }
};

/* =====================
   포토부스
===================== */

async function openPhotoBooth() {
  closeAll404Windows();   // 🔥 추가
  closeImageModal();
  playBGM(4);   // 🔥 변경
  
  const booth = document.getElementById('photoBooth');
  booth.style.display = 'flex';
  booth.classList.add("show");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('webcam');
    video.srcObject = stream;
  } catch (err) {
    console.error("카메라 권한 에러:", err);
    alert("카메라를 사용할 수 없습니다.");
  }
}

function closePhotoBooth() {
  const booth = document.getElementById('photoBooth');
  const video = document.getElementById('webcam');
  
  // 카메라 끄기
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  booth.style.display = 'none';
  booth.classList.remove("show");
}

let currentSet = 1;
const totalSets = 3; 

function changeFrame(direction) {
  currentSet += direction;
  if (currentSet > totalSets) currentSet = 1;
  if (currentSet < 1) currentSet = totalSets;

  const layer = document.querySelector('.sticker-layer');
  const s1 = document.getElementById('sticker1');
  const s2 = document.getElementById('sticker2');
  const s3 = document.getElementById('sticker3');
  const s4 = document.getElementById('sticker4');

  s1.src = `icon4/${currentSet}_1.png`;
  s2.src = `icon4/${currentSet}_2.png`;
  s3.src = `icon4/${currentSet}_3.png`;
  s4.src = `icon4/${currentSet}_4.png`;

  layer.classList.remove('set1', 'set2', 'set3', 'set4');
  layer.classList.add(`set${currentSet}`);
  
  console.log(`현재 ${currentSet}번 세트 적용`);
}

function setFrame(num) {
  currentSet = num;

  const layer = document.querySelector('.sticker-layer');
  const s1 = document.getElementById('sticker1');
  const s2 = document.getElementById('sticker2');
  const s3 = document.getElementById('sticker3');
  const s4 = document.getElementById('sticker4');

  s1.src = `icon4/${num}_1.png`;
  s2.src = `icon4/${num}_2.png`;
  s3.src = `icon4/${num}_3.png`;
  s4.src = `icon4/${num}_4.png`;

  layer.className = `sticker-layer set${num}`;

  // 하단 버튼 active 처리
  document.querySelectorAll('.frame-dots .dot').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.frame-dots .dot:nth-child(${num})`)
    .classList.add('active');
}

let capturedPhotoData = null;

function takePhoto() {
  
  const video = document.getElementById('webcam');
  const videoContainer = document.querySelector('.mac-content');
  
  const canvas = document.createElement('canvas');
  
  const containerRect = videoContainer.getBoundingClientRect();
  const videoAspect = video.videoWidth / video.videoHeight;
  const containerAspect = containerRect.width / containerRect.height;
  
  canvas.width = containerRect.width;
  canvas.height = containerRect.height;

  const ctx = canvas.getContext('2d');

  /* 비디오만 좌우 반전해서 그리기 */
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  
  let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
  
  if (videoAspect > containerAspect) {
    drawHeight = canvas.height;
    drawWidth = drawHeight * videoAspect;
    offsetX = (drawWidth - canvas.width) / 2;
  } else {
    drawWidth = canvas.width;
    drawHeight = drawWidth / videoAspect;
    offsetY = (drawHeight - canvas.height) / 2;
  }
  
  ctx.drawImage(video, -offsetX, -offsetY, drawWidth, drawHeight);
  ctx.restore();

  /* 프레임(스티커)은 반전 없이 그대로 얹기 */
  document.querySelectorAll('.sticker-layer .sticker').forEach(sticker => {
    const computedStyle = window.getComputedStyle(sticker);
    const width = parseFloat(computedStyle.width);
    
    if (width > 0 && sticker.complete && sticker.naturalWidth > 0) {
      const rect = sticker.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      const y = rect.top - containerRect.top;
      
      ctx.drawImage(
        sticker, 
        x, 
        y, 
        rect.width, 
        rect.height
      );
    }
  });

  /* 미리보기 표시 */
  capturedPhotoData = canvas.toDataURL('image/png');
  document.getElementById('previewImg').src = capturedPhotoData;
  document.getElementById('photoPreview').style.display = 'flex';
}

function closePreview() {
  document.getElementById('photoPreview').style.display = 'none';
  capturedPhotoData = null;
}

function savePhoto() {
  
  if (!capturedPhotoData) return;
  
  const link = document.createElement('a');
  link.download = 'photo-booth.png';
  link.href = capturedPhotoData;
  link.click();
  
  closePreview();
}

/* =====================
   사운드 시스템
===================== */

function playClickSound() {
  const sound = document.getElementById("clickSound");
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.5;  // 볼륨 50%
    sound.play().catch(err => console.log("클릭 소리 재생 실패:", err));
  }
}

function playBGM(trackNumber) {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  const newSrc = `sounds/${trackNumber}.mp3`;

  if (!music.src.includes(newSrc)) {
    music.pause();
    music.src = newSrc;
    music.load();
  }

  music.volume = 0.3;

  // 🔥 1초 뒤에 재생
  setTimeout(() => {
    music.play().catch(err => console.log("BGM 재생 실패:", err));
  }, 1000);
}

