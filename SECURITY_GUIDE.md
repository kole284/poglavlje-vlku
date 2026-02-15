# 🔒 Sigurnosni Vodič - Admin Panel Zaštita

## 📋 Pregled Sigurnosnih Poboljšanja

Implementirana je profesionalna autentifikacija i autorizacija za admin panel sa sledećim funkcionalnostima:

### ✅ Šta je Implementirano

1. **JWT (JSON Web Token) Autentifikacija**
   - Backend generiše sigurne JWT tokene pri uspešnoj prijavi
   - Tokeni istječu nakon 8 sati
   - Svaki zahtev se validira sa JWT tokenom

2. **BCrypt Password Hashing**
   - Lozinke se mogu čuvati kao BCrypt hash-evi
   - Podržava plain text (za kompatibilnost) i hash format
   - Work factor: 11 (visok nivo sigurnosti)

3. **Backend API Zaštita**
   - POST /api/books (kreiranje knjiga) - zahteva autorizaciju
   - PUT /api/books/{id} (ažuriranje) - zahteva autorizaciju
   - DELETE /api/books/{id} (brisanje) - zahteva autorizaciju
   - GET endpointi ostaju javni (pregledanje knjiga)

4. **Frontend Sigurnost**
   - Login forma sa korisničkim imenom i lozinkom
   - JWT token se čuva u localStorage
   - Automatska provera autorizacije
   - Token se šalje sa svakim admin API zahtevom
   - Automatsko odjavljivanje pri isteku tokena

---

## 🔐 Kako Funkcioniše

### 1. Prijava (Login)

```
Korisnik → Login forma (username + password)
    ↓
Frontend → POST /api/auth/login
    ↓
Backend → Proverava kredencijale
    ↓
Backend → Generiše JWT token (ističe za 8h)
    ↓
Frontend → Čuva token u localStorage
    ↓
Admin panel se otvara
```

### 2. Admin Operacije

```
Admin → Kreira/Ažurira/Briše knjigu
    ↓
Frontend → Šalje zahtev sa Authorization: Bearer {token}
    ↓
Backend → Validira JWT token
    ↓
Backend → Proverava Admin rolu
    ↓
Backend → Izvršava operaciju ili vraća 401 Unauthorized
```

### 3. Zaštita od Neovlašćenog Pristupa

- **Bez tokena**: API vraća 401 Unauthorized
- **Nevažeći token**: API vraća 401 Unauthorized
- **Istekao token**: Automatsko odjavljivanje na frontendu

---

## 🛠️ Konfiguracija

### Backend (.env fajl)

Otvori `backend/.env` i podesi:

```env
# JWT Konfiguracija
JWT_SECRET=VlkuBookstore2026!SecureJWTKeyForAdminAuthentication
JWT_ISSUER=PoglavljeVlku
JWT_AUDIENCE=PoglavljeVlkuAdmin

# Admin Kredencijali
ADMIN_USERNAME=admin
ADMIN_PASSWORD=VlkuAdmin2026!Strong#Pass
```

### Generisanje Jakih Lozinki

**Opcija 1: Plain Text (Jednostavnije, ali manje sigurno)**
```env
ADMIN_PASSWORD=VlkuAdmin2026!Strong#Pass
```

**Opcija 2: BCrypt Hash (Preporučeno za produkciju)**
```env
ADMIN_PASSWORD=HASHED:$2a$11$92y8vZ3LKqh8JVxqXZd4xeXJGKZqP9X...
```

#### Kako Generisati BCrypt Hash

1. Koristi online generator: https://bcrypt-generator.com/
   - Unesi lozinku
   - Rounds: 11
   - Kopiraj hash

2. Ili koristi utility (u backend folderu):
   ```bash
   cd backend
   # Kompajluj C# fajl sa BCrypt paketom
   dotnet add package BCrypt.Net-Next
   dotnet script HashPasswordUtility.cs
   ```

3. Stavi hash u .env:
   ```env
   ADMIN_PASSWORD=HASHED:$2a$11$generisani-hash-ovde
   ```

---

## 🔒 Najbolje Sigurnosne Prakse

### ✅ URADI OVO:

