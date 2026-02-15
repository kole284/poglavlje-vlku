# 🔒 Admin Panel - Sigurnosno Ažuriranje

## ✅ Šta je Urađeno

Admin panel je sada **zaštićen jakom autentifikacijom** sa sledećim poboljšanjima:

### 1. **Backend Sigurnost**
- ✅ JWT (JSON Web Token) autentifikacija
- ✅ BCrypt password hashing
- ✅ Zaštićeni API endpointi (POST, PUT, DELETE)
- ✅ Role-based authorization (Admin role)
- ✅ Token expiration (8h)

### 2. **Frontend Sigurnost**
- ✅ Login forma sa korisničkim imenom i lozinkom
- ✅ JWT token se čuva u localStorage
- ✅ Automatsko slanje tokena sa svakim zahtevom
- ✅ Automatsko odjavljivanje pri isteku tokena

### 3. **Konfiguracija**
- ✅ Jaka default lozinka: `AdminPass2026!`
- ✅ JWT secret konfigurisan
- ✅ Environment varijable ažurirane

---

## 🚀 Kako Koristiti

### **PRVI PUT - Podesi Lozinku**

1. Otvori `backend/.env` fajl
2. Nađi linije:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=VlkuAdmin2026!Strong#Pass
   ```
3. **Promeni lozinku** u nešto još jače (minimum 12 karaktera)
4. Sačuvaj fajl

### **Pokretanje Aplikacije**

**Zaustavi trenutne procese** (ako su pokrenuti):
```powershell
# U dotnet terminalu
Ctrl+C

# U node terminalu
Ctrl+C
```

**Pokrenite backend:**
```powershell
cd backend
dotnet restore
dotnet run
```

**Pokrenite frontend** (u drugom terminalu):
```powershell
cd frontend
npm run dev
```

### **Prijavljivanje na Admin Panel**

1. Otvori browser: http://localhost:3000/admin
2. Unesi kredencijale:
   - **Korisničko ime:** `admin`
   - **Lozinka:** `AdminPass2026!`
3. Klikni "Prijava"

✅ Admin panel se otvara - sada možeš upravljati knjigama!

---

## 🔐 Sigurnosne Karakteristike

### Šta je Zaštićeno?
✅ `/api/books` POST - Kreiranje knjiga  
✅ `/api/books/{id}` PUT - Ažuriranje knjiga  
✅ `/api/books/{id}` DELETE - Brisanje knjiga  

### Šta je Javno?
✅ `/api/books` GET - Pregledanje knjiga (za kupce)  
✅ `/api/books/{id}` GET - Detalji knjige  

### Šta se Dešava Bez Autentifikacije?
❌ Pokušaj kreiranja/ažuriranja/brisanja → **401 Unauthorized**  
✅ Pregled knjiga → **200 OK** (kupci mogu pregledati)

---

## 📝 Promenjeni Fajlovi

### Backend
- ✅ `backend/backend.csproj` - Dodati JWT i BCrypt paketi
- ✅ `backend/Controllers/AuthController.cs` - Novi kontroler za login
- ✅ `backend/Controllers/BooksController.cs` - Dodati [Authorize] atributi
- ✅ `backend/Program.cs` - JWT middleware konfiguracija
- ✅ `backend/appsettings.json` - JWT i Admin konfiguracija
- ✅ `backend/appsettings.Production.json` - Production settings
- ✅ `backend/.env` - Admin kredencijali i JWT secret
- ✅ `backend/.env.example` - Template sa novim varijablama

### Frontend
- ✅ `frontend/src/components/admin/AdminPanel.tsx` - JWT autentifikacija

### Dokumentacija
- ✅ `SECURITY_GUIDE.md` - Kompletan sigurnosni vodič
- ✅ `ADMIN_SECURITY_UPDATE.md` - Ovaj fajl

---

## 🧪 Test Autentifikacije

### Test 1: Pokušaj Pristupa Bez Tokena
```bash
curl -X POST http://localhost:5002/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Test","price":100,"stock":5}'
```
**Očekivano:** `401 Unauthorized` ✅

### Test 2: Prijava
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"AdminPass2026!"}'
```
**Očekivano:** `{"token":"eyJhbGc...","message":"Uspešna prijava."}` ✅

