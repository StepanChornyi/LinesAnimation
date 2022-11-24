import WEBGL_UTILS from './utils/WebglUtils.js';
import vertexShader from './shaders/shader.vs.glsl';
import fragmentShader from './shaders/shader.fs.glsl';
import { Rectangle } from './utils/Rectangle.js';

const offsetX = 10;
const offsetY = offsetX;
const height = 10;
const colorSet = rndPick([
  [hex2rgb(0x62e63e), hex2rgb(0x3ee676)],
  [hex2rgb(0xe63e81), hex2rgb(0xe63e4c)],
  [hex2rgb(0x4da4fa), hex2rgb(0x4d78fa)],
]);

export class Scene {
  constructor(gl) {
    this._gl = gl;

    this._program = WEBGL_UTILS.createProgram(gl, vertexShader, fragmentShader);
    this._size = new Rectangle(0, 0, 0, 0);

    this._rows = [];

    for (let i = 0; i < 70; i++) {
      this._rows.push(new Row(gl, this._program));
    }

    this.onResize(gl.canvas.width, gl.canvas.height);

    window.addEventListener("pointermove", evt => this.onMouseMove(evt));
    window.addEventListener("pointerdown", evt => this.onMouseMove(evt));
    window.addEventListener("mousemove", evt => this.onMouseMove(evt));
  }

  onMouseMove(evt) {
    const y = evt.y * window.devicePixelRatio;

    for (let i = 0; i < this._rows.length; i++) {
      const row = this._rows[i];

      if (Math.abs(row._y - y) < 100) {
        row.increaseTs(Math.min(1 - Math.abs(row._y - y) / 100, 0.05))
      }
    }
  }

  onUpdate(dt) {
    for (let i = 0; i < this._rows.length; i++) {
      this._rows[i].onUpdate(dt);
    }

    this._render();
  }

  onResize(newWidth, newHeight) {
    this._size.set(0, 0, newWidth, newHeight);
    this._gl.viewport(0, 0, newWidth, newHeight);

    for (let i = 0; i < this._rows.length; i++) {
      this._rows[i].setWidth(newWidth, i * (height + offsetY));
    }
  }

  _render() {
    const gl = this._gl;

    gl.useProgram(this._program);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < this._rows.length; i++) {
      this._rows[i].render(this._size.width * 0.5, this._size.height * 0.5);
    }
  }
}

class Row {
  constructor(gl, program) {
    this._gl = gl;

    this._program = program;
    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._timeScale = rndBtw(0.5, 1);
    this._additionalTs = 0;
    this._width = 0;
    this._y = 0;

    this._vertices = [];
    this._indices = [];

    this._rects = [];

    this._initRects();
    this._genMesh();

    this._drawBuffersData();
  }

  setWidth(width, y) {
    this._y = y;
    this._width = width;

    this._resetTime();
    this._genMesh();
  }

  _resetTime() {
    this._time = 0;

    const rnd = rndBtw(-100, 100);

    for (let i = 0; i < this._rects.length; i++) {
      this._rects[i].x += rnd;
    }
  }

  increaseTs(f) {
    this._additionalTs = lerp(this._additionalTs, 10, f);
  }

  onUpdate(dt) {
    this._additionalTs = lerp(this._additionalTs, 0, 0.05);

    dt *= this._timeScale - this._additionalTs;

    this._time += dt;

    const vx = dt * 100;

    for (let i = 0; i < this._rects.length; i++) {
      const rect = this._rects[i];

      rect.x += vx;
    }

    let isChanged = false;

    for (let i = 0; i < this._rects.length; i++) {
      const rect = this._rects[i];

      if (rect.x > this._width + offsetX && vx > 0) {
        rect.right = this._rects[(i + 1) % this._rects.length].left - offsetX;

        isChanged = true;
      } else if (rect.right < 0 - offsetX && vx < 0) {
        rect.left = this._rects[(this._rects.length + i - 1) % this._rects.length].right + offsetX;

        isChanged = true;
      }
    }

    if (isChanged) {
      this._genMesh();
    }
  }

  _genMesh() {
    this._vertices.splice(0);
    this._indices.splice(0);

    for (let i = 0; i < this._rects.length; i++) {
      this._addRect(this._rects[i]);
    }

    this._drawBuffersData();
  }

  _drawBuffersData() {
    const gl = this._gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.DYNAMIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.DYNAMIC_DRAW);
  }

  _updateAttribPointers() {
    const gl = this._gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);

    const posAttribLocation = gl.getAttribLocation(this._program, 'vertPosition');
    const colorAttribLocation = gl.getAttribLocation(this._program, 'vertColor');

    gl.vertexAttribPointer(
      posAttribLocation,
      2,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0
    );

    gl.enableVertexAttribArray(posAttribLocation);

    gl.vertexAttribPointer(
      colorAttribLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(colorAttribLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
  }


  _initRects() {
    const count = 15;
    const minWidth = 100;
    const maxWidth = 300;

    const rects = this._rects;

    for (let i = 0, rect; i < count; i++) {
      if (rect) {
        rect = new Rectangle(rect.right + offsetX, 0, rndBtw(minWidth, maxWidth), height);
      } else {
        rect = new Rectangle(0, 0, rndBtw(minWidth, maxWidth), height);
      }

      rect.color = Math.random() < 0.5 ? colorSet[0] : colorSet[1];

      rects.push(rect);
    }
  }

  _addRect(rect) {
    const offset = this._vertices.length / 5;

    const r = rect.color.r / 255;
    const g = rect.color.g / 255;
    const b = rect.color.b / 255;

    const x = this._time * 100;
    const y = this._y;

    this._vertices.push(
      rect.left - x, rect.top + y, r, g, b,
      rect.right - x, rect.top + y, r, g, b,
      rect.right - x, rect.bottom + y, r, g, b,
      rect.left - x, rect.bottom + y, r, g, b,
    );

    this._indices.push(offset + 0, offset + 1, offset + 2, offset + 0, offset + 2, offset + 3);
  }

  render(wf, hf) {
    const gl = this._gl;

    this._updateAttribPointers();

    const offsetUniformLocation = gl.getUniformLocation(this._program, 'offset');
    const sizeUniformLocation = gl.getUniformLocation(this._program, 'size');

    gl.uniform1f(offsetUniformLocation, this._time * 100);
    gl.uniform2f(sizeUniformLocation, wf, hf);

    gl.drawElements(gl.TRIANGLES, this._indices.length, gl.UNSIGNED_SHORT, 0);
  }

}

function rndBtw(a, b) {
  return lerp(a, b, Math.random());
}

function rndPick(arr) {
  return arr[Math.round(arr.length * Math.random() * 100) % arr.length];
}

function hex2rgb(hex) {
  return {
    r: hex >> 16 & 255,
    g: hex >> 8 & 255,
    b: hex & 255
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}