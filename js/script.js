document.addEventListener('DOMContentLoaded', () => {

    // ==================== AMBIENT PARTICLES ====================
    const pCanvas = document.getElementById('particleCanvas');
    const pCtx = pCanvas.getContext('2d');
    let particles = [];

    function resizeParticleCanvas() {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * pCanvas.width;
            this.y = Math.random() * pCanvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedY = -(Math.random() * 0.15 + 0.03);
            this.speedX = (Math.random() - 0.5) * 0.08;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity += this.fadeDir * this.fadeSpeed;
            if (this.opacity > 0.6) this.fadeDir = -1;
            if (this.opacity < 0.05) this.fadeDir = 1;
            if (this.y < -10 || this.x < -10 || this.x > pCanvas.width + 10) {
                this.reset();
                this.y = pCanvas.height + 10;
            }
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(201, 160, 135, ${this.opacity})`;
            pCtx.fill();
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==================== SPARKLE TRAIL + TAP EMOJI POP ====================
    const fxLayer = document.getElementById('fxLayer');
    const sparkleChars = ['✨','⭐','💫','✦','·'];
    const tapEmojis = ['💖','🎂','✨','🎁','💕','🌸','🎈','🥳','💗','🎀','⭐','🎉'];
    let lastSparkle = 0;

    function createSparkle(x, y) {
        const now = Date.now();
        if (now - lastSparkle < 40) return;
        lastSparkle = now;

        for (let i = 0; i < 3; i++) {
            const el = document.createElement('div');
            el.classList.add('sparkle');
            el.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
            el.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
            el.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
            el.style.setProperty('--sp-size', (Math.random() * 10 + 8) + 'px');
            el.style.setProperty('--sp-dx', (Math.random() - 0.5) * 40 + 'px');
            el.style.setProperty('--sp-dy', (Math.random() * -30 - 10) + 'px');
            fxLayer.appendChild(el);
            setTimeout(() => el.remove(), 850);
        }
    }

    function createTapPop(x, y) {
        const count = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('tap-emoji');
            el.textContent = tapEmojis[Math.floor(Math.random() * tapEmojis.length)];
            el.style.left = (x + (Math.random() - 0.5) * 50 - 14) + 'px';
            el.style.top = (y + (Math.random() - 0.5) * 30 - 14) + 'px';
            el.style.animationDelay = (i * 0.08) + 's';
            fxLayer.appendChild(el);
            setTimeout(() => el.remove(), 1100);
        }
    }

    document.addEventListener('mousemove', e => createSparkle(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        if (t) createSparkle(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('click', e => createTapPop(e.clientX, e.clientY));
    document.addEventListener('touchstart', e => {
        const t = e.touches[0];
        if (t) createTapPop(t.clientX, t.clientY);
    }, { passive: true });

    // ==================== INTRO OVERLAY ====================
    const introOverlay = document.getElementById('introOverlay');
    const introBtn = document.getElementById('introBtn');
    const mainContent = document.getElementById('mainContent');

    introBtn.addEventListener('click', () => {
        introOverlay.classList.add('hide');
        mainContent.style.opacity = '1';
        mainContent.style.pointerEvents = 'auto';
        mainContent.style.transition = 'opacity 1s ease 0.4s';

        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 900);

        if (!playing) {
            startMusic();
        }
    });

    // ==================== COUNTDOWN ====================
    const target = new Date('2026-06-28T00:00:00').getTime();
    const wrapper = document.getElementById('countdownWrapper');
    const arrived = document.getElementById('birthdayArrived');
    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    function tick() {
        const diff = target - Date.now();
        if (diff <= 0) {
            wrapper.style.display = 'none';
            arrived.style.display = 'block';
            launchConfetti();
            return;
        }
        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff % 864e5) / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);
        dEl.textContent = String(d).padStart(2, '0');
        hEl.textContent = String(h).padStart(2, '0');
        mEl.textContent = String(m).padStart(2, '0');
        sEl.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);

    // ==================== CONFETTI ====================
    const cCanvas = document.getElementById('confettiCanvas');
    const cCtx = cCanvas.getContext('2d');
    let confetti = [];
    let confettiOn = false;

    function resizeConfetti() {
        cCanvas.width = window.innerWidth;
        cCanvas.height = window.innerHeight;
    }
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);

    function launchConfetti() {
        if (confettiOn) return;
        confettiOn = true;
        const colors = ['#d4899a', '#c9a087', '#c9a55a', '#e0bfa8', '#e8a8b6', '#f0e6d8'];
        for (let i = 0; i < 120; i++) {
            confetti.push({
                x: Math.random() * cCanvas.width,
                y: Math.random() * cCanvas.height - cCanvas.height,
                w: Math.random() * 8 + 4,
                h: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 2.5 + 0.8,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.15,
                drift: (Math.random() - 0.5) * 1.5
            });
        }
        drawConfetti();
        setTimeout(() => {
            confettiOn = false;
            confetti = [];
            cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        }, 7000);
    }

    function drawConfetti() {
        if (!confettiOn) return;
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        confetti.forEach(c => {
            cCtx.save();
            cCtx.translate(c.x, c.y);
            cCtx.rotate(c.angle);
            cCtx.fillStyle = c.color;
            cCtx.globalAlpha = 0.8;
            cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            cCtx.restore();
            c.y += c.speed;
            c.x += c.drift;
            c.angle += c.spin;
        });
        requestAnimationFrame(drawConfetti);
    }

    // ==================== PIANO HAPPY BIRTHDAY ====================
    const musicBtn = document.getElementById('musicBtn');
    const iconPlay = document.getElementById('iconPlay');
    const iconPause = document.getElementById('iconPause');
    let playing = false;
    let wantPlay = false;
    const audioEl = document.getElementById('bgMusic');

    audioEl.addEventListener('canplaythrough', function() {
        if (wantPlay && !playing) {
            audioEl.play().catch(function() {});
            playing = true;
            updateMusicUI();
        }
    });

    function updateMusicUI() {
        if (playing) {
            musicBtn.classList.add('playing');
            iconPlay.style.display = 'none';
            iconPause.style.display = '';
        } else {
            musicBtn.classList.remove('playing');
            iconPlay.style.display = '';
            iconPause.style.display = 'none';
        }
    }

    function startMusic() {
        wantPlay = true;
        try {
            var p = audioEl.play();
            if (p && p.then) {
                p.then(function() {
                    playing = true;
                    updateMusicUI();
                }).catch(function() {});
            }
        } catch(e) {}
        playing = true;
        updateMusicUI();
    }

    function stopMusic() {
        wantPlay = false;
        try { audioEl.pause(); } catch(e) {}
        playing = false;
        updateMusicUI();
    }

    musicBtn.addEventListener('click', () => {
        if (playing) {
            stopMusic();
        } else {
            startMusic();
        }
    });

    // ==================== SCROLL REVEAL ====================
    function setupReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    if (e.target.classList.contains('gallery-mosaic')) {
                        setTimeout(() => e.target.classList.add('cards-shown'), 50);
                    }
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

        reveals.forEach(el => observer.observe(el));

        setTimeout(() => {
            reveals.forEach(el => {
                if (!el.classList.contains('visible')) {
                    el.classList.add('visible');
                    if (el.classList.contains('gallery-mosaic')) {
                        el.classList.add('cards-shown');
                    }
                }
            });
        }, 3000);
    }

    introBtn.addEventListener('click', () => {
        setTimeout(setupReveal, 800);
    });

    if (introOverlay.classList.contains('hide') || introOverlay.style.display === 'none') {
        setupReveal();
    }

    // ==================== GALLERY LIGHTBOX ====================
    const cards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const lbClose = document.getElementById('lightboxClose');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (!img) return;
            lbImg.src = img.src;
            lbImg.alt = img.alt || '';
            lbCaption.textContent = card.dataset.caption || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLB() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    lbClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });

});
