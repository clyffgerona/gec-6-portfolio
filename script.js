/* ════════════════════════════════════════════════════
   GEC 6 E-PORTFOLIO — script.js
   ════════════════════════════════════════════════════ */

// ─── 0. PRELOADER ───
// window.addEventListener('load') waits for images and full resources, unlike DOMContentLoaded
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  
  // Add a slight 300ms delay so the animation feels deliberate
  setTimeout(() => {
    preloader.classList.add('loaded');
  }, 300);
});

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. SCROLL REVEAL ANIMATIONS ───
  // Uses IntersectionObserver to add the 'revealed' class when elements enter the viewport
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed to keep it visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1, // Triggers when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ─── 2. STICKY NAVBAR & MOBILE MENU ───
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  // Add background blur to navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
    });
  });


  // ─── 3. DIGITAL CANVAS PARTICLE BACKGROUND ───
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = 60; 
  const connectionDistance = 150;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; // Velocity X
      this.vy = (Math.random() - 0.5) * 0.5; // Velocity Y
      this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x <= 0 || this.x >= width) this.vx *= -1;
      if (this.y <= 0 || this.y >= height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.4)'; // Cyan dots
      ctx.fill();
    }
  }

  // Initialize Particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          // Opacity decreases as distance increases
          let opacity = 1 - (distance / connectionDistance);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          // Purple gradient connections
          ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * 0.25})`; 
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }

  // Start background animation
  animateCanvas();
});