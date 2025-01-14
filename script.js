import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// ----------------------------------------------
// Three.js 3D Background
// ----------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('three-container').appendChild(renderer.domElement);

// Add Rotating Sphere to the Background
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// ----------------------------------------------
// Interactive Spheres Group
// ----------------------------------------------
const spheresGroup = new THREE.Group();
scene.add(spheresGroup);

// Generate Spheres
const sphereCount = 10;

for (let i = 0; i < sphereCount; i++) {
  const interactiveSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const interactiveSphereMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff, // Random initial color
  });
  const interactiveSphere = new THREE.Mesh(interactiveSphereGeometry, interactiveSphereMaterial);

  interactiveSphere.position.set(
    (Math.random() - 0.5) * 20, // Random X position
    (Math.random() - 0.5) * 10, // Random Y position
    (Math.random() - 0.5) * 10  // Random Z position
  );

  spheresGroup.add(interactiveSphere);
}

// ----------------------------------------------
// Raycaster for Interactions
// ----------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('click', (event) => {
  // Update mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycast from the camera to the scene
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheresGroup.children);

  // Change color of the intersected sphere
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(Math.random() * 0xffffff);
  }
});

// ----------------------------------------------
// Animation Loop
// ----------------------------------------------
function animate() {
  // Rotate the background sphere
  sphere.rotation.y += 0.01;

  // Rotate the interactive spheres group
  spheresGroup.rotation.y += 0.005;

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
