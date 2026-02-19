# Moguće Uzroke DDoS Napada - Analiza

## 🔍 Šta znači port 27015?

**Port 27015** je standardni port za **Source Engine** servere:
- Counter-Strike: Global Offensive
- Team Fortress 2
- Left 4 Dead
- Garry's Mod
- Half-Life servere

**Vaša aplikacija (knjižara) NEMA nikakve veze sa ovakvim saobraćajem!**

---

## 🤔 Kako je vaš server postao učesnik u napadu?

### SCENARIO 1: Kompromitovani Server (NAJVJEROVATNIJE) 🔴

**Što se desilo:**
- Neko je dobio pristup vašem serveru
- Instalirao je malware koji učestvuje u DDoS napadima
- Vaš server je postao dio "botnet" mreže

**Kako su ušli:**
1. **Slaba SSH lozinka** → Brute force napad
2. **Root login omogućen** → Lako pogoditi
3. **Ranjivosti u softveru** → Exploit
4. **Exposed Docker socket** → Pristup kontejnerima

**Kako proveriti:**
```bash
# Provera neuspešnih SSH pokušaja
sudo grep "Failed password" /var/log/auth.log | tail -50

# Provera uspešnih SSH logina
sudo grep "Accepted password" /var/log/auth.log | tail -20

# Kada su se admin korisnici logovali
sudo last | head -20

# Neuspešni login pokušaji
sudo lastb | head -20
```

**Znakovi:**
- Procesi koje ne prepoznajete
- Visoka CPU/mreža upotreba
- Nepoznati cron jobovi
- Fajlovi u `/tmp` koje niste kreirali

---

### SCENARIO 2: Docker Container Compromise 🟠

**Što se desilo:**
- Kontejner je izložio port ili ranjivost
- Napadač je ušao kroz kontejner
- Eskalirani privilegije do host sistema

**Kako proveriti:**
```bash
# Lista kontejnera
docker ps -a

# Logovi backend kontejnera
docker logs backend --tail 100

# Logovi frontend kontejnera
docker logs frontend --tail 100

# Ko je ušao u kontejner?
docker exec backend cat /root/.bash_history
```

**Provera docker-compose.yml:**
```bash
cat docker-compose.yml
```

**Opasne konfiguracije:**
- `privileged: true`
- Exposing Docker socket: `/var/run/docker.sock:/var/run/docker.sock`
- `network_mode: host`
- Nepotrebno izloženi portovi

---

### SCENARIO 3: Dependency/Supply Chain Attack 🟡

**Što se desilo:**
- Neki npm paket (frontend) ili NuGet paket (backend) je imao malware
- Instaliran tokom build procesa
- Malware radi u pozadini

**Kako proveriti:**
```bash
# Provera Node modules
cd frontend
npm audit

# Provera za skrivene skripte
grep -r "27015" node_modules/
grep -r "udp" node_modules/

# Provera .NET dependencies
cd backend
dotnet list package --vulnerable
```

---

### SCENARIO 4: Compromised Environment Variables/Secrets 🟡

**Što se desilo:**
- Neko je ukrao vaše credentials
- Deployovali su maliciozni kod
- Kod šalje UDP pakete

**Kako proveriti:**
```bash
# Da li su vaši credentials javni?
# 1. Proverite GitHub repo - da li ste slučajno commitovali secrets?
# 2. Proverite .env fajlove
cat backend/.env 2>/dev/null
cat frontend/.env 2>/dev/null

# Proverite appsettings
cat backend/appsettings.Production.json
```

---

### SCENARIO 5: Ostavljeni Debug/Test Alati 🟢

**Što se desilo:**
- Instalirali ste neki testing tool (npr. za load testing)
- Zaboravili ste ga isključiti
- Tool je nastavio slati pakete

**Manje verovatno, ali proverite:**
```bash
# Unusual packages
dpkg -l | grep -E 'hping|nmap|siege|ab-'

# Cron jobs
crontab -l
sudo cat /etc/crontab
```

---

## 🎯 HITNO - Što proveriti PRVO:

### 1. SSH Pristup Istorija
```bash
# Ko se sve logirao danas?
sudo grep "$(date +%Y-%m-%d)" /var/log/auth.log | grep "Accepted"

# Odakle?
sudo grep "Accepted" /var/log/auth.log | tail -20 | awk '{print $1, $2, $3, $11}'
```

**Crvene zastavice:**
- Login sa nepoznate IP adrese
- Login u neuobičajeno vreme (npr. 3AM)
- Mnogo neuspešnih pokušaja prije uspešnog

### 2. Nepoznati Procesi
```bash
# Svi procesi sortirani po CPU
ps aux --sort=-%cpu | head -20

# Svi procesi sortirani po memoriji
ps aux --sort=-%mem | head -20

# Traži ključne riječi
ps aux | grep -iE 'flood|ddos|attack|bot|irc|torrent'
```

