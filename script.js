// Select the floating header
const floatingHeader = document.getElementById('floating-header');

// Add a scroll event listener
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY; // Get the vertical scroll position

  // Adjust the header's position and scaling based on scroll
  const translateZ = Math.max(100 - scrollY * 0.1, 20); // Limit how far it "sinks"
  const scale = Math.max(1 - scrollY * 0.001, 0.8); // Gradually shrink the header
  const rotationX = scrollY * 0.05; // Slight rotation effect
  const opacity = Math.max(1 - scrollY * 0.005, 0); // Gradually fade out

  // Apply transforms
  floatingHeader.style.transform = `translateX(-50%) translateZ(${translateZ}px) scale(${scale}) rotateX(${rotationX}deg)`;
  floatingHeader.style.opacity = opacity;
});

