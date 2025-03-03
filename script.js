import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.135/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.135/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.135/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.135/examples/jsm/postprocessing/UnrealBloomPass.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Toggle Switch Base
const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
const baseMaterial = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Toggle Button
const buttonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const buttonMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ff99, metalness: 1, roughness: 0.1 });
const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
button.position.y = 0.25;
scene.add(button);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 2);
scene.add(directionalLight);

// Bloom Effect
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.4, 0.85);
composer.addPass(bloomPass);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render();
}
animate();

// Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

