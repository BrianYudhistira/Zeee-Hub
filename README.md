# Zeee-Hub

Web portfolio fullstack built with Laravel (backend) and React/Inertia (frontend).

## Summary
Web portfolio using Laravel (backend) and React + Inertia (frontend).

Key versions
- PHP: ^8.2
- Laravel: ^12.0
- Vite: ^7.0.7

Quick facts
- Frontend: React + Inertia + Tailwind (source: `resources/js/`).
- Backend: Laravel API, Sanctum auth, models in `app/`.
- Public assets (images, certificates) live in `storage/app/public` and are served via `public/storage`.

Quick install (local)
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
npm install
npm run dev
php artisan serve
```

Build (production)
```bash
npm run build
php artisan optimize
```

Troubleshooting
- 403 when accessing `/storage/...`: run `php artisan storage:link` and verify the file exists under `storage/app/public` and has readable permissions.
- If links still fail, ensure `certificate_path` is a relative path (e.g. `certs/foo.pdf`) and use `/storage/<path>` in URLs.

For package versions see `composer.json` and `package.json`.



