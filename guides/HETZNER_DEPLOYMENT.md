# 🔐 Hetzner Deployment Guide - €3.5/Month VPS
## Bezbedno postavljanje Poglavlje Vlku na najjeftiniji Hetzner paket

---

## 📊 VPS Specifikacije (Hetzner CX22)

**Cena:** €3.79/mesečno (€3.19 bez PDV-a)
**Specifikacije:**
- 2 vCPU (Intel/AMD)
- 4 GB RAM
- 40 GB SSD
- 20 TB promet
- 1 IPv4 + 1 IPv6

**Dovoljno za:** Malu do srednju e-commerce aplikaciju (100-500 posetilaca dnevno)

---

## 🚀 Korak 1: Kreiranje Hetzner VPS-a

### 1.1 Otvorite Hetzner Account
1. Idite na https://www.hetzner.com
2. Registrujte se (treba Visa/Mastercard)
3. Ulogujte se u Hetzner Cloud Console: https://console.hetzner.cloud

### 1.2 Kreirajte Projekat
1. Kliknite **"New Project"**
2. Ime: `poglavlje-vlku-bookstore`

### 1.3 Kreirajte Server
1. U projektu kliknite **"Add Server"**
2. **Location:** Falkenstein (DE) - najbliže Srbiji
3. **Image:** Ubuntu 22.04
4. **Type:** Shared vCPU → **CX22** (€3.79/month)
5. **Networking:** 
   - ✅ Public IPv4
   - ✅ Public IPv6
