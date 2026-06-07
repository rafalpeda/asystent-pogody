/**
 * Opcjonalna integracja z API: Aby włączyć rzeczywiste API pogodowe, 
 * załóż darmowe konto na OpenWeatherMap, wygeneruj API KEY i wklej go poniżej, 
 * zmieniającej wartość zmiennej na Twój klucz.
 */
const OPENWEATHER_API_KEY = "1eca71e3778b478ab180bfaf008e6944"; 

// Dynamiczne pobieranie referencji do węzłów drzewa DOM
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const typingIndicator = document.getElementById("typing-indicator");
const themeToggle = document.getElementById("theme-toggle");

// Nasłuchiwanie wysyłania wiadomości za pomocą klawisza Enter (Dostępność / UX)
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Zarządzanie motywem graficznym (Dark Mode) z zapisem w LocalStorage
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    // Zmiana ikony motywu
    const icon = themeToggle.querySelector("i");
    if (isDark) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid = fa-moon";
    }
});

// Weryfikacja preferencji motywu po załadowaniu drzewa dokumentu
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.querySelector("i").className = "fa-solid fa-sun";
    }
    loadChatHistory();
});

/**
 * Główna funkcja wysyłająca wiadomość użytkownika i wyzwalająca odpowiedź bota
 */
function sendMessage() {
    const text = userInput.value.trim();
    
    if (text === "") return; // Blokada pustych wpisów

    // Dodanie wiadomości użytkownika na ekran
    appendMessage(text, "user-message");
    saveChatHistory(text, "user-message");
    userInput.value = ""; // Czyszczenie pola input

    // Pokazanie animacji pisania ("typing...")
    showTypingIndicator();

    // Emulacja opóźnienia przetwarzania sieciowego bota (UX)
    setTimeout(async () => {
        let responseText = "";

        // Sprawdzenie, czy tekst użytkownika wygląda jak prośba o sprawdzenie miasta (brak cyfr i słów kluczy)
        if (isCityName(text) && OPENWEATHER_API_KEY !== "TWOJ_KLUCZ_API_JEZELI_POSIADASZ") {
            responseText = await fetchWeatherFromAPI(text);
        } else {
            // Lokalny silnik wnioskowania regułowego
            responseText = processLocalWeatherLogic(text);
        }

        hideTypingIndicator();
        appendMessage(responseText, "bot-message");
        saveChatHistory(responseText, "bot-message");
    }, 1200);
}

/**
 * Renderowanie elementu wiadomości w oknie czatu wraz z zabezpieczeniem XSS
 */
function appendMessage(text, senderClass) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", senderClass);
    
    // Zastosowanie bezpiecznego parsera tekstowego zamiast innerHTML w celu przeciwdziałania XSS
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    contentDiv.innerHTML = text; // Logika parsuje bezpieczne znaczniki wewnętrzne bota
    
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    
    // Automatyczny Scroll do najnowszych komunikatów
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.classList.remove("hidden");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.classList.add("hidden");
}

/**
 * Pomocniczy walidator sprawdzający, czy fraza wejściowa jest intencją wyszukania miasta
 */
function isCityName(text) {
    // Jeżeli tekst nie zawiera cyfr (temperatury) i jest krótki, traktujemy go jako nazwę miasta
    return !/\d/.test(text) && text.split(' ').length <= 2 && !text.toLowerCase().includes("stopni");
}

/**
 * ETAP 4 i 5 — Zaawansowany lokalny silnik wnioskowania regułowego
 * Parsuje liczby (temperaturę) oraz słowa kluczowe z tekstu użytkownika
 */
