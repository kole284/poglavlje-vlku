# 📘 Deployment Guide - Poglavlje Vlku Bookstore

Kompletan vodič za postavljanje aplikacije na hosting u Srbiji.

---

## 📋 Sadržaj

1. [Pregled Rešenja](#pregled-rešenja)
2. [Preporučeni Hosting Provideri](#preporučeni-hosting-provideri)
3. [Opcije Deployementa](#opcije-deployementa)
4. [Deployment sa Docker-om (Preporučeno)](#deployment-sa-docker-om-preporučeno)
5. [Deployment bez Docker-a](#deployment-bez-docker-a)
6. [SSL Sertifikat (HTTPS)](#ssl-sertifikat-https)
7. [Domen i DNS](#domen-i-dns)
8. [Maintenance i Backup](#maintenance-i-backup)

---

## 🎯 Pregled Rešenja

Vaša aplikacija se sastoji od:
- **Backend**: .NET 10 Web API (port 5002)
- **Frontend**: Next.js 16 (port 3000)
- **Database**: SQLite (lokalna, file-based baza)
- **Reverse Proxy**: Nginx

Pripremio sam **Docker deployment** koji omogućava lako postavljanje cele aplikacije na bilo koji Linux VPS.

---

## 🏢 Preporučeni Hosting Provideri u Srbiji

### 1. **ServerCity** (Najbolja opcija) ⭐
- **Website**: https://www.servercity.rs
- **Cena**: Od ~€10-15/mesečno za VPS
- **Preporuka**: VPS Cloud 2 (2 CPU, 4GB RAM)
- **Prednosti**: 
  - Domaći provider, brza podrška na srpskom
  - Data centar u Beogradu = mala latencija
  - Dobar odnos cene i kvaliteta

### 2. **HostIT**
- **Website**: https://www.hostit.rs
- **Cena**: Od ~€12/mesečno za VPS
- **Preporuka**: VPS Standard (2 CPU, 2GB RAM)
- **Prednosti**: Iskusan provider, dobra stabilnost

### 3. **SBB Hosting**
- **Website**: https://www.hosting.rs
- **Cena**: Od ~€8-10/mesečno
- **Prednosti**: Jeftin, pristojan kvalitet

### 4. **Hetzner** (Nemačka, ali blizu)
- **Website**: https://www.hetzner.com
- **Cena**: Od €4.5/mesečno (CX21)
- **Prednosti**: Izuzetno jeftini, brzi serveri, Falkenstein data centar

### 5. **DigitalOcean** (Internacionalni)
- **Website**: https://www.digitalocean.com
- **Cena**: Od $6/mesečno
- **Prednosti**: Jednostavan, dobre dokumentacije, Frankfurt region

---

## 🚀 Opcije Deployementa

### Opcija 1: Docker Deployment (PREPORUČENO) ✅

**Prednosti:**
- Jednostavna instalacija i održavanje
- Svi servisi izolovani u kontejnerima
- Lako skaliranje i ažuriranje
- Automatski restart servisa

**Nedostaci:**
- Zahteva Docker (lako se instalira)

### Opcija 2: Direktna Instalacija

**Prednosti:**
- Manja potrošnja resursa
- Potpuna kontrola

**Nedostaci:**
- Komplikovanija instalacija
- Teže održavanje

---

## 🐳 Deployment sa Docker-om (Preporučeno)

### Korak 1: Naručite VPS

1. Idite na **ServerCity** (ili drugi provider)
2. Naručite VPS sa:
   - OS: **Ubuntu 22.04 LTS**
   - RAM: Minimum 2GB (preporuka 4GB)
   - Disk: Minimum 20GB SSD
   - CPU: Minimum 2 core

3. Dobićete email sa:
   - IP adresom servera
   - Root lozinkom

### Korak 2: Konektujte se na Server

**Na Windows-u (koristite PowerShell):**
```powershell
ssh root@VAŠA_IP_ADRESA
```

Unesite lozinku kada vas zatraži.

### Korak 3: Instalacija Docker-a

```bash
# Ažurirajte sistem
sudo apt update && sudo apt upgrade -y

# Instalirajte Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalirajte Docker Compose
sudo apt install docker-compose-plugin -y

# Proverite instalaciju
docker --version
docker compose version
```

### Korak 4: Instalirajte Git

```bash
sudo apt install git -y
```

### Korak 5: Preuzmite Kod Aplikacije

**Opcija A: Ako koristite GitHub/GitLab**
```bash
cd /opt
git clone https://github.com/VAŠE_KORISNIČKO_IME/poglavlje-vlku.git
cd poglavlje-vlku
```

**Opcija B: Manuelni upload (bez Git-a)**
```bash
# Na lokalnom računaru (PowerShell):
# Prvo kompresujte projekat
Compress-Archive -Path "C:\Users\Nikola Kostic\Documents\Projects\poglavlje-vlku\*" -DestinationPath poglavlje-vlku.zip

# Zatim upload-ujte na server
scp poglavlje-vlku.zip root@VAŠA_IP_ADRESA:/opt/

# Na serveru:
cd /opt
unzip poglavlje-vlku.zip
mv poglavlje-vlku-main poglavlje-vlku  # Ako je potrebno
cd poglavlje-vlku
```

### Korak 6: Konfiguracija Environment Varijabli

```bash
# Uredite frontend .env.production
nano frontend/.env.production
```

Promenite:
```env
NEXT_PUBLIC_API_URL=http://VAŠA_DOMENA_ILI_IP/api
```

Na primer:
```env
NEXT_PUBLIC_API_URL=http://poglavlje-vlku.rs/api
```
ili
```env
NEXT_PUBLIC_API_URL=http://123.45.67.89/api
```

Sačuvajte: `Ctrl+O`, `Enter`, `Ctrl+X`

### Korak 7: Pokrenite Aplikaciju

```bash
# Dajte dozvolu za deploy skriptu
chmod +x deploy.sh

# Pokrenite deployment
./deploy.sh
```

Ili manuelno:
```bash
docker compose up -d --build
```

### Korak 8: Proverite Status

```bash
# Proverite da li su kontejneri pokrenuti
docker compose ps

# Pogledajte logove
docker compose logs -f

# Proverite pojedinačne servise
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
```

### Korak 9: Otvorite Firewall Portove

```bash
# Dozvolite HTTP i HTTPS saobraćaj
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### Korak 10: Testirajte Aplikaciju

Otvorite pretraživač i idite na:
```
http://VAŠA_IP_ADRESA
```

Trebali bi da vidite frontend aplikacije!

---

## 🌐 Domen i DNS

### Kupovina Domena

**Preporučeni registrari u Srbiji:**
1. **Rnids** - https://www.rnids.rs (za .rs domene)
2. **SerbiaNET** - https://www.domeni.net
3. **HostIT** - https://www.hostit.rs

**Cena:** ~€20-30/godišnje za .rs domen

### Podešavanje DNS-a

Nakon kupovine domena, podesite A record:

1. Ulogujte se u panel vašeg registrara
2. Idite na DNS Management
3. Dodajte A record:
   - **Host**: @ (ili ostavite prazno)
   - **Points to**: VAŠA_IP_ADRESA
   - **TTL**: 3600

4. Opcionalno, dodajte www subdomain:
   - **Host**: www
   - **Points to**: VAŠA_IP_ADRESA
   - **TTL**: 3600

**DNS propagacija traje 1-24 sata.**

### Ažurirajte Nginx za Domen

```bash
cd /opt/poglavlje-vlku
nano nginx/nginx.conf
```

Promenite `server_name` sa `localhost` na vaš domen:
```nginx
server_name poglavlje-vlku.rs www.poglavlje-vlku.rs;
```

Restartujte nginx:
```bash
docker compose restart nginx
```

---

## 🔒 SSL Sertifikat (HTTPS)

### Besplatni SSL sa Let's Encrypt

```bash
# Instalirajte Certbot
sudo apt install certbot python3-certbot-nginx -y

# Zaustavite nginx kontejner privremeno
docker compose stop nginx

# Nabavite SSL sertifikat
sudo certbot certonly --standalone -d poglavlje-vlku.rs -d www.poglavlje-vlku.rs

# Kopirajte sertifikate u projekat
sudo cp /etc/letsencrypt/live/poglavlje-vlku.rs/fullchain.pem /opt/poglavlje-vlku/nginx/ssl/
sudo cp /etc/letsencrypt/live/poglavlje-vlku.rs/privkey.pem /opt/poglavlje-vlku/nginx/ssl/

# Dajte dozvole
sudo chmod 644 /opt/poglavlje-vlku/nginx/ssl/*.pem
```

### Aktivirajte HTTPS u Nginx

```bash
nano /opt/poglavlje-vlku/nginx/nginx.conf
```

Otkomentirajte HTTPS server blok (linije označene sa `#`):
```nginx
server {
    listen 443 ssl http2;
    server_name poglavlje-vlku.rs www.poglavlje-vlku.rs;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # ... rest of config
}
```

Restartujte:
```bash
docker compose restart nginx
```

### Auto-Renewal SSL Sertifikata

```bash
# Test renewal
sudo certbot renew --dry-run

# Dodajte cron job za auto-renewal
sudo crontab -e
```

Dodajte liniju:
```
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/poglavlje-vlku.rs/*.pem /opt/poglavlje-vlku/nginx/ssl/ && docker compose -f /opt/poglavlje-vlku/docker-compose.yml restart nginx
```

---

## 🔄 Ažuriranje Aplikacije

### Kada pravite izmene u kodu:

```bash
# Konektujte se na server
ssh root@VAŠA_IP_ADRESA

# Idite u direktorijum projekta
cd /opt/poglavlje-vlku

# Preuzmite nove izmene (ako koristite Git)
git pull

# Rebuild i restart
docker compose up -d --build

# Ili koristite deploy skriptu
./deploy.sh
```

---

## 💾 Backup i Restore

### Backup Baze Podataka

```bash
# Kreirajte backup direktorijum
mkdir -p /opt/backups

# Backup SQLite baze
docker compose exec backend cp /app/data/books.db /app/backup.db
docker cp poglavlje-vlku-backend:/app/backup.db /opt/backups/books-$(date +%Y%m%d).db

# Ili direktno sa volumea
sudo cp /var/lib/docker/volumes/poglavlje-vlku_backend-data/_data/books.db /opt/backups/books-$(date +%Y%m%d).db
```

### Automatski Backup (Cron Job)

```bash
# Kreirajte backup skriptu
nano /opt/backup.sh
```

Sadržaj:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Backup baze
docker compose -f /opt/poglavlje-vlku/docker-compose.yml exec -T backend cp /app/data/books.db /app/backup.db
docker cp poglavlje-vlku-backend:/app/backup.db $BACKUP_DIR/books-$DATE.db

# Obriši backupe starije od 30 dana
find $BACKUP_DIR -name "books-*.db" -mtime +30 -delete

echo "Backup completed: books-$DATE.db"
```

```bash
# Dajte dozvole
chmod +x /opt/backup.sh

# Dodajte u crontab (svaki dan u 2 ujutro)
sudo crontab -e
```

Dodajte:
```
0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1
```

### Restore Baze

```bash
# Zaustavite backend
docker compose stop backend

# Kopirajte backup u kontejner
docker cp /opt/backups/books-20260203.db poglavlje-vlku-backend:/app/data/books.db

# Pokrenite backend
docker compose start backend
```

---

## 📊 Monitoring i Logovi

### Pregled Logova

```bash
# Svi logovi
docker compose logs -f

# Samo backend
docker compose logs -f backend

# Samo frontend
docker compose logs -f frontend

# Poslednje 100 linija
docker compose logs --tail=100 backend
```

### Provera Performansi

```bash
# Korišćenje resursa
docker stats

# Disk prostor
df -h

# Memorija
free -h
```

### Restart Servisa

```bash
# Restart svih servisa
docker compose restart

# Restart pojedinačnog servisa
docker compose restart backend
docker compose restart frontend
docker compose restart nginx
```

---

## 🛠️ Troubleshooting

### Problem: Kontejneri se ne pokreću

```bash
# Proverite logove
docker compose logs

# Proverite status
docker compose ps

# Rebuild bez keša
docker compose build --no-cache
docker compose up -d
```

### Problem: Ne može da se konektuje na backend

```bash
# Proverite da li backend radi
docker compose logs backend

# Proverite mrežu
docker network ls
docker network inspect poglavlje-vlku_app-network

# Test API endpoint
curl http://localhost:5002/api/books
```

### Problem: Frontend ne učitava podatke

1. Proverite `frontend/.env.production`:
   ```bash
   cat frontend/.env.production
   ```

2. Trebalo bi da bude:
   ```env
   NEXT_PUBLIC_API_URL=http://VAŠ_DOMEN/api
   ```

3. Rebuild frontend:
   ```bash
   docker compose up -d --build frontend
   ```

### Problem: Nema prostora na disku

```bash
# Očistite nekorišćene Docker slike
docker system prune -a

# Očistite Docker volumene (PAŽNJA: Briše podatke)
docker volume prune
```

### Problem: Baza je prazna nakon restarta

```bash
# Proverite da li se volume montira
docker compose down
docker volume ls
docker compose up -d

# Proverite mounting point
docker compose exec backend ls -la /app/data/
```

---

## 📝 Checklist Pre Pokretanja

- [ ] VPS naručen i dostupan
- [ ] Docker instaliran
- [ ] Kod uploadovan na server
- [ ] `.env.production` konfigurisan sa pravim URL-om
- [ ] Firewall otvoren (port 80, 443)
- [ ] Domen kupljen (opcionalno)
- [ ] DNS podešen (ako koristite domen)
- [ ] SSL sertifikat instaliran (za produkciju)
- [ ] Backup skripte podešene
- [ ] Aplikacija testirana

---

## 💰 Procena Troškova

**Mesečni troškovi:**
- VPS Hosting: €10-15/mesec
- Domen (.rs): ~€2/mesec (€24/godišnje)
- SSL: Besplatno (Let's Encrypt)

**Ukupno: ~€12-17/mesec**

---

## 📞 Podrška

Ako naiđete na probleme:

1. Proverite logove: `docker compose logs -f`
2. Proverite status: `docker compose ps`
3. Restartujte servise: `docker compose restart`
4. Kontaktirajte podršku hosting provajdera

---

## 🎉 Čestitamo!

Vaša aplikacija je sada online i dostupna korisnicima! 🚀

**Korisni linkovi:**
- Frontend: `http://vaš-domen.rs`
- Admin panel: `http://vaš-domen.rs/admin`
- API: `http://vaš-domen.rs/api/books`

**Sledeći koraci:**
- Podesite Google Analytics
- Dodajte custom email (kontakt@vaš-domen.rs)
- Napravite Facebook/Instagram stranu za marketing
- Podesite backup strategiju
