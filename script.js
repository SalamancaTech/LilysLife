document.addEventListener('DOMContentLoaded', () => {
    // Main Menu and Settings Elements
    const menuButton = document.getElementById('menu-button');
    const body = document.body;
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModule = document.getElementById('settings_module');

    // Font Switching Elements
    const fontSelect = document.getElementById('font-select');

    // API Key Section Elements
    const apiKeyInput = document.getElementById('api-key-input');
    const toggleApiKeyVisibilityButton = document.getElementById('toggle-api-key-visibility');
    const apiKeyStorageToggle = document.getElementById('api-key-storage-toggle');
    const storageStatus = document.getElementById('storage-status');
    const applyApiKeyButton = document.getElementById('apply-api-key');
    const clearApiKeyButton = document.getElementById('clear-api-key');

    // --- Event Listeners ---

    // 1. Menu Toggle Functionality
    menuButton.addEventListener('click', () => {
        const isOpen = body.classList.contains('menu-open');
        body.classList.toggle('menu-open');

        // If the menu is closing, also close the settings module
        if (isOpen) {
            settingsModule.classList.remove('active');
        }
    });

    // 2. Settings Module Toggle
    settingsIcon.addEventListener('click', () => {
        settingsModule.classList.toggle('active');
    });

    // 3. Font Switching Functionality
    fontSelect.addEventListener('change', (event) => {
        body.style.fontFamily = event.target.value;
    });

    // 4. API Key Visibility Toggle
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
        const apiKey = apiKeyInput.value;
        if (apiKeyStorageToggle.checked) { // "Saved"
            localStorage.setItem('geminiApiKey', apiKey);
            sessionStorage.removeItem('geminiApiKey');
        } else { // "Unsaved"
            sessionStorage.setItem('geminiApiKey', apiKey);
            localStorage.removeItem('geminiApiKey');
        }
        alert('API Key applied!');
    });

    // 7. Clear API Key
    clearApiKeyButton.addEventListener('click', () => {
        localStorage.removeItem('geminiApiKey');
        sessionStorage.removeItem('geminiApiKey');
        apiKeyInput.value = '';
        apiKeyStorageToggle.checked = false;
        storageStatus.textContent = 'Unsaved';
        alert('API Key cleared!');
    });

    // --- Initial Page Load Logic ---

    // Load API key from storage and set the toggle state
    const localKey = localStorage.getItem('geminiApiKey');
    const sessionKey = sessionStorage.getItem('geminiApiKey');

    if (localKey) {
        apiKeyInput.value = localKey;
        apiKeyStorageToggle.checked = true;
        storageStatus.textContent = 'Saved';
    } else if (sessionKey) {
        apiKeyInput.value = sessionKey;
        apiKeyStorageToggle.checked = false;
        storageStatus.textContent = 'Unsaved';
    }
});
