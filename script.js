// script.js

// 🌌 Setup Three.js Environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 💡 Add Light Source
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(10, 10, 10);
scene.add(light);

// 🎇 Particle System Variables
const particles = [];
const particleCount = 80;
const fireflies = [];
const nebulaMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x443355, transparent: true, opacity: 0.4 
});
const mouse = new THREE.Vector2();
const starCount = 200;

// 🌫️ Create 3D Rotating Nebula Cloud
function createNebula() {
  const nebulaGeometry = new THREE.SphereGeometry(40, 32, 32);
  const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
  nebula.position.set(0, 0, -50);
  scene.add(nebula);
  return nebula;
}
const nebula = createNebula();

// 🌟 Create Twinkling Star Background
function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true });

  const starPositions = [];
  for (let i = 0; i < starCount; i++) {
    starPositions.push((Math.random() - 0.5) * 150);
    starPositions.push((Math.random() - 0.5) * 150);
    starPositions.push((Math.random() - 0.5) * 150);
  }
  
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  setInterval(() => {
    starMaterial.opacity = Math.random() * 0.8 + 0.2;
  }, 1000);
}

// 🟠 Create Custom Firefly Particles (Glowing, Animated)
function createFireflies() {
  for (let i = 0; i < 15; i++) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xffd700, emissive: 0xffff33, emissiveIntensity: 1, transparent: true 
    });

    const firefly = new THREE.Mesh(geometry, material);
    firefly.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );

    scene.add(firefly);
    fireflies.push(firefly);
  }
}

// 🔵 Create Clickable Particles
function createClickableParticles() {
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0077ff,
      emissive: 0x0077ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
    });

    const clickable = new THREE.Mesh(geometry, material);
    clickable.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );

    scene.add(clickable);
    particles.push(clickable);
  }
}

// 🔴 Handle Click Interactions
function onMouseClick(event) {
  event.preventDefault();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(particles);
  intersects.forEach((intersect) => {
    gsap.to(intersect.object.scale, { x: 2, y: 2, duration: 0.3, yoyo: true, repeat: 1 });
  });
}

// 🌌 Initialize Elements
createStars();
createFireflies();
createClickableParticles();

// 🎮 Mouse Interaction
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 🟡 Mobile Touch Support
window.addEventListener('touchmove', (e) => {
  let touch = e.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
});

// 🎯 Click Event
window.addEventListener('click', onMouseClick);

// 🏃‍♂️ Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Nebula Rotation
  nebula.rotation.y += 0.001;

  // Fireflies Animation
  fireflies.forEach((firefly) => {
    firefly.position.x += (Math.random() - 0.5) * 0.02;
    firefly.position.y += (Math.random() - 0.5) * 0.02;
    firefly.material.emissiveIntensity = Math.random() * 1.5;
  });

  renderer.render(scene, camera);
}
animate();

// 🏆 Responsive Handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 📷 Camera Setup
camera.position.z = 30;
