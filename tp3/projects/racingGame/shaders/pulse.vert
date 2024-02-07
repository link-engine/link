uniform float time;

void main() {
    float pulse = 0.8 + 0.2 * cos( time );
    vec4 modelViewPosition = modelViewMatrix * vec4( position * pulse, 1.0 );
    gl_Position = projectionMatrix * modelViewPosition;
}