6. **SSH Keys:** 
   - **VAŽNO:** Kliknite "Add SSH Key" i dodajte svoj javni ključ
   - Ako nemate SSH ključ, pogledajte [Kreiranje SSH ključa](#a1-kreiranje-ssh-ključa)
7. **Firewalls:** Ostavite prazno (konfigurisaćemo ručno)
8. **Backups:** Opciono (+20% cene = €0.76/mesec)
9. **Volumes:** Ne treba
10. **Name:** `vlku-bookstore-prod`
11. Kliknite **"Create & Buy Now"**

**⏰ Čekajte 30-60 sekundi dok se server kreira...**

### 1.4 Pronađite IP Adresu
Nakon kreiranja, videćete:
- **IPv4:** npr. `157.230.123.45`
- **IPv6:** npr. `2a01:4f8:...`

**📝 Kopirajte IPv4 adresu** - koristićete je kasnije!

---

## 🔐 Korak 2: Inicijalna Bezbednost (KRITIČNO!)

### 2.1 Prva Konekcija

Otvorite PowerShell:

```powershell
# Zamenite YOUR_SERVER_IP sa stvarnom IP adresom
ssh root@YOUR_SERVER_IP
```

Primer:
```powershell
ssh root@157.230.123.45
```

### 2.2 Ažurirajte Sistem

```bash
# Ažurirajte sve pakete
apt update && apt upgrade -y

# Instalirajte osnovne alate
apt install -y curl wget git ufw fail2ban
```

### 2.3 Kreirajte Admin Korisnika (NE koristite root!)

```bash
# Kreirajte novog korisnika
adduser vlkuadmin

# Dodajte korisnika u sudo grupu
usermod -aG sudo vlkuadmin

# Kopirajte SSH ključeve za novog korisnika
mkdir -p /home/vlkuadmin/.ssh
cp /root/.ssh/authorized_keys /home/vlkuadmin/.ssh/
chown -R vlkuadmin:vlkuadmin /home/vlkuadmin/.ssh
chmod 700 /home/vlkuadmin/.ssh
chmod 600 /home/vlkuadmin/.ssh/authorized_keys
```

### 2.4 Onemogućite Root Login preko SSH

```bash
# Editujte SSH konfiguraciju
nano /etc/ssh/sshd_config
```

Pronađite i izmenite sledeće linije:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Sačuvajte (Ctrl+O, Enter) i izađite (Ctrl+X).

```bash
# Restartujte SSH servis (Ubuntu 22.04 koristi 'ssh' umesto 'sshd')
systemctl restart ssh
```

### 2.5 Konfigurisanje Firewall-a

```bash
# Dozvolite SSH (port 22)
ufw allow 22/tcp

# Dozvolite HTTP (port 80)
ufw allow 80/tcp

# Dozvolite HTTPS (port 443)
ufw allow 443/tcp

# Omogućite firewall
ufw --force enable

# Proverite status
ufw status
```

Očekivani output:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### 2.6 Konfigurisanje Fail2Ban (Zaštita od brute-force napada)

```bash
# Kreirajte Fail2Ban konfiguraciju
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log
EOF

# Restartujte Fail2Ban
systemctl restart fail2ban
systemctl enable fail2ban
```

### 2.7 Izlogujte se i Povežite se kao novi korisnik

```powershell
# Izađite iz root sesije
exit

# Povežite se kao vlkuadmin
ssh vlkuadmin@YOUR_SERVER_IP
```

**🎉 Odlično! Server je sada bezbedniji.**

---

## 🐳 Korak 3: Instalacija Docker-a

```bash
# Dodajte Docker GPG ključ
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Dodajte Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalirajte Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Dodajte korisnika u docker grupu
sudo usermod -aG docker $USER

# Primenite promene
newgrp docker

# Proverite instalaciju
docker --version
docker compose version
```

Očekivani output:
```
Docker version 27.x.x
Docker Compose version v2.x.x
```

---

## 📦 Korak 4: Postavljanje Aplikacije

### 4.1 Kreirajte Direktorijum za Projekat

```bash
# Kreirajte direktorijum
mkdir -p ~/poglavlje-vlku
cd ~/poglavlje-vlku
```

### 4.2 Upload Fajlova na Server

**Opcija A: Git (Ako imate GitHub/GitLab repo)**

```bash
# Klonirajte repozitorijum
git clone https://github.com/YOUR_USERNAME/poglavlje-vlku.git .
```

**Opcija B: SCP (Sa vašeg Windows računara)**

Otvorite PowerShell u folderu projekta:

```powershell
# Navigirajte do projekta
cd "C:\Users\Nikola Kostic\Documents\Projects\poglavlje-vlku"

# Uploadujte projekat (zamenite YOUR_SERVER_IP)
scp -r * vlkuadmin@YOUR_SERVER_IP:~/poglavlje-vlku/
```

⏰ Ovo može trajati 2-5 minuta zavisno od internet konekcije.

### 4.3 Proverite Uploadovane Fajlove

```bash
# Proverite strukturu
ls -la ~/poglavlje-vlku

# Trebalo bi da vidite:
# backend/
# frontend/
# nginx/
# docker-compose.yml
# deploy.sh
```

---

## 🔑 Korak 5: Bezbedna Konfiguracija Environment Varijabli

### 5.1 Generiši Jake Lozinke

```bash
# Generiši jaku lozinku za admina (32 karaktera)
openssl rand -base64 24

# Generiši jaku JWT tajnu (48 karaktera)
openssl rand -base64 36
```

**📝 Kopirajte ove vrednosti - koristićete ih odmah!**

### 5.2 Konfigurisanje Backend .env

```bash
# Editujte backend .env fajl
nano ~/poglavlje-vlku/backend/.env
```

**KRITIČNO: Promenite sledeće vrednosti:**

```dotenv
# SMTP Configuration - PROVERI OVO! ✅
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENABLE_SSL=true
SMTP_USERNAME=poglavljevlkucustomer@gmail.com
SMTP_PASSWORD=nxhs cbzq eeep cxdn  # ✅ Ovo je već postavljeno, ali proveri da li je ispravan
SMTP_FROM=poglavljevlkucustomer@gmail.com
SMTP_TO=poglavljevlkushop@gmail.com

# Database Configuration
CONNECTION_STRING=Data Source=/app/data/books.db

# Application Settings
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5002

# JWT Configuration - KRITIČNO: PROMENI OVO! 🔐
JWT_SECRET=UPOTREBI_VREDNOST_IZ_openssl_rand_-base64_36
JWT_ISSUER=PoglavljeVlku
JWT_AUDIENCE=PoglavljeVlkuAdmin

# Admin Credentials - KRITIČNO: PROMENI OVO! 🔐
ADMIN_USERNAME=admin
ADMIN_PASSWORD=UPOTREBI_VREDNOST_IZ_openssl_rand_-base64_24
```

**Primer sa pravim vrednostima:**
```dotenv
JWT_SECRET=Xk9P2mL7vQw8Zn3JhR6TfC1BxY4Sg5Np0DqA9Vw2Hu8Kj7Lm3
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YhN4Qp7Xz2Lm9Kj5Rt8Wv3Bx6Fg1
```

**Sačuvajte:** Ctrl+O, Enter, Ctrl+X

### 5.3 Konfigurisanje Frontend .env.production

```bash
# Editujte frontend .env.production
nano ~/poglavlje-vlku/frontend/.env.production
```

```dotenv
# Frontend Production Environment Variables
NEXT_PUBLIC_API_URL=/api

NODE_ENV=production
```

**Sačuvajte:** Ctrl+O, Enter, Ctrl+X

---

## 🌐 Korak 6: Domen (Opciono ali preporučeno)

### 6.1 Kupovina Domena

**Opcije:**
1. **Rnids.rs** - .rs domen (~€25/godišnje)
2. **Namecheap.com** - .com/.net (~$10/godišnje)
3. **Cloudflare** - .com (~$10/godišnje) + gratis CDN

### 6.2 Podešavanje DNS-a

U vašem domen provajderu, kreirajte A rekorde:

```
Type: A
Name: @
Value: YOUR_SERVER_IP (npr. 157.230.123.45)
TTL: 3600

Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

**⏰ DNS propagacija traje 5min - 24h (obično ~1h)**

### 6.3 Ažurirajte Nginx Konfiguraciju

```bash
# Editujte nginx.conf
nano ~/poglavlje-vlku/nginx/nginx.conf
```

Pronađite liniju:
```nginx
server_name localhost;
```

Zamenite sa:
```nginx
server_name vas-domen.com www.vas-domen.com;
```

Primer:
```nginx
server_name poglavljevlku.rs www.poglavljevlku.rs;
```

**Sačuvajte:** Ctrl+O, Enter, Ctrl+X

---

## 🚀 Korak 7: Pokretanje Aplikacije

### 7.1 Build i Start Docker Containers

```bash
cd ~/poglavlje-vlku

# Build i pokreni sve servise
docker compose up -d --build
```

**⏰ Ovo će trajati 5-10 minuta za prvi build.**

**Šta se dešava:**
- ⚙️ Backend se kompajlira (.NET projekat)
- 📦 Frontend se builda (Next.js)
- 🌐 Nginx se podiže kao reverse proxy
- 💾 SQLite baza se kreira

### 7.2 Proverite Status

```bash
# Proverite da li kontejneri rade
docker compose ps
```

Očekivani output:
```
NAME                         STATUS      PORTS
poglavlje-vlku-backend       Up 2 min    0.0.0.0:5002->5002/tcp
poglavlje-vlku-frontend      Up 2 min    0.0.0.0:3000->3000/tcp
poglavlje-vlku-nginx         Up 2 min    0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

### 7.3 Proverite Logove

```bash
# Proverite logove svih servisa
docker compose logs -f

# Ili pojedinačno:
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
```

Za izlaz iz logova pritisnite: **Ctrl+C**

---

## 🔒 Korak 8: SSL/HTTPS Sertifikat (BESPLATAN!)

### 8.1 Instalirajte Certbot

```bash
# Instalirajte Certbot
sudo apt install -y certbot
```

### 8.2 Zaustavite Nginx Privremeno

```bash
# Zaustavite nginx kontejner
docker compose stop nginx
```

### 8.3 Generiši Let's Encrypt Sertifikat

```bash
# Zamenite vas-domen.com sa pravim domenom
sudo certbot certonly --standalone -d vas-domen.com -d www.vas-domen.com
```

**Primer:**
```bash
sudo certbot certonly --standalone -d poglavljevlku.rs -d www.poglavljevlku.rs
```

**Odgovorite na pitanja:**
- Email: vaš-email@gmail.com
- Agree to Terms: Y
- Share email: N (opciono)

**✅ Uspešno! Sertifikati su kreirani u:**
```
/etc/letsencrypt/live/vas-domen.com/fullchain.pem
/etc/letsencrypt/live/vas-domen.com/privkey.pem
```

### 8.4 Kopirajte Sertifikate u Nginx Folder

```bash
# Kreirajte ssl folder
mkdir -p ~/poglavlje-vlku/nginx/ssl

# Kopirajte sertifikate
sudo cp /etc/letsencrypt/live/vas-domen.com/fullchain.pem ~/poglavlje-vlku/nginx/ssl/
sudo cp /etc/letsencrypt/live/vas-domen.com/privkey.pem ~/poglavlje-vlku/nginx/ssl/

# Promenite vlasništvo
sudo chown -R $USER:$USER ~/poglavlje-vlku/nginx/ssl
```

### 8.5 Aktivirajte HTTPS u Nginx

```bash
# Editujte nginx.conf
nano ~/poglavlje-vlku/nginx/nginx.conf
```

**1. Odkomentirajte HTTP → HTTPS redirect (linija ~38):**
```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name vas-domen.com www.vas-domen.com;
    return 301 https://$server_name$request_uri;
}
```

**2. Odkomentirajte HTTPS server (linija ~90):**
```nginx
# HTTPS server
server {
    listen 443 ssl http2;
    server_name vas-domen.com www.vas-domen.com;

    # SSL certificate files
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Frontend - Next.js app
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

**3. Zakomentirajte ili obrišite stari HTTP server (linija ~45) koji ne radi redirect**

**Sačuvajte:** Ctrl+O, Enter, Ctrl+X

### 8.6 Restartujte Nginx sa SSL-om

```bash
cd ~/poglavlje-vlku

# Restartujte sve servise
docker compose down
docker compose up -d
```

### 8.7 Proverite HTTPS

Otvorite browser:
```
https://vas-domen.com
```

**✅ Trebalo bi da vidite zelenu katanac ikonu!**

### 8.8 Automatsko Obnavljanje Sertifikata

Let's Encrypt sertifikati ističu posle 90 dana. Podesi automatsko obnavljanje:

```bash
# Dodaj cron job za automatsko obnavljanje
sudo crontab -e
```

Izaberi editor (1 za nano), pa dodaj liniju:
```
0 3 * * * certbot renew --quiet --deploy-hook "cd /home/vlkuadmin/poglavlje-vlku && docker compose restart nginx"
```

**Ovo će proveravati sertifikat svaki dan u 3h ujutru i obnoviti ga ako ističe.**

**Sačuvajte:** Ctrl+O, Enter, Ctrl+X

---

## ✅ Korak 9: Finalne Provere

### 9.1 Testirajte Aplikaciju

1. **Frontend:** https://vas-domen.com
2. **Admin Login:** https://vas-domen.com/admin
   - Username: `admin`
   - Password: `(ono što ste postavili u backend/.env)`

### 9.2 Testirajte API

```bash
# Health check
curl https://vas-domen.com/health

# Login API
curl -X POST https://vas-domen.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"VAŠA_LOZINKA"}'
```

Trebalo bi da dobijete JWT token!

### 9.3 Security Checklist

✅ **Proverite sledeće:**

```bash
# 1. Firewall aktivan?
sudo ufw status

# 2. Fail2Ban radi?
sudo systemctl status fail2ban

# 3. Root login onemogućen?
sudo grep "PermitRootLogin" /etc/ssh/sshd_config
# Trebalo bi: PermitRootLogin no

# 4. Docker kontejneri running?
docker compose ps

# 5. SSL sertifikat validan?
curl -I https://vas-domen.com
# Trebalo bi: HTTP/2 200

# 6. Backend environment varijable set?
docker compose exec backend env | grep JWT_SECRET
# Trebalo bi: JWT_SECRET=vaša-tajna
```

---

## 🏆 Gotovo! Vaša aplikacija je live! 🎉

### Pristup aplikaciji:
- **Prodavnica:** https://vas-domen.com
- **Admin Panel:** https://vas-domen.com/admin

### Admin kredencijali:
- **Username:** admin
- **Password:** (ono što ste postavili u backend/.env)

---

## 📋 Korisne Komande za Održavanje

### Docker Operacije

```bash
# Proverite status
docker compose ps

# Pregledajte logove
docker compose logs -f

# Restartujte sve servise
docker compose restart

# Zaustavi sve servise
docker compose down

# Ponovo pokreni sa rebuild-om
docker compose up -d --build

# Očisti stare Docker slike
docker system prune -a
```

### Backup Baze Podataka

```bash
# Kreiraj backup folder
mkdir -p ~/backups

# Kopiraj SQLite bazu
docker compose exec backend cp /app/data/books.db /app/data/books-backup-$(date +%Y%m%d).db

# Preuzmi backup na lokalni računar (iz PowerShell-a)
scp vlkuadmin@YOUR_SERVER_IP:~/poglavlje-vlku/backend/data/books-backup-*.db ./backups/
```

### Ažuriranje Aplikacije

```bash
cd ~/poglavlje-vlku

# Pull najnoviji kod (ako koristite Git)
git pull

# Rebuild i restart
docker compose down
docker compose up -d --build
```

### Monitoring Resursa

```bash
# Portoeba RAM-a
free -h

# Potrošnja diska
df -h

# Docker resursi
docker stats
```

---

## 🆘 Troubleshooting

### Problem: Docker kontejneri se ne pokreću

```bash
# Proverite logove
docker compose logs

# Proverite port konflikte
sudo netstat -tulpn | grep -E '80|443|3000|5002'
```

### Problem: SMTP email ne radi

1. Gmail zahteva "App Password" umesto običnog passworda
2. Idite na: https://myaccount.google.com/apppasswords
3. Generiši novi app password i kopiraj ga u `backend/.env`

### Problem: SSL sertifikat ne radi

```bash
# Proveri da li su fajlovi kopirani
ls -la ~/poglavlje-vlku/nginx/ssl/

# Proveri Certbot logove
sudo cat /var/log/letsencrypt/letsencrypt.log

# Regeneriši sertifikat
sudo certbot delete --cert-name vas-domen.com
# Pa ponovi korak 8.3
```

### Problem: Nedovoljno RAM-a na CX22 (4GB)

Ako imate problema sa memorijom:

```bash
# Dodaj swap (virtualna memorija)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Učini trajnim
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 💰 Mesečni Troškovi

- **Hetzner CX22 VPS:** €3.79/month
- **Domen (.rs):** ~€2/month (€25/godišnje)
- **SSL Sertifikat:** €0 (Let's Encrypt besplatno)
- **Backup (opciono):** +€0.76/month

**UKUPNO: ~€5.80/month (€4.55 ako koristite IP umesto domena)**

---

## 📚 Dodatni Resursi

- **Hetzner Docs:** https://docs.hetzner.com/
- **Docker Docs:** https://docs.docker.com/
- **Let's Encrypt:** https://letsencrypt.org/
- **Nginx Docs:** https://nginx.org/en/docs/

---

## 🔐 VAŽNO: Čuvajte Sledeće Informacije!

**Kreirajte tekstualni fajl sa:**

```
=== POGLAVLJE VLKU - PRODUCTION CREDENTIALS ===

VPS Server IP: YOUR_SERVER_IP
SSH User: vlkuadmin
SSH Private Key: (čuvajte na sigurnom!)

Admin Panel:
URL: https://vas-domen.com/admin
Username: admin
Password: [VAŠA_JAKA_LOZINKA]

JWT Secret: [VAŠA_JWT_TAJNA]

SMTP:
Username: poglavljevlkucustomer@gmail.com
Password: nxhs cbzq eeep cxdn

Database Location (on server):
~/poglavlje-vlku/backend/data/books.db
```

**Čuvajte ovaj fajl OFFLINE i BEZBEDNO!**

---

## 🎉 Kraj!

Vaša aplikacija je sada bezbedno deployovana na Hetzner VPS-u!

Ako imate bilo kakvih problema, pročitajte [Troubleshooting](#-troubleshooting) sekciju.

**Srećno sa prodajom knjiga! 📚🔥**
