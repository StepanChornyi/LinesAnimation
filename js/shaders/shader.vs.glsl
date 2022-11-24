precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

uniform vec2 size;
uniform float offset;

void main() {
  fragColor = vertColor;

  float x = vertPosition.x + offset;
  float y = vertPosition.y;

  gl_Position = vec4(x / size.x - 1.0, -y / size.y + 1.0, 1.0, 1.0);
}