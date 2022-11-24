import { Scene } from "./Scene";

document.addEventListener('contextmenu', e => e.preventDefault());

const canvas = document.getElementById("myCanvas");
let gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
let scene = new Scene(gl);

window.canvas = canvas;

const loseExt = gl.getExtension("WEBGL_lose_context");

window.ext = {
  loseContext: () => {
    loseExt.loseContext();
  },
  restoreContext: () => {
    loseExt.restoreContext();
  },
}

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  canvas.style.opacity = "0.99";

});

canvas.addEventListener('webglcontextrestored', (e) => {

  scene = new Scene(gl);

  console.log( canvas.style);


  setTimeout(() => {
    canvas.style.opacity = "1";
  }, 100);

});

const onUpdate = (dt) => {
  updateSize();

  scene.onUpdate(dt);
};

const updateSize = () => {
  const dpr = window.devicePixelRatio;

  const viewWidth = window.innerWidth * dpr;
  const viewHeight = window.innerHeight * dpr;

  if (canvas.width === viewWidth && canvas.height === viewHeight) {
    return;
  }

  canvas.width = viewWidth;
  canvas.height = viewHeight;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  scene.onResize(viewWidth, viewHeight);
};

let prevTime = null;

const loop = (time) => {
  if (prevTime === null) {
    prevTime = time - 16.666;
  }

  if (!gl.isContextLost()) {
    onUpdate((time - prevTime) * 0.001);
  }

  prevTime = time;

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);