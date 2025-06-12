# 🚴‍♀️ Installatiehandleiding – Frontend (Cycling Manager)

Volg deze stappen om de frontend van het project correct te deployen op Vercel en te verbinden met de backend.

---

## 🌍 Frontend deployen op Vercel

1. Ga naar [https://vercel.com](https://vercel.com) en maak een account aan (bijv. via GitHub).
2. Ga naar je **Projecten** en klik op **New Project**.
3. Importeer het frontend-project vanuit je Git repository.
4. Geef het project een naam en klik op **Deploy**.
5. Wacht tot de deployment is voltooid.
6. Kopieer de URL van de gedeployde frontend (bijvoorbeeld `https://jouw-projectnaam.vercel.app`).

---

## 🔄 Backend bijwerken met de nieuwe frontend-URL

1. Ga naar de backend repository van **Cycling Manager Scraper**.
2. Navigeer naar:

   ```
   src/main/java/ucll/be/procyclingscraper/controller
   ```

3. Open **alle bestanden** in deze map die de volgende regel bevatten:

   ```java
   @CrossOrigin(origins = "https://cycling-manager-frontend-psi.vercel.app")
   ```

4. Vervang deze regel in elk bestand met:

   ```java
   @CrossOrigin(origins = "https://JOUW-NIEUWE-FRONTEND-URL.vercel.app")
   ```

   > ❗ Vergeet niet om `"https://JOUW-NIEUWE-FRONTEND-URL.vercel.app"` te vervangen met jouw werkelijke Vercel frontend URL.

5. Sla deze wijzigingen op en deploy de backend opnieuw als nodig.

---

## ✅ Klaar!

De frontend is nu live op Vercel en correct verbonden met de backend via CORS-configuratie.\
\
# 🚴‍♂️ Cycling Manager – Lokale Opstartinstructies

Deze handleiding beschrijft stap voor stap hoe je het Cycling Manager-project lokaal opstart.

---

## 1. Repositories downloaden 📥

Download de volgende repositories (tak: `dev`):

- [Cycling Manager Scraper (Backend)](https://github.com/SanderDebroyer-UCLL/cycling-manager-scraper/tree/dev)
- [Cycling Manager Frontend](https://github.com/SanderDebroyer-UCLL/cycling-manager-frontend/tree/dev)

Pak de ZIP-bestanden uit en plaats ze samen in één hoofdmap, bijvoorbeeld `cycling-manager`:

cycling-manager/

├── cycling-manager-frontend/

└── cycling-manager-scraper/


---

## 2. Vereisten installeren 🛠️

### 2.1 Chocolatey installeren



1. Open PowerShell als Administrator (rechtsklik → "Als administrator uitvoeren").
2. Voer onderstaand commando uit:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) 
```

### 2.2 Nodige tools installeren via Chocolatey
Voer in dezelfde PowerShell-terminal de volgende commando's uit:

```
choco install nodejs -y
```
```
choco install openjdk -y
```
```
choco install maven -y
```
### 3. Docker Desktop installeren
Download en installeer Docker Desktop via:
https://docs.docker.com/desktop/setup/install/windows-install/

Zorg dat WSL2 of Hyper-V is ingeschakeld (Docker zal dit aangeven tijdens installatie).

`Herstart je computer en open Docker Desktop.`



## 4. Project opstarten 🚀
### Frontend starten
1. Open een terminal in de map cycling-manager-frontend

2. Installeer de dependencies:
```
npm install
```
3. Start de frontend:
```
npm run dev
```
De frontend draait op: http://localhost:3000

### Backend starten
1. Open een nieuwe terminal in de map cycling-manager-scraper

2. Start de Docker-containers:
```
docker compose up
```
3. Open nog een terminal in dezelfde map en start de Spring Boot-app:
```
mvn spring-boot:run
```
De backend draait op: http://localhost:8080

### Applicatie openen
Frontend: http://localhost:3000

Backend API: http://localhost:8080

## Veelvoorkomende problemen

| Probleem                    | Oplossing                                                       |
|-----------------------------|------------------------------------------------------------------|
| `docker compose up` faalt  | Zorg dat Docker Desktop actief is                               |
| Poort al in gebruik         | Controlleer of de front-end of back-end al in een andere terminal draaid   |
