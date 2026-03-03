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
