import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

// ----------------------------------------------
// Scene, Camera, Renderer
// ----------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 600); // Match CSS height
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('three-container').appendChild(renderer.domElement);

// ----------------------------------------------
// Orbit Controls
// ----------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ----------------------------------------------
// Lighting
// ----------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Global soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// ----------------------------------------------
// Physics World
// ----------------------------------------------
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravity downwards

// ----------------------------------------------
// Create Flipping Cards (Planes)
// ----------------------------------------------
const cardsGroup = new THREE.Group();
scene.add(cardsGroup);

const cardGeometry = new THREE.PlaneGeometry(2, 3); // Card dimensions
const cardMaterialFront = new THREE.MeshStandardMaterial({
  color: 0x0077ff,
  side: THREE.DoubleSide,
});
const cardMaterialBack = new THREE.MeshStandardMaterial({
  color: 0xff5500,
  side: THREE.DoubleSide,
});

const cardCount = 3;

for (let i = 0; i < cardCount; i++) {
  // Create the card as two sides
  const front = new THREE.Mesh(cardGeometry, cardMaterialFront);
  const back = new THREE.Mesh(cardGeometry, cardMaterialBack);

  // Group the two sides into a single object
  const card = new THREE.Group();
  card.add(front, back);

  // Offset back side slightly
  back.rotation.y = Math.PI; // Rotate to face the opposite direction

  // Position cards
  card.position.set(i * 3 - 4, 1, 0); // Spread along X-axis
  cardsGroup.add(card);

  // Add physics body
  const cardBody = new CANNON.Body({
    mass: 1, // Dynamic body
    shape: new CANNON.Box(new CANNON.Vec3(1, 1.5, 0.1)), // Match dimensions
    position: new CANNON.Vec3(card.position.x, card.position.y, card.position.z),
  });

  world.addBody(cardBody);

  // Store the card and its physics body together
  card.userData.body = cardBody;
}

// ----------------------------------------------
// Interactivity: Flip Cards
// ----------------------------------------------
document.addEventListener('click', (event) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // Normalize mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / 600) * 2 + 1;

  // Raycast from camera to mouse
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cardsGroup.children, true);

  if (intersects.length > 0) {
    const clickedCard = intersects[0].object.parent; // Get the card group

    // Apply an impulse to rotate the card
    const body = clickedCard.userData.body;
    body.applyLocalImpulse(new CANNON.Vec3(0, 0, 5), new CANNON.Vec3(0, 0, 0)); // Flip forward
  }
});

// ----------------------------------------------
// Animation Loop
// ----------------------------------------------
function animate() {
  // Update physics world
  world.step(1 / 60);

  // Sync Three.js objects with Cannon.js bodies
  cardsGroup.children.forEach((card) => {
    const body = card.userData.body;
    card.position.copy(body.position);
    card.quaternion.copy(body.quaternion);
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// ----------------------------------------------
// Responsive Canvas
// ----------------------------------------------
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, 600); // Match CSS height
  camera.aspect = window.innerWidth / 600;
  camera.updateProjectionMatrix();
});
