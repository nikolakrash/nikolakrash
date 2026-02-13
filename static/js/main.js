// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Изменение прозрачности навбара при прокрутке
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к карточкам преимуществ
document.querySelectorAll('.advantage-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Анимация для секции возможностей при прокрутке
const featuresObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            const title = section.querySelector('.section-title');
            const subtitle = section.querySelector('.section-subtitle');
            const cards = section.querySelectorAll('.feature-card');
            
            // Анимация заголовка с эффектом bounce
            if (title && !title.classList.contains('animated')) {
                title.classList.add('animated');
            }
            
            // Анимация подзаголовка
            if (subtitle && !subtitle.classList.contains('animated')) {
                subtitle.classList.add('animated');
            }
            
            // Анимация карточек с задержкой и более выраженным эффектом
            cards.forEach((card, index) => {
                if (!card.classList.contains('animated')) {
                    card.classList.add('animated');
                    // Устанавливаем задержку анимации для каждой карточки
                    card.style.animationDelay = `${0.4 + (index * 0.1)}s`;
                }
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

// Наблюдаем за секцией возможностей
document.addEventListener('DOMContentLoaded', function() {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
        featuresObserver.observe(featuresSection);
    }
});

// Анимация счетчиков статистики
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target >= 1000 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target >= 1000 ? '+' : '');
        }
    }, 16);
}

// Запуск анимации счетчиков при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});


// Автозапуск видео в медиа-карусели когда они видимы
document.addEventListener('DOMContentLoaded', function() {
    const mediaCarousel = document.querySelector('.media-carousel');
    if (!mediaCarousel) return;
    
    const allVideos = mediaCarousel.querySelectorAll('video');
    // Список медиафайлов (отсортированы по времени создания)
    // Формат: { type: 'image' или 'video', src: 'путь к файлу', name: 'название' }
    const mediaFiles = [
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.23.11.png', name: 'Модуль 1' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.28.06.png', name: 'Модуль 2' },
        { type: 'video', src: 'static/videos/REC-20260213143637.mp4', name: 'Видео 1' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.41.54.png', name: 'Модуль 3' },
        { type: 'video', src: 'static/videos/REC-20260213144243.mp4', name: 'Видео 2' },
        { type: 'video', src: 'static/videos/REC-20260213144444.mp4', name: 'Видео 3' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.45.47.png', name: 'Модуль 4' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.46.16.png', name: 'Модуль 5' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.46.33.png', name: 'Модуль 6' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.46.59.png', name: 'Модуль 7' },
        { type: 'video', src: 'static/videos/REC-20260213144733.mp4', name: 'Видео 4' },
        { type: 'video', src: 'static/videos/REC-20260213144856.mp4', name: 'Видео 5' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.50.09.png', name: 'Модуль 8' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.50.30.png', name: 'Модуль 9' },
        { type: 'video', src: 'static/videos/REC-20260213145059.mp4', name: 'Видео 6' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.51.32.png', name: 'Модуль 10' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.51.48.png', name: 'Модуль 11' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.52.06.png', name: 'Модуль 12' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.52.36.png', name: 'Модуль 13' },
        { type: 'video', src: 'static/videos/REC-20260213145328.mp4', name: 'Видео 7' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.54.16.png', name: 'Модуль 14' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.54.46.png', name: 'Модуль 15' },
        { type: 'video', src: 'static/videos/REC-20260213145518.mp4', name: 'Видео 8' },
        { type: 'video', src: 'static/videos/REC-20260213145559.mp4', name: 'Видео 9' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.56.32.png', name: 'Модуль 16' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.56.55.png', name: 'Модуль 17' },
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.57.42.png', name: 'Модуль 18' },
    ];
            if (entry.isIntersecting) {
                // Видео видно - запускаем
                video.play().catch(err => {
                    console.log('Автозапуск видео заблокирован браузером:', err);
                });
            } else {
                // Видео не видно - останавливаем
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Видео считается видимым если 50% видно
    });
    
    // Наблюдаем за всеми видео
    allVideos.forEach(video => {
        videoObserver.observe(video);
    });
});
