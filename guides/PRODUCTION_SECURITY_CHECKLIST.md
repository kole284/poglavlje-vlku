# 🔐 Production Security Checklist
## Pre-Launch Security Verification za Poglavlje Vlku

---

## 📋 Korišćenje Ovog Checklista

Pre nego što pustite sajt u produkciju, prođite kroz **SVE** stavke ispod i označite ✅ kada su završene.

**VAŽNO:** Ne preskačite ni jednu stavku - svaka je kritična za bezbednost!

---

## 🛡️ 1. Server Bezbednost

### 1.1 SSH Access
- [ ] Root login je **onemogućen** (`PermitRootLogin no` u `/etc/ssh/sshd_config`)
- [ ] Password authentication je **onemogućeno** (samo SSH keys)
- [ ] SSH radi samo na portu 22 sa SSH key autentikacijom
- [ ] SSH private key je **sigurno sačuvan** offline (ne na serveru!)
- [ ] Koristite **ne-root** korisnika za sve operacije

**Provera:**
```bash
sudo grep "PermitRootLogin" /etc/ssh/sshd_config
# Trebalo bi: PermitRootLogin no

sudo grep "PasswordAuthentication" /etc/ssh/sshd_config
# Trebalo bi: PasswordAuthentication no
```

### 1.2 Firewall (UFW)
- [ ] UFW je **aktivan** i konfigurisan
- [ ] Port 22 (SSH) dozvoljen
- [ ] Port 80 (HTTP) dozvoljen
- [ ] Port 443 (HTTPS) dozvoljen
- [ ] **SVI OSTALI PORTOVI BLOKIRANI** (5002, 3000 ne smeju biti javno dostupni!)

**Provera:**
```bash
sudo ufw status

# Očekivani output:
# Status: active
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

**KRITIČNO:** Proverite da portovi 3000 i 5002 **NISU** dostupni spolja:
```bash
# Iz drugog terminala ili svog računara:
curl http://YOUR_SERVER_IP:3000
# Trebalo bi: Connection refused ili timeout

curl http://YOUR_SERVER_IP:5002
# Trebalo bi: Connection refused ili timeout
```

### 1.3 Fail2Ban (Brute-Force Protection)
- [ ] Fail2Ban je instaliran i aktivan
- [ ] SSH jail enabled (max 5 pokušaja u 10 minuta)
- [ ] Ban time postavljen na minimum 1h

**Provera:**
```bash
sudo systemctl status fail2ban

sudo fail2ban-client status sshd
```

### 1.4 Sistem Ažuriran
- [ ] Operativni sistem je **potpuno ažuriran**
- [ ] Automatska bezbedonosna ažuriranja omogućena

**Provera:**
```bash
sudo apt update
sudo apt upgrade -y

# Omogući automatska sigurnosna ažuriranja
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 🔑 2. Aplikaciona Bezbednost

### 2.1 Environment Variables (Backend)

**KRITIČNO:** Proverite `backend/.env` fajl:

- [ ] `JWT_SECRET` je **najmanje 32 karaktera** random string
- [ ] `JWT_SECRET` **NIJE** default vrednost
- [ ] `ADMIN_PASSWORD` je **jaka lozinka** (min 20 karaktera, specijalni karakteri)
- [ ] `ADMIN_PASSWORD` **NIJE** "admin", "password", ili bilo šta očigledno
- [ ] `SMTP_PASSWORD` je **App Password** (ne Gmail lozinka)
- [ ] `ASPNETCORE_ENVIRONMENT=Production`

**Provera:**
```bash
cd ~/poglavlje-vlku

# Proveri JWT_SECRET (NE sme biti short ili default)
grep "JWT_SECRET" backend/.env

# Proveri admin password (NE sme biti slab)
grep "ADMIN_PASSWORD" backend/.env

# Proveri environment
grep "ASPNETCORE_ENVIRONMENT" backend/.env
```

