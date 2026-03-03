// Инициализация Spline 3D сцены
function initSpline() {
    const container = document.getElementById('spline-container');
    if (!container) {
        setTimeout(initSpline, 100);
        return;
    }

    // Проверяем, загружен ли Spline runtime
    if (typeof Application === 'undefined') {
        setTimeout(initSpline, 100);
        return;
    }

    // URL сцены Spline (можно заменить на свою)
    const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
    
    try {
        const app = new Application();
        container.appendChild(app.canvas);
        
        app.load(sceneUrl).then(() => {
            console.log('Spline scene loaded successfully');
            
            // Настройка canvas
            app.canvas.style.width = '100%';
            app.canvas.style.height = '100%';
            app.canvas.style.display = 'block';
            
            // Обработка изменения размера окна
            function handleResize() {
                const rect = container.getBoundingClientRect();
                app.setSize(rect.width, rect.height);
            }
            
            window.addEventListener('resize', handleResize);
            handleResize();
        })
        .catch((error) => {
            console.error('Error loading Spline scene:', error);
            // Fallback: показываем градиентный фон если Spline не загрузился
            container.innerHTML = '<div class="spline-fallback"></div>';
        });
    } catch (error) {
        console.error('Error initializing Spline:', error);
        container.innerHTML = '<div class="spline-fallback"></div>';
    }
}

// Запускаем инициализацию после загрузки DOM (если Application уже доступен)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof Application !== 'undefined') {
            initSpline();
        }
    });
} else {
    if (typeof Application !== 'undefined') {
        initSpline();
    }
}

// Spotlight эффект (следует за курсором мыши)
document.addEventListener('DOMContentLoaded', function() {
    const spotlight = document.querySelector('.spotlight-effect');
    if (!spotlight) return;

    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    let isHovered = false;

    heroSection.addEventListener('mousemove', function(e) {
        if (!isHovered) {
            isHovered = true;
            spotlight.style.opacity = '1';
        }
        
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        spotlight.style.left = x + 'px';
        spotlight.style.top = y + 'px';
    });

    heroSection.addEventListener('mouseleave', function() {
        isHovered = false;
        spotlight.style.opacity = '0';
    });
});
