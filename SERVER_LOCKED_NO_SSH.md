# 🚨 Server Nedostupan - SSH Ne Radi

## Status: Server je POTPUNO zaključan od strane Hetznera

Kada Hetzner zaključa server zbog DDoS napada, obično:
- ❌ SSH ne radi
- ❌ HTTP/HTTPS ne radi  
- ❌ Sve mrežne veze su blokirane
- ✅ Server fizički radi, ali je izolovan

---

## 🔧 OPCIJA 1: Hetzner Robot Console (NAJBOLJE REŠENJE)

### Pristup kroz web browser:

1. **Idite na:** https://robot.hetzner.com

2. **Login:** Koristite Hetzner credentials

3. **Odaberite server:**
   - Kliknite na server **CAX11 #121057365** (IP: 89.167.2.121)

4. **Otvorite Console:**
   - Desno gore kliknite na **"Console"** ili **"VNC Console"**
   - Ili: **Servers** → Vaš server → **Tab "Console"**

5. **Login u konzoli:**
   ```
   Username: root (ili vlkuadmin)
   Password: [vaša server lozinka]
   ```

**Ako VNC Console ne radi, probajte:**
- **Serial Console** (isto iz Robot panela)
- **KVM Console** (ako je Cloud server)

---

## 🔧 OPCIJA 2: Rescue Mode + SSH

Ako obična konzola ne radi, možete bootovati server u Rescue Mode:

### Koraci:

1. **Robot Panel:** https://robot.hetzner.com
2. **Odaberite server:** CAX11 #121057365
3. **Kliknite:** "Rescue" ili "Linux"
4. **Aktivirajte Rescue System:**
   - Odaberite: **Linux**
   - Click: **Activate rescue system**
   - Dobićete **root password** - SAČUVAJTE GA!

5. **Restartujte server:**
   - Click: **Reset** ili **Power → Restart**
   - Server će se bootovati u Rescue Mode

6. **SSH u Rescue Mode (možda radi):**
   ```bash
   ssh root@89.167.2.121
   # Koristite password iz koraka 4
   ```

7. **Mount vaš pravi sistem:**
   ```bash
   # Lista diskova
   lsblk
   
   # Mount glavni disk (obično /dev/sda1 ili /dev/vda1)
   mount /dev/sda1 /mnt
   # ili
   mount /dev/vda1 /mnt
   
   # Mount ostale particije ako treba
   mount -t proc /proc /mnt/proc
   mount --rbind /sys /mnt/sys
   mount --rbind /dev /mnt/dev
   
   # Chroot u vaš sistem
   chroot /mnt
   ```

8. **Sada možete raditi sve komande** kao da ste normalno logovani!

---

## 🔧 OPCIJA 3: Direktan Kontakt sa Hetzner Supportom

Ako ni konsola ne radi:

### Email:
```
To: support@hetzner.com
Subject: Urgent - Locked Server L0029C35A - Cannot Access Console

Dear Hetzner Support,

My server (IP: 89.167.2.121, Locking ID: L0029C35A) is completely 
inaccessible. I cannot connect via SSH and need to investigate 
the security incident.

Can you please:
1. Provide VNC/KVM console access, OR
2. Temporarily allow SSH access from my IP: [VAŠA TRENUTNA IP], OR
3. Advise on how to access the server for remediation

I understand the server was involved in a DDoS incident and I need 
to access it to remove the malicious software and secure the system.

Thank you,
Nikola Kostic
CAX11 #121057365
```

### Ticket preko Robot:
1. https://robot.hetzner.com/support/
2. Username → Support → **New Ticket**
3. Kopirajte gornji tekst

**Očekivano vreme odgovora:** 4-24h

---

## 🔧 OPCIJA 4: "Nuclear Option" - Preventivna Bezbednost bez pristupa

Ako ne možete uopšte pristupiti serveru, pošaljite Hetzneru preventivni plan:

### Email Template:

