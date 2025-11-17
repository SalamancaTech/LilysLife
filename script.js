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
    const saveApiKeyButton = document.getElementById('save-api-key');
    const clearApiKeyButton = document.getElementById('clear-api-key');

    // --- Event Listeners ---

    // 1. Menu Toggle Functionality
    menuButton.addEventListener('click', () => {
        body.classList.toggle('menu-open');
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

    // 5. Save API Key
    saveApiKeyButton.addEventListener('click', () => {
        const storageOption = document.querySelector('input[name="storage-option"]:checked').value;
        const apiKey = apiKeyInput.value;

        if (storageOption === 'local') {
            localStorage.setItem('geminiApiKey', apiKey);
            sessionStorage.removeItem('geminiApiKey'); // Clear session storage if local is chosen
        } else { // 'session'
            sessionStorage.setItem('geminiApiKey', apiKey);
            localStorage.removeItem('geminiApiKey'); // Clear local storage if session is chosen
        }
        alert('API Key saved!');
    });

    // 6. Clear API Key
    clearApiKeyButton.addEventListener('click', () => {
        localStorage.removeItem('geminiApiKey');
        sessionStorage.removeItem('geminiApiKey');
        apiKeyInput.value = '';
        alert('API Key cleared!');
    });

    // --- Initial Page Load Logic ---

    // Load API key from storage if it exists
    const savedKey = localStorage.getItem('geminiApiKey') || sessionStorage.getItem('geminiApiKey');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});
