# 🚀 Pre-Deployment Quick Checklist

## Brze provere pre deployementa na Hetzner

---

## ✅ Lokalni Development - Status

### Backend
- ✅ .NET 10 Web API
- ✅ JWT autentikacija implementirana
- ✅ BCrypt password hashing
- ✅ Admin endpoints zaštićeni sa `[Authorize(Roles = "Admin")]`
- ✅ SQLite baza
- ✅ Email service (SMTP Gmail)
- ✅ Port: 5002

### Frontend
- ✅ Next.js 16
- ✅ Admin panel sa login formom
- ✅ JWT token storage i authorization
- ✅ Modern glassmorphism UI
- ✅ Port: 3000

### Deployment Files
- ✅ `backend/Dockerfile` - multi-stage build
- ✅ `frontend/Dockerfile` - multi-stage build
- ✅ `docker-compose.yml` - 3 services (backend, frontend, nginx)
- ✅ `nginx/nginx.conf` - reverse proxy sa SSL spremnim
- ✅ `backend/.env` - production environment variables
- ✅ `frontend/.env.production` - frontend config

---

## 🔧 Pre Uploadovanja na Server

### 1. Environment Variables

#### Backend `.env` - PROMENI OVO! 🔐
```bash
# Generiši jake lozinke
openssl rand -base64 36  # JWT_SECRET
openssl rand -base64 24  # ADMIN_PASSWORD
```

**Edituj `backend/.env`:**
- [ ] `JWT_SECRET` - zameni sa novom vrednosti (min 48 karaktera)
- [ ] `ADMIN_PASSWORD` - zameni sa jakom lozinkom (min 20 karaktera)
- [ ] Proveri da je `SMTP_PASSWORD` tačan (Gmail App Password)

#### Frontend `.env.production`
- ✅ Postavljen na `/api` (relative path za nginx proxy)

### 2. Security Files
- [ ] `.gitignore` uključuje `.env` fajlove
- [ ] `.gitignore` uključuje `nginx/ssl/` folder
- [ ] Proveri da `backend/.env` **NIJE** u Git-u: `git status`

### 3. Docker Files
- ✅ `backend/Dockerfile` - kompajlira .NET projekat
- ✅ `frontend/Dockerfile` - build-uje Next.js
- ✅ `docker-compose.yml` - konfigurisan za produkciju

---

## 📊 Resource Requirements

### Hetzner CX22 (€3.79/month)
- ✅ **2 vCPU** - dovoljno
- ✅ **4 GB RAM** - OK (može dodati swap ako treba)
- ✅ **40 GB SSD** - više nego dovoljno
- ✅ **Lokacija:** Falkenstein (DE) - najbliže Srbiji

### Očekivana Potrošnja
- Backend: ~200-300 MB RAM
- Frontend: ~150-250 MB RAM
- Nginx: ~20-50 MB RAM
- Docker overhead: ~100 MB
- **UKUPNO: ~500-700 MB** (ostaje 3+ GB slobodno)

---

## 📋 Deployment Plan

### Faza 1: Server Setup (30 min)
1. Kreiraj Hetzner VPS
2. SSH konfiguracija
3. Bezbednost: firewall, fail2ban, ne-root user
4. Instalacija Docker-a

### Faza 2: App Upload (15 min)
1. Upload projekta (Git ili SCP)
2. Edituj `backend/.env` sa jakim lozinkama
3. Proveri sve fajlove

### Faza 3: Docker Deploy (10 min)
1. `docker compose build`
2. `docker compose up -d`
3. Proveri logove
4. Testiraj HTTP pristup

### Faza 4: SSL Setup (20 min)
1. Certbot instalacija
2. Let's Encrypt sertifikat
3. Nginx SSL konfiguracija
4. HTTPS redirect
5. Auto-renewal cron job

### Faza 5: Testing (15 min)
1. Frontend test
2. Admin login test
3. API test
4. Email test (test narudžbina)

**UKUPNO: ~90 minuta**

---

## 🔐 Kritični Security Checks

Pre go-live, proveri:

### Server Level
- [ ] SSH: root login disabled, key-only auth
- [ ] Firewall: samo 22, 80, 443 otvoreni
- [ ] Fail2Ban: aktivan
- [ ] System: ažuriran

