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
  return new Response(applyNoIndexMeta(html), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
