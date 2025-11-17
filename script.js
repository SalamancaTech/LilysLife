document.addEventListener('DOMContentLoaded', () => {
    // --- Global State ---
    let apiKey = null;

    // --- DOM Elements ---
    // Menu & Settings
    const menuButton = document.getElementById('menu-button');
    const body = document.body;
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModule = document.getElementById('settings_module');
    const saveloadIcon = document.getElementById('saveload-icon');
    const saveloadModule = document.getElementById('saveload_module');
    const newGameButton = document.getElementById('new-game-button');
    const saveSlotsContainer = document.getElementById('save-slots-container');


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

    const applyTheme = (theme) => {
        body.classList.remove('theme-default', 'theme-rgb', 'theme-pink', 'theme-blue', 'theme-black', 'theme-white');
        if (theme === 'Default') {
            body.classList.add('theme-default');
        } else if (theme === 'RGB') {
            body.classList.add('theme-rgb');
        } else if (theme === 'Pink') {
            body.classList.add('theme-pink');
        } else if (theme === 'Blue') {
            body.classList.add('theme-blue');
        } else if (theme === 'Black') {
            body.classList.add('theme-black');
        } else if (theme === 'White') {
            body.classList.add('theme-white');
        }
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
            applyTheme(themeSelect.value);
        } else {
            // Default settings for first-time users
            body.style.fontFamily = fontSelect.value;
            body.style.fontSize = fontSizeSelect.value;
            body.classList.add('text-glow');
            applyTheme('Default'); // Apply default theme
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

    // 2. Menu Navigation
    settingsIcon.addEventListener('click', () => {
        settingsModule.style.display = 'block';
        saveloadModule.style.display = 'none';
        settingsModule.classList.add('active');
    });

    saveloadIcon.addEventListener('click', () => {
        settingsModule.style.display = 'none';
        saveloadModule.style.display = 'block';
        renderSaveSlots();
    });

    // --- Save/Load Functions ---
    const getSaveData = () => {
        return {
            font: fontSelect.value,
            theme: themeSelect.value,
            fontSize: fontSizeSelect.value,
            glow: glowToggle.checked,
            events: eventsToggle.checked,
            nsfwLevel: nsfwLevelToggle.checked,
            timestamp: new Date().toLocaleString(),
            // Placeholders for future data
            preset1: 'DefaultPreset',
            preset2: 'StandardPlay'
        };
    };

    const saveGame = (slotIndex) => {
        const saveData = getSaveData();
        const saveSlots = getSaveSlots();

        // Check if the slot is empty, if so, assign a default name.
        if (!saveSlots[slotIndex]) {
            saveSlots[slotIndex] = {}; // Initialize if null
        }
        if (!saveSlots[slotIndex].name) {
            saveSlots[slotIndex].name = `Save Slot ${slotIndex + 1}`;
        }

        saveSlots[slotIndex].data = saveData;
        localStorage.setItem('saveSlots', JSON.stringify(saveSlots));
        renderSaveSlots();
        alert(`Game saved to Slot ${slotIndex + 1}`);
    };

    const loadGame = (slotIndex) => {
        const saveSlots = getSaveSlots();
        const slot = saveSlots[slotIndex];
        if (slot && slot.data) {
            const settings = slot.data;
            // Apply settings from the loaded data
            fontSelect.value = settings.font;
            themeSelect.value = settings.theme;
            fontSizeSelect.value = settings.fontSize;
            glowToggle.checked = settings.glow;
            eventsToggle.checked = settings.events;
            nsfwLevelToggle.checked = settings.nsfwLevel;

            // Trigger the change events to update the UI
            fontSelect.dispatchEvent(new Event('change'));
            themeSelect.dispatchEvent(new Event('change'));
            fontSizeSelect.dispatchEvent(new Event('change'));
            glowToggle.dispatchEvent(new Event('change'));
            eventsToggle.dispatchEvent(new Event('change'));
            nsfwLevelToggle.dispatchEvent(new Event('change'));

            alert(`Game loaded from Slot ${slotIndex + 1}`);
        } else {
            alert('No data to load from this slot.');
        }
    };

    const deleteGame = (slotIndex) => {
        if (confirm(`Are you sure you want to delete Save Slot ${slotIndex + 1}?`)) {
            const saveSlots = getSaveSlots();
            saveSlots[slotIndex] = null; // Clear the slot
            localStorage.setItem('saveSlots', JSON.stringify(saveSlots));
            renderSaveSlots();
            alert(`Save Slot ${slotIndex + 1} deleted.`);
        }
    };

    const copyGame = (slotIndex) => {
        const saveSlots = getSaveSlots();
        const sourceSlot = saveSlots[slotIndex];

        if (!sourceSlot) {
            alert('Cannot copy an empty slot.');
            return;
        }

        const nextEmptySlotIndex = saveSlots.findIndex(slot => !slot);
        if (nextEmptySlotIndex === -1) {
            alert('No available slots to copy to.');
            return;
        }

        // Deep copy of the data and a new name
        const newSave = JSON.parse(JSON.stringify(sourceSlot));
        newSave.name = `${sourceSlot.name} - COPY`;
        newSave.data.timestamp = new Date().toLocaleString(); // Update timestamp on copy

        saveSlots[nextEmptySlotIndex] = newSave;
        localStorage.setItem('saveSlots', JSON.stringify(saveSlots));
        renderSaveSlots();
        alert(`Copied Slot ${slotIndex + 1} to Slot ${nextEmptySlotIndex + 1}.`);
    };

    const getSaveSlots = () => {
        const slots = localStorage.getItem('saveSlots');
        // Ensure we always have an array of 5 slots
        let parsedSlots = slots ? JSON.parse(slots) : [];
        while (parsedSlots.length < 5) {
            parsedSlots.push(null);
        }
        return parsedSlots.slice(0, 5); // Ensure it's not more than 5
    };

    const renderSaveSlots = () => {
        const slots = getSaveSlots();
        saveSlotsContainer.innerHTML = ''; // Clear existing slots

        slots.forEach((slot, index) => {
            const slotEl = document.createElement('div');
            slotEl.className = 'save-slot';

            const isEmpty = !slot;
            const slotName = isEmpty ? `Save Slot ${index + 1}` : slot.name;
            const timestamp = isEmpty ? 'Empty' : slot.data.timestamp;
            const preset1 = isEmpty ? 'N/A' : slot.data.preset1;
            const preset2 = isEmpty ? 'N/A' : slot.data.preset2;

            slotEl.innerHTML = `
                <div class="slot-info">
                    <input type="text" class="save-name-input" value="${slotName}" data-slot-index="${index}">
                    <p class="timestamp">Timestamp: ${timestamp}</p>
                    <p class="presets">Presets: ${preset1} / ${preset2}</p>
                </div>
                <div class="slot-actions">
                    <button class="save-button" data-slot-index="${index}">Save</button>
                    <button class="load-button" data-slot-index="${index}" ${isEmpty ? 'disabled' : ''}>Load</button>
                    <button class="copy-button" data-slot-index="${index}" ${isEmpty ? 'disabled' : ''}>Copy</button>
                    <button class="delete-button" data-slot-index="${index}" ${isEmpty ? 'disabled' : ''}>Delete</button>
                </div>
            `;
            saveSlotsContainer.appendChild(slotEl);
        });
    };

    // Event delegation for save slots container
    saveSlotsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const slotIndex = parseInt(target.dataset.slotIndex, 10);

        if (target.classList.contains('save-button')) {
            saveGame(slotIndex);
        } else if (target.classList.contains('load-button')) {
            loadGame(slotIndex);
        } else if (target.classList.contains('delete-button')) {
            deleteGame(slotIndex);
        } else if (target.classList.contains('copy-button')) {
            copyGame(slotIndex);
        }
    });

    // Handler for editing save slot names
    saveSlotsContainer.addEventListener('change', (e) => {
        const target = e.target;
        if (target.classList.contains('save-name-input')) {
            const slotIndex = parseInt(target.dataset.slotIndex, 10);
            const newName = target.value.trim();
            if (newName) {
                const saveSlots = getSaveSlots();
                if (!saveSlots[slotIndex]) {
                     saveSlots[slotIndex] = {}; // Initialize if it was empty
                }
                saveSlots[slotIndex].name = newName;
                localStorage.setItem('saveSlots', JSON.stringify(saveSlots));
                // No need to re-render, just update the data
            } else {
                // If the name is cleared, revert to the original value
                const saveSlots = getSaveSlots();
                target.value = saveSlots[slotIndex] ? saveSlots[slotIndex].name : `Save Slot ${slotIndex + 1}`;
            }
        }
    });


    // 3. Settings Changes
    fontSelect.addEventListener('change', () => {
        body.style.fontFamily = fontSelect.value;
        saveSettings();
    });

    themeSelect.addEventListener('change', () => {
        applyTheme(themeSelect.value);
        saveSettings();
    });

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

    // --- Initialize Stats with Placeholder Values ---
    const stats = [
        'stat-vitality', 'stat-will', 'stat-nba', 'stat-awareness',
        'stat-socialpressure', 'stat-grace', 'stat-danger',
        'stat-friendship', 'stat-attraction', 'stat-temperature'
    ];

    stats.forEach(stat => {
        const randomValue = Math.floor(Math.random() * 101);
        updateStatBar(stat, randomValue);
    });
});

// --- Stats UI ---

function updateStatBar(statId, value) {
    const statBar = document.getElementById(statId);
    if (statBar) {
        const barFill = statBar.querySelector('.bar-fill');
        if (barFill) {
            const percentage = Math.max(0, Math.min(100, value)); // Clamp value between 0 and 100
            if (statBar.classList.contains('vertical')) {
                barFill.style.height = `${percentage}%`;
            } else {
                barFill.style.width = `${percentage}%`;
            }
        }
    }
}
