# ⚡ BRZA AKCIONA LISTA - DDoS Incident

## 🚨 HITNO - Uradite OVO ODMAH:

### ☐ 1. Pristupite serveru
```bash
ssh root@89.167.2.121
# ILI preko Hetzner Console: https://robot.hetzner.com
```

### ☐ 2. Pronađite krivca
```bash
# Ko šalje UDP pakete?
sudo netstat -nup | grep 27015
sudo ss -nup | grep 27015
ps aux | grep -E 'source|steam|game'
```

### ☐ 3. ZAUSTAVITE ga
```bash
# Ako pronađete proces:
sudo kill -9 [PID]

# Blokirajte port ODMAH:
sudo iptables -A OUTPUT -p udp --dport 27015 -j DROP
```

### ☐ 4. Proverite Docker (ako ga koristite)
```bash
docker ps
docker logs backend
docker logs frontend
docker stop [SUMNJIVI_KONTEJNER]
```

---

## 🔐 BEZBEDNOST - Sledećih 30min:

### ☐ 5. Promenite lozinke
```bash
sudo passwd root
sudo passwd [vaš_user]
```

### ☐ 6. Postavite firewall
```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw deny 27015/udp # BLOKIRAJ ovo!
sudo ufw enable
```

### ☐ 7. Zaštitite SSH
Editujte `/etc/ssh/sshd_config`:
```
PermitRootLogin no
PasswordAuthentication no
```
```bash
sudo systemctl restart sshd
```

### ☐ 8. Instalirajte fail2ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📝 DOKUMENTACIJA ZA HETZNER:

### ☐ 9. Zabeležite šta ste uradili
Napravite listu svih koraka koje ste preduzeli.

### ☐ 10. Pošaljite unlock zahtev
- Idite na: https://robot.hetzner.com/support/
- Username → Support → Unlock → **L0029C35A**
- Kopirajte tekst iz `SECURITY_INCIDENT_RESPONSE.md` fajla (Faza 6)

---

## ✅ PROVERA - Pre slanja zahteva:

- [ ] Maliciozni proces je zaustavljen
- [ ] Firewall je aktivan (`sudo ufw status`)
- [ ] SSH je ojačan
- [ ] Lozinke su promenjene
- [ ] Port 27015 je blokiran
- [ ] fail2ban je pokrenut
- [ ] Znate KAKO je došlo do napada (ili bar imate teoriju)

---

## 🔍 BRZA DIJAGNOZA - Šta tražiti:

### Sumnjivi procesi:
- Imena kao: `csgo`, `tf2`, `source`, `steam`, `ddos`, `flood`
- Procesi koji troše mnogo CPU/mreže
- Procesi koje ne prepoznajete

### Sumnjivi fajlovi:
```bash
# Nedavno kreirani fajlovi
sudo find /tmp -type f -mtime -1
sudo find /root -type f -mtime -1
sudo find /home -type f -mtime -1

# Sumnjivi cron jobovi
crontab -l
sudo cat /etc/crontab
```

### Sumnjive veze:
```bash
# Ko je povezan?
sudo netstat -ntup
sudo ss -ntup
```

---

## 📞 POMOĆ:

Ako ne možete rešiti sami:
1. Napravite snapshot preko Hetzner Robot panela
2. Možda je najbolje napraviti nov server i migrirati čistu aplikaciju
3. Kontaktirajte Hetzner support sa details

---

## ⏱️ VREMENSKA LINIJA:

| Vreme | Akcija |
|-------|--------|
| 0-10min | Identifikacija + zaustavljanje napada |
| 10-30min | Ojačavanje bezbednosti |
| 30-60min | Analiza + dokumentacija |
| 60+min | Slanje unlock zahteva |

---

**VAŽNO:** Hetzner neće otključati server dok ne budu sigurni da je problem rešen. Budite temeljni!
