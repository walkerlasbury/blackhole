// Particle class
class Particle {
  constructor(x, y, mass, color) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
    this.previousPositions = [];
    this.trailLength = 2.5;
  }

  applyGravity(mouseX, mouseY, strength) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);
    const force = strength / distanceSquared;

    if (distance > 0) {
      this.velocity.x += force * dx / distance;
      this.velocity.y += force * dy / distance;
    }
  }

  update() {
    this.previousPositions.push({ x: this.x, y: this.y });

    if (this.previousPositions.length > this.trailLength) {
      this.previousPositions.shift();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Check if particle is out of bounds
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      // Randomize position, size, and direction
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.mass = parseFloat(particleSizeSlider.value) + Math.random() * 8 - 0.2;
      this.velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      };
    }
  }

  draw() {
    for (let i = 0; i < this.previousPositions.length; i++) {
      const position = this.previousPositions[i];
      const alpha = i / this.previousPositions.length;
      const size = this.mass * (1 - alpha * 0.7); // Adjust size based on mass and alpha

      context.beginPath();
      context.arc(position.x, position.y, size, 0, Math.PI * 2);
      context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
      context.fill();
      context.closePath();
    }
  }
}

// Initialization
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

// Mouse position tracking
const mouse = {
  x: undefined,
  y: undefined
};

// Gravity strength slider
const gravityStrengthSlider = document.getElementById('gravityStrength');
const gravityStrengthLabel = document.getElementById('gravityStrengthLabel');
gravityStrengthLabel.textContent = gravityStrengthSlider.value;
gravityStrengthSlider.addEventListener('input', () => {
  gravityStrengthLabel.textContent = gravityStrengthSlider.value;
});

// Particle size slider
const particleSizeSlider = document.getElementById('particleSize');
const particleSizeLabel = document.getElementById('particleSizeLabel');
particleSizeLabel.textContent = particleSizeSlider.value;
particleSizeSlider.addEventListener('input', () => {
  particleSizeLabel.textContent = particleSizeSlider.value;
});

// Create particles
for (let i = 0; i < particleCount; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const mass = parseFloat(particleSizeSlider.value) + Math.random() * 0.4 - 0.2;
  const color = { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };

  particles.push(new Particle(x, y, mass, color));
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  context.fillStyle = 'rgba(0, 0, 0, 0.1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.applyGravity(mouse.x, mouse.y, gravityStrengthSlider.value);
    particle.update();
    particle.draw();
  }
}

// Event listeners for mouse movement
canvas.addEventListener('mousemove', event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

animate();

