document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const charsPerTokenInput = document.getElementById('chars-per-token');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result');
    const tokenDisplayArea = document.getElementById('token-display-area');
    const tokensContainer = document.getElementById('tokens-container');

    // Add loading state to button
    function setLoadingState(isLoading) {
        const button = calculateBtn;
        if (isLoading) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            button.disabled = true;
        } else {
            button.innerHTML = '<i class="fas fa-magic"></i> Analyze Tokens';
            button.disabled = false;
        }
    }

    // Clear empty state when tokens are generated
    function clearEmptyState() {
        const emptyState = tokensContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }

    // Add character counter
    function updateCharacterCount() {
        const text = textInput.value;
        const charCount = text.length;
        
        // Update placeholder or add character counter
        if (charCount > 0) {
            textInput.setAttribute('data-char-count', `${charCount} characters`);
        } else {
            textInput.removeAttribute('data-char-count');
        }
    }

    // Enhanced token calculation with better UX
    calculateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        const charsPerToken = parseInt(charsPerTokenInput.value, 10);

        // Clear previous results
        tokensContainer.innerHTML = '';
        resultDisplay.textContent = '0';

        if (text === '' || isNaN(charsPerToken) || charsPerToken <= 0) {
            tokenDisplayArea.style.display = 'none';
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const tokenCount = Math.ceil(text.length / charsPerToken);
        resultDisplay.textContent = tokenCount;

        // Clear empty state
        clearEmptyState();

        // Generate and display tokens with staggered animation
        for (let i = 0; i < text.length; i += charsPerToken) {
            const tokenText = text.substring(i, i + charsPerToken);
            const tokenElement = document.createElement('div');
            tokenElement.classList.add('token');
            tokenElement.textContent = tokenText;
            
            // Add staggered animation delay
            const delay = (i / charsPerToken) * 0.05; // 50ms between each token
            tokenElement.style.animationDelay = `${delay}s`;
            
            tokensContainer.appendChild(tokenElement);
        }

        // Show the token display area with smooth animation
        tokenDisplayArea.style.display = 'block';
        tokenDisplayArea.style.opacity = '0';
        tokenDisplayArea.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            tokenDisplayArea.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            tokenDisplayArea.style.opacity = '1';
            tokenDisplayArea.style.transform = 'translateY(0)';
        }, 100);

        // Reset loading state
        setLoadingState(false);
    });

    // Add real-time character counting
    textInput.addEventListener('input', updateCharacterCount);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateBtn.click();
        }
    });

    // Add input validation
    charsPerTokenInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value, 10);
        if (value < 1) {
            e.target.value = 1;
        } else if (value > 10) {
            e.target.value = 10;
        }
    });

    // Add focus effects
    textInput.addEventListener('focus', () => {
        textInput.parentElement.style.transform = 'scale(1.02)';
    });

    textInput.addEventListener('blur', () => {
        textInput.parentElement.style.transform = 'scale(1)';
    });

    // Initially hide the token display area
    tokenDisplayArea.style.display = 'none';
    
    // Add some sample text for demonstration
    const sampleText = "This is a sample text to demonstrate the beautiful token counter interface. You can replace this with your own text to analyze token distribution.";
    textInput.placeholder = sampleText;
});