**Generator jakih lozinki:**
```bash
# Generiši jaku admin lozinku (32 karaktera)
openssl rand -base64 24

# Generiši JWT secret (48 karaktera)
openssl rand -base64 36
```

### 2.2 JWT Konfiguracija

- [ ] JWT tokeni ističu nakon razumnog vremena (8h je OK)
- [ ] JWT Issuer i Audience su postavljeni
- [ ] JWT secret je sačuvan offline (backup!)

**Provera:**
```bash
# Testiraj login API
curl -X POST https://vas-domen.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"VAŠA_LOZINKA"}'

# Trebalo bi da dobijete:
# {"token":"eyJhbGciOi..."}
```

### 2.3 CORS Konfiguracija

- [ ] CORS je konfigurisan SAMO za vaš domen (ne `*` wildcard)
- [ ] CORS dozvoljava samo potrebne metode (GET, POST, PUT, DELETE)

**Provera u nginx.conf:**
```bash
grep "Access-Control-Allow-Origin" ~/poglavlje-vlku/nginx/nginx.conf
```

**POŽELJNO:** Uklonite `*` wildcard i zamenite sa vašim domenom:
```nginx
# add_header 'Access-Control-Allow-Origin' '*' always;  # ❌ LOŠE!
add_header 'Access-Control-Allow-Origin' 'https://vas-domen.com' always;  # ✅ DOBRO!
```

### 2.4 Admin Credentials

- [ ] Admin username **NIJE** "admin" (opciono, ali preporuka)
- [ ] Admin password je **jak** (min 20 karaktera)
- [ ] Admin credentials su **sigurno sačuvani** offline
- [ ] Admin password je **DRUGAČIJI** od bilo koje druge lozinke koju koristite

**JAKO VAŽNO:** Admin pristup je **kritičan** - može dodavati/brisati knjige, upravlja cijenama!

---

## 🔒 3. SSL/HTTPS

### 3.1 SSL Sertifikat
- [ ] Let's Encrypt SSL sertifikat je generisan
- [ ] Sertifikat je validan za vaš domen
- [ ] Sertifikat je kopiran u `nginx/ssl/`
- [ ] Nginx koristi `fullchain.pem` i `privkey.pem`
- [ ] SSL se automatski obnavlja (cron job postavljen)

**Provera:**
```bash
# Proveri sertifikat fajlove
ls -la ~/poglavlje-vlku/nginx/ssl/
# Trebalo bi: fullchain.pem i privkey.pem

# Proveri validnost sertifikata
sudo certbot certificates

# Proveri cron job
sudo crontab -l | grep certbot
```

### 3.2 HTTPS Redirect
- [ ] HTTP (port 80) **automatski preusmjerava** na HTTPS (port 443)
- [ ] Direktan pristup na port 80 **ne funkcioniše**

**Provera:**
```bash
# Testiraj HTTP redirect
curl -I http://vas-domen.com
# Trebalo bi: Location: https://vas-domen.com

# Testiraj HTTPS
curl -I https://vas-domen.com
# Trebalo bi: HTTP/2 200
```

### 3.3 SSL Configuration
- [ ] TLS 1.2 i TLS 1.3 **omogućeni**
- [ ] TLS 1.0 i TLS 1.1 **onemogućeni** (stari, nesigurni)
- [ ] Jaki ciphers konfigurisani

**Provera u nginx.conf:**
```bash
grep "ssl_protocols" ~/poglavlje-vlku/nginx/nginx.conf
# Trebalo bi: ssl_protocols TLSv1.2 TLSv1.3;
```

**Online SSL Test:**
https://www.ssllabs.com/ssltest/analyze.html?d=vas-domen.com
- **Cilj: A ili A+ ocjena**

---

## 🐳 4. Docker Bezbednost

### 4.1 Docker Containers
- [ ] Svi kontejneri su **running** (`docker compose ps`)
- [ ] Kontejneri se automatski restartuju (`restart: unless-stopped`)
- [ ] Portovi 3000 i 5002 **nisu izloženi** javno (samo kroz nginx)

