export function vertex_shader(func = default_func) {
  return pre_vertex_shader + func + post_vertex_shader
}

const pre_vertex_shader =
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
  float rho() {
    return sqrt(translate.x * translate.x + translate.y * translate.y + translate.z * translate.z);
  }
  float theta() {
    return atan(translate.x, translate.z);
  }
  float r() {
    return sqrt(translate.x * translate.x + translate.y * translate.y);
  }
  void main() {
    float g = texture2D( tAudioData, vec2(0.1, 0.0) ).r;
    float f = texture2D( tAudioData, vec2(rho() / 1.5, 0.0) ).r;
    float scale = `

const default_func =
  `2.0*f*sign(cos(4.*theta() + time + 2.*cos(10.*rho())))`

const post_vertex_shader =
  `;
    scale /= 100.0;
    vScale = scale;
    vec3 vTranslate = translate;
    vTranslate.y += 30.*scale;
    vec4 mvPosition = modelViewMatrix * vec4( vTranslate, 1.0 );
    mvPosition.xyz += position * scale;
    vUv = uv;
    vTime = time;
    vRho = rho();
    gl_Position = projectionMatrix * mvPosition;
  }
  `

export const fragment_shader =
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
  `