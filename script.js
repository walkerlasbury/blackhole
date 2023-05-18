// particle class
class Particle {
  constructor(x, y, mass) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.color = { r: 255, g: 255, b: 255 };
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
    this.previousPositions = [];
    this.trailLength = 2.5;
  }

  // get gravity affect based on mouse (black hole) position
  applyGravity(mouseX, mouseY, strength) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);
    const force = strength / distanceSquared;
  
    if (distance > 0 && distance < strength) {
      this.velocity.x += force * dx / distance;
      this.velocity.y += force * dy / distance;
  
      // calculate the normalized force
      const normalizedForce = Math.min(1, force / strength);
  
      // calculate the color based on the normalized force
      const red = Math.round(255 - normalizedForce * 255);
      this.color = { r: red, g: 0, b: 0 };
    } else {
      // no gravity affecting the particle --> set color to white
      this.color = { r: 255, g: 255, b: 255 };
    }
  }
  
  update() {
    this.previousPositions.push({ x: this.x, y: this.y });
  
    if (this.previousPositions.length > this.trailLength) {
      this.previousPositions.shift();
    }
  
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  
    // check if out of bounds
    if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
      // randomize position, speed, and mass
      if (this.x < -100) {
        this.x = canvas.width + 100;
      } else if (this.x > canvas.width + 100) {
        this.x = -100;
      }
  
      if (this.y < -100) {
        this.y = canvas.height + 100;
      } else if (this.y > canvas.height + 100) {
        this.y = -100;
      }
  
      this.mass = parseFloat(particleSizeSlider.value) + Math.random() * 8 - 0.2;
      this.velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      };
      this.color = { r: 255, g: 255, b: 255 };
    }
  }
  
  draw() {
    for (let i = 0; i < this.previousPositions.length; i++) {
      const position = this.previousPositions[i];
      const alpha = i / this.previousPositions.length;
      const size = this.mass * (1 - alpha * 0.7); 
      context.beginPath();
      context.arc(position.x, position.y, size, 0, Math.PI * 2);
      context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
      context.fill();
      context.closePath();
    }
  }
}

// initialize canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

// mous position
const mouse = {
  x: undefined,
  y: undefined
};

// gravity strength slider
const gravityStrengthSlider = document.getElementById('gravityStrength');
const gravityStrengthLabel = document.getElementById('gravityStrengthLabel');
gravityStrengthLabel.textContent = gravityStrengthSlider.value;
gravityStrengthSlider.addEventListener('input', () => {
  gravityStrengthLabel.textContent = gravityStrengthSlider.value;
});

// particle size slider
const particleSizeSlider = document.getElementById('particleSize');
const particleSizeLabel = document.getElementById('particleSizeLabel');
particleSizeLabel.textContent = particleSizeSlider.value;
particleSizeSlider.addEventListener('input', () => {
  particleSizeLabel.textContent = particleSizeSlider.value;
});

// spawn particles
for (let i = 0; i < particleCount; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const mass = parseFloat(particleSizeSlider.value) + Math.random() * 0.4 - 0.2;

  particles.push(new Particle(x, y, mass));
}

// animation loop
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

// event listeners
canvas.addEventListener('mousemove', event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

animate();