**Crvene zastavice:**
- Imena kao: `kdevtmpfsi`, `[kworker]`, `/tmp/...`
- Procesi koji se odmah restartuju kad ih killujete
- Procesi koji rade kao root a ne bi trebalo

### 3. Mrežna Aktivnost
```bash
# Trenutne konekcije
sudo netstat -ntp | grep ESTABLISHED

# UDP konekcije
sudo netstat -nup
```

**Crvene zastavice:**
- Konekcije na port 27015
- Konekcije na nepoznate IP adrese
- IRC portovi (6667, 6697)
- Bitcoin mining portovi

### 4. Nedavno Promenjeni Fajlovi
```bash
# Danas
sudo find /root -type f -mtime 0 2>/dev/null
sudo find /tmp -type f -mtime 0 2>/dev/null
sudo find /var/tmp -type f -mtime 0 2>/dev/null

# Executable fajlovi u /tmp
sudo find /tmp -type f -executable 2>/dev/null
```

**Crvene zastavice:**
- Random imena: `asdf123`, `tmp12345`
- Hidden fajlovi: `.hidden`, `..`
- Binary fajlovi u /tmp

---

## 🛡️ PREVENTIVA - Za ubuduće:

### Osnovna Pravila:

1. **NIKAD:**
   - Root login preko SSH ❌
   - Password authentication ❌
   - Default portovi (22, 3306, 5432) ❌
   - Privileged Docker containers bez razloga ❌

2. **UVEK:**
   - SSH keys only ✅
   - Strong passwords (20+ chars) ✅
   - UFW/iptables firewall ✅
   - fail2ban ✅
   - Regular updates ✅
   - Monitoring (Netdata, Prometheus) ✅

3. **PREPORUČENO:**
   - 2FA authentication ✅
   - IP whitelist za SSH ✅
   - SELinux/AppArmor ✅
   - Regular backups ✅
   - Intrusion detection (OSSEC, Wazuh) ✅

---

## 📊 Risk Assessment:

| Scenario | Verovatnoća | Ozbiljnost | Prioritet |
|----------|-------------|-----------|-----------|
| Weak SSH password | 🔴 Visoka | 🔴 Kritična | **P0** |
| Docker misconfiguration | 🟠 Srednja | 🟠 Visoka | **P1** |
| Vulnerable dependency | 🟡 Niska | 🟠 Visoka | **P2** |
| Left-behind tool | 🟢 Vrlo niska | 🟡 Srednja | **P3** |

---

## 🔧 Quick Root Cause Analysis:

Odgovorite na ova pitanja:

1. **Da li ste koristili SSH sa lozinkom?**
   - DA → Verovatno brute force
   - NE → Proverite dalje

2. **Da li je root login bio omogućen?**
   - DA → Visok rizik compromise
   - NE → Dobro, ali proverite user accounts

3. **Da li imate firewall?**
   - NE → To je problem #1
   - DA → Kako je attack prošao kroz?

4. **Kada ste zadnji put updateovali sistem?**
   - >30 dana → Verovatno exploit poznate ranjivosti
   - <7 dana → Manje vjerovatno exploit

5. **Da li ste ikad radili `chmod 777` ili `chown -R` kommande?**
   - DA → To može biti entry point
   - NE → OK

6. **Da li su credentials u kodu ili GitHub-u?**
   - DA → HITNO ih promenite
   - NE → OK

---

## 📝 Za Hetzner Report:

Nakon što identifikujete uzrok, koristite ovu formulu:

```
Root Cause: [SCENARIO koji ste identifikovali]
Entry Point: [Kako su ušli - SSH, Docker, etc.]
Exploit Used: [Brute force, known CVE, etc.]
Time of Compromise: [Približno kada]
Duration: [Koliko dugo je trajalo]
Resolution: [Što ste uradili da popravite]
```

**Primer:**
```
Root Cause: Compromised server via SSH brute force
Entry Point: SSH service with weak password
Exploit Used: Dictionary attack on root account
Time of Compromise: Estimated between 18:00-19:00 CET on 2026-02-18
Duration: Approximately 1 hour before detection
Resolution: 
- Changed all passwords
- Disabled password authentication
- Implemented SSH key-only access
- Configured UFW firewall
- Installed fail2ban
- Blocked port 27015
```

---

## ❓ Ne možete naći uzrok?

Ako nakon svih ovih provera ne možete naći šta je uzrok:

1. **Preventivni pristup:**
   - Implementirajte SVE bezbednosne mere
   - Pratite server 24-48h
   - Ako se ne ponovi, dobro

2. **Nuclear option - čist reinstall:**
   - Napravite backup vaše aplikacije
   - Reinstalirajte server (Hetzner Robot → Rescue Mode)
   - Deploy samo vaše aplikacije
   - Implementirajte sve security mere odmah

3. **Pitajte za pomoć:**
   - Linux security forumi
   - Hetzner support (nakon što implementirate security)
   - Cybersecurity consulting

---

**VAŽNO:** Bolje je biti pretjerano oprezan nego ponovo imati incident!
