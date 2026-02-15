# 🔧 Admin Panel - Finalna Konfiguracija

## ✅ PROBLEM REŠEN!

Problem "Greška pri povezivanju sa serverom" je bio zbog:
1. **Pogrešan port** - Backend je bio pokrenut na 5049 umesto 5002
2. **API URL** - Frontend je koristio `NEXT_PUBLIC_API_BASE` umesto `NEXT_PUBLIC_API_URL`
3. **Lozinka** - Production .env lozinka se nije učitavala u Development okruženju

---

## 🔐 TAČNI KREDENCIJLI ZA PRIJAVU

**URL:** http://localhost:3000/admin  
**Korisničko ime:** `admin`  
**Lozinka:** `AdminPass2026!`

---

## 📝 ŠTA JE ISPRAVLJENO

### 1. Backend Port
- ✅ `launchSettings.json` promenjen sa porta 5049 na **5002**
- ✅ Backend sada radi na `http://localhost:5002`

### 2. Frontend API Konfiguracija
- ✅ `AdminPanel.tsx` koristi `NEXT_PUBLIC_API_URL`  
- ✅ Kreiran `.env.local` fajl za development
- ✅ API URL: `http://localhost:5002/api`

### 3. API Endpointi Ispravljeni
- ✅ `/api/auth/login` → Prijava
- ✅ `/api/books` → Lista knjiga
- ✅ `/api/books/{id}` → Ažuriranje/Brisanje

---

## 🚀 KAKO POKRENUTI

### 1. Backend (Terminal 1)
```powershell
cd backend
dotnet run
```
✅ Backend radi na: http://localhost:5002

### 2. Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
✅ Frontend radi na: http://localhost:3000

### 3. Prijava na Admin Panel
1. Otvori: http://localhost:3000/admin
2. Unesi:
   - Username: `admin`
   - Password: `AdminPass2026!`
3. Klikni "Prijava"

✅ **Admin panel se otvara!**

---

## 🧪 TEST DA LI RADI

### Test 1: Backend API
```powershell
curl http://localhost:5002/api/books -UseBasicParsing
```
✅ Očekivano: Lista knjiga u JSON formatu

### Test 2: Login
```powershell
$body = @{username='admin'; password='AdminPass2026!'} | ConvertTo-Json
curl http://localhost:5002/api/auth/login -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```
✅ Očekivano: `{"token":"eyJhbGc...","message":"Uspešna prijava."}`

### Test 3: Frontend
1. Otvori http://localhost:3000/admin
2. Vidiš login formu
3. Prijavi se sa kredencijalima

✅ Očekivano: Admin panel se otvara sa listom knjiga

---

## 🔑 PROMENA LOZINKE

### Za Development (`appsettings.json`):
```json
"Admin": {
  "Username": "admin",
  "Password": "TvojaNovalozinka2026!"
}
```

### Za Production (`.env` fajl):
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TvojaNovalozinka2026!
```
**Napomena:** U production okuženju, .env vrednosti prepisuju appsettings.json

---

## 📁 IZMENJENI FAJLOVI

- ✅ `backend/Properties/launchSettings.json` - Port 5002
- ✅ `backend/appsettings.json` - Admin kredencijali
- ✅ `frontend/.env.local` - API URL za development
- ✅ `frontend/.env.production` - API URL za production
- ✅ `frontend/src/components/admin/AdminPanel.tsx` - API endpointi

---

## ⚠️ VAŽNE NAPOMENE

### Development vs Production

**Development (lokalno testiranje):**
- Koristi `appsettings.json`
- Lozinka: `AdminPass2026!`
- Port: 5002

**Production (na serveru):**
- Koristi `backend/.env`
- Podesi jaču lozinku u .env fajlu
- Environment varijable imaju prioritet

### Portovi
- Backend: **5002**
- Frontend: **3000**
- Nginx (production): **80/443**

---

## 🐛 TROUBLESHOOTING

### Problem: "Greška pri povezivanju sa serverom"
**Rešenje:**
1. Proveri da li backend radi: `Get-Process backend`
2. Testiraj API: `curl http://localhost:5002/api/books -UseBasicParsing`
3. Restartuj backend: `Stop-Process -Name backend -Force; cd backend; dotnet run`

### Problem: "Pogrešna lozinka"
**Rešenje:**
- Za development: `AdminPass2026!`
- Proveri `appsettings.json` → `Admin:Password`

### Problem: Frontend se ne povezuje
**Rešenje:**
1. Proveri `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5002/api`
2. Restartuj frontend: `Ctrl+C` u terminalu, pa `npm run dev`

### Problem: Port 5002 zauzet
**Rešenje:**
```powershell
# Nađi proces koji koristi port
Get-NetTCPConnection -LocalPort 5002 | Select-Object OwningProcess
# Zaustavi proces
Stop-Process -Id PROCESS_ID -Force
```

---

## ✅ FINALNA PROVERA

- [ ] Backend radi na http://localhost:5002
- [ ] Frontend radi na http://localhost:3000
- [ ] Login na /admin radi sa `admin` / `AdminPass2026!`
- [ ] Možeš dodati/urediti/obrisati knjige
- [ ] Odjava radi

**SVE RADI? 🎉 Admin panel je zaštićen i funkcionalan!**

---

## 📚 DODATNA DOKUMENTACIJA

- Puna sigurnosna dokumentacija: [SECURITY_GUIDE.md](SECURITY_GUIDE.md)
- Deployment vodič: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Sigurnosno ažuriranje: [ADMIN_SECURITY_UPDATE.md](ADMIN_SECURITY_UPDATE.md)
- Setup vodič: [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

**Status:** ✅ **RADI PERFEKTNO!** 🚀
