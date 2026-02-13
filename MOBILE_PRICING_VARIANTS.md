# Варианты адаптации блока цен для мобильной версии

## Вариант 1: Горизонтальный скролл (Swipe) ⭐ Рекомендую

**Плюсы:**
- Все карточки видны в одну строку
- Удобно листать свайпом
- Современный UX
- Сохраняет визуальный стиль

**Минусы:**
- Нужно скроллить, чтобы увидеть все

**CSS код:**
```css
@media (max-width: 768px) {
    .pricing-grid {
        display: flex;
        overflow-x: auto;
        gap: 15px;
        padding: 10px 0 20px;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
    }
    
    .pricing-card {
        flex: 0 0 280px; /* Фиксированная ширина карточки */
        scroll-snap-align: start;
        min-width: 280px;
    }
    
    /* Скрыть скроллбар, но оставить функциональность */
    .pricing-grid::-webkit-scrollbar {
        height: 6px;
    }
    
    .pricing-grid::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
    
    .pricing-grid::-webkit-scrollbar-thumb {
        background: rgba(102, 126, 234, 0.5);
        border-radius: 10px;
    }
}
```

---

## Вариант 2: Компактная таблица (все в строку)

**Плюсы:**
- Все тарифы видны сразу
- Удобно сравнивать цены
- Компактный вид

**Минусы:**
- Может быть тесно на маленьких экранах
- Меньше места для текста

**CSS код:**
```css
@media (max-width: 768px) {
    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(120px, 1fr));
        gap: 8px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 10px;
    }
    
    .pricing-card {
        padding: 15px 10px;
        min-width: 120px;
    }
    
    .pricing-title {
        font-size: 0.9rem;
        min-height: 2.5rem;
        margin-bottom: 6px;
    }
    
    .pricing-price {
        font-size: 1.3rem;
        min-height: 1.8rem;
    }
    
    .pricing-period {
        font-size: 0.75rem;
        min-height: 2.5rem;
        margin-bottom: 10px;
    }
    
    .pricing-features {
        display: none; /* Скрываем список на мобильных для компактности */
    }
    
    .pricing-btn {
        padding: 8px 12px;
        font-size: 0.85rem;
    }
    
    .pricing-badge {
        font-size: 0.65rem;
        padding: 3px 8px;
        top: 8px;
        right: 10px;
    }
}
```

---

## Вариант 3: Вертикальный список (полная ширина)

**Плюсы:**
- Карточки на всю ширину экрана
- Удобно читать
- Все детали видны

**Минусы:**
- Длинная страница
- Нужно скроллить вниз

**CSS код:**
```css
@media (max-width: 768px) {
    .pricing-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        max-width: 100%;
    }
    
    .pricing-card {
        padding: 24px 20px;
    }
    
    .pricing-title {
        font-size: 1.4rem;
        min-height: auto;
    }
    
    .pricing-price {
        font-size: 2rem;
        min-height: auto;
    }
    
    .pricing-period {
        font-size: 1rem;
        min-height: auto;
    }
}
```

---

## Как применить

1. Откройте файл `/Users/macbook/teleboosting-sait/static/css/style.css`
2. Найдите секцию `@media (max-width: 768px)` (около строки 1260)
3. Добавьте выбранный вариант CSS кода в эту секцию
4. Сохраните и проверьте на мобильном устройстве

---

## Рекомендация

**Вариант 1 (Горизонтальный скролл)** — самый удобный для мобильных:
- Современный UX
- Все карточки доступны
- Удобно листать
- Сохраняет визуальный стиль

Какой вариант выбираете?
