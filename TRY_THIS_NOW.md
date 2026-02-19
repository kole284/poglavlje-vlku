# ⚡ HITNO - Pokušaj OVO ODMAH

## Server je zaključan → Probaj Robot Console

### 🎯 KORACI (5 minuta):

#### 1. Otvori Hetzner Robot
```
URL: https://robot.hetzner.com
```

#### 2. Login
- Username: [tvoj Hetzner email/username]
- Password: [tvoja Hetzner lozinka]

#### 3. Nađi Server
- Traži: **CAX11 #121057365**
- Ili IP: **89.167.2.121**
- Klikni na njega

#### 4. Otvori Console
Potraži jedan od ovih:
- **"Console"** dugme (gore desno)
- **"VNC Console"** 
- **"KVM Console"** (ako je dostupan)
- **Tab "Console"** ili **"Management"**

#### 5. Login u Konsoli
```
login: root
password: [tvoja root lozinka]
```

**AKO ne znaš root lozinku, probaj:**
```
login: vlkuadmin
password: [tvoja vlkuadmin lozinka]
```

---

## ✅ KAD USPEŠ da se uloguješ:

Kopiraj i pokreni **OVE KOMANDE** odmah:

```bash
# STOP napad
iptables -A OUTPUT -p udp --dport 27015 -j DROP
iptables-save

# PRONAĐI krivca
ps aux | grep -E 'game|source|steam|ddos'
netstat -nup | grep 27015
docker ps

# Ako vidiš sumnjiv proces (npr. PID 12345):
kill -9 12345

# Ako je Docker kontejner:
docker stop $(docker ps -q)

# BLOKIRAJ sve osim osnovnog
apt install ufw -y
ufw default deny incoming
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 27015
ufw --force enable

# PROMENI lozinke
passwd root
passwd vlkuadmin

# Status
ufw status
netstat -nup | grep 27015
```

---

## ❌ AKO NE RADI Console:

### Plan B - Rescue Mode:

1. U Robot panelu: **"Rescue"** → **"Activate rescue system"**
2. Sačuvaj password koji dobiješ
3. **"Reset"** server
4. Pokušaj SSH ponovo sa tim rescue password-om
5. Vidi detalje u: `SERVER_LOCKED_NO_SSH.md`

---

## 🎯 CILJ:

1. ✅ Loguj se na server
2. ✅ Blokiraj port 27015
3. ✅ Nađi i ubij maliciozni proces
4. ✅ Postavi firewall
5. ✅ Promeni lozinke
6. ✅ Pošalji unlock request Hetzneru

---

## 📱 Screenshot Ove Stranice

Snimi screenshot ovog dokumenta da imaš komande pri ruci dok radiš u konzoli!

---

**SRETNO! Javi kako je prošlo.**
