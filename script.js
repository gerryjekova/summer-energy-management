class EnergyManagementApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Initializing EnergyManagementApp...');
        this.initSakuraAnimation();
        this.initStarryBackground();
        this.initChecklistToggle();
        this.initEnergyTracker();
        this.initScrollEffects();
        this.initMobileMenu();
        this.initModalEscape();
        this.initScrollProgress();
    }

    initSakuraAnimation() {
        const container = document.querySelector('.sakura-container');
        if (!container) {
            console.error('Sakura container not found');
            return;
        }

        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(petal);
            setTimeout(() => petal.remove(), 10000);
        };

        for (let i = 0; i < 20; i++) {
            setTimeout(createPetal, i * 200);
        }

        setInterval(createPetal, 500);
    }

    initStarryBackground() {
        const container = document.querySelector('.starry-bg');
        if (!container) {
            console.error('Starry background container not found');
            return;
        }

        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            container.appendChild(star);
            setTimeout(() => star.remove(), 6000);
        };

        for (let i = 0; i < 50; i++) {
            setTimeout(createStar, i * 100);
        }

        setInterval(createStar, 1200);
    }

    initChecklistToggle() {
        const checklistItems = document.querySelectorAll('.checklist li');
        if (!checklistItems.length) {
            console.error('No checklist items found');
            return;
        }

        checklistItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('checked');
                console.log(`Toggled checklist item: ${item.textContent}`);
            });
        });
    }

    initEnergyTracker() {
        const tracker = document.querySelector('.energy-tracker');
        if (!tracker) {
            console.error('Energy tracker not found');
            return;
        }

        const levels = tracker.querySelectorAll('.energy-level');
        const averageDisplay = document.querySelector('#energy-average');

        levels.forEach(level => {
            level.addEventListener('click', () => {
                const siblings = level.parentElement.querySelectorAll('.energy-level');
                siblings.forEach(sib => sib.classList.remove('active'));
                level.classList.add('active');

                const values = Array.from(tracker.querySelectorAll('.energy-level.active'))
                    .map(btn => parseInt(btn.getAttribute('data-value')));
                
                if (values.length > 0) {
                    const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
                    averageDisplay.textContent = `${average}/5`;
                } else {
                    averageDisplay.textContent = 'N/A';
                }

                console.log(`Energy level selected: ${level.getAttribute('data-value')}`);
            });
        });
    }

    initScrollEffects() {
        const elements = document.querySelectorAll('section, .food-item, .checklist li, .image-placeholder, .energy-level');
        if (!elements.length) {
            console.error('No elements found for scroll effects');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.3 });

        elements.forEach(el => observer.observe(el));

        const nav = document.querySelector('nav');
        const topButton = document.querySelector('.top-button');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('sticky-nav');
                topButton.style.opacity = '1';
            } else {
                nav.classList.remove('sticky-nav');
                topButton.style.opacity = '0';
            }
        });
    }

    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navUl = document.querySelector('nav ul');
        const overlay = document.querySelector('.overlay');

        if (!menuToggle || !navUl || !overlay) {
            console.error('Mobile menu elements not found');
            return;
        }

        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            overlay.classList.toggle('active');
            menuToggle.textContent = navUl.classList.contains('active') ? '✖' : '☰';
            console.log(`Mobile menu toggled: ${navUl.classList.contains('active') ? 'open' : 'closed'}`);
        });

        overlay.addEventListener('click', () => {
            navUl.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.textContent = '☰';
            console.log('Mobile menu closed via overlay');
        });
    }

    initModalEscape() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const toggles = document.querySelectorAll('.modal-toggle:checked');
                toggles.forEach(toggle => {
                    toggle.checked = false;
                    console.log('Modal closed via ESC key');
                });
            }
        });
    }

    initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            console.error('Scroll progress bar not found');
            return;
        }

        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new EnergyManagementApp();
        console.log('EnergyManagementApp initialized successfully');
    } catch (error) {
        console.error('Failed to initialize EnergyManagementApp:', error);
    }
});