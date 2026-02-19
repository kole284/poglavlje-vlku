# HITNA AKCIJA - Server Zaključan Zbog DDoS Napada

## 🚨 STATUS: Server 89.167.2.121 je ZAKLJUČAN od strane Hetznera

**Datum incidenta:** 18. Februar 2026, 19:02 CET  
**Razlog:** DDoS napad - slanje UDP paketa na port 27015  
**Locking ID:** L0029C35A

---

## FAZA 1: HITNA ISTRAGA (odmah)

### 1. Pristupite serveru preko SSH (ako je moguće)

```bash
ssh root@89.167.2.121
```

Ako SSH ne radi jer je server zaključan, koristite **Hetzner Console Access** kroz Robot panel:
- https://robot.hetzner.com
- Odaberite server → Console

### 2. Identifikujte proces koji šalje pakete

```bash
# Provera koja aplikacija koristi port 33118 (source port iz loga)
sudo netstat -tulpn | grep 33118

# Provera svih UDP konekcija
sudo netstat -nup

# Provera aktivnih procesa po mrežnoj aktivnosti
sudo ss -nup

# Provera procesa koji troše mrežu
sudo iftop
# ili
sudo nethogs
```

### 3. Pronađite sumnjive procese

```bash
# Lista svih pokrenutih procesa
ps aux | grep -E 'source|steam|game|ddos|flood|attack'

# Provera cron jobova
crontab -l
sudo cat /etc/crontab
ls -la /etc/cron.*

# Provera systemd servisa
systemctl list-units --type=service --state=running

# Provera za rootkit
sudo rkhunter --check
```

### 4. Provera Docker kontejnera (AKO koristite Docker)

```bash
# Lista aktivnih kontejnera
docker ps

# Provera logova kontejnera
docker logs backend
docker logs frontend

# Provera procesa unutar kontejnera
docker top backend
docker top frontend

# Provera mrežnog saobraćaja kontejnera
docker stats
```

---

## FAZA 2: ZAUSTAVLJANJE NAPADA (nakon identifikacije)

### Ako je pronađen maliciozni proces:

```bash
# Zaustavite proces (zamenite PID sa pravim ID-om)
sudo kill -9 PID

# Ako je Docker kontejner:
docker stop CONTAINER_ID
docker rm CONTAINER_ID
```

### Blokirajte odlazni UDP saobraćaj na port 27015:

```bash
# Privremeno blokiranje
sudo iptables -A OUTPUT -p udp --dport 27015 -j DROP

# Provera pravila
sudo iptables -L OUTPUT -v -n
```

### Onemogućite sve nedefinisane servise:

```bash
# Zaustavite sve osim SSH, nginx i vašeg backend-a
sudo systemctl disable <sumnjivi-servis>
sudo systemctl stop <sumnjivi-servis>
```

---

## FAZA 3: FORENZIČKA ANALIZA

### 1. Provera nedavno instaliranih paketa

```bash
# Za Debian/Ubuntu:
cat /var/log/apt/history.log | tail -100

# Za CentOS/RHEL:
rpm -qa --last | head -50
```

### 2. Provera nedavno modifikovanih fajlova

```bash
# Fajlovi promenjeni u poslednjih 24h
sudo find / -type f -mtime 0 2>/dev/null | grep -v proc

# Najnoviji logovi
sudo ls -lat /var/log/ | head -20
```

### 3. Provera login pokušaja

```bash
sudo last -20
sudo lastb
sudo cat /var/log/auth.log | tail -50
```

### 4. Provera otvorenih portova

```bash
sudo netstat -tulpn | grep LISTEN
sudo ss -tulpn
```

---

## FAZA 4: BEZBEDNOSNO ČIŠĆENJE

### 1. Promenite SVE lozinke

```bash
# Root lozinka
sudo passwd root

# Vaš user
sudo passwd nikola  # ili koje god korisničko ime koristite
```

### 2. Proverite i ažurirajte SSH konfiguraciju

```bash
sudo nano /etc/ssh/sshd_config
```

**Obavezno postavite:**
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # ili bilo koji drugi port
```

Restartujte SSH:
```bash
sudo systemctl restart sshd
```

### 3. Postavite firewall (UFW)

```bash
# Instalirajte UFW ako nije instaliran
sudo apt install ufw

