// Terminal typing animation
const typeWriter = () => {
    const text = 'Usef Usefi';
    const typedTextElement = document.querySelector('.typed-text');
    const cursorElement = document.querySelector('.cursor');
    let charIndex = 0;

    const type = () => {
        if (charIndex < text.length) {
            typedTextElement.textContent += text.charAt(charIndex);
            charIndex++;
            const typingSpeed = Math.random() * 70 + 80;
            setTimeout(type, typingSpeed);
        } else {
            cursorElement.style.animation = 'blink 1s step-end infinite';
        }
    };

    setTimeout(type, 500);
};

// Particle Field Effect
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouseX = 0;
let mouseY = 0;

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.originalRadius = this.radius;
    }

    update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // React to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
            // Repel from mouse
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.1;
            this.vy -= Math.sin(angle) * force * 0.1;

            // Grow particle near mouse
            this.radius = this.originalRadius * (1 + force * 2);
        } else {
            this.radius = this.originalRadius;
        }

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Keep minimum velocity
        if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.05;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Distance-based opacity
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        let opacity = 0.3;
        if (distance < maxDistance) {
            opacity = 0.3 + (1 - distance / maxDistance) * 0.7;
        }

        ctx.fillStyle = `rgba(99, 102, 241, ${opacity})`;
        ctx.fill();
    }
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create particles
    particles = [];
    const numParticles = Math.floor((width * height) / 8000);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);

                const opacity = (1 - distance / 120) * 0.2;
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Connect nearby particles
    connectParticles();

    requestAnimationFrame(animate);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    typeWriter();
    resizeCanvas();
    mouseX = width / 2;
    mouseY = height / 2;
    animate();
});

window.addEventListener('resize', resizeCanvas);

// Link interactions
const links = document.querySelectorAll('.link');
links.forEach(link => {
    link.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = link.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(99, 102, 241, 0.3);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        link.style.position = 'relative';
        link.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
