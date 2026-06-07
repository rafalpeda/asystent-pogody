[README (1).md](https://github.com/user-attachments/files/28683025/README.1.md)
# 🌤️ Wirtualny Asystent Obywatela z Integracją Centrali Głosowej (PSTN & MS Teams Direct Routing)

Nowoczesna, dynamiczna aplikacja webowa typu **SPA (Single Page Application)** realizująca zadanie inteligentnego agenta AI dla administracji publicznej. Projekt łączy automatyczną analizę tekstu (bot doradzający ubiór oraz procedury urzędowe) z zaawansowaną makietą wysokiej wierności (**High-Fidelity Prototype**) wielokanałowej centrali telefonicznej opartej na architekturze korporacyjnej.

---

## 📋 Spis Treści
1. [Funkcjonalności Projektu](#-funkcjonalności-projektu)
2. [Struktura Plików](#-struktura-plików)
3. [Architektura Systemu i Przepływ Sygnalizacji](#-architektura-systemu-i-przepływ-sygnalizacji)
4. [Logika Przetwarzania w JavaScript](#-logika-przetwarzania-w-javascript)
5. [Strategia i Scenariusze Testowe (QA)](#-strategia-i-scenariusze-testowe-qa)
6. [Instrukcja Uruchomienia i Wdrożenia](#-instrukcja-uruchomienia-i-wdrożenia)

---

## ✨ Funkcjonalności Projektu

Projekt został zaimplementowany zgodnie z zasadami **Clean Code**, standardami **UI/UX (Modern Corporate Design)** oraz wytycznymi dotyczącymi dostępności cyfrowej (**WCAG**):
* **Inteligentny Parser Regułowy (NLP/Regex):** Bot analizuje wprowadzany tekst. Jeśli wykryje frazy pogodowe, temperaturę lub słowa kluczowe (np. *SBC*, *Teams*, *PSTN*, *kontakt*), reaguje dynamicznie i kontekstowo.
* **Makieta Centrali Omnichannel:** Panel boczny umożliwia symulację tradycyjnego dialera telefonicznego PSTN oraz konfigurację sesji wideo w Microsoft Teams.
* **Symulacja Sygnalizacji Telekomunikacyjnej:** Zaimplementowano asynchroniczne opóźnienia modelujące rzeczywiste czasy negocjacji sesji w sieciach rozproszonych. Logi sygnalizacyjne są wypisywane bezpośrednio w oknie czatu (widok dla użytkownika) oraz w konsoli deweloperskiej (widok dla testera QA).
* **Zabezpieczenie przed atakami XSS:** Dane wejściowe od użytkownika są w pełni oczyszczane przed renderowaniem w drzewie DOM za pomocą dedykowanej funkcji mapującej znaki specjalne.

---

## 📂 Struktura Plików

```text
weather-chatbot/
│
├── asystent.html    # Struktura semantyczna DOM, kontenery dostępności i widgety centrali
├── style.css        # Kompletny arkusz stylów, layout Grid/Flexbox, RWD oraz style konsoli SIP
├── asystent.js      # Silnik wnioskowania bota, obsługa dialera, liczników i stanów VoIP
└── README.md        # Pełna dokumentacja techniczna i testerska projektu
```

---

## ⚙️ Architektura Systemu i Przepływ Sygnalizacji

W celu integracji platformy webowej i tradycyjnej sieci telefonicznej (PSTN) z ekosystemem Microsoft 365, w architekturze produkcyjnej zastosowano certyfikowany kontroler **AudioCodes Mediant SBC** działający w trybie **Microsoft Teams Direct Routing**.

### Schemat Blokowy Infrastruktury

```text
  [ Obywatel / Przeglądarka ] 
               │
               ▼ (Połączenie głosowe / Telefonia miejska)
  +------------------------------------------+
  |    Publiczna Sieć Telefoniczna (PSTN)    |
  +------------------------------------------+
               │
               ▼ [Trunk SIP - Kodek G.711 / Sygnalizacja UDP/TCP]
  +------------------------------------------+
  |    AudioCodes Session Border Controller  | <-- Centralny węzeł translacji,
  |                 (SBC)                    |     bezpieczeństwa i routingu
  +------------------------------------------+
               │
               ▼ [Direct Routing - SIP TLS Port 5061 / Kodek SILK]
  +------------------------------------------+
  |       Chmura Microsoft 365 (Teams)       |
  +------------------------------------------+
               │
               ▼ (Natywny klient MS Teams)
  [ Urzędnik / Konsultant Wydziału ]
```

### Szczegółowy Przepływ Sesji (Call Flow) realizowany w kodzie:
1. **Inicjacja połączenia:** Klient wysyła żądanie zestawienia sesji (**SIP INVITE**) z sieci PSTN.
2. **Negocjacja na SBC:** Bramka AudioCodes SBC przechwytuje pakiet i odpowiada statusem **183 Session Progress**. W tym momencie następuje kluczowa rola SBC: translacja tradycyjnego kodeka wąskopasmowego operatora (**G.711**) na szerokopasmowy kodek preferowany przez Microsoft (**SILK** lub **G.722**).
3. **Zabezpieczenie TLS:** SBC zestawia bezpieczny szyfrowany trunk (mTLS) bezpośrednio z chmurą Microsoftu na dedykowanym porcie **5061**.
4. **Zestawienie sesji:** Chmura Teams zwraca status **200 OK**, uruchamiany jest licznik czasu, a strumień głosowy/wideo trafia bezpośrednio na aplikację Teams zalogowanego urzędnika.

---

## 🧠 Logika Przetwarzania w JavaScript

Silnik aplikacji (`asystent.js`) realizuje automatyczne mapowanie intencji na podstawie wejścia użytkownika. Poniższy fragment kodu obrazuje, jak aplikacja symuluje i loguje warstwę telekomunikacyjną opisaną w architekturze:

```javascript
if (lowerText.includes("teams") || lowerText.includes("sbc") || lowerText.includes("telefon")) {
  botMessage.innerHTML = "<strong>Bot (System):</strong> Inicjalizuję bezpieczną ścieżkę połączenia przez **SBC i Teams Direct Routing**...<br>" +
                         "<span class='telecom-log'>[PSTN] Sygnalizacja SIP INVITE przekazana do bramy...</span>";
  
  console.log("LOG QA: [PSTN -> SBC] Inicjacja sesji SIP INVITE");

  setTimeout(() => {
    botMessage.innerHTML += "<br><span class='telecom-log'>[SBC] Odebrano żądanie. Translacja nagłówków E.164 i kodeka G.711 na SILK...</span>";
    console.log("LOG QA: [SBC] Przetwarzanie zabezpieczeń i translacja strumienia audio.");
  }, 600);

  setTimeout(() => {
    botMessage.innerHTML += "<br><span class='telecom-log'>[Teams Direct Routing] Zestawiono trunk SIP TLS (Port 5061). Status: 200 OK.</span>";
    console.log("LOG QA: [SBC -> MS Teams] Połączenie powiązane z lokatorem Microsoft 365.");
  }, 1200);
}
```

---

## 🧪 Strategia i Scenariusze Testowe (QA)

Jako profesjonalne podejście testerskie (QA), weryfikacja tak zaawansowanego systemu wymaga wyjścia poza klasyczne testy UI i objęcia kontrolą warstwy sieciowej (analiza pakietów w programie **Wireshark**) oraz odporności infrastruktury (testy typu *Failover*).

### Macierz Przypadków Testowych (Test Cases)

| ID Przypadku | Obszar funkcjonalny | Opis testu / Warunek początkowy | Kroki testowe | Oczekiwany rezultat (Kryterium akceptacji) |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Integracja i Sygnalizacja SIP | Czat jest uruchomiony, użytkownik chce wymusić ścieżkę telekomunikacyjną. | 1. Wpisz w polu czatu: "Połącz przez Teams".<br>2. Kliknij "Wyślij". | System asynchronicznie wypluwa logi telekomunikacyjne. W konsoli deweloperskiej (`F12`) pojawiają się wpisy `LOG QA` odzwierciedlające komunikaty INVITE oraz 200 OK. |
| **TC-02** | Obsługa sygnałów DTMF | Trwa aktywne połączenie w panelu telefonicznym PSTN (status: IVR). | 1. Klikaj przyciski numeryczne na dialerze (np. `1`, `2`, `#`). | Na ekranie statusowym pojawia się komunikat o wysyłaniu tonów DTMF. W konsoli odkłada się log potwierdzający wysyłanie sygnałów zgodnie ze standardem RFC 2833. |
| **TC-03** | Test Walidacji i Bezpieczeństwa (XSS) | Pole input czatu jest aktywne. | 1. Wklej do inputu kod: `<script>alert('XSS')</script>`.<br>2. Kliknij Enter. | Skrypt nie wykonuje się. Znaki `<` oraz `>` zostają bezpiecznie podmienione na encje HTML. Tekst wyświetla się jako zwykły ciąg znamionowy. |
| **TC-04** | Interfejs i Maszyna Stanów | Wybrany jest kanał PSTN, trwa aktywne połączenie (timer nalicza sekundy). | 1. Spróbuj kliknąć zakładkę "MS Teams" podczas trwania rozmowy. | System blokuje przełączenie kanału, wyświetlając natywny komunikat `alert()` informujący o konieczności wcześniejszego rozłączenia rozmowy. |
| **TC-05** | Testy Wydajnościowe i Niezawodnościowe (Failover) | *Test teoretyczny infrastruktury AudioCodes SBC.* | 1. Symulacja nagłego odcięcia podstawowego łącza internetowego / trunku SIP u operatora podczas trwającej rozmowy. | Kontroler AudioCodes SBC powinien automatycznie, bez zerwania trwającej rozmowy obywatela, przełączyć ruch (Failover) na zapasowe łącze zaprogramowane w regułach routingu IP. |

---

## 🚀 Instrukcja Uruchomienia i Wdrożenia

### Uruchomienie lokalne
1. Pobierz pliki `asystent.html`, `style.css` oraz `asystent.js` i zapisz je w **jednym, wspólnym folderze** na dysku komputera lub telefonu.
2. Uruchom plik `asystent.html` za pomocą dowolnej nowoczesnej przeglądarki internetowej (Chrome, Firefox, Edge, Safari).
3. Aby przeglądać logi inżynierskie QA, naciśnij klawisz **F12** i przejdź do zakładki **Konsola** (Console).

### Publikacja w środowisku produkcyjnym (GitHub Pages)
1. Utwórz nowe, publiczne repozytorium na swoim koncie GitHub.
2. Wgraj do niego strukturę trzech plików projektu bezpośrednio do gałęzi głównej (`main`).
3. Przejdź do zakładki **Settings** -> **Pages**.
4. W sekcji *Build and deployment* jako Source wybierz `Deploy from a branch`, wskaż gałąź `main` / folder `/root` i kliknij **Save**.
5. Po około minucie Twoja aplikacja będzie dostępna publicznie na całym świecie pod adresem: `https://twój-username.github.io/nazwa-repozytorium/`.
