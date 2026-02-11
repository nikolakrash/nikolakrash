# Инструкция по загрузке сайта на Timeweb Cloud

## Подготовка

### 1. Информация о домене
- **Домен:** `teleboosting.com`
- **DNS:** Cloudflare
- **Хостинг:** Timeweb Cloud

### 2. Что нужно сделать
1. Создать/настроить сервер на Timeweb
2. Установить nginx
3. Загрузить файлы сайта
4. Настроить nginx для статики
5. Настроить DNS в Cloudflare
6. Установить SSL сертификат

---

## Шаг 1: Создание сервера на Timeweb

1. Зайдите в панель Timeweb: https://timeweb.cloud/my/servers
2. Создайте новый VPS (если еще нет):
   - **ОС:** Ubuntu 22.04 LTS (рекомендуется)
   - **Конфигурация:** минимум 1 CPU, 1GB RAM (для статики достаточно)
3. Запишите IP адрес сервера
4. Подключитесь по SSH:
   ```bash
   ssh root@ВАШ_IP_СЕРВЕРА
   ```

---

## Шаг 2: Установка nginx

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка nginx
apt install nginx -y

# Запуск nginx
systemctl start nginx
systemctl enable nginx

# Проверка статуса
systemctl status nginx
```

---

## Шаг 3: Загрузка файлов сайта

### Вариант A: Через SCP (с вашего Mac)

```bash
cd /Users/macbook/teleboosting-sait
scp -r * root@ВАШ_IP_СЕРВЕРА:/var/www/teleboosting.com/
```

### Вариант B: Через Git (если есть репозиторий)

```bash
# На сервере
apt install git -y
cd /var/www
git clone ВАШ_РЕПОЗИТОРИЙ teleboosting.com
```

### Вариант C: Через FTP/SFTP

Используйте FileZilla или другой FTP-клиент для загрузки файлов.

---

## Шаг 4: Настройка nginx

### Создать конфигурацию сайта

```bash
nano /etc/nginx/sites-available/teleboosting.com
```

Вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name teleboosting.com www.teleboosting.com;
    
    root /var/www/teleboosting.com;
    index index.html;
    
    # Логи
    access_log /var/log/nginx/teleboosting.com.access.log;
    error_log /var/log/nginx/teleboosting.com.error.log;
    
    # Основная локация
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Статические файлы (кеширование)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|mp4|webm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Запрет доступа к скрытым файлам
    location ~ /\. {
        deny all;
    }
}
```

### Активировать сайт

```bash
# Создать символическую ссылку
ln -s /etc/nginx/sites-available/teleboosting.com /etc/nginx/sites-enabled/

# Удалить дефолтный сайт (опционально)
rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
nginx -t

# Перезагрузить nginx
systemctl reload nginx
```

---

## Шаг 5: Настройка DNS в Cloudflare

1. Зайдите в панель Cloudflare: https://dash.cloudflare.com
2. Выберите домен `teleboosting.com`
3. Перейдите в раздел **DNS**
4. Добавьте/измените записи:

   **A запись:**
   - **Name:** `@` (или `teleboosting.com`)
   - **IPv4 address:** `ВАШ_IP_СЕРВЕРА`
   - **Proxy status:** 🟠 Proxied (включен) - для защиты и ускорения
   - **TTL:** Auto

   **A запись для www:**
   - **Name:** `www`
   - **IPv4 address:** `ВАШ_IP_СЕРВЕРА`
   - **Proxy status:** 🟠 Proxied
   - **TTL:** Auto

5. Сохраните изменения
6. Подождите 5-10 минут для распространения DNS

---

## Шаг 6: Установка SSL сертификата (Let's Encrypt)

### Вариант A: Через Cloudflare (рекомендуется)

Если включен Proxy (🟠 Proxied) в Cloudflare, SSL уже работает автоматически через Cloudflare. Дополнительная настройка не требуется.

### Вариант B: Прямой SSL на сервере (если Proxy выключен)

```bash
# Установка certbot
apt install certbot python3-certbot-nginx -y

# Получение сертификата
certbot --nginx -d teleboosting.com -d www.teleboosting.com

# Следовать инструкциям:
# - Email для уведомлений
# - Согласие с условиями
# - Автоматическое обновление

# Проверка автообновления
certbot renew --dry-run
```

После установки certbot автоматически обновит конфигурацию nginx для HTTPS.

---

## Шаг 7: Проверка работы

1. **Проверка nginx:**
   ```bash
   systemctl status nginx
   ```

2. **Проверка сайта:**
   ```bash
   curl http://localhost
   ```

3. **Проверка через браузер:**
   - Откройте: `http://teleboosting.com` (или `https://teleboosting.com` если SSL установлен)
   - Должен открыться сайт

---

## Дополнительные настройки

### Настройка прав доступа

```bash
# Установить правильные права
chown -R www-data:www-data /var/www/teleboosting.com
chmod -R 755 /var/www/teleboosting.com
```

### Настройка firewall (опционально)

```bash
# Установка ufw
apt install ufw -y

# Разрешить SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Включить firewall
ufw enable

# Проверить статус
ufw status
```

### Оптимизация nginx (для производительности)

Добавьте в `/etc/nginx/nginx.conf` в секцию `http`:

```nginx
http {
    # Кеширование
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

После изменений:
```bash
nginx -t
systemctl reload nginx
```

---

## Обновление сайта

Когда нужно обновить файлы сайта:

```bash
# С вашего Mac
cd /Users/macbook/teleboosting-sait
scp -r * root@ВАШ_IP_СЕРВЕРА:/var/www/teleboosting.com/

# На сервере (если нужно обновить права)
ssh root@ВАШ_IP_СЕРВЕРА "chown -R www-data:www-data /var/www/teleboosting.com"
```

---

## Полезные команды

```bash
# Проверить конфигурацию nginx
nginx -t

# Перезагрузить nginx
systemctl reload nginx

# Перезапустить nginx
systemctl restart nginx

# Посмотреть логи nginx
tail -f /var/log/nginx/teleboosting.com.access.log
tail -f /var/log/nginx/teleboosting.com.error.log

# Проверить статус nginx
systemctl status nginx
```

---

## Решение проблем

### Сайт не открывается

1. Проверьте статус nginx: `systemctl status nginx`
2. Проверьте конфигурацию: `nginx -t`
3. Проверьте логи: `tail -f /var/log/nginx/error.log`
4. Проверьте DNS: `nslookup teleboosting.com`

### 502 Bad Gateway

- Проверьте, что nginx запущен: `systemctl status nginx`
- Проверьте права доступа к файлам: `ls -la /var/www/teleboosting.com`

### SSL не работает

- Если используете Cloudflare Proxy, SSL работает автоматически
- Если Proxy выключен, установите certbot (см. Шаг 6)

---

## Контакты и поддержка

Если возникнут проблемы, проверьте:
- Логи nginx: `/var/log/nginx/`
- Статус сервисов: `systemctl status nginx`
- DNS записи в Cloudflare
