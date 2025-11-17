# 🚀 Zeee-Hub Core API

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat&logo=php)](https://php.net)

**Core API Service** untuk ekosistem multi-platform: Dashboard (Next.js), Mobile App, dan Portfolio Website (Inertia.js).

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)

---

## ✨ Fitur Utama

### 🔐 Authentication
- Token-based auth (Laravel Sanctum)
- Email verification
- User activity tracking
- Rate limiting (60 req/min)

### 👤 User Management
- Registration with photo upload
- Profile management
- Activity logs

### 🎨 Portfolio System
- Dynamic sections: Home, About, Projects, Contact
- Custom slug URLs
- File uploads (images, CV)
- Theme customization

---

## 🛠️ Tech Stack

**Backend:** Laravel 12.x | PHP 8.2+ | MySQL | Sanctum Auth  
**Frontend:** Inertia.js | React | Tailwind CSS | Vite  
**Queue:** Database (Redis ready)  
**Testing:** Pest

---

## 🚀 Instalasi

### Prerequisites

```bash
PHP >= 8.2 | Composer | MySQL >= 8.0 | Node.js >= 18.x
```

### Quick Start

```powershell
# 1. Clone & install
git clone https://github.com/BrianYudhistira/Zeee-Hub.git
cd Zeee-Hub
composer install
npm install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Configure database di .env
DB_DATABASE=zeee_hub
DB_USERNAME=root
DB_PASSWORD=your_password

# 4. Migrate & setup storage
php artisan migrate
php artisan storage:link

# 5. Start server
composer run dev
# atau: php artisan serve
```

Server: **http://localhost:8000**

---

## 📚 API Endpoints

**Base URL:** `http://localhost:8000/api`

**Auth Header:** `Authorization: Bearer {token}`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/login` | POST | ❌ | Login user |
| `/signin` | POST | ❌ | Register user |
| `/logout` | POST | ✅ | Logout |
| `/user` | GET | ✅ | Get current user |
| `/user/update` | POST | ✅ | Update profile |
| `/portfolio` | GET | ✅ | Get portfolio |
| `/update_portfolioJson` | POST | ✅ | Update portfolio (JSON) |
| `/update_portfolioForm` | POST | ✅ | Update portfolio (FormData) |
| `/portfolio/delete` | DELETE | ✅ | Delete portfolio |

📖 **Full docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 💻 Development

```powershell
# Testing
php artisan test

# Code format
./vendor/bin/pint

# Database
php artisan migrate:fresh
php artisan db:seed
php artisan tinker

# Queue
php artisan queue:work

# Logs
php artisan pail
```

---

## 📞 Contact

**Maintainer:** Brian Yudhistira  
**GitHub:** [@BrianYudhistira](https://github.com/BrianYudhistira)

---

**Built with ❤️ using Laravel**

