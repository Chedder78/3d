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

// Hover Effects on Spheres
const hoverColor = 0xffff00; // Highlight color
const originalColors = new Map(); // Store original colors

document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Cast a ray from the camera to the mouse position
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheresGroup.children);

  // Reset original scales and colors
  spheresGroup.children.forEach((sphere) => {
    sphere.scale.set(1, 1, 1);
    if (originalColors.has(sphere)) {
      sphere.material.color.set(originalColors.get(sphere)); // Reset color
    }
  });

  // Highlight hovered object
  if (intersects.length > 0) {
    const hoveredObject = intersects[0].object;

    // Save original color if not already saved
    if (!originalColors.has(hoveredObject)) {
      originalColors.set(hoveredObject, hoveredObject.material.color.getHex());
    }

    hoveredObject.material.color.set(hoverColor); // Change color
    hoveredObject.scale.set(1.2, 1.2, 1.2); // Scale up
  }
});
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05; // Damping inertia
controls.enableZoom = true; // Allow zooming
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Add Orbit Controls here


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
// Dynamic Camera Movement
document.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheresGroup.children);

  if (intersects.length > 0) {
    const targetPosition = intersects[0].object.position.clone();
    const cameraStart = camera.position.clone();

    // Animate camera movement
    let progress = 0;
    const animationDuration = 1.5; // In seconds
    const animationInterval = setInterval(() => {
      progress += 0.01;
      if (progress >= 1) {
        clearInterval(animationInterval); // End animation
      }
      camera.position.lerpVectors(cameraStart, targetPosition, progress); // Interpolate position
      camera.lookAt(scene.position); // Keep looking at the center
    }, animationDuration * 10); // 10ms interval
  }
});