**Provera:**
```bash
docker compose ps
# Trebalo bi:
# poglavlje-vlku-backend       Up
# poglavlje-vlku-frontend      Up
# poglavlje-vlku-nginx         Up

# Proveri da interno rade:
docker compose exec backend curl -I http://localhost:5002/health
docker compose exec frontend curl -I http://localhost:3000
```

### 4.2 Docker Volumes
- [ ] SQLite baza je **persistentna** (volume `backend-data`)
- [ ] Logovi su persistentni (volume `backend-logs`)
- [ ] Volumes imaju **backup strategiju**

**Provera:**
```bash
docker volume ls
# Trebalo bi:
# poglavlje-vlku_backend-data
# poglavlje-vlku_backend-logs

# Proveri da baza postoji
docker compose exec backend ls -la /app/data/
# Trebalo bi: books.db
```

### 4.3 Docker Network
- [ ] Services komuniciraju kroz **izolovanu Docker mrežu** (`app-network`)
- [ ] Frontend koristi `http://backend:5002/api` (interni DNS)

**Provera:**
```bash
docker network ls | grep app-network
```

---

## 📧 5. Email Konfiguracija (SMTP)

### 5.1 Gmail SMTP
- [ ] Gmail App Password je generisan (ne koristite običnu lozinku!)
- [ ] SMTP credentials su postavljeni u `backend/.env`
- [ ] Test email se uspješno šalje

**Generator App Password:**
1. Idite na: https://myaccount.google.com/apppasswords
2. Selektujte "Mail" i "Other (Custom name)"
3. Ime: "Poglavlje Vlku Bookstore"
4. Kliknite "Generate"
5. Kopirajte 16-char password (npr. `abcd efgh ijkl mnop`)

**Provera:**
```bash
# Testiraj email slanje (iz admin panela napravi test porudžbinu)
# ili proveri backend logove kada korisnik kupi knjigu:
docker compose logs backend | grep -i smtp
```

---

## 💾 6. Baza Podataka

### 6.1 SQLite Bezbednost
- [ ] Baza je **van** web root-a (`/app/data/books.db`)
- [ ] Baza **nije** dostupna preko weba
- [ ] Baza ima **backup** strategiju

**Provera:**
```bash
# Pokušaj pristupiti bazi preko weba (trebalo bi da ne radi!)
curl https://vas-domen.com/data/books.db
# Očekivano: 404 Not Found

# Proveri da baza postoji na serveru
docker compose exec backend ls -la /app/data/
```

### 6.2 Database Backup
- [ ] Imate **automated backup** skriptu
- [ ] Backups se **download-uju offline** barem jednom sedmično
- [ ] Testirani ste **restore** proceduru

**Kreiranje backupa:**
```bash
# Manual backup
docker compose exec backend cp /app/data/books.db /app/data/books-backup-$(date +%Y%m%d).db

# Preuzmi na lokalni računar (iz PowerShell-a)
scp vlkuadmin@YOUR_SERVER_IP:~/poglavlje-vlku/backend/data/books-backup-*.db ./backups/
```

**Automatski backup (svaki dan u 2h ujutru):**
```bash
# Dodaj cron job
crontab -e
```
Dodaj liniju:
```
0 2 * * * docker exec poglavlje-vlku-backend cp /app/data/books.db /app/data/books-backup-$(date +\%Y\%m\%d).db
```

---

## 🚀 7. Performance i Resursi

### 7.1 Server Resources (CX22)
- [ ] CPU usage < 70% u proseku
- [ ] RAM usage < 80% u proseku
- [ ] Disk usage < 70%

**Provera:**
```bash
# CPU i RAM
htop
# ili
docker stats

# Disk
df -h
```