### App Level
- [ ] JWT_SECRET: min 48 karaktera, random
- [ ] ADMIN_PASSWORD: min 20 karaktera, jak
- [ ] Portovi 3000/5002: **NISU** javno dostupni
- [ ] Admin endpoints: zaštićeni sa JWT

### SSL/HTTPS
- [ ] Let's Encrypt sertifikat: validan
- [ ] HTTP → HTTPS redirect: aktivan
- [ ] SSL Labs test: A ili A+

### Database
- [ ] SQLite baza: van web root-a
- [ ] Backup strategija: definisana
- [ ] Volume persist: `backend-data` mapiran

---

## 📚 Dokumentacija Spremna

Kreirani su sledeći guide-ovi:

1. **HETZNER_DEPLOYMENT.md** - Step-by-step vodič za deployment
   - Kreiranje VPS-a
   - Server bezbednost
   - Docker instalacija
   - SSL setup
   - Troubleshooting

2. **PRODUCTION_SECURITY_CHECKLIST.md** - Detaljni security checklist
   - 12 sekcija pokrivaju sve aspekte
   - 100+ check items
   - Komande za verifikaciju

3. **DEPLOYMENT_GUIDE.md** - Opšti deployment vodič (već postojao)

---

## 🎯 Jednostavan Deploy (Za Hetzner)

### Quick Start sa SSH

```bash
# 1. Konektuj se na server
ssh root@YOUR_SERVER_IP

# 2. Kreiraj admin korisnika i konfigurisi bezbednost
adduser vlkuadmin
usermod -aG sudo vlkuadmin

# 3. Instaliraj Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker vlkuadmin

# 4. Setup firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 5. Instaliraj fail2ban
apt install -y fail2ban
systemctl enable fail2ban

# 6. Upload aplikacije (sa vašeg Windows računara)
# PowerShell:
scp -r "C:\Users\Nikola Kostic\Documents\Projects\poglavlje-vlku\*" vlkuadmin@YOUR_SERVER_IP:~/poglavlje-vlku/

# 7. Deploy
ssh vlkuadmin@YOUR_SERVER_IP
cd ~/poglavlje-vlku
docker compose up -d --build

# 8. SSL (nakon što DNS pokazuje na server)
sudo apt install certbot
sudo certbot certonly --standalone -d vas-domen.com -d www.vas-domen.com
# Kopiraj certs i omogući HTTPS u nginx.conf
docker compose restart nginx
```

---

## 🆘 Najčešći Problemi

### "Cannot connect to server"
- Proveri da li je firewall otvorio port 80/443
- `sudo ufw status`

### "Docker command not found"
- Logout i login ponovo nakon instalacije
- Ili: `newgrp docker`

### "SSL certificate not working"
- Proveri da DNS pokazuje na server IP: `nslookup vas-domen.com`
- Čekaj 1h za DNS propagaciju

### "Out of memory"
- Dodaj swap: 
  ```bash
  sudo fallocate -l 2G /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  ```

### "Email not sending"
- Gmail App Password: https://myaccount.google.com/apppasswords
- Proveri `backend/.env` SMTP credentials

---

## ✅ Final Checklist Pre Deploy

- [ ] Backup lokalnog projekta
- [ ] `backend/.env` ima jake lozinke
- [ ] `.gitignore` blokira sensitive files
- [ ] Docker files su testirani lokalno: `docker compose up`
- [ ] Hetzner VPS kreiran
- [ ] Domen kupljen i DNS konfigurisan (opciono)
- [ ] Pročitali ste **HETZNER_DEPLOYMENT.md**
- [ ] Spremni ste posvetiti ~90 minuta za deployment

---

## 🎉 Kada SVE Radi

Testirajte:
1. **Frontend:** https://vas-domen.com
2. **Admin Login:** https://vas-domen.com/admin
3. **API:** `curl https://vas-domen.com/api/books`
4. **SSL:** https://www.ssllabs.com/ssltest/

Ako svi testovi prolaze ✅ - **LIVE STE!** 🚀

---

## 📞 Pomoć

Ako zapnete:
1. Proverite logove: `docker compose logs`
2. Pogledajte **PRODUCTION_SECURITY_CHECKLIST.md** troubleshooting sekciju
3. Hetzner support: support@hetzner.com

**Sreća sa deploymentom! 🚀📚**
