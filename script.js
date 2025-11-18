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

    // --- Intent Matrix ---
    const intentCircle = document.getElementById('intent-circle');
    const submitButton = document.getElementById('intent-submit-button');
    const sliderLabels = document.querySelectorAll('.slider-labels span');
    const sliderIndicator = document.querySelector('.slider-indicator');

    let selectedCircleOption = null;
    let selectedSliderOption = 'Neutral';

    const circleOptions = [
        { id: 'matrix_first_question', label: 'Question' },
        { id: 'matrix_first_request', label: 'Request' },
        { id: 'matrix_first_confess', label: 'Confess' },
        { id: 'matrix_first_praise', label: 'Praise' },
        { id: 'matrix_first_act', label: 'Act' },
        { id: 'matrix_first_challenge', label: 'Challenge' },
        { id: 'matrix_first_lie', label: 'Lie' }
    ];

    const generateCircle = () => {
        const numSegments = circleOptions.length;
        const angleStep = 360 / numSegments;
        const centerX = 100;
        const centerY = 100;
        const radius = 95;

        const toRadians = (angle) => angle * (Math.PI / 180);

        const getCoordinates = (angle) => {
            return {
                x: centerX + radius * Math.cos(toRadians(angle - 90)),
                y: centerY + radius * Math.sin(toRadians(angle - 90))
            };
        };

        for (let i = 0; i < numSegments; i++) {
            const startAngle = i * angleStep;
            const endAngle = (i + 1) * angleStep;

            const start = getCoordinates(startAngle);
            const end = getCoordinates(endAngle);

            const largeArcFlag = angleStep <= 180 ? '0' : '1';

            const d = [
                `M ${centerX},${centerY}`,
                `L ${start.x},${start.y}`,
                `A ${radius},${radius} 0 ${largeArcFlag} 1 ${end.x},${end.y}`,
                'Z'
            ].join(' ');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('class', 'segment');
            path.setAttribute('id', circleOptions[i].id);
            intentCircle.appendChild(path);

            const textAngle = startAngle + angleStep / 2;
            const textRadius = radius * 0.7;
            const textX = centerX + textRadius * Math.cos(toRadians(textAngle - 90));
            const textY = centerY + textRadius * Math.sin(toRadians(textAngle - 90));

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textX);
            text.setAttribute('y', textY);
            text.setAttribute('class', 'segment-label');
            text.setAttribute('dy', '0.35em'); // Vertically center
            text.textContent = circleOptions[i].label;
            intentCircle.appendChild(text);
        }
    };

    const resetIntentMatrix = () => {
        if (selectedCircleOption) {
            document.getElementById(selectedCircleOption).classList.remove('selected');
        }
        selectedCircleOption = null;
        selectedSliderOption = 'Neutral';

        sliderLabels.forEach(l => l.classList.remove('selected-label'));

        const firstLabel = sliderLabels[0];
        firstLabel.classList.add('selected-label');

        const indicatorHeight = sliderIndicator.offsetHeight;
        const newTop = firstLabel.offsetTop + (firstLabel.offsetHeight / 2) - (indicatorHeight / 2);
        sliderIndicator.style.top = `${newTop}px`;
    };

    intentCircle.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('segment')) {
            if (selectedCircleOption) {
                document.getElementById(selectedCircleOption).classList.remove('selected');
            }
            target.classList.add('selected');
            selectedCircleOption = target.id;
        }
    });

    sliderLabels.forEach((label, index) => {
        label.addEventListener('click', () => {
            sliderLabels.forEach(l => l.classList.remove('selected-label'));
            label.classList.add('selected-label');
            selectedSliderOption = label.textContent;
            const indicatorHeight = sliderIndicator.offsetHeight;
            // Calculate the position to center the indicator on the label
            const newTop = label.offsetTop + (label.offsetHeight / 2) - (indicatorHeight / 2);
            sliderIndicator.style.top = `${newTop}px`;
        });
    });

    let isDragging = false;

    sliderIndicator.addEventListener('mousedown', (e) => {
        isDragging = true;
        sliderIndicator.style.transition = 'none'; // Disable transition during drag for immediate feedback
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            sliderIndicator.style.transition = 'top 0.3s ease'; // Re-enable transition

            const indicatorRect = sliderIndicator.getBoundingClientRect();
            const indicatorCenter = indicatorRect.top + (indicatorRect.height / 2);

            let closestLabel = null;
            let minDistance = Infinity;

            sliderLabels.forEach(label => {
                const labelRect = label.getBoundingClientRect();
                const labelCenter = labelRect.top + (labelRect.height / 2);
                const distance = Math.abs(indicatorCenter - labelCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestLabel = label;
                }
            });

            if (closestLabel) {
                sliderLabels.forEach(l => l.classList.remove('selected-label'));
                closestLabel.classList.add('selected-label');
                selectedSliderOption = closestLabel.textContent;
                const indicatorHeight = sliderIndicator.offsetHeight;
                const newTop = closestLabel.offsetTop + (closestLabel.offsetHeight / 2) - (indicatorHeight / 2);
                sliderIndicator.style.top = `${newTop}px`;
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const sliderTrack = document.querySelector('.slider-track');
        const trackRect = sliderTrack.getBoundingClientRect();
        const indicatorHeight = sliderIndicator.offsetHeight;

        // Calculate the new top position relative to the track
        let newTop = e.clientY - trackRect.top - (indicatorHeight / 2);

        // Constrain the movement within the track boundaries
        const minTop = 0 - (indicatorHeight / 2) + (sliderLabels[0].offsetHeight / 2);
        const maxTop = trackRect.height - (indicatorHeight / 2) - (sliderLabels[sliderLabels.length - 1].offsetHeight / 2);

        newTop = Math.max(minTop, Math.min(newTop, maxTop));

        sliderIndicator.style.top = `${newTop}px`;
    });

    submitButton.addEventListener('click', () => {
        if (!selectedCircleOption) {
            alert('Please select an option from the circle.');
            return;
        }
        const circleValue = selectedCircleOption.replace('matrix_first_', '');
        const intent = `${circleValue}-${selectedSliderOption}`;
        console.log('Intent Submitted:', intent);
        alert(`Intent Submitted: ${intent}`); // For visual feedback
        // Here you would send the 'intent' to the API
        resetIntentMatrix();
    });

    // Initial setup
    generateCircle();
    // Set initial slider position
    // We need a small delay to ensure elements have been rendered and have dimensions
    setTimeout(() => {
        resetIntentMatrix();
    }, 100);
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

// --- Initialize Stats with Placeholder Values ---
document.addEventListener('DOMContentLoaded', () => {
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
