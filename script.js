import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

// ----------------------------------------------
// Scene, Camera, Renderer
// ----------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('three-container').appendChild(renderer.domElement);

// ----------------------------------------------
// Lighting
// ----------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// ----------------------------------------------
// Rotating Background Sphere
// ----------------------------------------------
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// ----------------------------------------------
// Interactive Spheres Group
// ----------------------------------------------
const spheresGroup = new THREE.Group();
scene.add(spheresGroup);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

for (let i = 0; i < 10; i++) {
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
  const interactiveSphere = new THREE.Mesh(sphereGeo, sphereMat);

  interactiveSphere.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  spheresGroup.add(interactiveSphere);
}

// ----------------------------------------------
// Hover Effects
// ----------------------------------------------
document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheresGroup.children);

  spheresGroup.children.forEach((sphere) => (sphere.scale.set(1, 1, 1)));
  if (intersects.length > 0) {
    const hoveredSphere = intersects[0].object;
    hoveredSphere.scale.set(1.2, 1.2, 1.2);
  }
});

// ----------------------------------------------
// Orbit Controls
// ----------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ----------------------------------------------
// Animation Loop
// ----------------------------------------------
function animate() {
  sphere.rotation.y += 0.01;
  spheresGroup.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// ----------------------------------------------
// Responsive Canvas
// ----------------------------------------------
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
