document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const charsPerTokenInput = document.getElementById('chars-per-token');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result');
    const tokenDisplayArea = document.getElementById('token-display-area');
    const tokensContainer = document.getElementById('tokens-container');

    calculateBtn.addEventListener('click', () => {
        const text = textInput.value;
        const charsPerToken = parseInt(charsPerTokenInput.value, 10);

        // Clear previous results
        tokensContainer.innerHTML = '';
        resultDisplay.textContent = '0';

        if (text.trim() === '' || isNaN(charsPerToken) || charsPerToken <= 0) {
            tokenDisplayArea.style.display = 'none';
            return;
        }

        const tokenCount = Math.ceil(text.length / charsPerToken);
        resultDisplay.textContent = tokenCount;

        // Generate and display tokens
        for (let i = 0; i < text.length; i += charsPerToken) {
            const tokenText = text.substring(i, i + charsPerToken);
            const tokenElement = document.createElement('div');
            tokenElement.classList.add('token');
            tokenElement.textContent = tokenText;
            // Stagger the animation
            tokenElement.style.animationDelay = `${i * 0.02}s`;
            tokensContainer.appendChild(tokenElement);
        }

        tokenDisplayArea.style.display = 'block';
    });

    // Initially hide the token display area
    tokenDisplayArea.style.display = 'none';
});