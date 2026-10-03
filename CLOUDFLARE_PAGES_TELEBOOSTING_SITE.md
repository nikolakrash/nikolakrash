# teleboosting.site на Cloudflare Pages

Цель: отдать тот же статический сайт, что и `teleboosting.com`, но полностью закрыть домен `teleboosting.site` от индексации.

## Что уже добавлено в код

- `functions/_middleware.js`:
  - для `teleboosting.site` и `www.teleboosting.site` добавляет `X-Robots-Tag: noindex, nofollow` на все ответы;
  - `/robots.txt` отдает `User-agent: *` и `Disallow: /`;
  - `/sitemap.xml` и `/sitemap` отдают `404`, чтобы дубль не публиковал карту сайта;
  - в HTML на лету ставит `<meta name="robots" content="noindex, nofollow">`.
- `_headers`:
  - дублирует `X-Robots-Tag` для `teleboosting.site` и `www.teleboosting.site`.

Для `teleboosting.com` эти правила не применяются: middleware проверяет hostname.

## Как развернуть в Cloudflare Pages

1. Cloudflare Dashboard -> Workers & Pages -> Create application -> Pages.
2. Connect to Git.
3. Выбрать репозиторий `nikolakrash/nikolakrash`.
4. Production branch: `main`.
5. Framework preset: `None`.
6. Build command: пусто.
7. Build output directory: `/`.
8. После деплоя открыть Pages project -> Custom domains.
9. Добавить `teleboosting.site`.
10. Если нужен `www`, добавить `www.teleboosting.site`.

## DNS у Namecheap

Если домен еще не переведен в Cloudflare, в Namecheap нужно поставить nameservers, которые Cloudflare выдаст при добавлении зоны `teleboosting.site`.

## Проверка после деплоя

```bash
curl -I https://teleboosting.site
curl https://teleboosting.site/robots.txt
curl -I https://teleboosting.site/sitemap.xml
```

Ожидаемо:

- в заголовках есть `X-Robots-Tag: noindex, nofollow`;
- `robots.txt` содержит `Disallow: /`;
- `sitemap.xml` возвращает `404`;
- в HTML есть `<meta name="robots" content="noindex, nofollow">`.
