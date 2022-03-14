export const DEFAULT_F = 'rho / 1.5'
export const DEFAULT_FUNC = `2*sin(cos(4*theta + time + 2*cos(10*rho)))`

// Add decimal points to the end of all integers
const shaderify = (func) => (func.replace(/((^|[^\da-z.])\d+)(?![a-z.\d])/gi, "$1."))

export const vertex_shader = (f=DEFAULT_F, func=DEFAULT_FUNC) => (
  `precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  uniform sampler2D tAudioData;
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 translate;
  varying vec2 vUv;
  varying float vScale;
  varying float vTime;
  varying float vRho;
  void main() {
    float x = translate.x;
    float y = translate.z;
    float z = translate.y;
    float r = sqrt(x * x + y * y);
    float rho = sqrt(r * r + z * z);
    float theta = atan(x, y);
    float phi = atan(r, z);
    float f = texture2D( tAudioData, vec2(${shaderify(f)}, 0.0) ).r;
    float scale = ${shaderify(func)};
    scale /= 100.0;
    vScale = scale;
    vec3 vTranslate = translate;
    vTranslate.y += 30.*scale;
    vec4 mvPosition = modelViewMatrix * vec4( vTranslate, 1.0 );
    mvPosition.xyz += position * scale;
    vUv = uv;
    vTime = time;
    vRho = rho;
    gl_Position = projectionMatrix * mvPosition;
  }
  `)

export const fragment_shader = () => (
  `
  precision highp float;
  uniform sampler2D map;
  uniform sampler2D tAudioData;
  varying vec2 vUv;
  varying float vScale;
  varying float vTime;
  varying float vRho;
  // HSL to RGB Convertion helpers
  vec3 HUEtoRGB(float H){
    H = mod(H,1.0);
    float R = abs(H * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(H * 6.0 - 2.0);
    float B = 2.0 - abs(H * 6.0 - 4.0);
    return clamp(vec3(R,G,B),0.0,1.0);
  }
  vec3 HSLtoRGB(vec3 HSL){
    vec3 RGB = HUEtoRGB(HSL.x);
    float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
    return (RGB - 0.5) * C + HSL.z;
  }
  void main() {
    vec4 diffuseColor = texture2D( map, vUv );
    float f = texture2D( tAudioData, vUv ).r;
    gl_FragColor = vec4( diffuseColor.xyz * HSLtoRGB(vec3((vRho/8. + 2.*vScale) * 10.0, 1.0, 0.5)), diffuseColor.w );
    if ( diffuseColor.w < 0.5 ) discard;
  }
  `)

export const vertex_shader_plain = () => (
  `
  varying vec2 vUv;
  uniform float zoom;

  void main() {
    float zoompow = pow(1.03, zoom);
    vUv = 2.0*zoompow*uv - vec2(zoompow, zoompow);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `
)

  export const fragment_shader_2D = (f, func, posColor, negColor) => (
`
  precision highp float;
  uniform vec3 uPosition;
  uniform float time;
  uniform sampler2D tAudioData;
  varying vec2 vUv;

  float a(float x) {
    return sin(x);
  }

  float b(float x) {
    return cos(x) + x;
  }

  float c(float x) {
    return tan(x);
  }

  float d(float x) {
    return pow(x, 2.);
  }

  float e(float x) {
    return x + 4.;
  }

  void main() {
    float x = vUv.x;
    float y = vUv.y;
    float z = 0.0;
    float r = sqrt(x * x + y * y);
    float rho = r;
    float theta = atan(y, x);
    float f = texture2D( tAudioData, vec2(${shaderify(f)}, 0.0) ).r;
    float scale = ${shaderify(func)};
    if(scale > 0.0) {
      gl_FragColor = ${posColor};
    } else {
      gl_FragColor = ${negColor};
    }
  }`
)

