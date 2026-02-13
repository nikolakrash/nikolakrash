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


// Медиа-слайдер вынесен в отдельный файл media-slider.js

// Shutter Text Effect
document.addEventListener('DOMContentLoaded', function() {
    const shutterText = document.querySelector('.hero-shutter-text .shutter-word');
    if (!shutterText) return;
    
    const text = shutterText.textContent.trim();
    shutterText.textContent = ''; // Очищаем текст
    
    // Разбиваем на буквы и создаем структуру
    text.split('').forEach((char, index) => {
        const charWrapper = document.createElement('span');
        charWrapper.className = 'shutter-char';
        
        // Базовый слой (основная буква)
        const baseChar = document.createElement('span');
        baseChar.className = 'shutter-char-base';
        baseChar.textContent = char === ' ' ? '\u00A0' : char;
        baseChar.style.animationDelay = `${index * 0.04 + 0.3}s`;
        charWrapper.appendChild(baseChar);
        
        // Верхний слой
        const topSlice = document.createElement('span');
        topSlice.className = 'shutter-char-slice shutter-char-slice-top';
        topSlice.textContent = char === ' ' ? '\u00A0' : char;
        topSlice.style.animationDelay = `${index * 0.04}s`;
        charWrapper.appendChild(topSlice);
        
        // Средний слой
        const middleSlice = document.createElement('span');
        middleSlice.className = 'shutter-char-slice shutter-char-slice-middle';
        middleSlice.textContent = char === ' ' ? '\u00A0' : char;
        middleSlice.style.animationDelay = `${index * 0.04 + 0.1}s`;
        charWrapper.appendChild(middleSlice);
        
        // Нижний слой
        const bottomSlice = document.createElement('span');
        bottomSlice.className = 'shutter-char-slice shutter-char-slice-bottom';
        bottomSlice.textContent = char === ' ' ? '\u00A0' : char;
        bottomSlice.style.animationDelay = `${index * 0.04 + 0.2}s`;
        charWrapper.appendChild(bottomSlice);
        
        shutterText.appendChild(charWrapper);
    });
});
