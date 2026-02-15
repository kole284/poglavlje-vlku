# 🔐 Environment Variables Configuration Guide

Ovaj fajl objašnjava kako da konfigurišeš environment varijable za aplikaciju.

## 📋 Pregled

Aplikacija koristi environment varijable za sve osetljive podatke (API ključevi, lozinke, email kredencijali, itd.). **Nikada ne komituj .env fajlove u Git!**

---

## 🔧 Backend Environment Varijable

### Fajl: `backend/.env`

```bash
# Kopiraj template i popuni vrednosti
cp backend/.env.example backend/.env
```

### Konfiguracija:

#### 1. **SMTP Email Settings**
Za slanje email obaveštenja kada neko napravi kupovinu:

```env
SMTP_HOST=smtp.gmail.com          # Gmail SMTP server
SMTP_PORT=587                     # SMTP port
SMTP_ENABLE_SSL=true              # SSL encryption
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password   # Gmail App Password (ne obična lozinka!)
SMTP_FROM=your-email@gmail.com    # Email pošiljaoca
SMTP_TO=shop-email@gmail.com      # Email za primanje narudžbina
```

**📧 Kako dobiti Gmail App Password:**
1. Idi na https://myaccount.google.com/security
2. Aktiviraj "2-Step Verification"
3. Idi na "App passwords"
4. Kreiraj novi app password za "Mail"
5. Kopiraj 16-cifreni kod u `SMTP_PASSWORD`

#### 2. **Database Connection**
```env
CONNECTION_STRING=Data Source=/app/data/books.db
```
Ovo je putanja do SQLite baze. U Docker kontejneru se čuva u `/app/data/`.

#### 3. **Application Settings**
```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5002
```

---

## 🎨 Frontend Environment Varijable

### Fajl: `frontend/.env.production`

```bash
# Kopiraj template i popuni vrednosti
cp frontend/.env.example frontend/.env.production
```

### Konfiguracija:

```env
# Za lokalno testiranje:
NEXT_PUBLIC_API_URL=http://localhost:5002/api

# Za produkciju sa domenom:
NEXT_PUBLIC_API_URL=http://your-domain.com/api

# Za produkciju sa IP adresom:
NEXT_PUBLIC_API_URL=http://123.45.67.89/api
```

**⚠️ Važno:** `NEXT_PUBLIC_` prefix znači da je varijabla vidljiva u browseru. Ne stavljaj osetljive podatke ovde!

---

## 🐳 Docker Deployment

Kada koristiš Docker Compose, environment varijable se automatski učitavaju iz `.env` fajlova:

```yaml
# docker-compose.yml
backend:
  env_file:
    - ./backend/.env
    
frontend:
  env_file:
    - ./frontend/.env.production
```

---

## 🚀 Deployment Checklist

Pre nego što okačiš aplikaciju na server:

- [ ] Kreirao si `backend/.env` iz `backend/.env.example`
- [ ] Kreirao si `frontend/.env.production` iz `frontend/.env.example`
- [ ] Popunio si Gmail SMTP kredencijale
- [ ] Postavio si pravi API URL u frontend env
- [ ] Proverio si da `.gitignore` ignoriše `.env` fajlove
- [ ] **NIKADA nisi komitovao `.env` fajlove u Git!**

---

## 📂 Struktura Fajlova

```
poglavlje-vlku/
├── backend/
│   ├── .env                  ← Tvoji pravi kredencijali (NE KOMITUJ!)
│   ├── .env.example          ← Template (OK za commit)
│   ├── appsettings.json      ← Prazne vrednosti
│   └── appsettings.Production.json
│
├── frontend/
│   ├── .env.production       ← API URL (NE KOMITUJ!)
│   ├── .env.example          ← Template (OK za commit)
│   └── .gitignore            ← Ignoriše .env fajlove
│
└── .gitignore                ← Root gitignore
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Koristi `.env.example` fajlove kao template
- Dodaj sve `.env` fajlove u `.gitignore`
- Koristi različite kredencijale za development i production
- Koristi App Passwords umesto običnih lozinki
- Regularly rotate passwords i API keys

### ❌ DON'T:
- **NIKADA ne komituj `.env` fajlove u Git!**
- Ne deliti `.env` fajlove putem email/chat
- Ne čuvaj lozinke u plain text van `.env` fajlova
- Ne koristi iste kredencijale na više servera

---

## 🛠️ Kako Promeniti Environment Varijable na Serveru

### 1. SSH u server:
```bash
ssh root@your-server-ip
cd /opt/poglavlje-vlku
```

### 2. Edituj .env fajl:
```bash
nano backend/.env
# ili
nano frontend/.env.production
```

### 3. Restartuj aplikaciju:
```bash
docker compose restart backend
# ili
docker compose restart frontend
```

---

## 🐛 Troubleshooting

### Problem: Email se ne šalje

1. Proveri SMTP kredencijale u `backend/.env`:
```bash
cat backend/.env
```

2. Proveri da li je App Password tačan (16 cifara bez razmaka)

3. Proveri logove:
```bash
docker compose logs backend
```

### Problem: Frontend ne može da se poveže sa backendom

1. Proveri API URL u `frontend/.env.production`:
```bash
cat frontend/.env.production
```

2. Trebalo bi da bude:
   - Za Docker internal: `http://backend:5002/api`
   - Za public access: `http://your-domain.com/api`

3. Rebuild frontend:
```bash
docker compose up -d --build frontend
```

---

## 📞 Support

Ako naiđeš na probleme sa environment varijablama, proveri:

1. Da li `.env` fajlovi postoje
2. Da li su sve vrednosti popunjene
3. Da li nema razmaka oko `=` znaka
4. Da li su kredencijali tačni

**Format:**
```env
CORRECT=value_without_spaces
WRONG = value with spaces
```

---

## 🎯 Summary

- **Backend `.env`** → SMTP kredencijali + database config
- **Frontend `.env.production`** → API URL
- **`.env.example` fajlovi** → Template za druge developere
- **`.gitignore`** → Zaštita da ne komituješ kredencijale

**Zapamti: Environment varijable = tajne informacije koje držiš van koda! 🔐**
