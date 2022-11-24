class WebglUtils {
  getWebGlContext(canvas) {
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      console.warn('webgl not supported');
    }

    return gl;
  }

  createProgram(gl, vst, fst) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vst);
    gl.shaderSource(fragmentShader, fst);

    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("ERROR compiling vertex shader", gl.getShaderInfoLog(vertexShader));
    }

    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("ERROR compiling fragment shader", gl.getShaderInfoLog(fragmentShader));
    }

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ERROR linking program", gl.getProgramInfoLog(program));
    }

    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error("ERROR validating program", gl.getProgramInfoLog(program));
    }

    return program;
  }

}

const WEBGL_UTILS = new WebglUtils();

export default WEBGL_UTILS;


// getDOMBackgroundColor(defaultColor = 0x000000) {
//   const color = document.body.style.color;

//   if (color && color.indexOf("rgb(") >= 0) {
//     const [r, g, b] = color.split('(')[1].split(')')[0].split(', ');

//     return ColorHelper.rgb2hex(new RGB(parseInt(r), parseInt(g), parseInt(b)));
//   }

//   return defaultColor;
// }