// Media Slider - слайдер с изображениями и видео
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.media-slider-wrapper');
    if (!sliderWrapper) return;

    const sliderTrack = sliderWrapper.querySelector('.slider-track');
    const prevBtn = sliderWrapper.querySelector('.slider-btn-prev');
    const nextBtn = sliderWrapper.querySelector('.slider-btn-next');
    const indicatorsContainer = sliderWrapper.querySelector('.slider-indicators');

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
        { type: 'image', src: 'static/images/Снимок экрана 2026-02-13 в 14.57.42.png', name: 'Модуль 18' }
    ];

    let currentSlide = 0;
    const totalSlides = mediaFiles.length;
    let videos = [];

    // Создаем слайды
    mediaFiles.forEach((media, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.setAttribute('data-slide-index', index);

        if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = media.name || 'Скриншот';
            img.loading = 'lazy';
            mediaItem.appendChild(img);
        } else if (media.type === 'video') {
            const video = document.createElement('video');
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.controls = true;
            const source = document.createElement('source');
            source.src = media.src;
            source.type = 'video/mp4';
            video.appendChild(source);
            video.appendChild(document.createTextNode('Ваш браузер не поддерживает видео.'));
            mediaItem.appendChild(video);
            videos.push({ video, index });
        }

        sliderTrack.appendChild(mediaItem);

        // Создаем индикатор
        const indicator = document.createElement('button');
        indicator.className = 'slider-indicator';
        indicator.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    // Функция обновления слайдера
    function updateSlider() {
        const translateX = -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;

        // Обновляем индикаторы
        const indicators = indicatorsContainer.querySelectorAll('.slider-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Обновляем кнопки
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;

        // Управление видео
        videos.forEach(({ video, index }) => {
            if (index === currentSlide) {
                video.play().catch(err => {
                    console.log('Автозапуск видео заблокирован браузером:', err);
                });
            } else {
                video.pause();
            }
        });
    }

    // Переход к слайду
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;
        updateSlider();
    }

    // Следующий слайд
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    // Предыдущий слайд
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Обработчики кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Свайп для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    sliderTrack.addEventListener('touchmove', (e) => {
        if (isDragging) {
            touchEndX = e.touches[0].clientX;
        }
    }, { passive: true });

    sliderTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;

        const diff = touchStartX - touchEndX;
        const threshold = 50; // Минимальное расстояние для свайпа

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            }
        }
    });

    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        const sliderSection = document.querySelector('.media-slider-section');
        if (!sliderSection) return;
        
        const rect = sliderSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });

    // Инициализация
    updateSlider();
});