1. **Promeni Default Lozinku**
   - Ne koristi `admin` / `admin`
   - Koristi jaku kombinaciju:
     - Minimum 12 karaktera
     - Velika i mala slova
     - Brojevi
     - Specijalni karakteri (!@#$%^&*)

2. **Generiši Jak JWT Secret**
   ```bash
   # Generiši random string (Linux/Mac)
   openssl rand -base64 32
   
   # Ili koristi online: https://generate-random.org/api-token-generator
   ```

3. **Koristi HTTPS u Produkciji**
   - JWT tokeni se šalju u HTTP zaglavljima
   - HTTPS šifruje sav saobraćaj
   - Aktiviraj SSL u nginx.conf (vidi DEPLOYMENT_GUIDE.md)

4. **Regularno Menjaj Lozinke**
   - Admin lozinku promeni svaka 3-6 meseci
   - JWT Secret menjaj pri sumnjivim aktivnostima

5. **Backup .env Fajla**
   - Sačuvaj .env fajl na sigurnom mestu
   - Ne komituj u Git (već je u .gitignore)

### ❌ NE RADI OVO:

1. **Nikad ne komituj .env u Git**
   ```bash
   # Proveri da li je .env ignorisan
   git status
   # Ne bi trebalo da vidiš backend/.env
   ```

2. **Ne deli kredencijale putem email/chat**
   - Koristi sigurne password managere (Bitwarden, 1Password)

3. **Ne koristi iste kredencijale kao za druge servise**

4. **Ne postavljaj slabe lozinke**
   - ❌ admin, password, 123456
   - ✅ VlkuAdmin2026!Strong#Pass

---

## 🧪 Testiranje Sigurnosti

### 1. Pokušaj Pristupa bez Autentifikacije

```bash
# Pokušaj kreirati knjigu bez tokena
curl -X POST http://localhost:5002/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Test","price":100,"stock":5}'

# Očekivani rezultat: 401 Unauthorized
```

### 2. Test Prijave

```bash
# Prijavi se
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"VlkuAdmin2026!Strong#Pass"}'

# Očekivani rezultat: {"token":"eyJhbGc...","message":"Uspešna prijava."}
```

### 3. Test sa Tokenom

```bash
# Koristi token iz prethodnog zahteva
TOKEN="eyJhbGc..."

curl -X POST http://localhost:5002/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test","author":"Test","price":100,"stock":5}'

# Očekivani rezultat: 201 Created
```

---

## 🚀 Deployment Checklist

Pre nego što postaviš aplikaciju na server:

- [ ] Promenio si `ADMIN_USERNAME` i `ADMIN_PASSWORD`
- [ ] Generisao si jak `JWT_SECRET` (min 32 karaktera)
- [ ] Koristiš BCrypt hash za lozinku (preporuka)
- [ ] Aktivirao si HTTPS (SSL certifikat)
- [ ] .env fajl je isključen iz Git-a
- [ ] Testirao si prijavu i admin operacije
- [ ] Backup-ovao si .env fajl na sigurno mesto

---

## 📚 Tehnički Detalji

### JWT Token Struktura

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "name": "admin",
    "role": "Admin",
    "jti": "unique-token-id",
    "exp": 1676592000,
    "iss": "PoglavljeVlku",
    "aud": "PoglavljeVlkuAdmin"
  },
  "signature": "HMACSHA256(...)"
}
```

### BCrypt Hash Format

```
HASHED:$2a$11$salt..........hash.......................
        │  │  │          │
        │  │  │          └─ Hash (31 chars)
        │  │  └─ Salt (22 chars)
        │  └─ Work factor (11 = 2^11 = 2048 rounds)
        └─ Algorithm identifier (2a = BCrypt)
```

---

## 🐛 Troubleshooting

### Problem: "401 Unauthorized" pri admin operacijama

**Rešenje:**
1. Proveri da li si prijavljen
2. Proveri da li je token istekao (8h)
3. Odjavi se i prijavi ponovo

### Problem: "Pogrešna lozinka" pri prijavi

**Rešenje:**
1. Proveri `ADMIN_USERNAME` i `ADMIN_PASSWORD` u backend/.env
2. Ako koristiš hash, proveri da počinje sa "HASHED:"
3. Restartuj backend nakon promene .env

### Problem: Token ne radi nakon restarta servera

**Rešenje:**
- JWT tokeni istječu nakon 8h
- Promjena JWT_SECRET invalidira sve postojeće tokene
- Odjavi se i prijavi ponovo

### Problem: Ne mogu pristupiti admin panelu

**Rešenje:**
1. Otvori Developer Tools (F12)
2. Proveri Console za greške
3. Proveri Network tab za API zahteve
4. Proveri da backend radi na http://localhost:5002

---

## 📞 Dodatna Pomoć

Ako imaš problema sa sigurnošću ili autentifikacijom:

1. Proveri backend logove:
   ```bash
   docker compose logs backend
   ```

2. Proveri frontend konzolu (F12 → Console)

3. Testuj API endpointe sa curl ili Postman

4. Konsultuj dokumentaciju:
   - JWT: https://jwt.io/
   - BCrypt: https://en.wikipedia.org/wiki/Bcrypt
   - ASP.NET Auth: https://learn.microsoft.com/en-us/aspnet/core/security/

---

## ✅ Sigurnost Potvrđena

Ovaj sistem implementira industrijske standarde za web autentifikaciju:
- ✅ JWT tokeni
- ✅ Password hashing (BCrypt)
- ✅ Role-based authorization
- ✅ Token expiration
- ✅ Secure HTTP headers
- ✅ CORS protection

**Status:** 🔒 Admin panel je sada siguran!
