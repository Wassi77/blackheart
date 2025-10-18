document.addEventListener('DOMContentLoaded', () => {
    const previousDisplay = document.querySelector('[data-previous]');
    const currentDisplay = document.querySelector('[data-current]');
    const buttons = document.querySelectorAll('.buttons button');

    let currentValue = '0';
    let previousValue = null;
    let operator = null;
    let operatorSymbol = null;
    let overwrite = false;
    let isErrorState = false;

    const MAX_DIGITS = 12;

    function updateDisplay() {
        currentDisplay.textContent = currentValue;
        currentDisplay.classList.toggle('display__current--error', isErrorState);

        if (previousValue !== null && operatorSymbol) {
            previousDisplay.textContent = `${previousValue} ${operatorSymbol}`;
        } else {
            previousDisplay.textContent = '\u00A0';
        }
    }

    function resetAll() {
        currentValue = '0';
        previousValue = null;
        operator = null;
        operatorSymbol = null;
        overwrite = false;
        isErrorState = false;
        updateDisplay();
    }

    function setError(message) {
        currentValue = message;
        previousValue = null;
        operator = null;
        operatorSymbol = null;
        overwrite = true;
        isErrorState = true;
        updateDisplay();
    }

    function sanitizeValue(value) {
        return value.endsWith('.') ? value.slice(0, -1) : value;
    }

    function normalizeOperator(symbol) {
        switch (symbol) {
            case '×':
                return '*';
            case '÷':
                return '/';
            case '−':
                return '-';
            default:
                return symbol;
        }
    }

    function computeResult() {
        if (!operator || previousValue === null) {
            return null;
        }

        const previousNumber = parseFloat(previousValue);
        const currentNumber = parseFloat(currentValue);

        if (Number.isNaN(previousNumber) || Number.isNaN(currentNumber)) {
            return null;
        }

        let result;

        switch (operator) {
            case '+':
                result = previousNumber + currentNumber;
                break;
            case '-':
                result = previousNumber - currentNumber;
                break;
            case '*':
                result = previousNumber * currentNumber;
                break;
            case '/':
                if (currentNumber === 0) {
                    setError('Error');
                    return null;
                }
                result = previousNumber / currentNumber;
                break;
            default:
                return null;
        }

        if (!Number.isFinite(result)) {
            setError('Error');
            return null;
        }

        const normalizedResult = Number(result.toPrecision(12));
        currentValue = normalizedResult.toString();
        previousValue = null;
        operator = null;
        operatorSymbol = null;
        overwrite = true;
        isErrorState = false;
        updateDisplay();

        return normalizedResult;
    }

    function inputDigit(digit) {
        if (isErrorState) {
            resetAll();
        }

        if (overwrite) {
            currentValue = digit;
            overwrite = false;
            updateDisplay();
            return;
        }

        if (currentValue === '0') {
            if (digit === '0') {
                updateDisplay();
                return;
            }
            currentValue = digit;
        } else if (currentValue === '-0') {
            currentValue = `-${digit}`;
        } else {
            const digitCount = currentValue.replace('-', '').replace('.', '').length;
            if (digitCount >= MAX_DIGITS) {
                return;
            }
            currentValue += digit;
        }

        updateDisplay();
    }

    function inputDecimal() {
        if (isErrorState) {
            resetAll();
        }

        if (overwrite) {
            currentValue = '0.';
            overwrite = false;
            updateDisplay();
            return;
        }

        if (!currentValue.includes('.')) {
            currentValue += '.';
            updateDisplay();
        }
    }

    function setOperator(symbol) {
        if (isErrorState) {
            resetAll();
        }

        const normalizedOperator = normalizeOperator(symbol);

        if (operator && !overwrite) {
            computeResult();
            if (isErrorState) {
                return;
            }
        }

        currentValue = sanitizeValue(currentValue);
        previousValue = currentValue;
        operator = normalizedOperator;
        operatorSymbol = symbol;
        overwrite = true;
        isErrorState = false;
        updateDisplay();
    }

    function handleBackspace() {
        if (isErrorState) {
            resetAll();
            return;
        }

        if (overwrite) {
            currentValue = '0';
            overwrite = false;
            updateDisplay();
            return;
        }

        if (currentValue.length <= 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
            currentValue = '0';
        } else {
            currentValue = currentValue.slice(0, -1);
        }

        updateDisplay();
    }

    function convertToPercent() {
        if (isErrorState) {
            resetAll();
            return;
        }

        const numericValue = parseFloat(currentValue);

        if (Number.isNaN(numericValue)) {
            return;
        }

        const percentValue = Number((numericValue / 100).toPrecision(12));
        currentValue = percentValue.toString();
        overwrite = false;
        updateDisplay();
    }

    function handleEquals() {
        if (isErrorState) {
            resetAll();
            return;
        }

        if (!operator || previousValue === null || overwrite) {
            return;
        }

        computeResult();
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const { digit } = button.dataset;
            const action = button.dataset.action;

            if (digit !== undefined) {
                inputDigit(digit);
                return;
            }

            switch (action) {
                case 'decimal':
                    inputDecimal();
                    break;
                case 'clear':
                    resetAll();
                    break;
                case 'backspace':
                    handleBackspace();
                    break;
                case 'percent':
                    convertToPercent();
                    break;
                case 'operator':
                    setOperator(button.dataset.operator);
                    break;
                case 'equals':
                    handleEquals();
                    break;
                default:
                    break;
            }
        });
    });

    updateDisplay();
});