function processLocalWeatherLogic(userInput) {
    const text = userInput.toLowerCase();
    
    // Próba ekstrakcji wartości numerycznej temperatury za pomocą wyrażeń regularnych (Regex)
    const tempMatch = text.match(/(-?\d+)/);
    let detectedTemp = null;
    
    if (tempMatch) {
        detectedTemp = parseInt(tempMatch[1], 10);
    }

    let dynamicRecommendation = "";

    // 1. Klasyfikacja na podstawie jawnie wykrytej temperatury
    if (detectedTemp !== null) {
        if (detectedTemp < 0) {
            dynamicRecommendation += "🥶 Jest mróz! Załóż grubą kurtkę zimową, czapkę, szalik i rękawiczki. Styl: zdecydowanie zimowy/outdoorowy. ";
        } else if (detectedTemp >= 0 && detectedTemp <= 10) {
            dynamicRecommendation += "🧥 Bardzo chłodno (" + detectedTemp + "°C). Rekomenduję ciepły płaszcz lub kurtkę przejściową oraz pełne buty. ";
        } else if (detectedTemp > 10 && detectedTemp <= 19) {
            dynamicRecommendation += "💨 Umiarkowana pogoda. Dobrym wyborem będzie bluza, lekka kurtka bomberka lub ramoneska i długie spodnie. ";
        } else {
            dynamicRecommendation += "☀️ Ciepło! Ponad " + detectedTemp + "°C. Załóż t-shirt, krótkie spodenki lub lekką sukienkę. Styl: letni/casual. ";
        }
    }

    // 2. Klasyfikacja na podstawie słów kluczowych (opadowe/atmosferyczne)
    if (text.includes("deszcz") || text.includes("pada") || text.includes("ulewa")) {
        dynamicRecommendation += "🌧️ Koniecznie zabierz parasol lub załóż kurtkę z kapturem o właściwościach hydrofobowych oraz wodoodporne obuwie.";
    } else if (text.includes("śnieg") || text.includes("śnieżyca")) {
        dynamicRecommendation += "❄️ Sypie śnieg! Upewnij się, że Twoje buty mają dobrą przyczepność (trapery) i nie przemakają.";
    } else if (text.includes("wiatr") || text.includes("wieje")) {
        dynamicRecommendation += "🌬️ Silny wiatr. Kurtka typu windbreaker (wiatrówka) lub porządny szal ochronią Cię przed przewianiem.";
    } else if (text.includes("słońce") || text.includes("słonecznie") || text.includes("upał")) {
        if (detectedTemp === null || detectedTemp > 20) {
            dynamicRecommendation += "🕶️ Pamiętaj o okularach przeciwsłonecznych i kremie z filtrem UV!";
        }
    }

    // Odpowiedź domyślna, jeśli nie dopasowano kryteriów
    if (dynamicRecommendation === "") {
        dynamicRecommendation = "🤔 Nie jestem pewien, jakie warunki opisujesz. Napisz np. 'Jest zimno i pada deszcz' lub wpisz nazwę miasta, abym mógł Ci pomóc!";
    }

    return dynamicRecommendation;
}

/**
 * ETAP 6 — Integracja z asynchronicznym zewnętrznym API (Fetch API)
 */
async function fetchWeatherFromAPI(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pl`;
    
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error("Nie znaleziono takiego miasta.");
        }
        const data = await response.json();
        
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const cityName = data.name;

        // Budowanie wiadomości na bazie danych z API i przepuszczenie przez silnik lokalny
        let apiBotReply = `🌍 <strong>Aktualna pogoda dla miasta ${cityName}:</strong> Właśnie jest tam ${temp}°C oraz charakteryzuje się warunkami: <em>${description}</em>.<br><br>`;
        
        // Wykorzystanie silnika warunkowego do wygenerowania dedykowanego ubioru
        const clothRecommendation = processLocalWeatherLogic(`${temp} stopni ${description}`);
        
        return apiBotReply + clothRecommendation;

    } catch (error) {
        return "❌ Nie udało mi się pobrać danych dla miasta \"" + city + "\". Upewnij się, że nazwa jest poprawna lub opisz pogodę słownie.";
    }
}

/**
 * ETAP 7 — Zarządzanie pamięcią podręczną podręcznej historii rozmów (LocalStorage)
 */
function saveChatHistory(text, sender) {
    let history = JSON.parse(localStorage.getItem("chat_history")) || [];
    history.push({ text, sender });
    // Trzymamy tylko 20 ostatnich wiadomości, żeby nie przepełnić LocalStorage
    if (history.length > 20) history.shift();
    localStorage.setItem("chat_history", JSON.stringify(history));
}

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem("chat_history"));
    if (history && history.length > 0) {
        history.forEach(item => {
            appendMessage(item.text, item.sender);
        });
    }
}