### Test 3: Kreiranje sa Tokenom
```bash
TOKEN="eyJhbGc..." # Kopiraj token iz prethodnog zahteva

curl -X POST http://localhost:5002/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Nova Knjiga","author":"Autor","price":1000,"stock":5}'
```
**Očekivano:** `201 Created` ✅

---

## 🔑 Podešavanje Jake Lozinke

### Opcija 1: Plain Text (Jednostavnije)
```env
ADMIN_PASSWORD=TvojaSuperJakaLozinka2026!#$
```

### Opcija 2: BCrypt Hash (Najsigurnije)

1. Idi na: https://bcrypt-generator.com/
2. Unesi lozinku
3. Rounds: 11
4. Kopiraj hash
5. U `.env`:
   ```env
   ADMIN_PASSWORD=HASHED:$2a$11$tvoj-generisani-hash-ovde
   ```

**Primer:**
```env
ADMIN_PASSWORD=HASHED:$2a$11$LGfj5K1p0Yr.8HnV1CXSZO7bWVxJrYvKhLx/Z9RqF8J.5K1p0Yr.8
```

---

## ⚠️ VAŽNO - Pre Deployementa

Kada budeš postavio aplikaciju na server:

- [ ] Promeni `ADMIN_USERNAME` i `ADMIN_PASSWORD`
- [ ] Generiši novi `JWT_SECRET` (minimum 32 karaktera)
- [ ] Koristi BCrypt hash za lozinku
- [ ] Aktiviraj HTTPS (SSL certifikat)
- [ ] Ne komituj `.env` fajl u Git

**Generiši JWT Secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Minimum 0 -Maximum 256}))

# Ili online: https://generate-random.org/api-token-generator
```

---

## 🐛 Uobičajeni Problemi

### Problem: "401 Unauthorized" pri admin operacijama
**Rešenje:**
1. Odjavi se i prijavi ponovo
2. Token ističe nakon 8h - moguće je da je istekao

### Problem: "Pogrešna lozinka"
**Rešenje:**
1. Proveri `ADMIN_USERNAME` i `ADMIN_PASSWORD` u `backend/.env`
2. Restartuj backend nakon promene
3. Ako koristiš hash, proveri da počinje sa `HASHED:`

### Problem: Backend ne pokreće se
**Rešenje:**
```powershell
cd backend
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Problem: Ne mogu pristupiti /admin
**Rešenje:**
1. Proveri da backend radi (http://localhost:5002/api/books)
2. Proveri da frontend radi (http://localhost:3000)
3. Otvori F12 Console i proveri greške

---

## 📚 Dodatna Dokumentacija

Za detaljnije informacije:
- **Kompletna sigurnost:** `SECURITY_GUIDE.md`
- **Deployment:** `DEPLOYMENT_GUIDE.md`
- **Environment varijable:** `ENV_GUIDE.md`
- **Setup:** `SETUP_GUIDE.md`

---

## ✅ Provera - Da li Radi?

1. ✅ Backend se pokreće bez grešaka
2. ✅ Frontend se pokreće
3. ✅ Login forma se pojavljuje na `/admin`
4. ✅ Prijava sa kredencijalima radi
5. ✅ Možeš dodati/urediti/obrisati knjige
6. ✅ Odjava radi

**Sve je OK? Admin panel je sada siguran! 🎉**

---

## 💬 Pitanja?

Ako imaš problema ili pitanja:
1. Proveri `SECURITY_GUIDE.md`
2. Proveri backend logove
3. Proveri browser Console (F12)
4. Testuj API endpointe sa curl

**Status:** 🔒 **Admin panel je sada zaštićen jakom autentifikacijom!**