**Ako imate problema sa RAM-om:**
```bash
# Dodaj 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 7.2 Frontend Performance
- [ ] Next.js production build je optimizovan
- [ ] Images su kompresirane
- [ ] Gzip compression je omogućen u nginx

**Provera:**
```bash
# Proveri gzip
curl -I -H "Accept-Encoding: gzip" https://vas-domen.com
# Trebalo bi: Content-Encoding: gzip
```

---

## 🌐 8. Domen i DNS

### 8.1 DNS Configuration
- [ ] A record pokazuje na server IP
- [ ] WWW subdomen takođe radi
- [ ] DNS propagacija je završena (testirajte sa https://dnschecker.org)

**Provera:**
```bash
# Proveri DNS
nslookup vas-domen.com
dig vas-domen.com
```

### 8.2 Domain Security
- [ ] Domain registrar account ima **2FA** (two-factor authentication)
- [ ] Domain auto-renew je **omogućen**
- [ ] Registrar email je **bezbedan**

---

## 📊 9. Monitoring i Logging

### 9.1 Logovi
- [ ] Backend logovi su dostupni (`docker compose logs backend`)
- [ ] Frontend logovi su dostupni (`docker compose logs frontend`)
- [ ] Nginx access i error logovi su dostupni

**Provera:**
```bash
# Proveri logove
docker compose logs backend --tail 50
docker compose logs frontend --tail 50
docker compose logs nginx --tail 50
```

### 9.2 Health Checks
- [ ] `/health` endpoint radi
- [ ] Backend API radi (`/api/auth/login`)
- [ ] Frontend loading correctly

**Provera:**
```bash
curl https://vas-domen.com/health
# Očekivano: OK

curl https://vas-domen.com/api/books
# Očekivano: JSON array knjiga
```

---

## 🧪 10. Funkcionalno Testiranje

### 10.1 Frontend
- [ ] Homepage se učitava (`/`)
- [ ] Books page prikazuje knjige (`/books`)
- [ ] Cart funkcioniše (`/cart`)
- [ ] Checkout page radi (`/checkout`)
- [ ] Order confirmation prikazuje se nakon kupovine

### 10.2 Admin Panel
- [ ] Admin login radi (`/admin`)
- [ ] JWT autentikacija funkcioniše
- [ ] Može dodati novu knjigu
- [ ] Može editovati postojeću knjigu
- [ ] Može obrisati knjigu
- [ ] Logout radi

**Test Scenario:**
1. Idite na `https://vas-domen.com/admin`
2. Ulogujte se sa admin credentials
3. Dodajte test knjigu
4. Edituje je
5. Obrišite je
6. Logout

### 10.3 API Endpoints
- [ ] `POST /api/auth/login` - vraća JWT token
- [ ] `GET /api/books` - vraća listu knjiga
- [ ] `POST /api/books` - kreira knjigu (samo sa JWT)
- [ ] `PUT /api/books/{id}` - update knjige (samo sa JWT)
- [ ] `DELETE /api/books/{id}` - briše knjigu (samo sa JWT)
- [ ] `POST /api/purchases` - kreira porudžbinu

**Provera bez tokena (trebalo bi 401 Unauthorized):**
```bash
curl -X POST https://vas-domen.com/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'

# Očekivano: 401 Unauthorized
```

**Provera sa tokenom (trebalo bi 201 Created):**
```bash
# Prvo dobij token
TOKEN=$(curl -s -X POST https://vas-domen.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"VAŠA_LOZINKA"}' | jq -r '.token')

# Koristi token
curl -X POST https://vas-domen.com/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "price": 100,
    "description": "Test",
    "category": "Test",
    "imageUrl": "test.jpg"
  }'

# Očekivano: 201 Created
```

### 10.4 Email Slanje
- [ ] Kupovina šalje email prodavcu
- [ ] Email stiže u inbox (proveri spam folder!)
- [ ] Email sadrži detalje porudžbine

**Test:**
1. Idite na frontend
2. Dodajte knjigu u korpu
3. Checkout sa test podacima
4. Proverite da li je stigao email na `poglavljevlkushop@gmail.com`

