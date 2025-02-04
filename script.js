// script.js

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting for a glowing effect
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Particle System Variables
const particles = [];
const particleCount = 80;
const mouse = new THREE.Vector2();
const starCount = 200;

// 🟢 Create Glowing Particles
function createFuzzyParticle() {
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
    emissive: 0xffffff,
    emissiveIntensity: 0.9,
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

// 🌟 Create Twinkling Stars
function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
  });

  const starPositions = [];
  for (let i = 0; i < starCount; i++) {
    starPositions.push((Math.random() - 0.5) * 150);
    starPositions.push((Math.random() - 0.5) * 150);
    starPositions.push((Math.random() - 0.5) * 150);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Twinkle effect
  setInterval(() => {
    starMaterial.opacity = Math.random() * 0.8 + 0.2;
  }, 1000);
}

// Add particles & stars
for (let i = 0; i < particleCount; i++) createFuzzyParticle();
createStars();

// 🟠 Mouse Interactivity
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 🟢 Mobile Touch Interactivity
window.addEventListener('touchmove', (e) => {
  let touch = e.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
});

// 🏃‍♂️ Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Move particles smoothly
  particles.forEach((particle) => {
    const distance = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0).sub(particle.mesh.position);
    const force = distance.multiplyScalar(0.02);
    particle.velocity.add(force);
    particle.velocity.multiplyScalar(0.94); // Damping
    particle.mesh.position.add(particle.velocity);
  });

  renderer.render(scene, camera);
}
animate();

// 🏆 Ensure Perfect Display on Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 📷 Camera Position
camera.position.z = 30;
