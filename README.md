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

De frontend is nu live op Vercel en correct verbonden met de backend via CORS-configuratie.
