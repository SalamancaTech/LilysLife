document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const body = document.body;
    const fontSelect = document.getElementById('font-select');
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModule = document.getElementById('settings_module');

    // Menu toggle functionality
    menuButton.addEventListener('click', () => {
        body.classList.toggle('menu-open');
    });

    // Settings module toggle
    settingsIcon.addEventListener('click', () => {
        settingsModule.classList.toggle('active');
    });

    // Font switching functionality
    fontSelect.addEventListener('change', (event) => {
        body.style.fontFamily = event.target.value;
    });
});