# Dozvolite samo potrebne portove
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp  # SSH (ako ste promenili port)
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 27015/udp  # Blokirajte ovaj port

# Aktivirajte
sudo ufw enable
sudo ufw status verbose
```

### 4. Ažurirajte sistem

```bash
sudo apt update
sudo apt upgrade -y
sudo apt dist-upgrade -y
```

### 5. Instalirajte fail2ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## FAZA 5: PROVERA VAŠE APLIKACIJE

### 1. Pregled Docker konfiguracije

```bash
cd /root/poglavlje-vlku  # ili gde god je projekat
cat docker-compose.yml
```

**PROVERA:** Da li su neki portovi izloženi koji ne bi trebalo?

### 2. Provera Nginx konfiguracije

```bash
cat nginx/nginx.conf
cat nginx/nginx-ssl.conf
```

### 3. Provera backend okruženjskih promenljivih

```bash
cat backend/appsettings.Production.json
```

**VAŽNO:** Da li su kredencijali (database, SMTP, itd.) bezbedno skladišteni?

---

## FAZA 6: ZAHTEV ZA OTKLJUČAVANJE (HETZNER)

Nakon što ste:
1. ✅ Identifikovali i zaustavili izvor napada
2. ✅ Očistili sistem
3. ✅ Postavili firewall pravila
4. ✅ Ojačali bezbednost

### Pošaljite unlock zahtev:

1. Idite na https://robot.hetzner.com/support/
2. Kliknite na username → Support
3. Pod "Unlock", odaberite **L0029C35A**
4. Popunite formu sa sledećim tekstom:

---

**Subject:** Unlock Request for L0029C35A - Issue Resolved

**Message:**

```
Dear Hetzner Support Team,

I have investigated and resolved the issue that caused the server lockout (L0029C35A).

## Root Cause:
The server was compromised and was sending unauthorized UDP traffic to port 27015.

## Actions Taken:
1. Identified and terminated the malicious process
2. Changed all passwords (root and user accounts)
3. Hardened SSH configuration (disabled root login, changed port)
4. Implemented UFW firewall rules:
   - Blocked UDP port 27015
   - Allowed only necessary ports (SSH, HTTP, HTTPS)
5. Installed and configured fail2ban
6. Updated all system packages
7. Reviewed and secured the application configuration

## Preventive Measures:
- Firewall is now active and configured
- SSH is secured with key-based authentication only
- fail2ban is monitoring for intrusion attempts
- Regular security updates scheduled

The server is now secure and ready to be unlocked.

Thank you for your attention to this matter.

Best regards,
Nikola Kostic
```

---

## FAZA 7: NAKON OTKLJUČAVANJA

### 1. Monitorirajte saobraćaj

```bash
# Instalirajte monitoring
sudo apt install vnstat iftop

# Pratite saobraćaj
sudo iftop -i eth0

# Proverite bandwidth
vnstat -d
```

### 2. Postavite monitoring alarm

Koristite neki monitoring servis:
- **UptimeRobot** (besplatno)
- **Pingdom**
- **Netdata** (self-hosted)

### 3. Napravite backup

```bash
# Backup aplikacije
tar -czf backup-$(date +%Y%m%d).tar.gz /root/poglavlje-vlku

# Ili koristite Hetzner Snapshot kroz Robot panel
```

### 4. Razmotriteizolaciju servisa

Razmislite o:
- **Korišćenju ne-root Docker kontejnera**
- **AppArmor/SELinux profilima**
- **Odvojenim VM-ovima za različite servise**

---

## DODATNI RESURSI

- [Hetzner Guideline for Locked Servers](https://docs.hetzner.com/robot/dedicated-server/troubleshooting/guideline-in-case-of-server-locking/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Ubuntu Server Hardening Guide](https://ubuntu.com/server/docs/security-introduction)

---

## KONTAKT ZA HITNE SLUČAJEVE

- **Hetzner Support:** support@hetzner.com
- **Hetzner Robot:** https://robot.hetzner.com

---

**⚠️ NAPOMENA:** Ne šaljite unlock zahtev dok niste 100% sigurni da je problem rešen. Hetzner može trajno deaktivirati server ako se incident ponovi.
