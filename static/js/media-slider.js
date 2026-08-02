document.addEventListener('DOMContentLoaded', function() {
    const sliderSection = document.querySelector('.media-slider-section');
    const sliderWrapper = document.querySelector('.media-slider-wrapper');
    if (!sliderSection || !sliderWrapper) return;

    const sliderTrack = sliderWrapper.querySelector('.slider-track');
    const prevBtn = sliderWrapper.querySelector('.slider-btn-prev');
    const nextBtn = sliderWrapper.querySelector('.slider-btn-next');
    const indicatorsContainer = sliderWrapper.querySelector('.slider-indicators');
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
    let totalSlides = 0;
    let videos = [];
    let initialized = false;

    function ensureVideoSource(video) {
        if (video.dataset.loaded === 'true') return;
        const source = document.createElement('source');
        source.src = video.dataset.src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.dataset.loaded = 'true';
        video.load();
    }

    function updateSlider() {
        sliderTrack.style.transform = `translateX(${-currentSlide * 100}%)`;

        indicatorsContainer.querySelectorAll('.slider-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });

        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;

        videos.forEach(({ video, index }) => {
            if (index === currentSlide) {
                ensureVideoSource(video);
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;
        updateSlider();
    }

    function initSlider() {
        if (initialized) return;
        initialized = true;
        totalSlides = mediaFiles.length;

        mediaFiles.forEach((media, index) => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.setAttribute('data-slide-index', index);

            if (media.type === 'image') {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = media.name || 'Скриншот';
                img.loading = 'lazy';
                img.decoding = 'async';
                mediaItem.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.preload = 'none';
                video.controls = true;
                video.dataset.src = media.src;
                video.poster = 'static/favicon-512x512.png';
                video.appendChild(document.createTextNode('Ваш браузер не поддерживает видео.'));
                mediaItem.appendChild(video);
                videos.push({ video, index });
            }

            sliderTrack.appendChild(mediaItem);

            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

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
            if (Math.abs(diff) <= 50) return;
            goToSlide(currentSlide + (diff > 0 ? 1 : -1));
        });

        document.addEventListener('keydown', (e) => {
            const rect = sliderSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isVisible) return;
            if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        });

        updateSlider();
    }

    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            initSlider();
            sliderObserver.disconnect();
        });
    }, { rootMargin: '250px 0px' });

    sliderObserver.observe(sliderSection);
});