```
Subject: Unlock Request L0029C35A - Preventive Security Measures Implemented

Dear Hetzner Security Team,

I am requesting unlock of server 89.167.2.121 (Locking ID: L0029C35A).

Unfortunately, I cannot access the server to investigate as it is 
completely locked. However, I would like to propose the following 
approach:

OPTION A - Unlock with Firewall Restrictions:
Can you unlock the server with these firewall rules applied:
- BLOCK all outbound UDP traffic to port 27015
- BLOCK all outbound traffic except to: [essential IPs if you know them]
- ALLOW: SSH from my IP only: [YOUR IP]
- ALLOW: HTTP/HTTPS for legitimate traffic

Once unlocked with these restrictions, I will immediately:
1. Change all passwords
2. Disable root login
3. Implement SSH key authentication only
4. Configure UFW firewall
5. Install fail2ban
6. Scan for malware and remove it
7. Update all packages

OPTION B - Fresh Reinstall:
If the compromise is severe, I am prepared to:
1. Backup critical data (if possible)
2. Perform a clean OS reinstall
3. Redeploy my application securely
4. Implement all security best practices from the start

I take full responsibility for the security of this server and 
commit to preventing any recurrence.

Please advise on the best approach.

Thank you,
Nikola Kostic
```

---

## 🎯 ŠTA URADITI KAD DOBIJETE PRISTUP:

Bez obzira kako dobijete pristup, uradite OVO ODMAH:

```bash
# 1. BLOKIRAJ PORT 27015
iptables -A OUTPUT -p udp --dport 27015 -j DROP
iptables -A OUTPUT -p tcp --dport 27015 -j DROP
iptables-save

# 2. PRONAĐI KRIVCA
netstat -tulpn | grep 27015
ps aux | head -20
docker ps

# 3. KILL sve sumnjivo
kill -9 [PID]
docker stop [CONTAINER]

# 4. POSTAVI FIREWALL
apt update
apt install ufw -y
ufw default deny incoming
ufw default deny outgoing  # DA, deny OUTGOING takođe!
ufw allow out 80/tcp
ufw allow out 443/tcp
ufw allow out 53  # DNS
ufw allow in 22/tcp
ufw allow in 80/tcp
ufw allow in 443/tcp
ufw deny 27015
ufw enable

# 5. PROMENI LOZINKE
passwd root
passwd vlkuadmin

# 6. FAIL2BAN
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📞 KONTAKT INFO:

### Hetzner:
- **Robot Panel:** https://robot.hetzner.com
- **Support Email:** support@hetzner.com  
- **Support Phone:** +49 9831 5050 (Nemačka)
- **Emergency:** Use Robot web interface for urgent tickets

### Vaš Server:
- **IP:** 89.167.2.121
- **Product:** CAX11 #121057365
- **Locking ID:** L0029C35A
- **Account:** poglavlje-vlku / vlkuadmin

---

## ⏱️ PLAN AKCIJE:

1. **[0-10min]** Probaj Robot Console pristup
2. **[10-30min]** Ako ne radi, aktiviraj Rescue Mode
3. **[30-60min]** Ako ni to ne radi, kontaktiraj Hetzner Support
4. **[1h-24h]** Čekaj odgovor od Hetznera
5. **[24h+]** Razmotriti reinstall ako je server previše oštećen

---

## 🤔 Koja je najbolja opcija?

| Opcija | Brzina | Šansa za uspeh |
|--------|--------|----------------|
| **Robot Console** | 5min | 60% |
| **Rescue Mode** | 15min | 80% |
| **Hetzner Support** | 4-24h | 95% |
| **Preventivni Email** | 24-48h | 70% |
| **Reinstall** | 2-4h | 100% (ali gubi podatke) |

---

## 💡 PRO TIP:

Ako planirate reinstall, **PRVO** probajte rescue mode da backup-ujete:
- `/root/poglavlje-vlku` (vaša aplikacija)
- `/etc/` (konfiguracije)
- Database backup ako postoji

**Komanda za backup u Rescue Mode:**
```bash
# Mount disk
mount /dev/sda1 /mnt

# Tar arhiva
tar -czf backup-$(date +%Y%m%d).tar.gz /mnt/root/poglavlje-vlku

# Download sa rescue servera (SCP sa vašeg računara):
scp root@89.167.2.121:/backup-*.tar.gz ./
```

---

**⚠️ VAŽNO:** Čak i ako ne možete pristupiti serveru, Hetzner će najvjerovatnije otključati server ako im pošaljete ozbiljan plan bezbednosti i garantujete da ćete problem rešiti čim dobijete pristup.

**🔑 KLJUČ:** Budite transparentni i profesionalni u komunikaciji sa njima.
