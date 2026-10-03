const NOINDEX_HOSTS = new Set([
  'teleboosting.site',
  'www.teleboosting.site',
]);

const ROBOTS_TXT = `User-agent: *\nDisallow: /\n`;

function isNoIndexHost(hostname) {
  return NOINDEX_HOSTS.has(hostname.toLowerCase());
}

function withNoIndexHeaders(headers) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set('X-Robots-Tag', 'noindex, nofollow');
  return nextHeaders;
}

function applyNoIndexMeta(html) {
  const noindexMeta = '<meta name="robots" content="noindex, nofollow">';
  const robotsMetaPattern = /<meta\s+name=["']robots["'][^>]*>/i;

  if (robotsMetaPattern.test(html)) {
    return html.replace(robotsMetaPattern, noindexMeta);
  }

  return html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n    ${noindexMeta}`);
}

function applySitePricingStub(html) {
  const pricingSectionPattern = /<section id="pricing" class="cta-section">[\s\S]*?<\/section>/i;
  const pricingStub = `
    <section id="pricing" class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2 class="cta-title">Выберите тариф TeleBoosting</h2>
                <p class="cta-description">
                    Тестовая витрина тарифов для teleboosting.site. Оплата и выдача лицензии будут подключены после восстановления сервера лицензий.
                </p>

                <div class="pricing-grid">
                    <div class="pricing-card pricing-card-free">
                        <div class="pricing-badge">ПОЧАСОВОЙ</div>
                        <h3 class="pricing-title">Почасовой тариф</h3>
                        <div class="pricing-price"><span id="hourly-total">100</span> ₽</div>
                        <p class="pricing-period">1 час = 100 ₽</p>
                        <ul class="pricing-features">
                            <li>Выберите нужное количество часов</li>
                            <li>Подходит для короткого теста функций</li>
                            <li>Заглушка до подключения оплаты и лицензий</li>
                        </ul>
                        <label class="form-label" for="hourly-hours" style="display:block; margin: 0 0 8px; font-weight: 700;">Количество часов</label>
                        <select id="hourly-hours" class="pricing-btn" style="cursor:pointer; margin-bottom: 14px; text-align:center;">
                            <option value="1">1 час</option>
                            <option value="2">2 часа</option>
                            <option value="3">3 часа</option>
                            <option value="6">6 часов</option>
                            <option value="12">12 часов</option>
                            <option value="24">24 часа</option>
                        </select>
                        <button type="button" class="pricing-btn pricing-btn-primary" disabled>
                            Оплата скоро будет доступна
                        </button>
                    </div>

                    <div class="pricing-card">
                        <div class="pricing-badge">СУТОЧНЫЙ</div>
                        <h3 class="pricing-title">Суточный тариф</h3>
                        <div class="pricing-price"><span id="daily-total">1 000</span> ₽</div>
                        <p class="pricing-period">1 день = 1 000 ₽</p>
                        <ul class="pricing-features">
                            <li>Введите количество дней вручную</li>
                            <li>Подходит для полноценной работы</li>
                            <li>Заглушка до подключения оплаты и лицензий</li>
                        </ul>
                        <label class="form-label" for="daily-days" style="display:block; margin: 0 0 8px; font-weight: 700;">Количество дней</label>
                        <input id="daily-days" class="pricing-btn" type="number" min="1" max="365" value="1" style="cursor:text; margin-bottom: 14px; text-align:center;">
                        <button type="button" class="pricing-btn" disabled>
                            Оплата скоро будет доступна
                        </button>
                    </div>
                </div>

                <div class="cta-buttons">
                    <a href="https://t.me/teleboosting_soft_bot" class="btn btn-cta-primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-envelope"></i> Связаться с нами
                    </a>
                    <a href="#features" class="btn btn-cta-secondary">
                        <i class="fas fa-info-circle"></i> Узнать больше
                    </a>
                </div>
            </div>
        </div>
    </section>
    <script>
      (() => {
        const formatRub = (value) => new Intl.NumberFormat('ru-RU').format(value);
        const hourlyHours = document.getElementById('hourly-hours');
        const hourlyTotal = document.getElementById('hourly-total');
        const dailyDays = document.getElementById('daily-days');
        const dailyTotal = document.getElementById('daily-total');

        if (hourlyHours && hourlyTotal) {
          hourlyHours.addEventListener('change', () => {
            hourlyTotal.textContent = formatRub(Number(hourlyHours.value || 1) * 100);
          });
        }

        if (dailyDays && dailyTotal) {
          dailyDays.addEventListener('input', () => {
            const days = Math.max(1, Number(dailyDays.value || 1));
            dailyTotal.textContent = formatRub(days * 1000);
          });
        }
      })();
    </script>`;

  return html.replace(pricingSectionPattern, pricingStub);
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (!isNoIndexHost(url.hostname)) {
    return context.next();
  }

  if (url.pathname === '/robots.txt') {
    return new Response(ROBOTS_TXT, {
      status: 200,
      headers: withNoIndexHeaders({
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      }),
    });
  }

  if (url.pathname.startsWith('/downloads/')) {
    const target = new URL(url.pathname + url.search, 'https://teleboosting.com');
    return Response.redirect(target.toString(), 302);
  }

  if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
    return new Response('Not Found', {
      status: 404,
      headers: withNoIndexHeaders({
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      }),
    });
  }

  const response = await context.next();
  const headers = withNoIndexHeaders(response.headers);
  const contentType = headers.get('Content-Type') || '';

  if (!contentType.includes('text/html')) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const html = await response.text();
  const transformedHtml = applySitePricingStub(applyNoIndexMeta(html));
  return new Response(transformedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
