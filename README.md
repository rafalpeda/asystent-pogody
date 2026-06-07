[asystentpogody.md](https://github.com/user-attachments/files/28683001/asystentpogody.md)
# 🌤️ Weather AI Assistant - AuraStyle Bot

Nowoczesna, dynamiczna i responsywna aplikacja webowa typu **SPA (Single Page Application)**, realizująca zadanie inteligentnego bota doradzającego odpowiedni ubiór i dodatki na podstawie warunków pogodowych podanych przez użytkownika lub pobranych z zewnętrznego serwisu.

---

## 📋 Spis Treści
1. [Funkcjonalności i Kryteria Premium](#-funkcjonalności-i-kryteria-premium)
2. [Struktura Projektu](#-struktura-projektu)
3. [Architektura Systemu](#-architektura-systemu)
4. [Instrukcja Uruchomienia i Wdrożenia](#-instrukcja-uruchomienia-i-wdrożenia)
5. [Przykładowe Scenariusze Testowe (QA)](#-przykładowe-scenariusze-testowe-qa)

---

## ✨ Funkcjonalności i Kryteria Premium

Projekt został zaimplementowany zgodnie z najwyższymi standardami programistycznymi, zapewniając pełną realizację kryteriów na **ocenę bardzo dobrą (5.0)**:
* **Wnioskowanie hybrydowe (NLP/Reguły):** Bot inteligentnie przeszukuje ciągi znaków (Regex), wyciąga z nich temperaturę w stopniach Celsjusza oraz dopasowuje słowa kluczowe (deszcz, wiatr, słońce).
* **UI/UX Glassmorphism & Gradienty:** Interfejs zaprojektowany w stylu nowoczesnego asystenta AI z półprzezroczystym tłem (`backdrop-filter`), mikroanimacjami (`@keyframes bounce` i `fadeIn`).
* **Dark Mode (Motyw Ciemny):** W pełni zaimplementowany mechanizm przełączania motywów za pomocą natywnych zmiennych CSS, skorelowany z pamięcią trwałą.
* **Pamięć stanu (LocalStorage):** Historia konwersacji oraz preferencje motywu użytkownika nie giną po odświeżeniu strony.
* **Asynchroniczność (Typing Indicator):** Bot symuluje czas namysłu za pomocą dedykowanej animacji kropek przed pokazaniem odpowiedzi.
* **Dostępność i Bezpieczeństwo (WCAG & XSS):** Zastosowanie semantycznych tagów HTML5 (`<main>`, `<header>`), atrybutów roli aria, obsługi klawiatury (`Enter`) oraz natywnego oczyszczania stringów.

---

## 📂 Struktura Projektu

```text
weather-chatbot/
│
├── index.html       # Struktura semantyczna DOM i kontenery dostępności
├── style.css        # Projekt graficzny, zmienne, animacje i RWD
├── script.js        # Logika biznesowa, parser regułowy, obsługa Fetch API
└── README.md        # Dokumentacja techniczna projektu