---

## 🛡️ 11. Security Best Practices

### 11.1 Credentials Management
- [ ] **SVE** lozinke su sačuvane **offline** u sigurnom fajlu (ne na serveru!)
- [ ] Backup credentials fajl je **enkriptovan** (npr. sa VeraCrypt, 7-Zip AES)
- [ ] Niste podelili credentials ni sa kim
- [ ] Credentials nisu u Git repozitorijumu

### 11.2 Git Security
- [ ] `.env` fajlovi su u `.gitignore`
- [ ] Backend `.env` fajl **NIJE** u Git-u
- [ ] Frontend `.env.production` **NIJE** u Git-u
- [ ] SSL private key **NIJE** u Git-u

**Provera:**
```bash
# Proveri da li .env fajlovi postoje u Git-u (trebalo bi da NE postoje!)
git ls-files | grep -E '\.env$|\.env\.production$'
```

### 11.3 File Permissions
- [ ] SSL private key ima `600` permissions (samo owner može čitati)
- [ ] `.env` fajlovi imaju `600` permissions

**Provera:**
```bash
ls -la ~/poglavlje-vlku/nginx/ssl/privkey.pem
# Trebalo bi: -rw------- (600)

ls -la ~/poglavlje-vlku/backend/.env
# Trebalo bi: -rw------- (600)

# Ako nisu, popravi:
chmod 600 ~/poglavlje-vlku/nginx/ssl/privkey.pem
chmod 600 ~/poglavlje-vlku/backend/.env
```

### 11.4 Regular Updates
- [ ] Imate plan za **redovna ažuriranja** (minimum mjesečno)
- [ ] Pratirate security advisory-je za .NET, Next.js, Docker

**Mjesečni checklist:**
```bash
# Ažuriraj server pakete
sudo apt update && sudo apt upgrade -y

# Ažuriraj Docker images
cd ~/poglavlje-vlku
docker compose pull
docker compose up -d --build

# Proveri koga je obnovljen SSL sertifikat
sudo certbot certificates
```

---

## ✅ 12. Final Go-Live Checklist

Pre nego što kažete "Gotovo!" i krenete sa marketingom:

- [ ] **SVI** stavke iznad su ✅ označene
- [ ] Testirano je na **minimum 3 različita browsera** (Chrome, Firefox, Safari/Edge)
- [ ] Testirano je na **mobilnom** telefonu
- [ ] **3 test porudžbine** su uspješno kreirane
- [ ] **3 test emaila** su stigla
- [ ] Admin panel je testiran **2 puta potpuno**
- [ ] Postoji **backup baze** i sačuvan je offline
- [ ] Svi **credentials su sačuvani** i enkriptovani
- [ ] SSL sertifikat ima **A ocjena** na ssllabs.com
- [ ] Server **monitoring** je postavljen (optional: Uptime Robot, Pingdom)
- [ ] Imate **plan za support** (email, telefon?)

---

## 🎉 Kada su SVI checkboxes ✅...

**ČESTITAMO! Vaša aplikacija je bezbedna i spremna za produkciju!** 🚀

### Šta Dalje?

1. **Marketing:** Promoviši svoj bookstore!
2. **Monitoring:** Pratite logove prvih dana
3. **Support:** Budite dostupni za pitanja korisnika
4. **Backup:** Ne zaboravite redovne backupe!

---

## 📞 Hetzner Support (Ako treba pomoć)

- **Email:** support@hetzner.com
- **Telefon:** +49 9831 5050 (DE, EN)
- **Docs:** https://docs.hetzner.com/

---

## 📝 Konačna Napomena

**Bezbednost nije jednokratna stvar - to je kontinuirani process!**

Minimalno jednom mjesečno:
- Ažurirajte sistem
- Proverite logove
- Napravite backup
- Proverite SSL sertifikat
- Pregledajte Fail2Ban ban liste

**Budite bezbijedni! 🔐**
