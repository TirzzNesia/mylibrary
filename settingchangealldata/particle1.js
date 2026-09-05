(function() {
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let w, h, particles, animId;
        let lastFrame = 0;

        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth < 768;
        const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : isMobile;

        const FPS_TARGET = isMobile ? 24 : 60;
        const FRAME_INTERVAL = 1000 / FPS_TARGET;
        const PARTICLE_COUNT = isLowEnd ? 20 : (isSmallScreen ? 30 : 55);
        const CONNECT_DIST = isSmallScreen ? 100 : 140;
        const MAX_CONNECTIONS = isMobile ? 3 : 999;

        const COLORS = [
            { r: 59, g: 130, b: 246 },
            { r: 20, g: 184, b: 166 },
            { r: 139, g: 92, b: 246 },
            { r: 96, g: 165, b: 250 },
        ];

        const DPR = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * DPR;
            canvas.height = h * DPR;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.scale(DPR, DPR);
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const c = COLORS[Math.floor(Math.random() * COLORS.length)];
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 1.5 + 1.2,
                    color: c,
                    conns: 0
                });
            }
        }

        function draw(timestamp) {
            animId = requestAnimationFrame(draw);

            if (timestamp - lastFrame < FRAME_INTERVAL) return;
            lastFrame = timestamp;
            ctx.clearRect(0, 0, w, h);
            for (const p of particles) p.conns = 0;
            const distSq = CONNECT_DIST * CONNECT_DIST;
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].conns >= MAX_CONNECTIONS) continue;
                for (let j = i + 1; j < particles.length; j++) {
                    if (particles[j].conns >= MAX_CONNECTIONS) continue;
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < distSq) {
                        const alpha = (1 - Math.sqrt(d2) / CONNECT_DIST) * 0.15;
                        const ci = particles[i].color;
                        ctx.strokeStyle = `rgba(${ci.r},${ci.g},${ci.b},${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        particles[i].conns++;
                        particles[j].conns++;
                    }
                }
            }

            for (const p of particles) {
                if (!isMobile) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.06)`;
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.5)`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                p.x = Math.max(0, Math.min(w, p.x));
                p.y = Math.max(0, Math.min(h, p.y));
            }
        }

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                lastFrame = 0;
                animId = requestAnimationFrame(draw);
            }
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                resize();
                createParticles();
            }, 200);
        });

        resize();
        createParticles();
        requestAnimationFrame(draw);
    })();
