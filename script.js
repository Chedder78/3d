// script.js

import * as THREE from 'three';

// Setup Three.js environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Variables for particles
const particles = [];
const particleCount = 70;
const mouse = new THREE.Vector2();
const starCount = 150;

// Gradient background using Three.js
const gradientTexture = new THREE.TextureLoader().load('https://via.placeholder.com/1920x1080');
scene.background = gradientTexture;

// Create fuzzy particle materials
function createFuzzyParticle() {
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    roughness: 0.5,
    transparent: true,
    opacity: 0.8,
    emissive: 0xffffff,
    emissiveIntensity: 0.6,
  });

  const particle = new THREE.Mesh(geometry, material);
  particle.position.set(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
  scene.add(particle);
  particles.push({ mesh: particle, velocity: new THREE.Vector3() });
}

// Create starry particles
function createStarParticles() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
  });

  const starPositions = [];
  for (let i = 0; i < starCount; i++) {
    starPositions.push((Math.random() - 0.5) * 100); // X
    starPositions.push((Math.random() - 0.5) * 100); // Y
    starPositions.push((Math.random() - 0.5) * 100); // Z
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// Add particles and stars
for (let i = 0; i < particleCount; i++) createFuzzyParticle();
createStarParticles();

// Add lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Mouse interactivity
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  particles.forEach((particle) => {
    const distance = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0).sub(particle.mesh.position);
    const force = distance.multiplyScalar(0.01);
    particle.velocity.add(force);
    particle.velocity.multiplyScalar(0.95); // Damping
    particle.mesh.position.add(particle.velocity);
  });

  renderer.render(scene, camera);
}
animate();

// Camera position
camera.position.z = 30;
