document.addEventListener('DOMContentLoaded', () => {
    // --- Global State ---
    let apiKey = null;

    // --- DOM Elements ---
    // Menu & Settings
    const menuButton = document.getElementById('menu-button');
    const body = document.body;
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModule = document.getElementById('settings_module');

    // Font Switching
    const fontSelect = document.getElementById('font-select');
    const themeSelect = document.getElementById('theme-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const glowToggle = document.getElementById('glow-toggle');

    // Spiciness
    const eventsToggle = document.getElementById('events-toggle');
    const nsfwLevelToggle = document.getElementById('nsfw-level-toggle');

    // API Key Section
    const apiKeyInput = document.getElementById('api-key-input');
    const toggleApiKeyVisibilityButton = document.getElementById('toggle-api-key-visibility');
    const apiKeyStorageToggle = document.getElementById('api-key-storage-toggle');
    const storageStatus = document.getElementById('storage-status');
    const applyApiKeyButton = document.getElementById('apply-api-key');
    const clearApiKeyButton = document.getElementById('clear-api-key');

    // Prompt & Narrative
    const promptInput = document.getElementById('prompt-input');
    const sendPromptButton = document.getElementById('send-prompt');
    const narrativeOutput = document.getElementById('narrative-output');

    // --- Functions ---

    const saveSettings = () => {
        const settings = {
            font: fontSelect.value,
            theme: themeSelect.value,
            fontSize: fontSizeSelect.value,
            glow: glowToggle.checked,
            events: eventsToggle.checked,
            nsfwLevel: nsfwLevelToggle.checked,
        };
        localStorage.setItem('userSettings', JSON.stringify(settings));
    };

    const loadSettings = () => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            fontSelect.value = settings.font || "'Hachi Maru Pop', cursive";
            themeSelect.value = settings.theme || "Default";
            fontSizeSelect.value = settings.fontSize || "12pt";
            glowToggle.checked = settings.glow !== false; // Default to true
            eventsToggle.checked = settings.events === true; // Default to false
            nsfwLevelToggle.checked = settings.nsfwLevel === true; // Default to false

            // Apply settings
            body.style.fontFamily = fontSelect.value;
            body.style.fontSize = fontSizeSelect.value;
            if (glowToggle.checked) {
                body.classList.add('text-glow');
            } else {
                body.classList.remove('text-glow');
            }
        } else {
            // Default settings for first-time users
            body.style.fontFamily = fontSelect.value;
            body.style.fontSize = fontSizeSelect.value;
            body.classList.add('text-glow');
        }
    };

    const updatePromptBarState = (isBusy = false) => {
        if (apiKey && !isBusy) {
            promptInput.disabled = false;
            sendPromptButton.disabled = false;
            promptInput.placeholder = "Enter your prompt...";
        } else {
            promptInput.disabled = true;
            sendPromptButton.disabled = true;
            if (isBusy) {
                promptInput.placeholder = "Thinking...";
            } else {
                promptInput.placeholder = "Please set your API key in the settings menu.";
            }
        }
    };

    const runQuery = async () => {
        const prompt = promptInput.value.trim();
        if (!prompt || !apiKey) {
            return;
        }

        narrativeOutput.textContent = "Hmm, lemme think...";
        updatePromptBarState(true); // Disable input while thinking

        try {
            const genAI = new window.GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            narrativeOutput.textContent = text;
        } catch (error) {
            console.error("Error with Gemini API:", error);
            narrativeOutput.textContent = `An error occurred: ${error.message}`;
        } finally {
            updatePromptBarState(false); // Re-enable input
            promptInput.value = ''; // Clear input after sending
        }
    };

    // --- Event Listeners ---

    // 1. Menu Toggle
    menuButton.addEventListener('click', () => {
        const isOpen = body.classList.contains('menu-open');
        body.classList.toggle('menu-open');
        if (isOpen) settingsModule.classList.remove('active');
    });

    // 2. Settings Module Toggle
    settingsIcon.addEventListener('click', () => {
        settingsModule.classList.toggle('active');
    });

    // 3. Settings Changes
    fontSelect.addEventListener('change', () => {
        body.style.fontFamily = fontSelect.value;
        saveSettings();
    });

    themeSelect.addEventListener('change', saveSettings);

    fontSizeSelect.addEventListener('change', () => {
        body.style.fontSize = fontSizeSelect.value;
        saveSettings();
    });

    glowToggle.addEventListener('change', () => {
        body.classList.toggle('text-glow', glowToggle.checked);
        saveSettings();
    });

    eventsToggle.addEventListener('change', saveSettings);
    nsfwLevelToggle.addEventListener('change', saveSettings);


    // 4. API Key Visibility
    toggleApiKeyVisibilityButton.addEventListener('click', () => {
        const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        apiKeyInput.setAttribute('type', type);
    });

    // 5. API Key Storage Toggle
    apiKeyStorageToggle.addEventListener('change', () => {
        storageStatus.textContent = apiKeyStorageToggle.checked ? 'Saved' : 'Unsaved';
    });

    // 6. Apply API Key
    applyApiKeyButton.addEventListener('click', () => {
        apiKey = apiKeyInput.value.trim();
        if (apiKeyStorageToggle.checked) { // "Saved"
            localStorage.setItem('geminiApiKey', apiKey);
            sessionStorage.removeItem('geminiApiKey');
        } else { // "Unsaved"
            sessionStorage.setItem('geminiApiKey', apiKey);
            localStorage.removeItem('geminiApiKey');
        }
        alert('API Key applied!');
        updatePromptBarState();
    });

    // 7. Clear API Key
    clearApiKeyButton.addEventListener('click', () => {
        localStorage.removeItem('geminiApiKey');
        sessionStorage.removeItem('geminiApiKey');
        apiKeyInput.value = '';
        apiKey = null;
        apiKeyStorageToggle.checked = false;
        storageStatus.textContent = 'Unsaved';
        alert('API Key cleared!');
        updatePromptBarState();
    });

    // 8. Prompt Submission
    sendPromptButton.addEventListener('click', runQuery);
    promptInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            runQuery();
        }
    });

    // --- Initial Page Load Logic ---

    loadSettings();

    const localKey = localStorage.getItem('geminiApiKey');
    const sessionKey = sessionStorage.getItem('geminiApiKey');

    if (localKey) {
        apiKey = localKey;
        apiKeyInput.value = localKey;
        apiKeyStorageToggle.checked = true;
        storageStatus.textContent = 'Saved';
    } else if (sessionKey) {
        apiKey = sessionKey;
        apiKeyInput.value = sessionKey;
    }

    updatePromptBarState();
});
